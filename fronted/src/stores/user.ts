import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { authAPI, userAPI } from '@/services/api'

// 用户信息接口
export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  date_joined: string
  profile?: {
    avatar?: string
    phone?: string
    birth_date?: string
    gender?: string
    bio?: string
    created_at: string
    updated_at: string
  }
}

// 登录凭证接口
export interface LoginCredentials {
  username: string
  password: string
}

// API响应接口
export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
}

export const useUserStore = defineStore('user', () => {
  // 状态
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  
  // 计算属性
  const isLoggedIn = computed(() => !!token.value)
  const userFullName = computed(() => {
    if (!user.value) return ''
    return user.value.first_name && user.value.last_name
      ? `${user.value.first_name} ${user.value.last_name}`
      : user.value.username
  })

  // 登录
  const login = async (credentials: LoginCredentials): Promise<ApiResponse> => {
    loading.value = true
    error.value = null
    
    try {
      const response = await authAPI.login(credentials)
      const { token: newToken, user: userData } = response.data

      // 更新状态
      token.value = newToken
      user.value = userData

      // 保存到本地存储
      localStorage.setItem('token', newToken)
      localStorage.setItem('user', JSON.stringify(userData))

      return { success: true, message: '登录成功' }
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || '登录失败，请检查用户名和密码'
      error.value = errorMsg
      return { success: false, message: errorMsg }
    } finally {
      loading.value = false
    }
  }

  // 注册
  const register = async (userData: {
    username: string
    email: string
    password: string
    confirm_password: string
  }): Promise<ApiResponse> => {
    loading.value = true
    error.value = null
    
    try {
      const response = await authAPI.register(userData)
      return { success: true, message: response.data.message || '注册成功' }
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || '注册失败'
      error.value = errorMsg
      return { success: false, message: errorMsg }
    } finally {
      loading.value = false
    }
  }

  // 登出
  const logout = async (): Promise<void> => {
    loading.value = true
    
    try {
      if (token.value) {
        await authAPI.logout()
      }
    } catch (error) {
      console.error('登出请求失败:', error)
    } finally {
      // 清除本地状态
      token.value = null
      user.value = null
      error.value = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      loading.value = false
    }
  }

  // 获取用户资料
  const fetchProfile = async (): Promise<ApiResponse> => {
    loading.value = true
    error.value = null
    
    try {
      const response = await userAPI.getProfile()
      user.value = response.data.user
      localStorage.setItem('user', JSON.stringify(response.data.user))
      return { success: true, message: '获取用户资料成功' }
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || '获取用户资料失败'
      error.value = errorMsg
      return { success: false, message: errorMsg }
    } finally {
      loading.value = false
    }
  }

  // 更新用户资料
  const updateProfile = async (profileData: Partial<User>): Promise<ApiResponse> => {
    loading.value = true
    error.value = null
    
    try {
      const response = await userAPI.updateProfile(profileData)
      user.value = response.data.user
      localStorage.setItem('user', JSON.stringify(response.data.user))
      return { success: true, message: response.data.message || '更新用户资料成功' }
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || '更新用户资料失败'
      error.value = errorMsg
      return { success: false, message: errorMsg }
    } finally {
      loading.value = false
    }
  }

  // 修改密码
  const changePassword = async (passwordData: {
    old_password: string
    new_password: string
    confirm_password: string
  }): Promise<ApiResponse> => {
    loading.value = true
    error.value = null
    
    try {
      const response = await userAPI.changePassword(passwordData)
      return { success: true, message: response.data.message || '密码修改成功' }
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || '修改密码失败'
      error.value = errorMsg
      return { success: false, message: errorMsg }
    } finally {
      loading.value = false
    }
  }

  // 重置密码
  const resetPassword = async (email: string): Promise<ApiResponse> => {
    loading.value = true
    error.value = null
    
    try {
      const response = await authAPI.resetPassword(email)
      return { success: true, message: response.data.message || '密码重置邮件已发送' }
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || '密码重置请求失败'
      error.value = errorMsg
      return { success: false, message: errorMsg }
    } finally {
      loading.value = false
    }
  }

  // 初始化用户状态（从本地存储恢复）
  const initializeUser = (): void => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        user.value = JSON.parse(savedUser)
      } catch (error) {
        console.error('解析用户数据失败:', error)
        localStorage.removeItem('user')
      }
    }
    
    // 如果有token但没有用户数据，尝试获取用户资料
    if (token.value && !user.value) {
      fetchProfile()
    }
  }

  // 检查token是否有效
  const checkAuth = async (): Promise<boolean> => {
    if (!token.value) return false
    
    try {
      await authAPI.validateToken()
      return true
    } catch (error) {
      // token无效，清除登录状态
      token.value = null
      user.value = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      return false
    }
  }

  return {
    // 状态
    user,
    token,
    loading,
    error,
    
    // 计算属性
    isLoggedIn,
    userFullName,
    
    // 方法
    login,
    register,
    logout,
    fetchProfile,
    updateProfile,
    changePassword,
    resetPassword,
    initializeUser,
    checkAuth
  }
}) 