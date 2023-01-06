import { useState, useEffect } from "react";
import styled from "styled-components";
import { TextField, InputBaseComponentProps } from "@mui/material";
import { AnglePicker } from "react-linear-gradient-picker";
import { withField } from "./withField";
import useDebounce from "../hooks/useDebounce";

const Container = styled.div`
	display: flex;
	align-items: center;
	.input {
		margin-right: 10px;
	}
`;

interface IAngle {
	size?: number;
	withInput?: boolean;
	inputProps?: InputBaseComponentProps;
}

export const Angle = withField<IAngle>((props) => {
	const { field, form, size = 30, withInput, inputProps } = props;
	const [angle, setAngle] = useState(field.value);
	const debounceAngle = useDebounce(angle, 100);

	useEffect(() => {
		form.setFieldValue(field.name, debounceAngle);
		form.setFieldTouched(field.name, true);
	}, [debounceAngle]); // eslint-disable-line

	return (
		<Container>
			{withInput ? <TextField className="input" inputProps={{ ...inputProps }} type="number" value={angle} onBlur={(e) => setAngle(Number(e.currentTarget.value))} /> : null}
			<AnglePicker angle={angle} setAngle={setAngle} size={size} />
		</Container>
	);
});
