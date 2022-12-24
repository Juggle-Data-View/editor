import { useEffect } from "react";
import { useFormikContext } from "formik";
import useDebounce from "hooks/useDebounce";

interface IProps {
	/** debounce 时间，单位：毫秒 */
	debounceMs?: number;
}

/**
 * 表单触发修改时自动提交表单
 */
export const AutoSubmit = ({ debounceMs }: IProps) => {
	const formik = useFormikContext();
	const { values, submitForm, setSubmitting } = formik;
	const debounceValues = useDebounce(values, 300); // 低于300时会引起 switch 动效卡顿

	useEffect(() => {
		if (!formik.dirty && formik.isSubmitting) {
			return;
		}
		/**
		 * ⚠️ 注意：
		 * 表单提交是异步操作，频繁触发`setFieldValue`时，需要将`isSubmitting`作为`useEffect`的依赖传入，
		 * 否则会出现`setFieldValue`失效的问题。
		 */
		submitForm().then(() => {
			setSubmitting(false);
		});
	}, [debounceValues]); // eslint-disable-line

	return null;
};
