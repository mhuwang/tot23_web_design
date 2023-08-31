import request from '@/utils/request'
let baseUrl = require("../api").baseurl;

export function initClusterGraph(data) {
  return request({
    url: baseUrl + '/cluster/initClusterGraph',
    method: 'get',
  })
}