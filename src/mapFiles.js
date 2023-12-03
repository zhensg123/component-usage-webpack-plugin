const { statisticJsComponentUsage, statisticVueComponentUsage } = require('./statistic/statisticComponentUsage');
const { statisticJsFileComponentUsage, statisticVueFileComponentUsage } = require('./statistic/statisticFileComponentUsage');
const statisticFileLineCount = require('./statistic/statisticFileLineCount');
const statisticFileName = require('./statistic/statisticFileName');

function collectFileInfo(statswp, module){
    const {fileLineCount, fileName} = statswp.stats

    statswp.stats.fileLineCount = {
        ...fileLineCount,
        ...statisticFileLineCount(module)
    }
    statswp.stats.fileName = [
        ...fileName,
        ...statisticFileName(module)
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