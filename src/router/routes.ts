import Home from '@/views/home/home.vue'
import About from '@/views/about/about.vue'
import Demo from '@/views/demo/demo.vue'

export const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/about', name: 'about', component: About },
  { path: '/demo', name: 'demo', component: Demo },
]
