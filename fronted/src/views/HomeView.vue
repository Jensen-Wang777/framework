<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
import ResponsiveLayout from '../components/ResponsiveLayout.vue'
</script>

<template>
  <ResponsiveLayout
    :full-height="true"
    :centered="true"
    padding="medium"
    background="default"
  >
    <template #header>
      <nav class="main-nav">
        <div class="nav-brand">
          <h1>我的应用</h1>
        </div>
        <div class="nav-links">
          <router-link to="/" class="nav-link">首页</router-link>
          <router-link to="/about" class="nav-link">关于</router-link>
          <router-link to="/login" class="nav-link">登录</router-link>
        </div>
      </nav>
    </template>

    <div class="home-content">
      <TheWelcome />
    </div>

    <template #footer>
      <div class="main-footer">
        <p>&copy; 2024 我的应用. 保留所有权利.</p>
      </div>
    </template>
  </ResponsiveLayout>
</template>

<style scoped>
/* 导航栏样式 */
.main-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.nav-brand h1 {
  color: #2c3e50;
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 600;
  margin: 0;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-link {
  color: #666;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: #667eea;
  background-color: rgba(102, 126, 234, 0.1);
}

/* 主要内容区域 */
.home-content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

/* 底部样式 */
.main-footer {
  text-align: center;
  padding: 2rem 0;
  color: #666;
  border-top: 1px solid #e1e8ed;
  margin-top: 2rem;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .main-nav {
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;
  }

  .nav-links {
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .nav-link {
    padding: 0.75rem 1.25rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .nav-links {
    flex-direction: column;
    width: 100%;
  }

  .nav-link {
    width: 100%;
    text-align: center;
  }
}
</style>
