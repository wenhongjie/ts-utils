const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WebpackProgressBar = require('webpack-progress-bar')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const ip_v4 = require('internal-ip').v4.sync()
const port = 3000
const host = '0.0.0.0'
require('colors')
module.exports = {
  devtool: 'eval-source-map',

  entry: './demo/index.js',

  mode: 'development',

  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader'
      }
    ]
  },

  resolve: {
    extensions: ['.ts', '.js']
  },

  plugins: [
    new webpack.NamedModulesPlugin(), // 用于启动 HMR 时可以显示模块的相对路径
    new webpack.HotModuleReplacementPlugin(), // 模块热替换
    new HtmlWebpackPlugin({
      template: './demo/index.html'
    }),
    new WebpackProgressBar(),
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: [
          '你的应用正在运行中...'.grey,
          '本地访问地址:'.cyan + '                ' + `http://localhost:${port}`.underline.green,
          '公共访问地址:'.cyan + '                ' + `http://${ip_v4}:${port}`.underline.magenta
        ]
      },
      clearConsole: true
    })
  ],

  devServer: {
    hot: true,
    stats: 'errors-only',
    port,
    host,
    quiet: true,                              // 控制台无输出
    clientLogLevel: "none",                   // 阻止浏览器控制台消息刷新
  }
}