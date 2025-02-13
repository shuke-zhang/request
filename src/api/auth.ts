import { request } from '@/utils/baseRequest';
export function getBaseCodeImg() {
  return request.get('/prod-api/captchaImage');
}
export function loginApi(data: unknown) {
  return request.post('/prod-api/login', data);
}
