import request from '@/utils/request'
let baseUrl = require("../api").baseurl;

export function getAllNamespaces() {
  return request({
    url: baseUrl + '/namespaces/getAllNamespaces',
    method: 'get',
  })
}
export function getAllNamespaceName() {
  return request({
    url: baseUrl + '/namespaces/getAllNamespaceName',
    method: 'get',
  })
}

export function getNamespaceDetails(data) {
  return request({
    url: baseUrl + '/namespaces/getNamespaceDetails',
    method: 'get',
    params: {
      namespace: data,
    }
  })
}

export function getNamespaceYamlByName(data) {
  return request({
    url: baseUrl + '/namespaces/getNamespaceYamlByName',
    method: 'get',
    params: {
      namespace: data,
    }
  })
}

export function deleteNamespaceByName(data) {
  return request({
    url: baseUrl + '/namespaces/deleteNamespaceByName',
    method: 'get',
    params: {
      namespace: data,
    }
  })
}