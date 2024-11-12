<template>
  <div id="app">
    <Header/>

    <main>
      <router-view/>
    </main>

    <Footer/>
  </div>
</template>
<script setup>
// 主页头部脚部信息
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
// 全局css
import '@/assets/styles/main.less'
// import "@/assets/styles/components/toc.less"
import "@/assets/styles/components/darkmode.less"
import "@/assets/styles/components/highlight.less"
</script>
<style scoped lang="less">

</style>
