var path = require("path");

module.exports = {
  entry: {
    forms:       "./forms.js",
    headings:    "./headings.js",
    images:      "./images.js",
    interactive: "./interactive.js",
    landmarks:   "./landmarks.js",
    lists:       "./lists.js"
  },
  output: {
    path: path.join(__dirname, "build"),
    filename: "[name].js"
  },
  module: {
    preLoaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: "eslint-loader" }
    ],
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel" }
    ]
  },
  eslint: {
    quiet: true
  }
};
