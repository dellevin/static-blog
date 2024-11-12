<template>
  <div class="main">
    <div class="main-inner">
      <div class="content">
        <div class="round-shape-one"></div>

        <!-- 年份分组列表 -->
        <div v-for="year in uniqueYears" :key="year" class="list_with_title">
          <div class="listing_title" >{{ year.label }}</div>
          <div class="listing">
            <div class="listing-item">
              <div
                  v-for="post in year.list"
                  :key="post.link"
                  class="listing_post"
              >
                <a :href="post.link" :title="post.title">{{ post.title }}</a>
                <div class="post_date">
                  <span class="date">{{ post.dateFormat }}</span>
<!--                  <span class="date">{{ post.changeTime }}</span>-->
                </div>
              </div>
            </div>
            <br />
          </div>
        </div>

        <!-- 分页控制 -->
        <div style="width:100%; overflow:hidden">
          <div v-if="currentPage > 1 " style="float:left; text-align:left; width:50%;">
            <a
                href="#"
                class="btn pre newer-posts newer_posts"
                @click.prevent="pagination.prev"
            >Prev Page</a>
          </div>
          <div v-if="currentPage < Math.ceil(postsList.length / pageSize)"
               style="float:right; text-align:right; width:50%;">
            <a
                href="#"
                class="btn next older-posts older_posts"
                @click.prevent="pagination.next"
            >Next Page</a>
          </div>
        </div>


      </div>
    </div>
  </div>
</template>

<script setup>
import postInfo from '@/utils/postInfo.json'
import websiteConfig from '@/utils/websiteConfig.json'
import { ref, computed } from 'vue'

// markdown文件数据
const postsList = postInfo.markdownList
// 当前页
const currentPage = ref(1)
// 每页显示条数
const pageSize = websiteConfig.pageConfig.archivesPageSize

// 获取唯一年份list
const uniqueYears = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  // 获取前 pageSize 条，并进行分页提取年份，并按照年份分类
  const posts = postsList.slice(start, end);

  // 按照年份分组
  const groupedByYear = posts.reduce((acc, post) => {
    const year = post.dateFormat.substring(0, 4); // 获取年份
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(post); // 按年份将文章添加到对应的数组中
    return acc;
  }, {});

  // 将年份按降序排序并构造新的数组格式
  return Object.keys(groupedByYear)
      .sort((a, b) => b - a) // 按年份降序排序
      .map((year) => ({
        label: year,
        list: groupedByYear[year],
      }));
})




const pagination = ref({
  prev: () => {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
  },
  next: () => {
    if (currentPage.value < Math.ceil(postsList.length / pageSize)) {
      currentPage.value++;
    }
  },
})
</script>

<style scoped>

</style>
