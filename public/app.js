const EFFECTS = [
  ["smaller_nose", "Smaller nose"],
  ["nose_bridge", "Nose bridge"],
  ["nose_tip", "Nose tip"],
  ["lip_filler", "Lip filler"],
  ["upper_lip", "Upper lip"],
  ["lower_lip", "Lower lip"],
  ["fox_eye", "Fox eye lift"],
  ["brow_lift", "Brow lift"],
  ["eyelid_lift", "Eyelid lift"],
  ["face_lift", "Face lift"],
  ["jawline", "Jawline"],
  ["chin", "Chin refinement"],
  ["cheek_volume", "Cheek volume"],
  ["cheekbone", "Cheekbone"],
  ["forehead_smoothing", "Forehead smoothing"],
  ["crows_feet", "Crow's feet"],
  ["under_eye", "Under-eye"],
  ["skin_tone", "Skin tone"],
  ["skin_texture", "Skin texture"],
  ["facial_slimming", "Facial slimming"],
];

const STORAGE_KEY = "poker-face-session-v1";
const LANG_KEY = "poker-face-lang";
const GENERATION_TIMEOUT_MS = 150000;
const DEV_RELOAD_INTERVAL_MS = 1000;
let devVersion = "";

const STRINGS = {
  en: {
    brandTagline: "Realistic aesthetic previews from one selfie.",
    uploadTitle: "Upload portrait",
    uploadCopy: "Front-facing photos work best.",
    noPhoto: "No photo selected",
    intensity: "Prompt intensity",
    intensitySubtle: "Subtle",
    intensityBalanced: "Balanced",
    intensityDefined: "Defined",
    previewSet: "Preview set",
    selectedCount: "{count} selected",
    generatePhoto: "Generate photo",
    imageModelNeeded: "Image model needed",
    clearSession: "Clear session",
    model: "Model",
    relay: "Relay",
    progress: "Progress",
    status: "Status",
    progressOf: "{done} of {total}",
    idle: "Idle",
    generating: "Generating {label}",
    preview: "preview",
    disclaimer:
      "Simulated previews only. Results are not medical advice and may not match real cosmetic outcomes.",
    eyebrow: "Desktop-first MVP",
    previewGallery: "Preview gallery",
    compare: "Compare",
    regenerate: "Regenerate",
    delete: "Delete",
    original: "Original",
    selectedPreview: "Selected preview",
    compareOriginalAlt: "Original uploaded portrait",
    compareGeneratedAlt: "Selected generated preview",
    emptyTitle: "Upload a selfie to start",
    emptyCopy: "The generated results will fill this Pinterest-style gallery as each preview completes.",
    save: "Save",
    saved: "Saved",
    uploadedPortraitAlt: "Uploaded portrait",
    loading: "Loading",
    checking: "Checking",
    ready: "Ready",
    needsImageModel: "Needs image model",
    missingUrl: "Missing URL",
    unavailable: "Unavailable",
    offline: "Offline",
    timeout: "{label} took too long. Please retry this effect.",
    generationFailed: "Generation failed.",
    generationStopped: "Generation stopped: {message}",
    languageGroup: "Language",
    effects: {
      original: "Original",
      smaller_nose: "Smaller nose",
      nose_bridge: "Nose bridge",
      nose_tip: "Nose tip",
      lip_filler: "Lip filler",
      upper_lip: "Upper lip",
      lower_lip: "Lower lip",
      fox_eye: "Fox eye lift",
      brow_lift: "Brow lift",
      eyelid_lift: "Eyelid lift",
      face_lift: "Face lift",
      jawline: "Jawline",
      chin: "Chin refinement",
      cheek_volume: "Cheek volume",
      cheekbone: "Cheekbone",
      forehead_smoothing: "Forehead smoothing",
      crows_feet: "Crow's feet",
      under_eye: "Under-eye",
      skin_tone: "Skin tone",
      skin_texture: "Skin texture",
      facial_slimming: "Facial slimming",
    },
  },
  zh: {
    brandTagline: "一张自拍，生成真实感面部美学预览。",
    uploadTitle: "上传肖像照",
    uploadCopy: "正面清晰照片效果最佳。",
    noPhoto: "尚未选择照片",
    intensity: "提示强度",
    intensitySubtle: "轻微",
    intensityBalanced: "适中",
    intensityDefined: "明显",
    previewSet: "预览效果",
    selectedCount: "已选 {count} 项",
    generatePhoto: "生成照片",
    imageModelNeeded: "需要图像模型",
    clearSession: "清除会话",
    model: "模型",
    relay: "中继",
    progress: "进度",
    status: "状态",
    progressOf: "{done} / {total}",
    idle: "空闲",
    generating: "正在生成 {label}",
    preview: "预览",
    disclaimer: "仅为模拟预览，不构成医疗建议，结果可能与真实医美效果不同。",
    eyebrow: "桌面端优先 MVP",
    previewGallery: "预览图库",
    compare: "对比",
    regenerate: "重新生成",
    delete: "删除",
    original: "原图",
    selectedPreview: "选中预览",
    compareOriginalAlt: "上传的原始肖像",
    compareGeneratedAlt: "选中的生成预览",
    emptyTitle: "上传自拍开始体验",
    emptyCopy: "生成完成后，结果会以瀑布流方式填满此图库。",
    save: "收藏",
    saved: "已收藏",
    uploadedPortraitAlt: "已上传肖像",
    loading: "加载中",
    checking: "检查中",
    ready: "就绪",
    needsImageModel: "需要图像模型",
    missingUrl: "缺少地址",
    unavailable: "不可用",
    offline: "离线",
    timeout: "{label} 超时，请重试该效果。",
    generationFailed: "生成失败。",
    generationStopped: "生成已停止：{message}",
    languageGroup: "语言",
    effects: {
      original: "原图",
      smaller_nose: "缩小鼻翼",
      nose_bridge: "鼻梁",
      nose_tip: "鼻尖",
      lip_filler: "丰唇",
      upper_lip: "上唇",
      lower_lip: "下唇",
      fox_eye: "狐狸眼提升",
      brow_lift: "提眉",
      eyelid_lift: "眼睑提升",
      face_lift: "面部提升",
      jawline: "下颌线",
      chin: "下巴修饰",
      cheek_volume: "苹果肌填充",
      cheekbone: "颧骨",
      forehead_smoothing: "额头平滑",
      crows_feet: "鱼尾纹",
      under_eye: "眼下",
      skin_tone: "肤色",
      skin_texture: "肤质",
      facial_slimming: "面部瘦脸",
    },
  },
};

const state = {
  lang: "en",
  sourceImage: "",
  results: [],
  selectedId: "",
  selectedEffects: EFFECTS.map(([effectId]) => effectId),
  currentGenerationLabel: "",
  currentGenerationEffectId: "",
  generating: false,
  relayConfigured: false,
  readyForGeneration: false,
  relayStatusKey: "checking",
};

const nodes = {
  photoInput: document.querySelector("#photoInput"),
  sourcePreview: document.querySelector("#sourcePreview"),
  intensity: document.querySelector("#intensity"),
  generateAll: document.querySelector("#generateAll"),
  clearAll: document.querySelector("#clearAll"),
  effectFilters: document.querySelector("#effectFilters"),
  selectedCount: document.querySelector("#selectedCount"),
  modelName: document.querySelector("#modelName"),
  relayState: document.querySelector("#relayState"),
  progressText: document.querySelector("#progressText"),
  generationStatus: document.querySelector("#generationStatus"),
  gallery: document.querySelector("#gallery"),
  emptyState: document.querySelector("#emptyState"),
  cardTemplate: document.querySelector("#cardTemplate"),
  compareToggle: document.querySelector("#compareToggle"),
  comparePanel: document.querySelector("#comparePanel"),
  compareOriginal: document.querySelector("#compareOriginal"),
  compareGenerated: document.querySelector("#compareGenerated"),
  regenerateSelected: document.querySelector("#regenerateSelected"),
  deleteSelected: document.querySelector("#deleteSelected"),
  langSwitch: document.querySelector(".lang-switch"),
  langButtons: [...document.querySelectorAll(".lang-btn")],
};

function detectLang() {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === "en" || saved === "zh") return saved;
  } catch {
    // Ignore storage read failures and fall back to browser language.
  }
  return String(navigator.language || "").toLowerCase().startsWith("zh") ? "zh" : "en";
}

function t(key, vars = {}) {
  const table = STRINGS[state.lang] || STRINGS.en;
  let text = table[key] ?? STRINGS.en[key] ?? key;
  Object.entries(vars).forEach(([name, value]) => {
    text = text.replaceAll(`{${name}}`, String(value));
  });
  return text;
}

function effectLabel(effectId) {
  const table = STRINGS[state.lang] || STRINGS.en;
  return table.effects[effectId] || STRINGS.en.effects[effectId] || effectId;
}

function englishEffectLabel(effectId) {
  return EFFECTS.find(([id]) => id === effectId)?.[1] || effectId;
}

function persistLang() {
  try {
    localStorage.setItem(LANG_KEY, state.lang);
  } catch (error) {
    console.warn("Language save failed:", error);
  }
}

function applyStaticI18n() {
  document.documentElement.lang = state.lang === "zh" ? "zh-CN" : "en";
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (key) el.textContent = t(key);
  });
  document.querySelectorAll("[data-i18n-alt]").forEach((el) => {
    const key = el.getAttribute("data-i18n-alt");
    if (key) el.setAttribute("alt", t(key));
  });
  if (nodes.langSwitch) {
    nodes.langSwitch.setAttribute("aria-label", t("languageGroup"));
  }
  nodes.langButtons.forEach((btn) => {
    btn.setAttribute("aria-pressed", String(btn.dataset.lang === state.lang));
  });
}

function setLang(lang) {
  if (lang !== "en" && lang !== "zh") return;
  state.lang = lang;
  persistLang();
  applyStaticI18n();
  render();
}

function saveState() {
  const lightweightResults = state.results.map(({ image, prompt, ...item }) => item);
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      selectedId: state.selectedId,
      selectedEffects: state.selectedEffects,
      results: lightweightResults,
    }),
  );
}

function safeSaveState() {
  try {
    saveState();
  } catch (error) {
    console.warn("State save failed:", error);
  }
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    state.sourceImage = "";
    state.results = [];
    state.selectedId = saved.selectedId || "";
    if (Array.isArray(saved.selectedEffects)) {
      const knownEffects = new Set(EFFECTS.map(([effectId]) => effectId));
      state.selectedEffects = saved.selectedEffects.filter((effectId) => knownEffects.has(effectId));
    }
    if (saved.sourceImage || saved.results?.some((item) => item.image)) {
      safeSaveState();
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function setSourceImage(dataUrl) {
  state.sourceImage = dataUrl;
  state.results = [
    {
      id: "original",
      effectId: "original",
      label: "Original",
      image: dataUrl,
      createdAt: Math.floor(Date.now() / 1000),
      saved: true,
    },
  ];
  state.selectedId = "original";
  safeSaveState();
  render();
}

function selectedResult() {
  return state.results.find((item) => item.id === state.selectedId) || state.results[0];
}

function updateSourcePreview() {
  nodes.sourcePreview.innerHTML = "";
  if (!state.sourceImage) {
    nodes.sourcePreview.classList.add("empty");
    nodes.sourcePreview.textContent = t("noPhoto");
    return;
  }
  nodes.sourcePreview.classList.remove("empty");
  const img = document.createElement("img");
  img.src = state.sourceImage;
  img.alt = t("uploadedPortraitAlt");
  nodes.sourcePreview.append(img);
}

function cardClass(index, item) {
  const classes = ["preview-card"];
  if (item.id === state.selectedId) classes.push("selected");
  if (item.id === "original" || index === 3) classes.push("featured");
  if (index % 5 === 1) classes.push("short");
  if (index % 7 === 2) classes.push("tall");
  if (item.pending) classes.push("pending");
  if (item.error) classes.push("error");
  return classes.join(" ");
}

function renderGallery() {
  nodes.gallery.innerHTML = "";
  nodes.emptyState.classList.toggle("hidden", Boolean(state.sourceImage));

  state.results.forEach((item, index) => {
    const card = nodes.cardTemplate.content.firstElementChild.cloneNode(true);
    card.className = cardClass(index, item);
    card.dataset.id = item.id;
    const img = card.querySelector("img");
    const label = card.querySelector(".card-label");
    const save = card.querySelector(".card-save");
    const displayLabel = effectLabel(item.effectId);
    label.textContent = displayLabel;
    save.textContent = item.saved ? t("saved") : t("save");
    save.disabled = item.pending || item.error;

    if (item.error) {
      card.querySelector(".image-frame").textContent = item.error;
    } else if (!item.pending) {
      img.src = item.image;
      img.alt = displayLabel;
    }

    card.addEventListener("click", () => {
      state.selectedId = item.id;
      safeSaveState();
      render();
    });

    save.addEventListener("click", (event) => {
      event.stopPropagation();
      item.saved = !item.saved;
      safeSaveState();
      render();
    });

    nodes.gallery.append(card);
  });
}

function renderEffectFilters() {
  const selected = new Set(state.selectedEffects);
  nodes.effectFilters.innerHTML = "";
  nodes.selectedCount.textContent = t("selectedCount", { count: state.selectedEffects.length });

  EFFECTS.forEach(([effectId]) => {
    const chip = document.createElement("button");
    chip.className = selected.has(effectId) ? "filter-chip selected" : "filter-chip";
    chip.type = "button";
    chip.textContent = effectLabel(effectId);
    chip.setAttribute("aria-pressed", String(selected.has(effectId)));
    chip.addEventListener("click", () => {
      if (selected.has(effectId)) {
        state.selectedEffects = state.selectedEffects.filter((item) => item !== effectId);
      } else {
        state.selectedEffects = [...state.selectedEffects, effectId];
      }
      safeSaveState();
      render();
    });
    nodes.effectFilters.append(chip);
  });
}

function updateComparePanel() {
  const selected = selectedResult();
  if (!state.sourceImage || !selected) return;
  nodes.compareOriginal.src = state.sourceImage;
  nodes.compareGenerated.src = selected.image || state.sourceImage;
}

function updateActions() {
  const selectedSet = new Set(state.selectedEffects);
  const generated = state.results.filter(
    (item) => selectedSet.has(item.effectId) && !item.pending && !item.error,
  ).length;
  const selectedTotal = state.selectedEffects.length;
  nodes.progressText.textContent = t("progressOf", { done: generated, total: selectedTotal });
  const activeLabel = state.currentGenerationEffectId
    ? effectLabel(state.currentGenerationEffectId)
    : state.currentGenerationLabel || t("preview");
  nodes.generationStatus.textContent = state.generating
    ? t("generating", { label: activeLabel })
    : t("idle");
  nodes.generateAll.disabled =
    !state.sourceImage || state.generating || !state.readyForGeneration || selectedTotal === 0;
  nodes.generateAll.textContent = state.readyForGeneration ? t("generatePhoto") : t("imageModelNeeded");
  nodes.regenerateSelected.disabled =
    !state.sourceImage || state.generating || selectedResult()?.effectId === "original";
  nodes.deleteSelected.disabled = !selectedResult() || selectedResult()?.effectId === "original";
}

function updateRelayStatusText() {
  const key = state.relayStatusKey;
  if (key === "checking") {
    nodes.modelName.textContent = t("loading");
    nodes.relayState.textContent = t("checking");
    return;
  }
  if (key === "offline") {
    nodes.modelName.textContent = t("unavailable");
    nodes.relayState.textContent = t("offline");
    return;
  }
  nodes.relayState.textContent = t(key);
}

function render() {
  applyStaticI18n();
  updateSourcePreview();
  renderEffectFilters();
  renderGallery();
  updateComparePanel();
  updateActions();
  updateRelayStatusText();
}

async function loadConfig() {
  try {
    const response = await fetch("/api/config");
    const config = await response.json();
    state.relayConfigured = config.relayConfigured;
    state.readyForGeneration = config.readyForGeneration;
    nodes.modelName.textContent = config.model;
    state.relayStatusKey = config.readyForGeneration
      ? "ready"
      : config.relayConfigured
        ? "needsImageModel"
        : "missingUrl";
    nodes.relayState.style.color = config.readyForGeneration ? "var(--ok)" : "var(--warn)";
    render();
  } catch {
    state.relayStatusKey = "offline";
    render();
  }
}

async function watchDevReload() {
  try {
    const response = await fetch("/api/dev-version", { cache: "no-store" });
    const payload = await response.json();
    if (!devVersion) {
      devVersion = payload.version;
      return;
    }
    if (payload.version && payload.version !== devVersion) {
      window.location.reload();
    }
  } catch {
    // The backend may be restarting. The next poll will reload when it is back.
  }
}

function timeoutMessage(label) {
  return t("timeout", { label });
}

function fetchWithTimeout(url, options, timeoutMs, label) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...options, signal: controller.signal })
    .catch((error) => {
      if (error.name === "AbortError") {
        throw new Error(timeoutMessage(label));
      }
      throw error;
    })
    .finally(() => window.clearTimeout(timeoutId));
}

async function generateEffect(effectId, label) {
  const pendingId = `pending-${effectId}`;
  state.currentGenerationLabel = label;
  state.currentGenerationEffectId = effectId;
  state.results = state.results.filter((item) => item.effectId !== effectId);
  state.results.push({ id: pendingId, effectId, label, pending: true });
  render();

  const response = await fetchWithTimeout(
    "/api/generate",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image: state.sourceImage,
        effectId,
        label,
        intensity: nodes.intensity.value,
      }),
    },
    GENERATION_TIMEOUT_MS,
    effectLabel(effectId),
  );
  const payload = await response.json();
  if (!response.ok || payload.error) {
    throw new Error(payload.error || t("generationFailed"));
  }

  state.results = state.results.filter((item) => item.id !== pendingId);
  state.results.push(payload.result);
  state.selectedId = payload.result.id;
  safeSaveState();
  render();
}

async function generateAll() {
  if (!state.sourceImage || state.generating) return;
  const selectedEffects = EFFECTS.filter(([effectId]) => state.selectedEffects.includes(effectId));
  if (selectedEffects.length === 0) return;
  state.generating = true;
  state.results = state.results.filter((item) => item.effectId === "original");
  state.selectedId = "original";
  safeSaveState();
  updateActions();

  try {
    for (const [effectId, label] of selectedEffects) {
      try {
        await generateEffect(effectId, label);
      } catch (error) {
        state.results = state.results.filter((item) => item.id !== `pending-${effectId}`);
        state.results.push({
          id: `error-${effectId}-${Date.now()}`,
          effectId,
          label,
          error: error.message,
        });
        safeSaveState();
        render();
        if (
          /Relay API error (400|401|403)|model_not_found|not configured|not an image generation model/i.test(
            error.message,
          )
        ) {
          alert(t("generationStopped", { message: error.message }));
          break;
        }
      }
    }
  } finally {
    state.currentGenerationLabel = "";
    state.currentGenerationEffectId = "";
    state.generating = false;
    render();
  }
}

async function regenerateSelected() {
  const selected = selectedResult();
  if (!selected || selected.effectId === "original" || state.generating) return;
  state.generating = true;
  updateActions();
  try {
    await generateEffect(selected.effectId, englishEffectLabel(selected.effectId));
  } catch (error) {
    alert(error.message);
  } finally {
    state.generating = false;
    render();
  }
}

function deleteSelected() {
  const selected = selectedResult();
  if (!selected || selected.effectId === "original") return;
  state.results = state.results.filter((item) => item.id !== selected.id);
  state.selectedId = state.results[0]?.id || "";
  safeSaveState();
  render();
}

nodes.photoInput.addEventListener("change", (event) => {
  const [file] = event.target.files;
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener("load", () => setSourceImage(reader.result));
  reader.readAsDataURL(file);
});

nodes.generateAll.addEventListener("click", generateAll);
nodes.regenerateSelected.addEventListener("click", regenerateSelected);
nodes.deleteSelected.addEventListener("click", deleteSelected);
nodes.clearAll.addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  state.sourceImage = "";
  state.results = [];
  state.selectedId = "";
  state.selectedEffects = EFFECTS.map(([effectId]) => effectId);
  render();
});
nodes.compareToggle.addEventListener("click", () => {
  nodes.comparePanel.classList.toggle("hidden");
  updateComparePanel();
});
nodes.langButtons.forEach((btn) => {
  btn.addEventListener("click", () => setLang(btn.dataset.lang));
});

state.lang = detectLang();
loadState();
applyStaticI18n();
render();
loadConfig();
watchDevReload();
window.setInterval(watchDevReload, DEV_RELOAD_INTERVAL_MS);
