require('dotenv').config();
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const API_KEY=process.env.API_KEY;
const mode = process.env.NODE_ENV;

const config = {
  entry: {
    restaurant_info: './src/js/restaurant_info.js',
    main: './src/js/main.js'
  },
  output: {
    path: path.resolve(__dirname, './dist/js/'),
    filename: '[name].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: '../index.html',
      template: 'src/index.html',
      inject: false,
      minify: (mode === 'production') ? { html5: true, collapseWhitespace: true } : false,
      API_KEY: API_KEY || 'PLEASE_ENTER_YOUR_OWN_KEY_HERE'
    }),
    new HtmlWebpackPlugin({
      filename: '../restaurant.html',
      template: 'src/restaurant.html',
      inject: false,
      minify: (mode === 'production') ? { html5: true, collapseWhitespace: true } : false,
      API_KEY: API_KEY || 'PLEASE_ENTER_YOUR_OWN_KEY_HERE'
    }),
    new webpack.DefinePlugin({
      'MAPBOX_KEY': JSON.stringify(process.env.MAPBOX_KEY) || JSON.stringify('ENTER_YOUR_MAPBOX_KEY_HERE')
    })
  ],
  mode: mode,
  devtool: (mode === 'production') ? false : 'source-maps',
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/,   
        use: [{
          loader: 'babel-loader',
          options: { 
            presets: ['env'] }
        }]
      }
    ]
  }
}

module.exports = config;