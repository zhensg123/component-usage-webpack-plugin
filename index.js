// componentUsageWebpackPlugin.js
const fs = require('fs')
const path = require('path')
const express = require('express')
const ejs = require('ejs')
const vuecompiler = require('vue-template-compiler')
const opn = require('opn');
class componentUsageWebpackPlugin {
  constructor (options) {
    this.regex = options.regex
  }

  apply (compiler) {
    const stats = {}

    compiler.hooks.compilation.tap('componentUsageWebpackPlugin', (compilation) => {
      compilation.hooks.normalModuleLoader.tap('componentUsageWebpackPlugin', (loaderContext, module) => {
        // 只处理.vue文件
        if (module.resource && module.resource.endsWith('.vue')) {
        //   const source = module._source && module._source._value
        // const source = module._source && module._source.source();
          const source = fs.readFileSync(module.userRequest, 'utf-8')
          //   console.log('source: ' + source, 'source')

          if (source) {
            // console.log(vuecompiler.parseComponent, vuecompiler.parseComponent(source), 'template')

            // 使用vue-template-compiler解析.vue文件的<template>部分
            const { template } = vuecompiler.parseComponent(source)

            if (template && template.content) {
              // 使用正则表达式查找所有以'el-'开头的Element UI组件
            //   const regex = /<(el-[a-z-]+)/g
              let match
              while ((match = this.regex.exec(template.content)) !== null) {
                console.log(match, 'mase')
                const componentName = match[1]
                stats[componentName] = (stats[componentName] || 0) + 1
              }
            }
          }
        }
      })
    })

    compiler.hooks.done.tap('componentUsageWebpackPlugin', () => {
      const statsArray = Object.entries(stats).sort((a, b) => b[1] - a[1]);
      // 将统计结果写入到一个JSON文件中
      const statsFile = path.resolve(__dirname, 'stats.json')
      fs.writeFileSync(statsFile, JSON.stringify(statsArray))

      // 启动一个服务器来显示统计结果
      const app = express()
      app.set('view engine', 'ejs')
      app.set('views', path.resolve(__dirname, 'views')); // 设置视图目录
      app.use(express.static(path.resolve(__dirname, 'public'))); // 托管静态文件
      app.get('/', (req, res) => {
        res.render('stats', { stats: statsArray })
      })
      app.listen(3006, () => {
        console.log('Server is running at http://localhost:3006')
        opn('http://localhost:3006')
      })
    })
  }
}

module.exports = componentUsageWebpackPlugin
