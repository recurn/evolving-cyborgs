import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Habits from '../views/Habits.vue'
import Login from '../views/auth/Login.vue'
import Signup from '../views/auth/Signup.vue'
import Vices from '../views/Vices.vue'

//route guard
import {projectAuth} from '../firebase/config'

const requireAuth = (to, from, next) => {
  let user = projectAuth.currentUser
  if(!user){
    next({name: 'Login'})
  }
  else {
    next()
  }
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter: requireAuth
  },
  {
    path: '/index.html',
    name: 'Home-alt',
    component: Home,
    beforeEnter: requireAuth
  },
  {
    path: '/habits',
    name: 'Habits',
    component: Habits,
    beforeEnter: requireAuth
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/vices',
    name: 'Vices',
    component: Vices,
    beforeEnter: requireAuth
  }

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
