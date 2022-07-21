import React, { useState } from "react";
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
import styled from "styled-components";
import Router, { useRouter } from "next/router";
import { ModalDeleteConfirmation } from "../../components/modals/ModalDeleteConfirmation";
import { useMdmCurrency } from "../../hooks/mdm/currency/useMdmCurrency";
import _ from "lodash";
import { useMdmCountry, useMdmUpdateCountry } from "../../hooks/mdm/country/useMdmCountry";
import { ModalManageDataEdit } from "../../components/modals/ModalManageDataEdit";
import ArrowLeft from "../../assets/arrow-left.svg";
import { useDeleteCountry } from "../../hooks/country/useCountry";

const CreateConfig = () => {
	const router = useRouter();
	const [errors, setErrors] = useState({});
	const { country_id } = router.query;
	const [countryStructure, setCountryStructure] = useState([]);
	const [updateCountryStructure, setUpdateCountryStructure] = useState({
		update: [], 
		addNew: [],
		delete: []
	})
	const [updateAllStructure, setUpdateAllStructure] = useState({
		addNew: {},
		delete: {}
	})
	const [modalDelete, setModalDelete] = useState({ open: false });
	const [modalDeleteCountry, setModalDeleteCountry] = useState({ open: false });
	const [searchCurrency, setSearchCurrency] = useState("");
	const [countryBasic, setCountryBasic] = useState({
		name: "",
		currencyId: "",
	});

	const [showUploadStructure, setShowUploadStructure] = useState();
	const [showManageData, setShowManageData] = useState({
		visible: false,
		index: null,
	});

	const onUploadStructure = (data) => {
		let idsCountryStructure = countryStructure.map(data => data.id);
		let updateCountryStructureClone = _.cloneDeep(updateCountryStructure);
		idsCountryStructure.forEach(id => (
			updateCountryStructureClone.delete.push(id)
		))
		const datas = Object.values(data[1]).map((data, index) => ({
			name: data,
			level: index + 1,
			connectPostalCode: "N",
		}));
		updateCountryStructureClone.addNew.push(...datas)
		setUpdateCountryStructure(updateCountryStructureClone)
		setCountryStructure(datas);
	};

	const { mutate: updateCountry } = useMdmUpdateCountry({
		country_id,
		options: {
			onSuccess: () => {
				router.push("/country");
			},
		},
	});

	const validateRequired = (data) => {
		const newErrors = _.cloneDeep(errors);
		const isError = false;

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
		const data = {
			...countryBasic,
			delete: {
				structure: updateCountryStructure.delete,
				structureElements: Object.values(updateAllStructure.delete).flat() || []
			},
			update: {
				structure: updateCountryStructure.update
			},
			addNew: {
				structure: updateCountryStructure.addNew.map(data => ({
					...data,
					data: updateAllStructure.addNew[data.level-1] || []
				})),
				structureElements: Object.values(updateAllStructure.addNew).flat().filter(data => {
					if(data?.parent?.id){
						if(isNaN(data?.parent?.id)){
							return false;
						}
					}

					return true;
				}).map(data => ({
					id: data.id,
					isNewParent: data.isNewParent,
					name: data.name,
					...( data?.parent && {parent: data?.parent?.id}),
					structureId: data.structureId
				})) || []
			}
		};
		if (!validateRequired(data)) {
			updateCountry(data);
		}
	};

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

	const onDeleteStructure = () => {
		const newCountryStructure = countryStructure.slice(0, modalDelete.index);
		setCountryStructure(newCountryStructure);
		setModalDelete({ open: false });
		if(modalDelete.structure.id){
			let updateCountryStructureClone = _.cloneDeep(updateCountryStructure);
			updateCountryStructureClone.delete.push(modalDelete.structure.id)
			setUpdateCountryStructure(updateCountryStructureClone)
		} else {
			let updateCountryStructureClone = _.cloneDeep(updateCountryStructure);
			updateCountryStructureClone.addNew = updateCountryStructureClone.addNew.filter(add => add.level <= modalDelete.structure.level - 1)
			setUpdateCountryStructure(updateCountryStructureClone)
		}
	};

	const addStructure = () => {
		let newStructure = countryStructure.slice();
		newStructure.push({
			level: countryStructure.length + 1,
			connectPostalCode: "N",
			name: "",
		});
		setCountryStructure(newStructure);

		let updateCountryStructureClone = _.cloneDeep(updateCountryStructure);
		updateCountryStructureClone.addNew.push({
			level: countryStructure.length + 1,
			connectPostalCode: "N",
			name: "",
		})
		setUpdateCountryStructure(updateCountryStructureClone)
	};

	const onChangeStructureName = (e, index) => {
		let newStructure = _.cloneDeep(countryStructure);
		newStructure[index].name = e.target.value;
		setCountryStructure(newStructure);
	};

	const onBlurStructureName = (e, index) => {
		let newStructure = _.cloneDeep(countryStructure);
		newStructure[index].name = e.target.value;
		if(newStructure[index].id){
			let structureInUpdateIndex = updateCountryStructure.update.findIndex(update => update.id === newStructure[index].id)
			let updateCountryStructureClone = _.cloneDeep(updateCountryStructure);
			if(structureInUpdateIndex > 0){
				updateCountryStructureClone.update[structureInUpdateIndex].name = e.target.value;
				setUpdateCountryStructure(updateCountryStructureClone)
			} else {
				updateCountryStructureClone.update.push({
					id: newStructure[index].id,
					connectPostalCode: newStructure[index].connectPostalCode,
					name: newStructure[index].name
				})
				setUpdateCountryStructure(updateCountryStructureClone)
			}
		} else if(updateCountryStructure.addNew.some(add => add.level === index+1)){
			let updateCountryStructureClone = _.cloneDeep(updateCountryStructure);
			let structureInUpdateIndex = updateCountryStructureClone.addNew.findIndex(add => add.level === index+1)
			updateCountryStructureClone.addNew[structureInUpdateIndex].name = e.target.value;
			setUpdateCountryStructure(updateCountryStructureClone)
		}
	}

	const onChangeStructurePostalCode = (index) => {
		let newStructure = _.cloneDeep(countryStructure);
		newStructure[index].connectPostalCode = newStructure[index].connectPostalCode === "Y" ? "N" : "Y";
		setCountryStructure(newStructure);
		if(newStructure[index].id){
			let structureInUpdateIndex = updateCountryStructure.update.findIndex(update => update.id === newStructure[index].id)
			let updateCountryStructureClone = _.cloneDeep(updateCountryStructure);
			if(structureInUpdateIndex > 0){
				updateCountryStructureClone.update[structureInUpdateIndex].connectPostalCode === "Y" ? "N" : "Y";
				setUpdateCountryStructure(updateCountryStructureClone)
			} else {
				updateCountryStructureClone.update.push({
					id: newStructure[index].id,
					connectPostalCode: newStructure[index].connectPostalCode,
					name: newStructure[index].name
				})
				setUpdateCountryStructure(updateCountryStructureClone)
			}
		} else if(updateCountryStructure.addNew.some(add => add.level === index+1)){
			let updateCountryStructureClone = _.cloneDeep(updateCountryStructure);
			let structureInUpdateIndex = updateCountryStructureClone.addNew.findIndex(add => add.level === index+1)
			updateCountryStructureClone.addNew[structureInUpdateIndex].connectPostalCode = newStructure[index].connectPostalCode;
			setUpdateCountryStructure(updateCountryStructureClone)
		}
	};

	const { data: currencies, isLoading: isLoadingCurrencies } = useMdmCurrency({
		query: {
			limit: 10000,
			search: searchCurrency,
		},
	});
	const currencyList = currencies?.rows?.map((currency) => ({
		id: currency.id,
		value: currency.currencyName,
	}));

	const onAddToStructure = (tempUpdateAllStructure, level) => {
		let newUpdateAllStructure = _.cloneDeep(updateAllStructure);
		newUpdateAllStructure.addNew[level-1] = tempUpdateAllStructure.addNew
		newUpdateAllStructure.delete[level-1] = tempUpdateAllStructure.delete
		setUpdateAllStructure(newUpdateAllStructure);
		setShowManageData({ visible: false });
	};
	
	const [isLoading, setIsLoading] = useState(true);

	const {data: country} = useMdmCountry({
		country_id,
		options: {
			onSuccess: (data) => {
				setCountryBasic({
					name: data.name,
					currencyId: data.currencyId,
				});
				setCountryStructure(
					data.structure.map((data, index) => ({
						name: data.name,
						level: index + 1,
						id: data.id,
						connectPostalCode: data.connectPostalCode === "N" ? "N" : "Y",
					}))
				);

				setIsLoading(false);
			},
		},
	});

	const { mutate: deleteCountry } = useDeleteCountry({
		options: {
			onSuccess: () => {
				router.push(`/country`);
			},
		},
	});

	const onFocusRemoveValidation = (e) => {
		const newErrors = _.cloneDeep(errors);
		delete newErrors[e.target.name];
		setErrors(newErrors);
	};


	return (
		<>
			{isLoadingCurrencies || isLoading ? (
				<Center>
					<Spin tip="Loading data..." />
				</Center>
			) : (
				<Col>
					<Row gap="4px" alignItems="center">
						<ArrowLeft style={{ cursor: "pointer" }} onClick={() => Router.push("/country")} />
						<Text variant={"h4"}>{country?.name}</Text>
					</Row>
					<Spacer size={12} />
					<Card padding="20px">
						<Row justifyContent="flex-end" alignItems="center" nowrap>
							<Row>
								<Row gap="16px">
									<Button
										size="big"
										variant={"tertiary"}
										onClick={() => setModalDeleteCountry({ open: true })}
									>
										Delete
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
										label="Country Name"
										height="48px"
										placeholder={"e.g Indonesia"}
										value={countryBasic.name}
										onChange={(e) => setCountryBasic({ ...countryBasic, name: e.target.value })}
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
										onSearch={(search) => setSearchCurrency(search)}
										handleChange={(value) => {
											onFocusRemoveValidation({
												target: {
													name: "currency",
												},
											});
											setCountryBasic({ ...countryBasic, currencyId: value });
										}}
										error={errors.currency}
										required
										defaultValue={countryBasic.currencyId}
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
										<Button variant="tertiary" size="big">
											<Link
												href="https://mdm-portal.nabatisnack.co.id:3001/public/template/Template-Country-Structure.xlsx"
												target="_blank"
											>
												Download Template
											</Link>
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

								{countryStructure.map((structure, index) => (
									<>
										<Row key={index} width="100%" gap="16px" alignItems="flex-end" noWrap>
											<Input
												width="100%"
												label={`${stringifyNumber(index)} Level Name`}
												height="48px"
												placeholder={`Type ${stringifyNumber(index)} Level Name`}
												value={structure.name || ""}
												onChange={(e) => onChangeStructureName(e, index)}
												onBlur={(e) => onBlurStructureName(e, index)}
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
												checked={structure.connectPostalCode === "Y"}
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
				<ModalManageDataEdit
					updateAllStructure={updateAllStructure}
					visible={showManageData.visible}
					onCancel={() => setShowManageData({ visible: false })}
					structure={countryStructure[showManageData.index]}
					onAddToStructure={(tempAllStructure, level) => onAddToStructure(tempAllStructure, level)}
					level={countryStructure[showManageData.index].level}
					countryStructure={_.cloneDeep(countryStructure).slice(
						0,
						countryStructure[showManageData.index].level
					)}
				/>
			)}

			{modalDeleteCountry.open && (
				<ModalDeleteConfirmation
					itemTitle={countryBasic.name}
					visible={modalDeleteCountry.open}
					onOk={() => deleteCountry({ ids: [country_id] })}
					onCancel={() => setModalDeleteCountry({ open: false })}
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

const Link = styled.a`
	text-decoration: none;
	color: inherit;

	:hover,
	:focus,
	:active {
		text-decoration: none;
		color: inherit;
	}
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

export default CreateConfig;
