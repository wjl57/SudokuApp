var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin')

var config = {
    entry: path.resolve(__dirname, 'app/app.js'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'index_bundle.js'
    },
    plugins: [new HtmlWebpackPlugin()],
    module: {
        loaders: [{
            test: /\.jsx?$/,
            loader: 'babel',
            query:
            {
                presets:['es2015', 'react']
            }
        }]
    },

};

module.exports = config;
