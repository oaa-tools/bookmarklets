var path = require("path");
var webpack = require("webpack");

module.exports = {
  entry: {
    forms:     "./forms.js",
    headings:  "./headings.js",
    landmarks: "./landmarks.js",
    lists:     "./lists.js"
  },
  output: {
    path: path.join(__dirname, "build"),
    filename: "[name].js"
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel" }
    ]
  }
};
