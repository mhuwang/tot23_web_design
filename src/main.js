import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css

// 引入 highlight
import hljs from 'highlight.js';
import 'highlight.js/styles/atelier-forest-light.css' // 样式

// 引入 beautify
import beautify from 'js-beautify'

// 引入 json 2 ymal
import jsYaml from 'js-yaml'

// 引入 codemirror
import VueCodemirror from 'vue-codemirror'
// 引入基础样式
import 'codemirror/lib/codemirror.css'

import App from './App'
import store from './store'
import router from './router'

import axios from 'axios'
import api from './api/api' 

// 引入 Echarts
import * as echarts from 'echarts'

// 引入 View UI
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';

import '@/icons' // icon
// 引入 iconfont
import "./assets/font/iconfont.css"

import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })

// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)
Vue.prototype.axios = axios
Vue.prototype.$api = api
Vue.prototype.$echarts = echarts
Vue.config.productionTip = false
Vue.prototype.beautify = beautify.js
Vue.prototype.$axios = axios
// Vue.prototype.YAML = json2yaml
Vue.prototype.YAML = jsYaml

// 使用 ViewUI 
Vue.use(ViewUI);

// 使用 highlight
Vue.use(hljs.vuePlugin);

// 使用 codemirror
Vue.use(VueCodemirror,{
  events: ['refresh']
});

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
