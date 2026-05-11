/**
 * 统一请求封装
 * @param {string} path - 相对路径，例如 'data.json'
 * @returns {Promise<any>} - 返回的数据
 */
export async function fetchData(path) {
  // 核心技巧：使用 import.meta.env.BASE_URL 自动适配本地和线上路径
  // 本地开发时是 '/'，线上部署时是 '/img-app/'
  const baseUrl = import.meta.env.BASE_URL
  const url = `${baseUrl}${path}`

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error(`[API Error] 请求 ${path} 失败:`, error)
    throw error
  }
}