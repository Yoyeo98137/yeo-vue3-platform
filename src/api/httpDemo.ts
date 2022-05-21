// 测试 axios 请求，抛出模块...

import service from "@/request";

export function getHttpDemoGetApi(paramsA: number) {
  return service({
    url: "xxx",
    method: "get",
    // `params` 是即将与请求一起发送的 URL 参数
    params: {
      a: paramsA
    },
  })
}

export function getHttpDemoPostApi() {
  return service({
    url: "xxx",
    method: "post",
    // `data` 是作为请求主体被发送的数据
    // 只适用于这些请求方法 'PUT', 'POST', 和 'PATCH'
    data: {
      params1: 1,
      params2: "xxx"
    },
    // 覆盖全局选项
    headers: {
      "Accept": "*/*",
      "Content-Type":
        "multipart/form-data; boundary=----WebKitFormBoundaryjdXBJ4ljaEBHEhJu",
    }
  })
}
