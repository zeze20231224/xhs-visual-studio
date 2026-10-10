import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Archive,
  BookOpen,
  Check,
  Copy,
  Download,
  FileText,
  Image,
  Images,
  LayoutDashboard,
  Mic2,
  Palette,
  Play,
  Plus,
  RotateCcw,
  Save,
  Sparkles,
  TriangleAlert,
  Trash2,
  Upload,
  Video,
  WandSparkles,
} from "lucide-react";
import "./styles.css";
import { classicCategories, classicScenes } from "./data/classicScenes.js";
import {
  buildClassicPages,
  buildClassicVideo,
  buildGenericPages,
  buildGenericVideo,
  buildReadingVideo,
  initialPages,
  isReadingTopic,
  readingHabitPages,
} from "./lib/content.js";
import { refreshPage, refreshScene } from "./lib/prompts.js";
import {
  DURATIONS,
  MAX_PAGES,
  PROJECT_SCHEMA,
  PROJECT_SCHEMA_VERSION,
  loadPages,
  loadScenes,
  parseProject,
  readJson,
  writeJson,
} from "./lib/storage.js";
import {
  buildDouyinMarkdown,
  buildXhsMarkdown,
  copyText,
  downloadFile,
  filenameSlug,
} from "./lib/exporters.js";

const APP_VERSION = "0.3.4";
const STORAGE_KEY = "xhs-studio-pages-v2";
const VIDEO_STORAGE_KEY = "xhs-studio-video-v1";
const META_STORAGE_KEY = "xhs-studio-meta-v1";
const DEFAULT_TOPIC = "孩子情绪崩溃时，父母可以照着说的 5 句话";
const TITLE_LIMIT = 20;

const inspiration = [
  {
    name: "纸雕杂志",
    desc: "温暖、可信、适合亲子与生活方式",
    colors: ["#e9e0d0", "#849279", "#b75b49"],
    prompt: "分层纸雕人物、米白纤维纸、自然阴影、编辑式大标题",
  },
  {
    name: "高级白底",
    desc: "理性、克制、适合认知与总结",
    colors: ["#f7f5ef", "#292927", "#a7a097"],
    prompt: "大量留白、杂志专栏网格、细线分割、黑灰字重层级",
  },
  {
    name: "情绪分镜",
    desc: "场景化叙事，降低理解成本",
    colors: ["#eee6d8", "#6f8066", "#d4c3a7"],
    prompt: "三至五格连续叙事、人物动作清楚、对白极少、节奏递进",
  },
  {
    name: "对比结构",
    desc: "错误与正确并置，增强收藏价值",
    colors: ["#b85c4b", "#f3efe8", "#82927b"],
    prompt: "低饱和红绿语义分区、清楚边界、短句卡片、避免考试卷感",
  },
];

function IconButton({ children, label, onClick }) {
  return (
    <button type="button" className="icon-button" aria-label={label} onClick={onClick}>
      {children}
    </button>
  );
}

function PagePreview({ page, index, total, compact = false }) {
  const lines = page.body.split("\n").filter(Boolean);

  return (
    <div className={`page-preview ${compact ? "compact" : ""} page-tone-${index % 4}`}>
      <div className="preview-topline">
        <span>{String(index + 1).padStart(2, "0")}</span>
        <em>{page.task}</em>
      </div>
      <div className="preview-copy">
        <h2>{page.title}</h2>
        <p className="preview-subtitle">{page.subtitle}</p>
        <div className="preview-divider" />
        <div className="preview-body">
          {lines.map((line, lineIndex) => <p key={lineIndex}>{line}</p>)}
        </div>
      </div>
      <div className="preview-motif" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <small>{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</small>
    </div>
  );
}

function VideoPreview({ scene, index, total, compact = false }) {
  return (
    <div className={`video-preview ${compact ? "compact" : ""} video-tone-${index % 4}`}>
      <div className="video-status">
        <span><Play size={compact ? 7 : 12} fill="currentColor" /> REC</span>
        <em>{scene.time}</em>
      </div>
      <div className="video-scene-art" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="video-copy">
        <small>{scene.task}</small>
        <h2>{scene.subtitle}</h2>
        <p>{scene.voiceover}</p>
      </div>
      <div className="video-caption">{scene.subtitle}</div>
      <div className="video-progress"><span style={{ width: `${((index + 1) / total) * 100}%` }} /></div>
    </div>
  );
}

function App() {
  const fileInputRef = useRef(null);
  const storyboardRef = useRef(null);
  const classicRef = useRef(null);
  const meta = useMemo(() => readJson(META_STORAGE_KEY) ?? {}, []);
  const [mode, setMode] = useState("xhs");
  const [pages, setPages] = useState(() => loadPages(STORAGE_KEY, initialPages));
  const [duration, setDuration] = useState(DURATIONS.includes(meta.duration) ? meta.duration : 30);
  const [scenes, setScenes] = useState(() => loadScenes(VIDEO_STORAGE_KEY, buildReadingVideo(30)));
  const [active, setActive] = useState(0);
  const [activeScene, setActiveScene] = useState(0);
  const [tab, setTab] = useState("文案");
  const [classicCategory, setClassicCategory] = useState("全部");
  const [topic, setTopic] = useState(typeof meta.topic === "string" && meta.topic ? meta.topic : DEFAULT_TOPIC);
  // Remembers which classical scene the topic was seeded from, so "generate" can use it.
  const [seed, setSeed] = useState(() => (meta.seed && typeof meta.seed.id === "string" ? meta.seed : null));
  const [dirty, setDirty] = useState(false);
  const [toast, setToast] = useState("");
  const [saveState, setSaveState] = useState("idle");
  const current = mode === "xhs" ? pages[active] : scenes[activeScene];
  const filteredClassicScenes = useMemo(
    () => classicCategory === "全部"
      ? classicScenes
      : classicScenes.filter((scene) => scene.category === classicCategory),
    [classicCategory],
  );

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  // Autosave: edits are persisted shortly after they stop, so a refresh never loses work.
  useEffect(() => {
    const timer = setTimeout(() => {
      const ok = writeJson(STORAGE_KEY, pages)
        && writeJson(VIDEO_STORAGE_KEY, scenes)
        && writeJson(META_STORAGE_KEY, { topic, duration, seed });
      setSaveState(ok ? "saved" : "failed");
    }, 500);
    return () => clearTimeout(timer);
  }, [pages, scenes, topic, duration, seed]);

  const progress = useMemo(
    () => mode === "xhs"
      ? Math.round((pages.filter((page) => page.title && page.prompt).length / pages.length) * 100)
      : Math.round((scenes.filter((scene) => scene.voiceover && scene.prompt).length / scenes.length) * 100),
    [mode, pages, scenes],
  );

  function confirmOverwrite() {
    return !dirty || window.confirm("当前有未导出的手动修改，继续会被新内容覆盖。要继续吗？");
  }

  function seededClassicScene() {
    return seed && seed.topic === topic ? classicScenes.find((scene) => scene.id === seed.id) : null;
  }

  function buildVideoFor(nextDuration) {
    const classic = seededClassicScene();
    if (classic) return buildClassicVideo(classic, nextDuration);
    return isReadingTopic(topic) ? buildReadingVideo(nextDuration) : buildGenericVideo(topic, nextDuration);
  }

  function updateCurrent(field, value) {
    setDirty(true);
    if (mode === "xhs") {
      setPages((items) =>
        items.map((item, index) => {
          if (index !== active) return item;
          const next = { ...item, [field]: value };
          if (field === "prompt") return { ...next, promptCustom: true };
          return refreshPage(next);
        }),
      );
      return;
    }
    setScenes((items) =>
      items.map((item, index) => {
        if (index !== activeScene) return item;
        const next = { ...item, [field]: value };
        if (field === "prompt") return { ...next, promptCustom: true };
        return refreshScene(next, index);
      }),
    );
  }

  function resetPrompt() {
    setDirty(true);
    if (mode === "xhs") {
      setPages((items) => items.map((item, index) => (index === active ? refreshPage({ ...item, promptCustom: false }) : item)));
    } else {
      setScenes((items) => items.map((item, index) => (index === activeScene ? refreshScene({ ...item, promptCustom: false }, index) : item)));
    }
    setToast("已恢复为自动生成的提示词");
  }

  function saveProject() {
    const ok = writeJson(STORAGE_KEY, pages)
      && writeJson(VIDEO_STORAGE_KEY, scenes)
      && writeJson(META_STORAGE_KEY, { topic, duration, seed });
    setSaveState(ok ? "saved" : "failed");
    setToast(ok ? "项目已保存到本机" : "保存失败：浏览器禁用了本地存储，请使用「导出 JSON」备份");
  }

  function exportProjectJson() {
    const content = JSON.stringify({
      schema: PROJECT_SCHEMA,
      schemaVersion: PROJECT_SCHEMA_VERSION,
      appVersion: APP_VERSION,
      exportedAt: new Date().toISOString(),
      mode,
      topic,
      duration,
      active,
      activeScene,
      pages,
      scenes,
    }, null, 2);
    downloadFile(
      `xhs-visual-studio-project-${new Date().toISOString().slice(0, 10)}.json`,
      content,
      "application/json;charset=utf-8",
    );
    setDirty(false);
    setToast("项目 JSON 已导出");
  }

  async function importProjectJson(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      if (file.size > 5 * 1024 * 1024) throw new Error("文件过大，不像是项目文件");
      if (!confirmOverwrite()) return;
      const project = parseProject(JSON.parse(await file.text()));
      setMode(project.mode);
      setTopic(project.topic);
      setSeed(null);
      setDuration(project.duration);
      setPages(project.pages);
      setScenes(project.scenes);
      setActive(project.active);
      setActiveScene(project.activeScene);
      setDirty(false);
      setToast("项目 JSON 已导入");
    } catch (error) {
      const reason = error instanceof SyntaxError ? "文件不是有效的 JSON" : error.message;
      setToast(`导入失败：${reason}`);
    } finally {
      event.target.value = "";
    }
  }

  async function copyPrompt() {
    setToast((await copyText(current.prompt)) ? "本页提示词已复制" : "复制失败：请在提示词框中手动复制");
  }

  function applyStyle(item) {
    setDirty(true);
    setPages((items) =>
      items.map((page, index) => (
        index === active ? refreshPage({ ...page, style: item.name, styleRef: item.prompt }) : page
      )),
    );
    setToast(`已应用「${item.name}」`);
  }

  function addPage() {
    if (pages.length >= MAX_PAGES) {
      setToast(`最多 ${MAX_PAGES} 页`);
      return;
    }
    const base = pages[active] ?? pages[pages.length - 1];
    const page = refreshPage({
      title: "新页面标题",
      subtitle: "一句话说明这一页",
      body: "在这里写这一页的核心内容",
      task: "补充页",
      style: base.style,
      tone: base.tone,
      imagery: base.imagery,
      styleRef: "",
      promptCustom: false,
    });
    setDirty(true);
    setPages((items) => [...items.slice(0, active + 1), page, ...items.slice(active + 1)]);
    setActive(active + 1);
    setTab("文案");
  }

  function removePage() {
    if (pages.length <= 1) return;
    if (!window.confirm("删除当前页？")) return;
    setDirty(true);
    setPages((items) => items.filter((_, index) => index !== active));
    setActive(Math.max(active - 1, 0));
  }

  function generateBlueprint() {
    if (!confirmOverwrite()) return;
    const classic = seededClassicScene();
    if (mode === "douyin") {
      const nextScenes = buildVideoFor(duration);
      setScenes(nextScenes);
      setActiveScene(0);
      setDirty(false);
      setToast(`已生成 ${duration} 秒抖音脚本与 ${nextScenes.length} 个镜头`);
      return;
    }
    const next = classic
      ? buildClassicPages(classic)
      : isReadingTopic(topic) ? readingHabitPages : buildGenericPages(topic);
    setPages(next);
    setActive(0);
    setDirty(false);
    setToast(classic ? `已按《${classic.title}》生成 ${next.length} 页内容` : isReadingTopic(topic) ? "已生成「阅读习惯」8 页完整内容" : "已生成 8 页通用创作蓝图");
  }

  function changeDuration(item) {
    if (item === duration) return;
    if (!confirmOverwrite()) return;
    setDuration(item);
    setScenes(buildVideoFor(item));
    setActiveScene(0);
    setDirty(false);
  }

  function useClassicScene(scene) {
    if (!confirmOverwrite()) return;
    const nextTopic = `${scene.title}｜${scene.xhsAngle}`;
    setTopic(nextTopic);
    setSeed({ id: scene.id, topic: nextTopic });
    setMode("xhs");
    setTab("文案");
    setPages(buildClassicPages(scene));
    setScenes(buildClassicVideo(scene, duration));
    setActive(0);
    setActiveScene(0);
    setDirty(false);
    setToast(`已按「${scene.title}」生成 8 页，并同步准备好 ${duration} 秒脚本`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function copyClassicPrompt(scene) {
    setToast((await copyText(scene.visualPrompt)) ? "古典视觉提示词已复制" : "复制失败，请手动选择文字复制");
  }

  function exportPack() {
    const slug = filenameSlug(topic);
    if (mode === "douyin") {
      downloadFile(`抖音拍摄清单-${slug}.md`, buildDouyinMarkdown(topic, duration, scenes), "text/markdown;charset=utf-8");
      setDirty(false);
      setToast("抖音拍摄清单已导出");
      return;
    }
    downloadFile(`小红书${pages.length}页创作包-${slug}.md`, buildXhsMarkdown(topic, pages), "text/markdown;charset=utf-8");
    setDirty(false);
    setToast("创作包已导出");
  }

  const titleTooLong = mode === "xhs" && current.title.length > TITLE_LIMIT;
  const scrollTo = (ref) => ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-mark">{mode === "xhs" ? "红" : "抖"}</div>
        <nav aria-label="页面导航">
          <button type="button" className="nav-item active" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><LayoutDashboard size={18} /><span>创作台</span></button>
          <button type="button" className="nav-item" onClick={() => scrollTo(classicRef)}><BookOpen size={18} /><span>灵感库</span></button>
          <button type="button" className="nav-item" onClick={() => scrollTo(storyboardRef)}><Archive size={18} /><span>故事板</span></button>
        </nav>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div>
            <p className="product-name">社交内容创作台 <span>v{APP_VERSION}</span></p>
            <h1>
              {mode === "xhs"
                ? `${pages[0]?.title || "小红书主题"} · ${pages.length} 页图文`
                : `${topic || "抖音主题"} · ${duration} 秒短视频`}
            </h1>
            <p className={`save-state ${saveState}`} role="status">
              {saveState === "saved" && "已自动保存到本机"}
              {saveState === "failed" && "本地存储不可用：请定期「导出 JSON」备份"}
            </p>
          </div>
          <div className="top-actions">
            <button type="button" className="button secondary" onClick={saveProject}><Save size={16} />保存项目</button>
            <button type="button" className="button secondary" onClick={() => fileInputRef.current?.click()}>
              <Upload size={16} />导入项目
            </button>
            <button type="button" className="button secondary" onClick={exportProjectJson}>
              <Download size={16} />导出 JSON
            </button>
            <button type="button" className="button primary" onClick={exportPack}>
              <Download size={16} />{mode === "xhs" ? "导出创作包" : "导出拍摄清单"}
            </button>
          </div>
        </header>

        <section className="mode-switcher" aria-label="创作平台">
          <button type="button" className={mode === "xhs" ? "active" : ""} onClick={() => { setMode("xhs"); setTab("文案"); }}>
            <Images size={17} />
            <span><strong>小红书图文</strong><small>3:4 · {pages.length} 页轮播</small></span>
          </button>
          <button type="button" className={mode === "douyin" ? "active" : ""} onClick={() => { setMode("douyin"); setTab("脚本"); }}>
            <Video size={17} />
            <span><strong>抖音短视频</strong><small>9:16 · 分镜口播</small></span>
          </button>
          {mode === "douyin" && (
            <div className="duration-picker">
              <span>视频时长</span>
              {DURATIONS.map((item) => (
                <button
                  type="button"
                  key={item}
                  className={duration === item ? "active" : ""}
                  onClick={() => changeDuration(item)}
                >
                  {item}s
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="brief-bar">
          <WandSparkles size={18} />
          <input aria-label="创作主题" value={topic} maxLength={200} onChange={(event) => setTopic(event.target.value)} />
          <button type="button" className="button generate" onClick={generateBlueprint}>
            <Sparkles size={16} />{mode === "xhs" ? "生成创作蓝图" : "生成短视频脚本"}
          </button>
        </section>

        <section className="storyboard" ref={storyboardRef}>
          <div className="section-heading">
            <div>
              <span>{mode === "xhs" ? "页面故事板" : "镜头时间轴"}</span>
              <small>{progress}% 已完成</small>
            </div>
            <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
          </div>
          <div className="storyboard-list">
            {mode === "xhs" ? (
              <>
                {pages.map((page, index) => (
                  <button
                    type="button"
                    key={index}
                    className={`story-card ${active === index ? "selected" : ""}`}
                    onClick={() => setActive(index)}
                  >
                    <PagePreview page={page} index={index} total={pages.length} compact />
                    <div>
                      <strong>{String(index + 1).padStart(2, "0")}</strong>
                      <span>{page.task}</span>
                    </div>
                  </button>
                ))}
                <button type="button" className="add-page" onClick={addPage} disabled={pages.length >= MAX_PAGES}>
                  <Plus size={18} /><span>加一页</span>
                </button>
              </>
            ) : (
              scenes.map((scene, index) => (
                <button
                  type="button"
                  key={index}
                  className={`story-card video-story-card ${activeScene === index ? "selected" : ""}`}
                  onClick={() => setActiveScene(index)}
                >
                  <VideoPreview scene={scene} index={index} total={scenes.length} compact />
                  <div>
                    <strong>{scene.time}</strong>
                    <span>{scene.task}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </section>

        <section className="editor">
          <div className="outline-panel">
            <div className="panel-title">
              {mode === "xhs" ? <FileText size={16} /> : <Video size={16} />}
              {mode === "xhs" ? "页面结构" : "分镜结构"}
            </div>
            {mode === "xhs"
              ? pages.map((page, index) => (
                  <button
                    type="button"
                    key={index}
                    className={`outline-item ${active === index ? "active" : ""}`}
                    onClick={() => setActive(index)}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div><strong>{page.task}</strong><small>{page.title}</small></div>
                    {page.prompt && <Check size={14} />}
                  </button>
                ))
              : scenes.map((scene, index) => (
                  <button
                    type="button"
                    key={index}
                    className={`outline-item ${activeScene === index ? "active" : ""}`}
                    onClick={() => setActiveScene(index)}
                  >
                    <span>{scene.time}</span>
                    <div><strong>{scene.task}</strong><small>{scene.subtitle}</small></div>
                    {scene.prompt && <Check size={14} />}
                  </button>
                ))}
          </div>

          <div className="canvas-panel">
            <div className="canvas-toolbar">
              <span>{mode === "xhs" ? "实时预览" : "9:16 分镜预览"}</span>
            </div>
            <div className="canvas">
              {mode === "xhs"
                ? <PagePreview page={current} index={active} total={pages.length} />
                : <VideoPreview scene={current} index={activeScene} total={scenes.length} />}
            </div>
            <p className="canvas-note">
              {mode === "xhs"
                ? "3:4 · 1242 × 1660 · 中文后期排版优先"
                : `9:16 · 1080 × 1920 · ${duration} 秒 · 字幕安全区`}
            </p>
          </div>

          <div className="inspector">
            <div className="tabs" role="tablist">
              {(mode === "xhs" ? ["文案", "视觉", "提示词"] : ["脚本", "画面", "提示词"]).map((item) => (
                <button type="button" role="tab" aria-selected={tab === item} key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{item}</button>
              ))}
            </div>
            {mode === "xhs" && tab === "文案" && (
              <div className="form-stack">
                <label>页面任务<input value={current.task} onChange={(e) => updateCurrent("task", e.target.value)} /></label>
                <label>主标题<textarea rows="3" value={current.title} onChange={(e) => updateCurrent("title", e.target.value)} /></label>
                <label>副标题<textarea rows="2" value={current.subtitle} onChange={(e) => updateCurrent("subtitle", e.target.value)} /></label>
                <label>核心文案<textarea rows="5" value={current.body} onChange={(e) => updateCurrent("body", e.target.value)} /></label>
                <div className={`quality-check ${titleTooLong ? "warn" : ""}`}>
                  {titleTooLong ? <TriangleAlert size={15} /> : <Check size={15} />}
                  <span>
                    {titleTooLong
                      ? `标题 ${current.title.length} 字，超过 ${TITLE_LIMIT} 字，手机端可能折行过多`
                      : `标题 ${current.title.length} 字，长度适合手机阅读`}
                  </span>
                </div>
                <button type="button" className="danger-link" onClick={removePage} disabled={pages.length <= 1}>
                  <Trash2 size={14} />删除本页
                </button>
              </div>
            )}
            {mode === "xhs" && tab === "视觉" && (
              <div className="form-stack">
                <label>当前风格<input value={current.style} onChange={(e) => updateCurrent("style", e.target.value)} /></label>
                {current.tone === "classic" ? (
                  <>
                    <div className="token-row"><span>宣纸</span><i style={{ background: "#efe6d2" }} /><code>#EFE6D2</code></div>
                    <div className="token-row"><span>青绿</span><i style={{ background: "#6f8f82" }} /><code>#6F8F82</code></div>
                    <div className="token-row"><span>朱砂</span><i style={{ background: "#b8402f" }} /><code>#B8402F</code></div>
                  </>
                ) : (
                  <>
                    <div className="token-row"><span>背景</span><i style={{ background: "#f3efe8" }} /><code>#F3EFE8</code></div>
                    <div className="token-row"><span>连接</span><i style={{ background: "#82927b" }} /><code>#82927B</code></div>
                    <div className="token-row"><span>边界</span><i style={{ background: "#b85c4b" }} /><code>#B85C4B</code></div>
                  </>
                )}
                <div className="visual-rule"><Palette size={16} /><p><strong>视觉导演建议</strong>每页只保留一个视觉任务，封面负责停留，内页负责理解与收藏。</p></div>
              </div>
            )}
            {mode === "douyin" && tab === "脚本" && (
              <div className="form-stack">
                <label>镜头任务<input value={current.task} onChange={(e) => updateCurrent("task", e.target.value)} /></label>
                <label>时间段<input value={current.time} onChange={(e) => updateCurrent("time", e.target.value)} /></label>
                <label>口播文案<textarea rows="6" value={current.voiceover} onChange={(e) => updateCurrent("voiceover", e.target.value)} /></label>
                <label>屏幕字幕<textarea rows="3" value={current.subtitle} onChange={(e) => updateCurrent("subtitle", e.target.value)} /></label>
                <div className="quality-check"><Mic2 size={15} /><span>短句口播，适合自然停顿和字幕切分</span></div>
              </div>
            )}
            {mode === "douyin" && tab === "画面" && (
              <div className="form-stack">
                <label>画面内容<textarea rows="7" value={current.visual} onChange={(e) => updateCurrent("visual", e.target.value)} /></label>
                <label>镜头运动<input value={current.camera} onChange={(e) => updateCurrent("camera", e.target.value)} /></label>
                <div className="visual-rule"><Video size={16} /><p><strong>短视频导演建议</strong>前 3 秒先给冲突或结果；每个镜头只讲一个信息点，字幕不复述整段口播。</p></div>
              </div>
            )}
            {tab === "提示词" && (
              <div className="form-stack prompt-editor">
                <label>{mode === "xhs" ? "图像生成提示词" : "视频镜头生成提示词"}<textarea rows="15" value={current.prompt} onChange={(e) => updateCurrent("prompt", e.target.value)} /></label>
                <p>
                  {current.promptCustom
                    ? "已手动编辑：修改文案时不会再覆盖这段提示词。"
                    : "自动生成：修改文案、风格后会同步更新；手动编辑后将不再自动覆盖。"}
                </p>
                {current.promptCustom && (
                  <button type="button" className="danger-link" onClick={resetPrompt}>
                    <RotateCcw size={14} />恢复为自动生成
                  </button>
                )}
              </div>
            )}
            <button type="button" className="copy-button" onClick={copyPrompt}>
              <Copy size={16} />复制{mode === "xhs" ? "本页" : "本镜头"}生成提示词
            </button>
          </div>
        </section>

        <section className="inspiration-panel">
          <div className="inspiration-heading">
            <div>
              {mode === "xhs" ? <Image size={17} /> : <Video size={17} />}
              <span>{mode === "xhs" ? "视觉灵感库" : "短视频节奏建议"}</span>
              <small>{mode === "xhs" ? "选择成熟提示词结构，应用到当前页" : "镜头、口播和字幕共同服务完播率"}</small>
            </div>
            <a href="https://github.com/YouMind-OpenLab/awesome-gpt-image-2" target="_blank" rel="noreferrer">来源：YouMind OpenLab · CC BY 4.0</a>
          </div>
          {mode === "xhs" ? (
            <div className="inspiration-grid">
              {inspiration.map((item) => (
                <article key={item.name} className="inspiration-card">
                  <div className="swatch-art">
                    {item.colors.map((color) => <span key={color} style={{ background: color }} />)}
                  </div>
                  <div><strong>{item.name}</strong><p>{item.desc}</p></div>
                  <button type="button" onClick={() => applyStyle(item)}>应用到本页</button>
                </article>
              ))}
            </div>
          ) : (
            <div className="video-tips-grid">
              <article><strong>前 3 秒</strong><p>直接给问题、反差或结果，不做自我介绍。</p></article>
              <article><strong>口播节奏</strong><p>每句 12-22 字，重要词前后留半拍停顿。</p></article>
              <article><strong>字幕策略</strong><p>字幕提炼关键词，不要把整段口播全部堆上屏。</p></article>
              <article><strong>结尾动作</strong><p>只保留一个 CTA：收藏、评论或立即尝试。</p></article>
            </div>
          )}
        </section>

        <section className="classic-panel" ref={classicRef}>
          <div className="classic-heading">
            <div>
              <BookOpen size={17} />
              <span>古典素材库</span>
              <small>诗经、楚辞、唐诗、宋词与古典名著名场面</small>
            </div>
            <span>{filteredClassicScenes.length} 条素材</span>
          </div>
          <div className="classic-filters" aria-label="古典素材分类">
            {["全部", ...classicCategories].map((category) => (
              <button
                type="button"
                key={category}
                className={classicCategory === category ? "active" : ""}
                onClick={() => setClassicCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="classic-grid">
            {filteredClassicScenes.map((scene) => (
              <article className="classic-card" key={scene.id}>
                <div className="classic-card-top">
                  <span>{scene.category}</span>
                  <small>{scene.dynasty} · {scene.author}</small>
                </div>
                <h3>{scene.title}</h3>
                <p className="classic-source">{scene.source}</p>
                <p>{scene.scene}</p>
                <div className="classic-tags">
                  {scene.themes.map((theme) => <span key={theme}>{theme}</span>)}
                </div>
                <div className="classic-actions">
                  <button type="button" onClick={() => useClassicScene(scene)}>按此素材生成</button>
                  <button type="button" onClick={() => copyClassicPrompt(scene)}>复制视觉提示词</button>
                </div>
              </article>
            ))}
          </div>
        </section>
        <footer className="app-footer">
          <span>社交内容创作台 · 小红书 + 抖音 · 开源基础版</span>
          <a
            href="https://github.com/zeze20231224/xhs-visual-studio"
            target="_blank"
            rel="noreferrer"
          >
            GitHub · AGPL-3.0
          </a>
        </footer>
      </main>
      <input
        ref={fileInputRef}
        className="file-input"
        type="file"
        accept="application/json,.json"
        aria-label="导入项目文件"
        onChange={importProjectJson}
      />
      <div className="toast-region" role="status" aria-live="polite">
        {toast && <div className="toast">{toast}</div>}
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register(`${import.meta.env.BASE_URL}sw.js?v=${APP_VERSION}`)
      .catch(() => {
        // PWA support should never block the editor itself.
      });
  });
}
