import {
  getAllJobs,
  getJobByNameAndNamespace,
  deleteJobByNameAndNamespace,
  getJobResources,
  getJobYamlByNameAndNamespace,
  getJobLogs
} from '@/api/workload/jobs'

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

  // getAllJobs
  getAllJobs({ commit }, namesapce) {
    return new Promise((resolve, reject) => {
      getAllJobs(namesapce).then(response => {
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

  // getJobByNameAndNamespace
  getJobByNameAndNamespace({ commit }, nameAndNamespace) {
    return new Promise((resolve, reject) => {
      getJobByNameAndNamespace(nameAndNamespace).then(response => {
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

  // 通过名字和命名空间删除 Job
  deleteJobByNameAndNamespace({ commit }, nameAndNamespace) {
    return new Promise((resolve, reject) => {
      deleteJobByNameAndNamespace(nameAndNamespace).then((response) => {
        const { data } = response
        if (!data) {
          return reject('删除失败')
        }
        resolve(data)
      }).catch((error) => {
        reject(error)
      })
    })
  },

  // 通过名字和命名空间获取 Yaml 格式的 Job
  getJobYamlByNameAndNamespace({ commit }, nameAndNamespace) {
    return new Promise((resolve, reject) => {
      getJobYamlByNameAndNamespace(nameAndNamespace).then(response => {
        const { data } = response
        if (!data) {
          return reject('获取失败')
        }
        resolve(data)
      }).catch((error) => {
        reject(error)
      })
    })
  },

  // 获取 Job 的所有日志
  getJobLogs({ commit }, nameAndNamespace) {
    return new Promise((resolve, reject) => {
      getJobLogs(nameAndNamespace).then(response => {
        const { data } = response
        if (!data) {
          return reject('获取失败')
        }
        resolve(data)
      }).catch((error) => {
        reject(error)
      })
    })
  },

  // 通过名字和命名空间获取 Job 和 Job 管理的 Pods
  getJobResources({ commit }, nameAndNamespace) {
    return new Promise((resolve, reject) => {
      getJobResources(nameAndNamespace).then(response => {
        const { data } = response
        if (!data) {
          return reject('获取失败')
        }
        resolve(data)
      }).catch((error) => {
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
