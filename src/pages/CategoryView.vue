<template>
  <div class="main">
    <div class="main-inner">
      <div class="content">
        <div class="list_with_title">
          <div class="tags-container">
            <!-- 使用 v-for 来遍历 tags 数组 -->
            <a
                v-for="(tag, index) in tags"
                :key="index"
                class="tag"
                :id="'tag-' + index"
                :href="tag.link"
                :style="{ backgroundColor: getColor(), color: '#000' }"
            >
              {{ tag.name }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 从外部获取 tags 数据
import { computed } from 'vue';
import postInfo from '@/utils/postInfo.json'
// markdown文件数据
const postsList = postInfo.markdownList



// 去重后的标签计算属性
const tags = computed(() => {
  const allTags = new Set();

  // 遍历 postsList 获取每篇文章的 tags
  postsList.forEach(post => {
    if (post.tags) {
      post.tags.forEach(tag => {
        // 使用 JSON.stringify(tag) 来序列化标签对象，确保去重
        const tagKey = JSON.stringify(tag);
        allTags.add(tagKey);
      });
    }
  });

  // 将去重后的 Set 转换回数组，并解析回对象
  return Array.from(allTags).map(tagKey => JSON.parse(tagKey));
});

// 获取随机颜色函数
function getColor() {
  let color = '#';
  for (let i = 0; i < 3; i++) {
    // 生成介于 180 和 220 之间的随机数
    let temp = Math.floor(Math.random() * 41) + 180;
    temp = temp.toString(16);
    if (temp.length === 1) {
      temp = '0' + temp;
    }
    color += temp;
  }
  return color;
}
</script>

<style scoped>
/* 样式部分 */
.main {
  padding: 20px;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag {
  padding: 10px 20px;
  font-size: 14px;
  border-radius: 12px;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.tag:hover {
  opacity: 0.8;
}
</style>
