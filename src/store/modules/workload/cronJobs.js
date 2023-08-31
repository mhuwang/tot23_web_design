
import {
  getAllCronJobs,
  deleteCronJobById
} from '@/api/workload/cronJobs'
import { getToken } from '@/utils/auth'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {

}

const actions = {

  //删除文件
  deleteCronJobById({ commit }, fileId) {
    return new Promise((resolve, reject) => {
      deleteCronJobById(fileId).then(response => {
        const { data } = response
        if (!data) {
          return reject('获取失败')
        }
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // getAllCronJobs
  getAllCronJobs({ commit }, namespace) {
    return new Promise((resolve, reject) => {
      getAllCronJobs(namespace).then(response => {
        const { data } = response
        if (!data) {
          return reject('获取失败')
        }
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
