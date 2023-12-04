const { statisticJsComponentUsage, statisticVueComponentUsage } = require('./statistic/statisticComponentUsage');
const { statisticJsFileComponentUsage, statisticVueFileComponentUsage } = require('./statistic/statisticFileComponentUsage');
const statisticFileInfo = require('./statistic/statisticFileInfo');

function collectFileInfo(statswp, module){
    const {fileInfo} = statswp.stats

    statswp.stats.fileInfo = [
        ...fileInfo,
        ...statisticFileInfo(module)
    ]
}
exports.mapJsFiles =  function (statswp, module) {
    const {componentUsage, fileComponentUsage} = statswp.stats
    statswp.stats.componentUsage = {
        ...componentUsage,
        ...statisticJsComponentUsage(statswp, module)
    }
    statswp.stats.fileComponentUsage = {
        ...fileComponentUsage,
        ...statisticJsFileComponentUsage(statswp, module)
    }
    collectFileInfo(module, stats)
}

exports.mapVueFiles = function (statswp, module) {
    const {componentUsage, fileComponentUsage} = statswp.stats

    statswp.stats.componentUsage = {
        ...componentUsage,
        ...statisticVueComponentUsage(statswp, module)
    }
    statswp.stats.fileComponentUsage = {
        ...fileComponentUsage,
        ...statisticVueFileComponentUsage(statswp, module)
    }
    collectFileInfo(statswp, module)

}