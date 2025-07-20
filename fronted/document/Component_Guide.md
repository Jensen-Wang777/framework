# Vue 组件使用指南

## 📋 页面组件详解

### 1. LoginView.vue - 登录页面

**功能特性:**
- 用户名/密码登录
- 表单验证
- 登录状态管理
- 错误提示
- 跳转注册页面

**主要代码结构:**
```vue
<template>
  <div class="login-container">
    <el-card class="login-card">
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules">
        <!-- 表单项 -->
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/counter'

// 响应式数据
const loginForm = reactive({
  username: '',
  password: ''
})

// 表单验证规则
const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

// 登录处理
const handleLogin = async () => {
  // 登录逻辑
}
</script>
```

**样式特点:**
- 渐变背景
- 居中卡片布局
- 响应式设计
- 现代化UI风格

---

### 2. RegisterView.vue - 注册页面

**功能特性:**
- 用户注册
- 邮箱验证
- 密码确认
- 表单验证
- 跳转登录页面

**关键验证逻辑:**
```typescript
// 自定义密码确认验证
const validateConfirmPassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== registerForm.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

// 验证规则
const registerRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
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
```

---

### 3. ProfileView.vue - 用户资料页面

**功能特性:**
- 用户信息展示
- 资料编辑
- 密码修改
- 退出登录
- 响应式布局

**布局结构:**
```vue
<template>
  <div class="profile-container">
    <!-- 顶部导航栏 -->
    <el-header class="header">
      <div class="header-content">
        <h1>用户信息管理</h1>
        <div class="header-actions">
          <span>欢迎，{{ userStore.user?.username }}</span>
          <el-button type="danger" @click="handleLogout">退出登录</el-button>
        </div>
      </div>
    </el-header>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <el-row :gutter="20">
        <!-- 基本信息卡片 -->
        <el-col :span="12">
          <el-card class="profile-card">
            <!-- 用户资料表单 -->
          </el-card>
        </el-col>

        <!-- 密码修改卡片 -->
        <el-col :span="12">
          <el-card class="password-card">
            <!-- 密码修改表单 -->
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
```

**编辑模式切换:**
```typescript
const editMode = ref(false)

// 切换编辑模式
const toggleEditMode = () => {
  editMode.value = !editMode.value
  if (!editMode.value) {
    // 取消编辑时重置表单
    resetForm()
  }
}

// 表单禁用状态
:disabled="!editMode"
```

---

## 🎨 Element Plus 组件使用

### 1. 表单组件

**基础表单结构:**
```vue
<el-form
  ref="formRef"
  :model="formData"
  :rules="formRules"
  label-width="100px"
  size="large"
>
  <el-form-item label="用户名" prop="username">
    <el-input
      v-model="formData.username"
      placeholder="请输入用户名"
      :prefix-icon="User"
    />
  </el-form-item>

  <el-form-item label="密码" prop="password">
    <el-input
      v-model="formData.password"
      type="password"
      placeholder="请输入密码"
      :prefix-icon="Lock"
      show-password
    />
  </el-form-item>

  <el-form-item>
    <el-button type="primary" @click="handleSubmit">提交</el-button>
    <el-button @click="handleReset">重置</el-button>
  </el-form-item>
</el-form>
```

**表单验证:**
```typescript
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      // 表单验证通过，执行提交逻辑
      try {
        await submitForm()
        ElMessage.success('提交成功')
      } catch (error) {
        ElMessage.error('提交失败')
      }
    } else {
      ElMessage.error('请检查表单输入')
    }
  })
}
```

### 2. 选择器组件

**下拉选择器:**
```vue
<el-form-item label="性别" prop="gender">
  <el-select v-model="formData.gender" placeholder="请选择性别">
    <el-option label="男" value="male" />
    <el-option label="女" value="female" />
    <el-option label="其他" value="other" />
  </el-select>
</el-form-item>
```

**日期选择器:**
```vue
<el-form-item label="生日" prop="birthDate">
  <el-date-picker
    v-model="formData.birthDate"
    type="date"
    placeholder="请选择生日"
    format="YYYY-MM-DD"
    value-format="YYYY-MM-DD"
  />
</el-form-item>
```

### 3. 布局组件

**栅格布局:**
```vue
<el-row :gutter="20">
  <el-col :span="12">
    <el-card>左侧内容</el-card>
  </el-col>
  <el-col :span="12">
    <el-card>右侧内容</el-card>
  </el-col>
</el-row>
```

**卡片组件:**
```vue
<el-card class="custom-card" shadow="hover">
  <template #header>
    <div class="card-header">
      <span>卡片标题</span>
      <el-button type="primary">操作按钮</el-button>
    </div>
  </template>

  <div class="card-content">
    卡片内容
  </div>
</el-card>
```

### 4. 反馈组件

**消息提示:**
```typescript
import { ElMessage, ElMessageBox } from 'element-plus'

// 成功消息
ElMessage.success('操作成功')

// 错误消息
ElMessage.error('操作失败')

// 警告消息
ElMessage.warning('请注意')

// 信息消息
ElMessage.info('提示信息')

// 确认对话框
const handleDelete = async () => {
  try {
    await ElMessageBox.confirm('确定要删除吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    // 用户确认后的操作
    await deleteItem()
    ElMessage.success('删除成功')
  } catch {
    // 用户取消操作
    ElMessage.info('已取消删除')
  }
}
```

---

## 🔧 自定义组件开发

### 1. 创建可复用组件

**组件文件结构:**
```
src/components/
├── UserCard.vue          # 用户卡片组件
├── FormInput.vue         # 自定义输入框
└── LoadingButton.vue     # 加载按钮组件
```

**示例：LoadingButton.vue**
```vue
<template>
  <el-button
    :type="type"
    :size="size"
    :loading="loading"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot></slot>
  </el-button>
</template>

<script setup lang="ts">
interface Props {
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'large' | 'default' | 'small'
  loading?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'primary',
  size: 'default',
  loading: false,
  disabled: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent) => {
  if (!props.loading && !props.disabled) {
    emit('click', event)
  }
}
</script>
```

**使用自定义组件:**
```vue
<template>
  <LoadingButton
    type="primary"
    :loading="submitLoading"
    @click="handleSubmit"
  >
    提交表单
  </LoadingButton>
</template>

<script setup lang="ts">
import LoadingButton from '@/components/LoadingButton.vue'

const submitLoading = ref(false)

const handleSubmit = async () => {
  submitLoading.value = true
  try {
    await submitForm()
  } finally {
    submitLoading.value = false
  }
}
</script>
```

### 2. 组件通信

**父子组件通信:**
```vue
<!-- 父组件 -->
<template>
  <UserForm
    :user-data="userData"
    @update="handleUserUpdate"
    @cancel="handleCancel"
  />
</template>

<script setup lang="ts">
const userData = ref({
  name: '张三',
  email: 'zhangsan@example.com'
})

const handleUserUpdate = (newData: any) => {
  userData.value = { ...newData }
}

const handleCancel = () => {
  console.log('用户取消操作')
}
</script>
```

```vue
<!-- 子组件 UserForm.vue -->
<template>
  <el-form :model="formData">
    <el-form-item label="姓名">
      <el-input v-model="formData.name" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="handleUpdate">更新</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
interface Props {
  userData: {
    name: string
    email: string
  }
}

const props = defineProps<Props>()

const emit = defineEmits<{
  update: [data: any]
  cancel: []
}>()

const formData = ref({ ...props.userData })

const handleUpdate = () => {
  emit('update', formData.value)
}

const handleCancel = () => {
  emit('cancel')
}
</script>
```

---

## 🎯 最佳实践

### 1. 组件设计原则

- **单一职责:** 每个组件只负责一个功能
- **可复用性:** 通过 props 和 slots 提高复用性
- **可维护性:** 清晰的命名和结构
- **性能优化:** 合理使用 computed 和 watch

### 2. 样式管理

**使用 scoped 样式:**
```vue
<style scoped>
.component-container {
  padding: 20px;
}

.component-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
}
</style>
```

**CSS 变量:**
```vue
<style scoped>
.component-container {
  --primary-color: #409eff;
  --border-radius: 8px;

  border: 1px solid var(--primary-color);
  border-radius: var(--border-radius);
}
</style>
```

### 3. TypeScript 类型定义

**定义接口:**
```typescript
// types/user.ts
export interface User {
  id: number
  username: string
  email: string
  profile?: UserProfile
}

export interface UserProfile {
  phone?: string
  birthDate?: string
  gender?: 'male' | 'female' | 'other'
  bio?: string
}
```

**在组件中使用:**
```vue
<script setup lang="ts">
import type { User } from '@/types/user'

interface Props {
  user: User
  editable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  editable: false
})
</script>
```

### 4. 错误边界处理

```vue
<script setup lang="ts">
import { onErrorCaptured } from 'vue'

const error = ref<Error | null>(null)

onErrorCaptured((err) => {
  error.value = err
  console.error('组件错误:', err)
  return false // 阻止错误继续传播
})
</script>

<template>
  <div v-if="error" class="error-boundary">
    <h3>出现错误</h3>
    <p>{{ error.message }}</p>
    <el-button @click="error = null">重试</el-button>
  </div>

  <div v-else>
    <!-- 正常内容 -->
  </div>
</template>
```

这些文档提供了完整的前后端接口说明和使用指南，帮助开发者快速理解和使用这个Django+Vue万能框架！