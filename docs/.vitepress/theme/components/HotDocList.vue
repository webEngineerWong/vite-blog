<template>
  <div class="ui-home">
    <section class="home-spotlight">
      <article class="spotlight-card spotlight-card--intro">
        <p class="section-kicker">FRONT-END KNOWLEDGE BASE</p>
        <h2 class="section-title">
          把前端面试、工程实践、源码解析与工具沉淀整理成长期可查的知识入口
        </h2>
        <p class="section-copy">
          这里不只收录文章，也按专题路线、项目经验与高频工具重新组织内容，方便复习知识点、排查问题和持续积累。
        </p>

        <ul class="intro-metrics">
          <li v-for="item in quickNotes" :key="item.label">
            <span class="metric-label">{{ item.label }}</span>
            <strong class="metric-value">{{ item.value }}</strong>
          </li>
        </ul>

        <div class="intro-actions">
          <a
            class="intro-link intro-link--primary"
            :href="resolveLink('/engineering/npm/private/')"
            >进入工程化</a
          >
          <a class="intro-link" :href="resolveLink('/tool/compressed-image/')"
            >查看工具库</a
          >
          <a
            class="intro-link"
            href="https://zubylon.tech/deepseek-chat/"
            target="_blank"
            rel="noreferrer"
            >打开 DeepSeek Chat</a
          >
        </div>
      </article>

      <article class="spotlight-card spotlight-card--chat">
        <div class="chat-card__copy">
          <p class="section-kicker">AI WORKBENCH</p>
          <h2 class="section-title section-title--chat">
            把 DeepSeek Chat 变成整理问题、验证思路与打磨 Prompt 的即时工作台
          </h2>
          <p class="section-copy section-copy--chat">
            它不是单独摆放的展示页，而是首页里的辅助入口，用来快速提问、整理方案、验证想法，再回到文章与工具继续沉淀。
          </p>
          <div class="chat-card__actions">
            <a
              class="intro-link intro-link--primary"
              :href="deepseekUrl"
              target="_blank"
              rel="noreferrer"
            >
              打开 DeepSeek Chat
            </a>
          </div>
        </div>

        <div class="chat-preview">
          <iframe
            class="chat-preview__frame"
            :src="deepseekUrl"
            title="DeepSeek Chat Preview"
            loading="lazy"
            referrerpolicy="strict-origin-when-cross-origin"
          ></iframe>
        </div>
      </article>

      <article class="spotlight-card spotlight-card--studio">
        <div class="studio-head">
          <span>studio.ts</span>
          <span>frontend / engineering / content</span>
        </div>
        <div
          class="editor-shell"
          :class="`editor-shell--${editorThemes.studio}`"
        >
          <div class="editor-shell__bar">
            <span class="editor-shell__dots">
              <i></i>
              <i></i>
              <i></i>
            </span>
            <span class="editor-shell__filename">studio.ts</span>
            <div class="editor-shell__actions">
              <button
                type="button"
                class="editor-shell__action"
                @click="toggleEditorTheme('studio')"
              >
                {{ editorThemes.studio === "dark" ? "浅色" : "深色" }}
              </button>
              <button
                type="button"
                class="editor-shell__action editor-shell__action--primary code-copy-button"
                @click="copyEditorCode('studio', studioSnapshot)"
              >
                {{ copiedEditor === "studio" ? "已复制" : "复制代码" }}
              </button>
            </div>
          </div>
          <pre
            class="studio-code"
          ><code><span v-for="line in studioSnapshot" :key="line">{{ line }}</span></code></pre>
        </div>
        <div class="studio-tags">
          <span v-for="tag in focusAreas" :key="tag" class="studio-tag">{{
            tag
          }}</span>
        </div>

        <div
          class="monitor-editor"
          :class="`monitor-editor--${editorThemes.monitor}`"
        >
          <div class="monitor-editor__bar">
            <span class="monitor-editor__dots">
              <i></i>
              <i></i>
              <i></i>
            </span>
            <span class="monitor-editor__title">report-queue.ts</span>
            <div class="monitor-editor__actions">
              <button
                type="button"
                class="monitor-editor__action"
                @click="toggleEditorTheme('monitor')"
              >
                {{ editorThemes.monitor === "dark" ? "浅色" : "深色" }}
              </button>
              <button
                type="button"
                class="monitor-editor__action monitor-editor__action--primary code-copy-button"
                @click="copyEditorCode('monitor', monitorSnippet)"
              >
                {{ copiedEditor === "monitor" ? "已复制" : "复制代码" }}
              </button>
            </div>
          </div>
          <div class="monitor-editor__meta">sdk / monitoring-platform</div>
          <pre
            class="monitor-editor__code"
          ><code><span v-for="line in monitorSnippet" :key="line">{{ line }}</span></code></pre>
        </div>

        <div class="monitor-editor__extras">
          <div class="monitor-editor__tags">
            <span
              v-for="tag in monitorTags"
              :key="tag"
              class="studio-tag monitor-editor__tag"
              >{{ tag }}</span
            >
          </div>
          <a
            class="studio-tag monitor-editor__link"
            :href="
              resolveLink('/engineering/sdk/monitoring-platform/#数据上报时机')
            "
          >
            查看文章中的数据上报时机
          </a>
        </div>
      </article>
    </section>

    <section class="home-bento">
      <a
        v-for="panel in featurePanels"
        :key="panel.title"
        class="bento-card"
        :href="resolveLink(panel.link)"
        :target="linkTarget(panel.link)"
        :rel="linkRel(panel.link)"
      >
        <p class="bento-eyebrow">{{ panel.eyebrow }}</p>
        <h3 class="bento-title">{{ panel.title }}</h3>
        <p class="bento-desc">{{ panel.desc }}</p>
        <div class="bento-meta">
          <span class="bento-badge">{{ panel.badge }}</span>
          <span class="bento-arrow">{{ panel.cta }}</span>
        </div>
      </a>
    </section>

    <section class="home-section">
      <div class="section-heading">
        <div>
          <p class="section-kicker">FEATURED WRITING</p>
          <h2 class="section-title section-title--sm">精选内容</h2>
        </div>
        <p class="section-copy section-copy--sm">
          优先展示最常访问的内容入口，让首页更符合知识博客的阅读习惯，也更方便快速查找。
        </p>
      </div>

      <ul class="story-grid">
        <li class="story-item" v-for="item in featuredDocs" :key="item.name">
          <a
            class="story-link"
            :href="resolveLink(item.link)"
            :target="linkTarget(item.link)"
            :rel="linkRel(item.link)"
          >
            <div class="story-cover" :style="coverStyle(item.image)">
              <span class="story-order">{{ item.order }}</span>
              <h3 class="story-title">{{ item.name }}</h3>
            </div>
            <div class="story-body">
              <p class="story-desc">{{ item.desc }}</p>
              <div class="story-tags">
                <span
                  v-for="tag in item.tagList"
                  :key="tag"
                  class="story-tag"
                  >{{ tag }}</span
                >
              </div>
            </div>
          </a>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { withBase } from "vitepress";
import { siteData } from "../model/siteData.js";

const quickNotes = [
  {
    label: "关注方向",
    value: "面试题 / 工程化 / 源码分析 / 性能优化",
  },
  {
    label: "内容结构",
    value: "文章总结 / 专题路线 / 工具整理 / 学习记录",
  },
  {
    label: "当前定位",
    value: "偏知识库与实战手册，兼顾个人积累与长期输出",
  },
];

const focusAreas = [
  "Vue",
  "React",
  "TypeScript",
  "Vite",
  "Node.js",
  "Performance",
  "DX",
  "Interactive UI",
];

const studioSnapshot = [
  "const profile = {",
  '  role: "Front-end Engineer",',
  '  site: "Knowledge Base + Practice Notes",',
  '  focus: ["Interview", "Engineering", "Source Code"],',
  '  output: ["Articles", "Topics", "Tools", "Algorithms"],',
  '  status: "持续更新中",',
  "};",
];

const deepseekUrl = "https://zubylon.tech/deepseek-chat/";

const monitorSnippet = [
  "function reportWithIdleCallback(data) {",
  "  const send = () => transportData.send(data);",
  "",
  '  if (\"requestIdleCallback\" in window) {',
  "    requestIdleCallback(send, { timeout: 1200 });",
  "    return;",
  "  }",
  "",
  "  Promise.resolve().then(send);",
  "}",
];

const monitorTags = [
  "requestIdleCallback",
  "Promise",
  "监控 SDK",
  "空闲上报",
  "上报时机",
];

const editorThemes = reactive({
  studio: "dark",
  monitor: "dark",
});

const copiedEditor = ref("");
let copyTimer = null;

const toggleEditorTheme = (editorKey) => {
  editorThemes[editorKey] =
    editorThemes[editorKey] === "dark" ? "light" : "dark";
};

const copyEditorCode = async (editorKey, lines) => {
  if (typeof navigator === "undefined" || !navigator.clipboard) {
    return;
  }

  await navigator.clipboard.writeText(lines.join("\n"));
  copiedEditor.value = editorKey;

  if (copyTimer) {
    clearTimeout(copyTimer);
  }

  copyTimer = window.setTimeout(() => {
    copiedEditor.value = "";
  }, 1600);
};

const featurePanels = [
  {
    eyebrow: "专题路线",
    title: "面试题与前端基础",
    desc: "从 HTML、CSS、JavaScript 到浏览器与框架，把高频知识点整理成方便复习的专题入口。",
    link: "/interview-questions/html/start/",
    badge: "体系化内容",
    cta: "查看路线",
  },
  {
    eyebrow: "工程实践",
    title: "工程化与项目实践",
    desc: "从 Vite、npm、发布流程到 SDK 与项目结构，记录更贴近真实业务的实践经验。",
    link: "/engineering/npm/private/",
    badge: "可落地方案",
    cta: "进入专题",
  },
  {
    eyebrow: "工具实验",
    title: "实用工具与效率入口",
    desc: "把图片压缩、代码处理和常用在线工具集中起来，减少重复搜索，提升日常效率。",
    link: "/tool/compressed-image/",
    badge: "高频工具",
    cta: "打开工具库",
  },
  {
    eyebrow: "持续输出",
    title: "DeepSeek Chat 与 Prompt 对话",
    desc: "把常用 AI Chat 入口直接放到首页，方便随手验证 Prompt、整理问题和辅助日常开发思路。",
    link: "https://zubylon.tech/deepseek-chat/",
    badge: "AI Chat",
    cta: "立即使用",
  },
];

const externalPattern = /^https?:\/\//;
const blogBasePattern = /^\/blog(?=\/|$)/;

const featuredDocs = computed(() =>
  siteData.slice(0, 8).map((item, index) => ({
    ...item,
    order: String(index + 1).padStart(2, "0"),
    tagList: item.tags.split(",").map((tag) => tag.trim()),
  })),
);

const linkTarget = (link) => (externalPattern.test(link) ? "_blank" : "_self");

const linkRel = (link) =>
  externalPattern.test(link) ? "noreferrer" : undefined;

const resolveLink = (link) => {
  if (externalPattern.test(link)) {
    return link;
  }

  const normalizedLink = link.replace(blogBasePattern, "") || "/";

  return withBase(normalizedLink);
};

const coverStyle = (image) => ({
  backgroundImage: `linear-gradient(180deg, rgba(15, 23, 42, 0.08), rgba(15, 23, 42, 0.68)), url(${image})`,
});
</script>

<style lang="scss" scoped>
.ui-home {
  width: min(1152px, calc(100vw - 32px));
  margin: 0 auto 32px;
  box-sizing: border-box;
}

.home-spotlight,
.home-bento,
.section-heading {
  display: grid;
  gap: 20px;
}

.home-spotlight {
  grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
  margin-bottom: 24px;
}

.spotlight-card,
.bento-card,
.story-link {
  border: 1px solid var(--home-panel-border);
  background: var(--home-panel-bg);
  box-shadow: var(--home-panel-shadow);
  backdrop-filter: blur(14px);
}

.spotlight-card {
  position: relative;
  overflow: hidden;
  border-radius: 28px;
  padding: 28px;
}

.spotlight-card--intro::after {
  content: "";
  position: absolute;
  right: -48px;
  bottom: -64px;
  width: 220px;
  height: 220px;
  border-radius: 32px;
  background: linear-gradient(
    135deg,
    rgba(31, 111, 255, 0.14),
    rgba(34, 197, 161, 0.08)
  );
  transform: rotate(14deg);
}

.spotlight-card--intro {
  grid-column: 1;
  grid-row: 1;
}

.spotlight-card--chat {
  grid-column: 1 / -1;
  grid-row: 2;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.spotlight-card--studio {
  grid-column: 2;
  grid-row: 1;
}

.section-title {
  margin: 0;
  max-width: 11ch;
  font-size: clamp(32px, 4vw, 48px);
  line-height: 1.04;
  letter-spacing: -0.04em;
  color: var(--vp-c-text-1);
}

.section-title--sm {
  max-width: none;
  font-size: clamp(28px, 3vw, 38px);
}

.section-title--chat {
  max-width: 16ch;
  font-size: clamp(30px, 3.2vw, 44px);
  line-height: 1.08;
  letter-spacing: -0.045em;
}

.section-copy {
  margin: 18px 0 0;
  max-width: 58ch;
  line-height: 1.85;
  color: var(--vp-c-text-2);
}

.section-copy--sm {
  margin: 0;
  justify-self: end;
  align-self: end;
}

.section-copy--chat {
  max-width: 48ch;
}

.chat-card__copy {
  display: flex;
  flex-direction: column;
  align-self: stretch;
  max-width: 760px;
}

.spotlight-card--chat .section-kicker {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 18px;
}

.spotlight-card--chat .section-kicker::after {
  content: "";
  display: block;
  width: clamp(120px, 16vw, 220px);
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(148, 163, 184, 0.36),
    rgba(148, 163, 184, 0)
  );
}

.chat-card__actions {
  margin-top: 18px;
}

.chat-preview {
  width: 100%;
  min-height: 540px;
  overflow: hidden;
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: 28px;
  background:
    linear-gradient(180deg, rgba(15, 23, 42, 0.04), rgba(15, 23, 42, 0.08)),
    #fff;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

.chat-preview__frame {
  display: block;
  width: 100%;
  height: 560px;
  border: 0;
  background: #fff;
}

.intro-metrics {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 14px;
  margin: 28px 0 0;
  padding: 0;
  list-style: none;
}

.intro-metrics li {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.48);
  border: 1px solid rgba(148, 163, 184, 0.14);
}

.dark .intro-metrics li {
  background: rgba(15, 23, 42, 0.38);
}

.metric-label {
  font-size: 12px;
  letter-spacing: 0.16em;
  color: var(--vp-c-text-3);
}

.metric-value {
  font-size: 16px;
  line-height: 1.6;
  color: var(--vp-c-text-1);
}

.intro-actions {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 24px;
}

.intro-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 18px;
  border-radius: 999px;
  border: 1px solid var(--home-panel-border);
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;
}

.intro-link:hover,
.bento-card:hover,
.story-link:hover {
  transform: translateY(-4px);
}

.intro-link--primary {
  color: #fff;
  border: none;
  background: linear-gradient(135deg, #1f6fff 0%, #19b7a4 65%, #ff8a3d 100%);
  box-shadow: 0 16px 28px rgba(31, 111, 255, 0.22);
}

.spotlight-card--studio {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.studio-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--vp-c-text-3);
}

.editor-shell,
.monitor-editor {
  border-radius: 22px;
  overflow: hidden;
}

.editor-shell__bar,
.monitor-editor__bar {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
}

.editor-shell__dots,
.monitor-editor__dots {
  display: inline-flex;
  gap: 6px;
}

.editor-shell__dots i,
.monitor-editor__dots i {
  display: block;
  width: 9px;
  height: 9px;
  border-radius: 50%;
}

.editor-shell__dots i:nth-child(1),
.monitor-editor__dots i:nth-child(1) {
  background: #fb7185;
}

.editor-shell__dots i:nth-child(2),
.monitor-editor__dots i:nth-child(2) {
  background: #fbbf24;
}

.editor-shell__dots i:nth-child(3),
.monitor-editor__dots i:nth-child(3) {
  background: #34d399;
}

.editor-shell__filename,
.monitor-editor__title,
.monitor-editor__meta {
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.editor-shell__actions,
.monitor-editor__actions {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.editor-shell__action,
.monitor-editor__action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  padding: 0 10px;
  border: 1px solid transparent;
  border-radius: 999px;
  font-size: 12px;
  cursor: pointer;
  text-decoration: none;
  transition:
    background-color 0.25s ease,
    border-color 0.25s ease,
    color 0.25s ease;
}

.editor-shell__action--primary,
.monitor-editor__action--primary {
  font-weight: 700;
}

.code-copy-button {
  color: #eff6ff !important;
  background: linear-gradient(135deg, #2563eb, #0ea5a4) !important;
  border-color: transparent !important;
  box-shadow: 0 10px 20px rgba(37, 99, 235, 0.16);
}

.editor-shell--dark {
  background: #0f172a;
  box-shadow: 0 18px 44px rgba(15, 23, 42, 0.2);
}

.editor-shell--dark .editor-shell__bar {
  border-bottom: 1px solid rgba(148, 163, 184, 0.14);
  background: rgba(15, 23, 42, 0.92);
}

.editor-shell--dark .editor-shell__filename {
  color: #e2e8f0;
}

.editor-shell--dark .editor-shell__action {
  color: #cbd5e1;
  background: rgba(30, 41, 59, 0.9);
  border-color: rgba(148, 163, 184, 0.16);
}

.editor-shell--dark .editor-shell__action--primary,
.editor-shell--light .editor-shell__action--primary,
.monitor-editor--dark .monitor-editor__action--primary,
.monitor-editor--light .monitor-editor__action--primary {
  color: #eff6ff;
  background: linear-gradient(135deg, #2563eb, #0ea5a4);
  border-color: transparent;
}

.editor-shell--dark .studio-code {
  background: #0f172a;
  color: #dbeafe;
}

.editor-shell--light {
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow: 0 16px 36px rgba(148, 163, 184, 0.16);
}

.editor-shell--light .editor-shell__bar {
  border-bottom: 1px solid rgba(148, 163, 184, 0.16);
  background: rgba(248, 250, 252, 0.98);
}

.editor-shell--light .editor-shell__filename {
  color: #0f172a;
}

.editor-shell--light .editor-shell__action {
  color: #334155;
  background: rgba(226, 232, 240, 0.72);
  border-color: rgba(148, 163, 184, 0.18);
}

.editor-shell--light .studio-code {
  background: rgba(255, 255, 255, 0.96);
  color: #0f172a;
}

.studio-code {
  margin: 0;
  padding: 18px;
  overflow: auto;
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  line-height: 1.85;
}

.studio-code code {
  display: grid;
}

.studio-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.monitor-editor {
  display: block;
  width: min(100%, 420px);
  margin-top: auto;
  margin-left: auto;
  border: 1px solid rgba(96, 165, 250, 0.18);
  background:
    linear-gradient(180deg, rgba(15, 23, 42, 0.98), rgba(15, 23, 42, 0.94)),
    radial-gradient(
      circle at top right,
      rgba(34, 197, 161, 0.2),
      transparent 34%
    );
  box-shadow: 0 18px 44px rgba(15, 23, 42, 0.26);
}

.monitor-editor--dark {
  border-color: rgba(96, 165, 250, 0.18);
  background:
    linear-gradient(180deg, rgba(15, 23, 42, 0.98), rgba(15, 23, 42, 0.94)),
    radial-gradient(
      circle at top right,
      rgba(34, 197, 161, 0.2),
      transparent 34%
    );
}

.monitor-editor--light {
  border-color: rgba(148, 163, 184, 0.22);
  background:
    linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.98),
      rgba(248, 250, 252, 0.98)
    ),
    radial-gradient(
      circle at top right,
      rgba(59, 130, 246, 0.12),
      transparent 34%
    );
  box-shadow: 0 18px 44px rgba(148, 163, 184, 0.2);
}

.monitor-editor--dark .monitor-editor__bar {
  border-bottom: 1px solid rgba(148, 163, 184, 0.14);
  background: rgba(15, 23, 42, 0.76);
}

.monitor-editor--light .monitor-editor__bar {
  border-bottom: 1px solid rgba(148, 163, 184, 0.16);
  background: rgba(248, 250, 252, 0.92);
}

.monitor-editor--dark .monitor-editor__title,
.monitor-editor--dark .monitor-editor__meta {
  color: #e2e8f0;
}

.monitor-editor--light .monitor-editor__title,
.monitor-editor--light .monitor-editor__meta {
  color: #0f172a;
}

.monitor-editor--dark .monitor-editor__action {
  color: #cbd5e1;
  background: rgba(30, 41, 59, 0.92);
  border-color: rgba(148, 163, 184, 0.16);
}

.monitor-editor--light .monitor-editor__action {
  color: #334155;
  background: rgba(226, 232, 240, 0.72);
  border-color: rgba(148, 163, 184, 0.18);
}

.monitor-editor__meta {
  padding: 10px 16px 0;
}

.monitor-editor--dark .monitor-editor__meta {
  color: #94a3b8;
}

.monitor-editor--light .monitor-editor__meta {
  color: #64748b;
}

.monitor-editor__code {
  margin: 0;
  padding: 14px 16px 16px;
  overflow: auto;
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  line-height: 1.8;
}

.monitor-editor--dark .monitor-editor__code {
  color: #dbeafe;
}

.monitor-editor--light .monitor-editor__code {
  color: #0f172a;
}

.monitor-editor__code code {
  display: grid;
}

.monitor-editor__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.monitor-editor__extras {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 14px 0 0;
}

.monitor-editor__tag {
  min-height: 30px;
  padding: 0 12px;
}

.monitor-editor--dark .monitor-editor__tag {
  background: rgba(31, 111, 255, 0.1);
  color: var(--vp-c-text-1);
}

.monitor-editor--light .monitor-editor__tag {
  background: rgba(31, 111, 255, 0.1);
  color: var(--vp-c-text-1);
}

.monitor-editor__link {
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  width: fit-content;
  padding: 0 12px;
  text-decoration: none;
  font-size: 12px;
  font-weight: 600;
}

.monitor-editor--dark .monitor-editor__link {
  background: rgba(31, 111, 255, 0.1);
  color: var(--vp-c-text-1);
}

.monitor-editor--light .monitor-editor__link {
  background: rgba(31, 111, 255, 0.1);
  color: var(--vp-c-text-1);
}

.studio-tag,
.story-tag,
.bento-badge {
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.studio-tag {
  background: rgba(31, 111, 255, 0.1);
  color: var(--vp-c-text-1);
}

.home-bento {
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-bottom: 32px;
}

.bento-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-height: 230px;
  padding: 22px;
  border-radius: 24px;
  text-decoration: none;
  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;
}

.bento-eyebrow {
  margin: 0;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.18em;
  color: var(--vp-c-text-3);
}

.bento-title {
  margin: 0;
  font-size: 24px;
  line-height: 1.18;
  color: var(--vp-c-text-1);
}

.bento-desc {
  margin: 0;
  line-height: 1.8;
  color: var(--vp-c-text-2);
}

.bento-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: auto;
}

.bento-badge {
  background: rgba(31, 111, 255, 0.1);
  color: var(--vp-c-brand-1);
}

.bento-arrow {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.home-section {
  padding-top: 12px;
}

.section-heading {
  grid-template-columns: minmax(0, 1fr) minmax(280px, 420px);
  align-items: end;
  margin-bottom: 18px;
}

.story-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin: 0;
  padding: 0;
  list-style: none;
}

.story-item {
  margin: 0;
}

.story-link {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  border-radius: 24px;
  text-decoration: none;
  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;
}

.story-cover {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 16px;
  min-height: 198px;
  padding: 18px;
  background-size: cover;
  background-position: center;
}

.story-order {
  position: absolute;
  top: 16px;
  left: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.16);
  backdrop-filter: blur(10px);
  font-size: 13px;
  font-weight: 700;
  color: #fff;
}

.story-title {
  margin: 0;
  max-width: 10ch;
  font-size: 28px;
  line-height: 1.12;
  color: #fff;
}

.story-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 14px;
  padding: 18px;
}

.story-desc {
  margin: 0;
  line-height: 1.8;
  color: var(--vp-c-text-2);
}

.story-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: auto;
}

.story-tag {
  background: rgba(148, 163, 184, 0.14);
  color: var(--vp-c-text-2);
}

@media (max-width: 1100px) {
  .home-spotlight,
  .home-bento,
  .story-grid,
  .section-heading {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .spotlight-card--intro,
  .spotlight-card--studio {
    grid-column: auto;
    grid-row: auto;
  }

  .spotlight-card--chat {
    grid-column: 1 / -1;
    grid-row: auto;
  }

  .chat-card__copy {
    max-width: none;
  }

  .chat-preview {
    min-height: 480px;
  }

  .chat-preview__frame {
    height: 480px;
  }

  .section-copy--sm {
    justify-self: auto;
  }
}

@media (max-width: 960px) {
  .ui-home {
    width: 100%;
    padding: 16px 20px 0;
    margin-bottom: 28px;
  }

  .home-spotlight,
  .section-heading {
    grid-template-columns: 1fr;
  }

  .spotlight-card--intro,
  .spotlight-card--studio,
  .spotlight-card--chat {
    grid-column: auto;
    grid-row: auto;
  }

  .section-copy--sm {
    margin-top: 4px;
  }

  .spotlight-card--chat {
    gap: 18px;
  }

  .chat-preview {
    min-height: 360px;
  }

  .chat-preview__frame {
    height: 360px;
  }
}

@media (max-width: 767px) {
  .ui-home {
    width: 100%;
    padding: 12px 12px 0;
    margin-bottom: 24px;
  }

  .home-spotlight,
  .home-bento,
  .story-grid,
  .section-heading {
    grid-template-columns: 1fr;
  }

  .spotlight-card,
  .bento-card,
  .story-body,
  .story-cover {
    padding-left: 16px;
    padding-right: 16px;
  }

  .spotlight-card {
    border-radius: 24px;
    padding-top: 18px;
    padding-bottom: 18px;
  }

  .section-kicker {
    margin-bottom: 10px;
    font-size: 11px;
    letter-spacing: 0.14em;
  }

  .section-title {
    max-width: none;
    font-size: 24px;
    line-height: 1.1;
  }

  .section-title--sm {
    font-size: 24px;
  }

  .section-title--chat {
    max-width: none;
    font-size: 28px;
    line-height: 1.12;
  }

  .section-copy {
    margin-top: 14px;
    font-size: 15px;
    line-height: 1.75;
  }

  .intro-metrics {
    gap: 10px;
    margin-top: 20px;
  }

  .intro-metrics li {
    padding: 12px 14px;
    border-radius: 16px;
  }

  .metric-label {
    letter-spacing: 0.12em;
  }

  .metric-value {
    font-size: 14px;
    line-height: 1.55;
  }

  .intro-actions {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
    margin-top: 18px;
  }

  .intro-link {
    width: 100%;
    min-height: 42px;
    padding: 0 14px;
    font-size: 15px;
  }

  .spotlight-card--studio {
    gap: 14px;
  }

  .spotlight-card--chat {
    gap: 14px;
  }

  .section-copy--chat {
    max-width: none;
  }

  .chat-card__copy {
    max-width: none;
  }

  .spotlight-card--chat .section-kicker {
    gap: 10px;
    margin-bottom: 12px;
  }

  .spotlight-card--chat .section-kicker::after {
    width: 72px;
  }

  .chat-preview {
    position: relative;
    min-height: 260px;
    border-radius: 22px;
  }

  .chat-preview__frame {
    position: absolute;
    top: 0;
    left: 0;
    width: 138%;
    height: 360px;
    max-width: none;
    transform: scale(0.72);
    transform-origin: top left;
  }

  .chat-card__actions {
    margin-top: 16px;
  }

  .chat-card__actions .intro-link {
    width: 100%;
  }

  .section-copy--chat {
    font-size: 14px;
    line-height: 1.7;
  }
}

@media (max-width: 480px) {
  .ui-home {
    padding: 14px 14px 0;
  }

  .spotlight-card--chat {
    gap: 12px;
  }

  .section-title--chat {
    font-size: 25px;
    line-height: 1.12;
  }

  .chat-preview {
    min-height: 240px;
    border-radius: 18px;
  }

  .chat-preview__frame {
    position: absolute;
    top: 0;
    left: 0;
    width: 146%;
    height: 340px;
    max-width: none;
    transform: scale(0.68);
  }

  .studio-head {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
    font-size: 11px;
  }

  .studio-code {
    padding: 14px;
    font-size: 12px;
    line-height: 1.7;
  }

  .studio-tags {
    gap: 8px;
  }

  .monitor-editor {
    width: 100%;
    border-radius: 18px;
  }

  .monitor-editor__bar {
    grid-template-columns: auto 1fr;
    gap: 10px;
  }

  .editor-shell__actions,
  .monitor-editor__actions {
    grid-column: 1 / -1;
    flex-wrap: wrap;
  }

  .monitor-editor__meta {
    padding-top: 8px;
  }

  .monitor-editor__code {
    padding: 12px 14px 14px;
    font-size: 11px;
    line-height: 1.7;
  }

  .monitor-editor__extras {
    gap: 10px;
    padding-top: 12px;
  }

  .monitor-editor__tags {
    gap: 8px;
  }

  .monitor-editor__tag {
    min-height: 28px;
    padding: 0 10px;
    font-size: 11px;
  }

  .monitor-editor__link {
    min-height: 28px;
    padding: 0 10px;
    font-size: 11px;
  }

  .studio-tag,
  .story-tag,
  .bento-badge {
    min-height: 28px;
    padding: 0 10px;
    font-size: 11px;
  }

  .bento-card {
    min-height: auto;
    gap: 12px;
    padding-top: 18px;
    padding-bottom: 18px;
    border-radius: 20px;
  }

  .bento-title {
    font-size: 22px;
  }

  .bento-desc {
    font-size: 15px;
    line-height: 1.7;
  }

  .bento-meta {
    flex-wrap: wrap;
    gap: 10px;
  }

  .home-section {
    padding-top: 8px;
  }

  .section-heading {
    margin-bottom: 14px;
  }

  .section-copy--sm {
    margin-top: 4px;
  }

  .story-cover {
    min-height: 170px;
    gap: 12px;
  }

  .story-order {
    top: 14px;
    left: 14px;
    width: 38px;
    height: 38px;
    border-radius: 12px;
  }

  .story-title {
    max-width: none;
    font-size: 22px;
    line-height: 1.15;
  }

  .story-body {
    gap: 12px;
    padding-top: 16px;
    padding-bottom: 16px;
  }

  .story-desc {
    font-size: 14px;
    line-height: 1.7;
  }
}

@media (max-width: 420px) {
  .section-title,
  .section-title--sm {
    font-size: 20px;
  }

  .section-copy {
    font-size: 14px;
  }

  .editor-shell__action,
  .monitor-editor__action {
    min-height: 26px;
    padding: 0 8px;
    font-size: 11px;
  }

  .intro-actions {
    grid-template-columns: 1fr;
  }

  .bento-title {
    font-size: 20px;
  }

  .bento-desc,
  .story-desc {
    font-size: 14px;
  }

  .story-cover {
    min-height: 156px;
  }

  .story-title {
    font-size: 20px;
  }
}
</style>
