<script setup lang="ts">
import WelcomeItem from './WelcomeItem.vue'
import ResponsiveGrid from './ResponsiveGrid.vue'
import DocumentationIcon from './icons/IconDocumentation.vue'
import ToolingIcon from './icons/IconTooling.vue'
import EcosystemIcon from './icons/IconEcosystem.vue'
import CommunityIcon from './icons/IconCommunity.vue'
import SupportIcon from './icons/IconSupport.vue'

const openReadmeInEditor = () => fetch('/__open-in-editor?file=README.md')
</script>

<template>
  <div class="welcome-container">
    <!-- 欢迎标题 -->
    <div class="welcome-header">
      <h1 class="welcome-title">欢迎使用 Vue 3</h1>
      <p class="welcome-subtitle">现代化的前端框架，让开发更简单高效</p>
    </div>

    <!-- 响应式网格布局 -->
    <ResponsiveGrid
      :cols="{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }"
      gap="large"
      align="stretch"
    >
      <WelcomeItem>
        <template #icon>
          <DocumentationIcon />
        </template>
        <template #heading>文档</template>

        Vue 的
        <a href="https://vuejs.org/" target="_blank" rel="noopener">官方文档</a>
        为您提供了入门所需的所有信息。
      </WelcomeItem>

      <WelcomeItem>
        <template #icon>
          <ToolingIcon />
        </template>
        <template #heading>工具链</template>

        本项目使用
        <a href="https://vite.dev/guide/features.html" target="_blank" rel="noopener">Vite</a>
        进行构建。推荐的 IDE 配置是
        <a href="https://code.visualstudio.com/" target="_blank" rel="noopener">VSCode</a>
        +
        <a href="https://github.com/vuejs/language-tools" target="_blank" rel="noopener">Vue - Official</a>。
        如果需要测试组件和网页，请查看
        <a href="https://vitest.dev/" target="_blank" rel="noopener">Vitest</a>
        和
        <a href="https://www.cypress.io/" target="_blank" rel="noopener">Cypress</a>
        /
        <a href="https://playwright.dev/" target="_blank" rel="noopener">Playwright</a>。

        <br />

        更多说明请查看
        <a href="javascript:void(0)" @click="openReadmeInEditor"><code>README.md</code></a>。
      </WelcomeItem>

      <WelcomeItem>
        <template #icon>
          <EcosystemIcon />
        </template>
        <template #heading>生态系统</template>

        获取项目的官方工具和库：
        <a href="https://pinia.vuejs.org/" target="_blank" rel="noopener">Pinia</a>、
        <a href="https://router.vuejs.org/" target="_blank" rel="noopener">Vue Router</a>、
        <a href="https://test-utils.vuejs.org/" target="_blank" rel="noopener">Vue Test Utils</a> 和
        <a href="https://github.com/vuejs/devtools" target="_blank" rel="noopener">Vue Dev Tools</a>。
        如果需要更多资源，建议访问
        <a href="https://github.com/vuejs/awesome-vue" target="_blank" rel="noopener">Awesome Vue</a>。
      </WelcomeItem>

      <WelcomeItem>
        <template #icon>
          <CommunityIcon />
        </template>
        <template #heading>社区</template>

        遇到问题？在
        <a href="https://chat.vuejs.org" target="_blank" rel="noopener">Vue Land</a>
        （我们的官方 Discord 服务器）或
        <a href="https://stackoverflow.com/questions/tagged/vue.js" target="_blank" rel="noopener">StackOverflow</a>
        上提问。您还应该关注官方的
        <a href="https://bsky.app/profile/vuejs.org" target="_blank" rel="noopener">@vuejs.org</a>
        Bluesky 账户或
        <a href="https://x.com/vuejs" target="_blank" rel="noopener">@vuejs</a>
        X 账户，获取 Vue 世界的最新消息。
      </WelcomeItem>

      <WelcomeItem>
        <template #icon>
          <SupportIcon />
        </template>
        <template #heading>支持 Vue</template>

        作为一个独立项目，Vue 依靠社区支持来维持其可持续性。您可以通过
        <a href="https://vuejs.org/sponsor/" target="_blank" rel="noopener">成为赞助者</a>
        来帮助我们。
      </WelcomeItem>
    </ResponsiveGrid>
  </div>
</template>

<style scoped>
.welcome-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-header {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem 0;
}

.welcome-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.welcome-subtitle {
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  color: #7f8c8d;
  margin: 0;
  line-height: 1.6;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .welcome-header {
    margin-bottom: 2rem;
    padding: 1rem 0;
  }
}

@media (max-width: 480px) {
  .welcome-header {
    margin-bottom: 1.5rem;
  }

  .welcome-title {
    line-height: 1.2;
  }
}
</style>