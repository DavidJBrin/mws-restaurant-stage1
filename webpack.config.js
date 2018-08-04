const path = require('path');

const config = {
  entry: {
    restaurant_info: './src/js/restaurant_info.js',
    main: './src/js/main.js'
  },
  output: {
    path: path.resolve(__dirname, './dist/js/'),
    filename: '[name].js'
  },
  mode: 'production',
  // devtool: 'source-maps',
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