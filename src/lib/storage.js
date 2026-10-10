import { buildPrompt, buildScenePrompt } from "./prompts.js";

export const PROJECT_SCHEMA = "xhs-visual-studio-project";
export const PROJECT_SCHEMA_VERSION = 1;
export const DURATIONS = [15, 30, 60];
export const MAX_PAGES = 12;

const str = (value, fallback = "") => (typeof value === "string" ? value : fallback);
const tone = (value) => (value === "classic" ? "classic" : "life");

export function normalizePage(raw) {
  if (!raw || typeof raw !== "object") return null;
  const page = {
    title: str(raw.title),
    subtitle: str(raw.subtitle),
    body: str(raw.body),
    task: str(raw.task, "页面"),
    style: str(raw.style, "纸雕杂志"),
    tone: tone(raw.tone),
    imagery: str(raw.imagery),
    styleRef: str(raw.styleRef),
  };
  const prompt = str(raw.prompt);
  // Data saved by older versions has no flag: a prompt that differs from the derived one was hand-edited.
  const custom = typeof raw.promptCustom === "boolean" ? raw.promptCustom : Boolean(prompt) && prompt !== buildPrompt(page);
  return { ...page, promptCustom: custom, prompt: custom && prompt ? prompt : buildPrompt(page) };
}

export function normalizeScene(raw, index) {
  if (!raw || typeof raw !== "object") return null;
  const scene = {
    time: str(raw.time, "0-0s"),
    task: str(raw.task, "镜头"),
    visual: str(raw.visual),
    camera: str(raw.camera),
    voiceover: str(raw.voiceover),
    subtitle: str(raw.subtitle),
    tone: tone(raw.tone),
    styleRef: str(raw.styleRef),
  };
  const prompt = str(raw.prompt);
  const custom = typeof raw.promptCustom === "boolean" ? raw.promptCustom : Boolean(prompt) && prompt !== buildScenePrompt(scene, index);
  return { ...scene, promptCustom: custom, prompt: custom && prompt ? prompt : buildScenePrompt(scene, index) };
}

// Returns a clean array, or null when the input is not usable at all.
export function normalizePages(list) {
  if (!Array.isArray(list) || !list.length) return null;
  const pages = list.slice(0, MAX_PAGES).map(normalizePage);
  return pages.every(Boolean) ? pages : null;
}

export function normalizeScenes(list) {
  if (!Array.isArray(list) || !list.length) return null;
  const scenes = list.slice(0, 12).map(normalizeScene);
  return scenes.every(Boolean) ? scenes : null;
}

export function clampIndex(value, length) {
  const number = Math.trunc(Number(value));
  if (!Number.isFinite(number)) return 0;
  return Math.min(Math.max(number, 0), Math.max(length - 1, 0));
}

function getStorage() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

export function readJson(key) {
  try {
    const raw = getStorage()?.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Returns true when the write succeeded (quota, private mode and blocked storage all fail quietly).
export function writeJson(key, value) {
  try {
    const storage = getStorage();
    if (!storage) return false;
    storage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function loadPages(key, fallback) {
  return normalizePages(readJson(key)) ?? fallback;
}

export function loadScenes(key, fallback) {
  return normalizeScenes(readJson(key)) ?? fallback;
}

// Validates an imported project file. Throws an Error with a user-facing reason.
export function parseProject(payload) {
  if (!payload || typeof payload !== "object" || payload.schema !== PROJECT_SCHEMA) {
    throw new Error("不是本工具导出的项目文件");
  }
  if (Number(payload.schemaVersion) > PROJECT_SCHEMA_VERSION) {
    throw new Error("项目文件来自更新版本，请先更新工具");
  }
  const pages = normalizePages(payload.pages);
  if (!pages) throw new Error("项目文件中的图文页数据无效");
  const scenes = normalizeScenes(payload.scenes);
  if (!scenes) throw new Error("项目文件中的分镜数据无效");

  const duration = DURATIONS.includes(payload.duration) ? payload.duration : 30;
  return {
    mode: payload.mode === "douyin" ? "douyin" : "xhs",
    topic: str(payload.topic).slice(0, 200) || "导入的创作主题",
    duration,
    pages,
    scenes,
    active: clampIndex(payload.active, pages.length),
    activeScene: clampIndex(payload.activeScene, scenes.length),
  };
}
