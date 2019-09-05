import axios from 'axios'

export default () => {
  return axios.create({
    baseURL: `http://${process.env.API_DOMAIN}:${process.env.API_PORT}/api`
  })
}
