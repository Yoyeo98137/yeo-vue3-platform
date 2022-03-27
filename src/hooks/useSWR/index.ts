import { Ref, ref } from "vue"

type TypePromiseBooleanVal = (success: boolean) => Array<string>

interface PropsConfigPage {
  page: number
  pageSize: number
  total: number
}
interface PropsConfigSWR {
  mode?: "GET" | "POST" | "PUT" | "DELETE"
  pagination?: PropsConfigPage
}

/**
 * demo - useSWR
 * @param reqKey 请求标识
 * @param reqConfig 额外配置项
 * @returns 
 */
export const useSWR = (reqKey?: string, reqConfig?: PropsConfigSWR) => {
  const data: Ref<Array<string>> = ref([])
  const loading = ref(true)
  const error: any = ref()

  const useJson: TypePromiseBooleanVal = (success) => {
    return success ? ["value"] : []
  }
  const useFetch = () => {
    new Promise((resolve, reject) => {
      try {
        // todo axios..
        setTimeout(() => {
          const state = true

          data.value = useJson(state)
          loading.value = false
          resolve(state)
        }, 1600);
      } catch (err) {
        loading.value = false
        error.value = err
        reject(err)
      }
    })
  }

  // 不需要使用 async/await 的方式去 “中断” 数据的获取
  // 本来就是利用 ref 提供的 响应式去 动态 的更改内容输出
  useFetch()

  return {
    data,
    loading,
    error
  }
}
