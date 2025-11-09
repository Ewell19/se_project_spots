const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
let CopyWebpackPlugin;
try {
  CopyWebpackPlugin = require("copy-webpack-plugin");
} catch (err) {
  // If the plugin isn't installed, we won't fail the config load here.
  // Recommend installing it with: npm install --save-dev copy-webpack-plugin
  CopyWebpackPlugin = null;
  console.warn(
    "CopyWebpackPlugin not found — static assets will not be copied. Run 'npm i -D copy-webpack-plugin' to enable it."
  );
}

module.exports = {
  entry: {
    main: "./src/pages/index.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "scripts/[name].[contenthash].js",
    publicPath: "/",
  },

  mode: "development",
  devtool: "inline-source-map",
  stats: "errors-only",
  devServer: {
    // Serve built files from `dist` and also serve images directly from `src/images`
    // during development so image assets are available even if CopyWebpackPlugin
    // didn't run or files are served from memory.
    static: [
      { directory: path.resolve(__dirname, "./dist") },
      { directory: path.resolve(__dirname, "./src/images") },
    ],
    compress: true,
    port: 8080,
    open: true,
    liveReload: true,
    hot: false,
  },
  target: ["web", "es5"],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: "/node_modules/",
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
            },
          },
          "postcss-loader",
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|webp|gif)$/,
        type: "asset/resource",
        generator: {
          filename: "images/[name].[contenthash][ext]",
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/,
        type: "asset/resource",
        generator: {
          filename: "fonts/[name].[contenthash][ext]",
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "styles/[name].[contenthash].css",
    }),
    ...(CopyWebpackPlugin
      ? [
          new CopyWebpackPlugin({
            patterns: [
              { from: path.resolve(__dirname, "src/images"), to: "images" },
              {
                from: path.resolve(__dirname, "src/vendor/fonts"),
                to: "fonts",
              },
              {
                from: path.resolve(__dirname, "favicon.ico"),
                to: "favicon.ico",
              },
            ],
          }),
        ]
      : []),
  ],
};
