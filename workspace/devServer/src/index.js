const fs = require("fs/promises");
const webpack = require("webpack");
const path = require("path");
const childProcess = require("child_process");
// const WebpackDevServer = require("webpack-dev-server");

const basePath = process.cwd();

/**
 *
 * @param {{
 *  port: number;
 *  path: string;
 * }} compServer
 */
const compiler = async (compServer) => {
	const { path: relativePath, port } = compServer;
	const compPath = path.join(basePath, relativePath);
	// const config = require(path.join(compPath, "webpack.config.js"));
	// process.chdir(compPath);
	// return new Promise((res)=>{webpack(config({ port, mode: "development" }), res);})
	console.log(compPath);
	process.chdir(compPath);
	return new Promise((res, rej) => {
		childProcess.exec(`PORT=${port} pnpm dev`, (err, stdout, stderr) => {
			if (err) rej(err);
      debugger;
			res({ stdout, stderr });
		});
	});
};

const runCore = async () => {
	return new Promise((res, rej) => {
		process.chdir(path.resolve("../../core"));
		childProcess.exec("pnpm start", (err) => {
			if (err) rej(err);
			res();
		});
	});
};

const main = async () => {
	try {
		const compsServer = JSON.parse((await fs.readFile("./comps-server.json")).toString());
		await compiler(compsServer.echarts);
		await runCore();
	} catch (error) {}
};
main();
