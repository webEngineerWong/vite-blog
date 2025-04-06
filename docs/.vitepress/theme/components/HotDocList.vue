<template>
  <div class="ui-home">
    <div class="ui-title">热门文章推荐</div>
    <ul class="ui-project">
      <li class="item" v-for="v in siteData" :key="v.name">
        <a class="link" :href="v.link" target="_blank">
          <h3 class="title" :style="{ backgroundImage: `url(${v.image})` }">
            {{ v.name }}
          </h3>
          <p class="desc">{{ v.desc }}</p>
          <div class="tags">
            <el-tag
              v-for="(tag, index) in formatTags(v.tags)"
              :key="index"
              :type="getTagType(index, formatTags(v.tags).length)"
            >
              {{ tag }}
            </el-tag>
          </div>
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { siteData } from "../model/siteData.js";

/**
 * 将逗号分隔的标签字符串转换为数组
 * 例如 "html,常见面试题" => ["html", "常见面试题"]
 */
const formatTags = (tagsStr) => {
  return tagsStr.split(",").map((tag) => tag.trim());
};

/**
 * 根据标签索引和总数返回对应的 type
 * 如果只有1个标签，则返回 "primary"
 * 如果有2个标签，则第一个为 "primary"，第二个为 "success"
 * 如果有3个标签，则分别返回 "primary", "success", "danger"
 * 超过3个可按需要处理（此处简单循环）
 */
const getTagType = (index, total) => {
  const types = ["danger", "success", "primary"];
  if (total <= types.length) {
    return types[index];
  }
  // 如果标签数量超过 3，则按顺序循环使用
  return types[index % types.length];
};
</script>
<style lang="scss">

/**首页网址推荐**/
.ui-home {
  width: 1152px;
  margin: 0 auto 20px;
  list-style: none; // 移除默认列表符号
  padding-left: 0; // 清除默认左内边距
  ul {
    padding-left: 0 !important; // 清除默认左内边距
  }
  .ui-title {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60px;
    font-size: 26px;
    color: var(--vp-c-text-1); /* 使用 VitePress 文本颜色 */

  }
}
.ui-project {
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr; // 手机端默认单列  justify-content: space-between;
  margin-top: 20px;
  li {
    &::marker,
    &::-webkit-details-marker {
      // 针对Safari
      content: "";
      display: none;
    }
  }
  .item,
  .link {
    position: relative;
    height: 220px;
    text-decoration: none; // 移除a标签默认下划线
  }
  .item {
    margin-top: 0;
    max-width: 320px;
    .link {
      display: block;
      background: var(--vp-c-bg-soft); /* 使用次级背景色 */
      border-color: var(--vp-c-divider); /* 使用分割线颜色 */
      color: var(--vp-button-brand-text); /* 主文本颜色 */
      border: 1px solid transparent;
      border-radius: 6px;
      transition: all 0.4s;
      text-decoration: none; // 移除a标签默认下划线
    }
    .link:hover {
      -webkit-filter: brightness(1.2);
      background: var(--vp-c-bg-soft-mute);
      box-shadow: 0 15px 30px var(--vp-shadow-2);
      transform: rotateY(-0.1deg) scale(1.03) translateZ(0);
    }
    .title {
      height: 105px;
      background-size: cover;
      background-position: center;
      padding-top: 40px;
      font-size: 24px;
      color: var(--vp-c-text-inverse-1); /* 反色文本 */
      text-align: center;
      border-radius: 6px 6px 0 0;
      margin: 0;
    }
    .desc {
      line-height: 2;
      padding: 0 12px;
      font-size: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      color: var(--vp-c-text-2); /* 次级文本颜色 */
    }
    .tags {
      position: absolute;
      bottom: 10px;
      left: 12px; // 如需要可以调整左右边距
      right: 12px;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      // 可选：设置居中或者其他对齐方式
    }
    .tag {
      font-size: 12px;
    }
    .el-tag {
      background: var(--vp-c-mute);
      border-color: var(--vp-c-divider);
      color: var(--vp-badge-tip-text);

      &--primary {
        background: var(--vp-c-brand-soft);
        border-color: var(--vp-c-brand-soft);
        color: var(--vp-c-text-2) !important;
      }

      &--success {
        background: var(--vp-c-success-soft);
        border-color: var(--vp-c-success-soft);
        color: var(--vp-c-text-2) !important;
      }

      &--danger {
        background: var(--vp-c-danger-soft);
        border-color: var(--vp-c-danger-soft);
        color: var(--vp-c-text-2) !important;
      }

      &:hover {
        opacity: 0.8 !important;
      }
    }
  }
}
// 手机横屏/小平板 (≥600px)
@media (min-width: 600px) {
  .ui-project {
    grid-template-columns: repeat(2, 1fr); // 平板端双列
  }
}

@media (min-width: 600px) and (max-width: 1024px) {
  .ui-project {
    grid-template-columns: repeat(3, 3fr);
  }
}
@media (min-width: 1025px) {
  .ui-project {
    grid-template-columns: repeat(auto-fit, minmax(224px, 1fr));
  }
}
</style>
