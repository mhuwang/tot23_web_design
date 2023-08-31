import { createPodFromForm, createPodFromYamlFile, createResourceByYaml } from '@/api/establish'
import { register } from '@/api/user'

import { getToken } from '@/utils/auth'

const getDefaultState = () => {
  return {
    token: getToken()
  }
}

const state = getDefaultState()

const mutations = {

}

const actions = {

  createResourceByYaml({commit}, yaml) {
    return new Promise((resolve, reject) => {
      createResourceByYaml(yaml).then(response => {
        const { data } = response
        if (!data) {
          return reject('修改失败')
        }
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 从输入创建资源
  createPodFromForm({ commit }, podForme) {
    return new Promise((resolve, reject) => {
      createPodFromForm(podForm).then(response => {
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

  register({ commit }, userInfo) {
    const { username, password } = userInfo
    // return new Promise((resolve, reject) => {
    //   register({ username: username.trim(), password: password }).then(response => {
    //     const { data } = response
    //     console.log("actions");
    //     console.log(data);
    //     // commit('SET_TOKEN', data.token)
    //     // setToken(data.token)
    //     // resolve(data);
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })

    return new Promise((resolve, reject) => {
      register({ username: username.trim(), password: password }).then(response => {
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

  // 从Yaml文件创建 Pod
  createPodFromYamlFile({ commit }, yamlForm) {
    console.log(yamlForm)
    return new Promise((resolve, reject) => {
      createPodFromYamlFile(yamlForm).then(response => {
        const { data } = response
        if (!data) {
          return reject('创建失败')
        }
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
