import {
  getAllPods,
  getPodsByNode,
  getPodByNameAndNamespace,
  getCompletePodsList,
  getPodYamlByNameAndNamespace,
  delPodByNameAndNamespace,
  createPodFromForm,
  getPodLogFromContainer,
  getPodAllLogs,
  getPodResources
} from '@/api/workload/pods'
import { getToken } from '@/utils/auth'

const state = {
  token: getToken(),
  pod: {
    podName: '',
    podNamespace: ''
  }
}

const mutations = {
  // 跳转 deployment 详情页面
  TO_POD_DETIALS: (state, { podName, podNamespace }) => {
    // 赋值
    state.pod.podName = podName
    state.pod.podNamespace = podNamespace
  }
}

const actions = {

  // 获取所有 pods
  getAllPods({ commit }, namespace) {
    return new Promise((resolve, reject) => {
      getAllPods(namespace).then(response => {
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

  // 通过 node 名称获取对应的 pod
  getPodsByNode({ commit }, nodeName) {
    return new Promise((resolve, reject) => {
      getPodsByNode(nodeName).then(response => {
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

  // 通过名称和命名空间获取对应的 pod 的详情，带利用率信息
  getPodByNameAndNamespace({ commit }, podDetails) {
    return new Promise((resolve, reject) => {
      getPodByNameAndNamespace(podDetails).then(response => {
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

  // 通过名称和命名空间获取对应的 pod yaml 文件
  getPodYamlByNameAndNamespace({ commit }, podDetails) {
    return new Promise((resolve, reject) => {
      getPodYamlByNameAndNamespace(podDetails).then(response => {
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

  // 通过名称和命名空间删除 pod
  delPodByNameAndNamespace({ commit }, podDetails) {
    return new Promise((resolve, reject) => {
      delPodByNameAndNamespace(podDetails).then(response => {
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

  // 通过名称和命名空间删除 pod
  getPodResources({ commit }, podDetails) {
    return new Promise((resolve, reject) => {
      getPodResources(podDetails).then(response => {
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

  // 查找完整的 Pod 列表
  getCompletePodsList({ commit }) {
    return new Promise((resolve, reject) => {
      getCompletePodsList().then(response => {
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

  // 通过表单创建 Pod
  createPodFromForm({ commit: commit }, podInformation) {
    return new Promise((resolve, reject) => {
      createPodFromForm(podInformation).then(response => {
        const { data } = response
        if (!data) {
          return reject('创建失败')
        }
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取某个容器 Log
  getPodLogFromContainer({ commit: commit }, data) {
    return new Promise((resolve, reject) => {
      getPodLogFromContainer(data).then(response => {
        const { data } = response
        if (!data) {
          return reject('创建失败')
        }
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取所有容器Logs
  getPodAllLogs({ commit: commit }, data) {
    return new Promise((resolve, reject) => {
      getPodAllLogs(data).then(response => {
        const { data } = response
        if (!data) {
          return reject('创建失败')
        }
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 点击名字进入详情页
  toDetails({ commit }, podDetails) {
    console.log('actions', podDetails)
    commit('TO_POD_DETIALS', podDetails)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

