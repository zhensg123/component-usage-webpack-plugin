
const fs = require('fs')
const path = require('path')

const vuecompiler = require('vue-template-compiler')
const { parse } = require('@vue/compiler-sfc');
const skey = 'fileComponentUsage'

exports.statisticJsFileComponentUsage = function (statwp, module, statistics) {
    if (!statistics[skey]) {
        statistics[skey] = {};
    }
    const source = fs.readFileSync(module.resource, 'utf-8');
    // 使用正则表达式查找所有的UI组件
    const relativePath = path.relative(process.cwd(), module.resource);
    if (!statistics[skey][relativePath]) {
        statistics[skey][relativePath] = {};
    }
    let match;
    while ((match = statwp.options.regex.exec(source)) !== null) {

        const componentName = match[1];
        statistics[skey][relativePath][componentName] = (statistics[skey][relativePath][componentName] || 0) + 1;

    }
}

exports.statisticVueFileComponentUsage = function (statwp, module, statistics) {
    if (!statistics[skey]) {
        statistics[skey] = {};
    }
    const source = fs.readFileSync(module.userRequest, 'utf-8');
    let templateContent;
    // try {

    //     // 如果解析失败，使用vue-template-compiler解析.vue文件
    //     const { template } = vuecompiler.parseComponent(source);
    //     templateContent = template && template.content;
    // } catch (error) {
    //     // 尝试使用@vue/compiler-sfc解析.vue文件
    //     const { descriptor } = parse(source);
    //     templateContent = descriptor && descriptor.template && descriptor.template.content;
    // }
    // 尝试使用@vue/compiler-sfc解析.vue文件
    const { descriptor } = parse(source);
    templateContent = descriptor && descriptor.template && descriptor.template.content;
    const relativePath = path.relative(process.cwd(), module.userRequest);
    if (!statistics[skey][relativePath]) {
        statistics[skey][relativePath] = {};
    }
    let match;
    while ((match = statwp.options.regex.exec(templateContent)) !== null) {
        const componentName = match[1];
        statistics[skey][relativePath][componentName] = (statistics[skey][relativePath][componentName] || 0) + 1;
    }
}