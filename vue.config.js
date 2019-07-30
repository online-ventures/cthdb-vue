module.exports = {
  pwa: {
    name: 'CTH Stars',
    themeColor: '#A21F4B'
  },

  css: {
    loaderOptions: {
      sass: {
        data: '\n          @import "@/scss/_variables.scss";\n        @import "@/scss/app.scss";\n        '
      }
    }
  },

  devServer: {
    host: 'localhost',
    port: 8081
  },

  outputDir: undefined,
  assetsDir: 'assets',
  runtimeCompiler: undefined,
  productionSourceMap: undefined,
  parallel: undefined
}
