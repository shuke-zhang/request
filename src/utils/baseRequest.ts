import axios from 'axios';

export const request = axios.create({
  baseURL: __API_URL__,
  timeout: 1000,
  // headers: {'X-Custom-Header': 'foobar'}
});
