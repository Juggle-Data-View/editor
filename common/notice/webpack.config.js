import { Configuration } from "webpack";

/**@type {Configuration} */
const config = {
	entry: "src/index.tsx",
	mode: process.env.production ? "production" : "development",
	devtool: "source-map",
	output: {
		path: "dist",
		filename: "client.js",
	},
	externals: {
		react: "React",
		"react-dom": "ReactDom",
	},
	resolve: {
		extensions: [".tsx", "ts"],
	},
};

module.exports = config;
