const path = require('path')
const http = require('http')

const express = require('express')
const open = require('open');
const { statisticJsComponentUsage, statisticVueComponentUsage } = require('./src/statisticComponentUsage');
const { statisticJsFileComponentUsage, statisticVueFileComponentUsage } = require('./src/statisticFileComponentUsage');
const statisticFileLineCount = require('./src/statisticFileLineCount');
const statisticFileName = require('./src/statisticFileName');

function mapJsFiles(statwp, module, statistics = {}) {
    if (/\.js$/.test(module.resource)) {
        statisticJsComponentUsage(statwp, module, statistics)
        statisticJsFileComponentUsage(statwp, module, statistics)
        statisticFileLineCount(module, statistics)
        statisticFileName(module, statistics)
    }
}

function mapVueFiles(statwp, module, statistics = {}) {
    if (/\.vue$/.test(module.resource)) {
        statisticVueComponentUsage(statwp, module, statistics)
        statisticVueFileComponentUsage(statwp, module, statistics)
        statisticFileLineCount(module, statistics)
        statisticFileName(module, statistics)
    }
}
class StatisticsWebpackPlugin {
    constructor(options) {
        const defaultOptions = {
            regex: /<(el-[a-z-]+)/g,
            fileTypes: 'vue'
        }
        this.options = Object.assign({}, defaultOptions, options)
    }

    apply(compiler) {
        const statistics = {};
        console.log('\n正在分析文件...\n')
        compiler.hooks.compilation.tap('componentUsageWebpackPlugin', (compilation) => {
            compilation.hooks.normalModuleLoader.tap('componentUsageWebpackPlugin', (loaderContext, module) => {
                const { fileTypes } = this.options
                switch (fileTypes) {
                    // 处理.js文件
                    case 'vue':
                        mapVueFiles(this, module, statistics);
                        break;
                    // 处理vue和js文件
                    case 'all':
                        mapVueFiles(this, module, statistics);
                        mapJsFiles(this, module, statistics);
                        break;
                    // 处理.jsx文件
                }
            })
        })

        compiler.hooks.done.tap('componentUsageWebpackPlugin', () => {
            console.log('\n分析完成，正在生成统计结果...\n')
            // 将统计结果写入到一个JSON文件中
            // const statsFile = path.resolve(__dirname, 'stats.json')
            // fs.writeFileSync(statsFile, JSON.stringify(statsArray))

             // 数据降序排列
            statistics.componentUsage = Object.entries(statistics.componentUsage).sort((a, b) => b[1] - a[1])
            statistics.fileLineCount = Object.entries(statistics.fileLineCount).sort((a, b) => b[1] - a[1])

            // 启动一个服务器来显示统计结果
            const app = express()
            app.set('view engine', 'ejs')
            app.set('views', path.resolve(__dirname, 'views')) // 设置视图目录
            app.use(express.static(path.resolve(__dirname, 'public'))) // 托管静态文件

            app.get('/', (req, res) => {
                res.render('index', { ...statistics });
            });

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
                open(`http://localhost:${port}`)
            })
        })
    }
}

module.exports = StatisticsWebpackPlugin
