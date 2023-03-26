const path = require("path");
const webpack = require("webpack");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

const devPlugins = [
	new webpack.HotModuleReplacementPlugin(),
	new webpack.NoEmitOnErrorsPlugin(),

	new ReactRefreshWebpackPlugin({
		overlay: {
			sockIntegration: "whm",
		},
		exclude: [/node_modules/],
	}),
	new OpenBrowserPlugin({ url: "https://dev.local.compass.com:5443/app/deals-platform/deals" }),
];

const clientEntry = path.resolve("./scr/index");

module.exports = {
	entry: {
		whm: "webpack-hot-middleware/client?quiet=true&reload=true&path=/app/deals-platform/__webpack_hmr&timeout=2000",
		reactRefreshEntry: "@pmmmwh/react-refresh-webpack-plugin/client/ReactRefreshEntry.js",
		main: clientEntry,
	},
	target: "web",
	mode: "development",
	devtool: "source-map",
	optimization: {
		minimize: false,
	},
	devServer: {
		hot: true,
		static: path.join(__dirname, "dist"),
		port: 3001,
		liveReload: false,
	},
	output: {
		publicPath: "auto",
		clean: true,
	},
	resolve: {
		react: path.resolve("../node_modules/react"),
		"react-dom": path.resolve("../node_modules/react-dom"),
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				loader: "babel-loader",
				exclude: /node_modules/,
				options: {
					presets: ["@babel/preset-react"],
					plugins: [require.resolve("react-refresh/babel")],
				},
			},
		],
	},
	plugins: devPlugins,
};
