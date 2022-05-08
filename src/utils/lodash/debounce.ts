type TypesDebounce = (func: any, wait?: number, immediate?: boolean) => void

/** 防抖 */
const debounce: TypesDebounce = (func, wait = 300, immediate = false) => {

  let timeout: any;

  return function () {
    /* @ts-ignore */
    let context = this;
    let args = arguments;

    if (timeout) clearTimeout(timeout); // timeout 不为null
    if (immediate) {
      let callNow = !timeout; // 第一次会立即执行，以后只有事件执行后才会再次触发
      timeout = setTimeout(function () {
        timeout = null;
      }, wait)
      if (callNow) {
        func.apply(context, args)
      }
    }
    else {
      timeout = setTimeout(function () {
        func.apply(context, args)
      }, wait);
    }
  }
}

export default debounce
