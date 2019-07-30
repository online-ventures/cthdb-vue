import Vue from 'vue'
import Router from 'vue-router'
import ShowList from './views/ShowList.vue'
import JobList from './views/JobList.vue'
import VolunteerList from './views/VolunteerList.vue'
import Home from './views/Home.vue'
import Profile from './views/Profile.vue'
import Callback from './views/Callback.vue'
import NotFound from './views/NotFound.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/shows',
      name: 'show-list',
      component: ShowList
    },
    {
      path: '/jobs',
      name: 'job-list',
      component: JobList
    },
    {
      path: '/volunteers',
      name: 'volunteers',
      component: VolunteerList
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile
    },
    {
      path: '/callback',
      name: 'callback',
      component: Callback
    },
    {
      path: '*',
      component: NotFound
    }
  ]
})
