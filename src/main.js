import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
App.mpType = 'app'

import gio from '@/utils/gio-minp/index'
gio('init', 'projectId', 'wx1234564545435', { version: '1.0',vue: Vue ,
// debug: true,
})

const app = new Vue(App)
app.$mount()
