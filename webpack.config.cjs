/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackLiveReload = require('html-webpack-live-reload-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  devtool: false,
  target: 'browserslist',
  module: {
    rules: [
      {
        test: /\.ya?ml$/,
        use: 'yaml-loader',
      },
      {
        test: /\.(scss)$/,
        use: [
          {
            // inject CSS to page
            loader: 'style-loader',
          },
          {
            // translates CSS into CommonJS modules
            loader: 'css-loader',
          },
          {
            // Run postcss actions
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'autoprefixer',
                    {
                      // Options
                    },
                  ],
                ],
              },
            },
          },
          {
            // compiles Sass to CSS
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        options: {
          minimize: false,
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new HtmlWebpackLiveReload(),
  ],
  resolve: {
    fallback: {
      fs: false,
    },
  },
};
