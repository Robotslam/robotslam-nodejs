module.exports = {
  entry: './public/src/app.js',
  output: {
    filename: './public/js/bundle.js'
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
