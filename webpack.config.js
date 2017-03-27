const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: './public/src/app.js',
  output: {
    path: path.resolve('public/js/'),
    publicPath: '/js/',
    filename: 'bundle.js'
  },
  module: {
    rules: [{
      test: /\.scss$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader', 'sass-loader']
      })
    }, {
      test: /\.(jpe?g|png|gif|svg)$/i,
      use: [{
        loader: 'file-loader',
        query: {
          hash: 'sha512',
          digest: 'hex',
          name: '[hash].[ext]'
        }
      }]
    }]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'style.css',
      disable: false,
      allChunks: true
    })
  ],
  devtool: 'eval-source-map'
};
