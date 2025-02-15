<template>
  <div>
    <button @click="fetchData">获取数据（快速点击测试）</button>
    <button @click="cancelAll">取消所有请求</button>
    <div v-if="loading">加载中...</div>
    <div v-else>{{ data }}</div>
  </div>
</template>

<script setup lang="ts">
import http, { deduplicator } from '@/utils/http/axios';
import { ref } from 'vue';

const data = ref(null);
const loading = ref(false);

const fetchData = async () => {
  try {
    loading.value = true;
    const response = await http.get('/api/data');
    data.value = response.data;
  } catch (err: any) {
    if (!err.isCanceled) {
      console.error('请求失败:', err);
    }
  } finally {
    loading.value = false;
  }
};

const cancelAll = () => {
  deduplicator.removeAllPending();
};
</script>
