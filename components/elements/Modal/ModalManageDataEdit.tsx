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
import UploadFile from "../../../assets/icons/upload-file.svg";
import DownloadFile from "../../../assets/icons/download-file.svg";
import { useFetchCountriesStructure } from "../../../hooks/mdm/country-structure/useCountries";

import axios from "axios";

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
		itemsPerPage: 5,
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

	const onUploadStructure = (data: any) => {
		const newData: any = [];
		if (level > 1) {
			data.forEach((data: any) => {
				let newEntries = Object.entries(data);
				const currentLevel = newEntries[level];
				const currentData = currentLevel[1];
				const currentParentLevel = newEntries[level - 1];
				const currentParentIds = newEntries[level - 2];
				let currentParentData;
				let currentParentId;
				if (currentParentLevel) {
					currentParentData = currentParentLevel[1];
					currentParentId = currentParentIds[1];
				}

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
	};


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
				donwloadStructure();
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
