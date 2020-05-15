import Vue from 'vue'
import Router from 'vue-router'
import Restrict from '@/auth/restrict'
import VolunteerList from '@/views/VolunteerList.vue'
import VolunteerEdit from '@/views/VolunteerEdit.vue'
import VolunteerShow from '@/views/VolunteerShow.vue'
import VolunteerJobs from '@/views/VolunteerJobs.vue'
import TenantList from '@/views/TenantList.vue'
import ShowList from '@/views/ShowList.vue'
import ShowManage from '@/views/ShowManage.vue'
import ShowEdit from '@/views/ShowEdit.vue'
import ShowAddVolunteer from '@/views/ShowAddVolunteer.vue'
import JobList from '@/views/JobList.vue'
import JobEdit from '@/views/JobEdit.vue'
import JobManage from '@/views/JobManage.vue'
import Home from '@/views/Home.vue'
import Callback from '@/views/Callback.vue'
import Login from '@/views/Login.vue'
import Logout from '@/views/Logout.vue'
import NotFound from '@/views/NotFound.vue'

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
      path: '/theatres',
      name: 'theatres',
      component: TenantList
    },
    {
      path: '/volunteers',
      name: 'volunteers',
      component: VolunteerList
    },
    {
      path: '/volunteer/new',
      name: 'new-volunteer',
      component: VolunteerEdit,
      meta: { role: 'staff' }
    },
    {
      path: '/volunteer/:id/edit',
      name: 'edit-volunteer',
      component: VolunteerEdit,
      meta: { role: 'staff' }
    },
    {
      path: '/volunteer/:id',
      name: 'volunteer',
      component: VolunteerShow
    },
    {
      path: '/volunteer/:id/show/:show_id/:from?',
      name: 'volunteer-show',
      component: VolunteerJobs,
      meta: { role: 'staff' }
    },
    {
      path: '/shows',
      name: 'shows',
      component: ShowList
    },
    {
      path: '/show/:id',
      name: 'show',
      component: ShowManage
    },
    {
      path: '/show/new',
      name: 'new-show',
      component: ShowEdit,
      meta: { role: 'staff' }
    },
    {
      path: '/show/:id/edit',
      name: 'edit-show',
      component: ShowEdit,
      meta: { role: 'staff' }
    },
    {
      path: '/show/:id/add-volunteer',
      name: 'show-add-volunteer',
      component: ShowAddVolunteer,
      meta: { role: 'staff' }
    },
    {
      path: '/jobs',
      name: 'jobs',
      component: JobList
    },
    {
      path: '/job/:id',
      name: 'job',
      component: JobManage
    },
    {
      path: '/job/new',
      name: 'new-job',
      component: JobEdit,
      meta: { role: 'staff' }
    },
    {
      path: '/job/:id/edit',
      name: 'edit-job',
      component: JobEdit,
      meta: { role: 'staff' }
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
      path: '/logout',
      name: 'logout',
      component: Logout
    },
    {
      path: '*',
      component: NotFound
    }
  ]
})

router.beforeEach(Restrict)

export default router
