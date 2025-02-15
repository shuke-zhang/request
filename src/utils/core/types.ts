import type {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  CancelToken,
} from 'axios';
/**
 * @description 请求配置参数类型
 */
export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  /**
   * @description 是否需要 Token
   */
  withToken?: boolean;

  /**
   * @description Token 的值
   */
  token?: string;

  /**
   * @description 是否返回原生响应
   */
  returnRawResponse?: boolean;

  /**
   * @description 是否加上时间戳
   */
  withTimestamp?: boolean;

  /**
   * @description 是否忽略重复请求
   */
  ignoreDuplicateRequest?: boolean;

  /**
   * @description Token 的前缀
   */
  tokenPrefix?: string;

  /**
   * @description 错误发生时的处理函数
   */
  onError?: (error: AxiosError) => void;

  /**
   * @description 响应数据的处理函数
   */
  transformResponse?: (data: any) => any;

  /**
   * @description 请求数据的处理函数
   */
  transformRequest?: (data: any) => any;

  /**
   * @description 请求超时时间（毫秒）
   */
  timeout?: number;

  /**
   * @description 请求重试次数
   */
  retryCount?: number;

  /**
   * @description 请求取消令牌
   */
  cancelToken?: CancelToken;

  /**
   * @description 请求拦截器
   */
  requestInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig;

  /**
   * @description 响应拦截器
   */
  responseInterceptor?: (response: AxiosResponse) => AxiosResponse;
}

/**
 * @description 请求配置参数类型 朱哥
 */
export interface HttpRequestOption extends AxiosRequestConfig {
  /**
   * @description 是否需要token
   */
  withToken?: boolean;
  /**
   * @description headers 携带token的key
   */
  tokenKey?: string;
  /**
   * @description 返回原生响应 AxiosResponse<T> 默认false
   */
  isReturnNativeResponse?: boolean;
  /**
   * @description get 请求的是否加上时间戳 默认false
   */
  joinTime?: boolean;
  /**
   * @description 是否 忽略重复请求 默认true（即相同的请求在第一个请求完成之前，其他请求都会被取消）
   *              结合 RequestDeduplicator 实现
   *              参考 axios 取消请求 https://axios-http.com/zh/docs/cancellation
   */
  ignoreRepeatRequest?: boolean;
  /**
   * @description token 的前缀 例如 authenticationScheme = Authorization token = 123 则 config.headers[tokenKey] = "Authorization 123"
   */
  authenticationScheme?: string;
}

/**
 * @description HttpRequest 的处理方法
 */
export interface HttpHandlers {
  /**
   * @description  获取token  结合 withToken 和 tokenKey 在 config.headers 设置 token
   */
  getToken?(): string | null;
  /**
   * @description  token 过期时的操作
   */
  onTokenExpired?(): void | any;
  /**
   * @description 错误发生时候的处理？例如是否是弹框提醒
   * @param msg
   */
  onError?(msg: string): void;
}
