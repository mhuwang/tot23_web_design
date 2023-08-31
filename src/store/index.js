import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
// import common from './modules/common'

import cluster from './modules/cluster/cluster'
import nodes from './modules/cluster/nodes'
import namespaces from './modules/cluster/namespaces'

import cronJobs from './modules/workload/cronJobs'
import daemonSets from './modules/workload/daemonSets'
import deployments from './modules/workload/deployments'
import jobs from './modules/workload/jobs'
import pods from './modules/workload/pods'
import establish from './modules/establish'


Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    nodes,
    namespaces,
    cluster,

    cronJobs,
    daemonSets,
    deployments,

    jobs,
    pods,

    establish,
  },
  getters
})

export default store
