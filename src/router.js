import Vue from 'vue'
import Router from 'vue-router'
import ShowList from './views/ShowList.vue'
import ShowManage from './views/ShowManage.vue'
import JobList from './views/JobList.vue'
import VolunteerList from './views/VolunteerList.vue'
import VolunteerEdit from './views/VolunteerEdit.vue'
import VolunteerShow from './views/VolunteerShow.vue'
import Home from './views/Home.vue'
import Callback from './views/Callback.vue'
import Login from './views/Login.vue'
import NotFound from './views/NotFound.vue'

Vue.use(Router)

const router = new Router({
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
      path: '/shows/:id',
      name: 'show-manage',
      component: ShowManage
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
      path: '/volunteer/new',
      name: 'new-volunteer',
      component: VolunteerEdit
    },
    {
      path: '/volunteer/:id/edit',
      name: 'edit-volunteer',
      component: VolunteerEdit
    },
    {
      path: '/volunteer/:id',
      name: 'volunteer',
      component: VolunteerShow
    },
    {
      path: '/callback',
      name: 'callback',
      component: Callback
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '*',
      component: NotFound
    }
  ]
})

export default router
