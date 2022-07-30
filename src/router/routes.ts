import Home from '@/views/home/home.vue'
import About from '@/views/about/about.vue'
import Demo from '@/views/demo/demo.vue'
import PaginationRequest from '@/views/todo/paginationRequest.vue'
import MoreRequest from '@/views/todo/moreRequest.vue'
import DemoHttp from '@/views/demo/demoHttp.vue'
import DemoComponents from '@/views/demo/demoComponents.vue'
import DemoCascader from '@/views/demo/demoCascader.vue'

export const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/about', name: 'about', component: About },
  { path: '/demo', name: 'demo', component: Demo },
  { path: '/paginationRequest', name: 'paginationRequest', component: PaginationRequest },
  { path: '/moreRequest', name: 'moreRequest', component: MoreRequest },
  { path: '/demoHttp', name: 'demoHttp', component: DemoHttp },
  { path: '/demoComponents', name: 'demoComponents', component: DemoComponents },
  { path: '/demoCascader', name: 'demoCascader', component: DemoCascader },
]
