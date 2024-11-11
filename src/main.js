// main.js
import { createApp } from 'vue'; // 确保导入 createApp
import App from './App.vue';
import router from './router';

const app = createApp(App); // 使用 createApp 创建应用实例
app.use(router); // 使用路由
app.mount('#app'); // 挂载应用到 id 为 app 的 DOM 元素
