const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: ['@babel/polyfill', './src/js/index.js'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/bundle.js'
    },
    devServer: {
        contentBase: './dist'
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html'
        })

        
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }, 
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use:['style-loader','css-loader', 'postcss-loader']
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                  // Creates `style` nodes from JS strings
                  'style-loader',
                  // Translates CSS into CommonJS
                  'css-loader',
                  'postcss-loader',
                  // Compiles Sass to CSS
                  'sass-loader',
                ],
              },
              {
                  test: /\.png$/i,
                  use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: './img',
                        esModule: false,
                    }
                }]
              },
              {
                test: /\.(html)$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        attrs: ['img:src', 'link:href']
                    }
                }
            }
        ]
    }
}