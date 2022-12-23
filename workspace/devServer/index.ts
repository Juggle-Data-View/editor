import express from "express";
import rl from "readline/promises";
import { readdir } from "fs/promises";
import { resolve } from "path";

const COMP_DIR = ["../../common", "../../dataComp"];

// const getDirInternalFiles = (dirname: string) => {
// 	return readdir(resolve(dirname));
// };

// const generateIndex = async () => {
// 	return await Promise.all(COMP_DIR.map(getDirInternalFiles));
// };

const app = express();

const main = async () => {
	// console.log(await generateIndex());
};
main();
