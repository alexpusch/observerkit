var WebpackNotifierPlugin = require('webpack-notifier');

module.exports = {
  entry: ['babel-polyfill', './src/index.js'],
  output: {
    path: 'dist',
    filename: 'observerkit.js',
    libraryTarget: 'umd',
  },
  module: {
    loaders: [{
        test: /.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015'],
        },
      },
    ],
  },
  plugins: [
    new WebpackNotifierPlugin(),
  ],
};
