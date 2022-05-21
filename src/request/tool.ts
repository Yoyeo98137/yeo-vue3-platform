import axios, { AxiosRequestConfig } from 'axios'
import qs from 'qs'

// 用于存储pending的请求（处理多条相同请求）
const pendingRequest = new Map()

// 生成request的唯一key
const generateRequestKey = (config: AxiosRequestConfig) => {
  // 通过url，method，params，data生成唯一key，用于判断是否重复请求
  // params为get请求参数，data为post请求参数
  const { url, method, params, data } = config
  return [url, method, qs.stringify(params), qs.stringify(data)].join('&')
}

// 将重复请求添加到pendingRequest中
export const addPendingRequest = (config: AxiosRequestConfig) => {
  const key = generateRequestKey(config)

  console.log('🏄 # addPendingRequest # key', key)
  console.log('🏄 # addPendingRequest # pendingRequest', pendingRequest)

  if (!pendingRequest.has(key)) {
    config.cancelToken = new axios.CancelToken(cancel => {
      pendingRequest.set(key, cancel)
    })
  }
}

// 取消重复请求
export const removePendingRequest = (config: AxiosRequestConfig) => {
  const key = generateRequestKey(config)

  console.log('🏄 # removePendingRequest # key', key)
  console.log('🏄 # removePendingRequest # pendingRequest', pendingRequest)

  if (pendingRequest.has(key)) {
    const cancelToken = pendingRequest.get(key)
    console.log('🏄 # removePendingRequest # cancelToken', cancelToken)

    // 触发回调，取消之前发送的请求
    cancelToken(key)
    // 清理当前已经取消的请求记录
    pendingRequest.delete(key)

    console.log('🏄 # removePendingRequest # pendingRequest', pendingRequest)
  }
}

