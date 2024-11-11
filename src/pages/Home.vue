<template>
  <div class="main">
    <div class="main-inner">
      <div class="content">
        <div class="post_list">
          <div class="round-shape-one"></div>
          <!-- 循环渲染帖子 -->
          <div
              v-for="(post, index) in posts"
              :key="index"
              class="post"
          >

            <div class="post_title weaklink">
              <h2><a :href="post.link">{{ post.title }}</a></h2>
            </div>
            <div class="post_content markdown">
              <div class="p_part">
                <p>{{ post.abstract }}</p>
              </div>
            </div>
            <div class="post_footer">
              <section class="info weaklink">
                <i class="iconfont icon-calendar"></i>
                <span style="margin-right: 15px;">{{ post.dateFormat }}</span>
                <i class="iconfont icon-category"></i>
                <span class="weaklink" style="margin-right: 13px;">
                  <span
                      v-for="(tag, index) in post.tags"
                      :key="index"
                  >
                    <a :href="tag.link" class="tag">{{ tag.name }}</a>
                    <span v-if="index !== post.tags.length - 1">|</span>
                  </span>
                </span>
                <i class="iconfont icon-caret-down"></i>
                <span class="weaklink" style="margin-right: 20px;">{{ post.stats.words }} 字</span>
                <i class="iconfont icon-naozhong"></i>
                <span class="weaklink" style="margin-right: 15px;">{{ post.stats.text }}</span>
              </section>
            </div>
          </div>
          <div class="round-shape-one"></div>
          <div class="paginator pager pagination">
            <div class="paginator_container pagination_container">
              <a
                  v-if="pagination.prev"
                  :href="pagination.prev"
                  class="btn pre newer-posts newer_posts"
              >
                Newer Posts
              </a>
              <a
                  v-if="pagination.next"
                  :href="pagination.next"
                  class="btn next older-posts older_posts"
              >
                Older Posts
              </a>
              <div style="clear: both; height: 0;"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'

// 示例帖子数据
const posts = ref([
  {
    link: '#',
    title: '示例文章标题',
    abstract: '这是文章摘要内容。',
    dateFormat: '2024-11-11',
    tags: [
      {name: '标签1', link: '#'},
      {name: '标签2', link: '#'},
    ],
    stats: {
      words: 1200,
      text: '5 分钟前',
    },
  },
  // 其他帖子数据
])

// 示例分页数据
const pagination = ref({
  prev: '#',
  next: '#',
})
</script>

<style scoped lang="less">
.main {
  /* 添加你的样式 */
}
</style>
