const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common");

module.exports = merge(common, {
  mode: "development",
  devtool: "source-map",
  devServer: {
    static: {
      directory: path.resolve(__dirname, "public")
    },
    client: {
      progress: true
    },
    watchFiles: [
      "src/**/*",
      "public/**/*"
    ],
    hot: true,
    port: 8090
  }
});
