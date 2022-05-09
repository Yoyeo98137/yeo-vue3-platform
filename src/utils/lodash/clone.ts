import { isRef } from "vue"
import { isArray } from "../ifType"

/** 简易深拷贝 */
const deepClone = (obj: any) => {
  // 用来保存引用关系，解决循环引用问题(使用闭包私有化copyObj变量)
  // 可以weakMap弱引用来保存，这里为了兼容使用object
  const copyObj: any = {}

  const clone = (data: any) => {
    // 简单数据类型直接返回值
    if (!(data instanceof Object)) {
      return data
    }

    // 非引用类型直接抛出
    if (typeof data !== "object") return data

    const newObj: any = isArray(data) ? [] : {}

    for (const key in data) {
      // todo
      // 兼容 响应式对象 值拷贝
      if (isRef(data[key])) {
        // Object.getOwnPropertyDescriptor(a, "_value")
        // configurable
        // value

        // 在拷贝过程中，保留响应式的引用来提供自定义操作可能性
        // 而不去改变值的结构
        data[key] && (newObj[key] = data[key])
        // data[key] && (newObj[key] = data[key].value)
        continue
      }

      // 简单数据类型直接返回值
      if (!(data[key] instanceof Object)) {
        newObj[key] = data[key]
        continue
      }

      // 判断是否为循环引用
      if (copyObj[key] === data[key]) {
        newObj[key] = data[key]
        continue
      }

      // 保存引用
      copyObj[key] = data[key]

      // 复杂数据类型，递归处理
      newObj[key] = clone(data[key])
    }

    return newObj
  }

  return clone(obj)
}

export default deepClone