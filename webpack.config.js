const path = require("path");

module.exports = {
  entry: {
    homeChat: "./frontend/homeChat.js",
    gameSocket: "./frontend/gameSocket.js",
  },
  output: {
    path: path.join(__dirname, "backend", "static", "scripts"),
    publicPath: "/backend/static/scripts",
    filename: '[name].bundle.js',
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: { loader: "babel-loader" },
      },
    ],
  },
};