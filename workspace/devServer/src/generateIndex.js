const { readdir } = require("fs/promises");
const { resolve, join } = require("path");

const publicPath = "../../";

const COMP_DIR = [`common`, `dataComp`];

const getDirInternalFiles = async (dirname) => {
	const dirsPath = await readdir(resolve(dirname));

	return dirsPath.reduce(
		(prev, path) => ({
			...prev,
			[path]: join(resolve(dirname), path),
		}),
		{}
	);
};

const generateIndex = async () => {
	return COMP_DIR.reduce(async (prev, curr) => {
		const dirs = await getDirInternalFiles(`${publicPath}${curr}`);
		return {
			...(await prev),
			[curr]: dirs,
		};
	}, {});
};

module.exports = generateIndex;
