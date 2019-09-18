<template>
  <v-menu
        v-model="menu"
        :close-on-content-click="false"
        :nudge-width="200"
        offset-x
      >
        <template v-slot:activator="{ on }">
          <v-btn
            dark
            icon
            v-on="on"
          >
            <v-icon>person</v-icon>
          </v-btn>
        </template>

        <v-card>
          <v-list>
            <v-list-item>
              <v-list-item-avatar>
                <!-- <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John"> -->
                <router-link to="/user/profile" tag="button">
                  <v-btn
                    fab
                    dark
                    icon
                    small
                    color="green"
                  >
                  <v-icon medium >person</v-icon>
                </v-btn>
                </router-link>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title> {{username}}</v-list-item-title>
              </v-list-item-content>

              <!-- <v-list-item-action>
                <v-btn
                  :class="fav ? 'red--text' : ''"
                  icon
                  @click="fav = !fav"
                >
                  <v-icon>mdi-heart</v-icon>
                </v-btn>
              </v-list-item-action> -->
            </v-list-item>
          </v-list>

          <v-divider></v-divider>

          <!-- <v-list>
            <v-list-item>
              <v-list-item-action>
                <v-switch v-model="message" color="purple"></v-switch>
              </v-list-item-action>
              <v-list-item-title>Enable messages</v-list-item-title>
            </v-list-item>

            <v-list-item>
              <v-list-item-action>
                <v-switch v-model="hints" color="purple"></v-switch>
              </v-list-item-action>
              <v-list-item-title>Enable hints</v-list-item-title>
            </v-list-item>
          </v-list> -->

          <v-card-actions>
            <div class="flex-grow-1"></div>

            <v-btn text @click="menu = false">Cancel</v-btn>
            <v-btn color="primary" text @click="logout">Logout</v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>

  <!-- <v-menu
  v-if="isLoggedIn"
  :close-on-content-click="false"
  :nudge-width="200"
  offset-x
  offset-y
  :openOnClick="openOnClick"
  value
>
  <v-btn

    color="grey lighten-1"
    dark
    icon
  >
   <v-icon>person</v-icon>
  </v-btn>
    <v-card>
      <v-list>
        <v-list-tile avatar>
          <v-list-tile-avatar>
            <router-link to="/user/profile" tag="button">
              <v-btn
                fab
                dark
                icon
                small
                color="green"
              >
              <v-icon medium >person</v-icon>
            </v-btn>
            </router-link>
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title> {{username}}</v-list-tile-title>
          </v-list-tile-content>

          <v-list-tile-action>
            <router-link to="/user/settings" tag="button">
              <v-btn icon>
                <v-icon>settings</v-icon>
              </v-btn>
            </router-link>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>

      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat @click="logout">Logout</v-btn>
      </v-card-actions>
    </v-card>
  </v-menu> -->
</template>

<script>
export default {
  props: {
    username: String
  },
  data: () => ({
    // menu: true
    openOnClick: true,
    fav: true,
    menu: false,
    message: false,
    hints: true
  }),
  methods: {
    logout () {
      this.$store.dispatch('logout')
      this.$router.push('/login')
    }
  },
  computed: {
    isLoggedIn () {
      return this.$store.getters.isLoggedIn
    }
  }
}
</script>

<style>

</style>
