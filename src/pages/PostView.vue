<template>
  <div class="main">
    <div class="main-inner">
      <div class="content">

        <div class="post">
          <h2 class="post_title sm_margin">
            <a>{{ post.title }}</a>
          </h2>

          <section class="post_details">
            <i class="iconfont icon-calendar"></i>
            <span style="margin-right: 15px">{{ post.dateFormat }}</span>

            <i class="iconfont icon-category"></i>
            <span class="weaklink" style="margin-right: 15px">
              <span v-for="(tag, index) in post.tags" :key="index">
                <a :href="tag.link" class="tag">{{ tag.name }}</a>
                <span v-if="index !== post.tags.length - 1"> | </span>
              </span>
            </span>

            <i class="iconfont icon-caret-down"></i>
            <span style="margin-right: 15px">{{ post.stats.words }}字</span>

            <i class="iconfont icon-naozhong"></i>
            <span style="margin-right: 15px">{{ post.stats.text }}</span>

            <a id="lan" href="javascript:void(0);" @click="toggleLanguage" title="调整简繁体"
               style="margin-right: 15px">{{ languageLabel }}</a>
          </section>


          <div style="display: flex">
            <div class="md_block" id="md_block">
              <div class="round-shape-one"></div>
<!--              <div v-html="post.abstract"></div>-->
              <div v-html="post.abstractHtml"></div>
              <span id="footnote"></span>
              <div id="warn"></div>
            </div>
<!--            <div class="toc-container" v-html="post.toc"></div>-->
          </div>

          <div id="fullPage">
            <canvas id="canvas"></canvas>
          </div>


        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import {useRoute} from 'vue-router';
import router from "@/router/index.js";
import { marked } from 'marked'; // 使用命名导入
import postInfo from '@/utils/postInfo.json'

// 获取路由参数
const route = useRoute();

// 模拟文章数据
const post = ref({
  title: '',
  dateFormat: '',
  stats: {words: 0, text: ''},
  tags: [],
  abstract: '',
});


const languageLabel = ref('繁');

// 处理简繁体切换
const toggleLanguage = () => {
  const scriptId = 'tongwenlet_cn';
  let scriptElement = document.getElementById(scriptId);

  if (languageLabel.value === '繁') {
    if (scriptElement) {
      document.body.removeChild(scriptElement);
    }

    scriptElement = document.createElement('script');
    scriptElement.language = 'javascript';
    scriptElement.type = 'text/javascript';
    scriptElement.src = 'https://cdn.jsdelivr.net/gh/qyxtim/Static@1.1/bookmarklet_tw.js';
    scriptElement.id = scriptId;
    document.body.appendChild(scriptElement);

    languageLabel.value = '简';
  } else {
    if (scriptElement) {
      document.body.removeChild(scriptElement);
    }

    scriptElement = document.createElement('script');
    scriptElement.language = 'javascript';
    scriptElement.type = 'text/javascript';
    scriptElement.src = 'https://cdn.jsdelivr.net/gh/qyxtim/Static@1.1/bookmarklet_cn.js';
    scriptElement.id = scriptId;
    document.body.appendChild(scriptElement);

    languageLabel.value = '繁';
  }
};

// 动态加载文章数据

onMounted(async () => {
  const { post: postName } = route.params;
  const lastSlashIndex = postName.lastIndexOf('/');
  const path = lastSlashIndex !== -1 ? postName.substring(0, lastSlashIndex) : '';
  const fileName = postName.substring(lastSlashIndex + 1);
  // console.log(path)
  // console.log(fileName)
  const selectLink = path+'/'+fileName+'.md'
  console.log(selectLink)
  // 查找 postInfo 中的对应对象
  const selectedPost = postInfo.markdownList.find(item => item.link === selectLink);
  if (selectedPost) {
    // 动态替换图片路径
    // 动态替换图片路径
    const baseImageUrl = `/note/${path}/assets/`;
    // 使用正则表达式替换所有符合 ![]() 形式的图片路径
    const abstractWithAbsolutePaths = selectedPost.abstract.replace(/!\[([^\]]+)]\(assets\/([^\)]+)\)/g, (match, altText, imagePath) => {
      // 确保图片路径是正确的相对路径
      const imageUrl = baseImageUrl + encodeURIComponent(imagePath);
      return `![${altText}](${imageUrl})`;
    });
    // post.value = selectedPost;
    // post.value = { ...selectedPost, abstractHtml: marked.parse(selectedPost.abstract) };
    post.value = { ...selectedPost, abstractHtml: marked.parse(abstractWithAbsolutePaths) };
  } else {
    console.error('Post not found:', selectLink);
  }

});
</script>

<style scoped>
.post_title {
  font-size: 24px;
  font-weight: bold;
}

.post_details {
  margin-bottom: 20px;
}



.md_block {
  width: 70%;
  padding: 20px;
}

.toc-container {
  width: 30%;
  padding: 20px;
}
</style>
