const fs = require('fs')

const vuecompiler = require('vue-template-compiler')
const { parse } = require('@vue/compiler-sfc');
const skey = 'componentUsage'
exports.statisticJsComponentUsage = function (statwp, module, statistics) {
    if (!statistics[skey]) {
        statistics[skey] = {};
    }
    const source = fs.readFileSync(module.userRequest, 'utf-8');
    let match;
    while ((match = statwp.options.regex.exec(source)) !== null) {
        const componentName = match[1];
        statistics[skey][componentName] = (statistics[skey][componentName] || 0) + 1;

    }
}

exports.statisticVueComponentUsage = function (statwp, module, statistics) {
    if (!statistics[skey]) {
        statistics[skey] = {};
    }
    const source = fs.readFileSync(module.userRequest, 'utf-8');
    let templateContent;
    try {

        // 如果解析失败，使用vue-template-compiler解析.vue文件
        const { template } = vuecompiler.parseComponent(source);
        templateContent = template && template.content;
    } catch (error) {
        // 尝试使用@vue/compiler-sfc解析.vue文件
        const { descriptor } = parse(source);
        templateContent = descriptor && descriptor.template && descriptor.template.content;
    }
    if (!statistics[skey]) {
        statistics[skey] = {};
    }
    let match;
    while ((match = statwp.options.regex.exec(templateContent)) !== null) {
        const componentName = match[1];
        statistics[skey][componentName] = (statistics[skey][componentName] || 0) + 1;
    }
}