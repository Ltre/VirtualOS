var path = require('path')
var webpack = require('webpack')

module.exports = {
    entry: {
        'ph-test-dist': './res-dev/proxy-http/ph-test.js'
    },
    output: {
        path: path.join(__dirname, 'res-dist'),
        filename: '[name].js'
    },
    module: {
        loaders: [
            /*{
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['es2015']
                }
            },*/
            {
                loader: 'babel-loader',
                exclude: /node_modules/,
                test: /\.js$/,
                query: {
                    presets: ['es2015'],
                }
            },
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        })
    ]
}
