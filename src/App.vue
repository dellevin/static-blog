<template>
  <div id="app">
    <header>
      <nav>
        <router-link to="/">首页</router-link>
        <router-link to="/archive">归档</router-link>
        <router-link to="/tags">标签</router-link>
        <router-link to="/album">相册</router-link>
        <router-link to="/links">友链</router-link>
        <router-link to="/about">关于</router-link>
      </nav>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>
<script setup>

</script>
<style scoped>
/* 全局样式 */
nav {
  display: flex;
  gap: 10px;
}
</style>
