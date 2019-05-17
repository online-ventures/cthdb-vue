module.exports = {
  pwa: {
    name: 'CTH Stars',
    themeColor: '#A21F4B'
  },

  css: {
    loaderOptions: {
      sass: {
        data: '\n          @import "@/scss/_variables.scss";\n        '
      }
    }
  },

  publicPath: undefined,
  outputDir: undefined,
  assetsDir: 'assets',
  runtimeCompiler: undefined,
  productionSourceMap: undefined,
  parallel: undefined
}
