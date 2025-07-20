<template>
  <div class="responsive-grid" :class="gridClasses">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  // 列数配置 (xs, sm, md, lg, xl)
  cols?: number | {
    xs?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  // 间距大小
  gap?: 'none' | 'small' | 'medium' | 'large'
  // 对齐方式
  align?: 'start' | 'center' | 'end' | 'stretch'
  // 垂直对齐
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
}

const props = withDefaults(defineProps<Props>(), {
  cols: 1,
  gap: 'medium',
  align: 'stretch',
  justify: 'start'
})

// 计算网格类名
const gridClasses = computed(() => {
  const classes: string[] = []
  
  // 处理列数配置
  if (typeof props.cols === 'number') {
    classes.push(`grid-cols-${props.cols}`)
  } else {
    Object.entries(props.cols).forEach(([breakpoint, cols]) => {
      if (cols) {
        classes.push(`grid-cols-${breakpoint}-${cols}`)
      }
    })
  }
  
  // 添加其他类名
  classes.push(`grid-gap-${props.gap}`)
  classes.push(`grid-align-${props.align}`)
  classes.push(`grid-justify-${props.justify}`)
  
  return classes
})
</script>

<style scoped>
.responsive-grid {
  display: grid;
  width: 100%;
}

/* 基础列数 */
.grid-cols-1 { grid-template-columns: repeat(1, 1fr); }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
.grid-cols-5 { grid-template-columns: repeat(5, 1fr); }
.grid-cols-6 { grid-template-columns: repeat(6, 1fr); }
.grid-cols-12 { grid-template-columns: repeat(12, 1fr); }

/* 间距配置 */
.grid-gap-none { gap: 0; }
.grid-gap-small { gap: 0.5rem; }
.grid-gap-medium { gap: 1rem; }
.grid-gap-large { gap: 2rem; }

/* 对齐方式 */
.grid-align-start { align-items: start; }
.grid-align-center { align-items: center; }
.grid-align-end { align-items: end; }
.grid-align-stretch { align-items: stretch; }

.grid-justify-start { justify-content: start; }
.grid-justify-center { justify-content: center; }
.grid-justify-end { justify-content: end; }
.grid-justify-between { justify-content: space-between; }
.grid-justify-around { justify-content: space-around; }
.grid-justify-evenly { justify-content: space-evenly; }

/* 响应式断点 */
/* 超小屏幕 (手机, 小于576px) */
@media (max-width: 575.98px) {
  .grid-cols-xs-1 { grid-template-columns: repeat(1, 1fr); }
  .grid-cols-xs-2 { grid-template-columns: repeat(2, 1fr); }
  .grid-cols-xs-3 { grid-template-columns: repeat(3, 1fr); }
  .grid-cols-xs-4 { grid-template-columns: repeat(4, 1fr); }
  
  /* 在小屏幕上减少间距 */
  .grid-gap-large { gap: 1rem; }
  .grid-gap-medium { gap: 0.75rem; }
}

/* 小屏幕 (手机横屏, 576px及以上) */
@media (min-width: 576px) {
  .grid-cols-sm-1 { grid-template-columns: repeat(1, 1fr); }
  .grid-cols-sm-2 { grid-template-columns: repeat(2, 1fr); }
  .grid-cols-sm-3 { grid-template-columns: repeat(3, 1fr); }
  .grid-cols-sm-4 { grid-template-columns: repeat(4, 1fr); }
  .grid-cols-sm-6 { grid-template-columns: repeat(6, 1fr); }
}

/* 中等屏幕 (平板, 768px及以上) */
@media (min-width: 768px) {
  .grid-cols-md-1 { grid-template-columns: repeat(1, 1fr); }
  .grid-cols-md-2 { grid-template-columns: repeat(2, 1fr); }
  .grid-cols-md-3 { grid-template-columns: repeat(3, 1fr); }
  .grid-cols-md-4 { grid-template-columns: repeat(4, 1fr); }
  .grid-cols-md-6 { grid-template-columns: repeat(6, 1fr); }
  .grid-cols-md-8 { grid-template-columns: repeat(8, 1fr); }
  .grid-cols-md-12 { grid-template-columns: repeat(12, 1fr); }
}

/* 大屏幕 (桌面, 992px及以上) */
@media (min-width: 992px) {
  .grid-cols-lg-1 { grid-template-columns: repeat(1, 1fr); }
  .grid-cols-lg-2 { grid-template-columns: repeat(2, 1fr); }
  .grid-cols-lg-3 { grid-template-columns: repeat(3, 1fr); }
  .grid-cols-lg-4 { grid-template-columns: repeat(4, 1fr); }
  .grid-cols-lg-5 { grid-template-columns: repeat(5, 1fr); }
  .grid-cols-lg-6 { grid-template-columns: repeat(6, 1fr); }
  .grid-cols-lg-8 { grid-template-columns: repeat(8, 1fr); }
  .grid-cols-lg-12 { grid-template-columns: repeat(12, 1fr); }
}

/* 超大屏幕 (大桌面, 1200px及以上) */
@media (min-width: 1200px) {
  .grid-cols-xl-1 { grid-template-columns: repeat(1, 1fr); }
  .grid-cols-xl-2 { grid-template-columns: repeat(2, 1fr); }
  .grid-cols-xl-3 { grid-template-columns: repeat(3, 1fr); }
  .grid-cols-xl-4 { grid-template-columns: repeat(4, 1fr); }
  .grid-cols-xl-5 { grid-template-columns: repeat(5, 1fr); }
  .grid-cols-xl-6 { grid-template-columns: repeat(6, 1fr); }
  .grid-cols-xl-8 { grid-template-columns: repeat(8, 1fr); }
  .grid-cols-xl-12 { grid-template-columns: repeat(12, 1fr); }
  
  /* 在大屏幕上增加间距 */
  .grid-gap-large { gap: 3rem; }
}
</style>
</script>
