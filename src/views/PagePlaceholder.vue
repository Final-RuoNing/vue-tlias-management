<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="page">
    <h2>{{ route.meta.title }}</h2>
    <p>这里是"{{ route.meta.title }}"页面，等待填充具体内容</p>
  </div>
</template>

<style scoped>
.page {
  padding: 30px;
}

.page h2 {
  color: #333;
}
</style>
