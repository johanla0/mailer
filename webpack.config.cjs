/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */
const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

function generateHtmlPlugins(templateDir) {
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
  return templateFiles.map((item) => {
    const [name, extension] = item.split('.');
    return new HtmlWebpackPlugin({
      filename: `${name}.html`,
      template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
    });
  });
}

const mode = process.env.NODE_ENV || 'development';
const htmlPlugins = generateHtmlPlugins('./src/views');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    assetModuleFilename: 'assets/[hash][ext][query]',
    clean: true,
  },
  devtool: mode === 'development' ? 'inline-source-map' : false,
  performance: {
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              pretty: true,
            },
          },
        ],
      },
      {
        test: /\.(scss)$/,
        use: [
          process.env.NODE_ENV !== 'production'
            ? 'style-loader'
            : MiniCssExtractPlugin.loader,
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
      {
        test: /\.(?:|gif|png|jpg|svg)$/,
        type: 'asset/resource',
        parser: { dataUrlCondition: { maxSize: 15000 } },
      },
    ],
  },
  plugins: [
    ...htmlPlugins,
    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),
  ],
  resolve: {
    fallback: {
      fs: false,
    },
  },
};
