import React, { useState } from "react";
import {
	Text, Col, Row,
	Spacer, Button, Input,
	Switch, FileUploaderExcel, Spin,
} from "pink-lava-ui";
import styled from "styled-components";
import { ModalDeleteConfirmation } from "../../components/elements/Modal/ModalConfirmationDelete";
import _ from "lodash";
import { useSalesOrganization, useUpdateSalesOrganization, useCreateSalesOrganization } from "../../hooks/sales-organization/useSalesOrganization";
import { ModalManageDataEdit } from "../../components/elements/Modal/ModalManageDataSalesOrganization";
import axios from "axios";
import { lang } from "lang";

const COMPANY_CODE = 'KSNI';

let token;
let apiURL = process.env.NEXT_PUBLIC_API_BASE3;

if (typeof window !== "undefined") {
	token = localStorage.getItem("token");
}

const CreateConfig = () => {
    const t = localStorage.getItem("lan") || "en-US";
	const [countryStructure, setCountryStructure] = useState([]);
	const [modalDelete, setModalDelete] = useState({ index: -1, open: false, structure: {} });
	const [showUploadStructure, setShowUploadStructure] = useState();
    const [isEditMode, setIsEditMode] = useState(false);
    const [showManageData, setShowManageData] = useState({
		visible: false,
		index: null,
	});
    const [isNew, setIsNew] = useState(true);

	const onUploadStructure = (data: ({ [s: string]: unknown; } | ArrayLike<unknown>)[]) => {
		let idCountryStructure = countryStructure[0];

        const payload = {
            add: [],
            update: []
        }

        if(idCountryStructure){
            payload.delete = idCountryStructure.id;
        }

        updateSalesOrganization(payload)

		const datas = Object.values(data[0]).filter(data => !!data).map((data, index) => ({
			name: data,
			level: index + 1,
            actionType: 'NEW'
		}));

        setCountryStructure(datas)

        const datasPayload = datas.map(({actionType, ...rest}) => ({
            ...rest
        }));

        const payloadUpdate = {
            add: datasPayload,
            update: []
        }
        updateSalesOrganization(payloadUpdate)
	};

	function stringifyNumber(n) {
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
            "11th",
            "12th",
            "13th",
            "14th",
            "15th",
            "16th",
            "17th",
            "18th",
            "19th",
            "20th"
		];
		return special[n];
	}

	const onChangeStructureName = (e, index, isNew) => {
		let newStructure = _.cloneDeep(countryStructure);
		newStructure[index].name = e.target.value;
        newStructure[index].actionType = isNew ? "NEW" : "UPDATE"
		setCountryStructure(newStructure);
	};

	const { isLoading, refetch: refetchSalesOrganization } = useSalesOrganization({
        company_code: COMPANY_CODE,
		options: {
			onSuccess: (data: any) => {
                setIsNew(false);
				setCountryStructure(
					data.salesOrganizationStructures.map((data: any, index: string) => ({
						name: data.name,
						level: index + 1,
						id: data.id
					}))
				);
			},
		}
	});

    const { mutate: updateSalesOrganization } = useUpdateSalesOrganization({
        company_code: COMPANY_CODE,
		options: {
			onSuccess: () => {
				refetchSalesOrganization()
			},
		}
	});

    const { mutate: createSalesOrganization } = useCreateSalesOrganization({
		options: {
			onSuccess: () => {
				refetchSalesOrganization()
			},
		},
	});

    const onDeleteStructure = () => {
        if(modalDelete.structure.id){
            onDeleteOldStructure()
        } else {
            onDeleteNewStructure();
        }
    }

    const onDeleteNewStructure = () => {
        setModalDelete({ open: false, index: -1, structure: {} })
        const newCountryStructure = countryStructure.slice(0, modalDelete.index);
		setCountryStructure(newCountryStructure);
	};

    const onDeleteOldStructure = () => {
        setModalDelete({ open: false, index: -1, structure: {} })
        let currentStructure = { ...countryStructure[modalDelete.index] };

        const payload = {
            add: [],
            update: [],
            delete: currentStructure.id
        }
        updateSalesOrganization(payload)
	};

    const addStructure = () => {
		let newStructure = countryStructure.slice();
		newStructure.push({
			level: countryStructure.length + 1,
			name: "",
            actionType: "NEW"
		});
		setCountryStructure(newStructure);
	};

    const onSubmit = () => {
        let payload = {}
        if(isNew){
            payload = {
                company_code: COMPANY_CODE,
                data: countryStructure.filter(data => data.actionType === "NEW").map(({actionType, ...rest}) => ({
                    ...rest
                }))
            }
        } else {
            payload = {
                add: countryStructure.filter(data => data.actionType === "NEW").map(({actionType, ...rest}) => ({
                    ...rest
                })),
                update: countryStructure.filter(data => data.actionType === "UPDATE").map(({actionType, level, ...rest}) => ({
                    ...rest
                }))
            }
        }
	    isNew ? createSalesOrganization(payload) : updateSalesOrganization(payload);
	};

    const isDisabled = !isEditMode;

    const donwloadStructure = async(value) => {
		return await axios
		.get(apiURL + `/sales-org/structure/${COMPANY_CODE}`, {
			responseType: 'blob',
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
			tempLink.setAttribute('download', `sales_organization_structure_template.xlsx`);
			tempLink.click();
		});
	}

	return (
		<>
			{isLoading ? (
				<Center>
					<Spin tip="Loading data..." />
				</Center>
			) : (
				<Col>
					<Row gap="4px" alignItems="center" justifyContent="space-between">
						<Text variant={"h4"}>{lang[t].salesOrganization.pageTitle.salesOrganization}</Text>
                        <Button size="big" variant={"primary"} onClick={() => {
                            if(isEditMode){
                                onSubmit();
                                setIsEditMode(false);
                             } else {
                                setIsEditMode(true)
                             }
                        }}>
							{isEditMode ? lang[t].salesOrganization.primary.save : lang[t].salesOrganization.primary.edit}
						</Button>
					</Row>

					<Spacer size={20} />

					<Card>
                        <Row width="100%" gap="20px" noWrap>
                            <DownloadUploadContainer>
                                <Text variant="headingMedium">{lang[t].salesOrganization.salesOrganizationDownloadandFill}</Text>
                                <Spacer size={4} />
                                <Text variant="body2" color="black.dark">
                                    {lang[t].salesOrganization.emptyState.labelTemplate}
                                </Text>
                                <Spacer size={10} />
                                <Button variant="tertiary" size="big" disabled={isDisabled} onClick={donwloadStructure}>
                                    {lang[t].salesOrganization.ghost.downloadTemplate}
                                </Button>
                            </DownloadUploadContainer>

                            <DownloadUploadContainer>
                                <Text variant="headingMedium">{lang[t].salesOrganization.salesOrganizationUploadTemplate}</Text>
                                <Spacer size={4} />
                                <Text variant="body2" color="black.dark">
                                    {lang[t].salesOrganization.emptyState.labelUpload}
                                </Text>
                                <Spacer size={10} />
                                <Button
                                    variant="tertiary"
                                    size="big"
                                    onClick={() => setShowUploadStructure(true)}
                                    disabled={isDisabled}
                                >
                                    {lang[t].salesOrganization.ghost.uploadTemplate}
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
                                        label={`${t == "en-US" ? stringifyNumber(index) : ""} ${lang[t].salesOrganization.emptyState.levelName} ${t == "id-ID" ? stringifyNumber(index).substring(0, stringifyNumber(index).length - 2) : ""}`}
                                        height="48px"
                                        placeholder={`Type ${stringifyNumber(index)} Level Name`}
                                        value={structure.name || ""}
                                        onChange={(e: any) => onChangeStructureName(e, index, structure.actionType === "NEW")}
                                        disabled={isDisabled}
                                    />
                                    <Row width="41%" noWrap style={{ marginBottom: "5px" }}>
                                        <Button
                                            variant="tertiary"
                                            size="big"
                                            onClick={() => setModalDelete({ open: true, index: index, structure })}
                                            disabled={isDisabled}
                                        >
                                            {lang[t].salesOrganization.tertier.delete}
                                        </Button>
                                        <Spacer size={16} />
                                        <Button
                                            variant="primary"
                                            size="big"
                                            onClick={() => {
                                                onSubmit();
                                                setShowManageData({ visible: true, index })
                                            }}
                                            disabled={isDisabled}
                                        >
                                            {lang[t].salesOrganization.primary.manageData}
                                        </Button>
                                    </Row>
                                </Row>
                                <Spacer size={20} />
                                <Divider />
                                <Spacer size={20} />
                            </>
                        ))}
                        {countryStructure.length < 20 && (
                            <Button disabled={isDisabled} variant="ghost" size="big" onClick={() => addStructure()}>
                                + {lang[t].salesOrganization.buttonAdd.structureLevel}
                            </Button>
                        )}
					</Card>
				</Col>
			)}
			{modalDelete.open && (
				<ModalDeleteConfirmation
					visible={modalDelete.open}
					onCancel={() => setModalDelete({ open: false, index: -1, structure: {} })}
					onOk={onDeleteStructure}
					itemTitle={modalDelete.structure.name}
				/>
			)}
			{showUploadStructure && <FileUploaderExcel
				setVisible={setShowUploadStructure}
				visible={showUploadStructure}
				onSubmit={onUploadStructure}
			/>}

            {showManageData.visible && (
				<ModalManageDataEdit
					visible={showManageData.visible}
					onCancel={() => setShowManageData({ visible: false })}
					structure={countryStructure[showManageData.index]}
                    parentId={countryStructure?.[showManageData.index-1]?.id ?? null}
					onSubmit={() => {
                        onSubmit();
                        setIsEditMode(false)
                        setShowManageData({ visible: false });
                    }}
                    countryStructure={countryStructure}
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
