/**
 * Dynamic import components and package in runtime. Support cjs.
 */

import { useEffect, useState } from "react";

/**
 *
 * @param url module path
 * @param option inject params
 */
const fetchModuleFile = async (url: string) => {
	try {
		//simulate cjs require env

		const res = await fetch(url);
		if (!res.ok) {
			throw new Error("load module error");
		}
		if (!res.body) {
			throw new Error("module was empty");
		}
		const funcBody = (await res.body.getReader().read()).value?.toString();
		if (!funcBody) {
			throw new Error("module was empty");
		}
		return funcBody;
	} catch (error) {
		error instanceof Error && console.error("module not found", error.message);
		return null;
	}
};

const useDynamicImport = (param: { url: string; option: Record<string, any>; version: string }) => {
	const { url, version } = param;
	const [moduleFile, setModuleFile] = useState<Function>();
	useEffect(() => {
		fetchModuleFile(url).then((data) => {
			data && setModuleFile(new Function(data));
		});
	}, [version]);

	return moduleFile;
};

export default useDynamicImport;
