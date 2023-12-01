const fs = require('fs')
const path = require('path')

const skey = 'fileLineCount'
module.exports = function statisticFileLineCount(module, statistics){
    if(!statistics[skey]){
        statistics[skey] = {}
    }
    const relativePath = path.relative(process.cwd(), module.userRequest);
    const source = fs.readFileSync(module.userRequest, 'utf-8');
    // 计算文件的行数
    statistics[skey][relativePath] = (source && source.split('\n')) ? source.split('\n').length : 0
}