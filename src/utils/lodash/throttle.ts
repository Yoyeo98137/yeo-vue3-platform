type TypesThrottle = (fn: Function, delay?: number) => void

/** 节流 */
const throttle: TypesThrottle = (fn, delay = 300) => {

  let timer: any = null
  let starttime = Date.now()

  return function () {
    let curTime = Date.now() // 当前时间
    let remaining = delay - (curTime - starttime)  // 从上一次到现在，还剩下多少多余时间
    /* @ts-ignore */
    let context = this
    let args = arguments

    clearTimeout(timer)

    if (remaining <= 0) {
      fn.apply(context, args)
      starttime = Date.now()
    } else {
      timer = setTimeout(fn, remaining);
    }
  }
}

export default throttle
