import { getAllNamespaces, getAllNamespaceName, getNamespaceDetails, getNamespaceYamlByName, deleteNamespaceByName } from '@/api/cluster/namespaces'
import { getToken } from '@/utils/auth'

const state = {
  namespaceDetails: {},
  token: getToken(),
  namespaces: [],
  // name: '',
  // avatar: ''
}

const mutations = {
  // 跳转 NameSpace 详情页面
  TO_NAMESPACE_DETIALS: (state, namespaceDetails) => {
    // 赋值
    state.namespaceDetails = namespaceDetails;
  },
  // 初始化获取所有命名空间名称
  SAVE_NAMESPACE_NAME: (state, namespaces) => {
    state.namespaces = namespaces;
  }
}

const actions = {
  // 获取所有命名空间
  getAllNamespaces({ commit }) {
    return new Promise((resolve, reject) => {
      getAllNamespaces().then(response => {
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

  // 获取所有命名空间名字
  getAllNamespaceName({ commit }) {
    return new Promise((resolve, reject) => {
      getAllNamespaceName().then(response => {
        const { data } = response.data
        if (!data) {
          return reject('获取失败')
        }
        commit("SAVE_NAMESPACE_NAME", data);
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取命名空间详情
  getNamespaceDetails({ commit }, namespace) {
    return new Promise((resolve, reject) => {
      getNamespaceDetails(namespace).then(response => {
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

  //通过名字获取命名空间对应的 yaml文件
  getNamespaceYamlByName({ commit }, namespace) {
    return new Promise((resolve, reject) => {
      getNamespaceYamlByName(namespace).then(response => {
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

  //通过名字获取命名空间对应的 yaml文件
  deleteNamespaceByName({ commit }, namespace) {
    return new Promise((resolve, reject) => {
      deleteNamespaceByName(namespace).then(response => {
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


  // 点击名字进入详情页
  toDetails({ commit, state }, namespaceDetails) {
    commit("TO_NAMESPACE_DETIALS", namespaceDetails);
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

