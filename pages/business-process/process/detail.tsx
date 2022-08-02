import Image from "next/image";
import Router from "next/router";
import { Accordion, Button, Col, Dropdown, Input, Row, Spacer, Spin, Text } from "pink-lava-ui";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ModalDeleteConfirmation } from "../../components/modals/ModalDeleteConfirmation";
import { useConfigs } from "../../hooks/config/useConfig";
import {
	useDeleteProcessList,
	useProcessList,
	useUpdateProcessList,
} from "../../hooks/process/useProcess";

const DetailProcessList: any = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [isApproval, setIsApproval] = useState(false);
	const [modalDelete, setModalDelete] = useState({ open: false });
	const [dataListDropdownModul, setDataListDropdownModul] = useState(null);
	const [stateFieldInput, setStateFieldInput] = useState({
		name: "",
	});
	const { name } = stateFieldInput;

	const {
		data: dataConfigsModule,
		refetch: refetchConfigModule,
		isLoading: isLoadingConfigModule,
	} = useConfigs();

	const {
		data: fieldProcessListById,
		refetch: refetchFieldProcessListById,
		isLoading: isLoadingProcessListById,
	} = useProcessList({
		options: {
			onSuccess: (data) => {
				if (data) {
					setStateFieldInput({ ...stateFieldInput, name: data.name });
					setDataListDropdownModul(data.moduleId);
				}
			},
		},
		process_list_id: Router.query.id,
	});

	const { mutate: deleteFields, isLoading: isLoadingDeleteProcessList } = useDeleteProcessList({
		options: {
			onSuccess: (data) => {
				setModalDelete({ open: false });
				Router.back();
			},
		},
	});

	const handleChangeInput = (e) => {
		setStateFieldInput({
			...stateFieldInput,
			[e.target.id]: e.target.value,
		});
	};

	const { mutate: updateFieldProcessList } = useUpdateProcessList({
		options: {
			onSuccess: (data) => {
				if (data) {
					setIsLoading(false);
					window.alert("Process updated successfully");
					Router.back();
				}
			},
			onSettled: (data, error) => {
				setIsLoading(false);
				window.alert(error.data.message);
			},
		},
		processListId: Router.query.id,
	});

	const handleUpdateProcessList = () => {
		setIsLoading(true);
		const isEmptyField = Object.keys(stateFieldInput).find(
			(thereIsEmptyField) => stateFieldInput && stateFieldInput[thereIsEmptyField] === ""
		);

		if (!isEmptyField) {
			const data = {
				name: name,
				module_id: dataListDropdownModul,
			};
			updateFieldProcessList(data);
		} else {
			setIsLoading(false);
			window.alert(`field ${isEmptyField} must be fill!`);
		}
	};

	const handleChangeDropdown = (value) => {
		setDataListDropdownModul(value);
	};

	useEffect(() => {
		if (fieldProcessListById) {
			setIsLoading(true);
			setTimeout(() => setIsLoading(false), 2000);
		}
	}, [fieldProcessListById]);

	return (
		<>
			<Col>
				<Row alignItems="center" gap="4px">
					<div onClick={() => Router.back()} style={{ cursor: "pointer" }}>
						<Image src="/arrow-left.svg" alt="arrow-left" width={32} height={32} />
					</div>
					<Text variant={"h4"}>{Router.query.name || "Unknown"}</Text>
				</Row>
				<Card padding="20px">
					<Row justifyContent="flex-end" alignItems="center" nowrap>
						<Row>
							<Row gap="16px">
								<Button
									size="big"
									variant={"tertiary"}
									onClick={() => setModalDelete({ open: true })}
								>
									Delete
								</Button>
								<Button size="big" variant={"primary"} onClick={handleUpdateProcessList}>
									{isLoading ? "loading..." : "Save"}
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
								{/* TODO: HIDE AFTER INCLUDING IN SPRINT */}
								{/* <Row alignItems="center" gap="4px">
									<Checkbox checked={isApproval} onChange={() => setIsApproval(!isApproval)} />
									<div style={{ cursor: "pointer" }} onClick={() => setIsApproval(!isApproval)}>
										<Text variant={"h6"}>Approval</Text>
									</div>
								</Row> */}
							</Row>
							<Row width="100%" gap="20px" noWrap>
								<Col width="100%">
									<Input
										id="name"
										width="100%"
										label="Name"
										height="48px"
										value={name}
										placeholder={"e.g Shipment and Delivery"}
										onChange={handleChangeInput}
									/>
								</Col>
								<Col width="100%">
									{isLoading ? (
										<Spin tip="Loading data..." />
									) : (
										<Dropdown
											width="100%"
											label="Modul"
											defaultValue={fieldProcessListById?.module?.name}
											loading={isLoadingConfigModule}
											items={
												dataConfigsModule &&
												dataConfigsModule?.rows.map((data) => ({ id: data.id, value: data.name }))
											}
											placeholder={"Select"}
											handleChange={handleChangeDropdown}
											noSearch
										/>
									)}

									{/* TODO: HIDE AFTER INCLUDING IN SPRINT */}
									{/* <div style={{ cursor: "pointer" }} onClick={() => {}}>
										<Text variant="headingSmall" color="pink.regular">
											Go to Associated Modul >
										</Text>
									</div> */}
								</Col>
							</Row>
						</Accordion.Body>
					</Accordion.Item>
				</Accordion>

				<Spacer size={20} />

				{/* TODO: HIDE AFTER INCLUDING IN SPRINT */}
				{/* <Accordion>
						<Accordion.Item key={1}>
							<Accordion.Header variant="blue">
								<Row gap="8px" alignItems="baseline">
									Associated Business Process <Span>(Auto added from BP Master Menu)</Span>
								</Row>
							</Accordion.Header>
							<Accordion.Body>
								<Accordion>
									<Accordion.Item key={1}>
										<Accordion.Header>Roles</Accordion.Header>
										<Accordion.Body padding="0px">
											{mockDataBusinessProcess.map((data) => (
												<Record key={data.id}>
													{data.name}

													<Button size="small" onClick={() => {}} variant="tertiary">
														View Detail
													</Button>
												</Record>
											))}
										</Accordion.Body>
									</Accordion.Item>
								</Accordion>
							</Accordion.Body>
						</Accordion.Item>
					</Accordion> */}
			</Col>

			{modalDelete.open && (
				<ModalDeleteConfirmation
					itemTitle={Router.query.name}
					visible={modalDelete.open}
					isLoading={isLoadingDeleteProcessList}
					onCancel={() => setModalDelete({ open: false })}
					onOk={() => deleteFields({ ids: [Number(Router.query.id)] })}
				/>
			)}
		</>
	);
};

const Span = styled.div`
	font-size: 14px;
	line-height: 18px;
	font-weight: normal;
	color: #ffe12e;
`;

const Record = styled.div`
	height: 54px;
	padding: 0px 20px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-top: ${(p) => (p.borderTop ? "0.5px solid #AAAAAA" : "none")};
`;

const Card = styled.div`
	background: #ffffff;
	border-radius: 16px;
	padding: ${(p) => (p.padding ? p.padding : "16px")};
`;

export default DetailProcessList;
