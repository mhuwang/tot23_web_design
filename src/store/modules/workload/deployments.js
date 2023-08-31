import { getAllDeployments, setReplica, getDeploymentByNameAndNamespace, getDeploymentYamlByNameAndNamespace, deleteDeploymentByNameAndNamespace, getDeploymentResources, getAllDeploymentsName } from '@/api/workload/deployments'
import { getToken } from '@/utils/auth'

const state = {
  token: getToken(),
  deployment: {
    deploymentName: '',
    deploymentNamespace: ''
  }
}

const mutations = {
  // 跳转 deployment 详情页面
  TO_DEPLOYMENTS_DETIALS: (state, { deploymentName, deploymentNamespace }) => {
    // 赋值
    state.deployment.deploymentName = deploymentName
    state.deployment.deploymentNamespace = deploymentNamespace
  }
}

const actions = {

  // getAllDeployments
  getAllDeployments({ commit }, namespace) {
    return new Promise((resolve, reject) => {
      getAllDeployments(namespace).then(response => {
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

  // 设置副本数量
  setReplica({ commit }, data) {
    return new Promise((resolve, reject) => {
      setReplica(data).then(response => {
        const { data } = response
        if (!data) {
          return reject('设置失败')
        }
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // getDeploymentByNameAndNamesapce
  getDeploymentByNameAndNamespace({ commit }, dep) {
    return new Promise((resolve, reject) => {
      getDeploymentByNameAndNamespace(dep).then(response => {
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

  // 通过名字和命名空间获取 Yaml 格式的 Deployment
  getDeploymentYamlByNameAndNamespace({ commit }, nameAndNamespace) {
    return new Promise((resolve, reject) => {
      getDeploymentYamlByNameAndNamespace(nameAndNamespace).then(response => {
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

  // 通过名字和命名空间删除 Deployment
  deleteDeploymentByNameAndNamespace({ commit }, nameAndNamespace) {
    return new Promise((resolve, reject) => {
      deleteDeploymentByNameAndNamespace(nameAndNamespace).then((response) => {
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

  // 通过名字和命名空间获取 Deployment 和 Resources
  getDeploymentResources({ commit }, nameAndNamespace) {
    return new Promise((resolve, reject) => {
      getDeploymentResources(nameAndNamespace).then((response) => {
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

  getAllDeploymentsName({ commit }, namespace) {
    return new Promise((resolve, reject) => {
      getAllDeploymentsName(namespace).then((response) => {
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

  // 点击名字进入详情页
  toDetails({ commit }, dep) {
    commit('TO_DEPLOYMENTS_DETIALS', dep)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
