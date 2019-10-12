import axios from 'axios';
import Routers from '@/router'

const service = axios.create({
  // process.env.NODE_ENV === 'development' 来判断是否开发环境
  baseURL: process.env.API_ROOT,
  timeout: 30000
})

service.interceptors.request.use(
  config => {
    config.headers.common = {
      //'Content-Type': "application/x-www-form-urlencoded",
      'userName': localStorage.getItem('userName'),
      'token': localStorage.getItem('token'),
      'timestamp': localStorage.getItem('timestamp'),
    }
    return config;
  }, error => {
    console.log(error);
    return Promise.reject();
  })

service.interceptors.response.use(response => {
  if (response.status === 200) {
    return response.data;
  } else {
    Promise.reject();
  }
}, err => {
  if (err && err.response) {
    switch (err.response.status) {
      case 400:
        err.message = '请求错误'
        break
      case 401:
        localStorage.clear();
        Routers.push('/login');
        err.message = '登陆超时'
        break
      case 403:
        err.message = '拒绝访问'
        break
      case 404:
        err.message = `请求地址出错: ${err.response.config.url}`
        break
      case 408:
        err.message = '请求超时'
        break
      case 500:
        err.message = '服务器内部错误'
        break
      case 501:
        err.message = '服务未实现'
        break
      case 502:
        err.message = '网关错误'
        break
      case 503:
        err.message = '服务不可用'
        break
      case 504:
        err.message = '网关超时'
        break
      case 505:
        err.message = 'HTTP版本不受支持'
        break
      default:
    }
  }
  console.error(err)
  return Promise.reject(err) // 返回接口返回的错误信息
})

export default service;
