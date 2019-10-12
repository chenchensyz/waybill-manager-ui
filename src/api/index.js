import request from '../utils/request';
import $qs from 'qs';

export const httpGet = (url, query) => {
  return request({
    url: url +"?"+ $qs.stringify(query),
    method: 'get',
  })
}

export const httpPost = (url, query) => {
  return request({
    url: url,
    method: 'post',
    data: $qs.stringify(query)
  })
}

export const httpJson = (url, query) => {
  return request({
    url: url,
    method: 'post',
    data: query
  })
}

