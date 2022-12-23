/**
 * Dynamic import components and package in runtime. Support cjs.
 */

const generateInjectionParam = (option: Record<string, any>) => {
	// simulate cjs basic env

	const optionKeys = ["module", "export"].concat(Object.keys(option));
	return [optionKeys, optionKeys.map((key) => option[key])];
};

/**
 *
 * @param url module path
 * @param option inject params
 */
const dynamicImport = async (url: string, option: Record<string, any>) => {
	try {
		//simulate cjs require env
		const sandbox = {
			module: {
				export: null,
			},
		};
		const [params, paramValue] = generateInjectionParam(option);
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
		const module = new Function(...params, funcBody);
		return module(sandbox.module, sandbox.module.export, ...paramValue);
	} catch (error) {
		error instanceof Error && console.error("module not found", error.message);
		return null;
	}
};

export default dynamicImport;
