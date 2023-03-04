const { ModuleFederationPlugin } = require("webpack").container;
const ExternalTemplateRemotesPlugin = require("external-remotes-plugin");
const devConfig = require("./config/webpack.dev.config");
const { merge } = require("webpack-merge");

const webpackConfig = (env) => {
	const isDev = env.NODE_ENV === "development";
	const commonConfig = {
		mode: "production",
		entry: "./src/index",
		devtool: "source-map",
		optimization: {
			minimize: false,
		},
		output: {
			publicPath: "auto",
			clean: true,
			filename: "entry.js",
		},
		module: {
			rules: [
				{
					test: /\.(js|ts|tsx)?$/,
					loader: "babel-loader",
					exclude: /node_modules/,
					options: {
						presets: ["@babel/preset-react"],
						plugins: [require.resolve("react-refresh/babel")],
					},
				},
			],
		},
		plugins: [
			new ModuleFederationPlugin({
				name: "echarts_comp",
				filename: "entry.js",
				exposes: {
					"./Config": "./src/config_base_bar",
				},
				remotes: {
					libs: "libs@[libsUrl]/remoteEntry.js",
				},
			}),
			new ExternalTemplateRemotesPlugin(),
		],
	};

	return isDev ? merge(commonConfig, devConfig()) : commonConfig;
};

module.exports = webpackConfig;
