const fs = require('fs')

const { parse } = require('@vue/compiler-sfc');
exports.statisticJsComponentUsage = function (statswp, module) {
    const data = {}
    const source = fs.readFileSync(module.resource, 'utf-8');
    let match;
    while ((match = statswp.options.regex.exec(source)) !== null) {
        const componentName = match[1];
        data[componentName] = (data[componentName] || 0) + 1;
    }
    return data
}

exports.statisticVueComponentUsage = function (statswp, module) {
    const data = {}
    const source = fs.readFileSync(module.resource, 'utf-8');
    // 尝试使用@vue/compiler-sfc解析.vue文件
    const { descriptor } = parse(source);
    let templateContent = descriptor && descriptor.template && descriptor.template.content;
    let match;
    while ((match = statswp.options.regex.exec(templateContent)) !== null) {
        const componentName = match[1];
        data[componentName] = (data[componentName] || 0) + 1;
    }
    return data
}