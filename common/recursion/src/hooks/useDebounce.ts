import { useEffect, useState } from "react";
import { debounce } from "lodash";

const useDebounce = <T = any>(param: T, delay: number) => {
	const [reactiveParam, setParam] = useState(param);
	useEffect(
		debounce(() => {
			setParam(param);
		}, delay),
		[param]
	);
	return reactiveParam;
};

export default useDebounce;
