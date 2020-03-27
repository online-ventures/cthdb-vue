module.exports = {
  pwa: {
    name: 'CTH Stars',
    themeColor: '#A21F4B'
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
