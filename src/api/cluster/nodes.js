import request from '@/utils/request'
let baseUrl = require("../api").baseurl;

export function getAllNodes(data) {
  return request({
    url: baseUrl + '/nodes/getAllNodes',
    method: 'get',
  })
}
export function getNodeByName(data) {
  return request({
    url: baseUrl + '/nodes/getNodeByName',
    method: 'get',
    params: {
      nodeName: data,
    }
  })
}

export function getUsageRecentTwenty(data) {
  return request({
    url: baseUrl + '/nodes/getUsageRecentTwenty',
    method: 'get',
    params: {
      nodeName: data,
    },
  })
}

export function getNodeYamlByName(data) {
  return request({
    url: baseUrl + '/nodes/getNodeYamlByName',
    method: 'get',
    params: {
      nodeName: data,
    }
  })
}