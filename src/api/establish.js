import request from '@/utils/request'
const baseUrl = require('./api').baseurl

export function createPodFromForm(data,fileType) {
  return request({
    url: baseUrl + '/files/upload',
    method: 'post',
    params:{
      file: data,
      fileType:fileType
    }
  })
}
export function createPodFromYamlFile(data) {
  console.log(11111)
  return request({
    url: baseUrl + '/files/upload',
    method: 'post',
    headers: {
      "Accept":'multipart/form-data',
    },
    data: data
  
  })
}

export function createResourceByYaml(data) {
  return request({
    url: baseUrl + '/establish/createResourceByYaml',
    method: 'post',
    data: {
      yaml: data,
    }
  })
}
