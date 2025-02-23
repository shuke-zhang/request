import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

import { HttpRequestDeduplicator } from './HttpRequestDeduplicator';
import { HttpRequestMethodsEnum, type CustomRequestOption, type HttpHandlers } from './types';

import axios from 'axios';
import { merge } from 'lodash-es';

export class HttpRequest<T extends object> {
  /**
   * private 表示类的私有属性。只能在类里面访问
   */

  /**
   * @description axios 实例
   */
  private axiosInstance: AxiosInstance;
  /**
   * @description 参数
   */
  private options: CustomRequestOption;
  /**
   * @description 处理方法
   */
  requestCallbacks: HttpHandlers;
  /**
   * @description 取消重复请求
   */
  requestDeduplicator = new HttpRequestDeduplicator();

  /**
   * 构造函数，用于初始化 HttpRequest 实例
   * @param options - 配置选项，类型为 HttpRequestOption
   * @param requestHandlers - 请求处理函数，类型为 HttpHandlers，默认为空对象
   */
  constructor(options: CustomRequestOption, requestHandlers: HttpHandlers = {}) {
    // 将传入的请求处理函数赋值给类的 requestCallbacks 属性
    this.requestCallbacks = requestHandlers;
    // 使用 axios.create 方法创建一个 axios 实例，并将传入的 options 作为配置参数
    this.axiosInstance = axios.create({
      ...options,
    });
    // 将传入的请求选项赋值给类的 options 属性
    this.options = options;
    // 调用类的 setupInterceptors 方法，设置请求和响应拦截器
    this.setupInterceptors();
  }

  /**
   * @description 获取配置对象
   *
   */
  private getOptions(config: InternalAxiosRequestConfig) {
    return merge({ ...this.options }, { ...config });
  }

  /**
   * @description 添加时间戳
   *
   */
  private addJoinTime(config: InternalAxiosRequestConfig) {
    if (config.method?.toLocaleLowerCase() == HttpRequestMethodsEnum.GET) {
      const options = this.getOptions(config);
      if (options.joinTime === true) {
        config.params = {
          ...config.params,
          _t: `${Date.now()}`,
        };
      }
    }
    return config;
  }

  /**
   * @description 添加token
   */
  private addToken(config: InternalAxiosRequestConfig) {
    const options = this.getOptions(config);
    if (options.withToken) {
      const token = options.token || this.requestCallbacks.getToken?.();
      config.headers[options.tokenKey || 'Authorization'] = `${options.tokenPrefix || 'Bearer'} ${token}`;
    }
    return config;
  }

  /**
   * @description 设置请求拦截器
   */
  private setupInterceptors() {
    /**
     * 1. 添加时间戳
     * 2. 添加 token
     * 3. 忽略重复请求
     */
    // 添加时间戳到 get 请求
    this.axiosInstance.interceptors.request.use(this.addJoinTime);
    // 添加 token 到请求头
    this.axiosInstance.interceptors.request.use(this.addToken);
    // 忽略重复请求
    this.axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      const options = this.getOptions(config);
      // 如果需要忽略重复请求，则添加到 pendingMap
      if (options.ignoreDuplicateRequest) {
        this.requestDeduplicator.addPending(config);
      }
      return config;
    });
  }

  /**
   * @description 设置响应拦截器
   */
  private setupResponseInterceptors() {
    this.axiosInstance.interceptors.response.use(response => {
      const { config, data } = response;
      const options = this.getOptions(config);
      // 如果需要忽略重复请求，则从 pendingMap 中移除
      if (options.ignoreDuplicateRequest) {
        this.requestDeduplicator.removePending(config);
      }
      // 如果需要返回原生响应，则直接返回 response
      if (options.isReturnRawResponse) {
        return response;
      } else {
        return data;
      }
    });
  }
}
