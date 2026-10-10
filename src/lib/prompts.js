const TONES = {
  life: {
    palette: "暖米白纸感背景，炭黑现代中文无衬线字体，鼠尾草绿表达积极行动，低饱和砖红强调误区或提醒",
    pageAvoid: "廉价母婴模板、蓝紫渐变、卡通贴纸、文字变形和 PPT 感",
    videoPalette: "暖米白、炭黑、鼠尾草绿和低饱和砖红，真实生活方式摄影或克制纸雕编辑风",
    videoAvoid: "不要横屏、不要小字、不要廉价母婴模板、不要夸张表情和随机转场",
  },
  classic: {
    palette: "宣纸米白底，墨黑宋体或楷体标题，青绿山水色点缀，朱砂红印章用于强调",
    pageAvoid: "廉价国风模板、荧光色、卡通贴纸、塑料质感、文字变形和 PPT 感",
    videoPalette: "宣纸米白、墨黑、青绿山水色和朱砂红，水墨留白或克制的古典电影感",
    videoAvoid: "不要横屏、不要小字、不要廉价国风滤镜、不要现代元素穿帮和随机转场",
  },
};

export function getTone(item) {
  return TONES[item?.tone] || TONES.life;
}

export function buildPrompt(page) {
  const tone = getTone(page);
  const lines = [
    `生成一张 3:4 竖版小红书图文页面。页面任务：${page.task}。主标题：${page.title}。副标题：${page.subtitle}。核心内容：${page.body.replaceAll("\n", "；")}。采用${page.style}风格，${tone.palette}。保持标题安全区、手机端可读性和清晰留白；使用克制的编辑式结构，不要${tone.pageAvoid}。`,
  ];
  if (page.imagery) lines.push(`画面意象：${page.imagery}`);
  if (page.styleRef) lines.push(`视觉参考：${page.styleRef}。`);
  return lines.join("\n");
}

export function buildScenePrompt(scene, index) {
  const tone = getTone(scene);
  const base = `生成一段 9:16 竖屏短视频镜头。镜头 ${index + 1}，时长 ${scene.time}。画面：${scene.visual}。镜头运动：${scene.camera}。画面字幕：“${scene.subtitle}”。整体使用${tone.videoPalette}，高对比字幕安全区，适合抖音手机端观看。${tone.videoAvoid}。`;
  return scene.styleRef ? `${base}\n视觉参考：${scene.styleRef}。` : base;
}

// A prompt the user has hand-edited is left alone; everything else is derived from the fields.
export function refreshPage(page) {
  return page.promptCustom ? page : { ...page, prompt: buildPrompt(page) };
}

export function refreshScene(scene, index) {
  return scene.promptCustom ? scene : { ...scene, prompt: buildScenePrompt(scene, index) };
}

export function preparePages(pages) {
  return pages.map((page) => refreshPage({ tone: "life", ...page, promptCustom: false }));
}

export function prepareScenes(scenes) {
  return scenes.map((scene, index) => refreshScene({ tone: "life", ...scene, promptCustom: false }, index));
}
