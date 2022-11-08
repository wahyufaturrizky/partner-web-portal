import React, { useEffect, useState } from "react";
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
import UploadFile from "../../../assets/icons/upload-file.svg";
import DownloadFile from "../../../assets/icons/download-file.svg";
import { useFetchCountriesStructure } from "../../../hooks/mdm/country-structure/useCountries";
import * as ExcelJS from "exceljs/dist/exceljs.min.js";
import axios from "axios";
import { saveAs } from "file-saver";

let token: any;
let apiURL = process.env.NEXT_PUBLIC_API_BASE3;

if (typeof window !== "undefined") {
	token = localStorage?.getItem("token");
}

function stringifyNumberSpecial(n: any) {
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

function stringifyNumber(n: any) {
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

async function downloadStructureExcel(structure: any, level: any) {
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
	structure.map((structure: any) => {
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
	saveAs(new Blob([buf]), `manage_${stringifyNumberSpecial(level-1)}_level.xlsx`);
}

export const ModalManageDataEdit = ({
	visible,
	onCancel,
	structure,
	isLoading,
	level,
	onAddToStructure,
	countryStructure,
	updateAllStructure
}: any) => {
	const [name, setName] = useState("");
	const [parent, setParent] = useState<any>({});
	const [tempAllStructure, setTempAllStructure] = useState([]);
	const [searchTable, setSearchTable] = useState("");
	const [parentDatasStructure, setParentDatasStructure] = useState([]);
	const [allParentData, setAllParentData] = useState();
	const [searchCurrency, setSearchCurrency] = useState("");

	const [tempAdd, setTempAdd] = useState([]);
	const [updateStructure, setUpdateStructure] = useState({
		addNew: updateAllStructure.addNew[level-1] || [],
		delete: updateAllStructure.delete[level-1] || []
	})
	const pagination = usePagination({
		page: 1,
		itemsPerPage: 20,
		maxPageItems: Infinity,
		numbers: true,
		arrows: true,
		totalItems: 100,
	});

	let currentTempStructure: any = tempAllStructure;
	if(!structure.id){
		const addNewAllStructure = updateAllStructure.addNew[level-1]
		const deletedNewAllStructure = updateAllStructure.delete[level-1]
		if(addNewAllStructure){
			currentTempStructure = [...addNewAllStructure];
		}
		
		if(deletedNewAllStructure){
			currentTempStructure = currentTempStructure.filter((data: any) => !deletedNewAllStructure.includes(data.id))
		}
	}

	useFetchCountriesStructure({
		structure_id: structure.id,
		options: {
			onSuccess: (data: any) => {
				const addNewAllStructure: any = updateAllStructure.addNew[level-1]
				const deletedNewAllStructure: any = updateAllStructure.delete[level-1]
				let tempAllStructureClone: any = _.clone(tempAllStructure);
				if(addNewAllStructure){
					tempAllStructureClone = [...addNewAllStructure, ...data.rows];
				} else {
					tempAllStructureClone = [...data.rows];
				}

				if(deletedNewAllStructure){
					tempAllStructureClone = tempAllStructureClone.filter(data => !deletedNewAllStructure.includes(data.id))
				}

				const deleteAlParentlStructure = updateAllStructure.delete[level-2]
				if(deleteAlParentlStructure){
					tempAllStructureClone = tempAllStructureClone.filter(data => !deleteAlParentlStructure.includes(data.parent.id ?? data.parent))
				}

				tempAllStructureClone = [...tempAdd, ...tempAllStructureClone]
				

				setTempAllStructure(tempAllStructureClone)

				pagination.setTotalItems(data.totalRow);
			},
			enabled: !!structure.id,
		},
		query: {
			search: searchTable,
		},
	});

	useFetchCountriesStructure({
		structure_id: countryStructure?.[level - 2]?.id,
		options: {
			onSuccess: (data: any) => {
				const addParentAllStructure = updateAllStructure.addNew[level-2]
				let tempParent = data.rows
				if(addParentAllStructure){
				 	tempParent = [...addParentAllStructure, ...data.rows];
				} 

				const deleteParentAllStructure = updateAllStructure.delete[level-2]
				if(deleteParentAllStructure){
					tempParent = tempParent.filter((parent: any) => !deleteParentAllStructure.includes(parent.id));
			   } 

			   setAllParentData(tempParent)
				setParentDatasStructure(
					tempParent.map((data: any) => ({
						id: data.id,
						value: data.name,
						data: data
					}))
				);
			},
			enabled: !!countryStructure?.[level - 2]?.id,
		},
		query: {
			search: searchCurrency,
			limit: 10000,
		},
	});

	const onReplaceStructure = () => {
		onAddToStructure(updateStructure, level);
	};

	const onAddStructure = () => {
		const isNewParent = isNaN(parent?.id);
		const isNewStructureId = isNaN(structure?.id);

		const newData: any = {
			id: self.crypto.randomUUID(),
			name: name,
			...(parent?.id && {parent: allParentData.find(data => data.id === parent?.id)}) || null,
			isNewParent,
			...(!isNewStructureId && {structureId: structure.id})
		};

		const tempAddClone: any = _.cloneDeep(tempAdd);
		tempAddClone.push(newData);
		setTempAdd(tempAddClone)

		const newAllStructure: any = _.cloneDeep(currentTempStructure);
		newAllStructure.unshift(newData);
		setTempAllStructure(newAllStructure);
		setName("");
		setParent(null);

		let updateStructureClone = _.cloneDeep(updateStructure);
		updateStructureClone.addNew.push(newData)
		setUpdateStructure(updateStructureClone)
	};

	const updateParentTable = (obj: any, allArray: any, level: any) => {
		if (!obj.parent) return obj;

		const parentArray = allArray[level - 1];
		if (obj.parent) {
			obj.parent = parentArray.find((arr) => arr.id === obj.parent);

			if (obj?.parent?.parent) {
				updateParentTable(obj.parent, allArray, level - 1);
			}
		}
	};

	const [selectedRowKeys, setSelectedRowKeys] = useState([]);

	const columns = JSON.parse(JSON.stringify(countryStructure))
		.slice(0, level)
		.reverse()
		.map((country: any, index: any) => ({
			title: country.name,
			dataIndex: index + 1,
		}));

	let dataTable: any = [];
	currentTempStructure?.forEach((data: any) => {
		dataTable.push({
			key: data.id,
			1: data.name,
			...(data?.parent && { 2: data?.parent?.name ?? parentDatasStructure?.find(parent => parent.id === data?.parent)?.value }),
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

	if(searchTable){
		dataTable = dataTable.filter((data: any) => data[1].toLowerCase().includes(searchTable.toLowerCase()))
	}

	let parentData = parentDatasStructure;
	if(!countryStructure?.[level - 2]?.id && level > 1){
		parentData= updateAllStructure.addNew[level-1].map((data: any) => ({
			id: data.id,
			value: data.name,
			data: data?.data
		}))
	}
	if(searchCurrency){
		parentData = parentData.filter((data: any) => data.value.toLowerCase().includes(searchCurrency.toLowerCase()))
	}

	const onSelectChange = (selectedRowKeys: any) => {
		setSelectedRowKeys(selectedRowKeys);
	};
	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
	};

	const deleteDataInStructure = (deleteId: any) => {
		let newAllStructure: any = _.cloneDeep(currentTempStructure);
		newAllStructure = newAllStructure.filter((data: any) => !selectedRowKeys.includes(data.id));
		setTempAllStructure(newAllStructure);

		let updateStructureClone = _.cloneDeep(updateStructure);
		const isNaNRow = selectedRowKeys.filter(row=> isNaN(row));
		updateStructureClone.addNew = updateStructureClone.addNew.filter((data: any)=> !isNaNRow.includes(data.id))
		updateStructureClone.delete.push(...selectedRowKeys.filter(row => !isNaN(row)))
		setUpdateStructure(updateStructureClone)
	};

	const [showUploadTemplate, setShowUploadTemplate] = useState(false);
	const [upload, setUploadData] = useState(false);

	const onUploadStructure = (data: any) => {
		const newData: any = [];
		if (level > 1) {
			data.forEach((data: any) => {
				let newEntries = Object.entries(data);
				const currentLevel = newEntries[level];
				const currentData = currentLevel?.[1];
				if(!currentData){
					console.log("error")
					return;
				}
				const currentParentLevel = newEntries[level - 2];
				const currentParentIds = newEntries[level - 1];

				let currentParentData;
				let currentParentId: any;
				if (currentParentLevel) {
					currentParentData = currentParentLevel[1];
					currentParentId = currentParentIds[1];

					if(isNaN(currentParentId)){
						let temp = currentParentId;
						currentParentId = currentParentData;
						currentParentData = temp
					}
				}
				if(currentData){
					const newSingleData: any = {
						id: self?.crypto?.randomUUID(),
						name: currentData,
						parent: {
							id: currentParentId,
							name: currentParentData
						},
						isNewParent: false,
						structureId: structure.id
					};
					newData.push(newSingleData);
				} else {
					console.log("error")
				}
			});
		} else {
			data.forEach((data: any) => {
				let newEntries = Object.entries(data);
				const currentLevel = newEntries[level - 1];
				const currentData = currentLevel[1];

				const newSingleData = {
					id: self?.crypto?.randomUUID(),
					name: currentData,
					parent: null,
					isNewParent: false,
					structureId: structure.id
				};
				newData.push(newSingleData);
			});
		}

		const tempAddClone: any = _.cloneDeep(tempAdd);
		tempAddClone.push(newData);
		setTempAdd(tempAddClone)

		let newAllStructure: any = _.cloneDeep(currentTempStructure);
		newAllStructure = newData;
		setTempAllStructure(newAllStructure);
		setName("");
		setParent(null);

		let updateStructureClone = _.cloneDeep(updateStructure);
		updateStructureClone.delete.push(...tempAllStructure.map((data: any) => data.id))
		updateStructureClone.addNew = newData
		setUpdateStructure(updateStructureClone)

		setUploadData(true)
	};

	useEffect(() => {
		if(upload){
			onReplaceStructure()
		} else {
			setUploadData(false);
		}
	}, [upload])


	const donwloadStructure = async(value: any) => {
		return await axios
		.get(apiURL + `/country/template/structure/${structure.id}`, {
			responseType: 'blob',
			params: {
				with_data: value
			},
			headers: {
				Authorization: "Bearer " + token,
				"Content-Type": "application/json",
			},
		})
		.then((response) => {
			var data = new Blob([response?.data], { type: 'application / vnd. MS Excel'});
			var csvURL = window.URL.createObjectURL(data);
			var tempLink = document.createElement('a');
			tempLink.href = csvURL;
			tempLink.setAttribute('download', `manage_${stringifyNumberSpecial(level-1)}_level.xlsx`);
			tempLink.click();
		});
	}

	const lists = [
		{
			name: "Download Template",
			icon: DownloadFile,
			onClick: () => {
				if(structure?.id){
					donwloadStructure();
				} else {
					downloadStructureExcel(dataTable, level)
				}
			},
		},
		{
			name: "Upload Template",
			icon: UploadFile,
			onClick: () => {
				setShowUploadTemplate(true);
			},
		},
	];

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
						<Input
							width="100%"
							label={`${stringifyNumber(structure.level - 1)} Level Name`}
							height="48px"
							placeholder={`e.g ${structure.name} Name`}
							onChange={(e: any) => setName(e.target.value)}
							value={name}
							//onChange={(e) => onChangeStructure(e, index)}
						/>
						{level > 1 && (
							<Dropdown
								label={`${stringifyNumber(structure.level - 2)} Level Name`}
								width={"100%"}
								key={dataTable.length}
								items={parentData}
								placeholder={"Select"}
								onSearch={(search: any) => setSearchCurrency(search)}
								handleChange={(value: any) => setParent({ id: value })}
							/>
						)}
						<Button disabled={!name} variant="primary" size="big" onClick={() => onAddStructure()}>
							Add
						</Button>
					</Row>

					<Spacer size={20} />

					<Divider />

					<Spacer size={20} />

					<Row width="100%" noWrap alignItems="center" gap="16px">
						<Search
							placeholder={`Search ${structure.name} Name`}
							onChange={(e: any) => setSearchTable(e.target.value)}
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
