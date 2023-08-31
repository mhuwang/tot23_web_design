import request from '@/utils/request'
let baseUrl = require("./api").baseurl;

export function login(data) {
  return request({
    url: baseUrl + '/user/login',
    method: 'get',
    params: data,
  })
}

export function register(data) {
  return request({
    url: baseUrl + '/user/add',
    method: 'post',
    params: data,
  })
}


export function getInfo(token) {
  return request({
    url: baseUrl + '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: baseUrl + '/user/logout',
    method: 'get'
  })
}

export function getUsers(queryInfo) {
    
  return request({
    url: baseUrl + '/user/getUsers',
    method: 'get',
    params: {
      queryInfo: queryInfo.queryInfo,
      pageStart: queryInfo.pageStart,
      pageSize: queryInfo.pageSize
    }
  })
}
