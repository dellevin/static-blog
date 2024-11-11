<template>
  <div v-if="postContent" v-html="postContent"></div>
</template>

<script setup>
// import { ref, onMounted } from 'vue';
// import { useRoute } from 'vue-router';
// import marked from 'marked';
//
// const route = useRoute();
// const postContent = ref('');
//
// onMounted(async () => {
//   const response = await fetch(`/note/${category}/${post}.md`);
//   const markdown = await response.text();
//   postContent.value = marked.parse(markdown);
// });
</script>
