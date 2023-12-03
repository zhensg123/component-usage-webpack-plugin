const path = require('path');

module.exports = {
  entry: './index.js', // 插件源文件的路径
  output: {
    path: path.resolve(__dirname, 'dist'), // 输出目录
    filename: 'index.js', // 输出文件名
    library: 'statsWp', // 指定库的名字，这样在其他地方可以通过这个名字来使用这个插件
    libraryTarget: 'umd', // 指定库的类型，umd表示这个库可以用各种方式引入，包括AMD, CommonJS, 和全局变量
  },
  mode: 'production',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // 使用babel-loader来转译JavaScript代码
        },
      },
    ],
  },
};