
const { mapJsFiles, mapVueFiles } = require('./src/mapFiles')
const server = require('./src/server')
const { objArrSort } = require('./src/util')
const initStatsMetric = function () {
    return {
        componentUsage: {}, // 统计UI 组件使用情况
        fileComponentUsage: {},// 统计UI 组件使用情况
        fileLineCount: {},// 统计UI 组件使用情况
        fileName: [] //统计UI 组件使用情况
    }
}
class StatisticsWebpackPlugin {
    constructor(options) {
        const defaultOptions = {
            regex: /<(el-[a-z-]+)/g,
            fileTypes: 'vue'
        }
        this.options = Object.assign({}, defaultOptions, options)
        this.stats = initStatsMetric()
        this.id = 0
    }

    apply(compiler) {
        console.log('\n正在分析文件...\n')
        compiler.hooks.compilation.tap('componentUsageWebpackPlugin', (compilation) => {
            compilation.hooks.normalModuleLoader.tap('componentUsageWebpackPlugin', (loaderContext, module) => {

                if (this.id === 0) {
                    const { fileTypes } = this.options
                    switch (fileTypes) {
                        // 处理.vue文件
                        case 'vue':
                            if (/\.vue$/.test(module.resource)) {
                                mapVueFiles(this, module);
                            }
                            break;
                        // 处理vue和js文件
                        case 'all':
                            if (/\.js$/.test(module.resource)) {
                                mapJsFiles(this, module);
                            }
                            if (/\.vue$/.test(module.resource)) {
                                mapVueFiles(this, module);
                            }
                            break;
                        // 处理.jsx文件 
                    }
                }
            })
        })

        compiler.hooks.done.tap('componentUsageWebpackPlugin', () => {
            // 将统计结果写入到一个JSON文件中
            // const statsFile = path.resolve(__dirname, 'stats.json')
            // fs.writeFileSync(statsFile, JSON.stringify(statsArray))

            if (this.id === 0) {
                console.log('\n分析完成，正在生成统计结果...\n')
                this.id++
                const { componentUsage, fileLineCount, fileName } = this.stats
                this.stats = {
                    ...this.stats,
                    componentUsage: objArrSort(componentUsage),
                    fileLineCount: objArrSort(fileLineCount),
                    fileName: fileName.sort((a, b) => a.name.localeCompare(b.name))
                }
                server(this)
            }
        })
    }
}

module.exports = StatisticsWebpackPlugin
