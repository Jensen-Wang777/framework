<template>
  <div class="profile-container">
    <!-- 顶部导航栏 -->
    <el-header class="header">
      <div class="header-content">
        <h1>用户信息管理</h1>
        <div class="header-actions">
          <span class="welcome-text">欢迎，{{ userStore.userFullName }}</span>
          <el-button type="danger" @click="handleLogout">退出登录</el-button>
        </div>
      </div>
    </el-header>

    <div class="main-content">
      <el-row :gutter="20">
        <!-- 用户基本信息卡片 -->
        <el-col :xs="24" :sm="24" :md="12">
          <el-card class="profile-card">
            <template #header>
              <div class="card-header">
                <h3>基本信息</h3>
                <el-button type="primary" @click="editMode = !editMode">
                  {{ editMode ? '取消编辑' : '编辑信息' }}
                </el-button>
              </div>
            </template>

            <el-form
              ref="profileFormRef"
              :model="profileForm"
              :rules="profileRules"
              label-width="100px"
              :disabled="!editMode"
            >
              <el-row :gutter="20">
                <el-col :span="24" class="avatar-container">
                  <el-upload
                    class="avatar-uploader"
                    :disabled="!editMode"
                    action="#"
                    :http-request="uploadAvatar"
                    :show-file-list="false"
                    :before-upload="beforeAvatarUpload"
                  >
                    <el-avatar 
                      v-if="avatarUrl" 
                      :src="avatarUrl" 
                      :size="100"
                      class="user-avatar"
                    />
                    <el-avatar 
                      v-else 
                      :size="100"
                      :src="defaultAvatar"
                      class="user-avatar"
                    />
                    <div v-if="editMode" class="avatar-hover-text">更换头像</div>
                  </el-upload>
                </el-col>
              </el-row>

              <el-form-item label="用户名">
                <el-input v-model="profileForm.username" disabled />
              </el-form-item>

              <el-form-item label="邮箱" prop="email">
                <el-input v-model="profileForm.email" />
              </el-form-item>

              <el-form-item label="姓" prop="first_name">
                <el-input v-model="profileForm.first_name" placeholder="请输入姓" />
              </el-form-item>

              <el-form-item label="名" prop="last_name">
                <el-input v-model="profileForm.last_name" placeholder="请输入名" />
              </el-form-item>

              <el-form-item label="手机号" prop="phone">
                <el-input v-model="profileForm.phone" placeholder="请输入手机号" />
              </el-form-item>

              <el-form-item label="生日" prop="birth_date">
                <el-date-picker
                  v-model="profileForm.birth_date"
                  type="date"
                  placeholder="请选择生日"
                  style="width: 100%"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>

              <el-form-item label="性别" prop="gender">
                <el-select v-model="profileForm.gender" placeholder="请选择性别" style="width: 100%">
                  <el-option label="男" value="male" />
                  <el-option label="女" value="female" />
                  <el-option label="其他" value="other" />
                </el-select>
              </el-form-item>

              <el-form-item label="个人简介" prop="bio">
                <el-input
                  v-model="profileForm.bio"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入个人简介"
                  maxlength="200"
                  show-word-limit
                />
              </el-form-item>

              <el-form-item v-if="editMode">
                <el-button type="primary" :loading="updateLoading" @click="handleUpdateProfile">
                  保存修改
                </el-button>
                <el-button @click="resetForm">重置</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>

        <!-- 修改密码卡片 -->
        <el-col :xs="24" :sm="24" :md="12">
          <el-card class="password-card">
            <template #header>
              <h3>修改密码</h3>
            </template>

            <el-form
              ref="passwordFormRef"
              :model="passwordForm"
              :rules="passwordRules"
              label-width="100px"
            >
              <el-form-item label="当前密码" prop="old_password">
                <el-input
                  v-model="passwordForm.old_password"
                  type="password"
                  placeholder="请输入当前密码"
                  show-password
                />
              </el-form-item>

              <el-form-item label="新密码" prop="new_password">
                <el-input
                  v-model="passwordForm.new_password"
                  type="password"
                  placeholder="请输入新密码"
                  show-password
                />
                <div class="password-tips">
                  密码必须至少6个字符，只能包含字母和数字
                </div>
              </el-form-item>

              <el-form-item label="确认新密码" prop="confirm_password">
                <el-input
                  v-model="passwordForm.confirm_password"
                  type="password"
                  placeholder="请再次输入新密码"
                  show-password
                />
              </el-form-item>

              <el-form-item>
                <el-button type="primary" :loading="passwordLoading" @click="handleChangePassword">
                  修改密码
                </el-button>
                <el-button @click="resetPasswordForm">重置</el-button>
              </el-form-item>
            </el-form>
          </el-card>
          
          <!-- 账号安全卡片 -->
          <el-card class="security-card">
            <template #header>
              <h3>账号安全</h3>
            </template>
            
            <el-timeline>
              <el-timeline-item
                timestamp="最近登录时间"
                placement="top"
                :color="'#409EFF'"
              >
                <el-card class="timeline-card">
                  <p>{{ lastLoginTime || '未记录' }}</p>
                  <p class="timeline-detail">IP: {{ lastLoginIp || '未记录' }}</p>
                </el-card>
              </el-timeline-item>
              
              <el-timeline-item
                timestamp="账号创建时间"
                placement="top"
              >
                <el-card class="timeline-card">
                  <p>{{ formatDate(userStore.user?.date_joined) }}</p>
                </el-card>
              </el-timeline-item>
            </el-timeline>
            
            <div class="security-actions">
              <el-button @click="handleBindPhone" type="info" plain>绑定手机</el-button>
              <el-button @click="handleBindEmail" type="info" plain>验证邮箱</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { useUserStore } from '@/stores/user'
import defaultAvatarImg from '@/assets/default-avatar.png'

const router = useRouter()
const userStore = useUserStore()

const profileFormRef = ref<FormInstance>()
const passwordFormRef = ref<FormInstance>()
const editMode = ref(false)
const updateLoading = ref(false)
const passwordLoading = ref(false)
const avatarFile = ref<File | null>(null)
const defaultAvatar = defaultAvatarImg
const lastLoginTime = ref<string>('2023-07-19 16:32:45')
const lastLoginIp = ref<string>('192.168.1.1')

// 头像URL
const avatarUrl = computed(() => {
  return userStore.user?.profile?.avatar || ''
})

// 用户资料表单
const profileForm = reactive({
  username: '',
  email: '',
  first_name: '',
  last_name: '',
  phone: '',
  birth_date: '',
  gender: '',
  bio: ''
})

// 密码修改表单
const passwordForm = reactive({
  old_password: '',
  new_password: '',
  confirm_password: ''
})

// 用户资料验证规则
const profileRules: FormRules = {
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ]
}

// 密码验证规则
const validateConfirmPassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入新密码'))
  } else if (value !== passwordForm.new_password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const validateNewPassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入新密码'))
  } else if (value.length < 6 || value.length > 30) {
    callback(new Error('密码长度需在6-30个字符'))
  } else if (!/^[a-zA-Z0-9]{6,}$/.test(value)) {
    callback(new Error('密码必须至少6个字符，只能包含字母和数字'))
  } else {
    if (passwordForm.confirm_password !== '') {
      passwordFormRef.value?.validateField('confirm_password')
    }
    callback()
  }
}

const passwordRules: FormRules = {
  old_password: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  new_password: [
    { required: true, validator: validateNewPassword, trigger: 'blur' }
  ],
  confirm_password: [
    { required: true, validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

// 初始化用户数据
const initUserData = () => {
  if (userStore.user) {
    profileForm.username = userStore.user.username
    profileForm.email = userStore.user.email
    profileForm.first_name = userStore.user.first_name || ''
    profileForm.last_name = userStore.user.last_name || ''
    profileForm.phone = userStore.user.profile?.phone || ''
    profileForm.birth_date = userStore.user.profile?.birth_date || ''
    profileForm.gender = userStore.user.profile?.gender || ''
    profileForm.bio = userStore.user.profile?.bio || ''
  }
}

// 格式化日期
const formatDate = (dateStr?: string) => {
  if (!dateStr) return '未知'
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', { 
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 头像上传前的检查
const beforeAvatarUpload = (file: File) => {
  const isJPG = file.type === 'image/jpeg'
  const isPNG = file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG && !isPNG) {
    ElMessage.error('头像只能是JPG或PNG格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('头像大小不能超过2MB!')
    return false
  }
  
  avatarFile.value = file
  return false // 阻止默认上传行为
}

// 自定义头像上传
const uploadAvatar = async () => {
  if (!avatarFile.value) return
  
  // 这里可以实现预览
  const reader = new FileReader()
  reader.readAsDataURL(avatarFile.value)
  
  // 当上传按钮被点击时，头像会被包含在更新资料的请求中
}

// 绑定手机
const handleBindPhone = () => {
  ElMessageBox.prompt('请输入您的手机号', '绑定手机', {
    confirmButtonText: '发送验证码',
    cancelButtonText: '取消',
    inputPattern: /^1[3-9]\d{9}$/,
    inputErrorMessage: '请输入正确的手机号'
  }).then(({ value }) => {
    ElMessage({
      type: 'info',
      message: `验证码已发送至手机: ${value}`
    })
  }).catch(() => {})
}

// 验证邮箱
const handleBindEmail = () => {
  ElMessageBox.alert(
    `我们已向您的邮箱 ${profileForm.email} 发送了一封验证邮件，请查收并点击验证链接。`,
    '验证邮箱',
    {
      confirmButtonText: '我知道了'
    }
  )
}

// 重置表单
const resetForm = () => {
  initUserData()
}

// 重置密码表单
const resetPasswordForm = () => {
  passwordForm.old_password = ''
  passwordForm.new_password = ''
  passwordForm.confirm_password = ''
  passwordFormRef.value?.clearValidate()
}

// 更新用户资料
const handleUpdateProfile = async () => {
  if (!profileFormRef.value) return

  try {
    await profileFormRef.value.validate()
    updateLoading.value = true
    
    const profileData: any = {
      first_name: profileForm.first_name,
      last_name: profileForm.last_name,
      email: profileForm.email,
      profile: {
        phone: profileForm.phone,
        birth_date: profileForm.birth_date,
        gender: profileForm.gender,
        bio: profileForm.bio
      }
    }
    
    // 如果有头像文件，加入请求
    if (avatarFile.value) {
      profileData.profile.avatar = avatarFile.value
    }
    
    try {
      const result = await userStore.updateProfile(profileData)
      
      if (result.success) {
        ElMessage({
          type: 'success',
          message: result.message || '更新资料成功',
          duration: 2000
        })
        editMode.value = false
        avatarFile.value = null
      } else {
        ElMessage({
          type: 'error',
          message: result.message,
          duration: 3000
        })
      }
    } catch (error: any) {
      ElMessage({
        type: 'error',
        message: error?.message || '更新失败，请稍后重试',
        duration: 3000
      })
    }
  } catch (validationError) {
    ElMessage({
      type: 'warning',
      message: '请正确填写表单信息',
      duration: 2000
    })
  } finally {
    updateLoading.value = false
  }
}

// 修改密码
const handleChangePassword = async () => {
  if (!passwordFormRef.value) return

  try {
    await passwordFormRef.value.validate()
    passwordLoading.value = true
    
    try {
      const result = await userStore.changePassword({
        old_password: passwordForm.old_password,
        new_password: passwordForm.new_password,
        confirm_password: passwordForm.confirm_password
      })

      if (result.success) {
        ElMessage({
          type: 'success',
          message: result.message || '密码修改成功',
          duration: 2000
        })
        resetPasswordForm()
      } else {
        ElMessage({
          type: 'error',
          message: result.message,
          duration: 3000
        })
      }
    } catch (error: any) {
      ElMessage({
        type: 'error',
        message: error?.message || '修改密码失败，请稍后重试',
        duration: 3000
      })
    }
  } catch (validationError) {
    ElMessage({
      type: 'warning',
      message: '请正确填写密码信息',
      duration: 2000
    })
  } finally {
    passwordLoading.value = false
  }
}

// 退出登录
const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await userStore.logout()
    ElMessage({
      type: 'success',
      message: '已退出登录',
      duration: 2000
    })
    router.push('/login')
  } catch (error) {
    // 用户取消操作
  }
}

// 组件挂载时初始化数据
onMounted(async () => {
  // 检查用户是否已登录
  const isAuthenticated = await userStore.checkAuth()
  
  if (!isAuthenticated) {
    ElMessage({
      type: 'warning',
      message: '请先登录',
      duration: 2000
    })
    router.push('/login')
    return
  }
  
  // 如果没有用户信息，尝试获取
  if (!userStore.user) {
    const result = await userStore.fetchProfile()
    if (!result.success) {
      ElMessage({
        type: 'error',
        message: result.message || '获取用户信息失败',
        duration: 3000
      })
      router.push('/login')
      return
    }
  }
  
  initUserData()
})
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.header {
  background: linear-gradient(145deg, #6e8efb 0%, #a777e3 100%);
  color: white;
  padding: 0;
  height: 80px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.header-content h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.welcome-text {
  font-size: 16px;
  opacity: 0.9;
}

.main-content {
  max-width: 1200px;
  margin: 30px auto;
  padding: 0 20px;
}

.profile-card,
.password-card,
.security-card {
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.profile-card:hover,
.password-card:hover,
.security-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.07);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  color: #333;
  font-weight: 600;
  font-size: 18px;
}

.avatar-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.avatar-uploader {
  position: relative;
  display: inline-block;
}

.user-avatar {
  border: 3px solid #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.avatar-hover-text {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  text-align: center;
  padding: 4px 0;
  font-size: 12px;
  opacity: 0;
  transition: opacity 0.3s;
  border-radius: 0 0 50% 50%;
}

.avatar-uploader:hover .avatar-hover-text {
  opacity: 1;
}

.password-tips {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
  line-height: 1.4;
}

.timeline-card {
  margin-bottom: 10px;
}

.timeline-detail {
  font-size: 12px;
  color: #909399;
  margin: 0;
}

.security-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
  justify-content: center;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #606266;
}

:deep(.el-card__header) {
  background-color: #fafafa;
  border-bottom: 1px solid #ebeef5;
  padding: 15px 20px;
}

@media (max-width: 768px) {
  .main-content {
    padding: 0 15px;
  }
  
  .header-content {
    padding: 0 15px;
  }
  
  .header-content h1 {
    font-size: 20px;
  }
}
</style>