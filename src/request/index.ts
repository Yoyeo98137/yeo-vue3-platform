import axios from "axios";
import { addPendingRequest, removePendingRequest } from "./tool";

/**
 * todolist
 * - [x] 定制化配置项（允许覆盖全局配置项，axios 本身就允许这个覆盖机制）
 * - [ ] 取消请求（避免一个接口的重复请求、或者切换路由时取消之前的请求、再比如手动取消请求）
 * - [ ] 更丰富的 ts 类型提示 AxiosRequestConfig
 */

const service = axios.create({
  baseURL: "/",
  timeout: 2000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  },

  // `transformRequest` 允许在向服务器发送前，修改请求数据
  // 只能用在 'PUT', 'POST' 和 'PATCH' 这几个请求方法
  // 后面数组中的函数必须返回一个字符串，或 ArrayBuffer，或 Stream（node.js）
  transformRequest: [function (data, headers) {
    // 对 data 进行任意转换处理
    if (Object.prototype.toString.call(data) === "[object FormData]") {
      return data
    }

    return JSON.stringify(data)
  }],
})

// 添加请求拦截器
service.interceptors.request.use(
  (config) => {

    // console.log('🏄 # req/t # config.headers', config.headers)

    // 可以做什么？
    // token注入：给每个请求注入token
    // 自定义请求头
    // 拦截重复请求
    // 请求参数加密（与后端协议）

    // 处理重复请求
    removePendingRequest(config)
    addPendingRequest(config)

    // 定制headers
    if (config.headers) {
      config.headers["Accept"] = "*/*"
      // If has token..
      config.headers["token"] = "test yeo token..."
    }

    // 参数加密
    // config.params = { p: formateParams(config.data, 1, pKey) }
    // config.data = { p: formateParams(config.data, 1, pKey) }

    // 发送请求之前做什么...
    return config
  },
  (error) => {
    // 对请求错误做什么...
    return Promise.reject(error)
  }
)

// 添加响应拦截器
service.interceptors.response.use(
  (res) => {
    // console.log('🏄 # response # res', res)

    // 可以做什么？
    // 定制化接口返回：通常来说大部分接口的返回结构是一样的，而我们基本只需要其中的一项，比如 info
    // 接口通用异常处理：所有接口都会可能返回的异常情况，比如权限不足、登录信息失效等
    // 读取token：在 “第一个请求中” 拿到后台的token并保存下来，通常是登录接口、或者授权之类的接口

    // 移除重复请求
    removePendingRequest(res.config)

    // 对响应数据做点什么...
    // 2xx 范围内的状态码触发
    return res
  },
  (error) => {
    // 一般来说会把接口保存，配合后台带过来的报错 message 一同提示出去
    // 但也可能要适配特殊情况：比如后台根据业务定义了非200的状态码，要做定制化的错误提示，这时候就需要跳过拦截器（配置项控制）

    // 移除重复请求
    removePendingRequest(error.config || {})

    // 对响应错误做点什么...
    // 超出 2xx 范围的状态码触发
    return Promise.reject(error)
  }
)

export default service
