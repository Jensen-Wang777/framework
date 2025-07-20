<template>
  <div class="admin-login-container w-100 min-vh-100">
    <!-- 顶部导航栏 -->
    <div class="admin-header">
      <div class="header-content">
        <div class="logo-section">
          <div class="user-logo">
            <i class="el-icon-user"></i>
          </div>
          <span class="system-name">用户登录系统</span>
        </div>
        <div class="header-info">
          <span class="version">v1.0.0</span>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 - 改为水平分栏布局 -->
    <div class="admin-main">
      <!-- 左侧装饰区域 -->
      <div class="login-left-section">
        <div class="system-info">
          <h1 class="system-title">欢迎使用我们的平台</h1>
          <p class="system-desc">安全、便捷、高效的用户服务平台</p>
          <div class="system-features">
            <div class="feature-item">
              <div class="feature-icon"><i class="el-icon-s-data"></i></div>
              <div class="feature-text">个人中心</div>
            </div>
            <div class="feature-item">
              <div class="feature-icon"><i class="el-icon-s-tools"></i></div>
              <div class="feature-text">账户设置</div>
            </div>
            <div class="feature-item">
              <div class="feature-icon"><i class="el-icon-s-custom"></i></div>
              <div class="feature-text">个性化</div>
            </div>
            <div class="feature-item">
              <div class="feature-icon"><i class="el-icon-s-claim"></i></div>
              <div class="feature-text">安全保护</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 右侧登录区域 -->
      <div class="login-right-section">
        <div class="login-panel">
          <!-- 登录卡片 -->
          <div class="login-card">
            <!-- 登录头部 -->
            <div class="login-header">
              <div class="login-icon">
                <i class="el-icon-user"></i>
              </div>
              <h2 class="login-title">用户登录</h2>
              <p class="login-subtitle">请输入您的用户名和密码</p>
            </div>

            <!-- 登录表单 -->
            <el-form
              ref="loginFormRef"
              :model="loginForm"
              :rules="loginRules"
              label-position="top"
              size="large"
              @keyup.enter="handleLogin"
              class="admin-form"
            >
              <el-form-item label="用户名" prop="username">
                <el-input
                  v-model="loginForm.username"
                  placeholder="请输入用户名"
                  :prefix-icon="User"
                  clearable
                  autocomplete="username"
                />
              </el-form-item>

              <el-form-item label="密码" prop="password">
                <el-input
                  v-model="loginForm.password"
                  type="password"
                  placeholder="请输入密码"
                  :prefix-icon="Lock"
                  show-password
                  autocomplete="current-password"
                />
              </el-form-item>

              <div class="form-options">
                <el-checkbox v-model="rememberMe">记住登录状态</el-checkbox>
                <el-link type="primary" :underline="false" @click="forgotPassword">
                  忘记密码？
                </el-link>
              </div>

              <el-form-item>
                <el-button
                  type="primary"
                  :loading="loading"
                  @click="handleLogin"
                  class="admin-login-btn"
                  size="large"
                >
                  {{ loading ? '登录中...' : '立即登录' }}
                </el-button>
              </el-form-item>

              <!-- 注册链接 -->
              <div class="register-section">
                <span class="register-text">还没有账号？</span>
                <el-link type="primary" :underline="false" @click="goToRegister" class="register-link">
                  立即注册
                </el-link>
              </div>
            </el-form>
          </div>

          <!-- 底部信息 -->
          <div class="login-footer">
            <div class="footer-links">
              <el-link type="info" :underline="false">使用帮助</el-link>
              <span class="divider">|</span>
              <el-link type="info" :underline="false">联系客服</el-link>
              <span class="divider">|</span>
              <el-link type="info" :underline="false">服务条款</el-link>
            <span class="divider">|</span>
            <el-link type="primary" :underline="false" @click="goToRegister">用户注册</el-link>
            </div>
            <div class="copyright">
              <p>© 2024 用户服务平台. All rights reserved.</p>
              <p>建议使用 Chrome、Firefox、Safari 等现代浏览器</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { useLocalStorage } from '@/composables/useLocalStorage'

const router = useRouter()
const userStore = useUserStore()
const { getItem, setItem } = useLocalStorage()

const loginFormRef = ref<FormInstance>()
const loading = ref(false)
const rememberMe = ref(false)

// 登录表单数据
const loginForm = reactive({
  username: '',
  password: ''
})

// 表单验证规则
const loginRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 30, message: '密码长度在 6 到 30 个字符', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9]{6,}$/,
      message: '密码必须至少6个字符，只能包含字母和数字',
      trigger: 'blur'
    }
  ]
}

// 初始化，检查本地存储的用户名
onMounted(() => {
  const savedUsername = getItem('rememberedUsername')
  if (savedUsername) {
    loginForm.username = savedUsername
    rememberMe.value = true
  }
})

// 处理登录
const handleLogin = async () => {
  if (!loginFormRef.value) return

  try {
    await loginFormRef.value.validate()
    
    loading.value = true
    
    // 保存用户名到本地存储（如果选择记住我）
    if (rememberMe.value) {
      setItem('rememberedUsername', loginForm.username)
    } else {
      setItem('rememberedUsername', '')
    }
    
    try {
      const result = await userStore.login({
        username: loginForm.username,
        password: loginForm.password
      })
      
      if (result.success) {
        ElMessage({
          type: 'success',
          message: '登录成功，欢迎回来！',
          duration: 2000
        })
        router.push('/profile')
      } else {
        ElMessage({
          type: 'error',
          message: result.message || '登录失败，请检查用户名和密码',
          duration: 3000
        })
      }
    } catch (error: any) {
      const errorMsg = error?.message || '登录失败，请稍后重试'
      ElMessage({
        type: 'error',
        message: errorMsg,
        duration: 3000
      })
      
      // 如果是网络错误，给出更具体的提示
      if (error.name === 'NetworkError') {
        ElMessage({
          type: 'warning',
          message: '网络连接出现问题，请检查您的网络',
          duration: 5000
        })
      }
    }
  } catch (validationError) {
    // 表单验证失败
    ElMessage({
      type: 'warning',
      message: '请正确填写登录信息',
      duration: 2000
    })
  } finally {
    loading.value = false
  }
}

// 忘记密码
const forgotPassword = () => {
  ElMessageBox.prompt('请输入您的注册邮箱', '找回密码', {
    confirmButtonText: '提交',
    cancelButtonText: '取消',
    inputPattern: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
    inputErrorMessage: '请输入正确的邮箱地址'
  }).then(({ value }) => {
    ElMessage({
      type: 'info',
      message: `重置密码链接已发送至邮箱: ${value}`
    })
  }).catch(() => {})
}

// 社交媒体登录
const socialLogin = (platform: string) => {
  ElMessage({
    type: 'info',
    message: `${platform}登录功能正在开发中...`,
    duration: 2000
  })
}

// 跳转到注册页面
const goToRegister = () => {
  router.push('/register')
}
</script>

<style scoped>
/* 主容器 */
.admin-login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
}

/* 顶部导航栏 */
.admin-header {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0;
  position: relative;
  z-index: 10;
}

.header-content {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-logo {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

.system-name {
  color: white;
  font-size: 18px;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.header-info .version {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  background: rgba(255, 255, 255, 0.1);
  padding: 4px 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* 主要内容区域 - 水平分栏布局 */
.admin-main {
  flex: 1;
  display: flex;
  min-height: calc(100vh - 64px);
}

/* 左侧装饰区域 */
.login-left-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  position: relative;
}

.system-info {
  max-width: 600px;
  color: white;
  text-align: center;
  animation: fadeIn 1s ease-out;
}

.system-title {
  font-size: 44px;
  font-weight: 700;
  margin-bottom: 16px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.system-desc {
  font-size: 18px;
  margin-bottom: 60px;
  opacity: 0.9;
}

.system-features {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 40px;
  margin-top: 40px;
}

.feature-item {
  text-align: center;
  animation: slideUp 0.6s ease-out;
  animation-fill-mode: both;
}

.feature-item:nth-child(2) {
  animation-delay: 0.2s;
}

.feature-item:nth-child(3) {
  animation-delay: 0.4s;
}

.feature-item:nth-child(4) {
  animation-delay: 0.6s;
}

.feature-icon {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  font-size: 32px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.feature-item:hover .feature-icon {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
  background: rgba(255, 255, 255, 0.3);
}

.feature-text {
  font-size: 16px;
  font-weight: 500;
}

/* 右侧登录区域 */
.login-right-section {
  width: 550px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  position: relative;
}

.login-panel {
  width: 100%;
  max-width: 420px;
  position: relative;
}

/* 登录卡片 */
.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 40px;
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.login-card:hover {
  transform: translateY(-2px);
  box-shadow:
    0 25px 50px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.3);
}

/* 登录头部 */
.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: white;
  font-size: 28px;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.login-title {
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 8px;
}

.login-subtitle {
  color: #7f8c8d;
  font-size: 14px;
  margin: 0;
  line-height: 1.5;
}

/* 表单样式 */
.admin-form {
  margin-top: 24px;
}

.admin-form :deep(.el-form-item__label) {
  color: #2c3e50;
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 8px;
}

.admin-form :deep(.el-input__wrapper) {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #e1e8ed;
  transition: all 0.3s ease;
}

.admin-form :deep(.el-input__wrapper:hover) {
  border-color: #667eea;
  box-shadow: 0 2px 12px rgba(102, 126, 234, 0.15);
}

.admin-form :deep(.el-input__wrapper.is-focus) {
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0 24px;
  font-size: 14px;
}

.admin-login-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  transition: all 0.3s ease;
}

.admin-login-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
}

/* 注册区域样式 */
.register-section {
  text-align: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e1e8ed;
  font-size: 14px;
}

.register-text {
  color: #7f8c8d;
  margin-right: 8px;
}

.register-link {
  font-weight: 500;
  transition: all 0.3s ease;
}

.register-link:hover {
  transform: translateX(2px);
}

/* 底部信息 */
.login-footer {
  margin-top: 40px;
  text-align: center;
}

.footer-links {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.footer-links .divider {
  color: #bdc3c7;
  margin: 0 4px;
}

.copyright {
  color: #7f8c8d;
  font-size: 12px;
  line-height: 1.5;
}

.copyright p {
  margin: 4px 0;
}

/* 动画 */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 响应式设计 */
@media (max-width: 1280px) {
  .system-title {
    font-size: 36px;
  }
  
  .system-features {
    gap: 20px;
  }
  
  .feature-icon {
    width: 70px;
    height: 70px;
    font-size: 28px;
  }
}

@media (max-width: 992px) {
  .admin-main {
    flex-direction: column;
  }
  
  .login-left-section {
    padding: 40px 20px;
  }
  
  .login-right-section {
    width: 100%;
    padding: 0;
  }
  
  .login-panel {
    margin: 30px auto;
    padding: 0 20px;
  }
}

@media (max-width: 768px) {
  .admin-header {
    padding: 0;
  }

  .header-content {
    padding: 0 16px;
    height: 56px;
  }

  .system-name {
    font-size: 16px;
  }

  .login-card {
    padding: 32px 24px;
  }

  .login-icon {
    width: 56px;
    height: 56px;
    font-size: 24px;
  }

  .login-title {
    font-size: 20px;
  }

  .login-subtitle {
    font-size: 13px;
  }

  .admin-login-btn {
    height: 44px;
    font-size: 15px;
  }

  .footer-links {
    flex-direction: column;
    gap: 12px;
  }

  .footer-links .divider {
    display: none;
  }
  
  .system-title {
    font-size: 28px;
  }
  
  .system-desc {
    font-size: 16px;
    margin-bottom: 30px;
  }
  
  .system-features {
    gap: 16px;
  }
  
  .feature-icon {
    width: 60px;
    height: 60px;
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .login-card {
    padding: 24px 20px;
    border-radius: 12px;
  }

  .form-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .login-footer {
    margin-top: 32px;
  }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .admin-login-container {
    background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  }

  .login-card {
    background: rgba(44, 62, 80, 0.95);
    color: #ecf0f1;
  }

  .login-title {
    color: #ecf0f1;
  }

  .login-subtitle {
    color: #bdc3c7;
  }

  .admin-form :deep(.el-form-item__label) {
    color: #ecf0f1;
  }
}
</style>