import Vue from 'vue'
import Router from 'vue-router'

import store from '@/stores/store' // your vuex store
// import Home from '@/views/old/Home.vue'

// middleware
import log from './middleware/global/log'
import auth from './middleware/global/auth'
import setDocumentTitle from './middleware/global/setDocumentTitle'

const globalMiddleware = [log, auth, setDocumentTitle]

const routerPaths = {
  Login: {
    name: 'Login',
    title: 'Login'
  },
  Habit: {
    name: 'Habit',
    title: 'Habit'
  },
  Habits: {
    name: 'Habits',
    title: 'Habits'
  },
  HabitStatistics: {
    name: 'Statistics',
    title: 'Statistics'
  },
  Home: {
    name: 'Home',
    title: 'Home'
  },
  TodaysHabits: {
    name: 'TodaysHabits',
    title: 'Todays Habits'
  },
  ArchivedHabitList: {
    name: 'ArchivedHabitList',
    title: 'Archived Habits'
  },
  About: {
    name: 'About',
    title: 'About'
  },
  UserHome: {
    name: 'UserHome',
    title: 'User Home'
  },
  NotFound404: {
    name: 'NotFound404',
    title: 'Not Found 404'
  },
  UserSettings: {
    name: 'UserSettings',
    title: 'User Settings'
  }
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
      name: routerPaths.Login.name,
      component: () => import(/* webpackChunkName: "about" */ '@/views/oAccess/login.vue'),
      beforeEnter: authCheck,
      meta: {
        middleware: [log],
        title: routerPaths.Login.title
      }
    },
    {
      path: '/habit/:id',
      name: routerPaths.Habit.name,
      component: () => import(/* webpackChunkName: "about" */ '@/views/habit/habit.vue'),
      beforeEnter: authCheck,
      meta: {
        middleware: globalMiddleware,
        title: routerPaths.Habit.title
      }
    },
    {
      path: '/habit/statistics/:id',
      name: routerPaths.HabitStatistics.name,
      component: () => import(/* webpackChunkName: "about" */ '@/views/habit/statistics.vue'),
      beforeEnter: authCheck,
      meta: {
        middleware: globalMiddleware,
        title: routerPaths.HabitStatistics.title
      }
    },
    {
      path: '/habits',
      name: routerPaths.Habits.name,
      component: () => import(/* webpackChunkName: "about" */ '@/views/habit/HabitList.vue'),
      beforeEnter: authCheck,
      meta: {
        middleware: globalMiddleware,
        title: routerPaths.Habits.title
      }
    },
    {
      path: '/todayshabits',
      name: routerPaths.TodaysHabits.name,
      component: () => import(/* webpackChunkName: "about" */ '@/views/habit/TodaysHabits.vue'),
      beforeEnter: authCheck,
      meta: {
        middleware: globalMiddleware,
        title: routerPaths.TodaysHabits.title
      }
    },
    {
      path: '/archivedhabits',
      name: routerPaths.ArchivedHabitList.name,
      component: () => import(/* webpackChunkName: "about" */ '@/views/habit/ArchivedHabitList.vue'),
      beforeEnter: authCheck,
      meta: {
        middleware: globalMiddleware,
        title: routerPaths.ArchivedHabitList.title
      }
    },
    {
      path: '/about',
      name: routerPaths.About.name,
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '@/views/old/About.vue')
    },
    {
      path: '/user/home',
      name: routerPaths.UserHome.name,
      component: () => import(/* webpackChunkName: "about" */ '@/views/user/home.vue'),
      beforeEnter: authCheck,
      meta: {
        middleware: globalMiddleware,
        title: routerPaths.UserHome.title
      }
    },
    {
      path: '/404',
      name: routerPaths.NotFound404.name,
      component: () => import(/* webpackChunkName: "about" */ '@/views/oAccess/404.vue'),
      meta: {
        middleware: globalMiddleware,
        title: routerPaths.NotFound404.title
      }
    },
    {
      path: '/user/settings',
      name: routerPaths.UserSettings.name,
      component: () => import(/* webpackChunkName: "about" */ '@/views/user/settings.vue'),
      beforeEnter: authCheck,
      meta: {
        middleware: globalMiddleware,
        title: routerPaths.UserSettings.title
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
  // console.log({ name: to.name })
  // console.log({ routerPaths })
  // if (!(to.name in routerPaths)) {
  //   next({ path: '/404' })
  // }
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
