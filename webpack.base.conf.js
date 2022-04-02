const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const copyWebpackPlugin = require('copy-webpack-plugin');
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// для многостраничной верстки
let htmlPageNames = [];
const fs = require('fs');
const PATHS = {
    src: path.join(__dirname, './src'),
    dist: path.join(__dirname, './dist'),
    assets: 'assets/' 
}
const pages = fs.readdirSync('./src/html/');
pages.forEach(item => {
    let res = item.split('.');
    htmlPageNames.push(res);
});

let multipleHtmlPlugins = htmlPageNames.map(name => {
    return new HtmlWebpackPlugin({
      template: `${PATHS.src}/html/${name[0]}.${name[1]}`, // relative path to the HTML files
      filename: `${name[0]}.html`, // output HTML files
    //   chunks: [`${name}`] // respective JS files
    })
  });
module.exports = {
    externals: {
        paths: PATHS
    },
    entry: {
        app:  path.resolve(__dirname, PATHS.src)
    },
    output: {
        filename: `${PATHS.assets}js/[name].js`,//автоматически возьмет имя из entry,
        path: path.resolve(__dirname, PATHS.dist),
    },
    stats: {
        children: true,
      },
    optimization: {
        splitChunks: {
            cacheGroups: {
                defaultVendors: {
                    filename: `${PATHS.assets}js/vendors.js`,
                    test: /node_modules/,
                    chunks: 'all',
                }
            }
        }
    },   
    module: {
        rules: [
            //javascript
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,//исключить файлы из этой папки
                use: ['babel-loader']
            },
            // pug
            {
                test: /\.pug$/,
                loader: '@webdiscus/pug-loader',
              },
            {//обработка изображений
                test: /\.(png|jpg|jpeg|webp|svg|gif)$/,
                use: [
                    {
                          loader: 'file-loader',
                          options: {
                            name: `${PATHS.assets}img/[name].[ext]`,
                            esModule: false
                          }
                        }
                  ],
            },
            {//обработка шрифтов
                test: /\.(woff(2)?|ttf|eot|svg)$/,
                loader: 'file-loader',
                options: {
                    name: `[name].[ext]`,
                    outputPath: `${PATHS.assets}fonts/`
                }
            },
            // css|scss
            {
                test: /\.(scss|css)$/,
                use: [
                "style-loader", 
                MiniCssExtractPlugin.loader,
                {
                    loader: 'css-loader',
                    options: {
                        modules: {
                            mode: 'global'
                        },
                        esModule: false,
                        sourceMap: true
                    }
                },
                {
                 loader: 'postcss-loader',
                 options: 
                    { 
                        sourceMap: true 
                    }
                }, 
                {
                 loader: 'sass-loader',
                 options: 
                    { 
                        sourceMap: true 
                    }
                },                 
            ],    
            },
        ]
    },
    plugins: [
        // new HtmlWebpackPlugin({
        //     //собирает html
        //     template: path.resolve(__dirname, `${PATHS.src}/html/index.html`), // шаблон
        //     filename: `index.html`, // название выходного файла,
        // }),
        new MiniCssExtractPlugin({filename: `${PATHS.assets}css/[name].css`}),//извлекает файлы стилей из js
        new ImageMinimizerPlugin({
            minimizer: {
              implementation: ImageMinimizerPlugin.imageminMinify,
              options: {
                plugins: [
                  ["gifsicle", { interlaced: true }],
                  ["jpegtran", { progressive: true }],
                  ["optipng", { optimizationLevel: 5 }],
                  [
                    "svgo",
                    {
                        name: 'preset-default',
                        params: {
                          overrides: {
                            convertShapeToPath: {
                              convertArcs: true
                            },
                            convertPathData: false
                          }
                        }
                      }
                ]
            ]
                }
            
            }
        }),
        new copyWebpackPlugin(//копирует файлы 
            {
                patterns: [
                    {
                        from: `${PATHS.src}/assets/img`,
                        to: `${PATHS.assets}img`
                    },
                    {
                        from: `${PATHS.src}/assets/fonts`,
                        to: `${PATHS.assets}fonts`
                    },
                    {
                        from: `${PATHS.src}/static`,
                        to: ``
                    },
                ]
            }
        ),
    ].concat(multipleHtmlPlugins),
   
}