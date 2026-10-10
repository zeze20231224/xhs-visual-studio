export const ATTRIBUTION = "视觉提示词方法参考 YouMind-OpenLab/awesome-gpt-image-2（CC BY 4.0）。";

export function filenameSlug(text, fallback = "project") {
  const slug = String(text ?? "")
    .trim()
    .replace(/[\\/:*?"<>|\s]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return slug || fallback;
}

export function buildXhsMarkdown(topic, pages) {
  return [
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
    ATTRIBUTION,
  ].join("\n");
}

export function buildDouyinMarkdown(topic, duration, scenes) {
  return [
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
    "",
    "## 提示词参考署名",
    ATTRIBUTION,
  ].join("\n");
}

export function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fall back for insecure contexts or denied clipboard permission.
    try {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand("copy");
      area.remove();
      return ok;
    } catch {
      return false;
    }
  }
}
