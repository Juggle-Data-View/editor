const path = require("path");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

module.exports = () => {
  console.log('trigger');
  return {
	entry: path.resolve("./src/index.tsx"),
	devtool: "source-map",
	optimization: {
		minimize: false,
	},
	mode: process.env.NODE_ENV || "development",
	devServer: {
		hot: true,
		static: path.join(__dirname, "dist"),
		port: process.env.PORT || 3001,
		liveReload: false,
	},
	output: {
		publicPath: "auto",
		clean: true,
	},
	module: {
		rules: [
			{
				test: /\.(js|ts|tsx)$/,
				loader: "babel-loader",
				exclude: /node_modules/,
				options: {
					presets: ["@babel/preset-react", "@babel/preset-typescript"],
					plugins: [require.resolve("react-refresh/babel")],
				},
			},
		],
	},
	resolve: {
		modules: ["node_modules"],
		extensions: [".ts", ".js", ".tsx"],
		alias: {
			react: path.resolve("../../node_modules/react"),
			"react-dom": path.resolve("../../node_modules/react-dom"),
		},
	},
	plugins: [
		new ReactRefreshWebpackPlugin({
			exclude: [/node_modules/],
			overlay: false,
		}),
	],
	externals: {
		react: "React",
		"react-dom": "ReactDOM",
	},
}};
