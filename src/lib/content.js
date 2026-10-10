import { preparePages, prepareScenes } from "./prompts.js";

// Topics that have a hand-written, fully reviewed template.
export function isReadingTopic(topic) {
  return /读书|阅读|爱读/.test(topic);
}

export function cleanTopic(rawTopic, fallback) {
  return String(rawTopic ?? "").trim().replace(/[。？?！!]$/, "") || fallback;
}

export const initialPages = preparePages([
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

export const readingHabitPages = preparePages([
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

export function buildGenericPages(rawTopic) {
  const topic = cleanTopic(rawTopic, "我的小红书主题");
  return preparePages([
    { title: topic, subtitle: "把一个主题，拆成可以直接执行的 8 页内容", body: "先讲清问题\n再给方法和行动", task: "封面钩子", style: "纸雕杂志" },
    { title: "为什么很多人做了，却没有效果？", subtitle: "先看见真正的阻力", body: "目标太大 · 方法太散\n缺少固定动作 · 很难坚持", task: "指出痛点", style: "对比结构" },
    { title: "先记住这个核心原则", subtitle: topic, body: "降低开始门槛\n建立固定触发\n让结果可以被看见", task: "解释认知", style: "高级白底" },
    { title: "第一步：从最小动作开始", subtitle: "小到今天就能完成", body: "不要一次改变全部\n先确定一个具体动作", task: "方法一", style: "纸雕杂志" },
    { title: "第二步：给动作一个固定场景", subtitle: "让环境提醒你，而不是靠意志力", body: "固定时间 · 固定地点\n固定开始信号", task: "方法二", style: "情绪标签" },
    { title: "第三步：记录一次小反馈", subtitle: "看见进步，才更容易继续", body: "完成后立即记录\n只比较自己的前后变化", task: "方法三", style: "高级白底" },
    { title: "一套可以照做的 7 天计划", subtitle: "先跑通，再优化", body: "第 1-2 天：降低门槛\n第 3-5 天：固定节奏\n第 6-7 天：复盘调整", task: "行动计划", style: "情绪分镜" },
    { title: "真正有效的改变，都从容易开始", subtitle: topic, body: "收藏这套步骤\n今天先完成第一个小动作", task: "总结引导", style: "高级白底" },
  ]);
}

export function buildReadingVideo(duration) {
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

export function buildGenericVideo(rawTopic, duration) {
  const topic = cleanTopic(rawTopic, "这个主题");
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
  const slots = timeSlots(duration, sceneCount);
  return prepareScenes(beats.slice(0, sceneCount).map(([task, visual, camera, voiceover, subtitle], index) => (
    { time: slots[index], task, visual, camera, voiceover, subtitle }
  )));
}

function timeSlots(duration, count) {
  return Array.from({ length: count }, (_, index) => {
    const start = Math.round((duration / count) * index);
    const end = Math.round((duration / count) * (index + 1));
    return `${start}-${end}s`;
  });
}

// --- 古典素材：用素材库里的原文意象、主题词和钩子驱动生成，而不是套用通用模板 ---

export function buildClassicPages(scene) {
  const [t1 = "意境", t2 = "情感", t3 = "留白"] = scene.themes;
  const pages = [
    { title: scene.xhsAngle, subtitle: `${scene.source} · ${scene.author}`, body: `《${scene.title}》\n${scene.dynasty}｜${scene.themes.join(" · ")}`, task: "封面钩子", style: "纸雕杂志" },
    { title: `《${scene.title}》，到底写了什么？`, subtitle: `${scene.dynasty} · ${scene.author}`, body: scene.scene, task: "出处与背景", style: "高级白底" },
    { title: "先看见这一幅画面", subtitle: `《${scene.title}》的意象`, body: scene.scene, task: "意象画面", style: "情绪分镜" },
    { title: `读懂「${t1}」`, subtitle: `《${scene.title}》的第一个关键词`, body: `原文里哪一处写出了「${t1}」？\n用一句话说出你的感受`, task: "关键词一", style: "对比结构" },
    { title: `读懂「${t2}」`, subtitle: `《${scene.title}》的第二个关键词`, body: `原文里哪一处写出了「${t2}」？\n它和今天的生活有什么相通`, task: "关键词二", style: "高级白底" },
    { title: `读懂「${t3}」`, subtitle: `《${scene.title}》的第三个关键词`, body: `原文里哪一处写出了「${t3}」？\n留一句最想收藏的原文`, task: "关键词三", style: "情绪标签" },
    { title: scene.douyinHook, subtitle: "把古人的心情，放进今天的生活", body: `适合引用的场合：\n${scene.themes.map((theme) => `· ${theme}`).join("\n")}`, task: "当代共鸣", style: "纸雕杂志" },
    { title: `把《${scene.title}》留给自己`, subtitle: scene.source, body: "收藏这一篇\n下次想起它，就读一遍原文", task: "总结引导", style: "高级白底" },
  ];
  return preparePages(pages.map((page) => ({ ...page, tone: "classic", imagery: scene.visualPrompt })));
}

export function buildClassicVideo(scene, duration) {
  const sceneCount = duration === 15 ? 4 : duration === 30 ? 6 : 9;
  const [t1 = "意境", t2 = "情感", t3 = "留白"] = scene.themes;
  const beats = [
    ["钩子", scene.visualPrompt, "缓慢推近", scene.douyinHook, scene.xhsAngle],
    ["出处", `书页或卷轴上浮现《${scene.title}》的题名与出处`, "俯拍下压", `这是${scene.dynasty}${scene.author === "佚名" ? "无名作者" : scene.author}的《${scene.title}》，出自${scene.source}。`, `${scene.source}`],
    ["意象", scene.visualPrompt, "平稳横移", scene.scene, `《${scene.title}》`],
    ["关键词一", `与「${t1}」相关的意象特写`, "特写切换", `先记住第一个关键词：${t1}。`, t1],
    ["关键词二", `与「${t2}」相关的意象特写`, "中景推近", `再看第二个：${t2}。`, t2],
    ["关键词三", `与「${t3}」相关的意象特写`, "对焦转移", `最后是${t3}。`, t3],
    ["当代共鸣", "现代生活里一个安静的瞬间，与古典画面叠化", "叠化过渡", "古人的心情，今天的人也都懂。", "古今相通"],
    ["原文", "原文以竖排书法形式缓缓显现，留白充足", "静止留白", "最好的方式，是再读一遍原文。", "读一遍原文"],
    ["行动", "卷轴合上，画面停在一处意象", "缓慢拉远", `收藏这条，下次想起《${scene.title}》，就读它一遍。`, "收藏，慢慢读"],
  ];
  // Short cuts keep hook, imagery, one keyword and the call to action.
  const picks = { 4: [0, 2, 3, 8], 6: [0, 1, 2, 3, 6, 8], 9: [0, 1, 2, 3, 4, 5, 6, 7, 8] }[sceneCount];
  const slots = timeSlots(duration, sceneCount);
  return prepareScenes(picks.map((beatIndex, index) => {
    const [task, visual, camera, voiceover, subtitle] = beats[beatIndex];
    return { time: slots[index], task, visual, camera, voiceover, subtitle, tone: "classic" };
  }));
}
