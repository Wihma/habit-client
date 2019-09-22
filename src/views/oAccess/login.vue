<template>
  <v-content>
    <v-container>
      <v-layout align-center justify-center fill-height>
        <v-card class="mx-auto">
          <v-card-title>Login</v-card-title>
          <div class="pa-2">
            <v-form
              ref="form"
              v-model="valid"
              lazy-validation
              style="min-width: 300px; max-width: 480px; min-height: 200px"
            >
              <v-text-field
                v-model="email"
                :rules="emailRules"
                required
                prepend-icon="email"
                name="email"
                label="Email"
                type="text"
              ></v-text-field>
              <v-text-field
                v-model="password"
                :rules="passwordRules"
                required
                id="password"
                prepend-icon="lock"
                name="password"
                label="Password"
                type="password"
              ></v-text-field>
              <v-alert v-model="loginFailed.status" type="error" dismissible>{{loginFailed.text}}</v-alert>

              <v-btn color="green" absolute right dark @click="login">Login</v-btn>
            </v-form>
          </div>
        </v-card>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
// import AuthService from '@/services/Auth'
export default {
  data: () => ({
    name: '',
    nameRules: [
      v => !!v || 'Name is required',
      v => (v && v.length <= 10) || 'Name must be less than 10 characters'
    ],

    select: null,
    items: ['Item 1', 'Item 2', 'Item 3', 'Item 4'],
    checkbox: false,

    valid: true,
    submitted: false,
    loginFailed: {
      status: false,
      text: ''
    },
    email: '',
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+/.test(v) || 'E-mail must be valid'
    ],
    password: '',
    passwordRules: [
      v => !!v || 'Password is required',
      v => (v && v.length >= 4) || 'Password must be more than 6 characters'
    ]
  }),
  computed: {
    isLoggedIn () {
      return this.$store.getters.isLoggedIn
    }
  },
  methods: {
    resetValidation () {
      this.$refs.form.resetValidation()
    },
    validateForm () {
      return this.$refs.form.validate()
    },
    login () {
      if (!this.validateForm()) {
        return
      }
      this.submitted = true
      this.$store
        .dispatch('login', {
          email: this.email.toLowerCase(),
          password: this.password
        })
        .then(
          res => {
            this.$router.push('/habits')
          },
          err => {
            console.error({ text: 'failed to log in', err: err })
            this.loginFailed.status = true
            this.loginFailed.text = 'Failed to login'
          }
        )
        .catch(() => {
          alert('rejected')
        })
    }
  },
  mounted () {
    var that = this
    window.addEventListener('keyup', function (event) {
      if (event.keyCode === 13) {
        that.validateForm()
      }
    })
  },
  created () {
    console.log(`${process.env.VUE_APP_API_PROTOCOL}${process.env.VUE_APP_API_DOMAIN}${process.env.VUE_APP_API_PORT}/api/`)
    const loggedIn = localStorage.getItem('userjwt')
    if (loggedIn !== null && loggedIn !== null && loggedIn.length > 10) {
      // this.$router.push('habitList');
    }
  }
}
</script>
