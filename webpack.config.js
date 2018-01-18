const path = require('path')

module.exports = {
    entry: "./src/app.js",
    output: {
        filename: "ggj.js",
        path: path.resolve(__dirname, 'public')
    },
    devServer: {
        contentBase: './public'
    },
    module: {
        loaders: [
            {
                test: /\.js$/i,
                exclude: /node_modules/,
                loader: "babel-loader",
                query: {
                    presets: "es2015"
                }
            }
        ]
    }
};

