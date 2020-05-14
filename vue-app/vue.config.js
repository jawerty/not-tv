const path = require("path");

module.exports = {
  outputDir: path.resolve(__dirname, "../public/dist"),
  filenameHashing: false,
  chainWebpack: config => {
    config.plugins.delete('html')
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')
  }
}