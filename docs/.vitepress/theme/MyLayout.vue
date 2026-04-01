<script setup>
import Copyright from "./layout/Copyright.vue";
import ValineComment from "../ValineComment/index.vue";
import { useData, withBase } from "vitepress";
import md5 from "blueimp-md5";
import { nextTick, onMounted, ref } from "vue";
const { page } = useData();
import Layout from "./components/Layout.vue";

const live2dOptions = {
  apiPath: "https://cdn.jsdelivr.net/npm/live2d-static-api@latest/indexes",
  model: ["Potion-Maker/Pio", "default"],
  size: 255,
  direction: "left",
  customId: "site-live2d-canvas",
};

const showLive2d = ref(false);

const detectDeviceType = () => {
  if (typeof window === "undefined") return "Desktop";
  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
  const isMobileUA =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );
  return isTouchDevice || isMobileUA ? "Mobile" : "Desktop";
};

onMounted(async () => {
  if (detectDeviceType() === "Mobile") return;

  showLive2d.value = true;
  await nextTick();

  const [modelPath, textureId] = live2dOptions.model;
  const modelUrl = `${live2dOptions.apiPath}/${modelPath}/${textureId}.json`;

  // live2d.min.js 通过 head 配置以 <script> 标签加载，
  // 但可能还没执行完，做一个短暂轮询等待
  let waited = 0;
  while (typeof window.loadlive2d !== "function" && waited < 5000) {
    await new Promise((r) => setTimeout(r, 100));
    waited += 100;
  }

  if (typeof window.loadlive2d !== "function") {
    console.error("[live2d] loadlive2d not available after waiting 5s");
    return;
  }

  try {
    window.loadlive2d(live2dOptions.customId, modelUrl);
    console.log("[live2d] loaded:", modelUrl);
  } catch (e) {
    console.error("[live2d] load failed", e);
  }
});
</script>

<template>
  <Layout>
    <template #doc-footer-before>
      <ClientOnly>
        <Copyright :key="md5(page.relativePath)" />
      </ClientOnly>
    </template>
    <template #doc-after>
      <ClientOnly>
        <ValineComment />
        <AlanBackTop v-if="detectDeviceType() === 'Desktop'"></AlanBackTop>
      </ClientOnly>
    </template>
  </Layout>
  <Confetti></Confetti>
  <VisitorPanel />
  <ClientOnly>
    <div v-if="showLive2d" class="site-live2d-wrap">
      <canvas
        :id="live2dOptions.customId"
        :width="live2dOptions.size"
        :height="live2dOptions.size"
      ></canvas>
    </div>
  </ClientOnly>
</template>

<style scoped>
.site-live2d-wrap {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 120;
  pointer-events: none;
}
.site-live2d-wrap canvas {
  pointer-events: auto;
  cursor: grab;
}
</style>
