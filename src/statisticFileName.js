const path = require('path')
const fs = require('fs')

const skey = 'fileName'

module.exports = function statisticJsFileName(module, statistics) {
    if (!statistics[skey]) {
        statistics[skey] = []
    }
    const fileName = path.basename(module.userRequest)
    // 记录文件名
    let filePath = path.join(__dirname, fileName);
    let stats = fs.statSync(filePath);

    statistics[skey].push({
        name: fileName,
        size: stats.size,
        mtime: stats.mtime
    });
}
