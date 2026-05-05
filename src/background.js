const DEFAULT_API_CONFIG = {
  mode: "openai-compatible",
  baseUrl: "https://api.openai.com/v1",
  endpointPath: "/chat/completions",
  apiKey: "",
  model: "your-model-name",
  useJsonResponseFormat: false,
  extraHeadersJson: "{}",
  customUrl: "",
  customMethod: "POST",
  customHeadersJson: "{}",
  customBodyTemplate:
    '{\n  "model": {{modelJson}},\n  "messages": {{messagesJson}},\n  "temperature": 0\n}',
  customResponsePath: "choices.0.message.content"
};

const PROFILE_SCHEMA_VERSION = 2;
const DEFAULT_PROFILE_V2 = {
  schemaVersion: PROFILE_SCHEMA_VERSION,
  updatedAt: "",
  sections: {},
  customSections: []
};

const STORAGE_KEYS = {
  profileV2: "profileV2",
  apiConfig: "apiConfig"
};

const ASSISTANT_STATE_KEY = "AI_RESUME_ASSISTANT_STATE";
const MAX_ASSISTANT_STATE_ITEMS = 20;

chrome.runtime.onInstalled.addListener(async () => {
  const existing = await chrome.storage.local.get([
    STORAGE_KEYS.profileV2,
    STORAGE_KEYS.apiConfig
  ]);
  const next = {};

  if (!existing[STORAGE_KEYS.profileV2]) {
    next[STORAGE_KEYS.profileV2] = DEFAULT_PROFILE_V2;
  }

  if (!existing[STORAGE_KEYS.apiConfig]) {
    next[STORAGE_KEYS.apiConfig] = DEFAULT_API_CONFIG;
  }

  if (Object.keys(next).length > 0) {
    await chrome.storage.local.set(next);
  }
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (!message || typeof message.type !== "string" || !message.type.startsWith("AI_RESUME_")) {
    return undefined;
  }

  handleMessage(message)
    .then((data) => sendResponse({ ok: true, data }))
    .catch((error) => {
      sendResponse({
        ok: false,
        error: error instanceof Error ? error.message : String(error)
      });
    });

  return true;
});

async function handleMessage(message) {
  switch (message.type) {
    case "AI_RESUME_GET_SETTINGS":
      return getSettings();
    case "AI_RESUME_OPEN_OPTIONS":
      await chrome.runtime.openOptionsPage();
      return {};
    case "AI_RESUME_SAVE_SETTINGS":
      return saveSettings(message.payload || {});
    case "AI_RESUME_CLEAR_SETTINGS":
      return clearSettings();
    case "AI_RESUME_MAP_FIELDS":
      return mapFields(message.payload || {});
    case "AI_RESUME_ANALYZE_PAGE_STRUCTURE":
      return analyzePageStructure(message.payload || {});
    case "AI_RESUME_SAVE_ASSISTANT_STATE":
      return saveAssistantState(message.payload || {});
    case "AI_RESUME_GET_ASSISTANT_STATE":
      return getAssistantState(message.payload || {});
    case "AI_RESUME_LIST_MODELS":
      return listModels(message.payload || {});
    case "AI_RESUME_TEST_CONNECTION":
      return testApi(message.payload || {});
    default:
      throw new Error(`Unknown message type: ${message.type}`);
  }
}

async function getSettings() {
  const values = await chrome.storage.local.get([
    STORAGE_KEYS.profileV2,
    STORAGE_KEYS.apiConfig
  ]);
  return {
    profileV2: normalizeProfileV2(values[STORAGE_KEYS.profileV2] || DEFAULT_PROFILE_V2),
    apiConfig: { ...DEFAULT_API_CONFIG, ...(values[STORAGE_KEYS.apiConfig] || {}) },
    defaults: {
      profileV2: DEFAULT_PROFILE_V2,
      apiConfig: DEFAULT_API_CONFIG
    }
  };
}

async function saveSettings(payload) {
  const next = {};

  if (payload.profileV2) {
    next[STORAGE_KEYS.profileV2] = normalizeProfileV2(payload.profileV2);
  }

  if (payload.apiConfig) {
    next[STORAGE_KEYS.apiConfig] = { ...DEFAULT_API_CONFIG, ...payload.apiConfig };
  }

  await chrome.storage.local.set(next);
  return { saved: Object.keys(next) };
}

async function clearSettings() {
  await chrome.storage.local.clear();
  return { cleared: true };
}

async function saveAssistantState(payload) {
  const pageKey = normalizeAssistantStateKey(payload.pageKey || "");
  if (!pageKey || !chrome.storage.session) {
    return { saved: false };
  }

  const patch = isPlainObject(payload.patch) ? payload.patch : {};
  const result = await chrome.storage.session.get(ASSISTANT_STATE_KEY);
  const allStates = result[ASSISTANT_STATE_KEY] || {};
  allStates[pageKey] = {
    ...(allStates[pageKey] || {}),
    pageKey,
    ...patch,
    updatedAt: Date.now()
  };

  const entries = Object.entries(allStates)
    .sort((left, right) => Number(right[1]?.updatedAt || 0) - Number(left[1]?.updatedAt || 0))
    .slice(0, MAX_ASSISTANT_STATE_ITEMS);
  await chrome.storage.session.set({ [ASSISTANT_STATE_KEY]: Object.fromEntries(entries) });
  return { saved: true };
}

async function getAssistantState(payload) {
  const pageKey = normalizeAssistantStateKey(payload.pageKey || "");
  if (!pageKey || !chrome.storage.session) {
    return null;
  }

  const result = await chrome.storage.session.get(ASSISTANT_STATE_KEY);
  return result[ASSISTANT_STATE_KEY]?.[pageKey] || null;
}

function normalizeAssistantStateKey(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 800);
}

async function mapFields(payload) {
  const { scan } = payload;
  if (!scan || !Array.isArray(scan.fields)) {
    throw new Error("Missing scan result. Scan the current form first.");
  }

  const settings = await getSettings();
  const apiConfig = { ...settings.apiConfig, ...(payload.apiConfig || {}) };
  const profileCatalog = normalizeProvidedProfileCatalog(payload.profileCatalog);
  if (!profileCatalog) {
    throw new Error("Missing profile field catalog.");
  }

  const compactScan = {
    url: scan.url,
    hostname: scan.hostname,
    title: scan.title,
    fields: scan.fields.map(compactField)
  };

  const messages = buildMessages(profileCatalog, compactScan);
  const rawContent = await callAi(apiConfig, messages, {
    profile: profileCatalog,
    profileCatalog,
    scan: compactScan
  });
  const parsed = parseJsonFromText(rawContent);
  const mappings = annotateMappingsWithCatalog(normalizeAiMappings(parsed, compactScan.fields), profileCatalog);
  return {
    mappings,
    notes: Array.isArray(parsed?.notes) ? parsed.notes : [],
    raw: parsed
  };
}

async function analyzePageStructure(payload) {
  const { scan } = payload;
  if (!scan || !Array.isArray(scan.fields)) {
    throw new Error("Missing scan result. Scan the current form first.");
  }

  const settings = await getSettings();
  const apiConfig = { ...settings.apiConfig, ...(payload.apiConfig || {}) };
  const compactScan = {
    url: scan.url,
    hostname: scan.hostname,
    title: scan.title,
    siteAdapter: scan.siteAdapter || null,
    fields: scan.fields.map(compactField)
  };

  const messages = buildPageStructureMessages(compactScan);
  const rawContent = await callAi(apiConfig, messages, {
    profile: { fields: [] },
    profileCatalog: { fields: [] },
    scan: compactScan
  });
  const parsed = parseJsonFromText(rawContent);
  return normalizePageStructureAnalysis(parsed, compactScan.fields);
}

async function testApi(payload) {
  const settings = await getSettings();
  const apiConfig = { ...settings.apiConfig, ...(payload.apiConfig || {}) };
  const fakeProfile = {
    sections: [
      {
        key: "basic",
        title: "基本信息",
        fields: [
          {
            path: "profileV2.sections.basic.values[0]",
            label: "基本信息 / 姓名",
            aliases: ["姓名", "真实姓名", "基本信息"]
          }
        ]
      }
    ],
    fields: [
      {
        path: "profileV2.sections.basic.values[0]",
        label: "基本信息 / 姓名",
        aliases: ["姓名", "真实姓名", "基本信息"]
      }
    ]
  };
  const fakeScan = {
    url: "https://example.test/job",
    hostname: "example.test",
    title: "Test Form",
    fields: [
      {
        fieldId: "test_name",
        type: "text",
        label: "姓名",
        placeholder: "",
        required: true,
        section: "基本信息",
        nearbyText: "基本信息 姓名",
        options: []
      }
    ]
  };
  const messages = buildMessages(fakeProfile, fakeScan);
  const rawContent = await callAi(apiConfig, messages, {
    profile: fakeProfile,
    profileCatalog: fakeProfile,
    scan: fakeScan
  });
  const parsed = parseJsonFromText(rawContent);
  return {
    parsed,
    contentPreview: typeof rawContent === "string" ? rawContent.slice(0, 800) : String(rawContent).slice(0, 800)
  };
}

async function listModels(payload) {
  const settings = await getSettings();
  const apiConfig = { ...settings.apiConfig, ...(payload.apiConfig || {}) };
  const url = resolveModelListUrl(apiConfig);
  if (!url) {
    throw new Error(apiConfig.mode === "custom" ? "Custom API URL is required." : "API base URL is required.");
  }

  const headers = buildRequestHeaders({
    apiConfig,
    headerJson: apiConfig.mode === "custom" ? apiConfig.customHeadersJson : apiConfig.extraHeadersJson,
    includeContentType: false
  });

  const response = await fetch(url, {
    method: "GET",
    headers
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Model list request failed ${response.status}: ${text.slice(0, 500)}`);
  }

  const data = safeJsonParse(text);
  const source = extractModelListSource(data);
  const models = normalizeModelList(source);

  return {
    url,
    models
  };
}

function compactField(field) {
  return {
    fieldId: field.fieldId,
    type: field.type,
    label: sanitizePromptText(field.label, 220),
    placeholder: sanitizePromptText(field.placeholder, 160),
    name: sanitizeAttributeText(field.name),
    id: sanitizeAttributeText(field.id),
    required: field.required,
    disabled: field.disabled,
    readOnly: field.readOnly,
    canFill: field.canFill,
    section: sanitizePromptText(field.section, 220),
    nearbyText: sanitizePromptText(field.nearbyText, 420),
    cssPath: sanitizeAttributeText(field.cssPath),
    siteAdapterId: sanitizeAttributeText(field.siteAdapterId),
    siteAdapterName: sanitizePromptText(field.siteAdapterName, 120),
    hasCurrentValue: Boolean(field.hasCurrentValue),
    options: Array.isArray(field.options) ? field.options.slice(0, 50).map(compactOption) : []
  };
}

function compactOption(option) {
  return {
    value: sanitizePromptText(option?.value, 120),
    label: sanitizePromptText(option?.label, 120)
  };
}

function normalizeProvidedProfileCatalog(profileCatalog) {
  if (!isPlainObject(profileCatalog) || !Array.isArray(profileCatalog.fields)) {
    return null;
  }

  const fields = profileCatalog.fields
    .map((field) => ({
      path: sanitizeAttributeText(field?.path || ""),
      label: sanitizePromptText(field?.label || "", 180),
      aliases: Array.isArray(field?.aliases)
        ? field.aliases.map((alias) => sanitizePromptText(alias, 120)).filter(Boolean).slice(0, 12)
        : []
    }))
    .filter((field) => field.path && field.label)
    .slice(0, 300);

  const sections = Array.isArray(profileCatalog.sections)
    ? profileCatalog.sections
        .map((section) => {
          const sectionFields = Array.isArray(section?.fields)
            ? section.fields
                .map((field) => fields.find((item) => item.path === sanitizeAttributeText(field?.path || "")))
                .filter(Boolean)
            : [];

          return {
            key: sanitizeAttributeText(section?.key || ""),
            title: sanitizePromptText(section?.title || "", 120),
            fields: sectionFields
          };
        })
        .filter((section) => section.title && section.fields.length > 0)
    : [];

  return {
    sections,
    fields
  };
}

function sanitizeAttributeText(value) {
  return sanitizePromptText(value, 120);
}

function sanitizePromptText(value, maxLength = 220) {
  const text = String(value || "")
    .replace(/\s+/g, " ")
    .replace(/\u00a0/g, " ")
    .trim();
  return redactPersonalValues(text, maxLength);
}

function isPlainObject(value) {
  return Object.prototype.toString.call(value) === "[object Object]";
}

function normalizeProfileV2(profileV2) {
  if (!isPlainObject(profileV2)) {
    return DEFAULT_PROFILE_V2;
  }

  const sections = isPlainObject(profileV2.sections) ? profileV2.sections : {};
  const normalizedSections = {};
  for (const [key, section] of Object.entries(sections)) {
    if (!isPlainObject(section)) {
      continue;
    }
    const cleanKey = sanitizeAttributeText(key || section.key || "");
    const title = sanitizePromptText(section.title || cleanKey, 120);
    if (!cleanKey || !title) {
      continue;
    }

    normalizedSections[cleanKey] = section.kind === "repeat"
      ? {
          key: cleanKey,
          title,
          kind: "repeat",
          items: Array.isArray(section.items)
            ? section.items.map(normalizeProfileV2Item).filter((item) => Object.keys(item.values).length > 0 || item.custom.length > 0)
            : []
        }
      : {
          key: cleanKey,
          title,
          kind: "simple",
          values: normalizeProfileV2Values(section.values),
          custom: normalizeProfileV2CustomRows(section.custom)
        };
  }

  return {
    schemaVersion: PROFILE_SCHEMA_VERSION,
    updatedAt: sanitizePromptText(profileV2.updatedAt || "", 80),
    sections: normalizedSections,
    customSections: Array.isArray(profileV2.customSections)
      ? profileV2.customSections.map(normalizeProfileV2CustomSection).filter((section) => Object.keys(section.values).length > 0 || section.custom.length > 0)
      : []
  };
}

function normalizeProfileV2Item(item = {}) {
  return {
    title: sanitizePromptText(item.title || "", 120),
    values: normalizeProfileV2Values(item.values),
    custom: normalizeProfileV2CustomRows(item.custom)
  };
}

function normalizeProfileV2CustomSection(section = {}) {
  return {
    key: sanitizeAttributeText(section.key || "custom"),
    title: sanitizePromptText(section.title || "自定义资料", 120),
    kind: "simple",
    values: normalizeProfileV2Values(section.values),
    custom: normalizeProfileV2CustomRows(section.custom)
  };
}

function normalizeProfileV2Values(values) {
  const normalized = {};
  if (!isPlainObject(values)) {
    return normalized;
  }

  for (const [label, value] of Object.entries(values)) {
    const cleanLabel = sanitizePromptText(label, 120);
    const cleanValue = String(value == null ? "" : value).trim();
    if (cleanLabel && cleanValue) {
      normalized[cleanLabel] = cleanValue;
    }
  }
  return normalized;
}

function normalizeProfileV2CustomRows(rows) {
  if (!Array.isArray(rows)) {
    return [];
  }

  return rows
    .map((row) => ({
      label: sanitizePromptText(row?.label || "", 80),
      value: String(row?.value == null ? "" : row.value).trim()
    }))
    .filter((row) => row.label && row.value);
}

function redactPersonalValues(text, maxLength = 220) {
  if (!text) {
    return "";
  }

  const labelPatterns = [
    /((?:姓名|手机号码|手机号|联系电话|电话|电子邮箱|邮箱|邮件|证件号码|身份证号|出生日期|出生时间|毕业院校|专业|学历|学位|工作单位|实习\/实践单位|组织名称|职务|岗位|学校|籍贯|户口|居住地|地址|联系人|证书号|学历证书号|奖惩名称|奖惩单位|奖惩原因|自我评价|招聘信息来源|备注|高考所在地|高考分数|身高|体重|期望年收入|分数)(?:[^:：]{0,8})[：:]\s*)([^|；;，,\n]+)/g,
    /((?:是否[^:：\n]{0,40}[：:]\s*))([^\n]+)/g
  ];

  let redacted = text;
  for (const pattern of labelPatterns) {
    redacted = redacted.replace(pattern, (match, prefix) => {
      return `${prefix}【已隐藏】`;
    });
  }

  redacted = redacted.replace(/\b(?:\d{11}|\d{15,18}[Xx]?)\b/g, "【已隐藏】");
  redacted = redacted.replace(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g, "【已隐藏】");
  redacted = redacted.replace(/\b\d{4,}\b/g, (match) => (match.length >= 6 ? "【已隐藏】" : match));

  return redacted.length > maxLength ? `${redacted.slice(0, maxLength)}...` : redacted;
}

function buildMessages(profileCatalog, scan) {
  const systemPrompt = [
    "You are a form-field mapping engine for job application forms.",
    "Your only task is to map detected web form fields to local resume profile source paths.",
    "Return strict JSON only. Do not include prose or explanations outside JSON.",
    "Privacy rule: you are not given the user's actual resume values, and you must not ask for, infer, copy, or output personal values.",
    "The profile field catalog contains sourcePath names and field labels only. All real values are withheld and will be resolved locally in the browser.",
    "Do not map file upload fields. Do not decide to submit the form.",
    "Prefer sourcePath. Use value only for non-personal constants when no sourcePath applies.",
    "If options are provided for a select/combobox, map to the relevant sourcePath; local code will match the user's value to the page option."
  ].join("\n");

  const userPrompt = [
    "Map fields from the current job application page to the local resume profile field catalog.",
    "",
    "Return JSON with this schema:",
    JSON.stringify(
      {
        mappings: [
          {
            fieldId: "field id from fields list",
            sourcePath: "exact path from local profile field catalog",
            value: "optional non-personal literal only when sourcePath is not enough",
            confidence: 0.95,
            reason: "short reason"
          }
        ],
        notes: ["optional warnings"]
      },
      null,
      2
    ),
    "",
    "Rules:",
    "- Use only fieldId values that exist in fields.",
    "- Set confidence from 0 to 1.",
    "- Required fields deserve careful mapping, but uncertainty must lower confidence.",
    "- For repeated sections like family father/mother or education entries, use section and nearbyText to select the right profile path.",
    "- For Chinese recruitment forms, common mappings include 姓名 -> 姓名, 手机号码 -> 手机号码/电话, 电子邮箱 -> 邮箱/电子邮箱, 毕业院校 -> 学校/毕业院校, 证书名称 -> 证书名称（技能名称）.",
    "- For user-defined fields, inspect customFields.* items by label and key. If a custom field matches, use sourcePath like customFields.basic[0].value.",
    "- For declarations asking yes/no questions, use declarations.* only if the question meaning clearly matches.",
    "- Do not output copied page values, existing field values, names, phone numbers, email addresses, ID numbers, schools, employers, addresses, or experience descriptions.",
    "",
    "Local profile field catalog. Values are intentionally omitted:",
    JSON.stringify(profileCatalog, null, 2),
    "",
    "Detected page fields JSON. Existing field values are intentionally omitted/redacted:",
    JSON.stringify(scan, null, 2)
  ].join("\n");

  return [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt }
  ];
}

function buildPageStructureMessages(scan) {
  const systemPrompt = [
    "You are a page-structure analyzer for job application forms.",
    "Your task is to normalize noisy detected web form metadata into readable form-field hints.",
    "Return strict JSON only. Do not include prose or explanations outside JSON.",
    "Privacy rule: the page may already contain user-entered values in nearby text, so never copy, infer, or output personal values.",
    "Only output structural labels, section names, control kind hints, and short non-sensitive notes.",
    "Do not decide to submit the form and do not map to a resume profile."
  ].join("\n");

  const userPrompt = [
    "Analyze the current job application page fields.",
    "",
    "Return JSON with this schema:",
    JSON.stringify(
      {
        siteType: "generic | zhiye | hotjob | ats | ant-design | element-ui | custom",
        confidence: 0.8,
        fieldHints: [
          {
            fieldId: "field id from fields list",
            label: "normalized visible label, no personal value",
            section: "normalized section name",
            controlKind: "text | textarea | select | search-select | radio | checkbox | date | file | unknown",
            confidence: 0.9,
            note: "short structural note"
          }
        ],
        notes: ["optional warnings"]
      },
      null,
      2
    ),
    "",
    "Rules:",
    "- Use only fieldId values that exist in fields.",
    "- If nearbyText contains a label and value, output only the label.",
    "- Prefer Chinese field labels when the page is Chinese.",
    "- For repeated sections, keep section names such as 基本信息、教育经历、实习经历、项目经历、家庭信息、附加问题.",
    "- If a field is a custom select/search input, set controlKind to search-select or select.",
    "- Do not output names, phone numbers, email addresses, ID numbers, schools, employers, addresses, dates of birth, or experience descriptions.",
    "",
    "Detected page fields JSON. Existing field values are omitted/redacted:",
    JSON.stringify(scan, null, 2)
  ].join("\n");

  return [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt }
  ];
}

async function callAi(apiConfig, messages, context) {
  if (apiConfig.mode === "custom") {
    return callCustomApi(apiConfig, messages, context);
  }
  return callOpenAiCompatible(apiConfig, messages);
}

async function callOpenAiCompatible(apiConfig, messages) {
  if (!apiConfig.baseUrl) {
    throw new Error("API base URL is required.");
  }
  if (!apiConfig.model) {
    throw new Error("Model name is required.");
  }

  const url = joinUrl(apiConfig.baseUrl, apiConfig.endpointPath || "/chat/completions");
  const headers = buildRequestHeaders({ apiConfig, headerJson: apiConfig.extraHeadersJson });

  const body = {
    model: apiConfig.model,
    messages,
    temperature: 0
  };

  if (apiConfig.useJsonResponseFormat) {
    body.response_format = { type: "json_object" };
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body)
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`API request failed ${response.status}: ${text.slice(0, 500)}`);
  }

  const data = safeJsonParse(text);
  if (!data) {
    return text;
  }

  const content = data?.choices?.[0]?.message?.content;
  if (Array.isArray(content)) {
    return content.map((item) => item.text || item.content || "").join("");
  }
  if (typeof content === "string") {
    return content;
  }

  return JSON.stringify(data);
}

async function callCustomApi(apiConfig, messages, context) {
  if (!apiConfig.customUrl) {
    throw new Error("Custom API URL is required.");
  }

  const headers = buildRequestHeaders({ apiConfig, headerJson: apiConfig.customHeadersJson });

  const body = renderTemplate(apiConfig.customBodyTemplate || DEFAULT_API_CONFIG.customBodyTemplate, {
    model: apiConfig.model || "",
    messages,
    systemPrompt: messages.find((message) => message.role === "system")?.content || "",
    userPrompt: messages.find((message) => message.role === "user")?.content || "",
    profile: context.profile,
    scan: context.scan
  });

  const response = await fetch(apiConfig.customUrl, {
    method: apiConfig.customMethod || "POST",
    headers,
    body
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Custom API request failed ${response.status}: ${text.slice(0, 500)}`);
  }

  const data = safeJsonParse(text);
  if (!data) {
    return text;
  }

  const content = apiConfig.customResponsePath ? getByPath(data, apiConfig.customResponsePath) : data;
  if (typeof content === "string") {
    return content;
  }
  return JSON.stringify(content);
}

function buildRequestHeaders({ apiConfig, headerJson, includeContentType = true }) {
  const headers = parseJsonObject(headerJson, "request headers");
  if (includeContentType && !Object.keys(headers).some((key) => key.toLowerCase() === "content-type")) {
    headers["content-type"] = "application/json";
  }
  if (apiConfig.apiKey && !Object.keys(headers).some((key) => key.toLowerCase() === "authorization")) {
    headers.authorization = `Bearer ${apiConfig.apiKey}`;
  }
  return headers;
}

function resolveModelListUrl(apiConfig) {
  if (apiConfig.mode === "openai-compatible") {
    return apiConfig.baseUrl ? joinUrl(apiConfig.baseUrl, "/models") : "";
  }

  const derived = deriveModelListUrl(apiConfig.customUrl || "");
  return derived;
}

function deriveModelListUrl(sourceUrl) {
  if (!sourceUrl) {
    return "";
  }

  try {
    const url = new URL(sourceUrl);
    if (url.pathname.endsWith("/chat/completions")) {
      url.pathname = url.pathname.replace(/\/chat\/completions$/, "/models");
      return url.toString();
    }
    if (url.pathname.endsWith("/completions")) {
      url.pathname = url.pathname.replace(/\/completions$/, "/models");
      return url.toString();
    }
    if (url.pathname.endsWith("/responses")) {
      url.pathname = url.pathname.replace(/\/responses$/, "/models");
      return url.toString();
    }
    if (!url.pathname || url.pathname === "/") {
      url.pathname = "/models";
      return url.toString();
    }
    url.pathname = "/models";
    return url.toString();
  } catch {
    return "";
  }
}

function extractModelListSource(data) {
  if (Array.isArray(data)) {
    return data;
  }
  if (Array.isArray(data?.data)) {
    return data.data;
  }
  if (Array.isArray(data?.models)) {
    return data.models;
  }
  if (Array.isArray(data?.items)) {
    return data.items;
  }
  if (Array.isArray(data?.result)) {
    return data.result;
  }
  if (Array.isArray(data?.choices)) {
    return data.choices;
  }
  if (data && typeof data === "object") {
    for (const key of ["data", "models", "items", "result", "list"]) {
      if (Array.isArray(data[key])) {
        return data[key];
      }
    }
  }

  throw new Error("Could not find a model array in the response.");
}

function normalizeModelList(source) {
  const items = Array.isArray(source) ? source : [];
  return items
    .map((item) => normalizeModelItem(item))
    .filter(Boolean);
}

function normalizeModelItem(item) {
  if (typeof item === "string") {
    const id = item.trim();
    return id ? { id, name: id } : null;
  }

  if (!item || typeof item !== "object") {
    return null;
  }

  const id = String(item.id || item.model || item.name || item.slug || item.value || "").trim();
  if (!id) {
    return null;
  }

  return {
    id,
    name: String(item.display_name || item.name || item.id || id).trim() || id
  };
}

function joinUrl(baseUrl, path) {
  const normalizedBase = String(baseUrl).replace(/\/+$/, "");
  const normalizedPath = String(path || "").replace(/^\/?/, "/");
  return `${normalizedBase}${normalizedPath}`;
}

function parseJsonObject(value, label) {
  if (!value || !String(value).trim()) {
    return {};
  }

  const parsed = JSON.parse(value);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(`${label} must be a JSON object.`);
  }
  return parsed;
}

function renderTemplate(template, values) {
  const replacements = {
    model: values.model,
    modelJson: JSON.stringify(values.model),
    messagesJson: JSON.stringify(values.messages),
    systemPrompt: values.systemPrompt,
    systemPromptJson: JSON.stringify(values.systemPrompt),
    userPrompt: values.userPrompt,
    userPromptJson: JSON.stringify(values.userPrompt),
    prompt: values.userPrompt,
    promptJson: JSON.stringify(values.userPrompt),
    profileJson: JSON.stringify(values.profile),
    profileCatalogJson: JSON.stringify(values.profileCatalog || values.profile),
    fieldsJson: JSON.stringify(values.scan.fields),
    scanJson: JSON.stringify(values.scan)
  };

  return String(template).replace(/\{\{(\w+)\}\}/g, (_match, key) => {
    if (!Object.prototype.hasOwnProperty.call(replacements, key)) {
      throw new Error(`Unknown custom API template variable: ${key}`);
    }
    return replacements[key];
  });
}

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function parseJsonFromText(text) {
  if (typeof text !== "string") {
    return text;
  }

  const cleaned = text
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();

  const direct = safeJsonParse(cleaned);
  if (direct) {
    return direct;
  }

  const jsonCandidate = extractFirstJson(cleaned);
  const parsed = jsonCandidate ? safeJsonParse(jsonCandidate) : null;
  if (!parsed) {
    throw new Error(`AI response is not valid JSON: ${cleaned.slice(0, 500)}`);
  }

  return parsed;
}

function normalizePageStructureAnalysis(parsed, fields) {
  const validFieldIds = new Set(fields.map((field) => field.fieldId));
  const fieldHintsSource = Array.isArray(parsed?.fieldHints)
    ? parsed.fieldHints
    : Array.isArray(parsed?.fields)
      ? parsed.fields
      : [];

  const fieldHints = fieldHintsSource
    .filter((hint) => hint && validFieldIds.has(String(hint.fieldId || "")))
    .map((hint) => ({
      fieldId: String(hint.fieldId),
      label: sanitizePromptText(hint.label || hint.normalizedLabel || "", 120),
      section: sanitizePromptText(hint.section || hint.group || "", 120),
      controlKind: sanitizeAttributeText(hint.controlKind || hint.type || "unknown"),
      confidence: clampConfidence(hint.confidence),
      note: sanitizePromptText(hint.note || hint.reason || "", 160)
    }))
    .filter((hint) => hint.label || hint.section || hint.controlKind !== "unknown");

  return {
    siteType: sanitizeAttributeText(parsed?.siteType || parsed?.type || "generic"),
    confidence: clampConfidence(parsed?.confidence),
    fieldHints,
    notes: Array.isArray(parsed?.notes)
      ? parsed.notes.map((note) => sanitizePromptText(note, 160)).filter(Boolean).slice(0, 8)
      : [],
    raw: parsed
  };
}

function extractFirstJson(text) {
  const start = text.search(/[\[{]/);
  if (start < 0) {
    return "";
  }

  const opener = text[start];
  const closer = opener === "{" ? "}" : "]";
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = start; i < text.length; i += 1) {
    const char = text[i];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
    } else if (char === opener) {
      depth += 1;
    } else if (char === closer) {
      depth -= 1;
      if (depth === 0) {
        return text.slice(start, i + 1);
      }
    }
  }

  return "";
}

function normalizeAiMappings(parsed, fields) {
  let mappings = [];

  if (Array.isArray(parsed)) {
    mappings = parsed;
  } else if (Array.isArray(parsed?.mappings)) {
    mappings = parsed.mappings;
  } else if (parsed && typeof parsed === "object") {
    mappings = Object.entries(parsed).map(([fieldId, value]) => ({
      fieldId,
      ...(value && typeof value === "object" ? value : { value })
    }));
  }

  const validFieldIds = new Set(fields.map((field) => field.fieldId));
  return mappings
    .filter((mapping) => mapping && validFieldIds.has(mapping.fieldId))
    .map((mapping) => {
      const normalized = {
        fieldId: String(mapping.fieldId),
        sourcePath: mapping.sourcePath || mapping.source || mapping.path || "",
        confidence: clampConfidence(mapping.confidence),
        reason: String(mapping.reason || "")
      };

      if (
        !normalized.sourcePath &&
        Object.prototype.hasOwnProperty.call(mapping, "value") &&
        mapping.value !== undefined
      ) {
        normalized.value = mapping.value;
      }

      return normalized;
    });
}

function annotateMappingsWithCatalog(mappings, profileCatalog) {
  const catalogFields = Array.isArray(profileCatalog?.fields) ? profileCatalog.fields : [];
  const sections = Array.isArray(profileCatalog?.sections) ? profileCatalog.sections : [];
  const fieldByPath = new Map(catalogFields.map((field) => [field.path, field]));
  const sectionByPath = new Map();

  for (const section of sections) {
    const fields = Array.isArray(section.fields) ? section.fields : [];
    for (const field of fields) {
      sectionByPath.set(field.path, section.title || "");
    }
  }

  return mappings.map((mapping) => {
    const catalogField = fieldByPath.get(mapping.sourcePath);
    if (!catalogField) {
      return mapping;
    }

    return {
      ...mapping,
      sourceLabel: catalogField.label || "",
      sourceSection: sectionByPath.get(mapping.sourcePath) || ""
    };
  });
}

function clampConfidence(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return 0.5;
  }
  return Math.max(0, Math.min(1, number));
}

function getByPath(source, path) {
  const parts = String(path)
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .map((part) => part.trim())
    .filter(Boolean);

  let current = source;
  for (const part of parts) {
    if (current == null) {
      return undefined;
    }
    current = current[part];
  }
  return current;
}
