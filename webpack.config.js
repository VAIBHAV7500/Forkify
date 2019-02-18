const path = require('path');
module.exports = {
    entry : ['babel-polyfill','./javascript/script.js'],
    output:
    {
        path: path.resolve(__dirname,'./'),
        filename: './javascript/bundle.js'
    },
    devServer:
    {
        contentBase: './' 
    },
    module:
    {
        rules:
        [
            {
                test: /.js$/,
                exclude: /node_modules/,
                use:
                {
                    loader:'babel-loader'
                }
            }
        ]
    }
}