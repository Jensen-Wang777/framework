<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted, onUnmounted } from 'vue'

// 动态视口高度处理（解决移动端地址栏问题）
const setViewportHeight = () => {
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
}

onMounted(() => {
  setViewportHeight()
  window.addEventListener('resize', setViewportHeight)
  window.addEventListener('orientationchange', setViewportHeight)
})

onUnmounted(() => {
  window.removeEventListener('resize', setViewportHeight)
  window.removeEventListener('orientationchange', setViewportHeight)
})
</script>

<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<style>
/* CSS Reset 和基础样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  /* 防止水平滚动 */
  overflow-x: hidden;
  /* 平滑滚动 */
  scroll-behavior: smooth;
  /* 设置基础字体大小为响应式 */
  font-size: clamp(14px, 2.5vw, 16px);
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background-color: #f5f5f5;
  /* 防止水平滚动 */
  overflow-x: hidden;
  /* 使用动态视口高度 */
  min-height: 100vh;
  min-height: calc(var(--vh, 1vh) * 100);
  /* 改善文本渲染 */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

#app {
  /* 使用动态视口高度 */
  min-height: 100vh;
  min-height: calc(var(--vh, 1vh) * 100);
  width: 100%;
  /* 防止水平滚动 */
  overflow-x: hidden;
  /* 弹性布局 */
  display: flex;
  flex-direction: column;
}

/* 响应式图片和媒体 */
img, video, iframe {
  max-width: 100%;
  height: auto;
}

/* 响应式表格 */
table {
  width: 100%;
  border-collapse: collapse;
}

/* 响应式表单元素 */
input, textarea, select, button {
  max-width: 100%;
  font-family: inherit;
  font-size: inherit;
}

/* 通用响应式工具类 */
.w-full { width: 100%; }
.h-full { height: 100%; }
.min-h-screen { min-height: 100vh; min-height: calc(var(--vh, 1vh) * 100); }
.flex { display: flex; }
.flex-col { flex-direction: column; }
.flex-row { flex-direction: row; }
.flex-wrap { flex-wrap: wrap; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
.text-center { text-align: center; }
.hidden { display: none; }

/* 响应式显示工具类 */
@media (max-width: 575.98px) {
  .hidden-xs { display: none !important; }
}

@media (min-width: 576px) and (max-width: 767.98px) {
  .hidden-sm { display: none !important; }
}

@media (min-width: 768px) and (max-width: 991.98px) {
  .hidden-md { display: none !important; }
}

@media (min-width: 992px) and (max-width: 1199.98px) {
  .hidden-lg { display: none !important; }
}

@media (min-width: 1200px) {
  .hidden-xl { display: none !important; }
}

/* 只在特定屏幕尺寸显示 */
@media (max-width: 575.98px) {
  .show-xs { display: block !important; }
}

@media (min-width: 576px) and (max-width: 767.98px) {
  .show-sm { display: block !important; }
}

@media (min-width: 768px) and (max-width: 991.98px) {
  .show-md { display: block !important; }
}

@media (min-width: 992px) and (max-width: 1199.98px) {
  .show-lg { display: block !important; }
}

@media (min-width: 1200px) {
  .show-xl { display: block !important; }
}
</style>
