const path = require("path");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

/**
 *
 * @param {boolean} isDev
 */
module.exports = () => {
	return {
		mode: "development",
		devServer: {
			hot: true,
			static: path.join(__dirname, "dist"),
			port: 3001,
			liveReload: false,
		},

		plugins: [
			new ReactRefreshWebpackPlugin({
				exclude: [/node_modules/, /bootstrap\.js$/],
			}),
		],
	};
};
