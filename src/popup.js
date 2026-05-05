const els = {
  pageInfo: document.getElementById("pageInfo"),
  status: document.getElementById("status"),
  openOptions: document.getElementById("openOptions"),
  startAutofillBtn: document.getElementById("startAutofillBtn"),
  showAssistantBtn: document.getElementById("showAssistantBtn"),
  clearMarksBtn: document.getElementById("clearMarksBtn")
};

const DEFAULT_START_LABEL = els.startAutofillBtn.textContent;

els.openOptions.addEventListener("click", () => chrome.runtime.openOptionsPage());
els.startAutofillBtn.addEventListener("click", () => {
  void startAutofill();
});
els.showAssistantBtn.addEventListener("click", () => {
  void showAssistant();
});
els.clearMarksBtn.addEventListener("click", () => {
  void clearMarks();
});

initialize();

async function initialize() {
  try {
    const tab = await getActiveTab();
    if (tab?.url) {
      els.pageInfo.textContent = normalizePageLabel(tab.url);
    }
    setStatus("点击开始填写后会在页面右下角显示进度，并直接用绿/黄/红框标记结果。");
    await syncRuntimeState();
  } catch (error) {
    setStatus(`读取页面失败：${error.message}`, true);
  }
}

async function syncRuntimeState(options = {}) {
  try {
    const response = await sendToActiveTab({ type: "AI_RESUME_GET_RUNTIME_STATE" });
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

  if (options.updateStatus === false) {
    return;
  }

  if (busy) {
    const progress = state.autofillProgress || {};
    const stage = progress.stage || "扫描";
    const percent = Number.isFinite(Number(progress.percent))
      ? `${Math.max(0, Math.min(100, Math.round(progress.percent)))}%`
      : "";
    setStatus(`当前正在 ${stage}${percent ? `（${percent}）` : ""}，请勿重复点击。页面右下角会显示进度。`);
    return;
  }

  if (state.autofillSummary) {
    const summary = state.autofillSummary;
    setStatus(`上次填写：成功 ${summary.filled || 0} 项，需确认 ${summary.skipped || 0} 项，失败 ${summary.failed || 0} 项。`);
  }
}

async function showAssistant() {
  try {
    await sendToActiveTab({ type: "AI_RESUME_SHOW_FIELD_ASSISTANT" });
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
    setStatus("正在开始填写...");
    const response = await sendToActiveTab({ type: "AI_RESUME_START_AUTOFILL" });
    const data = response?.data || {};
    if (data.ok) {
      if (data.filled != null) {
        setStatus(`已完成一键填写：成功 ${data.filled || 0} 项，需确认 ${data.skipped || 0} 项，失败 ${data.failed || 0} 项。`);
      } else {
        setStatus("已生成草稿。页面上的黄色标记需要人工确认，也可以点“查看详情”。");
      }
    } else if (data.reason === "cancelled") {
      setStatus("已取消写入。");
    } else if (data.reason === "no candidates") {
      setStatus("没有找到高置信度可直填字段。页面上的黄色标记需要人工确认，也可以点“查看详情”。");
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
    await sendToActiveTab({ type: "AI_RESUME_CLEAR_MARKS" });
    setStatus("已清除当前页面的填写标记。");
    await syncRuntimeState({ updateStatus: false });
  } catch (error) {
    setStatus(`清除失败：${error.message}`, true);
  }
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

function getActiveTab() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      resolve(tabs?.[0] || null);
    });
  });
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

function normalizePageLabel(url) {
  try {
    const parsed = new URL(url);
    return `${parsed.hostname}${parsed.pathname || ""}`;
  } catch {
    return String(url);
  }
}
