var WebpackNotifierPlugin = require('webpack-notifier');

module.exports = {
  entry: ['./src/index.js'],
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
      // {
      //   test: /sinon/,
      //   loader: 'imports?define=>false,require=>false',
      //   exclude: /node_modules/,
      // },
    ],
  },
  plugins: [
    new WebpackNotifierPlugin(),
  ],
};
