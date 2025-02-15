<script setup lang="ts">
import { request } from '@/utils/baseRequest';
import { HttpRequestDeduplicator } from '@/utils/core/HttpRequestDeduplicator';

import axios from 'axios'; // 修复点 1：完整导入
import { ref } from 'vue';

// 实例化去重器
const deduplicator = new HttpRequestDeduplicator();

// 响应式数据
const status = ref('等待操作');
const result = ref('');
const message = ref('');
const canceledRequests = ref<string[]>([]);

// 模拟 API 地址
const API_URL = 'https://jsonplaceholder.typicode.com/todos/1';

// 发送请求方法
const sendRequest = async () => {
  status.value = '请求发送中...';
  message.value = '';

  try {
    const config = {
      method: 'get',
      url: API_URL,
      // 去重器会自动添加 cancelToken
    };

    // 添加到去重器（自动处理重复请求）
    deduplicator.addPending(config);

    // 发送请求
    const response = await request.get('/prod-api/captchaImage');

    // 请求完成后移除跟踪
    deduplicator.removePending(config);

    // 更新状态
    status.value = '请求成功';
    result.value = JSON.stringify(response.data, null, 2);
  } catch (error) {
    if (axios.isCancel(error)) {
      // 处理取消情况
      status.value = '请求已取消';
      message.value = `取消原因: ${error.message}`;
      canceledRequests.value.push(error.message);
    } else {
      // 处理其他错误
      status.value = '请求失败';
      message.value =
        error instanceof Error ? `1223${error.message}` : '未知错误';
    }
  }
};

function testSendRequest() {
  request.get('/prod-api/captchaImage');
}

// 取消所有请求
const cancelAll = () => {
  deduplicator.removeAllPending();
  message.value = '已取消所有进行中的请求';
  canceledRequests.value = [];
};
</script>
<template>
  <div class="demo-container">
    <h2>请求去重演示</h2>

    <!-- 操作按钮 -->
    <div class="button-group">
      <button @click="sendRequest">发送请求（点击多次观察）</button>
      <button @click="testSendRequest">
        没有添加取消重复请求（点击多次观察）
      </button>

      <button @click="cancelAll">取消所有请求</button>
    </div>

    <!-- 展示区域 -->
    <div class="result-area">
      <h3>请求状态：{{ status }}</h3>
      <div class="response-box">
        <p>最新响应结果：{{ result }}</p>
        <p>被取消的请求：{{ canceledRequests.join(' , ') || '无' }}</p>
        <p>系统消息：{{ message }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
}

.button-group {
  margin: 20px 0;
  display: flex;
  gap: 15px;
}

button {
  padding: 8px 16px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.3s;
}

button:hover {
  opacity: 0.8;
}

.result-area {
  margin-top: 20px;
  padding: 15px;
  background: #f8f8f8;
  border-radius: 6px;
}

.response-box {
  margin-top: 10px;
  padding: 10px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.response-box p {
  margin: 8px 0;
  word-break: break-word;
}
</style>
