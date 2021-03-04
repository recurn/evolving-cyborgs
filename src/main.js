import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import {projectAuth} from './firebase/config'
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import mitt from 'mitt';
const emitter = mitt();

import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/saga-blue/theme.css'       //theme
import 'primevue/resources/primevue.min.css'                //core css
import 'primeicons/primeicons.css'
import ToastService from 'primevue/toastservice';       




import './assets/main.css'
import './registerServiceWorker'
let app
projectAuth.onAuthStateChanged(() => {
    if(!app){
        app = createApp(App)
        app.use(router).use(ElementPlus).use(PrimeVue).use(ToastService)
        app.config.globalProperties.emitter = emitter
        app.mount('#app')
    }
})
