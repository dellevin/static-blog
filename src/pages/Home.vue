<template>
  <div class="main">
    <div class="main-inner">
      <div class="content">
        <div class="post_list">
          <div class="round-shape-one"></div>
          <!-- 循环渲染帖子 -->
          <div
              v-for="(post, index) in paginatedPosts"
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
              <div class="bottom-page">
                <!-- 上一页 -->
                <a
                    v-if="currentPage > 1"
                    @click.prevent="pagination.prev"
                    class="btn pre newer-posts newer_posts"
                    href="#"
                >
                  Newer Posts
                </a>
                <a v-else class="btn pre newer-posts newer_posts" href="#" > </a>

                <!-- 跳转区域 -->
                <div class="center-section">
                  <a class="page-info">
                    Page {{ currentPage }} of {{ totalPages }}
                  </a>
                  <input
                      v-model="jumpPage"
                      type="number"
                      min="1"
                      :max="totalPages"
                      class="page-jump-input"
                  />
                  <a @click="goToPage" class="btn go-to-page">
                    Go
                  </a>
                </div>

                <!-- 下一页 -->
                <a
                    v-if="currentPage < Math.ceil(postsList.length / pageSize)"
                    @click.prevent="pagination.next"
                    class="btn next older-posts older_posts"
                    href="#"
                >
                  Older Posts
                </a>
                <a v-else class="btn pre newer-posts newer_posts" href="#" > </a>

              </div>


              <div style="clear: both; height: 0;"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import postInfo from '@/utils/postInfo.json'
import websiteConfig from '@/utils/websiteConfig.json'
import {ref, computed} from 'vue'


const postsList = postInfo.markdownList
// 当前页
const currentPage = ref(1)
// 一页显示条数
const pageSize = websiteConfig.pageConfig.postPageSize
const jumpPage = ref('')
// 总页数计算
const totalPages = computed(() => Math.ceil(postsList.length / pageSize))

// 计算当前页的帖子列表
const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return postsList.slice(start, end)
})
// 跳转到xx页
const goToPage = () => {
  const targetPage = Number(jumpPage.value)
  if (targetPage >= 1 && targetPage <= totalPages.value) {
    currentPage.value = targetPage
    jumpPage.value = '' // 清空输入框
  } else {
    alert(`输入有误，请输入数值 1 ~ ${totalPages.value} `)
  }
}
// 设置分页数据（上一页和下一页）
const pagination = ref({
  prev: () => {
    if (currentPage.value > 1) currentPage.value -= 1
  },
  next: () => {
    if (currentPage.value < Math.ceil(postsList.length / pageSize)) currentPage.value += 1
  },
})
</script>

<style scoped lang="less">
.bottom-page {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
}

.bottom-page.center-align {
  justify-content: center;
}

.newer-posts {
  margin-right: auto;
}

.older-posts {
  margin-left: auto;
}

.center-section {
  display: flex;
  align-items: center;
  gap: 8px; /* 控制元素之间的间距 */
}

//.page-jump-input {
//  width: 60px;
//  text-align: center;
//}
.go-to-page {
  padding: 3px 8px;
}
.go-to-page:hover {
  cursor: pointer;
  padding: 3px 8px;
}
.page-jump-input {
  width: 50px;
  height: 15px;
  text-align: center;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 4px;
  outline: none;
  transition: border-color 0.3s, box-shadow 0.3s;
}

/* 鼠标悬停效果 */
.page-jump-input:hover {
  border-color: #bbb;
}

/* 聚焦效果 */
.page-jump-input:focus {
  border-color: #007bff; /* 边框颜色 */
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5); /* 聚焦阴影效果 */
}

/* 禁用鼠标滚轮更改数值 */
.page-jump-input::-webkit-outer-spin-button,
.page-jump-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.page-jump-input[type="number"] {
  -moz-appearance: textfield; /* Firefox 浏览器 */
}
</style>
