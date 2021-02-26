import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import {projectAuth} from './firebase/config'
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';

import './assets/main.css'
let app
projectAuth.onAuthStateChanged(() => {
    if(!app){
        app = createApp(App).use(router).use(ElementPlus).mount('#app')
    }
})
