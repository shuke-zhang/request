// utils/http/HttpRequestDeduplicator.ts
import type { InternalAxiosRequestConfig } from 'axios';

/**
 * @description http请求去重器
 * AbortController 为接口表示一个控制器对象，允许你根据需要中止一个或多个 Web 请求。 ---- https://developer.mozilla.org/zh-CN/docs/Web/API/AbortController
 */

export class HttpRequestDeduplicator {
  /**
   * 存储进行中请求的 Map，键是请求唯一标识，值是 AbortController
   */
  private pendingMap = new Map<string, AbortController>();

  /**
   * @description 生成唯一请求标识 用于判断是否跟之前的请求一样
   */
  static generateUniqueIdentifier(config: InternalAxiosRequestConfig): string {
    console.log([config.method?.toUpperCase(), config.url].join('&'));
    return [config.method?.toUpperCase(), config.url].join('&');
  }

  /**
   * @description 添加请求到跟踪队列 如果先前有相同请求则取消
   */
  addPending(config: InternalAxiosRequestConfig) {
    const identifier = HttpRequestDeduplicator.generateUniqueIdentifier(config);
    /**
     * 如果已有相同请求，先取消
     */
    if (this.pendingMap.has(identifier)) {
      this.removePending(config);
    }

    /**
     *  创建 AbortController 并设置请求的 signal 同时添加到 pendingMap
     */
    const controller = new AbortController();
    config.signal = controller.signal;
    this.pendingMap.set(identifier, controller);
    return controller.signal;
  }

  /**
   *  @description 移除单个请求
   */
  removePending(config: InternalAxiosRequestConfig): void {
    const identifier = HttpRequestDeduplicator.generateUniqueIdentifier(config);
    const controller = this.pendingMap.get(identifier);

    if (controller) {
      controller.abort();
      // controller.abort('Request canceled by deduplicator');
      this.pendingMap.delete(identifier);
    }
  }

  /**
   * @description 取消所有请求
   */
  removeAllPending(): void {
    this.pendingMap.forEach(controller => {
      controller.abort('All requests canceled');
    });
    this.pendingMap.clear();
  }

  /**
   * @description 重置去重器
   */
  reset(): void {
    this.pendingMap = new Map();
  }
}
