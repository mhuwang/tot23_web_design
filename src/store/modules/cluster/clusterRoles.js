import { getAllClusterRoles, getClusterRoleDetails, getClusterRoleYamlByName, delClusterRoleByName } from '@/api/cluster/clusterRoles'
import { getToken } from '@/utils/auth'

const state = {
  clusterRolesDetails: {},
  token: getToken(),
  // name: '',
  // avatar: ''
}

const mutations = {
  // 跳转 NameSpace 详情页面
  TO_CLUSTERROLES_DETIALS: (state, clusterRolesDetails) => {
    // 赋值
    state.clusterRolesDetails = clusterRolesDetails;
  }
}

const actions = {
  // getAllClusterRoles
  getAllClusterRoles({commit}) {
    return new Promise((resolve, reject) => {
      getAllClusterRoles().then(response => {
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
  toDetails({commit, state}, clusterRolesDetails) {
    commit("TO_CLUSTERROLES_DETIALS", clusterRolesDetails);
  },

  // 获取 Cluster Role 详情
  getClusterRoleDetails({ commit }, clusterRole) {
    return new Promise((resolve, reject) => {
      getClusterRoleDetails(clusterRole).then(response => {
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

   // 获取 Cluster Role 的 yaml 文件详情
   getClusterRoleYamlByName({ commit }, clusterRole) {
    return new Promise((resolve, reject) => {
      getClusterRoleYamlByName(clusterRole).then(response => {
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

    // 删除 clusterRole 
    delClusterRoleByName({ commit }, clusterRole) {
      return new Promise((resolve, reject) => {
        delClusterRoleByName(clusterRole).then(response => {
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

