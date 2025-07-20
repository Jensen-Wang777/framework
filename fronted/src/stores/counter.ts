import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { authAPI, userAPI } from '@/services/api'

// 用户信息接口
interface User {
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

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const isLoggedIn = computed(() => !!token.value)

  // 登录
  const login = async (credentials: { username: string; password: string }) => {
    try {
      const response = await authAPI.login(credentials)
      const { token: newToken, user: userData } = response.data

      token.value = newToken
      user.value = userData

      // 保存到本地存储
      localStorage.setItem('token', newToken)
      localStorage.setItem('user', JSON.stringify(userData))

      return { success: true, message: '登录成功' }
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.error || '登录失败'
      }
    }
  }

  // 注册
  const register = async (userData: {
    username: string
    email: string
    password: string
  }) => {
    try {
      const response = await authAPI.register(userData)
      return { success: true, message: response.data.message }
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.error || '注册失败'
      }
    }
  }

  // 登出
  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('登出请求失败:', error)
    } finally {
      // 清除本地状态
      token.value = null
      user.value = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }

  // 获取用户资料
  const fetchProfile = async () => {
    try {
      const response = await userAPI.getProfile()
      user.value = response.data.user
      localStorage.setItem('user', JSON.stringify(response.data.user))
      return { success: true }
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.error || '获取用户资料失败'
      }
    }
  }

  // 更新用户资料
  const updateProfile = async (profileData: any) => {
    try {
      const response = await userAPI.updateProfile(profileData)
      user.value = response.data.user
      localStorage.setItem('user', JSON.stringify(response.data.user))
      return { success: true, message: response.data.message }
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.error || '更新用户资料失败'
      }
    }
  }

  // 修改密码
  const changePassword = async (passwordData: {
    old_password: string
    new_password: string
  }) => {
    try {
      const response = await userAPI.changePassword(passwordData)
      return { success: true, message: response.data.message }
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.error || '修改密码失败'
      }
    }
  }

  // 初始化用户状态（从本地存储恢复）
  const initializeUser = () => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        user.value = JSON.parse(savedUser)
      } catch (error) {
        console.error('解析用户数据失败:', error)
        localStorage.removeItem('user')
      }
    }
  }

  return {
    user,
    token,
    isLoggedIn,
    login,
    register,
    logout,
    fetchProfile,
    updateProfile,
    changePassword,
    initializeUser
  }
})
