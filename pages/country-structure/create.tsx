import React, { useState } from "react";
import _ from "lodash";
import { saveAs } from "file-saver";
import styled from "styled-components";
import { useRouter } from "next/router";
import * as ExcelJS from "exceljs/dist/exceljs.min.js";
import {
	Text,
	Col,
	Row,
	Spacer,
	Dropdown,
	Button,
	Accordion,
	Input,
	Switch,
	FileUploaderExcel,
	Spin,
} from "pink-lava-ui";

import { ModalDeleteConfirmation } from "../../components/elements/Modal/ModalConfirmationDelete";
import { ModalManageData } from "../../components/elements/Modal/ModalManageData";
import { useCurrenciesMDM } from "../../hooks/mdm/currency/useCurrencyMDM";
import { useMdmCreateCountry } from "../../hooks/mdm/country/useCountries";

async function downloadStructure(countryStructure: { name: any; }[]) {
	const wb = new ExcelJS.Workbook();
	const ws = wb.addWorksheet("country_structure");
	ws.columns = [
		{header: '1st_level_name', key: '1', width: 30},
		{header: '2nd_level_name', key: '2', width: 30}, 
		{header: '3rd_level_name', key: '3', width: 30},
		{header: '4th_level_name', key: '4', width: 30}, 
		{header: '5th_level_name', key: '5', width: 30},
		{header: '6th_level_name', key: '6', width: 30}, 
		{header: '7th_level_name', key: '7', width: 30},
		{header: '8th_level_name', key: '8', width: 30}, 
		{header: '9th_level_name', key: '9', width: 30},
		{header: '10th_level_name', key: '10', width: 30},
	   ];

	const row = ws.addRow({
		1: 'The first-level structure contains the territory of government under the country.E.g. State, Province, Region', 
		2: 'The second-level structure contains the territory of government under the provinces/ states/region.',
		3: 'The third-level sructure contains the territory of government under the city/regency.E.g. District', 
		4: 'The fourth-level sructure contains the territory of government under districts area	E.g. Sub-District, Village',
		5: 'The fifth-level sructure contains the territory under the administration of the fourth-level',
		6: 'The sixth-level sructure contains the territory under the administration of the fifht-level',
		7: 'The seventh-level sructure contains the territory under the administration of the sixth-level',
		8: 'The eighth-level sructure contains the territory under the administration of the seventh-level',
		9: 'The ninth-level sructure contains the territory under the administration of the eighth-level',
		10: 'The tenth-level sructure contains the territory under the administration of the ninth-level',
	})

	ws.addRow({
		...(countryStructure[0] && {1: countryStructure[0].name}),
		...(countryStructure[1] && {2: countryStructure[1].name}),
		...(countryStructure[2] && {3: countryStructure[2].name}),
		...(countryStructure[3] && {4: countryStructure[3].name}),
		...(countryStructure[4] && {5: countryStructure[4].name}),
		...(countryStructure[5] && {6: countryStructure[5].name}),
		...(countryStructure[6] && {7: countryStructure[6].name}),
		...(countryStructure[7] && {8: countryStructure[7].name}),
		...(countryStructure[8] && {9: countryStructure[8].name}),
		...(countryStructure[9] && {10: countryStructure[9].name}),
	})

	ws.getRow(1).fill = {
		type: 'pattern',
		pattern:'solid',
		fgColor:{argb:'68ffb7'},
	  };

	row.fill = {
		type: 'pattern',
		pattern:'solid',
		fgColor:{argb:'c5e0b3'},
	  };

	const buf = await wb.xlsx.writeBuffer();

	saveAs(new Blob([buf]), "country_structure.xlsx");
}

function stringifyNumber(n: number) {
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

const CountryStructureDefault = () => {
	const router = useRouter();
	const [errors, setErrors] = useState({});
	const [countryStructure, setCountryStructure] = useState([]);
	const [modalDelete, setModalDelete] = useState({ open: false });
	const [searchCurrency, setSearchCurrency] = useState("");
	const [countryBasic, setCountryBasic] = useState({
		name: "",
		currencyId: "",
	});
	const [allStructure, setAllStructure] = useState([]);

	const [showUploadStructure, setShowUploadStructure] = useState();
	const [showManageData, setShowManageData] = useState({
		visible: false,
		index: null,
	});

	const onUploadStructure = (data: ({ [s: string]: unknown; } | ArrayLike<unknown>)[]) => {
		const datas: any = Object.values(data[1]).map((data, index) => ({
			name: data,
			level: index + 1,
			connectPostalCode: "N",
		}));
		setCountryStructure(datas);
	};

	const { mutate: createCountry } = useMdmCreateCountry({
		options: {
			onSuccess: () => {
				router.push("/country");
			},
		},
	});

	const validateRequired = (data: { structure?: any; name: any; currencyId: any; }) => {
		const newErrors: any = _.cloneDeep(errors);
		let isError: boolean = false;

		if (!data.name) {
			newErrors["name"] = "Country Name is required";
			isError = true;
		}

		if (!data.currencyId) {
			newErrors["currency"] = "Currency is required";
			isError = true;
		}

		setErrors(newErrors);

		return isError;
	};

	const onSubmit = () => {
		let newAllStructure: any = _.clone(allStructure);
		if (newAllStructure.length > 0) {
			const allStructureZero =
				allStructure?.[0]?.map((data: any) => ({
					...data,
					parent: 0,
				})) || [];
			newAllStructure[0] = allStructureZero;
		}
		const newStructure: any = countryStructure.map((country: any, index) => {
			return {
				...country,
				data: newAllStructure[index],
			};
		});

		const data: any = {
			...countryBasic,
			...(newStructure.length > 0 && { structure: newStructure }),
		};
		if (!validateRequired(data)) {
			createCountry(data);
		}
	};

	const onDeleteStructure = () => {
		const newCountryStructure = countryStructure.slice(0, modalDelete?.index);
		const newAllStructure = allStructure.slice(0, modalDelete?.index);
		setCountryStructure(newCountryStructure);
		setAllStructure(newAllStructure);
		setModalDelete({ open: false });
	};

	const addStructure = () => {
		let newStructure: any = countryStructure.slice();
		newStructure.push({
			level: countryStructure.length + 1,
			connectPostalCode: "N",
			name: "",
		});
		setCountryStructure(newStructure);
	};

	const onChangeStructureName = (e: { target: { value: any; }; }, index: number) => {
		let newStructure = _.cloneDeep(countryStructure);
		newStructure[index].name = e.target.value;
		setCountryStructure(newStructure);
	};

	const onChangeStructurePostalCode = (index: number) => {
		let newStructure: any = _.cloneDeep(countryStructure);
		newStructure[index].connectPostalCode = newStructure[index].connectPostalCode === "Y" ? "N" : "Y";
		setCountryStructure(newStructure);
	};

	const { data: currencies, isLoading: isLoadingCurrencies } = useCurrenciesMDM({
		query: {
			limit: 10000,
			search: searchCurrency,
		},
	});
	const currencyList = currencies?.rows?.map((currency: { id: any; currencyName: any; }) => ({
		id: currency.id,
		value: currency.currencyName,
	}));

	const recursivelyDeleteStructure = (structure: any[], allStructure: any[], deletedIds: any[], level: number) => {
		const parentDeletedIds: any[] = [];
		deletedIds.forEach((id: any) => {
			const findParentId =  structure.find((structure: { parent: any; }) => structure.parent === id);
			parentDeletedIds.push(findParentId.id);
			allStructure[level] = structure.filter((structure: { parent: any; }) => structure.parent !== id)
		})

		if(allStructure[level+1]){
			recursivelyDeleteStructure(allStructure[level+1], allStructure, parentDeletedIds, level+1)
		}
	}

	const onAddToStructure = (tempAllStructure: any[], level: number) => {
		if(!tempAllStructure) {
			setShowManageData({ visible: false });
			return;
		};

		let newStructure: any = _.cloneDeep(allStructure);
		// recursively delete
		if(newStructure[level] && !_.isEqual(newStructure[level-1], tempAllStructure)){
			const deletedIds: any[] = [];
			const tempAllStructureIds = tempAllStructure.map((temp: { id: any; }) => temp.id);
			newStructure[level-1].forEach((structure: { id: any; }) => {
				if(!tempAllStructureIds.includes(structure.id)){
					deletedIds.push(structure.id)
				}
			})
			const parentDeletedIds: any[] = [];
			deletedIds.forEach((id: any) => {
				const findParentId =  newStructure[level].find((structure: { parent: any; }) => structure.parent === id);
				parentDeletedIds.push(findParentId.id);
				newStructure[level] = newStructure[level].filter((structure: { parent: any; }) => structure.parent !== id)
			})
			
			if(newStructure[level+1]){
				recursivelyDeleteStructure(newStructure[level+1], newStructure, parentDeletedIds, level+1);
			}
		}
		newStructure[level - 1] = tempAllStructure;
		setAllStructure(newStructure);
		setShowManageData({ visible: false });
	};

	const onFocusRemoveValidation = (e: { target: any; }) => {
		const newErrors: any = _.cloneDeep(errors);
		delete newErrors[e.target.name];
		setErrors(newErrors);
	};

	return (
		<>
			{isLoadingCurrencies ? (
				<Center>
					<Spin tip="Loading data..." />
				</Center>
			) : (
				<Col>
					<Row gap="4px">
						<Text variant={"h4"}>Create Country</Text>
					</Row>
					<Spacer size={12} />
					<Card>
						<Row justifyContent="flex-end" alignItems="center" nowrap>
							<Row>
								<Row gap="16px">
									<Button size="big" variant={"tertiary"} onClick={() => router.push("/country")}>
										Cancel
									</Button>
									<Button size="big" variant={"primary"} onClick={onSubmit}>
										Save
									</Button>
								</Row>
							</Row>
						</Row>
					</Card>

					<Spacer size={20} />

					<Accordion>
						<Accordion.Item key={1}>
							<Accordion.Header variant="blue">General</Accordion.Header>
							<Accordion.Body>
								<Row width="100%" gap="20px" noWrap>
									<Input
										width="100%"
										name="name"
										label="Country Name"
										height="48px"
										placeholder={"e.g Indonesia"}
										value={countryBasic.name}
										onChange={(e: { target: { value: any; }; }) => setCountryBasic({ ...countryBasic, name: e.target.value })}
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
									<Dropdown
										label="Currency"
										width={"100%"}
										items={currencyList}
										placeholder={"Select"}
										onSearch={(search: React.SetStateAction<string>) => setSearchCurrency(search)}
										handleChange={(value: any) => {
											onFocusRemoveValidation({
												target: {
													name: "currency",
												},
											});
											setCountryBasic({ ...countryBasic, currencyId: value });
										}}
										error={errors?.currency}
										required
									/>
								</Row>
							</Accordion.Body>
						</Accordion.Item>
					</Accordion>

					<Spacer size={20} />

					<Accordion>
						<Accordion.Item key={2}>
							<Accordion.Header variant="blue">Country Structure</Accordion.Header>
							<Accordion.Body>
								<Row width="100%" gap="20px" noWrap>
									<DownloadUploadContainer>
										<Text variant="headingMedium">Download and fill in excel file </Text>
										<Spacer size={4} />
										<Text variant="body2" color="black.dark">
											Use this template to add country structure
										</Text>
										<Spacer size={10} />
										<Button
											variant="tertiary"
											size="big"
											onClick={() => downloadStructure(countryStructure)}
										>
											Download Template
										</Button>
									</DownloadUploadContainer>

									<DownloadUploadContainer>
										<Text variant="headingMedium">Upload template excel file </Text>
										<Spacer size={4} />
										<Text variant="body2" color="black.dark">
											Select or drop your Excel(.xlsx) file here.
										</Text>
										<Spacer size={10} />
										<Button
											variant="tertiary"
											size="big"
											onClick={() => setShowUploadStructure(true)}
										>
											Upload Template
										</Button>
									</DownloadUploadContainer>
								</Row>

								<Spacer size={20} />

								<Divider />

								<Spacer size={28} />

								{countryStructure.map((structure: any, index: any) => (
									<>
										<Row key={index} width="100%" gap="16px" alignItems="flex-end" noWrap>
											<Input
												width="100%"
												label={`${stringifyNumber(index)} Level Name`}
												height="48px"
												placeholder={`Type ${stringifyNumber(index)} Level Name`}
												value={structure.name || ""}
												onChange={(e: any) => onChangeStructureName(e, index)}
											/>
											<Row width="41%" noWrap style={{ marginBottom: "5px" }}>
												<Button
													variant="tertiary"
													size="big"
													onClick={() => setModalDelete({ open: true, index: index, structure })}
												>
													Delete
												</Button>
												<Spacer size={16} />
												<Button
													variant="primary"
													size="big"
													onClick={() => {
														setShowManageData({
															visible: true,
															index: index,
														});
													}}
												>
													Manage Data
												</Button>
											</Row>
										</Row>
										<Spacer size={8} />
										<Row gap="15px" alignItems="center">
											<Text variant="body2">Connect to postal code</Text>
											<Switch
												defaultChecked={false}
												onChange={() => onChangeStructurePostalCode(index)}
											/>
										</Row>
										<Spacer size={20} />
										<Divider />
										<Spacer size={20} />
									</>
								))}
								{countryStructure.length < 10 && (
									<Button variant="ghost" size="big" onClick={() => addStructure()}>
										+ Add Structure Level
									</Button>
								)}
							</Accordion.Body>
						</Accordion.Item>
					</Accordion>
				</Col>
			)}
			{modalDelete.open && (
				<ModalDeleteConfirmation
					visible={modalDelete.open}
					onCancel={() => setModalDelete({ open: false })}
					onOk={onDeleteStructure}
					itemTitle={modalDelete.structure.name}
				/>
			)}
			<FileUploaderExcel
				setVisible={setShowUploadStructure}
				visible={showUploadStructure}
				onSubmit={onUploadStructure}
			/>
			{showManageData.visible && (
				<ModalManageData
					visible={showManageData.visible}
					onCancel={() => setShowManageData({ visible: false })}
					structure={countryStructure[showManageData.index]}
					parentDataStructure={allStructure[countryStructure[showManageData.index].level - 2]}
					onAddToStructure={(tempAllStructure: any, level: any) => onAddToStructure(tempAllStructure, level)}
					allStructure={_.cloneDeep(allStructure).slice(
						0,
						countryStructure[showManageData.index].level
					)}
					level={countryStructure[showManageData.index].level}
					countryStructure={_.cloneDeep(countryStructure).slice(
						0,
						countryStructure[showManageData.index].level
					)}
				/>
			)}
		</>
	);
};

const Center = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
`;

const Divider = styled.div`
	border: 1px dashed #dddddd;
`;

const DownloadUploadContainer = styled.div`
	background: #ffffff;
	border: 1px solid #aaaaaa;
	border-radius: 8px;
	width: 100%;
	padding: 20px 20px 20px 20px;
	display: flex;
	align-items: center;
	flex-direction: column;
`;

const Card = styled.div`
	background: #ffffff;
	border-radius: 16px;
	padding: ${(p) => (p.padding ? p.padding : "16px")};
`;

export default CountryStructureDefault;
