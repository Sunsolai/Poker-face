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
const state = {
  sourceImage: "",
  results: [],
  selectedId: "",
  generating: false,
  relayConfigured: false,
};

const nodes = {
  photoInput: document.querySelector("#photoInput"),
  sourcePreview: document.querySelector("#sourcePreview"),
  intensity: document.querySelector("#intensity"),
  generateAll: document.querySelector("#generateAll"),
  clearAll: document.querySelector("#clearAll"),
  modelName: document.querySelector("#modelName"),
  relayState: document.querySelector("#relayState"),
  progressText: document.querySelector("#progressText"),
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
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      sourceImage: state.sourceImage,
      results: state.results,
      selectedId: state.selectedId,
    }),
  );
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    state.sourceImage = saved.sourceImage || "";
    state.results = Array.isArray(saved.results) ? saved.results : [];
    state.selectedId = saved.selectedId || state.results[0]?.id || "";
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
  saveState();
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
      saveState();
      render();
    });

    save.addEventListener("click", (event) => {
      event.stopPropagation();
      item.saved = !item.saved;
      saveState();
      render();
    });

    nodes.gallery.append(card);
  });
}

function updateComparePanel() {
  const selected = selectedResult();
  if (!state.sourceImage || !selected) return;
  nodes.compareOriginal.src = state.sourceImage;
  nodes.compareGenerated.src = selected.image || state.sourceImage;
}

function updateActions() {
  const generated = state.results.filter((item) => item.effectId !== "original" && !item.pending).length;
  nodes.progressText.textContent = `${generated} of ${EFFECTS.length}`;
  nodes.generateAll.disabled = !state.sourceImage || state.generating || !state.relayConfigured;
  nodes.generateAll.textContent = state.relayConfigured ? "Generate set" : "Configure relay";
  nodes.regenerateSelected.disabled = !state.sourceImage || state.generating || selectedResult()?.effectId === "original";
  nodes.deleteSelected.disabled = !selectedResult() || selectedResult()?.effectId === "original";
}

function render() {
  updateSourcePreview();
  renderGallery();
  updateComparePanel();
  updateActions();
}

async function loadConfig() {
  try {
    const response = await fetch("/api/config");
    const config = await response.json();
    state.relayConfigured = config.relayConfigured;
    nodes.modelName.textContent = config.model;
    nodes.relayState.textContent = config.relayConfigured ? "Ready" : "Missing URL";
    nodes.relayState.style.color = config.relayConfigured ? "var(--ok)" : "var(--warn)";
    render();
  } catch {
    nodes.modelName.textContent = "Unavailable";
    nodes.relayState.textContent = "Offline";
  }
}

async function generateEffect(effectId, label) {
  const pendingId = `pending-${effectId}`;
  state.results = state.results.filter((item) => item.effectId !== effectId);
  state.results.push({ id: pendingId, effectId, label, pending: true });
  render();

  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      image: state.sourceImage,
      effectId,
      label,
      intensity: nodes.intensity.value,
    }),
  });
  const payload = await response.json();
  if (!response.ok || payload.error) {
    throw new Error(payload.error || "Generation failed.");
  }

  state.results = state.results.filter((item) => item.id !== pendingId);
  state.results.push(payload.result);
  state.selectedId = payload.result.id;
  saveState();
  render();
}

async function generateAll() {
  if (!state.sourceImage || state.generating) return;
  state.generating = true;
  updateActions();

  for (const [effectId, label] of EFFECTS) {
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
      saveState();
      render();
    }
  }

  state.generating = false;
  render();
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
  saveState();
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
  render();
});
nodes.compareToggle.addEventListener("click", () => {
  nodes.comparePanel.classList.toggle("hidden");
  updateComparePanel();
});

loadState();
render();
loadConfig();
