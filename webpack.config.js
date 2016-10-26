var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    devtool: 'source-map',
    entry: __dirname + '/src/app/components/app.pages.js',
    output: {
        filename: '[name].bundle.js?[hash]',
        publicPath: '/dist/',
        path: path.join(__dirname, 'dist'),
        chunkFilename: "[id].bundle.js?[hash]"
    },

    module: {
        loaders: [
            { test: /\.js$/, exclude: [/node_modules/, /bower_components/], loader: 'babel',query: {cacheDirectory: true}},
            { test: /\.scss$/, loader: 'style!css!sass' },
            { test: /\.css$/, loader: 'style!css' },
            { test: /\.(woff|svg|eot|ttf)\??.*$/, loader: 'url-loader?limit=10000&name=library/fonts/[name].[ext]' }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/app/index.html',
            inject: 'body',
            hash: true
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function (module, count) {
                return module.resource && module.resource.indexOf(path.resolve(__dirname, 'src')) === - 1;
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: false,
            compress: {
                warnings: false
            },
            mangle: {
                except: ['$super', 'React', 'exports', 'require', 'ReactDOM']
            }
        })
    ],
    devServer: {
        contentBase: './',
        host: 'localhost',
        port: 9090, //默认9090
        inline: true, //可以监控js变化
        hot: true //热启动
    }
};