import { getAllNodes, getNodeByName, getUsageRecentTwenty, getNodeYamlByName } from '@/api/cluster/nodes'
import { getToken } from '@/utils/auth'

const state = {
  nodeName: '',
  token: getToken(),
  // name: '',
  // avatar: ''
}

const mutations = {
  // 跳转 Node 详情页面
  TO_NODE_DETIALS: (state, nodeName) => {
    // 赋值
    state.nodeName = nodeName;
  }
}

const actions = {
  // getAllNodes
  getAllNodes({ commit }) {
    return new Promise((resolve, reject) => {
      getAllNodes().then(response => {
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

  // 通过node名字获取信息 
  getNodeByName({ commit }, nodeName) {
    return new Promise((resolve, reject) => {
      getNodeByName(nodeName).then(response => {
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
  toDetails({ commit }, nodeName) {
    commit("TO_NODE_DETIALS", nodeName);
  },

  // 获取近20分钟的利用率
  getUsageRecentTwenty({ commit }, nodeName) {
    return new Promise((resolve, reject) => {
      getUsageRecentTwenty(nodeName).then(response => {
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

  // 获取 Node yaml 文件
  getNodeYamlByName({ commit }, nodeName) {
    return new Promise((resolve, reject) => {
      getNodeYamlByName(nodeName).then(response => {
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

