// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/pages/Home.vue';
import Archive from '@/pages/Archive.vue';
import Tags from '@/pages/Tags.vue';
import Album from '@/pages/Album.vue';
import Links from '@/pages/Links.vue';
import About from '@/pages/About.vue';
import CategoryView from '@/pages/CategoryView.vue'; // 分类视图
import PostView from '@/pages/PostView.vue'; // 文章视图

const routes = [
    // 首页
    { path: '/', name: 'Home', component: Home },
    // 归档
    { path: '/archive', name: 'Archive', component: Archive },
    // 标签
    { path: '/tags', name: 'Tags', component: Tags },
    // 相册
    { path: '/album', name: 'Album', component: Album },
    // 友情链接
    { path: '/links', name: 'Links', component: Links },
    // 关于
    { path: '/about', name: 'About', component: About },
    // 分类路由
    { path: '/category/:category', name: 'CategoryView', component: CategoryView },
    // 文章详情路由
    { path: '/category/:category/:post', name: 'PostView', component: PostView },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
