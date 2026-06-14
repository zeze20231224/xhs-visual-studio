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
  Images,
  LayoutDashboard,
  Mic2,
  Palette,
  Play,
  Plus,
  RefreshCw,
  Save,
  Settings,
  Sparkles,
  Video,
  WandSparkles,
} from "lucide-react";
import "./styles.css";

const APP_VERSION = "0.3.0";
const STORAGE_KEY = "xhs-studio-pages-v2";
const VIDEO_STORAGE_KEY = "xhs-studio-video-v1";

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

function prepareScenes(scenes) {
  return scenes.map((scene, index) => ({
    ...scene,
    prompt: `生成一段 9:16 竖屏短视频镜头。镜头 ${index + 1}，时长 ${scene.time}。画面：${scene.visual}。镜头运动：${scene.camera}。画面字幕：“${scene.subtitle}”。整体使用暖米白、炭黑、鼠尾草绿和低饱和砖红，真实生活方式摄影或克制纸雕编辑风，高对比字幕安全区，适合抖音手机端观看。不要横屏、不要小字、不要廉价母婴模板、不要夸张表情和随机转场。`,
  }));
}

function buildReadingVideo(duration) {
  const variants = {
    15: [
      ["0-3s", "钩子", "孩子推开书，家长手里拿着一本绘本", "轻微推近", "孩子不爱读书，可能不是懒。", "不是懒"],
      ["3-7s", "误区", "书太难、读完被提问、没有选择权，三张快速卡片", "三连切", "很多家庭，一开始就把阅读变成了任务。", "别把阅读变成考试"],
      ["7-12s", "方法", "低矮书篮、孩子选书、亲子并排阅读三个画面", "节奏蒙太奇", "让书随手可得，把选书权交给孩子，每天陪读十分钟。", "环境 + 选择 + 陪伴"],
      ["12-15s", "行动", "睡前暖光下，亲子一起翻书", "缓慢拉远", "今晚别催，先陪孩子读十分钟。", "今晚，从 10 分钟开始"],
    ],
    30: [
      ["0-3s", "钩子", "孩子把书放到一边，父母准备开口催促", "快速推近", "孩子不爱读书，可能不是因为懒。", "孩子不爱读书？"],
      ["3-8s", "误区", "家长连续提问，孩子表情疲惫，画面出现三个错误标签", "左右摇移", "书太难、读完总被考、连读什么都不能选，都会消耗兴趣。", "先排除 3 个阅读阻力"],
      ["8-13s", "原则", "桌面出现阅读习惯公式卡片", "俯拍下压", "真正有效的习惯，是低门槛、固定触发，再加一点愉快反馈。", "低门槛 × 固定触发 × 愉悦"],
      ["13-19s", "环境", "客厅低矮书篮，书封面朝外，孩子随手拿起一本", "平稳横移", "先把书放到孩子看得见、拿得到的地方。", "让书随手可得"],
      ["19-25s", "陪读", "孩子自己选书，父母也拿一本书并排坐下", "中景推近", "把选书权交给他，每天安静陪读十到十五分钟。", "让孩子选 · 父母真陪"],
      ["25-30s", "行动", "暖光睡前阅读，画面停在翻页的手", "慢慢拉远", "少问学到了什么，多问哪里最好玩。今晚就开始。", "今晚，先读 10 分钟"],
    ],
    60: [
      ["0-4s", "钩子", "孩子看到书就躲开，家长困惑", "快速推近", "为什么你越催，孩子越不爱读书？", "越催，越不想读？"],
      ["4-11s", "误区一", "难度过高的厚书放在孩子面前", "特写切换", "第一个阻力，是书太难。读两页就挫败，当然不想继续。", "阻力 1｜书太难"],
      ["11-18s", "误区二", "读完后家长拿问题卡连连提问", "快速跳切", "第二个阻力，是每次读完都像考试。", "阻力 2｜读完总被考"],
      ["18-25s", "误区三", "成人替孩子选书，孩子指向另一本漫画", "对焦转移", "第三个阻力，是没有选择权。漫画和科普，也都是阅读。", "阻力 3｜没有选择权"],
      ["25-33s", "环境", "低矮书篮、封面朝外、每周轮换少量书", "平稳横移", "把五到八本书放在孩子看得见、拿得到的位置。", "书要看得见、拿得到"],
      ["33-41s", "选择", "孩子从几本书里自己挑选", "俯拍跟手", "允许他偏爱一本书，也允许读到一半放下。", "允许选择，也允许放弃"],
      ["41-50s", "陪伴", "亲子各拿一本书并排安静阅读", "中景缓推", "每天固定十到十五分钟，父母也坐下来读。", "每天固定 10-15 分钟"],
      ["50-56s", "交流", "两人分享书中有趣画面，不出现问答考试感", "近景交替", "少问学到了什么，多聊哪里最好玩。", "少提问，多分享"],
      ["56-60s", "行动", "睡前合上书，孩子还想再看一页", "柔和拉远", "今晚先陪孩子读十分钟，让快乐留在书里。", "今晚开始"],
    ],
  };

  return prepareScenes(variants[duration].map(([time, task, visual, camera, voiceover, subtitle]) => ({
    time, task, visual, camera, voiceover, subtitle,
  })));
}

function buildGenericVideo(rawTopic, duration) {
  const topic = rawTopic.trim().replace(/[。？?！!]$/, "") || "这个主题";
  const sceneCount = duration === 15 ? 4 : duration === 30 ? 6 : 9;
  const beats = [
    ["钩子", `与“${topic}”有关的强冲突生活场景`, "快速推近", `关于${topic}，很多人第一步就做错了。`, "第一步就错了？"],
    ["痛点", "三个常见错误以快速卡片方式出现", "三连切", "问题通常不在努力，而在方法和顺序。", "先看见真正的问题"],
    ["认知", "核心原则以大字和简洁结构图出现", "俯拍下压", "先降低门槛，再建立固定触发。", "降低门槛 × 固定触发"],
    ["方法一", "一个今天就能执行的小动作", "平稳横移", "从一个足够小的动作开始。", "先做最小动作"],
    ["方法二", "固定时间与固定场景的生活镜头", "中景推近", "把它放进固定场景，不再只靠意志力。", "固定时间 · 固定场景"],
    ["案例", "执行前后对比画面", "左右对比", "当动作足够具体，改变才会真正发生。", "让改变看得见"],
    ["计划", "三阶段行动清单依次出现", "节奏蒙太奇", "前三天跑通，接着稳定，最后复盘。", "跑通 → 稳定 → 复盘"],
    ["提醒", "错误做法被划掉，正确做法被强调", "快速切换", "不要追求一次完美，先保证持续。", "持续比完美重要"],
    ["行动", "人物完成动作后的自然状态", "缓慢拉远", "收藏这条，今天就完成第一个小动作。", "今天就开始"],
  ];
  return prepareScenes(beats.slice(0, sceneCount).map(([task, visual, camera, voiceover, subtitle], index) => {
    const start = Math.round((duration / sceneCount) * index);
    const end = Math.round((duration / sceneCount) * (index + 1));
    return { time: `${start}-${end}s`, task, visual, camera, voiceover, subtitle };
  }));
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

function VideoPreview({ scene, index, compact = false }) {
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
      <div className="video-progress"><span style={{ width: `${((index + 1) / 9) * 100}%` }} /></div>
    </div>
  );
}

function App() {
  const [mode, setMode] = useState("xhs");
  const [pages, setPages] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialPages;
  });
  const [duration, setDuration] = useState(30);
  const [scenes, setScenes] = useState(() => {
    const saved = localStorage.getItem(VIDEO_STORAGE_KEY);
    return saved ? JSON.parse(saved) : buildReadingVideo(30);
  });
  const [active, setActive] = useState(3);
  const [activeScene, setActiveScene] = useState(0);
  const [tab, setTab] = useState("文案");
  const [topic, setTopic] = useState("孩子情绪崩溃时，父母可以照着说的 5 句话");
  const [toast, setToast] = useState("");
  const current = mode === "xhs" ? pages[active] : scenes[activeScene];

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 1800);
    return () => clearTimeout(timer);
  }, [toast]);

  const progress = useMemo(
    () => mode === "xhs"
      ? Math.round((pages.filter((page) => page.title && page.prompt).length / 8) * 100)
      : Math.round((scenes.filter((scene) => scene.voiceover && scene.prompt).length / scenes.length) * 100),
    [mode, pages, scenes],
  );

  function updateCurrent(field, value) {
    if (mode === "xhs") {
      setPages((items) =>
        items.map((item, index) => (index === active ? { ...item, [field]: value } : item)),
      );
      return;
    }
    setScenes((items) =>
      items.map((item, index) => (index === activeScene ? { ...item, [field]: value } : item)),
    );
  }

  function saveProject() {
    if (mode === "xhs") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
    } else {
      localStorage.setItem(VIDEO_STORAGE_KEY, JSON.stringify(scenes));
    }
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
    if (mode === "douyin") {
      const nextScenes = isReadingTopic ? buildReadingVideo(duration) : buildGenericVideo(topic, duration);
      setScenes(nextScenes);
      setActiveScene(0);
      localStorage.setItem(VIDEO_STORAGE_KEY, JSON.stringify(nextScenes));
      setToast(`已生成 ${duration} 秒抖音脚本与 ${nextScenes.length} 个镜头`);
      return;
    }
    const next = isReadingTopic ? readingHabitPages : buildGenericPages(topic);
    setPages(next);
    setActive(0);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setToast(isReadingTopic ? "已生成「阅读习惯」8 页完整内容" : "已生成 8 页通用创作蓝图");
  }

  function exportPack() {
    if (mode === "douyin") {
      const content = [
        `# 抖音短视频拍摄清单｜${topic}`,
        "",
        `- 目标时长：${duration} 秒`,
        `- 画幅：9:16 竖屏`,
        `- 镜头数：${scenes.length}`,
        "",
        ...scenes.flatMap((scene, index) => [
          `## 镜头 ${String(index + 1).padStart(2, "0")}｜${scene.time}｜${scene.task}`,
          `- 画面：${scene.visual}`,
          `- 镜头：${scene.camera}`,
          `- 口播：${scene.voiceover}`,
          `- 字幕：${scene.subtitle}`,
          "",
          "### 视频生成提示词",
          scene.prompt,
          "",
        ]),
        "## 发布建议",
        "- 封面标题控制在 8-14 字。",
        "- 前 3 秒必须出现冲突、结果或反常识。",
        "- 口播保持自然停顿，字幕只保留关键词。",
        "- 结尾给一个明确动作：收藏、评论或今晚开始。",
      ].join("\n");
      const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "抖音短视频拍摄清单.md";
      link.click();
      URL.revokeObjectURL(url);
      setToast("抖音拍摄清单已导出");
      return;
    }
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
        <div className="brand-mark">{mode === "xhs" ? "红" : "抖"}</div>
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
            <p className="product-name">社交内容创作台 <span>v{APP_VERSION}</span></p>
            <h1>
              {mode === "xhs"
                ? `${pages[0]?.title || "小红书主题"} · 8 页图文`
                : `${topic || "抖音主题"} · ${duration} 秒短视频`}
            </h1>
          </div>
          <div className="top-actions">
            <button className="button secondary" onClick={saveProject}><Save size={16} />保存项目</button>
            <button className="button primary" onClick={exportPack}>
              <Download size={16} />{mode === "xhs" ? "导出创作包" : "导出拍摄清单"}
            </button>
          </div>
        </header>

        <section className="mode-switcher" aria-label="创作平台">
          <button className={mode === "xhs" ? "active" : ""} onClick={() => { setMode("xhs"); setTab("文案"); }}>
            <Images size={17} />
            <span><strong>小红书图文</strong><small>3:4 · 8 页轮播</small></span>
          </button>
          <button className={mode === "douyin" ? "active" : ""} onClick={() => { setMode("douyin"); setTab("脚本"); }}>
            <Video size={17} />
            <span><strong>抖音短视频</strong><small>9:16 · 分镜口播</small></span>
          </button>
          {mode === "douyin" && (
            <div className="duration-picker">
              <span>视频时长</span>
              {[15, 30, 60].map((item) => (
                <button
                  key={item}
                  className={duration === item ? "active" : ""}
                  onClick={() => {
                    setDuration(item);
                    const next = /读书|阅读|爱读/.test(topic)
                      ? buildReadingVideo(item)
                      : buildGenericVideo(topic, item);
                    setScenes(next);
                    setActiveScene(0);
                  }}
                >
                  {item}s
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="brief-bar">
          <WandSparkles size={18} />
          <input value={topic} onChange={(event) => setTopic(event.target.value)} />
          <button className="button generate" onClick={generateBlueprint}>
            <Sparkles size={16} />{mode === "xhs" ? "生成创作蓝图" : "生成短视频脚本"}
          </button>
        </section>

        <section className="storyboard">
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
                    key={`${page.task}-${index}`}
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
              </>
            ) : (
              scenes.map((scene, index) => (
                <button
                  key={`${scene.time}-${index}`}
                  className={`story-card video-story-card ${activeScene === index ? "selected" : ""}`}
                  onClick={() => setActiveScene(index)}
                >
                  <VideoPreview scene={scene} index={index} compact />
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
                    key={`${page.task}-outline`}
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
                    key={`${scene.time}-outline`}
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
              <div><button>适应画布 <ChevronDown size={13} /></button><IconButton label="刷新预览"><RefreshCw size={15} /></IconButton></div>
            </div>
            <div className="canvas">
              {mode === "xhs"
                ? <PagePreview page={current} index={active} />
                : <VideoPreview scene={current} index={activeScene} />}
            </div>
            <p className="canvas-note">
              {mode === "xhs"
                ? "3:4 · 1242 × 1660 · 中文后期排版优先"
                : `9:16 · 1080 × 1920 · ${duration} 秒 · 字幕安全区`}
            </p>
          </div>

          <div className="inspector">
            <div className="tabs">
              {(mode === "xhs" ? ["文案", "视觉", "提示词"] : ["脚本", "画面", "提示词"]).map((item) => (
                <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{item}</button>
              ))}
            </div>
            {mode === "xhs" && tab === "文案" && (
              <div className="form-stack">
                <label>页面任务<input value={current.task} onChange={(e) => updateCurrent("task", e.target.value)} /></label>
                <label>主标题<textarea rows="3" value={current.title} onChange={(e) => updateCurrent("title", e.target.value)} /></label>
                <label>副标题<textarea rows="2" value={current.subtitle} onChange={(e) => updateCurrent("subtitle", e.target.value)} /></label>
                <label>核心文案<textarea rows="5" value={current.body} onChange={(e) => updateCurrent("body", e.target.value)} /></label>
                <div className="quality-check"><Check size={15} /><span>标题长度适合手机阅读</span></div>
              </div>
            )}
            {mode === "xhs" && tab === "视觉" && (
              <div className="form-stack">
                <label>当前风格<input value={current.style} onChange={(e) => updateCurrent("style", e.target.value)} /></label>
                <div className="token-row"><span>背景</span><i style={{ background: "#f3efe8" }} /><code>#F3EFE8</code></div>
                <div className="token-row"><span>连接</span><i style={{ background: "#82927b" }} /><code>#82927B</code></div>
                <div className="token-row"><span>边界</span><i style={{ background: "#b85c4b" }} /><code>#B85C4B</code></div>
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
                <p>{mode === "xhs" ? "已融合画幅、构图、字体、色彩、材质、留白和负面约束。" : "已融合 9:16 画幅、镜头运动、字幕安全区、场景和负面约束。"}</p>
              </div>
            )}
            <button className="copy-button" onClick={copyPrompt}>
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
                  <button onClick={() => applyStyle(item)}>应用到本页</button>
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
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
