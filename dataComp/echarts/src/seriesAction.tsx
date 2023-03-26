import { JuggleDV } from "@juggle-data-view/types";
import { MenuItem, MenuList, Popover, IconButton } from "@mui/material";
import { ArrayHelpers } from "formik";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
// import notice from '@utils/notice';
import { useRef, useState } from "react";

interface SeriesItem {
	type: "line" | "bar";
	name: string;
}

const SeriesList: SeriesItem[] = [
	{
		type: "line",
		name: "添加折线系列",
	},
	{
		type: "bar",
		name: "添加柱形系列",
	},
];

const SeriesAction: React.FC<{
	defaultValue: any;
	push: ArrayHelpers["push"];
	fieldMapOption: {
		fieldMapPath: string;
		fieldMap: JuggleDV.Field[];
		fieldName: string;
	};
	setValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void;
}> = (props) => {
	const { defaultValue, push, fieldMapOption, setValue } = props;
	const [isOpen, setIsOpen] = useState(false);
	const traggerRef = useRef<any>();
	const getDefaultVal = (defaultValue: any[], type: SeriesItem["type"]) => {
		const result = defaultValue.find((item) => item.type === type);
		if (!result) {
			// notice.error(`${type}系列未在基础配置中找到，请检查基础配置文件`);
			return new Error("添加系列出错,将添加可用系列");
		}
		return result || defaultValue[0];
	};

	const handleClick = (type: SeriesItem["type"]) => {
		const { fieldMap, fieldName, fieldMapPath } = fieldMapOption;
		const data = {
			...getDefaultVal(defaultValue, type),
			name: fieldName,
			FieldName: fieldName,
		};
		const result: any[] = fieldMap.concat([
			{
				sourceFieldName: "",
				compFieldName: fieldName,
			},
		]);
		setValue(fieldMapPath, result);
		push(data);
		setIsOpen(false);
	};

	return (
		<>
			<IconButton ref={traggerRef} onClick={() => setIsOpen(!isOpen)}>
				<AddCircleOutlineIcon />
			</IconButton>
			<Popover
				open={isOpen}
				anchorEl={traggerRef.current}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "left",
				}}
				onClose={() => setIsOpen(false)}
			>
				<MenuList className="" style={{ maxHeight: 240, overflow: "auto" }}>
					{SeriesList.map((item, index) => (
						<MenuItem key={index} onClick={() => handleClick(item.type)}>
							{item.name}
						</MenuItem>
					))}
				</MenuList>
			</Popover>
		</>
	);
};

export default SeriesAction;
