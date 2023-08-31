
import request from '@/utils/request'
const baseUrl = require('../api').baseurl

export function getAllCronJobs(data) {
  console.log(data)
  return request({
    url: baseUrl + '/files/querryFiles',
    method: 'get',
    params: {
      current: data.current,
      size: data.size,
      fileName: data.fileName
    }
  })
}

export function deleteCronJobById(fileId) {
  return request({
    url: baseUrl + '/files/delete',
    method: 'get',
    params: {
      fileId: fileId
    }
  })
}

