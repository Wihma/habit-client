import Api from '@/services/Api'

export const userService = {
  login (email, password) {
    return Api().post('user/login', { email: email, password: password })
      .then(handleResponse)

      .catch((err) => {
        // return {status: 401, message: 'login failed'}
        return Promise.reject(err)
      })
  }
}

function handleResponse (res) {
  let data
  let response
  if (res.status) {
    data = res.data
    response = res
  } else {
    data = res.response.data
    response = res.response
  }
  if (!(response.status === 200 && response.statusText === 'OK')) {
    if (response.status === 401) {

    }
    const error = (data && data.message) || response.statusText
    return Promise.reject(error)
  }
  return Promise.resolve(data)
}
