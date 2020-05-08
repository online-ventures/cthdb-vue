const BrotliPlugin = require('brotli-webpack-plugin')
const prod = process.env.NODE_ENV === 'production'

module.exports = {
  pwa: {
    name: 'CTH Stars',
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
  parallel: undefined,

  configureWebpack: {
    plugins: prod ? [
      new BrotliPlugin({
        asset: '[path].br[query]',
        test: /\.(js|css|html|svg)$/,
        threshold: 10240,
        minRatio: 0.8
      })
    ] : []
  },
  chainWebpack: config => {
    config.plugins.delete('prefetch')
    config.plugins.delete('preload')
    if (prod) config.plugin('CompressionPlugin').use(BrotliPlugin)
  }
}
