import { DownOutlined, DragOutlined } from "@ant-design/icons";
import usePagination from "@lucasmogari/react-pagination";
import Router from "next/router";
import {
	Accordion,
	Button,
	Col,
	Dropdown,
	Input,
	Modal,
	Pagination,
	Row,
	Search,
	Spacer,
	Table,
	Text,
	Tree,
} from "pink-lava-ui";
import React, { useState } from "react";
import styled from "styled-components";

import { useConfigs } from "../../../hooks/config/useConfig";
import {
	useCreateMenuDesignList,
	useCreateModuleMenuDesignList,
	useCreateSubMenuDesignList,
	useMenuDesignList,
	useUpdateMenuDesignList,
} from "../../../hooks/menu-config/useMenuDesign";
import { useMenuLists } from "../../../hooks/menu-config/useMenuConfig";

const x = 3;
const y = 2;
const z = 1;
const defaultData: any = [];

const generateData: any = (_level: any, _preKey: any, _tns: any) => {
	const preKey = _preKey || "0";
	const tns = _tns || defaultData;
	const children = [];

	for (let i = 0; i < x; i++) {
		const key = `${preKey}-${i}`;
		tns.push({
			title: key,
			key,
			icon: (
				<DragOutlined
					style={{
						borderRadius: 3,
						backgroundColor: "#D5FAFD",
						color: "#2BBECB",
						padding: 4,
					}}
				/>
			),
		});

		if (i < y) {
			children.push(key);
		}
	}

	if (_level < 0) {
		return tns;
	}

	const level: any = _level - 1;
	children.forEach((key, index) => {
		tns[index].children = [];
		return generateData(level, key, tns[index].children);
	});
};

generateData(z);

const CreateMenuDesignList: any = () => {
	const [dataListStatus, setDataListStatus] = useState("Y");
	const [selectedRowKeysModuleConfig, setSelectedRowKeysModuleConfig] = useState([]);
	const [selectedRowKeysMenuLists, setSelectedRowKeysMenuLists] = useState([]);
	const [removeMenu, setRemoveMenu] = useState([]);
	const [removeModule, setRemoveModule] = useState([]);
	const [dataCeratedNewMenuDesign, setdataCeratedNewMenuDesign] = useState(null);
	const [stateModuleId, setStateModuleId] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [searchModuleConfig, setSearchModuleConfig] = useState("");
	const [searchMenuLists, setSearchMenuLists] = useState("");
	const [stateFieldInput, setStateFieldInput] = useState({
		name: "",
	});
	const { name } = stateFieldInput;
	const [stateModal, setStateModal] = useState({
		isShowModal: false,
		titleModal: "",
		dataModal: null,
		widthModal: null,
	});
	const { isShowModal, titleModal, widthModal } = stateModal;
	const paginationModuleConfig = usePagination({
		page: 1,
		itemsPerPage: 10,
		maxPageItems: Infinity,
		numbers: true,
		arrows: true,
		totalItems: 100,
	});
	const paginationMenuLists = usePagination({
		page: 1,
		itemsPerPage: 10,
		maxPageItems: Infinity,
		numbers: true,
		arrows: true,
		totalItems: 100,
	});

	const [gData, setGData] = useState(defaultData);

	const onDragEnter = (info: any) => {
		console.log(info);
    // expandedKeys 需要受控时设置
		// setExpandedKeys(info.expandedKeys)
	};

	const onDrop = (info: any) => {
		const dropKey = info.node.key;
		const dragKey = info.dragNode.key;
		const dropPos = info.node.pos.split("-");
		const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

		const loop = (data: any, key: any, callback: any) => {
			for (let i = 0; i < data.length; i++) {
				if (data[i].key === key) {
					return callback(data[i], i, data);
				}

				if (data[i].children) {
					loop(data[i].children, key, callback);
				}
			}
		};

		const data = [...gData]; // Find dragObject

		let dragObj: any;
		loop(data, dragKey, (item: any, index: any, arr: any) => {
			arr.splice(index, 1);
			dragObj = item;
		});

		if (!info.dropToGap) {
			// Drop on the content
			loop(data, dropKey, (item: any) => {
				item.children = item.children || []; // where to insert 示例添加到头部，可以是随意位置

				item.children.unshift(dragObj);
			});
		} else if (
			(info.node.props.children || []).length > 0 && // Has children
			info.node.props.expanded && // Is expanded
			dropPosition === 1 // On the bottom gap
		) {
			loop(data, dropKey, (item: any) => {
				item.children = item.children || []; // where to insert 示例添加到头部，可以是随意位置

				item.children.unshift(dragObj); // in previous version, we use item.children.push(dragObj) to insert the
				// item to the tail of the children
			});
		} else {
			let ar: any = [];
			let i;
			loop(data, dropKey, (_item: any, index: any, arr: any) => {
				ar = arr;
				i = index;
			});

			if (dropPosition === -1) {
				ar.splice(i, 0, dragObj);
			} else {
				ar.splice(i + 1, 0, dragObj);
			}
		}

		setGData(data);
	};

	const handleChangeInput = (e) => {
		setStateFieldInput({
			...stateFieldInput,
			[e.target.id]: e.target.value,
		});
	};

	const { mutate: createMenuDesign, isLoading: isLoadingCreateMenuDesign } =
		useCreateMenuDesignList({
			options: {
				onSuccess: (data: any) => {
					if (data) {
						setdataCeratedNewMenuDesign(data);
					}
				},
				onError: (error: any) => {
					if (error?.data) {
						window.alert(error.data.errors && error.data.errors[0].message);
					} else {
						window.alert(error.data.message);
					}
				},
			},
		});

	const { mutate: createModuleMenuDesignList } = useCreateModuleMenuDesignList({
		options: {
			onSuccess: (data: any) => {
				if (data) {
					setIsLoading(false);
					refetchMenuDesignById();
					setStateModal({
						...stateModal,
						isShowModal: false,
					});
				}
			},
			onError: (error: any) => {
				setIsLoading(false);
				if (error?.message) {
					window.alert(error?.message);
					setStateModal({
						...stateModal,
						isShowModal: false,
					});
				} else if (error?.data) {
					window.alert(error.data.errors && error.data.errors[0].message);
				} else {
					window.alert(error.data.message);
				}
			},
		},
	});

	const { mutate: createSubMenuDesignList } = useCreateSubMenuDesignList({
		options: {
			onSuccess: (data: any) => {
				if (data) {
					refetchMenuDesignById();
					setIsLoading(false);
					setStateModal({
						...stateModal,
						isShowModal: false,
					});
				}
			},
			onError: (error: any) => {
				setIsLoading(false);
				if (error?.message) {
					window.alert(error?.message);
					setStateModal({
						...stateModal,
						isShowModal: false,
					});
				} else if (error?.data) {
					window.alert(error.data.errors && error.data.errors[0].message);
				} else {
					window.alert(error.data.message);
				}
			},
		},
	});

	const { mutate: updateMenuDesignList, isLoading: isLoadingUpdateMenuDesignList } =
		useUpdateMenuDesignList({
			options: {
				onSuccess: (data: any) => {
					if (removeMenu.length > 0 || removeModule.length > 0) {
						window.alert("Success remove module and menu");
					} else if (data) {
						Router.back();
					}
				},
				onSettled: (data: any, error: any) => {
					window.alert(error.data.message);
				},
			},
			menuDesignListId: dataCeratedNewMenuDesign?.id,
		});

	const { data: dataMenuDesignById, refetch: refetchMenuDesignById } = useMenuDesignList({
		options: {
			onSuccess: (data: any) => {
				setStateModal({
					...stateModal,
					isShowModal: false,
				});
			},
		},
		menu_design_list_id: dataCeratedNewMenuDesign?.id,
	});

	let filterByIdParentAndGroup: any = [];

	filterByIdParentAndGroup = dataMenuDesignById?.menuDesignToModules?.map((mapping: any) => {
		if (mapping.isParent) {
			delete mapping.menuDesignToMenus;
			return {
				...mapping,
				childrenMainMenu: dataMenuDesignById?.menuDesignToModules?.filter(
					(filtering: any) => filtering.group === mapping.group && !filtering.isParent
				),
			};
		}
	});

	const handleCreateModule = () => {
		if (dataCeratedNewMenuDesign) {
			setIsLoading(true);
			const dataModule: any = {
				id: dataCeratedNewMenuDesign?.id,
				module: selectedRowKeysModuleConfig,
			};
			createModuleMenuDesignList(dataModule);
		} else {
			const isEmptyField = Object.keys(stateFieldInput).find(
				(thereIsEmptyField) => stateFieldInput && stateFieldInput[thereIsEmptyField] === ""
			);

			if (!isEmptyField) {
				if (selectedRowKeysModuleConfig.length > 0) {
					const data: any = {
						name: name,
						module: selectedRowKeysModuleConfig,
						status: dataListStatus,
					};
					createMenuDesign(data);
				} else {
					window.alert("Please choose module!");
				}
			} else {
				window.alert(`field ${isEmptyField} must be fill!`);
			}
		}
	};

	const handleCreateSubMenu = () => {
		setIsLoading(true);
		const dataMenu: any = {
			module_id: stateModuleId,
			menu: selectedRowKeysMenuLists,
		};
		createSubMenuDesignList(dataMenu);
	};

	const handleUpdateMenuDesign = () => {
		const isEmptyField = Object.keys(stateFieldInput).find(
			(thereIsEmptyField) => stateFieldInput && stateFieldInput[thereIsEmptyField] === ""
		);

		const mappingMpdules = filterByIdParentAndGroup
			?.filter((filtering: any) => filtering !== undefined)
			.map((data: any) =>
				data.childrenMainMenu.map((data: any) => ({ id: data.id, module_index: data.moduleIndex }))
			)
			.filter((filtering: any) => filtering.length !== 0)
			.map((data: any) => data[0]);

		const mappingMenus = filterByIdParentAndGroup
			?.filter((filtering: any) => filtering !== undefined)
			.map((data: any) =>
				data.childrenMainMenu.map((data: any) =>
					data.menuDesignToMenus.map((data: any) => ({ id: data.id, menu_index: data.menuIndex }))
				)
			)
			.filter((filtering: any) => filtering.length !== 0)
			.map((data: any) => data[0])
			.filter((filtering: any) => filtering.length !== 0);

		if (!isEmptyField) {
			if (selectedRowKeysModuleConfig.length > 0) {
				const data: any = {
					del_modules: [],
					del_menus: [],
					menus: mappingMenus[0],
					modules: mappingMpdules,
					menu_design: {
						name: name,
						id: dataCeratedNewMenuDesign.data.id,
						status: dataListStatus,
					},
				};
				updateMenuDesignList(data);
			} else {
				window.alert("Please choose module!");
			}
		} else {
			window.alert(`field ${isEmptyField} must be fill!`);
		}
	};

	const removeModuleAndMenu = () => {
		const data: any = {
			del_modules: removeModule,
			del_menus: removeMenu,
			menu_design: {
				id: dataCeratedNewMenuDesign.data.id,
			},
		};
		updateMenuDesignList(data);
	};

	const handleChangeDropdownStatus = (value: any) => {
		setDataListStatus(value);
	};

	const columnsModuleConfig = [
		{
			title: "Field Name",
			dataIndex: "field_name",
		},
		{
			title: "Key",
			dataIndex: "field_key",
		},
	];

	const columnsMenuLists = [
		{
			title: "Field Name",
			dataIndex: "field_name",
		},
		{
			title: "Key",
			dataIndex: "field_key",
		},
	];

	const { data: dataTableFieldModuleConfig, isLoading: isLoadingModuleConfig } = useConfigs({
		options: {
			onSuccess: (data: any) => {
				paginationModuleConfig.setTotalItems(data.totalRow);
			},
			refetchOnWindowFocus: "always",
		},
		query: {
			search: searchModuleConfig,
			page: paginationModuleConfig.page,
			limit: paginationModuleConfig.itemsPerPage,
		},
	});

	const dataTableModuleConfig: any = [];
	dataTableFieldModuleConfig?.rows?.map((field: any) => {
		dataTableModuleConfig.push({
			key: field.id,
			field_id: field.id,
			field_name: field.name,
			field_key: field.key,
		});
	});

	const paginateModuleConfig = dataTableModuleConfig;

	const onSelectChangeTableModuleConfig = (value: any) => {
		setSelectedRowKeysModuleConfig(value);
	};

	const rowSelectionModuleConfig = {
		selectedRowKeys: selectedRowKeysModuleConfig,
		onChange: onSelectChangeTableModuleConfig,
	};

	const { data: dataMenuLists, isLoading: isLoadingMenuLists } = useMenuLists({
		options: {
			onSuccess: (data: any) => {
				paginationMenuLists.setTotalItems(data.totalRow);
			},
			refetchOnWindowFocus: "always",
		},
		query: {
			search: searchMenuLists,
			page: paginationMenuLists.page,
			limit: paginationMenuLists.itemsPerPage,
		},
	});

	const dataTableMenuLists: any = [];
	dataMenuLists?.rows?.map((field) => {
		dataTableMenuLists.push({
			key: field.id,
			field_id: field.id,
			field_name: field.name,
			field_key: field.key,
		});
	});

	const paginateMenuLists = dataTableMenuLists;

	const onSelectChangeTableMenuLists = (value: any) => {
		setSelectedRowKeysMenuLists(value);
	};

	const rowSelectionMenuLists = {
		selectedRowKeys: selectedRowKeysMenuLists,
		onChange: onSelectChangeTableMenuLists,
	};

	const onCheckTree = (checkedKeys: any, info: any) => {
		setRemoveMenu(
			info.checkedNodes
				.filter((filtering: any) => "children" in filtering === false)
				.map((dataRemoveMenu: any) => dataRemoveMenu.key)
		);

		setRemoveModule(
			info.checkedNodes
				.filter((filtering) => "children" in filtering === true)
				.map((dataRemoveMenu) => dataRemoveMenu.key)
		);
	};

	const onSelectTree = (selectedKeys, info) => {
		setStateModuleId(selectedKeys[0]);
		setStateModal({
			...stateModal,
			isShowModal: true,
			widthModal: 1000,
			titleModal: "Add Menu",
		});
	};

	return (
		<>
			<Col>
				<Row gap="4px">
					<Text variant={"h4"}>Create Menu Design</Text>
				</Row>
				<Card padding="20px">
					<Row justifyContent="space-between" alignItems="center" nowrap>
						<Dropdown
							width="185px"
							label=""
							allowClear
							items={[
								{ id: "Y", value: "Active" },
								{ id: "N", value: "InActive" },
							]}
							defaultValue="Active"
							placeholder={"Select"}
							handleChange={handleChangeDropdownStatus}
							noSearch
						/>
						<Row gap="16px">
							<Button size="big" variant={"tertiary"} onClick={() => Router.back()}>
								Cancel
							</Button>
							<Button size="big" variant={"primary"} onClick={handleUpdateMenuDesign}>
								{isLoadingUpdateMenuDesignList ? "loading..." : "Save"}
							</Button>
						</Row>
					</Row>
				</Card>

				<Spacer size={20} />

				<Accordion>
					<Accordion.Item key={1}>
						<Accordion.Header variant="blue">General</Accordion.Header>
						<Accordion.Body>
							<Row width="50%" gap="20px" noWrap>
								<Col width="100%">
									<Input
										id="name"
										width="100%"
										label="Name"
										height="48px"
										placeholder={"e.g Shipment and Delivery"}
										onChange={handleChangeInput}
									/>
								</Col>
							</Row>
						</Accordion.Body>
					</Accordion.Item>
				</Accordion>

				<Spacer size={20} />

				<Accordion>
					<Accordion.Item key={1}>
						<Accordion.Header variant="blue">
							<Row gap="8px" alignItems="baseline">
								Hirarchy Menu
							</Row>
						</Accordion.Header>
						<Accordion.Body>
							<Row>
								<Button
									size="big"
									variant={"primary"}
									onClick={() =>
										setStateModal({
											...stateModal,
											isShowModal: true,
											widthModal: 1000,
											titleModal: "Add Module",
										})
									}
								>
									Add Module
								</Button>

								<Spacer size={16} />

								<Button size="big" variant={"secondary"} onClick={() => removeModuleAndMenu()}>
									Remove
								</Button>
							</Row>

							<Spacer size={16} />

							{filterByIdParentAndGroup?.length > 0 &&
								filterByIdParentAndGroup.map(
									(subfilterByIdParentAndGroup, indexSubfilterByIdParentAndGroup) => {
										if (subfilterByIdParentAndGroup) {
											return (
												<div key={indexSubfilterByIdParentAndGroup}>
													<Accordion>
														<Accordion.Item key={1}>
															<Accordion.Header>
																<Text variant={"headingMedium"}>
																	{subfilterByIdParentAndGroup.module.name}
																</Text>
															</Accordion.Header>
															<Accordion.Body padding="0px">
																<Tree
																	draggable
																	blockNode
																	onSelect={onSelectTree}
																	onCheck={onCheckTree}
																	showIcon
																	onDrop={onDrop}
																	onDragEnter={onDragEnter}
																	switcherIcon={<DownOutlined />}
																	checkable
																	treeData={subfilterByIdParentAndGroup.childrenMainMenu.map(
																		(subChildrenMainMenu) => ({
																			key: subChildrenMainMenu.id,
																			title: (
																				<span>
																					{subChildrenMainMenu.module.name} <br />
																					<span style={{ color: "#EB008B" }}>+ add menu</span>
																				</span>
																			),
																			children: subChildrenMainMenu.menuDesignToMenus.map(
																				(subMenuDesignToMenus) => ({
																					key: subMenuDesignToMenus.id,
																					title: subMenuDesignToMenus.menu.name,
																					icon: (
																						<DragOutlined
																							style={{
																								borderRadius: 3,
																								backgroundColor: "#D5FAFD",
																								color: "#2BBECB",
																								padding: 4,
																							}}
																						/>
																					),
																				})
																			),
																			icon: (
																				<DragOutlined
																					style={{
																						borderRadius: 3,
																						backgroundColor: "#D5FAFD",
																						color: "#2BBECB",
																						padding: 4,
																					}}
																				/>
																			),
																		})
																	)}
																/>
															</Accordion.Body>
														</Accordion.Item>
													</Accordion>

													<Spacer size={16} />
												</div>
											);
										}
									}
								)}
						</Accordion.Body>
					</Accordion.Item>
				</Accordion>
			</Col>

			<Modal
				width={widthModal}
				visible={isShowModal}
				onCancel={() => setStateModal({ ...stateModal, isShowModal: false })}
				title={titleModal}
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
							onClick={() => setStateModal({ ...stateModal, isShowModal: false })}
							variant="tertiary"
							size="big"
						>
							Cancel
						</Button>
						<Button
							disabled={isLoadingCreateMenuDesign || isLoading}
							onClick={() =>
								titleModal === "Add Module" ? handleCreateModule() : handleCreateSubMenu()
							}
							variant="primary"
							size="big"
						>
							{isLoadingCreateMenuDesign || isLoading ? "Loading..." : "Add"}
						</Button>
					</div>
				}
				content={
					<>
						<Spacer size={48} />
						<Row alignItems="flex-end" justifyContent="space-between">
							<Search
								width="380px"
								placeholder={`Search ${titleModal === "Add Module" ? "Module" : "Menu"} Name`}
								onChange={(e) =>
									titleModal === "Add Module"
										? setSearchModuleConfig(e.target.value)
										: setSearchMenuLists(e.target.value)
								}
							/>
							<Row gap="16px">
								<Button
									size="big"
									variant={"primary"}
									onClick={() =>
										window.open(
											`/${titleModal === "Add Module" ? "config" : "menu-list"}/create`,
											"_blank"
										)
									}
								>
									{titleModal}
								</Button>
							</Row>
						</Row>
						<Spacer size={10} />
						<Table
							loading={isLoadingModuleConfig || isLoadingMenuLists}
							columns={
								titleModal === "Add Module"
									? columnsModuleConfig.filter((filtering) => filtering.dataIndex !== "field_key")
									: columnsMenuLists.filter((filtering) => filtering.dataIndex !== "field_key")
							}
							data={titleModal === "Add Module" ? paginateModuleConfig : paginateMenuLists}
							rowSelection={
								titleModal === "Add Module" ? rowSelectionModuleConfig : rowSelectionMenuLists
							}
						/>
						<Pagination
							pagination={
								titleModal === "Add Module" ? paginationModuleConfig : paginationMenuLists
							}
						/>
						<Spacer size={14} />
					</>
				}
			/>
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
	border-top: ${(p) => (p.borderTop ? "0.5px solid #AAAAAA" : "none")};
`;

const Card = styled.div`
	background: #ffffff;
	border-radius: 16px;
	padding: ${(p) => (p.padding ? p.padding : "16px")};
`;

export default CreateMenuDesignList;
