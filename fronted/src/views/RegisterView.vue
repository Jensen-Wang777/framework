<template>
  <div class="register-container">
    <div class="register-content">
      <div class="register-header">
        <h1 class="register-title">用户注册</h1>
        <p class="register-subtitle">创建您的账号，开始使用我们的服务</p>
      </div>
      
      <el-form
        ref="registerFormRef"
        :model="registerForm"
        :rules="registerRules"
        label-position="top"
        size="large"
        @keyup.enter="handleRegister"
      >
        <el-form-item prop="username">
          <el-input
            v-model="registerForm.username"
            placeholder="用户名"
            :prefix-icon="User"
            clearable
            autocomplete="username"
          />
        </el-form-item>

        <el-form-item prop="email">
          <el-input
            v-model="registerForm.email"
            placeholder="邮箱地址"
            :prefix-icon="Message"
            clearable
            autocomplete="email"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="密码"
            :prefix-icon="Lock"
            show-password
            autocomplete="new-password"
          />
        </el-form-item>

        <el-form-item prop="confirmPassword">
          <el-input
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="确认密码"
            :prefix-icon="Lock"
            show-password
            autocomplete="new-password"
          />
        </el-form-item>

        <el-form-item class="agreement-item">
          <el-checkbox v-model="registerForm.agreement" class="agreement-checkbox">
            我已阅读并同意 <el-link type="primary" :underline="false" @click="showTerms">服务条款</el-link> 和 <el-link type="primary" :underline="false" @click="showPrivacy">隐私政策</el-link>
          </el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            @click="handleRegister"
            class="register-button"
            :disabled="!registerForm.agreement"
          >
            {{ loading ? '注册中...' : '注册账号' }}
          </el-button>
        </el-form-item>

        <div class="register-footer">
          <span>已有账号？</span>
          <el-link type="primary" @click="goToLogin">立即登录</el-link>
        </div>
      </el-form>

      <div class="register-divider">
        <span>或通过以下方式注册</span>
      </div>

      <div class="social-login">
        <el-button class="social-button wechat" @click="socialRegister('wechat')">
          <i class="fab fa-weixin"></i>
        </el-button>
        <el-button class="social-button qq" @click="socialRegister('qq')">
          <i class="fab fa-qq"></i>
        </el-button>
        <el-button class="social-button weibo" @click="socialRegister('weibo')">
          <i class="fab fa-weibo"></i>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { User, Lock, Message } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const registerFormRef = ref<FormInstance>()
const loading = ref(false)

// 注册表单数据
const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreement: false
})

// 自定义验证函数
const validateConfirmPassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== registerForm.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

// 表单验证规则
const registerRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 30, message: '密码长度在 6 到 30 个字符', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9]{6,}$/,
      message: '密码必须至少6个字符，只能包含字母和数字',
      trigger: 'blur'
    }
  ],
  confirmPassword: [
    { required: true, validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

// 显示服务条款
const showTerms = () => {
  ElMessageBox.alert(
    '这是我们的服务条款内容，使用我们的服务即表示您同意这些条款。',
    '服务条款',
    {
      confirmButtonText: '我已阅读',
      callback: () => {}
    }
  )
}

// 显示隐私政策
const showPrivacy = () => {
  ElMessageBox.alert(
    '这是我们的隐私政策内容，描述了我们如何收集、使用和保护您的个人信息。',
    '隐私政策',
    {
      confirmButtonText: '我已阅读',
      callback: () => {}
    }
  )
}

// 社交媒体注册
const socialRegister = (platform: string) => {
  ElMessage({
    type: 'info',
    message: `${platform}注册功能正在开发中...`,
    duration: 2000
  })
}

// 处理注册
const handleRegister = async () => {
  if (!registerFormRef.value) return

  try {
    await registerFormRef.value.validate()
    
    if (!registerForm.agreement) {
      ElMessage({
        type: 'warning',
        message: '请阅读并同意服务条款和隐私政策',
        duration: 2000
      })
      return
    }
    
    loading.value = true
    
    try {
      const result = await userStore.register({
        username: registerForm.username,
        email: registerForm.email,
        password: registerForm.password,
        confirm_password: registerForm.confirmPassword
      })
      
      if (result.success) {
        ElMessage({
          type: 'success',
          message: '注册成功！请登录您的账号',
          duration: 2000
        })
        router.push('/login')
      } else {
        ElMessage({
          type: 'error',
          message: result.message || '注册失败，请检查您的输入',
          duration: 3000
        })
      }
    } catch (error: any) {
      const errorMsg = error?.message || '注册失败，请稍后重试'
      ElMessage({
        type: 'error',
        message: errorMsg,
        duration: 3000
      })
    }
  } catch (validationError) {
    // 表单验证失败
    ElMessage({
      type: 'warning',
      message: '请正确填写注册信息',
      duration: 2000
    })
  } finally {
    loading.value = false
  }
}

// 跳转到登录页面
const goToLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(145deg, #6e8efb 0%, #a777e3 100%);
}

.register-content {
  width: 420px;
  padding: 40px;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.register-content:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.2);
}

.register-header {
  text-align: center;
  margin-bottom: 30px;
}

.register-title {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin: 0 0 10px;
}

.register-subtitle {
  color: #666;
  font-size: 16px;
  margin: 0;
}

.register-button {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  margin-top: 10px;
  transition: all 0.3s ease;
}

.register-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.4);
}

.agreement-item {
  margin-bottom: 0;
}

.agreement-checkbox {
  font-size: 14px;
  color: #666;
}

.register-footer {
  text-align: center;
  margin-top: 20px;
}

.register-footer span {
  color: #666;
  margin-right: 8px;
}

.register-divider {
  display: flex;
  align-items: center;
  margin: 30px 0 20px;
  color: #999;
  font-size: 14px;
}

.register-divider::before,
.register-divider::after {
  content: '';
  flex: 1;
  border-top: 1px solid #eee;
}

.register-divider span {
  padding: 0 15px;
}

.social-login {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.social-button {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #fff;
  border: none;
  transition: all 0.3s ease;
}

.social-button:hover {
  transform: scale(1.1);
}

.wechat {
  background-color: #07C160;
}

.qq {
  background-color: #12B7F5;
}

.weibo {
  background-color: #E6162D;
}

/* 响应式调整 */
@media (max-width: 480px) {
  .register-content {
    width: 90%;
    padding: 30px;
  }
}
</style>