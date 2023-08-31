import request from '@/utils/request'
let baseUrl = require("../api").baseurl;

export function getAllClusterRoles(data) {
  return request({
    url: baseUrl + '/clusterRoles/getAllClusterRoles',
    method: 'get',
  })
}
export function getClusterRoleDetails(data) {
  return request({
    url: baseUrl + '/clusterRoles/getClusterRoleDetails',
    method: 'get',
    params: {
      clusterRole: data,
    }
  })
}

export function getClusterRoleYamlByName(data) {
  return request({
    url: baseUrl + '/clusterRoles/getClusterRoleYamlByName',
    method: 'get',
    params: {
      clusterRole: data,
    }
  })
}
export function delClusterRoleByName(data) {
  return request({
    url: baseUrl + '/clusterRoles/delClusterRoleByName',
    method: 'get',
    params: {
      clusterRole: data,
    }
  })
}