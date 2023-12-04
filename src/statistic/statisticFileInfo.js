const path = require('path')
const fs = require('fs')
const {transferTime} = require('../util')


module.exports = function statisticFileName(module) {
    const data = []
    const fileName = path.basename(module.userRequest)
    const relativePath = path.relative(process.cwd(), module.userRequest);
    const source = fs.readFileSync(module.userRequest, 'utf-8');

    // 记录文件名
    let stats = fs.statSync(module.userRequest);

    data.push({
        name: fileName,
        path: relativePath,
        lineCount: (source && source.split('\n')) ? source.split('\n').length : 0,
        size: `${(stats.size/1024).toFixed(2)}KB`,
        mtime: transferTime(stats.mtime)
    });

    return data
}
