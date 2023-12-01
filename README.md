# statistics-webpack-plugin
statistic project

目前仅支持.vue和.js文件统计

支持vue2和vue3项目

## npm install
```
npm install statistics-webpack-plugin --save-dev
```

## Usage

### 默认统计element-ui组件使用情况

```js
const StatisticsWebpackPlugin = require('statistics-webpack-plugin');

module.exports = {
  plugins: [
    new StatisticsWebpackPlugin()
  ]
}
```

### 统计其他UI组件，统计ant-design组件

```js
const StatisticsWebpackPlugin = require('statistics-webpack-plugin');

module.exports = {
  plugins: [
    new StatisticsWebpackPlugin({
      regex: /<(ant-[a-z\-]+)/g, // Ant Design
    })
  ]
}
```

### 可同时统计多个UI组件

```js
const StatisticsWebpackPlugin = require('statistics-webpack-plugin');

module.exports = {
  plugins: [
    new StatisticsWebpackPlugin({
      regex: /<(ant-[a-z\-]+)/g, // Ant Design
    }),
    new StatisticsWebpackPlugin({
      regex: /<(van-[a-z\-]+)/g, // Vant UI
    })
  ]
}
```

## 参数

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| regex | 正则表达式，用于匹配需要统计的组件 | RegExp | /<(el-[a-z-]+)/g |
| fileTypes | 要统计的文件类型 | String(vue/all) | vue |

## 注意

    1. 组件使用统计只在开发环境下生效,且统计启动时项目可能不会正常启动

