import { opendir } from "fs/promises";
import { resolve } from "path";

const COMP_DIR = ["../../common", "../../dataComp"];

const getDirInternalFiles = (dirname: string) => {
	return opendir(resolve(dirname));
};

const generateIndex = async () => {
	return await Promise.all(COMP_DIR.map(getDirInternalFiles));
};
