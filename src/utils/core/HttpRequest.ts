import type { CustomAxiosRequestConfig, HttpHandlers } from './types';
import type { AxiosInstance } from 'axios';

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
  private options: CustomAxiosRequestConfig;
  /**
   * @description 处理方法
   */
  requestCallbacks: HttpHandlers;
}
