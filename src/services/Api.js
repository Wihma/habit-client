import axios from 'axios'

export default () => {
  return axios.create({
    baseURL: `http://${process.env.VUE_APP_API_DOMAIN}${process.env.VUE_APP_API_PORT}/api`
  })
}
