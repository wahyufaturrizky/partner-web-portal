import React, { useState } from "react";
import Router, { useRouter } from "next/router";
import usePagination from "@lucasmogari/react-pagination";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import styled from "styled-components";
import {
	Text,
	Col,
	Row,
	Spacer,
	Dropdown,
	Table,
	Alert,
	Button,
	Accordion,
	Spin,
	Input,
	Modal,
	Search,
	Pagination,
	FormSelect,
	AccordionCheckbox,
} from "pink-lava-ui";

import ArrowLeft from "../../../assets/icons/arrow-left.svg";
import { ModalDeleteConfirmation } from "../../../components/elements/Modal/ModalConfirmationDelete";
import { useDeletePermission, useMenuPermissionLists } from "../../../hooks/permission/usePermission"
import { useUpdateRole, useRole } from "../../../hooks/user-config/useRole";
import { useCompanyInfiniteLists } from "hooks/company-list/useCompany";
import useDebounce from "lib/useDebounce";
import { lang } from "lang";

const schema = yup
	.object({
		name: yup.string().required("Full Name is Required"),
	})
	.required();

const defaultValue = {
	activeStatus: "Y",
};

const DetailRoleConfig: any = () => {
	const router = useRouter();
	const t = localStorage.getItem("lan") || "en-US";
	const { role_id } = router.query;
	const [modalDelete, setModalDelete] = useState({ open: false });

	const pagination = usePagination({
		page: 1,
		itemsPerPage: 20,
		maxPageItems: Infinity,
		numbers: true,
		arrows: true,
		totalItems: 100,
	});

	const [search, setSearch] = useState("");
	const [filterMenu, setFilterMenu] = useState("");
	const [filterChecked, setFilterChecked] = useState<any>(null);
	const [permissionsIds, setPermissions] = useState<any>(null);

	const { data: role, isLoading } = useRole({
		role_id,
		options: {
			onSuccess: (data: any) => {
				const permission = data?.role;
				setValue("name", permission?.name);
				setValue("activeStatus", permission?.activeStatus ?? "N");
				setPermissions(data?.permission?.map((permission: any) => permission?.id));
			},
		},
	});

	const { data: menuLists } = useMenuPermissionLists({
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
		control,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(schema),
		defaultValues: defaultValue,
	});

	const [companyList, setCompanyList] = useState([])
    const [totalRowsCompanyList, setTotalRowsCompanyList] = useState(0)
    const [searchCompany, setSearchCompany] = useState(" ");
    const debounceFetchCompany = useDebounce(searchCompany, 1000);

	
    // FETCH COMPANY
    const {
        isLoading: isLoadingCompany,
        isFetching: isFetchingCompany,
        isFetchingNextPage: isFetchingMoreCompany,
        hasNextPage: hasNextPageCompany,
        fetchNextPage: fetchNextPageCompany,
      } = useCompanyInfiniteLists({
        query: {
          search: debounceFetchCompany,
          limit: 10,
        },
        options: {
          onSuccess: (data: any) => {
            setTotalRowsCompanyList(data.pages[0].totalRow);
            const mappedData = data?.pages?.map((group: any) => {
              return group.rows?.map((element: any) => {
                return {
                  value: element.id,
                  label: element.name,
                };
              });
            });
            const flattenArray = [].concat(...mappedData);
            setCompanyList(flattenArray);
          },
          getNextPageParam: (_lastPage: any, pages: any) => {
            if (companyList.length < totalRowsCompanyList) {
              return pages.length + 1;
            } else {
              return undefined;
            }
          },
        },
      });

	const { mutate: deletePermission } = useDeletePermission({
		options: {
			onSuccess: () => {
				setModalDelete({ open: false });
				router.push("/user-config/role");
			},
		},
	});

	const { mutate: updateRole } = useUpdateRole({
		role_id,
		options: {
			onSuccess: () => {
				Router.push("/user-config/role");
			},
		},
	});

	const activeStatus = [
		{ id: "Y", value: '<div key="1" style="color:green;">Active</div>' },
		{ id: "N", value: '<div key="2" style="color:red;">Non Active</div>' },
	];

	const onSubmit = (data: any) => {
		const payload = {
			...data,
			permissions: permissionsIds,
		};
		updateRole(payload);
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

	const fields: any = [];
	const dataTableFieldCategory: any = [];
	const menu = menuLists?.map((menu: any) => ({ id: menu.id, value: menu.name }));
	menu?.unshift({ id: "all", value: "All" });
	const permissionFilter = [
		{ id: "all", value: "All" },
		{ id: "checked", value: "checked" },
		{ id: "unchecked", value: "unchecked" },
	];

	menuLists?.forEach((menu: any) => {
		menu?.field?.forEach((field: any) => {
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
		filteredMenu = filteredMenu.filter((menu: any) => menu.id === filterMenu);
	}

	if (filterChecked !== "all" && permissionsIds?.length > 0) {
		const checkedMenu: any = [];
		const unCheckedMenu: any = [];
		filteredMenu?.forEach((menu: any) => {
			if (menu.permission.some((permission: any) => permissionsIds.includes(permission.id))) {
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

	const onChangeItemCategoryTable = (key: any) => {
		const itemCategorySelected: any = [];
		key?.forEach((key: any) => {
			fields?.forEach((field: any) => {
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
		selectedRowKeys: tempItemCategory.map((item: any) => item.value),
		onChange: onChangeItemCategoryTable,
	};

	let fieldsMenu: any = [];

	if (filteredMenu?.length > 0) {
		for (let i = 0; i < filteredMenu.length; i++) {
			fieldsMenu = fieldsMenu.concat(filteredMenu[i].field);
		}
	}

	return (
		<>
			{isLoading ? (
				<Center>
					<Spin tip="Loading data..." />
				</Center>
			) : (
				<>
					<Col>
						<Row gap="4px" alignItems="center">
							<ArrowLeft style={{ cursor: "pointer" }} onClick={() => Router.back()} />
							<Text variant={"h4"}>{role?.role?.name}</Text>
						</Row>
						<Spacer size={12} />
						<Card>
							<Row justifyContent="space-between" alignItems="center" nowrap>
								<Dropdown
									label=""
									isHtml
									width={"185px"}
									items={activeStatus}
									placeholder={"Status"}
									handleChange={(text: any) => setValue("activeStatus", text)}
									noSearch
									defaultValue={role?.role?.activeStatus}
								/>
								<Row>
									<Row gap="16px">
										<Button size="big" variant={"tertiary"} onClick={() => Router.push("/user-config/role")}>
											{lang[t].roleList.tertier.cancel}
										</Button>
										<Button size="big" variant={"primary"} onClick={handleSubmit(onSubmit)}>
											{lang[t].roleList.primary.save}
										</Button>
									</Row>
								</Row>
							</Row>
						</Card>

						<Spacer size={20} />
						{role?.role?.reasonRejection && (
							<>
								<Alert>
									<Text variant="subtitle2" color="white">
										{role?.role?.reasonRejection}
									</Text>
								</Alert>
								<Spacer size={20} />
							</>
						)}

						<Accordion>
							<Accordion.Item key={1}>
								<Accordion.Header variant="blue">{lang[t].roleList.accordion.general}</Accordion.Header>
								<Accordion.Body>
									<Row width="100%" gap="20px" noWrap>
										<Input
											width="100%"
											label={lang[t].roleList.roleList.roleName}
											height="38px"
											placeholder={"e.g Sales Admin"}
											{...register("name", { required: true })}
										/>
										<Controller
											control={control}
											defaultValue={""}
											name="company_id"
											render={({ field: { onChange }, formState: { errors } }) => (
												<Col>
												<div style={{
												display: 'flex'
												}}>
												<Text variant="headingRegular">Company</Text>
												<Span>&#42;</Span>
												</div>
												<Spacer size={6} />
												<FormSelect
													defaultValue={defaultValue?.company?.name}
													style={{ width: "700px"}}
													size={"large"}
													placeholder={"Select"}
													borderColor={"#AAAAAA"}
													arrowColor={"#000"}
													withSearch
													required
													error={errors?.company_id?.message}
													isLoading={isFetchingCompany || isLoadingCompany}
													isLoadingMore={isFetchingMoreCompany}
													fetchMore={() => {
													if (hasNextPageCompany) {
														fetchNextPageCompany();
													}
													}}
													items={isFetchingCompany && !isFetchingMoreCompany ? [] : companyList}
													onChange={(value: any) => {
													onChange(value);
													}}
													onSearch={(value: any) => {
														value === '' ? value = ' ' : value
														setSearchCompany(value);
													}}
												/>
												</Col>
											)
											}
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
										{lang[t].roleList.accordion.permissions}
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
													placeholder={lang[t].roleList.searchBar.searchPermissions}
													onChange={(e: any) => setSearch(e.target.value)}
												/>
												<Dropdown
													label={lang[t].roleList.filterBar.menu}
													width={"300px"}
													items={menu}
													placeholder={"Select"}
													handleChange={(value: any) => setFilterMenu(value)}
													noSearch
													defaultValue="All"
												/>
												<Dropdown
													label={lang[t].roleList.filterBar.permissions}
													width={"300px"}
													items={permissionFilter}
													placeholder={"Select"}
													handleChange={(value: any) => setFilterChecked(value)}
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
											{filteredMenu?.map((menu: any) => (
												<AccordionCheckbox
													key={menu.id}
													lists={menu?.permission?.map((permission: any) => ({
														id: permission?.id,
														value: permission?.name,
													}))}
													name={menu.name}
													checked={permissionsIds}
													onChange={(data: any) => setPermissions(data)}
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

					{modalDelete.open && (
						<ModalDeleteConfirmation
							visible={modalDelete.open}
							onCancel={() => setModalDelete({ open: false })}
							onOk={() => deletePermission({ id: [role_id] })}
							itemTitle="Test"
						/>
					)}
				</>
			)}
		</>
	);
};

const Center = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
`;

const Card = styled.div`
	background: #ffffff;
	border-radius: 16px;
	padding: ${(p) => (p.padding ? p.padding : "16px")};
`;

const Span = styled.span`
  color: #ed1c24;
  margin-left: 5px;
  font-weight: bold;
`;

export default DetailRoleConfig;
