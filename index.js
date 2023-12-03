
const { mapJsFiles, mapVueFiles } = require('./src/mapFiles')
const server = require('./src/server')
const { objArrSort } = require('./src/util')
const webpack = require('webpack');
const NormalModule = webpack.NormalModule;

const initStatsMetric = function () {
    return {
        componentUsage: {}, // 统计UI 组件使用情况
        fileComponentUsage: {},// 统计每个文件组件使用情况
        fileLineCount: {},// 统计文件行数
        fileName: [] //统计文件名
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
    switchCaseFile(module) {
        if (this.id === 0) {
            const { fileTypes } = this.options
            const resource = module.resource
            if(resource.indexOf('node_modules') !== -1){
              return false
            }
            switch (fileTypes) {
                // 处理.vue文件
                case 'vue':
                    if (/\.vue$/.test(resource)) {
                        mapVueFiles(this, module);
                    }
                    break;
                // 处理vue和js文件
                case 'all':
                    if (/\.js$/.test(resource)) {
                        mapJsFiles(this, module);
                    }
                    if (/\.vue$/.test(resource)) {
                        mapVueFiles(this, module);
                    }
                    break;
                // 处理.jsx文件 
            }
        }
    }
    apply(compiler) {
        console.log('\n正在分析文件...\n')
        compiler.hooks.compilation.tap('StatisticsWebpackPlugin', (compilation) => {
            if (NormalModule && NormalModule.getCompilationHooks && compilation instanceof webpack.Compilation) {
                // Webpack 5
                NormalModule.getCompilationHooks(compilation).loader.tap('StatisticsWebpackPlugin', (loaderContext, module) => {
                    this.switchCaseFile(module)
                });
            } else {
                // Webpack 4
                compilation.hooks.normalModuleLoader.tap('StatisticsWebpackPlugin', (loaderContext, module) => {
                    this.switchCaseFile(module)
                });
            }
        })

        compiler.hooks.done.tap('StatisticsWebpackPlugin', (stats) => {
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
