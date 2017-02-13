module.exports = {
  entry: './public/src/app.js',
  output: {
    path: 'public/js/',
    publicPath: '/js/',
    filename: 'bundle.js'
  },
  module: {
    rules: [{
      test: /\.scss$/,
      use: [{
        loader: "style-loader"
      }, {
        loader: "css-loader"
      }, {
        loader: "sass-loader",
      }]
    }]
  }
};
