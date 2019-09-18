export default function auth ({ next, router }) {
  if (!localStorage.getItem('jwt')) {
    return next('/login')
  }
  return next()
}
