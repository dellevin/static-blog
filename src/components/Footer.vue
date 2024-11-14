<template>
<!--  <a id="scrollUp" href="#" style="position: fixed; z-index: 2147483647; display: block;"></a>-->
  <div class="footer animated fadeInDown">
    <div class="site_footer">
      <div class="mysocials">
        <div class="my_socials">
          <!-- Loop through social media items -->
          <a
              v-for="(item,index) in webSiteConfig.footerMenuConfig"
              :key="index"
              :href="item.link"
              :title="item.iconName"
          >
            <i :class="`fa fa-${item.iconName}`"></i>
          </a>
        </div>
      </div>

      <div class="copyright" id="copyright">
        {{ webSiteConfig.footerConfig.footerInfo }}
        | Copyright © 2020-{{ nowYear() }}
        <a :href="webSiteConfig.footerConfig.domain" style="margin: 0;">{{ webSiteConfig.footerConfig.siteName }}</a>.
      </div>

      <span>
        📚<strong>{{ postInfo.markdownCount }}</strong> posts
      </span>
    </div>
  </div>
</template>

<script setup>
import webSiteConfig from '@/utils/websiteConfig.json';
import postInfo from '@/utils/postInfo.json';
const nowYear=()=>{
  const now = new Date();
  return now.getFullYear();
}

</script>

<style scoped lang="less">
</style>
