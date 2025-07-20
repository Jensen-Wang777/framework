# Vue 前端接口文档

## 基础信息

- **框架版本:** Vue 3.4+
- **TypeScript:** 支持
- **UI 组件库:** Element Plus
- **状态管理:** Pinia
- **路由管理:** Vue Router 4
- **HTTP 客户端:** Axios
- **开发服务器:** http://localhost:5173

---

## 🏗️ 项目结构

```
fronted/src/
├── views/              # 页面组件
│   ├── LoginView.vue      # 登录页面
│   ├── RegisterView.vue   # 注册页面
│   └── ProfileView.vue    # 用户信息管理页面
├── stores/             # Pinia 状态管理
│   └── counter.ts         # 用户状态管理
├── services/           # API 服务层
│   └── api.ts            # HTTP 请求封装
├── router/             # 路由配置
│   └── index.ts          # 路由定义和守卫
├── components/         # 公共组件
├── assets/             # 静态资源
└── main.ts            # 应用入口
```

---

## 🔧 API 服务层

### API 配置

**文件位置:** `src/services/api.ts`

**基础配置:**
```typescript
const API_BASE_URL = 'http://localhost:8000/api'
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})
```

### 请求拦截器
```typescript
// 自动添加 JWT Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  }
)
```

### 响应拦截器
```typescript
// 处理 Token 过期
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token过期，清除本地存储并跳转登录页
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

---

## 🔐 认证 API 接口

### 1. 用户注册

**方法:** `authAPI.register(userData)`

**参数类型:**
```typescript
interface RegisterData {
  username: string    // 用户名
  email: string      // 邮箱
  password: string   // 密码
}
```

**使用示例:**
```typescript
import { authAPI } from '@/services/api'

const registerUser = async () => {
  try {
    const response = await authAPI.register({
      username: 'testuser',
      email: 'test@example.com',
      password: '123456'
    })
    console.log('注册成功:', response.data)
  } catch (error) {
    console.error('注册失败:', error.response?.data?.error)
  }
}
```

**返回数据:**
```typescript
{
  message: string
  user: {
    id: number
    username: string
    email: string
  }
}
```

---

### 2. 用户登录

**方法:** `authAPI.login(credentials)`

**参数类型:**
```typescript
interface LoginData {
  username: string    // 用户名
  password: string   // 密码
}
```

**使用示例:**
```typescript
const loginUser = async () => {
  try {
    const response = await authAPI.login({
      username: 'testuser',
      password: '123456'
    })

    // 保存 Token 和用户信息
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.user))

    console.log('登录成功:', response.data)
  } catch (error) {
    console.error('登录失败:', error.response?.data?.error)
  }
}
```

**返回数据:**
```typescript
{
  message: string
  token: string
  user: {
    id: number
    username: string
    email: string
    first_name: string
    last_name: string
  }
}
```

---

### 3. 用户登出

**方法:** `authAPI.logout()`

**使用示例:**
```typescript
const logoutUser = async () => {
  try {
    await authAPI.logout()

    // 清除本地存储
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    console.log('登出成功')
  } catch (error) {
    console.error('登出失败:', error)
  }
}
```

---

## 👤 用户管理 API 接口

### 1. 获取用户资料

**方法:** `userAPI.getProfile()`

**使用示例:**
```typescript
import { userAPI } from '@/services/api'

const getUserProfile = async () => {
  try {
    const response = await userAPI.getProfile()
    console.log('用户资料:', response.data.user)
  } catch (error) {
    console.error('获取用户资料失败:', error.response?.data?.error)
  }
}
```

**返回数据:**
```typescript
{
  user: {
    id: number
    username: string
    email: string
    first_name: string
    last_name: string
    date_joined: string
    profile: {
      avatar: string | null
      phone: string | null
      birth_date: string | null
      gender: 'male' | 'female' | 'other' | null
      bio: string | null
      created_at: string
      updated_at: string
    }
  }
}
```

---

### 2. 更新用户资料

**方法:** `userAPI.updateProfile(profileData)`

**参数类型:**
```typescript
interface UpdateProfileData {
  first_name?: string
  last_name?: string
  email?: string
  profile?: {
    phone?: string
    birth_date?: string
    gender?: 'male' | 'female' | 'other'
    bio?: string
  }
}
```

**使用示例:**
```typescript
const updateUserProfile = async () => {
  try {
    const response = await userAPI.updateProfile({
      first_name: '张',
      last_name: '三',
      email: 'zhangsan@example.com',
      profile: {
        phone: '13800138000',
        birth_date: '1990-01-01',
        gender: 'male',
        bio: '这是我的个人简介'
      }
    })
    console.log('更新成功:', response.data)
  } catch (error) {
    console.error('更新失败:', error.response?.data?.error)
  }
}
```

---

### 3. 修改密码

**方法:** `userAPI.changePassword(passwordData)`

**参数类型:**
```typescript
interface ChangePasswordData {
  old_password: string    // 当前密码
  new_password: string   // 新密码
}
```

**使用示例:**
```typescript
const changeUserPassword = async () => {
  try {
    const response = await userAPI.changePassword({
      old_password: '123456',
      new_password: 'newpassword123'
    })
    console.log('密码修改成功:', response.data.message)
  } catch (error) {
    console.error('密码修改失败:', error.response?.data?.error)
  }
}
```

---

## 🗃️ Pinia 状态管理

### 用户状态 Store

**文件位置:** `src/stores/counter.ts`

**Store 定义:**
```typescript
export const useUserStore = defineStore('user', () => {
  // 状态
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const isLoggedIn = computed(() => !!token.value)

  // 操作方法
  const login = async (credentials) => { /* ... */ }
  const register = async (userData) => { /* ... */ }
  const logout = async () => { /* ... */ }
  const fetchProfile = async () => { /* ... */ }
  const updateProfile = async (profileData) => { /* ... */ }
  const changePassword = async (passwordData) => { /* ... */ }
  const initializeUser = () => { /* ... */ }

  return {
    user, token, isLoggedIn,
    login, register, logout,
    fetchProfile, updateProfile, changePassword,
    initializeUser
  }
})
```

### 在组件中使用

```typescript
<script setup lang="ts">
import { useUserStore } from '@/stores/counter'

const userStore = useUserStore()

// 登录
const handleLogin = async () => {
  const result = await userStore.login({
    username: 'testuser',
    password: '123456'
  })

  if (result.success) {
    console.log('登录成功')
    // 跳转到用户资料页
    router.push('/profile')
  } else {
    console.error('登录失败:', result.message)
  }
}

// 获取用户信息
const isLoggedIn = computed(() => userStore.isLoggedIn)
const currentUser = computed(() => userStore.user)
</script>
```

---

## 🛣️ 路由配置

### 路由定义

**文件位置:** `src/router/index.ts`

**路由表:**
```typescript
const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: { requiresGuest: true }  // 需要未登录状态
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/RegisterView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/ProfileView.vue'),
    meta: { requiresAuth: true }   // 需要登录状态
  }
]
```

### 路由守卫

```typescript
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  // 初始化用户状态
  if (!userStore.user && userStore.token) {
    userStore.initializeUser()
  }

  // 需要登录的页面
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next('/login')
    return
  }

  // 已登录用户访问登录/注册页面
  if (to.meta.requiresGuest && userStore.isLoggedIn) {
    next('/profile')
    return
  }

  next()
})
```

### 编程式导航

```typescript
import { useRouter } from 'vue-router'

const router = useRouter()

// 跳转到登录页
router.push('/login')

// 跳转到用户资料页
router.push('/profile')

// 带参数跳转
router.push({ name: 'profile', params: { id: 123 } })

// 替换当前路由（不会在历史记录中留下记录）
router.replace('/login')
```

---

## 📄 页面组件

### 1. 登录页面 (LoginView.vue)

**路径:** `/login`

**功能特性:**
- 用户名/密码登录
- 表单验证
- 登录状态管理
- 错误提示
- 跳转注册页面

**主要方法:**
```typescript
const handleLogin = async () => {
  // 表单验证
  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      const result = await userStore.login(loginForm)

      if (result.success) {
        ElMessage.success(result.message)
        router.push('/profile')
      } else {
        ElMessage.error(result.message)
      }
      loading.value = false
    }
  })
}
```

**表单验证规则:**
```typescript
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
```

---

### 2. 注册页面 (RegisterView.vue)

**路径:** `/register`

**功能特性:**
- 用户注册
- 邮箱验证
- 密码确认
- 表单验证
- 跳转登录页面

**主要方法:**
```typescript
const handleRegister = async () => {
  await registerFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      const result = await userStore.register({
        username: registerForm.username,
        email: registerForm.email,
        password: registerForm.password
      })

      if (result.success) {
        ElMessage.success(result.message)
        router.push('/login')
      } else {
        ElMessage.error(result.message)
      }
      loading.value = false
    }
  })
}
```

**自定义验证:**
```typescript
const validateConfirmPassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== registerForm.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}
```

---

### 3. 用户资料页面 (ProfileView.vue)

**路径:** `/profile`

**功能特性:**
- 用户信息展示
- 资料编辑
- 密码修改
- 退出登录
- 响应式布局

**主要功能区域:**
1. **基本信息卡片**
   - 用户名（只读）
   - 邮箱、姓名
   - 手机号、生日、性别
   - 个人简介

2. **密码修改卡片**
   - 当前密码验证
   - 新密码设置
   - 密码确认

**主要方法:**
```typescript
// 更新用户资料
const handleUpdateProfile = async () => {
  const result = await userStore.updateProfile({
    first_name: profileForm.first_name,
    last_name: profileForm.last_name,
    email: profileForm.email,
    profile: {
      phone: profileForm.phone,
      birth_date: profileForm.birth_date,
      gender: profileForm.gender,
      bio: profileForm.bio
    }
  })

  if (result.success) {
    ElMessage.success(result.message)
    editMode.value = false
  }
}

// 修改密码
const handleChangePassword = async () => {
  const result = await userStore.changePassword({
    old_password: passwordForm.old_password,
    new_password: passwordForm.new_password
  })

  if (result.success) {
    ElMessage.success(result.message)
    resetPasswordForm()
  }
}

// 退出登录
const handleLogout = async () => {
  await ElMessageBox.confirm('确定要退出登录吗？', '提示')
  await userStore.logout()
  router.push('/login')
}
```

---

## 🎨 UI 组件库 (Element Plus)

### 主要使用的组件

1. **表单组件**
   - `el-form` - 表单容器
   - `el-form-item` - 表单项
   - `el-input` - 输入框
   - `el-button` - 按钮
   - `el-select` - 选择器
   - `el-date-picker` - 日期选择器

2. **布局组件**
   - `el-card` - 卡片
   - `el-row` / `el-col` - 栅格布局
   - `el-header` - 头部

3. **反馈组件**
   - `ElMessage` - 消息提示
   - `ElMessageBox` - 确认框
   - `el-link` - 链接

### 全局配置

**文件位置:** `src/main.ts`

```typescript
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

// 注册 Element Plus
app.use(ElementPlus)

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
```

---

## 🔧 开发指南

### 1. 添加新页面

1. **创建页面组件**
   ```bash
   # 在 src/views/ 目录下创建新的 .vue 文件
   touch src/views/NewPageView.vue
   ```

2. **添加路由配置**
   ```typescript
   // src/router/index.ts
   {
     path: '/new-page',
     name: 'newPage',
     component: () => import('../views/NewPageView.vue'),
     meta: { requiresAuth: true }  // 根据需要设置
   }
   ```

3. **页面模板**
   ```vue
   <template>
     <div class="new-page-container">
       <h1>新页面</h1>
       <!-- 页面内容 -->
     </div>
   </template>

   <script setup lang="ts">
   import { ref, onMounted } from 'vue'
   import { useUserStore } from '@/stores/counter'

   const userStore = useUserStore()

   onMounted(() => {
     // 页面初始化逻辑
   })
   </script>

   <style scoped>
   .new-page-container {
     padding: 20px;
   }
   </style>
   ```

### 2. 添加新的 API 接口

1. **在 api.ts 中添加接口**
   ```typescript
   // src/services/api.ts
   export const newAPI = {
     getData: () => {
       return apiClient.get('/new-endpoint/')
     },

     postData: (data: any) => {
       return apiClient.post('/new-endpoint/', data)
     }
   }
   ```

2. **在 Store 中添加状态管理**
   ```typescript
   // src/stores/counter.ts
   const newData = ref(null)

   const fetchNewData = async () => {
     try {
       const response = await newAPI.getData()
       newData.value = response.data
       return { success: true }
     } catch (error) {
       return { success: false, message: '获取数据失败' }
     }
   }
   ```

### 3. 表单验证最佳实践

```typescript
// 定义验证规则
const formRules: FormRules = {
  fieldName: [
    { required: true, message: '此字段为必填项', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '只能包含字母、数字和下划线', trigger: 'blur' }
  ]
}

// 自定义验证函数
const validateCustom = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error('请输入内容'))
  } else if (value.length < 6) {
    callback(new Error('长度不能少于6个字符'))
  } else {
    callback()
  }
}
```

### 4. 错误处理最佳实践

```typescript
// 统一错误处理
const handleApiError = (error: any) => {
  if (error.response) {
    // 服务器返回错误
    const message = error.response.data?.error || '操作失败'
    ElMessage.error(message)
  } else if (error.request) {
    // 网络错误
    ElMessage.error('网络连接失败，请检查网络')
  } else {
    // 其他错误
    ElMessage.error('操作失败，请稍后重试')
  }
}

// 在组件中使用
try {
  const result = await someApiCall()
  // 处理成功结果
} catch (error) {
  handleApiError(error)
}
```

---

## 📝 最佳实践

### 1. 代码组织
- 使用 Composition API
- 合理拆分组件
- 统一的文件命名规范
- 适当的注释和文档

### 2. 性能优化
- 路由懒加载
- 合理使用 `computed` 和 `watch`
- 避免不必要的响应式数据
- 使用 `v-memo` 优化列表渲染

### 3. 类型安全
- 充分利用 TypeScript
- 定义清晰的接口类型
- 使用泛型提高代码复用性

### 4. 用户体验
- 加载状态提示
- 错误信息友好展示
- 表单验证及时反馈
- 响应式设计

### 5. 安全考虑
- Token 自动过期处理
- 敏感信息不在前端存储
- 输入数据验证
- XSS 防护

---

## 🚀 部署说明

### 开发环境
```bash
npm run dev
```

### 生产构建
```bash
npm run build
```

### 预览构建结果
```bash
npm run preview
```

### 类型检查
```bash
npm run type-check
```

### 代码格式化
```bash
npm run format
```

构建后的文件在 `dist/` 目录中，可以部署到任何静态文件服务器。
```
```