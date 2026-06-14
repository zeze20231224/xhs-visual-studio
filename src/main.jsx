import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Archive,
  BookOpen,
  Check,
  ChevronDown,
  Copy,
  Download,
  FileText,
  Image,
  LayoutDashboard,
  Palette,
  Plus,
  RefreshCw,
  Save,
  Settings,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import "./styles.css";

const initialPages = [
  {
    title: "孩子越哭，越别急着讲道理",
    subtitle: "情绪崩溃时，父母可以照着说的 5 句话",
    body: "不是纵容，是先让孩子重新听得见你。",
    task: "封面钩子",
    style: "纸雕杂志",
  },
  {
    title: "你以为在教育，他只听见「你不懂我」",
    subtitle: "情绪最满的时候，道理最进不去",
    body: "别哭了 / 你再这样，我就不管你了 / 为什么不听？",
    task: "指出痛点",
    style: "对比结构",
  },
  {
    title: "情绪上头时，大脑听不进道理",
    subtitle: "先恢复安全感，孩子才有能力合作",
    body: "被看见 → 慢慢平静 → 再谈边界",
    task: "解释认知",
    style: "高级白底",
  },
  {
    title: "第一步：先接住情绪",
    subtitle: "不要急着让哭声停止",
    body: "“我看到你现在真的很难受。”\n蹲下来 · 放慢声音 · 少问为什么",
    task: "方法一",
    style: "纸雕杂志",
  },
  {
    title: "第二步：帮孩子说出感受",
    subtitle: "被准确命名的情绪，会慢慢变小",
    body: "“你是不是很失望？”\n“你可以哭，我会陪你一会儿。”",
    task: "方法二",
    style: "情绪标签",
  },
  {
    title: "第三步：温柔，但边界要清楚",
    subtitle: "允许情绪，不允许伤害",
    body: "“你可以生气，但不能打人。”\n接纳感受 + 说清边界 + 提供选择",
    task: "方法三",
    style: "对比结构",
  },
  {
    title: "超市没买玩具，当场崩溃怎么办？",
    subtitle: "一次完整示范，照这个顺序说",
    body: "先连接 → 再边界 → 给选择",
    task: "场景示范",
    style: "情绪分镜",
  },
  {
    title: "先连接，再纠正",
    subtitle: "被理解的孩子，才更有力量学会规则",
    body: "看见 · 命名 · 陪伴 · 边界 · 选择",
    task: "总结引导",
    style: "高级白底",
  },
].map((page, index) => ({
  ...page,
  image: `/assets/pages/${String(index + 1).padStart(2, "0")}.png`,
  prompt: `生成一张 3:4 竖版小红书图文页面。页面任务：${page.task}。主题：${page.title}。采用${page.style}风格，暖米白纸感背景，炭黑现代中文无衬线字体，鼠尾草绿表达连接，低饱和砖红表达冲突或边界。保持标题安全区、手机端可读性和清晰留白；使用克制的纸雕人物或编辑式结构，不要廉价母婴模板、蓝紫渐变、卡通贴纸、文字变形和 PPT 感。`,
}));

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
    <button className="icon-button" aria-label={label} onClick={onClick}>
      {children}
    </button>
  );
}

function App() {
  const [pages, setPages] = useState(() => {
    const saved = localStorage.getItem("xhs-studio-pages");
    return saved ? JSON.parse(saved) : initialPages;
  });
  const [active, setActive] = useState(3);
  const [tab, setTab] = useState("文案");
  const [topic, setTopic] = useState("孩子情绪崩溃时，父母可以照着说的 5 句话");
  const [toast, setToast] = useState("");
  const current = pages[active];

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 1800);
    return () => clearTimeout(timer);
  }, [toast]);

  const progress = useMemo(
    () => Math.round((pages.filter((page) => page.title && page.prompt).length / 8) * 100),
    [pages],
  );

  function updateCurrent(field, value) {
    setPages((items) =>
      items.map((item, index) => (index === active ? { ...item, [field]: value } : item)),
    );
  }

  function saveProject() {
    localStorage.setItem("xhs-studio-pages", JSON.stringify(pages));
    setToast("项目已保存到本机");
  }

  async function copyPrompt() {
    await navigator.clipboard.writeText(current.prompt);
    setToast("本页提示词已复制");
  }

  function applyStyle(item) {
    updateCurrent(
      "prompt",
      `${current.prompt.split("视觉参考：")[0].trim()}\n视觉参考：${item.prompt}。`,
    );
    updateCurrent("style", item.name);
    setToast(`已应用「${item.name}」`);
  }

  function generateBlueprint() {
    const next = initialPages.map((page, index) => ({
      ...page,
      title: index === 0 ? topic.replace(/[。？?]$/, "") : page.title,
    }));
    setPages(next);
    setActive(0);
    setToast("已生成 8 页创作蓝图");
  }

  function exportPack() {
    const content = [
      `# ${topic}`,
      "",
      ...pages.flatMap((page, index) => [
        `## Page ${String(index + 1).padStart(2, "0")}｜${page.task}`,
        `- 标题：${page.title}`,
        `- 副标题：${page.subtitle}`,
        `- 正文：${page.body}`,
        `- 风格：${page.style}`,
        "",
        "### 图像生成提示词",
        page.prompt,
        "",
      ]),
      "## 提示词参考署名",
      "视觉提示词方法参考 YouMind-OpenLab/awesome-gpt-image-2（CC BY 4.0）。",
    ].join("\n");
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "小红书8页创作包.md";
    link.click();
    URL.revokeObjectURL(url);
    setToast("创作包已导出");
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-mark">红</div>
        <nav>
          <button className="nav-item active"><LayoutDashboard size={18} /><span>创作台</span></button>
          <button className="nav-item"><BookOpen size={18} /><span>灵感库</span></button>
          <button className="nav-item"><Archive size={18} /><span>项目</span></button>
        </nav>
        <button className="nav-item settings"><Settings size={18} /><span>设置</span></button>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div>
            <p className="product-name">小红书视觉创作台</p>
            <h1>育儿情绪沟通 · 8 页图文</h1>
          </div>
          <div className="top-actions">
            <button className="button secondary" onClick={saveProject}><Save size={16} />保存项目</button>
            <button className="button primary" onClick={exportPack}><Download size={16} />导出创作包</button>
          </div>
        </header>

        <section className="brief-bar">
          <WandSparkles size={18} />
          <input value={topic} onChange={(event) => setTopic(event.target.value)} />
          <button className="button generate" onClick={generateBlueprint}><Sparkles size={16} />生成创作蓝图</button>
        </section>

        <section className="storyboard">
          <div className="section-heading">
            <div>
              <span>页面故事板</span>
              <small>{progress}% 已完成</small>
            </div>
            <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
          </div>
          <div className="storyboard-list">
            {pages.map((page, index) => (
              <button
                key={page.task}
                className={`story-card ${active === index ? "selected" : ""}`}
                onClick={() => setActive(index)}
              >
                <img src={page.image} alt="" />
                <div>
                  <strong>{String(index + 1).padStart(2, "0")}</strong>
                  <span>{page.task}</span>
                </div>
              </button>
            ))}
            <button className="add-page"><Plus size={18} /><span>加一页</span></button>
          </div>
        </section>

        <section className="editor">
          <div className="outline-panel">
            <div className="panel-title"><FileText size={16} />页面结构</div>
            {pages.map((page, index) => (
              <button
                key={`${page.task}-outline`}
                className={`outline-item ${active === index ? "active" : ""}`}
                onClick={() => setActive(index)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><strong>{page.task}</strong><small>{page.title}</small></div>
                {page.prompt && <Check size={14} />}
              </button>
            ))}
          </div>

          <div className="canvas-panel">
            <div className="canvas-toolbar">
              <span>实时预览</span>
              <div><button>适应画布 <ChevronDown size={13} /></button><IconButton label="刷新预览"><RefreshCw size={15} /></IconButton></div>
            </div>
            <div className="canvas">
              <img src={current.image} alt={`第 ${active + 1} 页预览`} />
            </div>
            <p className="canvas-note">3:4 · 1242 × 1660 · 中文后期排版优先</p>
          </div>

          <div className="inspector">
            <div className="tabs">
              {["文案", "视觉", "提示词"].map((item) => (
                <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{item}</button>
              ))}
            </div>
            {tab === "文案" && (
              <div className="form-stack">
                <label>页面任务<input value={current.task} onChange={(e) => updateCurrent("task", e.target.value)} /></label>
                <label>主标题<textarea rows="3" value={current.title} onChange={(e) => updateCurrent("title", e.target.value)} /></label>
                <label>副标题<textarea rows="2" value={current.subtitle} onChange={(e) => updateCurrent("subtitle", e.target.value)} /></label>
                <label>核心文案<textarea rows="5" value={current.body} onChange={(e) => updateCurrent("body", e.target.value)} /></label>
                <div className="quality-check"><Check size={15} /><span>标题长度适合手机阅读</span></div>
              </div>
            )}
            {tab === "视觉" && (
              <div className="form-stack">
                <label>当前风格<input value={current.style} onChange={(e) => updateCurrent("style", e.target.value)} /></label>
                <div className="token-row"><span>背景</span><i style={{ background: "#f3efe8" }} /><code>#F3EFE8</code></div>
                <div className="token-row"><span>连接</span><i style={{ background: "#82927b" }} /><code>#82927B</code></div>
                <div className="token-row"><span>边界</span><i style={{ background: "#b85c4b" }} /><code>#B85C4B</code></div>
                <div className="visual-rule"><Palette size={16} /><p><strong>视觉导演建议</strong>每页只保留一个视觉任务，封面负责停留，内页负责理解与收藏。</p></div>
              </div>
            )}
            {tab === "提示词" && (
              <div className="form-stack prompt-editor">
                <label>图像生成提示词<textarea rows="15" value={current.prompt} onChange={(e) => updateCurrent("prompt", e.target.value)} /></label>
                <p>已融合画幅、构图、字体、色彩、材质、留白和负面约束。</p>
              </div>
            )}
            <button className="copy-button" onClick={copyPrompt}><Copy size={16} />复制本页生成提示词</button>
          </div>
        </section>

        <section className="inspiration-panel">
          <div className="inspiration-heading">
            <div><Image size={17} /><span>视觉灵感库</span><small>选择成熟提示词结构，应用到当前页</small></div>
            <a href="https://github.com/YouMind-OpenLab/awesome-gpt-image-2" target="_blank" rel="noreferrer">来源：YouMind OpenLab · CC BY 4.0</a>
          </div>
          <div className="inspiration-grid">
            {inspiration.map((item) => (
              <article key={item.name} className="inspiration-card">
                <div className="swatch-art">
                  {item.colors.map((color) => <span key={color} style={{ background: color }} />)}
                </div>
                <div><strong>{item.name}</strong><p>{item.desc}</p></div>
                <button onClick={() => applyStyle(item)}>应用到本页</button>
              </article>
            ))}
          </div>
        </section>
      </main>
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
