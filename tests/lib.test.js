import test from "node:test";
import assert from "node:assert/strict";
import { classicScenes } from "../src/data/classicScenes.js";
import { buildClassicPages, buildClassicVideo, buildGenericPages, buildGenericVideo, buildReadingVideo, initialPages } from "../src/lib/content.js";
import { buildPrompt, refreshPage } from "../src/lib/prompts.js";
import { normalizePage, normalizePages, normalizeScene, parseProject, PROJECT_SCHEMA, readJson } from "../src/lib/storage.js";
import { buildDouyinMarkdown, buildXhsMarkdown, filenameSlug } from "../src/lib/exporters.js";

test("readJson survives missing, blocked and corrupt storage", () => {
  assert.equal(readJson("missing"), null);
  globalThis.localStorage = { getItem: () => "{not json" };
  assert.equal(readJson("k"), null);
  globalThis.localStorage = { getItem: () => { throw new Error("blocked"); } };
  assert.equal(readJson("k"), null);
  delete globalThis.localStorage;
});

test("normalizePage fills missing fields and rejects non-objects", () => {
  assert.equal(normalizePage(null), null);
  const page = normalizePage({ title: "标题" });
  assert.equal(page.body, "");
  assert.ok(page.prompt.includes("标题"));
  assert.equal(normalizePages([{ title: "a" }, 5]), null);
  assert.equal(normalizePages([]), null);
});

test("hand-edited legacy prompts are preserved, derived ones are refreshed", () => {
  const base = { title: "t", subtitle: "s", body: "b", task: "k", style: "x" };
  const custom = normalizePage({ ...base, prompt: "我自己写的" });
  assert.equal(custom.promptCustom, true);
  assert.equal(custom.prompt, "我自己写的");
  const derived = normalizePage({ ...base, prompt: buildPrompt({ ...base, tone: "life" }) });
  assert.equal(derived.promptCustom, false);
});

test("editing fields regenerates the prompt unless it was customised", () => {
  const page = normalizePage({ title: "旧", subtitle: "s", body: "b", task: "k", style: "x" });
  assert.ok(refreshPage({ ...page, title: "新标题" }).prompt.includes("新标题"));
  const custom = { ...page, promptCustom: true, prompt: "keep" };
  assert.equal(refreshPage({ ...custom, title: "新标题" }).prompt, "keep");
});

test("parseProject rejects malformed files with a reason", () => {
  const ok = { schema: PROJECT_SCHEMA, schemaVersion: 1, pages: [{ title: "a" }], scenes: [{ time: "0-3s" }] };
  const project = parseProject({ ...ok, duration: 99, active: 50, mode: "weird" });
  assert.equal(project.duration, 30);
  assert.equal(project.active, 0);
  assert.equal(project.mode, "xhs");
  assert.throws(() => parseProject(null), /项目文件/);
  assert.throws(() => parseProject({ ...ok, schema: "x" }), /项目文件/);
  assert.throws(() => parseProject({ ...ok, schemaVersion: 9 }), /更新版本/);
  assert.throws(() => parseProject({ ...ok, pages: [1] }), /图文页/);
  assert.throws(() => parseProject({ ...ok, scenes: "no" }), /分镜/);
});

test("generators produce complete, consistent content", () => {
  assert.equal(initialPages.length, 8);
  assert.equal(buildGenericPages("测试。").length, 8);
  for (const duration of [15, 30, 60]) {
    const expected = duration === 15 ? 4 : duration === 30 ? 6 : 9;
    assert.equal(buildGenericVideo("主题", duration).length, expected);
    assert.equal(buildReadingVideo(duration).length > 0, true);
    for (const scene of classicScenes) {
      const scenes = buildClassicVideo(scene, duration);
      assert.equal(scenes.length, expected);
      assert.ok(scenes.every((item) => item.voiceover && item.prompt.includes("宣纸")));
    }
  }
});

test("every classical scene drives an 8-page classic blueprint", () => {
  for (const scene of classicScenes) {
    const pages = buildClassicPages(scene);
    assert.equal(pages.length, 8);
    assert.ok(pages.every((page) => page.tone === "classic" && page.prompt.includes(scene.visualPrompt)));
    assert.ok(!pages.some((page) => page.prompt.includes("母婴")));
  }
});

test("scene normalisation keeps index in prompt", () => {
  const scene = normalizeScene({ time: "0-3s", visual: "v", camera: "c", subtitle: "s" }, 2);
  assert.ok(scene.prompt.includes("镜头 3"));
});

test("exports include attribution and sane file names", () => {
  assert.ok(buildXhsMarkdown("t", initialPages).includes("CC BY 4.0"));
  assert.ok(buildDouyinMarkdown("t", 30, buildReadingVideo(30)).includes("CC BY 4.0"));
  assert.equal(filenameSlug('a/b:c "d"'), "a-b-c-d");
  assert.equal(filenameSlug("   "), "project");
});
