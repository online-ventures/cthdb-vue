import Vue from 'vue'
import Router from 'vue-router'
import ShowList from './views/ShowList.vue'
import HelloWorld from './views/HelloWorld.vue'
import EventShow from './views/EventShow.vue'
import EventCreate from './views/EventCreate.vue'
import User from './views/User.vue'
import NotFound from './views/NotFound.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: HelloWorld
    },
    {
      path: '/shows',
      name: 'show-list',
      component: ShowList
    },
    {
      path: '/event/:id',
      name: 'event-show',
      component: EventShow,
      props: true
    },
    {
      path: '/event/create',
      name: 'event-create',
      component: EventCreate
    },
    {
      path: '/user/:username',
      name: 'user',
      component: User,
      props: true
    },
    {
      path: '*',
      component: NotFound
    }
  ]
})
