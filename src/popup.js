const els = {
  status: document.getElementById("status"),
  openOptions: document.getElementById("openOptions"),
  startAutofillBtn: document.getElementById("startAutofillBtn"),
  showProfilePanelBtn: document.getElementById("showProfilePanelBtn"),
  clearMarksBtn: document.getElementById("clearMarksBtn"),
  copyDebugBtn: document.getElementById("copyDebugBtn")
};

const DEFAULT_START_LABEL = els.startAutofillBtn.textContent;

els.openOptions.addEventListener("click", () => chrome.runtime.openOptionsPage());
els.startAutofillBtn.addEventListener("click", () => {
  void startAutofill();
});
els.showProfilePanelBtn.addEventListener("click", () => {
  void showProfilePanel();
});
els.clearMarksBtn.addEventListener("click", () => {
  void clearMarks();
});
els.copyDebugBtn.addEventListener("click", () => {
  void copyDebugSnapshot();
});

initialize();

async function initialize() {
  try {
    setStatus("点击开始填写后，右下角会实时显示当前是本地规则还是 AI；AI 只看字段信息，不看简历值，失败会自动回退。");
    await syncRuntimeState();
  } catch (error) {
    setStatus(`读取页面失败：${error.message}`, true);
  }
}

async function syncRuntimeState(options = {}) {
  try {
    const response = await sendToActiveTab({ type: "OJAF_GET_RUNTIME_STATE" });
    applyRuntimeState(response?.data || {}, options);
  } catch {
    els.startAutofillBtn.disabled = false;
    els.startAutofillBtn.textContent = DEFAULT_START_LABEL;
  }
}

function applyRuntimeState(state = {}, options = {}) {
  const busy = Boolean(state.autofillInProgress);
  els.startAutofillBtn.disabled = busy;
  els.startAutofillBtn.textContent = busy ? "扫描中..." : DEFAULT_START_LABEL;
  els.copyDebugBtn.disabled = busy || !state.hasDebugSnapshot;

  if (options.updateStatus === false) {
    return;
  }

  if (busy) {
    const progress = state.autofillProgress || {};
    const stageLabel = progress.stepLabel || progress.stage || "处理当前页面";
    const stage = /^正在/.test(stageLabel) ? stageLabel : `正在${stageLabel}`;
    const elapsed = formatElapsedTime(progress.stageStartedAt);
    const aiNote = formatRuntimeAiNote(state.autofillAi || {}, elapsed);
    setStatus(`当前${stage}，请勿重复点击。页面右下角会显示进度。${aiNote}`);
    return;
  }

  if (state.autofillSummary) {
    const summary = state.autofillSummary;
    setStatus(`上次填写：成功 ${summary.filled || 0} 项，需确认 ${summary.skipped || 0} 项，失败 ${summary.failed || 0} 项。${formatAiCompletionNote(summary.aiUsage || state.autofillAi || {})}`);
  }
}

async function showProfilePanel() {
  try {
    await sendToActiveTab({ type: "OJAF_SHOW_PROFILE_PANEL" });
    setStatus("已打开右侧资料栏。");
    await syncRuntimeState({ updateStatus: false });
  } catch (error) {
    setStatus(`打开失败：${error.message}`, true);
  }
}

async function startAutofill() {
  try {
    els.startAutofillBtn.disabled = true;
    els.startAutofillBtn.textContent = "扫描中...";
    setStatus("正在开始填写；右下角会显示当前是本地规则还是 AI。");
    const response = await sendToActiveTab({ type: "OJAF_START_AUTOFILL" });
    const data = response?.data || {};
    if (data.ok) {
      if (data.filled != null) {
        setStatus(`已完成一键填写：成功 ${data.filled || 0} 项，需确认 ${data.skipped || 0} 项，失败 ${data.failed || 0} 项。${formatAiCompletionNote(data.aiUsage || {})}`);
      } else {
        setStatus("已完成扫描处理。页面上的黄色标记需要人工确认，也可以打开右侧资料栏查看和复制资料。");
      }
    } else if (data.reason === "cancelled") {
      setStatus("已取消写入。");
    } else if (data.reason === "no candidates") {
      setStatus(`没有找到高置信度可直填字段。可以打开右侧资料栏查看和复制资料。${formatAiCompletionNote(data.aiUsage || {})}`);
    } else if (data.reason === "busy") {
      setStatus("当前已有扫描任务在运行，请稍候。", true);
    } else if (data.reason) {
      setStatus(`开始填写未完成：${data.reason}`, true);
    } else {
      setStatus("已开始处理一键填写。");
    }
    await syncRuntimeState({ updateStatus: false });
  } catch (error) {
    setStatus(`开始填写失败：${error.message}`, true);
    await syncRuntimeState({ updateStatus: false });
  }
}

async function clearMarks() {
  try {
    await sendToActiveTab({ type: "OJAF_CLEAR_MARKS" });
    setStatus("已清除当前页面的填写标记。");
    await syncRuntimeState({ updateStatus: false });
  } catch (error) {
    setStatus(`清除失败：${error.message}`, true);
  }
}

async function copyDebugSnapshot() {
  try {
    const response = await sendToActiveTab({ type: "OJAF_GET_DEBUG_SNAPSHOT" });
    const snapshot = response?.data || null;
    if (!snapshot) {
      setStatus("当前页面还没有诊断信息。先点击一次开始填写，再复制诊断。", true);
      return;
    }

    const text = formatDebugSnapshot(snapshot);
    await copyText(text);
    setStatus("已复制诊断信息。里面不包含简历具体值，只包含字段、分类、匹配分数和失败原因。");
    await syncRuntimeState({ updateStatus: false });
  } catch (error) {
    setStatus(`复制诊断失败：${error.message}`, true);
  }
}

function formatRuntimeAiNote(aiUsage = {}, elapsed = "") {
  const status = aiUsage.status || "";
  if (status === "trying") {
    const phase = aiUsage.currentPhase ? ` ${aiUsage.currentPhase}` : "";
    return ` 正在尝试 AI${phase}，资料值不会发送${elapsed ? `，已等待 ${elapsed}` : ""}。`;
  }
  if (aiUsage.used && aiUsage.fallback) {
    return " AI 部分参与，失败步骤已回退本地规则。";
  }
  if (aiUsage.used) {
    return " AI 已参与分析/映射，写入阶段仍在本地执行。";
  }
  if (aiUsage.fallback) {
    return " AI 不可用，已回退本地规则。";
  }
  if (status === "no-result" || aiUsage.attempted) {
    return " AI 未返回可用增强，继续使用本地规则。";
  }
  return " 当前按本地规则处理；API 可用时才会尝试 AI 增强。";
}

function formatAiCompletionNote(aiUsage = {}) {
  if (aiUsage.used && aiUsage.fallback) {
    return "本次 AI 部分参与，失败步骤已回退本地规则。";
  }
  if (aiUsage.used) {
    return "本次 AI 参与分析/映射，写入阶段本地执行。";
  }
  if (aiUsage.fallback) {
    return "本次实际使用本地规则；AI 不可用，已回退。";
  }
  if (aiUsage.status === "no-result" || aiUsage.attempted) {
    return "本次 AI 未产生可用增强，实际使用本地规则。";
  }
  return "本次使用本地规则。";
}

function formatAiFallbackReason(aiUsage = {}) {
  if (aiUsage.fallbackReason) {
    return aiUsage.fallbackReason;
  }
  const reasons = Array.isArray(aiUsage.fallbackReasons) ? aiUsage.fallbackReasons : [];
  return reasons
    .map((item) => {
      const phase = String(item?.phase || "AI").trim();
      const reason = String(item?.reason || "未知错误").trim();
      return `${phase}：${reason}`;
    })
    .join("；");
}

function formatAiUsageForDebug(aiUsage = {}, legacyStatus = "") {
  if (aiUsage.message) {
    return aiUsage.message;
  }
  if (aiUsage.used && aiUsage.fallback) {
    return "AI 部分参与，失败步骤已回退本地规则。";
  }
  if (aiUsage.used) {
    return "AI 已参与分析/映射，写入阶段本地执行。";
  }
  if (aiUsage.fallback) {
    return "AI 不可用，已回退本地规则。";
  }
  if (aiUsage.status === "no-result" || aiUsage.attempted) {
    return "AI 已尝试但未返回可用增强，本次继续使用本地规则。";
  }
  return legacyStatus || "未调用 AI，本次使用本地规则。";
}

function formatDebugSnapshot(snapshot) {
  const lines = [];
  const counts = snapshot.counts || {};
  const summary = snapshot.summary || {};
  const aiUsage = snapshot.aiUsage || summary.aiUsage || {};
  lines.push("# OpenJobAutofill 诊断信息");
  lines.push("");
  lines.push(`- 页面：${snapshot.page?.hostname || ""}`);
  lines.push(`- 生成时间：${snapshot.generatedAt || ""}`);
  lines.push(`- 映射来源：${snapshot.mappingSource || ""}`);
  lines.push(`- AI 使用情况：${formatAiUsageForDebug(aiUsage, snapshot.aiStatus || "")}`);
  const fallbackReason = formatAiFallbackReason(aiUsage);
  if (fallbackReason) {
    lines.push(`- AI 回退原因：${fallbackReason}`);
  }
  lines.push(`- 扫描字段：${snapshot.scan?.fieldCount || 0}`);
  lines.push(`- 候选字段：${counts.candidates || 0}`);
  lines.push(`- 自动写入：${counts.autoFill || 0}`);
  lines.push(`- 需要确认：${counts.needsConfirm || 0}`);
  lines.push(`- 忽略：${counts.ignored || 0}`);
  if (summary.total != null) {
    lines.push(`- 结果：成功 ${summary.filled || 0}，需确认 ${summary.skipped || 0}，失败 ${summary.failed || 0}`);
  }

  const resultById = new Map((snapshot.results || []).map((result) => [result.id, result]));
  lines.push("");
  lines.push("## 需要确认/失败字段");
  const candidates = snapshot.candidates || [];
  const risky = candidates.filter((candidate) => !candidate.shouldAutoFill || resultById.get(`candidate_${candidate.fieldId}`)?.ok === false);
  if (risky.length === 0) {
    lines.push("无。");
  } else {
    for (const candidate of risky.slice(0, 120)) {
      const result = resultById.get(`candidate_${candidate.fieldId}`) || {};
      lines.push(
        `- ${candidate.fieldCategory || "未分类"} / ${candidate.fieldLabel || candidate.fieldId} -> ${candidate.sourceCategory || "未分类"} / ${candidate.sourceLabel || "未匹配"}；分数 ${candidate.score}；置信度 ${Math.round((candidate.confidence || 0) * 100)}%；${candidate.shouldAutoFill ? "尝试写入" : "需确认"}；${result.ok === false ? `失败：${result.note || "未知"}` : candidate.warning || candidate.reason || "无原因"}`
      );
    }
  }

  lines.push("");
  lines.push("## 全部候选字段 JSON");
  lines.push("```json");
  lines.push(JSON.stringify(snapshot, null, 2));
  lines.push("```");
  return `${lines.join("\n")}\n`;
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const ok = document.execCommand("copy");
  textarea.remove();
  if (!ok) {
    throw new Error("Clipboard unavailable.");
  }
}

function formatElapsedTime(startedAt) {
  const start = Number(startedAt || 0);
  if (!start) {
    return "";
  }
  const seconds = Math.max(0, Math.floor((Date.now() - start) / 1000));
  if (seconds < 1) {
    return "";
  }
  if (seconds < 60) {
    return `${seconds} 秒`;
  }
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return rest ? `${minutes} 分 ${rest} 秒` : `${minutes} 分钟`;
}

function setStatus(message, isError = false) {
  els.status.textContent = message;
  els.status.classList.toggle("error", isError);
}

async function sendToActiveTab(message) {
  const [tab] = await queryTabs({ active: true, currentWindow: true });
  if (!tab?.id) {
    throw new Error("No active tab found.");
  }

  await executeScript(tab.id, "src/content.js");

  try {
    return await sendTabMessage(tab.id, message);
  } catch (firstError) {
    try {
      await executeScript(tab.id, "src/content.js");
      return await sendTabMessage(tab.id, message);
    } catch {
      throw firstError;
    }
  }
}

function queryTabs(query) {
  return new Promise((resolve) => {
    chrome.tabs.query(query, resolve);
  });
}

function executeScript(tabId, file) {
  return new Promise((resolve, reject) => {
    chrome.scripting.executeScript({ target: { tabId }, files: [file] }, () => {
      const error = chrome.runtime.lastError;
      if (error) {
        reject(new Error(error.message));
      } else {
        resolve();
      }
    });
  });
}

function sendTabMessage(tabId, message) {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, message, (response) => {
      const error = chrome.runtime.lastError;
      if (error) {
        reject(new Error(error.message));
        return;
      }
      if (!response?.ok) {
        reject(new Error(response?.error || "Tab message failed."));
        return;
      }
      resolve(response);
    });
  });
}
