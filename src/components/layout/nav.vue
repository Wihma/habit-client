<template>
  <div>
    <v-app-bar dark>
      <v-app-bar-nav-icon v-if="showLogInButton" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title class="headline text-uppercase">
        <span>Vänliga</span>
        <span class="font-weight-light">Vanor</span>
      </v-toolbar-title>

      <div class="flex-grow-1"></div>

      <v-btn v-if="!showLogInButton" @click="login" light>
        <span>Login</span>
      </v-btn>

      <user-icon-popup
        v-if="showLogInButton"
        :username="userName"
        ></user-icon-popup>
    </v-app-bar>
    <v-navigation-drawer
      v-if="drawer"
      v-model="drawer"
      absolute
      v-bind:bottom="isMobile"
      temporary
    >
      <v-list nav dense>
        <v-list-item-group>
          <v-list-item v-for="item in items" :key="item.title" dense nav @click="navigateTo(item)">
            <v-list-item-action>
              <v-icon style="cursor: pointer">{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
// const router = require('@/routers/router');
import UserIconPopup from '@/components/user/userIconPopup'

export default {
  components: {
    'user-icon-popup': UserIconPopup
  },
  data () {
    return {
      drawer: false,
      group: null,
      items: [
        // { title: 'Home', icon: 'dashboard', route: router.routes.find((route) => {return route.name === 'Home' }).path },
        { title: 'Habit List', icon: 'question_answer', route: '/habits' },
        { title: 'Todays Habits', icon: 'today', route: '/todayshabits' },
        { title: 'Templates', icon: 'folder', route: '/templates' },
        { title: 'User Settings', icon: 'settings', route: '/user/settings' },
        { title: 'Archived Habits', icon: 'archive', route: '/archivedhabits' }
      ],
      mini: true,
      right: null
    }
  },
  methods: {
    login () {
      this.$router.push('/login')
    },
    logout () {
      console.log(this.$router)
      this.$router.push('/login')
      // this.$store.dispatch('logout')
    },
    menu () {
      return this.$store.getters.userIconMenuVisibility
    },
    navigateTo (navItem) {
      if (navItem.route !== this.$route.path) {
        this.$router.push(navItem.route)
      }
    }
  },
  computed: {
    showLogInButton () {
      return this.$store.getters.isLoggedIn
    },
    isMobile () {
      return this.$store.getters.isMobile
    },
    userName () {
      return this.$store.getters.getUsername
    }
  },
  watch: {
    group () {
      this.drawer = true
    },
    $route (to, from) {
      this.show = false
    }
  },
  mounted () {
    // check if current route is logged
  }
}
</script>
