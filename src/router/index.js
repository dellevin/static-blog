// src/router/index.js
import {createRouter, createWebHistory,createWebHashHistory} from 'vue-router';
import Home from '@/pages/Home.vue';
import Archive from '@/pages/Archive.vue';
import Album from '@/pages/Album.vue';
import Links from '@/pages/Links.vue';
import About from '@/pages/About.vue';
import CategoryView from '@/pages/CategoryView.vue'; // 分类视图
import PostView from '@/pages/PostView.vue'; // 文章视图

const routes = [
    // 首页
    {
        path: '/', name: 'Home', component: Home, meta: {
            title: "Del Levin's Blog"
        }
    },
    // 归档
    {
        path: '/archive', name: 'Archive', component: Archive, meta: {
            title: '归档'
        }
    },
    // 标签
    {
        path: '/category', name: 'CategoryView', component: CategoryView, meta: {
            title: '分类'
        }
    },
    // 相册
    {
        path: '/album', name: 'Album', component: Album, meta: {
            title: '相册'
        }
    },
    // 友情链接
    {
        path: '/links', name: 'Links', component: Links, meta: {
            title: '友链'
        }
    },
    // 关于
    {
        path: '/about', name: 'About', component: About, meta: {
            title: '关于'
        }
    },
    // 文章详情路由
    {
        path: '/postView/:post',
        name: 'PostView',
        component: PostView
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
