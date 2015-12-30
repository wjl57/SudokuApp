var path = require('path');
var config = {
    entry: path.resolve(__dirname, 'app/app.js'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
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
