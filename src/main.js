// main.js
import {createApp} from 'vue'; // 确保导入 createApp
import App from './App.vue';
import router from './router';
import 'font-awesome/css/font-awesome.min.css'

const app = createApp(App); // 使用 createApp 创建应用实例
app.use(router); // 使用路由
app.mount('#app'); // 挂载应用到 id 为 app 的 DOM 元素

router.beforeEach((to, from, next) => {
    /* 路由发生变化修改页面 title */
    if (to.meta.title) {
        document.title = to.meta.title;
    }
    next(); // 确保导航能够继续
});