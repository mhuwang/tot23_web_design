import request from '@/utils/request'
let baseUrl = require("./api").baseurl;
export function getList(params) {
  return request({
    url: '/vue-admin-template/table/list',
    method: 'get',
    params
  })
}
