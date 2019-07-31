const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

module.exports = {
  devtool: 'eval-source-map',

  entry: './demo/index.ts',

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
    new HtmlWebpackPlugin()
  ],

  devServer: {
    hot: true,
    stats: {
      colors: true
    }
  }
}