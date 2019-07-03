const NormalModuleReplacementPlugin = require("webpack").NormalModuleReplacementPlugin;
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: ["./src/renderer.tsx"],

  target: "electron-renderer",

  output: {
    path: __dirname + "/dist",
    filename: "renderer-bundle.js"
  },

  mode: "development",

  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader"
      },
      {
        test: /index.html/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]"
            }
          }
        ]
      },
      {
        test: /main.js/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]"
            }
          }
        ]
      },
      {
        test: /\.node$/,
        use: "node-loader"
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      }
    ]
  },

  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"]
  },

  plugins: [
    new CopyWebpackPlugin([
      "node_modules/gamepad/build/Release/gamepad.node",
      "node_modules/keylib/build/Release/keylib.node"
    ]),
    new NormalModuleReplacementPlugin(
      /^bindings$/,
      `${__dirname}/src/bindings`
    ),
    new MiniCssExtractPlugin({
      filename: "style.css",
      chunkFilename: "[name].css"
    })
  ]
};
