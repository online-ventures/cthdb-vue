module.exports = {
  pwa: {
    name: 'AllStar',
    themeColor: '#A21F4B',
    workboxOptions: {
      skipWaiting: true
    }
  },

  css: {
    loaderOptions: {
      sass: {
        data: ''
      }
    }
  },

  devServer: {
    host: 'localhost',
    port: 8082
  },

  outputDir: undefined,
  assetsDir: 'assets',
  runtimeCompiler: undefined,
  productionSourceMap: undefined,
  parallel: undefined
}
