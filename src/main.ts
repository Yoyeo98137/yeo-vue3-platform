import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import App from './App.vue';

// 手动导入样式
import 'element-plus/es/components/loading/style/index';
import 'element-plus/es/components/message/style/index';
import 'element-plus/es/components/message-box/style/index';
import 'element-plus/theme-chalk/src/index.scss';

const app = createApp(App);

app.use(router).use(createPinia()).mount('#app');
