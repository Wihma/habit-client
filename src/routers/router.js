import Vue from 'vue'
import Router from 'vue-router'

import store from '@/stores/store' // your vuex store
// import Home from '@/views/old/Home.vue'

// middleware
import log from './middleware/global/log'
import auth from './middleware/global/auth'

const globalMiddleware = [log, auth]

const routerPaths = {
  Login: 'Login',
  Habit: 'Habit',
  Habits: 'Habits',
  Home: 'Home',
  TodaysHabits: 'TodaysHabits',
  ArchivedHabitList: 'ArchivedHabitList',
  About: 'About',
  UserHome: 'UserHome',
  NotFound404: 'NotFound404',
  UserSettings: 'UserSettings'
}
// an object used to redirect to habits. Based on the presumption that users want to spend most of their time there.
const redirectRouteToHabits = {
  Login: 'Login',
  Home: 'Home'
}

const authCheck = (to, from, next) => {
  if (!store.getters.isloggedin) {
    if (localStorage.getItem('jwt')) {
      store.commit('jwtActive')
      store.commit('setCurrentuserId')

      if (to.name in redirectRouteToHabits) {
        next('/habits')
      }
    };
    next()
    return
  }
  next('/login')
}

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import(/* webpackChunkName: "about" */ '@/views/oAccess/start.vue'),
      beforeEnter: authCheck,
      meta: {
        middleware: globalMiddleware
      }
    },
    {
      path: '/login',
      name: routerPaths.Login,
      component: () => import(/* webpackChunkName: "about" */ '@/views/oAccess/login.vue'),
      beforeEnter: authCheck,
      meta: {
        middleware: [log]
      }
    },
    {
      path: '/habit/:id',
      name: routerPaths.Habit,
      component: () => import(/* webpackChunkName: "about" */ '@/views/habit/habit.vue'),
      beforeEnter: authCheck,
      meta: {
        middleware: globalMiddleware
      }
    },
    {
      path: '/habits',
      name: routerPaths.Habits,
      component: () => import(/* webpackChunkName: "about" */ '@/views/habit/HabitList.vue'),
      beforeEnter: authCheck,
      meta: {
        middleware: globalMiddleware
      }
    },
    {
      path: '/todayshabits',
      name: routerPaths.TodaysHabits,
      component: () => import(/* webpackChunkName: "about" */ '@/views/habit/TodaysHabits.vue'),
      beforeEnter: authCheck,
      meta: {
        middleware: globalMiddleware
      }
    },
    {
      path: '/archivedhabits',
      name: routerPaths.ArchivedHabitList,
      component: () => import(/* webpackChunkName: "about" */ '@/views/habit/ArchivedHabitList.vue'),
      beforeEnter: authCheck,
      meta: {
        middleware: globalMiddleware
      }
    },
    {
      path: '/about',
      name: routerPaths.about,
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '@/views/old/About.vue')
    },
    {
      path: '/user/home',
      name: routerPaths.UserHome,
      component: () => import(/* webpackChunkName: "about" */ '@/views/user/home.vue'),
      beforeEnter: authCheck,
      meta: {
        middleware: globalMiddleware
      }
    },
    {
      path: '/404',
      name: routerPaths.NotFound404,
      component: () => import(/* webpackChunkName: "about" */ '@/views/oAccess/404.vue'),
      meta: {
        middleware: globalMiddleware
      }
    },
    {
      path: '/user/settings',
      name: routerPaths.UserSettings,
      component: () => import(/* webpackChunkName: "about" */ '@/views/user/settings.vue'),
      beforeEnter: authCheck,
      meta: {
        middleware: globalMiddleware
      }
    }
  ]
})

// Creates a `nextMiddleware()` function which not only
// runs the default `next()` callback but also triggers
// the subsequent Middleware function.
function nextFactory (context, middleware, index) {
  const subsequentMiddleware = middleware[index]
  // If no subsequent Middleware exists,
  // the default `next()` callback is returned.
  if (!subsequentMiddleware) return context.next
  return (...parameters) => {
    // Run the default Vue Router `next()` callback first.
    context.next(...parameters)
    // Then run the subsequent Middleware with a new
    // `nextMiddleware()` callback.
    const nextMiddleware = nextFactory(context, middleware, index + 1)
    subsequentMiddleware({ ...context, next: nextMiddleware })
  }
}

router.beforeEach((to, from, next) => {
  if (!(to.name in routerPaths)) {
    next({ path: '/404' })
  }
  if (to.meta.middleware) {
    const middleware = Array.isArray(to.meta.middleware)
      ? to.meta.middleware
      : [to.meta.middleware]

    const context = {
      from,
      next,
      router,
      to
    }
    const nextMiddleware = nextFactory(context, middleware, 1)

    return middleware[0]({ ...context, next: nextMiddleware })
  }

  return next()
})

export default router
