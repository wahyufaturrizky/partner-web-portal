import React, { useState } from "react";
import {
	Button,
	Spacer,
	Modal,
	Row,
	Input,
	Search,
	Dropdown,
	Table,
	Col,
	Pagination,
	ActionButton,
	FileUploaderExcel,
} from "pink-lava-ui";
import styled from "styled-components";
import usePagination from "@lucasmogari/react-pagination";
import UploadFile from "../../assets/upload-file.svg";
import DownloadFile from "../../assets/download-file.svg";
import * as XLSX from "xlsx";
import _ from "lodash";
import * as ExcelJS from "exceljs/dist/exceljs.min.js";


function stringifyNumberSpecial(n) {
	const special = [
		"1st",
		"2nd",
		"3rd",
		"4th",
		"5th",
		"6th",
		"7th",
		"8th",
		"9th",
		"10th",
	];
	return special[n];
}

async function downloadStructure(structure, level) {
	const wb = new ExcelJS.Workbook();
	const ws = wb.addWorksheet("country_structure");
	let columns = [];

	if (level >= 1) columns.push({ header: "1st_level", key: "1", width: 30 });
	if (level >= 2) columns.push({ header: "2nd_level", key: "2", width: 30 });
	if (level >= 3) columns.push({ header: "3rd_level", key: "3", width: 30 });
	if (level >= 4) columns.push({ header: "4th_level", key: "4", width: 30 });
	if (level >= 5) columns.push({ header: "5th_level", key: "5", width: 30 });
	if (level >= 6) columns.push({ header: "6th_level", key: "6", width: 30 });
	if (level >= 7) columns.push({ header: "7th_level", key: "7", width: 30 });
	if (level >= 8) columns.push({ header: "8th_level", key: "8", width: 30 });
	if (level >= 9) columns.push({ header: "9th_level", key: "9", width: 30 });
	if (level >= 10) columns.push({ header: "10th_level", key: "10", width: 30 });

	ws.columns = columns;
	structure.map((structure) => {
		if (level === 1) ws.addRow({ 1: structure["1"] });
		if (level === 2) ws.addRow({ 1: structure["2"], 2: structure["1"] });
		if (level === 3) ws.addRow({ 1: structure["3"], 2: structure["2"], 3: structure["1"] });
		if (level === 4)
			ws.addRow({ 1: structure["4"], 2: structure["3"], 3: structure["2"], 4: structure["1"] });
		if (level === 5)
			ws.addRow({
				1: structure["5"],
				2: structure["4"],
				3: structure["3"],
				4: structure["2"],
				5: structure["1"],
			});
		if (level === 6)
			ws.addRow({
				1: structure["6"],
				2: structure["5"],
				3: structure["4"],
				4: structure["3"],
				5: structure["2"],
				6: structure["1"],
			});
		if (level === 7)
			ws.addRow({
				1: structure["7"],
				2: structure["6"],
				3: structure["5"],
				4: structure["4"],
				5: structure["3"],
				6: structure["2"],
				7: structure["1"],
			});
		if (level === 8)
			ws.addRow({
				1: structure["8"],
				2: structure["7"],
				3: structure["6"],
				4: structure["5"],
				5: structure["4"],
				6: structure["3"],
				7: structure["2"],
				8: structure["1"],
			});
		if (level === 9)
			ws.addRow({
				1: structure["9"],
				2: structure["8"],
				3: structure["7"],
				4: structure["6"],
				5: structure["5"],
				6: structure["4"],
				7: structure["3"],
				8: structure["2"],
				9: structure["1"],
			});
		if (level === 10)
			ws.addRow({
				1: structure["10"],
				2: structure["9"],
				3: structure["8"],
				4: structure["7"],
				5: structure["6"],
				6: structure["5"],
				7: structure["4"],
				8: structure["3"],
				9: structure["2"],
				10: structure["1"],
			});
	});

	const buf = await wb.xlsx.writeBuffer();
	console.log()

	saveAs(new Blob([buf]), `manage_${stringifyNumberSpecial(level-1)}_level.xlsx`);
}

function stringifyNumber(n) {
	const special = [
		"First",
		"Second",
		"Third",
		"Fourth",
		"Fifth",
		"Sixth",
		"Seventh",
		"Eighth",
		"Ninth",
		"Tenth",
	];
	return special[n];
}

export const ModalManageData = ({
	visible,
	onCancel,
	structure,
	parentDataStructure,
	isLoading,
	level,
	onAddToStructure,
	allStructure,
	countryStructure,
}) => {
	const [errors, setErrors] = useState({});
	const [name, setName] = useState();
	const [parent, setParent] = useState(null);
	const [searchParent, setSearchParent] = useState("");
	const [tempAllStructure, setTempAllStructure] = useState(allStructure);
	const [searchTable, setSearchTable] = useState("");

	const onReplaceStructure = () => {
		onAddToStructure(tempAllStructure[level - 1], level);
	};

	const validateRequired = () => {
		const newErrors = _.cloneDeep(errors);
		const isError = false;

		if (!name) {
			newErrors["name"] = "Name is required";
			isError = true;
		}

		if (!parent && level > 1) {
			newErrors["parent"] = "Parent is required";
			isError = true;
		}

		setErrors(newErrors);

		return isError;
	};

	const onAddStructure = () => {
		if (!validateRequired()) {
			const newData = {
				id: self.crypto.randomUUID(),
				name: name,
				parent: parent,
			};

			const newAllStructure = _.cloneDeep(tempAllStructure);
			if (!newAllStructure[level - 1]) {
				newAllStructure[level - 1] = [];
			}
			newAllStructure[level - 1].push(newData);
			setTempAllStructure(newAllStructure);
			setName("");
			setParent(null);
		}
	};

	const updateParentTable = (obj, allArray, level) => {
		if (!obj.parent) return obj;

		const parentArray = allArray[level - 1];
		if (obj.parent) {
			obj.parent = parentArray.find((arr) => arr.id === obj.parent);

			if (obj?.parent?.parent) {
				updateParentTable(obj.parent, allArray, level - 1);
			}
		}
	};

	const mapParent = (array) => {
		let newArray = JSON.parse(JSON.stringify(array));
		let lastArray = newArray[newArray.length - 1];
		lastArray.forEach((obj) => {
			updateParentTable(obj, newArray, newArray.length - 1);
		});

		return newArray[newArray.length - 1];
	};

	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const pagination = usePagination({
		page: 1,
		itemsPerPage: 5,
		maxPageItems: Infinity,
		numbers: true,
		arrows: true,
		totalItems: 100,
	});

	let tableData = [];
	if (tempAllStructure.length > 0 && tempAllStructure.length === level) {
		tableData = mapParent(tempAllStructure).filter((data) =>
			data.name.toLowerCase().includes(searchTable.toLowerCase())
		);
	}
	pagination.totalItems = tableData.length;
	const page = pagination?.page;
	const paginateTableData = tableData?.slice(5 * (page - 1), 5 * page) || [];

	const columns = JSON.parse(JSON.stringify(countryStructure))
		.slice(0, level)
		.reverse()
		.map((country, index) => ({
			title: country.name,
			dataIndex: index + 1,
		}));

	const dataTable = [];
	paginateTableData.forEach((data) => {
		dataTable.push({
			key: data.id,
			1: data.name,
			...(data?.parent && { 2: data?.parent?.name }),
			...(data?.parent?.parent && { 3: data?.parent?.parent?.name }),
			...(data?.parent?.parent?.parent && { 4: data?.parent?.parent?.parent?.name }),
			...(data?.parent?.parent?.parent?.parent && {
				5: data?.parent?.parent?.parent?.parent?.name,
			}),
			...(data?.parent?.parent?.parent?.parent?.parent && {
				6: data?.parent?.parent?.parent?.parent?.parent?.name,
			}),
			...(data?.parent?.parent?.parent?.parent?.parent?.parent && {
				7: data?.parent?.parent?.parent?.parent?.parent?.parent?.name,
			}),
			...(data?.parent?.parent?.parent?.parent?.parent?.parent?.parent && {
				8: data?.parent?.parent?.parent?.parent?.parent?.parent?.parent?.name,
			}),
			...(data?.parent?.parent?.parent?.parent?.parent?.parent?.parent?.parent && {
				9: data?.parent?.parent?.parent?.parent?.parent?.parent?.parent?.parent?.name,
			}),
			...(data?.parent?.parent?.parent?.parent?.parent?.parent?.parent?.parent?.parent && {
				10: data?.parent?.parent?.parent?.parent?.parent?.parent?.parent?.parent?.parent?.name,
			}),
		});
	});

	const onSelectChange = (selectedRowKeys) => {
		setSelectedRowKeys(selectedRowKeys);
	};
	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
	};

	const deleteDataInStructure = (deleteId) => {
		const newAllStructure = _.cloneDeep(tempAllStructure);
		newAllStructure[level - 1] = newAllStructure[level - 1].filter(
			(data) => !selectedRowKeys.includes(data.id)
		);
		setTempAllStructure(newAllStructure);
	};

	const [showUploadTemplate, setShowUploadTemplate] = useState(false);

	const lists = [
		{
			name: "Download Template",
			icon: DownloadFile,
			onClick: () => downloadStructure(dataTable, level),
		},
		{
			name: "Upload Template",
			icon: UploadFile,
			onClick: () => {
				setShowUploadTemplate(true);
			},
		},
	];

	const parentStructure = [];

	if (parentDataStructure?.length > 0) {
		parentStructure = parentDataStructure
			?.map((parent) => ({
				id: parent.id,
				value: parent.name,
			}))
			?.filter((data) => data?.value?.toLowerCase()?.includes(searchParent?.toLowerCase()));
	}

	const onUploadStructure = (data) => {
		const newData = [];
		if (level > 1) {
			data.forEach((data) => {
				let newEntries = Object.entries(data);
				const currentLevel = newEntries[level - 1];
				const currentData = currentLevel[1];
				const currentParentLevel = newEntries[level - 2];
				let currentParentData;
				if (currentParentLevel) {
					currentParentData = currentParentLevel[1];
				}

				if (
					currentParentData &&
					parentDataStructure.find((parent) => parent.name.toLowerCase() === currentParentData.toLowerCase())
				) {
					const newSingleData = {
						id: self.crypto.randomUUID(),
						name: currentData,
						parent: parentDataStructure.find((parent) => parent.name.toLowerCase() === currentParentData.toLowerCase()).id,
					};
					newData.push(newSingleData);
				}
			});
		} else {
			data.forEach((data) => {
				let newEntries = Object.entries(data);
				const currentLevel = newEntries[level - 1];
				const currentData = currentLevel[1];

				const newSingleData = {
					id: self.crypto.randomUUID(),
					name: currentData,
					parent: null,
				};
				newData.push(newSingleData);
			});
		}

		const newAllStructure = _.cloneDeep(tempAllStructure);
		newAllStructure[level - 1] = newData;
		setTempAllStructure(newAllStructure);
	};

	const onFocusRemoveValidation = (e) => {
		const newErrors = _.cloneDeep(errors);
		delete newErrors[e.target.name];
		setErrors(newErrors);
	};


	return (
		<Modal
			onCancel={onCancel}
			visible={visible}
			width="880px"
			title={`Manage ${structure.name}`}
			footer={
				<div
					style={{
						display: "flex",
						marginBottom: "12px",
						marginRight: "12px",
						justifyContent: "flex-end",
						gap: "12px",
					}}
				>
					<Button size="big" variant="secondary" key="submit" type="primary" onClick={onCancel}>
						Cancel
					</Button>
					<Button variant="primary" size="big" onClick={onReplaceStructure}>
						{isLoading ? "loading..." : "Save"}
					</Button>
				</div>
			}
			content={
				<>
					<Spacer size={22} />
					<Row width="100%" gap="16px" noWrap alignItems="flex-end" style={{ marginBottom: "5px" }}>
						
						<Row height="98px" width="100%" noWrap>
							<Input
							width="100%"
							label={`${stringifyNumber(structure.level - 1)} Level Name`}
							height="48px"
							placeholder={`e.g ${structure.name} Name`}
							onChange={(e) => setName(e.target.value)}
							value={name}
							error={errors.name}
							required
							onFocus={() =>
								onFocusRemoveValidation({
									target: {
										name: "name",
									},
								})
							}
						/>
						</Row>
						
						{level > 1 && (
							<Row height="98px" width="100%" noWrap>
								<Dropdown
									label={`${stringifyNumber(structure.level - 2)} Level Name`}
									width={"100%"}
									key={tableData.length}
									items={parentStructure}
									placeholder={"Select"}
									onSearch={(search) => setSearchParent(search)}
									error={errors.parent}
									handleChange={(value) => {
										setParent(value)
										onFocusRemoveValidation({
											target: {
												name: "parent",
											},
										});
									}}
									required
								/>
							</Row>
						)}
						
						<Button variant="primary" style={{ alignSelf: "center" }} size="big" onClick={() => onAddStructure()}>
							Add
						</Button>
					</Row>

					<Divider />

					<Spacer size={20} />

					<Row width="100%" noWrap alignItems="center" gap="16px">
						<Search
							placeholder={`Search ${structure.name} Name`}
							onChange={(e) => setSearchTable(e.target.value)}
						/>
						<ActionButton lists={lists} />
						<Button
							variant="tertiary"
							size="big"
							onClick={deleteDataInStructure}
							disabled={rowSelection.selectedRowKeys?.length === 0}
						>
							Delete
						</Button>
					</Row>

					<Spacer size={20} />

					<Col gap="20px">
						<Table loading={false} columns={columns} data={dataTable} rowSelection={rowSelection} />
						{pagination.totalItems > 5 && <Pagination pagination={pagination} />}
					</Col>
					<Spacer size={38} />
					{showUploadTemplate && <FileUploaderExcel
						visible={showUploadTemplate}
						setVisible={setShowUploadTemplate}
						onSubmit={onUploadStructure}
					/>}
				</>
			}
		/>
	);
};

const Divider = styled.div`
	border: 1px dashed #dddddd;
`;
