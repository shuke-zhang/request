// utils/http/axios.ts
import { HttpRequestDeduplicator } from './HttpRequestDeduplicator';

import axios from 'axios';

// 创建去重器实例
const deduplicator = new HttpRequestDeduplicator();

// 创建自定义 Axios 实例
const http = axios.create({
  baseURL: __API_URL__,
  timeout: 10000,
});
// 请求拦截器
http.interceptors.request.use(config => {
  // 自动添加去重逻辑
  deduplicator.addPending(config);
  return config;
});

// 响应拦截器
http.interceptors.response.use(
  response => {
    // 请求成功后移除跟踪
    deduplicator.removePending(response.config);
    return response;
  },
  error => {
    // 处理取消请求的特定错误
    if (axios.isCancel(error)) {
      console.log('Request canceled:', error.message);
      return Promise.reject({ isCanceled: true, message: error.message });
    }
    deduplicator.removePending(error.config);
    return Promise.reject(error);
  },
);

export { http as default, deduplicator };
