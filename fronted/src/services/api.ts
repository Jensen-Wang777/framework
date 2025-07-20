import axios from 'axios'
import type { AxiosResponse, AxiosInstance, AxiosRequestConfig } from 'axios'

// API基础配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

/**
 * 创建API客户端
 * @param config 配置选项
 * @returns Axios实例
 */
const createApiClient = (config: AxiosRequestConfig = {}): AxiosInstance => {
  // 创建axios实例
  const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000, // 增加超时时间
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    ...config
  })

  // 请求拦截器 - 添加token
  apiClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token')
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // 响应拦截器 - 处理错误
  apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
      return response
    },
    (error) => {
      const { response } = error
      
      // 处理不同的错误状态码
      if (response) {
        switch(response.status) {
          case 401: // 未授权
            // Token过期或无效，清除本地存储并跳转到登录页
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            // 避免无限循环重定向
            if (!window.location.href.includes('/login')) {
              window.location.href = '/login'
            }
            break
          case 403: // 禁止访问
            console.error('您没有权限执行此操作')
            break
          case 404: // 资源不存在
            console.error('请求的资源不存在')
            break
          case 500: // 服务器错误
            console.error('服务器内部错误，请稍后重试')
            break
          default:
            console.error('请求失败:', response.data?.message || '未知错误')
        }
      } else {
        // 网络错误
        error.name = 'NetworkError'
        console.error('网络连接失败，请检查您的网络')
      }
      
      return Promise.reject(error)
    }
  )

  return apiClient
}

// 默认API客户端
const apiClient = createApiClient()

// 用户认证相关API
export const authAPI = {
  // 用户注册
  register: (userData: {
    username: string
    email: string
    password: string
    confirm_password: string
  }) => {
    return apiClient.post('/auth/register/', userData)
  },

  // 用户登录
  login: (credentials: {
    username: string
    password: string
  }) => {
    return apiClient.post('/auth/login/', credentials)
  },

  // 用户登出
  logout: () => {
    return apiClient.post('/auth/logout/')
  },
  
  // 密码重置请求
  resetPassword: (email: string) => {
    return apiClient.post('/auth/reset-password/', { email })
  },
  
  // 密码重置确认
  resetPasswordConfirm: (data: {
    token: string
    uid: string
    new_password: string
    confirm_password: string
  }) => {
    return apiClient.post('/auth/reset-password-confirm/', data)
  },
  
  // 验证Token是否有效
  validateToken: () => {
    return apiClient.post('/auth/token/verify/')
  },
  
  // 刷新Token
  refreshToken: (refresh: string) => {
    return apiClient.post('/auth/token/refresh/', { refresh })
  }
}

// 用户信息相关API
export const userAPI = {
  // 获取用户资料
  getProfile: () => {
    return apiClient.get('/users/profile/')
  },

  // 更新用户资料
  updateProfile: (profileData: {
    first_name?: string
    last_name?: string
    email?: string
    profile?: {
      phone?: string
      birth_date?: string
      gender?: string
      bio?: string
      avatar?: File | string
    }
  }) => {
    // 如果包含文件，使用FormData
    if (profileData.profile?.avatar instanceof File) {
      const formData = new FormData()
      
      // 添加基本信息
      if (profileData.first_name) formData.append('first_name', profileData.first_name)
      if (profileData.last_name) formData.append('last_name', profileData.last_name)
      if (profileData.email) formData.append('email', profileData.email)
      
      // 添加个人资料信息
      if (profileData.profile) {
        if (profileData.profile.phone) formData.append('profile.phone', profileData.profile.phone)
        if (profileData.profile.birth_date) formData.append('profile.birth_date', profileData.profile.birth_date)
        if (profileData.profile.gender) formData.append('profile.gender', profileData.profile.gender)
        if (profileData.profile.bio) formData.append('profile.bio', profileData.profile.bio)
        if (profileData.profile.avatar) formData.append('profile.avatar', profileData.profile.avatar)
      }
      
      return apiClient.put('/users/profile/update/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    }
    
    // 普通JSON请求
    return apiClient.put('/users/profile/update/', profileData)
  },

  // 修改密码
  changePassword: (passwordData: {
    old_password: string
    new_password: string
    confirm_password: string
  }) => {
    return apiClient.post('/users/change-password/', passwordData)
  },
}

export default apiClient