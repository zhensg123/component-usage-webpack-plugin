const path = require('path')
const fs = require('fs')
const {transferTime} = require('./util')


const skey = 'fileName'

module.exports = function statisticJsFileName(module, statistics) {
    if (!statistics[skey]) {
        statistics[skey] = []
    }
    const fileName = path.basename(module.userRequest)
    // 记录文件名
    let stats = fs.statSync(module.userRequest);

    statistics[skey].push({
        name: fileName,
        size: `${stats.size/1024}KB`,
        mtime: transferTime(stats.mtime)
    });
}
