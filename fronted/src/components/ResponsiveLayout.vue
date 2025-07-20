<template>
  <div class="responsive-layout" :class="layoutClasses">
    <!-- 头部区域 -->
    <header v-if="$slots.header" class="layout-header">
      <div class="container">
        <slot name="header"></slot>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="layout-main" :class="mainClasses">
      <div :class="containerClass">
        <slot></slot>
      </div>
    </main>

    <!-- 底部区域 -->
    <footer v-if="$slots.footer" class="layout-footer">
      <div class="container">
        <slot name="footer"></slot>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  // 是否使用流式布局（占满整个宽度）
  fluid?: boolean
  // 是否居中内容
  centered?: boolean
  // 是否使用全屏高度
  fullHeight?: boolean
  // 内边距大小
  padding?: 'none' | 'small' | 'medium' | 'large'
  // 背景类型
  background?: 'default' | 'white' | 'gray' | 'transparent'
}

const props = withDefaults(defineProps<Props>(), {
  fluid: false,
  centered: false,
  fullHeight: true,
  padding: 'medium',
  background: 'default'
})

// 计算布局类名
const layoutClasses = computed(() => ({
  'layout-fluid': props.fluid,
  'layout-centered': props.centered,
  'layout-full-height': props.fullHeight,
  [`layout-padding-${props.padding}`]: true,
  [`layout-bg-${props.background}`]: true
}))

// 计算主要内容区域类名
const mainClasses = computed(() => ({
  'main-centered': props.centered
}))

// 计算容器类名
const containerClass = computed(() => 
  props.fluid ? 'container-fluid' : 'container'
)
</script>

<style scoped>
.responsive-layout {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  min-height: calc(var(--vh, 1vh) * 100);
}

.layout-full-height {
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
}

/* 头部样式 */
.layout-header {
  flex-shrink: 0;
  width: 100%;
  z-index: 1000;
}

/* 主要内容区域 */
.layout-main {
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.main-centered {
  justify-content: center;
  align-items: center;
}

/* 底部样式 */
.layout-footer {
  flex-shrink: 0;
  width: 100%;
  margin-top: auto;
}

/* 内边距变体 */
.layout-padding-none .container,
.layout-padding-none .container-fluid {
  padding: 0;
}

.layout-padding-small .container,
.layout-padding-small .container-fluid {
  padding: 0.5rem;
}

.layout-padding-medium .container,
.layout-padding-medium .container-fluid {
  padding: 1rem;
}

.layout-padding-large .container,
.layout-padding-large .container-fluid {
  padding: 2rem;
}

/* 背景变体 */
.layout-bg-default {
  background-color: #f5f5f5;
}

.layout-bg-white {
  background-color: #ffffff;
}

.layout-bg-gray {
  background-color: #f8f9fa;
}

.layout-bg-transparent {
  background-color: transparent;
}

/* 响应式调整 */
@media (max-width: 575.98px) {
  .layout-padding-medium .container,
  .layout-padding-medium .container-fluid {
    padding: 0.75rem;
  }
  
  .layout-padding-large .container,
  .layout-padding-large .container-fluid {
    padding: 1rem;
  }
}

@media (min-width: 1200px) {
  .layout-padding-large .container,
  .layout-padding-large .container-fluid {
    padding: 3rem;
  }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .layout-bg-default {
    background-color: #1a1a1a;
  }
  
  .layout-bg-white {
    background-color: #2d2d2d;
  }
  
  .layout-bg-gray {
    background-color: #252525;
  }
}
</style>
</script>
