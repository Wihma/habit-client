// vue.config.js
module.exports = {
  // options...
  chainWebpack: config => {
  config.module.rule('eslint').use('eslint-loader').options({
    fix: true
  })
}
}