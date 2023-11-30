const { defineConfig } = require('@vue/cli-service')
const StatisticsWebpackPlugin = require('../../index.js');

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [new StatisticsWebpackPlugin()]
  },
})
