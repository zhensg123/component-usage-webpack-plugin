
const fs = require('fs')
const path = require('path')

const { parse } = require('@vue/compiler-sfc');

exports.statisticJsFileComponentUsage = function (statswp, module) {
    const data = {}
    const source = fs.readFileSync(module.resource, 'utf-8');
    // 使用正则表达式查找所有的UI组件
    const relativePath = path.relative(process.cwd(), module.resource);
    if (!data[relativePath]) {
        data[relativePath] = {};
    }
    let match;
    while ((match = statswp.options.regex.exec(source)) !== null) {

        const componentName = match[1];
        data[relativePath][componentName] = (data[relativePath][componentName] || 0) + 1;

    }
    return data

}

exports.statisticVueFileComponentUsage = function (statswp, module) {
    const data = {}
    const source = fs.readFileSync(module.userRequest, 'utf-8');

    // 尝试使用@vue/compiler-sfc解析.vue文件
    const { descriptor } = parse(source);
    let templateContent = descriptor && descriptor.template && descriptor.template.content;
    const relativePath = path.relative(process.cwd(), module.userRequest);
    if (!data[relativePath]) {
        data[relativePath] = {};
    }
    let match;
    while ((match = statswp.options.regex.exec(templateContent)) !== null) {
        const componentName = match[1];
        data[relativePath][componentName] = (data[relativePath][componentName] || 0) + 1;
    }
    return data
}