import React, { useState } from "react";
import {
	Text,
	Col,
	Row,
	Spacer,
	Dropdown,
	Table,
	Button,
	Accordion,
	Input,
	Modal,
	Search,
	Pagination,
	AccordionCheckbox,
} from "pink-lava-ui";
import styled from "styled-components";
import Router, { useRouter } from "next/router";
import ArrowLeft from "../../assets/arrow-left.svg";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import usePagination from "@lucasmogari/react-pagination";
import {
	useCreatePartnerConfigRole,
	usePartnerConfigMenuPermissionLists,
} from "../../hooks/partner-config-role-list/usePartnerConfigRoleList";

const schema = yup
	.object({
		name: yup.string().required("Full Name is Required"),
	})
	.required();

const defaultValue = {
	activeStatus: "Y",
};

const CreateRole: any = () => {
	const router = useRouter();
	const [permissionsIds, setPermissions] = useState();

	const pagination = usePagination({
		page: 1,
		itemsPerPage: 10,
		maxPageItems: Infinity,
		numbers: true,
		arrows: true,
		totalItems: 100,
	});

	const [search, setSearch] = useState("");
	const [filterMenu, setFilterMenu] = useState("");
	const [filterChecked, setFilterChecked] = useState();

	const { data: menuLists } = usePartnerConfigMenuPermissionLists({
		query: {
			search,
		},
		options: {},
	});

	const [showModal, setShowModal] = useState({
		visible: false,
	});

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(schema),
		defaultValues: defaultValue,
	});

	const { mutate: createRole } = useCreatePartnerConfigRole({
		options: {
			onSuccess: () => {
				router.push("/partner-config-role-list");
			},
		},
	});

	const activeStatus = [
		{ id: "Y", value: '<div key="1" style="color:green;">Active</div>' },
		{ id: "N", value: '<div key="2" style="color:red;">Non Active</div>' },
	];

	const onSubmit = (data) => {
		const payload = {
			...data,
			permissions: permissionsIds,
		};

		createRole(payload);
	};

	const columnsFieldCategory = [
		{
			title: "Item Category ID",
			dataIndex: "field_id",
		},
		{
			title: "Item Category Name",
			dataIndex: "field_name",
		},
	];

	const [itemCategory, setSelectedItemCategory] = useState([]);
	const [tempItemCategory, setSelectedTempItemCategory] = useState([]);

	const fields = [];
	const dataTableFieldCategory = [];
	const menu = menuLists?.map((menu) => ({ id: menu.id, value: menu.name }));
	menu?.unshift({ id: "all", value: "All" });
	const permissionFilter = [
		{ id: "all", value: "All" },
		{ id: "checked", value: "checked" },
		{ id: "unchecked", value: "unchecked" },
	];

	menuLists?.forEach((menu) => {
		menu?.field?.forEach((field) => {
			fields.push({ value: field.id, label: field.name });
			dataTableFieldCategory.push({
				key: field.id,
				field_id: field.id,
				field_name: field.name,
			});
		});
	});

	let filteredMenu = menuLists || [];
	if (filterMenu && filterMenu !== "all") {
		filteredMenu = filteredMenu.filter((menu) => menu.id === filterMenu);
	}

	if (filterChecked !== "all" && permissionsIds?.length > 0) {
		const checkedMenu = [];
		const unCheckedMenu = [];
		filteredMenu?.forEach((menu) => {
			if (menu.permission.some((permission) => permissionsIds.includes(permission.id))) {
				checkedMenu.push(menu);
			} else {
				unCheckedMenu.push(menu);
			}
		});

		filteredMenu =
			filterChecked === "checked"
				? checkedMenu
				: filterChecked === "unchecked"
				? unCheckedMenu
				: filteredMenu;
	}

	const clearFilter = () => {
		setFilterMenu("All");
		setFilterChecked("All");
		setSearch("");
	};

	const onChangeItemCategoryTable = (key) => {
		const itemCategorySelected = [];
		key?.forEach((key) => {
			fields?.forEach((field) => {
				if (field.value === key) {
					itemCategorySelected.push({ value: field.value, label: field.label });
				}
			});
		});
		setSelectedTempItemCategory(itemCategorySelected);
	};

	const applyTempCategoryToCategory = () => {
		setSelectedItemCategory(tempItemCategory);
		setShowModal({ visible: false });
	};

	const rowSelection = {
		selectedRowKeys: tempItemCategory.map((item) => item.value),
		onChange: onChangeItemCategoryTable,
	};

	let fieldsMenu = [];

	if (filteredMenu?.length > 0) {
		for (let i = 0; i < filteredMenu.length; i++) {
			fieldsMenu = fieldsMenu.concat(filteredMenu[i].field);
		}
	}

	return (
		<>
			<Col>
				<Row gap="4px" alignItems="center">
					<ArrowLeft
						style={{ cursor: "pointer" }}
						onClick={() => Router.push("/partner-config-role-list")}
					/>
					<Text variant={"h4"}>Create Role</Text>
				</Row>
				<Spacer size={12} />
				<Card padding="20px">
					<Row justifyContent="space-between" alignItems="center" nowrap>
						<Dropdown
							label=""
							isHtml
							width={"185px"}
							items={activeStatus}
							placeholder={"Status"}
							handleChange={(text) => setValue("activeStatus", text)}
							noSearch
							defaultValue="Y"
						/>
						<Row>
							<Row gap="16px">
								<Button
									size="big"
									variant={"tertiary"}
									onClick={() => Router.push("/partner-config-role-list")}
								>
									Cancel
								</Button>
								<Button size="big" variant={"primary"} onClick={handleSubmit(onSubmit)}>
									Save
								</Button>
							</Row>
						</Row>
					</Row>
				</Card>

				{/* <Spacer size={20} />
        <Alert><Text variant="subtitle2" color="white">“General” Associated Menu must be filled.</Text></Alert> */}
				<Spacer size={20} />

				<Accordion>
					<Accordion.Item key={1}>
						<Accordion.Header variant="blue">General</Accordion.Header>
						<Accordion.Body>
							<Row width="50%" gap="20px" noWrap>
								<Input
									width="100%"
									label="Name"
									height="48px"
									placeholder={"e.g Sales Admin"}
									{...register("name", { required: true })}
								/>
							</Row>
						</Accordion.Body>
					</Accordion.Item>
				</Accordion>

				<Spacer size={20} />

				<Accordion>
					<Accordion.Item key={1}>
						<Accordion.Header variant="blue">
							<Row gap="8px" alignItems="baseline">
								Permissions
							</Row>
						</Accordion.Header>
						<Accordion.Body>
							<Col>
								<Row gap="45px" alignItems="center" width="100%" noWrap>
									<Row gap="20px" width="100%" alignItems="center" noWrap>
										<Input
											width="300px"
											label="Search"
											height="48px"
											placeholder={"Search permissions"}
											onChange={(e) => setSearch(e.target.value)}
										/>
										<Dropdown
											label="Menu (Filter)"
											width={"300px"}
											items={menu}
											placeholder={"Select"}
											handleChange={(value) => setFilterMenu(value)}
											noSearch
											defaultValue="All"
										/>
										<Dropdown
											label="Permissions (Filter)"
											width={"300px"}
											items={permissionFilter}
											placeholder={"Select"}
											handleChange={(value) => setFilterChecked(value)}
											noSearch
											defaultValue="All"
										/>
									</Row>
									<Text
										style={{ marginTop: "20px" }}
										clickable
										color="pink.regular"
										variant="button"
										width="92px"
										onClick={clearFilter}
									>
										Clear Filter
									</Text>
								</Row>

								<Spacer size={20} />

								<Col gap="20px">
									{filteredMenu?.map((menu) => (
										<AccordionCheckbox
											key={menu.id}
											lists={menu?.permission?.map((permission) => ({
												id: permission?.id,
												value: permission?.name,
											}))}
											name={menu.name}
											checked={permissionsIds}
											onChange={(data) => {
												setPermissions(data);
											}}
										/>
									))}
								</Col>
							</Col>
						</Accordion.Body>
					</Accordion.Item>
				</Accordion>
			</Col>

			<Modal
				width={880}
				visible={showModal.visible}
				onCancel={() => setShowModal({ visible: false })}
				title={"Item Category"}
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
						<Button
							onClick={() => {
								setShowModal({ visible: false });
								setSelectedTempItemCategory(itemCategory);
							}}
							variant="tertiary"
							size="big"
						>
							Cancel
						</Button>
						<Button onClick={applyTempCategoryToCategory} variant="primary" size="big">
							Apply
						</Button>
					</div>
				}
				content={
					<>
						<Spacer size={38} />
						<Row alignItems="flex-end" justifyContent="space-between">
							<Search
								width="360px"
								placeholder="Search Item Category ID, Name"
								onChange={(e) => {}}
							/>
						</Row>
						<Spacer size={32} />
						<div style={{ height: "480px", width: "100%" }}>
							<Table
								columns={columnsFieldCategory}
								data={dataTableFieldCategory}
								rowSelection={rowSelection}
							/>
						</div>
						<Pagination pagination={pagination} />
						<Spacer size={14} />
					</>
				}
			/>
		</>
	);
};

const Card = styled.div`
	background: #ffffff;
	border-radius: 16px;
	padding: ${(p) => (p.padding ? p.padding : "16px")};
`;

export default CreateRole;
