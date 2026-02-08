const path = require('path');

const baseConfig = {
    entry: './src/index.js',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                },
            },
        ],
    },
};

module.exports = [
    // UMD Build
    {
        ...baseConfig,
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'index.umd.js',
            library: {
                name: 'HashtagCmsAdmin',
                type: 'umd',
            },
            globalObject: 'this',
        },
    },
    // CommonJS Build
    {
        ...baseConfig,
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'index.js',
            library: {
                type: 'commonjs',
            },
        },
        externals: ['axios', 'secure-ls'], // Don't bundle dependencies in CJS
    },
    // ESM Build
    {
        ...baseConfig,
        experiments: {
            outputModule: true,
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'index.esm.js',
            library: {
                type: 'module',
            },
        },
        externals: ['axios', 'secure-ls'], // Don't bundle dependencies in ESM
    },
];
