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
const GENERATION_TIMEOUT_MS = 150000;
const DEV_RELOAD_INTERVAL_MS = 1000;
let devVersion = "";
const state = {
  sourceImage: "",
  results: [],
  selectedId: "",
  selectedEffects: EFFECTS.map(([effectId]) => effectId),
  currentGenerationLabel: "",
  generating: false,
  relayConfigured: false,
  readyForGeneration: false,
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
};

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
    nodes.sourcePreview.textContent = "No photo selected";
    return;
  }
  nodes.sourcePreview.classList.remove("empty");
  const img = document.createElement("img");
  img.src = state.sourceImage;
  img.alt = "Uploaded portrait";
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
    label.textContent = item.label;
    save.textContent = item.saved ? "Saved" : "Save";
    save.disabled = item.pending || item.error;

    if (item.error) {
      card.querySelector(".image-frame").textContent = item.error;
    } else if (!item.pending) {
      img.src = item.image;
      img.alt = item.label;
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
  nodes.selectedCount.textContent = `${state.selectedEffects.length} selected`;

  EFFECTS.forEach(([effectId, label]) => {
    const chip = document.createElement("button");
    chip.className = selected.has(effectId) ? "filter-chip selected" : "filter-chip";
    chip.type = "button";
    chip.textContent = label;
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
  nodes.progressText.textContent = `${generated} of ${selectedTotal}`;
  nodes.generationStatus.textContent = state.generating
    ? `Generating ${state.currentGenerationLabel || "preview"}`
    : "Idle";
  nodes.generateAll.disabled = !state.sourceImage || state.generating || !state.readyForGeneration || selectedTotal === 0;
  nodes.generateAll.textContent = state.readyForGeneration ? "Generate photo" : "Image model needed";
  nodes.regenerateSelected.disabled = !state.sourceImage || state.generating || selectedResult()?.effectId === "original";
  nodes.deleteSelected.disabled = !selectedResult() || selectedResult()?.effectId === "original";
}

function render() {
  updateSourcePreview();
  renderEffectFilters();
  renderGallery();
  updateComparePanel();
  updateActions();
}

async function loadConfig() {
  try {
    const response = await fetch("/api/config");
    const config = await response.json();
    state.relayConfigured = config.relayConfigured;
    state.readyForGeneration = config.readyForGeneration;
    nodes.modelName.textContent = config.model;
    nodes.relayState.textContent = config.readyForGeneration
      ? "Ready"
      : config.relayConfigured
        ? "Needs image model"
        : "Missing URL";
    nodes.relayState.style.color = config.readyForGeneration ? "var(--ok)" : "var(--warn)";
    render();
  } catch {
    nodes.modelName.textContent = "Unavailable";
    nodes.relayState.textContent = "Offline";
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
  return `${label} took too long. Please retry this effect.`;
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
  state.results = state.results.filter((item) => item.effectId !== effectId);
  state.results.push({ id: pendingId, effectId, label, pending: true });
  render();

  const response = await fetchWithTimeout("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      image: state.sourceImage,
      effectId,
      label,
      intensity: nodes.intensity.value,
    }),
  }, GENERATION_TIMEOUT_MS, label);
  const payload = await response.json();
  if (!response.ok || payload.error) {
    throw new Error(payload.error || "Generation failed.");
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
        if (/Relay API error (400|401|403)|model_not_found|not configured|not an image generation model/i.test(error.message)) {
          alert(`Generation stopped: ${error.message}`);
          break;
        }
      }
    }
  } finally {
    state.currentGenerationLabel = "";
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
    await generateEffect(selected.effectId, selected.label);
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

loadState();
render();
loadConfig();
watchDevReload();
window.setInterval(watchDevReload, DEV_RELOAD_INTERVAL_MS);
