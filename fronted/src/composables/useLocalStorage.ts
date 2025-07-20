/**
 * 本地存储操作的组合式函数
 * 提供便捷的localStorage操作方法
 */
export function useLocalStorage() {
  /**
   * 获取localStorage中的数据
   * @param key 存储键名
   * @returns 存储的值，如果不存在则返回null
   */
  const getItem = (key: string): string | null => {
    try {
      return localStorage.getItem(key)
    } catch (error) {
      console.error('获取本地存储数据失败:', error)
      return null
    }
  }

  /**
   * 设置localStorage中的数据
   * @param key 存储键名
   * @param value 要存储的值
   * @returns 操作是否成功
   */
  const setItem = (key: string, value: string): boolean => {
    try {
      localStorage.setItem(key, value)
      return true
    } catch (error) {
      console.error('保存到本地存储失败:', error)
      return false
    }
  }

  /**
   * 从localStorage中删除数据
   * @param key 要删除的键名
   * @returns 操作是否成功
   */
  const removeItem = (key: string): boolean => {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error('从本地存储删除数据失败:', error)
      return false
    }
  }

  /**
   * 清除所有localStorage数据
   * @returns 操作是否成功
   */
  const clear = (): boolean => {
    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.error('清除本地存储失败:', error)
      return false
    }
  }

  return {
    getItem,
    setItem,
    removeItem,
    clear
  }
} 