var webpack = require('webpack');
var path = require('path');
var { config } = require('dotenv')

config()

module.exports = function(env) {
  var debug = false;
  if(env) {
    debug = !!env.debug;
  }

  var commonPlugins = [
    new webpack.DefinePlugin({
      GLOBAL_LIBS: {
        jQuery: JSON.stringify(true),
        html2canvas: JSON.stringify(true),
        THREE: JSON.stringify(true),
        PDFJS: JSON.stringify(true),// don't set false. It isn't implemented
      },
      ENVIROMENT: {
        debug: JSON.stringify(debug)
      }
    })
  ];

  if(!debug) {
    commonPlugins.push(new webpack.DefinePlugin({
      'process.env.PORT': {
        NODE_ENV: JSON.stringify('production')
      }
    }));
  }

  return {
    context: __dirname,
    devtool: debug ? 'inline-sourcemap' : '',
    entry: ['./index.js'],
    output: {
      path: __dirname,
      filename: 'bundle.js'
    },
    devServer: {
      compress: true,
      port: process.env.PORT || 3000
    },
    module: {
      loaders: [
        {
          test: /\.html$/,
          loader: 'raw-loader'
        },
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel-loader',
          query: {
            presets: [['es2015', {'loose': true}], 'stage-0'],
            plugins: ['transform-class-properties']
          }
        }
      ]
    },
    plugins: debug ? commonPlugins : [
      ...commonPlugins,
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
    ],
  };
}
