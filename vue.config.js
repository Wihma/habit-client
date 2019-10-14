// vue.config.js
module.exports = {
  chainWebpack: config => {
    config.module.rule('eslint').use('eslint-loader').options({
      fix: true
    })
  },

  configureWebpack: {
    devtool: 'source-map'
  },

  runtimeCompiler: true
}
