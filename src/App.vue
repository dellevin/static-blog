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
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

import '@/assets/styles/main.less'
import "@/assets/styles/components/toc.less"
import "@/assets/styles/components/darkmode.less"
import "@/assets/styles/components/highlight.less"
</script>
<style scoped lang="less">

</style>
