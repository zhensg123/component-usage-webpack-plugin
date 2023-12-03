const fs = require('fs')
const path = require('path')

module.exports = function statisticFileLineCount(module){
    const data = {}
    const relativePath = path.relative(process.cwd(), module.userRequest);
    const source = fs.readFileSync(module.userRequest, 'utf-8');
    // 计算文件的行数
    data[relativePath] = (source && source.split('\n')) ? source.split('\n').length : 0
    return data
}