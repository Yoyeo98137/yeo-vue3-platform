## 开始 

如果还没有安装 pnpm

```
npm i -g pnpm
```

然后安装依赖 启动项目

```
pnpm i
pnpm run dev
```

一个用来练手开发 vue3/ts 相关的中后台项目 demo  
主要是想尝试一些日常开发中 没来得及或者没有尝试过 的东西

- 更合理的 hooks 思想
- 更理想的 组件封装
- and more...

### 技术栈

Vue 3 + Typescript + Vite + vue-router + Pinia + scss + Element Plus

> 项目的体量并没有必要使用状态管理，仅仅为了 更多的尝试

### TodoList

- [x] 级联选择器：多选 + 懒加载 + 动态回显 + loading
- [ ] useRequest
- [ ] ...

### useRequest

**特性**

- [x] 数据响应式
- [x] 自动请求/手动请求（兼容带参函数）
- [x] loading delay（有效防止闪烁）
- [x] 参数 泛型推断
- [x] 钩子回调
- [x] 依赖请求 ready
- [x] 兼容响应式参数
- [x] 重新发起请求 refresh
- [x] 依赖刷新 refreshDeps
- [x] 节流、防抖选项（throttleInterval、debounceInterval）
- [x] 基于场景延伸（高级 hook）
- [ ] 文档、用例整理，md 文件转换
- [ ] ...

**场景**

- [x] 分页 usePagination
- [x] 表格 useTable
- [ ] ...

> https://github.com/vercel/swr  
> https://www.attojs.com/  
> https://ahooks.gitee.io/zh-CN  
