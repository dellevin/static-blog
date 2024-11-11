<template>
  <div>
    <div class="progress"></div>

    <div class="darkmode-background"></div>
    <div class="darkmode-layer"></div>
    <noscript>
      <p class="warn">本页面需要浏览器支持（启用）JavaScript</p>
    </noscript>

    <div class="header">
      <div class="logo_title">
        <div class="title animated fadeInDown">
          <a :href="`https://${webSiteConfig.config.githubName}.github.io`">
            <img alt="logo" style="display:inline-block;" src="../assets/logo.png"/>
          </a>
          <h1 :title="webSiteConfig.config.siteName" class="weaklink">
            <a href="/">
              {{ webSiteConfig.config.siteName }}
            </a>
          </h1>

          <div class="navbar weaklink">
            <div class="normal_nav">
              <div class="bitcron_nav_container">
                <div class="bitcron_nav">
                  <nav class="mixed_site_nav_wrap site_nav_wrap">
                    <ul class="mixed_site_nav site_nav sm sm-base">
                      <li v-for="menu in webSiteConfig.headerMenuConfig" :key="menu.link">
                        <a :href="menu.link" class="selected active current nav__item">
                          {{ menu.name }}
                        </a>
                      </li>
                    </ul>
                  </nav>
                  <!--搜索框-->
<!--                  <div style="float:right;margin-top:1em">-->
<!--                    <form id="gridea-search-form" data-update="1578893743252" action="/search/index.html">-->
<!--                      <input class="search-input" autocomplete="off" spellcheck="false" name="q"-->
<!--                             placeholder="Search..."/>-->
<!--                    </form>-->
<!--                  </div>-->
                  <!--亮暗切换-->
                  <div style="margin-left:0.5em;margin-top:1.2em">
                    <input id="switch_default" @click="toggleDarkMode" type="checkbox"  :checked="isDarkMode" class="switch_default"/>
                    <label for="switch_default" class="toggleBtn"></label>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>


    </div>
  </div>
</template>

<script setup>
import webSiteConfig from '@/utils/websiteConfig.json'

import {ref, onMounted} from 'vue';

const isDarkMode = ref(false);
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  if (isDarkMode.value) {
    document.body.classList.add("darkmode");
    document.cookie = "darkmode=enable; path=/";
  } else {
    document.body.classList.remove("darkmode");
    document.cookie = "darkmode=disable; path=/";
  }
};

onMounted(() => {
  const darkModeCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('darkmode='))
      ?.split('=')[1];

  console.log(darkModeCookie)
  if (darkModeCookie === "enable" ||
      (darkModeCookie !== "disable" && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    isDarkMode.value = true;
    document.body.classList.add("darkmode");
  }
});


</script>

<style scoped>
.progress {
  background: linear-gradient(to right, #87ceeb var(--scroll), transparent 0);
  background-repeat: no-repeat;
  position: fixed;
  width: 100%;
  height: 4px;
  z-index: 1;
}

.bitcron_nav {
  display: flex;
}
</style>
