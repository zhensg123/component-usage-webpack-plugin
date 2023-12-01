const path = require('path')

const skey = 'fileName'

module.exports = function statisticJsFileName(module, statistics){
    if(!statistics[skey]){
        statistics[skey] = []
    }
    // 记录文件名
    statistics[skey].push(path.basename(module.userRequest));
}
