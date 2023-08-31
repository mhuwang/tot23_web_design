import request from '@/utils/request'
const baseUrl = require('../api').baseurl


export function getAllDaemonSets(nameAndNamespace) {
  return request({
    url: baseUrl + '/files/querryFiles',
    method: 'get',
    params: {
      current: data.current,
      size: data.size,
      fileName: data.fileName,
      fileType: "video"
    }
  })
}
export function deleteDaemonSetByNameAndNamespace(data) {
  return request({
    url: baseUrl + '/files/delete',
    method: 'get',
    params: {
      fileId: fileId
    }
  })
}