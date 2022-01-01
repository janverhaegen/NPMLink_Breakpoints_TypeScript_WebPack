const path = require("path");

module.exports = {
    mode: "development",
    target: "node",
    entry: "./src/mygreetings.ts",
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",                
            },
        ],
    },
    resolve: {
        extensions: [".ts"],
    },
    output: {
        libraryTarget: "commonjs",
        path: path.resolve(__dirname, "./dist"),
        filename: "bundle.js",        
        devtoolModuleFilenameTemplate: function (info) {
            return path.relative(path.resolve(__dirname, './dist'), info.absoluteResourcePath);
        },
    },
};
