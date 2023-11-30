// componentUsageWebpackPlugin.js
const fs = require('fs')
const path = require('path')
const http = require('http')

const express = require('express')
// const ejs = require('ejs')
const vuecompiler = require('vue-template-compiler')
const { parse } = require('@vue/compiler-sfc');
const opn = require('opn');
class componentUsageWebpackPlugin {
    constructor(options) {
        const defaultOptions = {
            regex: /<(el-[a-z-]+)/g
        }
        this.options = Object.assign({}, defaultOptions, options)
    }

    apply(compiler) {
        const stats = {}

        compiler.hooks.compilation.tap('componentUsageWebpackPlugin', (compilation) => {
            compilation.hooks.normalModuleLoader.tap('componentUsageWebpackPlugin', (loaderContext, module) => {

                // 处理.vue文件
                if (module.resource && module.resource.endsWith('.vue')) {
                    const source = fs.readFileSync(module.userRequest, 'utf-8');
                    let templateContent;
                    try {
                        // 尝试使用@vue/compiler-sfc解析.vue文件
                        const { descriptor } = parse(source);
                        templateContent = descriptor.template.content;
                    } catch (error) {
                        // 如果解析失败，使用vue-template-compiler解析.vue文件
                        const { template } = vuecompiler.parseComponent(source);
                        templateContent = template.content;
                    }
                    // 使用正则表达式查找所有的UI组件
                    let match;
                    while ((match = this.regex.exec(templateContent)) !== null) {
                        const componentName = match[1];
                        stats[componentName] = (stats[componentName] || 0) + 1;
                    }
                }
                // 处理.js文件
                else if (module.resource && module.resource.endsWith('.js')) {
                    const source = fs.readFileSync(module.userRequest, 'utf-8');
                    // 使用正则表达式查找所有的UI组件
                    let match;
                    while ((match = this.regex.exec(source)) !== null) {
                        const componentName = match[1];
                        stats[componentName] = (stats[componentName] || 0) + 1;
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
            app.set('views', path.resolve(__dirname, 'views')) // 设置视图目录
            app.use(express.static(path.resolve(__dirname, 'public'))) // 托管静态文件
            app.get('/', (req, res) => {
                res.render('stats', { stats: statsArray })
            })

            let port = 30000
            const server = http.createServer(app)
            server.listen(port)
            server.on('error', (error) => {
                if (error.code === 'EADDRINUSE') {
                    console.log(`Port ${port} is in use, trying another one...`)
                    port++
                    server.close()
                    server.listen(port)
                } else {
                    throw error
                }
            })
            server.on('listening', () => {
                console.log(`Server is running at http://localhost:${port}`)
                opn(`http://localhost:${port}`)
            })
        })
    }
}

module.exports = componentUsageWebpackPlugin
