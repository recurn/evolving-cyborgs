import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import {projectAuth} from './firebase/config'
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import mitt from 'mitt';
const emitter = mitt();


import './assets/main.css'
let app
projectAuth.onAuthStateChanged(() => {
    if(!app){
        app = createApp(App)
        app.use(router).use(ElementPlus)
        app.config.globalProperties.emitter = emitter
        app.mount('#app')
    }
})
