const {merge} = require('webpack-merge');
const webpack = require('webpack');
const path = require('path');
const baseWebpackConfig = require('./webpack.base.conf');
const devWebpackConfig = merge(baseWebpackConfig, {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    devServer: {
            // contentBase: baseWebpackConfig.externals.paths.dist,
            port: 'auto',
            static: {
                directory: path.join(__dirname, './src'),
                watch: true,
            },
            compress: true,
            // hot: true,
            liveReload: true,
            client: {
                overlay: {
                    errors: true,
                    warnings: false,
                  },
              },//вывод ошибок на экран сайта
        },
    plugins: [
        new webpack.SourceMapDevToolPlugin({
            filename: '[file].map'
        })
    ]
});
module.exports = new Promise((resolve, reject) => {
    resolve(devWebpackConfig);
})