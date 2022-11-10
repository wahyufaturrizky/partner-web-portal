import React, { useEffect, useState } from "react";
import Router from "next/router";
import {
	Accordion,
	Button,
	Checkbox,
	Col,
	Dropdown,
	Input,
	Row,
	Spacer,
	Switch,
	Table,
	Text,
	EmptyState,
	Pagination,
	FormSelect,
	Spin
} from "pink-lava-ui";
import styled from "styled-components";

import { useConfigs } from "../../../hooks/config/useConfig";
import { useCreatePartnerConfigApprovalList } from "../../../hooks/user-config/useApproval";
import { usePermissions } from "../../../hooks/permission/usePermission";
import { useProcessLists } from "../../../hooks/business-process/useProcess";
import usePagination from "@lucasmogari/react-pagination";
import { useUserInfiniteList } from "hooks/user-config/useUser";
import useDebounce from "lib/useDebounce";

export interface ConfigModuleList {}

const CreatePartnerConfigApproval: any = () => {
	const [dataListDropdownModul, setDataListDropdownModul] = useState(null);
	const [dataListDropdownProcess, setDataListDropdownProcess] = useState(null);
	const [dataListDropdownPermission, setDataListDropdownPermission] = useState(null);
	const [isSendEmailNotif, setisSendEmailNotif] = useState(false);
	const [approvalStages, setApprovalStages] = useState([]);
	const [stateFieldInput, setStateFieldInput] = useState({
		name: "",
		numberOfApprovalStage: 1,
	});
	const { name, numberOfApprovalStage } = stateFieldInput;
	const [errors, setErrors] = useState({
		name: '',
		permission: '',
		numberOfApprovalStage: ''
	})
	const [searchTop, setSearchTop] = useState("");
  const debounceSearchTop = useDebounce(searchTop, 1000);
	const [listTop, setListTop] = useState<any[]>([]);
  const [totalRowsTop, setTotalRowsTop] = useState(0);

	const pagination = usePagination({
		page: 1,
		itemsPerPage: 10,
		maxPageItems: Infinity,
		numbers: true,
		arrows: true,
		totalItems: numberOfApprovalStage,
	});


	const handleChangeInput = (e) => {
		if (e.target.id === "numberOfApprovalStage") {
			if(e.target.value > 50){
				setErrors(prev => ({ ...prev, numberOfApprovalStage: `The number of approval stages can't be more than 50 stages`}))
				setStateFieldInput({
					...stateFieldInput,
					[e.target.id]: 50,
				});
			} else {
				setStateFieldInput({
					...stateFieldInput,
					[e.target.id]: e.target.value,
				});
			}
		} else {
			setStateFieldInput({
				...stateFieldInput,
				[e.target.id]: e.target.value,
			});
		}
	};

	const {
		mutate: mutateCreatePartnerConfigApprovalList,
		isLoading: isLoadingCreatePartnerConfigApprovalList,
	} = useCreatePartnerConfigApprovalList({
		options: {
			onSuccess: (data: any) => {
				if (data) {
					Router.back();
				}
			}
		},
	});

	const { data: dataConfigsModule, isLoading: isLoadingConfigModule } = useConfigs({
		options: {
			refetchOnWindowFocus: "always",
		},
	});

	const { data: fieldsListProcess, isLoading: isLoadingFieldListProcess } = useProcessLists({
		options: {
			refetchOnWindowFocus: "always",
		},
	});

	const { data: fieldsPermissionList, isLoading: isLoadingFieldsPermissionList } = usePermissions({
		options: {
			refetchOnWindowFocus: "always",
		},
	});

	const {
    isLoading: isLoadingTop,
    isFetching: isFetchingTop,
    isFetchingNextPage: isFetchingMoreTop,
    hasNextPage: hasNextTop,
    fetchNextPage: fetchNextPageTop,
  } = useUserInfiniteList({
    query: {
      search: debounceSearchTop,
      company_id: "KSNI",
      limit: 10,
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRowsTop(data?.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => {
          return group.rows?.map((element: any) => {
            return {
              label: element.name,
              value: element.topId,
            };
          });
        });
        const flattenArray = [].concat(...mappedData);
        setListTop(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (listTop.length < totalRowsTop) {
          return pages.length + 1;
        } else {
          return undefined;
        }
      },
    },
  });

	const handleCreateProcessList = () => {
		if(stateFieldInput['name'] === '' || !dataListDropdownPermission){
			let errors:any = {};
			if(stateFieldInput['name'] === ''){
				errors.name = 'Field Name is Required'
			}
			if(!dataListDropdownPermission){
				errors.permission = 'Field Permission is Required'
			}

			setErrors(errors);
			return;
		}

		const data: any = {
			name: name,
			module_id: dataListDropdownModul,
			process_id: dataListDropdownProcess,
			partner_permission_id: dataListDropdownPermission,
			approval_stages: approvalStages.map((dataApprovalStages) => ({
				is_mandatory: dataApprovalStages.is_mandatory,
			})),
			is_email_notification: isSendEmailNotif,
		};
		mutateCreatePartnerConfigApprovalList(data);
	};

	const handleChangeDropdown = (value: any, name: any) => {
		if (name === "module") {
			setDataListDropdownModul(value);
		} else if (name === "process") {
			setDataListDropdownProcess(value);
		} else {
			setDataListDropdownPermission(value);
		}
	};

	const handleDirectAssociated = (name: any) => {
		window.open(`/${name}/create`, "_blank");
	};

	const columnsAssociatedRoles = [
		{
			title: "Stage",
			dataIndex: "stage",
		},
		{
			title: "Role",
			dataIndex: "role",
			render: (value: any) => (
				<Dropdown
					width="200px"
					loading={isLoadingConfigModule}
					items={[{ id: 1, value: "stage 1" }]}
					placeholder={"Select"}
					noSearch
				/>
			),
		},
		{
			title: "User",
			dataIndex: "user",
			render: (value: any) => {
				console.log('value 1', value)
				return (
					<>
						{isLoadingTop ? (
							<Center>
								<Spin tip="" />
							</Center>
						) : (
							<>
								<FormSelect
									defaultValue={value}
									style={{ width: "100%", height: "48px" }}
									size={"large"}
									placeholder={"Select"}
									borderColor={"#AAAAAA"}
									arrowColor={"#000"}
									withSearch
									isLoading={isFetchingTop}
									isLoadingMore={isFetchingMoreTop}
									fetchMore={() => {
										if (hasNextTop) {
											fetchNextPageTop();
										}
									}}
									items={isFetchingTop && !isFetchingMoreTop ? [] : listTop}
									onChange={(value: any) => {
										console.log('value 2', value)
										//onChange(value?.toString());
									}}
									onSearch={(value: any) => {
										setSearchTop(value);
									}}
								/>
							</>
						)}
					</>
				)
			},
		},
		{
			title: 'Cc Email',
			dataIndex: 'cc_email',
			align: 'center',
			render: (value: any) => (
				<Switch
					defaultChecked={isSendEmailNotif}
					checked={isSendEmailNotif}
					onChange={() => setisSendEmailNotif(!isSendEmailNotif)}
				/>
			)
		},
		{
			title: "Action",
			dataIndex: "action",
			width: "15%",
      align: "left",
		},
	];

	useEffect(() => {
		let tempApprovalStages: any = [];

		Array.apply(null, { length: numberOfApprovalStage }).map((data, index) => {
			tempApprovalStages.push({ is_mandatory: false, id: index });
		});

		setApprovalStages(tempApprovalStages);
	}, [numberOfApprovalStage]);


	const dataTable = approvalStages.map((data:any, index) => ({
		key: 1,
		stage: `Stage ${data.id + 1}`,
		action: (
			<div style={{ display: "flex", justifyContent: "left" }}>
				<Button size="small" onClick={() => {}} variant="tertiary">
					View Detail
				</Button>
			</div>
		),
	}))

	const page = pagination?.page;
	const paginateTableData = dataTable?.slice(10 * (page - 1), 10 * page) || [];

	return (
		<>
			<Col>
				<Row gap="4px">
					<Text variant="h4">Create Approval</Text>
				</Row>
				<Spacer size={20} />
				<Card>
					<Row justifyContent="space-between" alignItems="center" nowrap>
						<Row alignItems="center" gap="4px" noWrap>
							<Row alignItems="center"	width="100%"  gap="4px" noWrap>
								<Switch
									defaultChecked={isSendEmailNotif}
									checked={isSendEmailNotif}
									onChange={() => setisSendEmailNotif(!isSendEmailNotif)}
								/>
								<div
									style={{ cursor: "pointer" }}
									onClick={() => setisSendEmailNotif(!isSendEmailNotif)}
								>
									<Text variant={"h6"}>Email Notification</Text>
								</div>
							</Row>
							<Spacer size={8} />
							<Input
								id="reminder_day"
								width="230px"
								label=""
								height="42px"
								placeholder={"Type e.g 1 Reminder (Days)"}
								onChange={handleChangeInput}
							/>
						</Row>

						<Row>
							<Row gap="16px">
								<Button size="big" variant={"tertiary"} onClick={() => Router.back()}>
									Cancel
								</Button>
								<Button size="big" variant={"primary"} onClick={handleCreateProcessList}>
									{isLoadingCreatePartnerConfigApprovalList ? "loading..." : "Save"}
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
							</Row>
							<Row width="100%" gap="20px" noWrap>
								<Col width="100%">
									<Input
										id="name"
										width="100%"
										label="Name"
										height="48px"
										placeholder={"e.g Shipment and Delivery"}
										onChange={handleChangeInput}
										error={errors?.name}
										required
									/>
								</Col>
								<Col width="100%">
									<Dropdown
										width="100%"
										label="Module"
										id="Module"
										loading={isLoadingConfigModule}
										items={
											dataConfigsModule &&
											dataConfigsModule?.rows.map((data) => ({ id: data.id, value: data.name }))
										}
										placeholder={"Select"}
										handleChange={(value) => handleChangeDropdown(value, "module")}
										noSearch
									/>
									<Spacer size={9} />
									<Text
										onClick={() => handleDirectAssociated("module-config")}
										clickable
										variant="headingSmall"
										color="pink.regular"
									>
										Go to Associated Module
									</Text>
								</Col>
							</Row>
							<Spacer size={13} />
							<Row width="100%" gap="20px" noWrap>
								<Col width="100%">
									<Dropdown
										width="100%"
										label="Process"
										loading={isLoadingFieldListProcess}
										items={
											fieldsListProcess &&
											fieldsListProcess?.rows.map((data) => ({ id: data.id, value: data.name }))
										}
										placeholder={"Select"}
										handleChange={(value) => handleChangeDropdown(value, "process")}
										noSearch
									/>
									<Spacer size={9} />
									<Text
										onClick={() => handleDirectAssociated("business-process/process")}
										variant="headingSmall"
										color="pink.regular"
										clickable
									>
										Go to Associated Process
									</Text>
								</Col>

								<Col width="100%">
									<Dropdown
										width="100%"
										label="Permission"
										loading={isLoadingFieldsPermissionList}
										items={
											fieldsPermissionList &&
											fieldsPermissionList?.rows.map((data) => ({ id: data.id, value: data.name }))
										}
										placeholder={"Select"}
										handleChange={(value) => handleChangeDropdown(value, "permission")}
										noSearch
										error={errors.permission}
										required
									/>
									<Spacer size={9} />
									<Text
										onClick={() => handleDirectAssociated("user-config/permission")}
										variant="headingSmall"
										color="pink.regular"
										clickable
									>
										Go to Associated Permission
									</Text>
								</Col>
							</Row>
						</Accordion.Body>
					</Accordion.Item>
				</Accordion>

				<Spacer size={20} />

				<Accordion>
					<Accordion.Item key={1}>
						<Accordion.Header variant="blue">Approval</Accordion.Header>
						<Accordion.Body>
							<Row width="100%" gap="20px" noWrap>
							</Row>
							<Row width="100%" gap="20px" noWrap>
								<Col width="50%">
									<Input
										id="numberOfApprovalStage"
										width="100%"
										label="How Many Approval Stage?"
										height="48px"
										defaultValue={numberOfApprovalStage}
										placeholder={"e.g 1"}
										onChange={handleChangeInput}
										type="number"
										error={errors.numberOfApprovalStage}
										onFocus={
											() => setErrors(prev => ({ ...prev, numberOfApprovalStage: ``}))
										}
									/>
									<Spacer size={9} />
									<Text clickable variant="headingSmall">
										Choose mandatory approval stages
									</Text>

									<Spacer size={24} />

									<Grid gap="24px" width="100%">
										{approvalStages.map((data, index) => (
											<Col key={index}>
												<Row alignItems="center">
													<Checkbox
														checked={data.is_mandatory}
														onChange={() => {
															const temp = approvalStages.map((subdata) => {
																if (data.id === subdata.id) {
																	return { ...subdata, is_mandatory: !data.is_mandatory };
																} else {
																	return subdata;
																}
															});

															setApprovalStages(temp);
														}}
													/>
													<div
														style={{ cursor: "pointer" }}
														onClick={() => {
															const temp = approvalStages.map((subdata) => {
																if (data.id === subdata.id) {
																	return { ...subdata, is_mandatory: !data.is_mandatory };
																} else {
																	return subdata;
																}
															});

															setApprovalStages(temp);
														}}
													>
														<Text variant={"h6"}>Stage {index + 1}</Text>
													</div>
												</Row>
											</Col>
										))}
										<Spacer size={5} />
									</Grid>
								</Col>
							</Row>
						</Accordion.Body>
					</Accordion.Item>
				</Accordion>

				<Spacer size={20} />

				<Accordion>
					<Accordion.Item key={1}>
						<Accordion.Header variant="blue">Associated Roles</Accordion.Header>
						<Accordion.Body>
							{approvalStages.length === 0 ? (
								<Col>
									<Text variant="body1" color="cheese.darker">*Auto added from permission Approval Payment is in the Role below</Text>
									<Spacer size={20} />
									<EmptyState
										image={"/icons/empty-state.svg"}
										title={"There's no associated role & user yet"}
										subtitle={`Please add permission to a user/role`}
										height={214}
									/>
								</Col>
							) : (
								<Col>
									<Text variant="body1" color="cheese.darker">*Auto added from permission Approval Payment is in the Role below</Text>
									<Spacer size={20} />
									<Table
										data={paginateTableData}
										columns={columnsAssociatedRoles}
									/>
									{pagination.totalItems > 5 && <Pagination pagination={pagination} />}
								</Col>
							)}
						</Accordion.Body>
					</Accordion.Item>
				</Accordion>
			</Col>
		</>
	);
};

const Grid = styled.div`
	width: 100%;
	display: grid;
	grid-template-columns: repeat(10, 100px);
	gap: 40px 10px;
`
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
	border-top: ${(p) => (p.borderTop ? "0.5px solid #AAAAAA" : "none")};
`;

const Card = styled.div`
	background: #ffffff;
	border-radius: 16px;
	padding: ${(p) => (p.padding ? p.padding : "16px")};
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default CreatePartnerConfigApproval;
