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

function buildPrompt(page) {
  return `生成一张 3:4 竖版小红书图文页面。页面任务：${page.task}。主标题：${page.title}。副标题：${page.subtitle}。核心内容：${page.body.replaceAll("\n", "；")}。采用${page.style}风格，暖米白纸感背景，炭黑现代中文无衬线字体，鼠尾草绿表达积极行动，低饱和砖红强调误区或提醒。保持标题安全区、手机端可读性和清晰留白；使用克制的编辑式结构，不要廉价母婴模板、蓝紫渐变、卡通贴纸、文字变形和 PPT 感。`;
}

function preparePages(pages) {
  return pages.map((page) => ({
    ...page,
    prompt: buildPrompt(page),
  }));
}

const initialPages = preparePages([
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
]);

const readingHabitPages = preparePages([
  {
    title: "别急着要求孩子爱读书",
    subtitle: "先让阅读变成一件轻松、随手可做的事",
    body: "培养阅读习惯，不靠催促\n靠环境 · 选择 · 陪伴 · 重复",
    task: "封面钩子",
    style: "纸雕杂志",
  },
  {
    title: "孩子不爱读，往往不是懒",
    subtitle: "先排除这 3 个阅读阻力",
    body: "书太难：读两页就挫败\n总被考：读完必须回答问题\n没得选：大人替他决定读什么",
    task: "指出痛点",
    style: "对比结构",
  },
  {
    title: "真正有效的阅读习惯公式",
    subtitle: "低门槛 × 固定触发 × 及时愉悦",
    body: "每天 10-15 分钟就够\n固定在睡前或放学后\n结束时保留“还想再读一点”",
    task: "解释认知",
    style: "高级白底",
  },
  {
    title: "第一步：让书随手可得",
    subtitle: "环境，比提醒更有力量",
    body: "客厅放一个低矮书篮\n封面朝外，比书脊更吸引孩子\n每周轮换 5-8 本，不要一次摆太多",
    task: "环境设计",
    style: "纸雕杂志",
  },
  {
    title: "第二步：把选书权交给孩子",
    subtitle: "允许偏爱，也允许放弃",
    body: "漫画、科普、故事都算阅读\n同一本书反复读也没关系\n不喜欢可以停，不把读完当任务",
    task: "选择机制",
    style: "情绪标签",
  },
  {
    title: "第三步：每天陪读 15 分钟",
    subtitle: "少提问，多分享",
    body: "父母也拿一本书坐在旁边\n读到有趣处，说说自己的感受\n少问“学到了什么”，多问“哪里最好玩”",
    task: "陪读方法",
    style: "高级白底",
  },
  {
    title: "7 天阅读习惯启动计划",
    subtitle: "先让孩子愿意坐下来，再慢慢延长",
    body: "第 1-2 天：一起选书，读 5 分钟\n第 3-5 天：固定时间，读 10 分钟\n第 6-7 天：孩子选书，亲子共读 15 分钟",
    task: "行动计划",
    style: "情绪分镜",
  },
  {
    title: "爱读书，不是被逼出来的",
    subtitle: "让孩子把书和愉快、陪伴、自由联系在一起",
    body: "书要看得见 · 内容能选择\n时间够固定 · 父母真陪伴\n先收藏，今晚从 10 分钟开始",
    task: "总结引导",
    style: "高级白底",
  },
]);

function buildGenericPages(rawTopic) {
  const cleanTopic = rawTopic.trim().replace(/[。？?！!]$/, "") || "我的小红书主题";
  return preparePages([
    { title: cleanTopic, subtitle: "把一个主题，拆成可以直接执行的 8 页内容", body: "先讲清问题\n再给方法和行动", task: "封面钩子", style: "纸雕杂志" },
    { title: "为什么很多人做了，却没有效果？", subtitle: "先看见真正的阻力", body: "目标太大 · 方法太散\n缺少固定动作 · 很难坚持", task: "指出痛点", style: "对比结构" },
    { title: "先记住这个核心原则", subtitle: cleanTopic, body: "降低开始门槛\n建立固定触发\n让结果可以被看见", task: "解释认知", style: "高级白底" },
    { title: "第一步：从最小动作开始", subtitle: "小到今天就能完成", body: "不要一次改变全部\n先确定一个具体动作", task: "方法一", style: "纸雕杂志" },
    { title: "第二步：给动作一个固定场景", subtitle: "让环境提醒你，而不是靠意志力", body: "固定时间 · 固定地点\n固定开始信号", task: "方法二", style: "情绪标签" },
    { title: "第三步：记录一次小反馈", subtitle: "看见进步，才更容易继续", body: "完成后立即记录\n只比较自己的前后变化", task: "方法三", style: "高级白底" },
    { title: "一套可以照做的 7 天计划", subtitle: "先跑通，再优化", body: "第 1-2 天：降低门槛\n第 3-5 天：固定节奏\n第 6-7 天：复盘调整", task: "行动计划", style: "情绪分镜" },
    { title: "真正有效的改变，都从容易开始", subtitle: cleanTopic, body: "收藏这套步骤\n今天先完成第一个小动作", task: "总结引导", style: "高级白底" },
  ]);
}

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

function PagePreview({ page, index, compact = false }) {
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
          {lines.map((line) => <p key={line}>{line}</p>)}
        </div>
      </div>
      <div className="preview-motif" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <small>{String(index + 1).padStart(2, "0")} / 08</small>
    </div>
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
    const isReadingTopic = /读书|阅读|爱读|读书习惯|阅读习惯/.test(topic);
    const next = isReadingTopic ? readingHabitPages : buildGenericPages(topic);
    setPages(next);
    setActive(0);
    localStorage.setItem("xhs-studio-pages", JSON.stringify(next));
    setToast(isReadingTopic ? "已生成「阅读习惯」8 页完整内容" : "已生成 8 页通用创作蓝图");
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
            <h1>{pages[0]?.title || "小红书主题"} · 8 页图文</h1>
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
                <PagePreview page={page} index={index} compact />
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
              <PagePreview page={current} index={active} />
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
        <footer className="app-footer">
          <span>小红书视觉创作台 · 开源基础版</span>
          <a
            href="https://github.com/zeze20231224/xhs-visual-studio"
            target="_blank"
            rel="noreferrer"
          >
            GitHub · AGPL-3.0
          </a>
        </footer>
      </main>
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
