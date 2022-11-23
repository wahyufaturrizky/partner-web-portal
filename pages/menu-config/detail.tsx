import usePagination from "@lucasmogari/react-pagination";
import { lang } from "lang";
import Image from "next/image";
import Router from "next/router";
import {
  Accordion,
  Button,
  Checkbox,
  Col,
  DropdownMenuOptionGroup,
  Input,
  Modal,
  Pagination,
  Row,
  Search,
  Spacer,
  Table,
  Text,
  DropdownMenuOptionCustome,
  Spin,
  Tag,
} from "pink-lava-ui";
import React, { useState } from "react";
import { useEffect } from "react";
import styled from "styled-components";
import { ModalDeleteConfirmation } from "../../components/elements/Modal/ModalConfirmationDelete";
import { ModalRegisterField } from "../../components/elements/Modal/ModalRegisterField";
import { useCreateField, useFields } from "../../hooks/field/useField";
import {
  useDeleteMenuList,
  useMenuList,
  useUpdateMenuList,
} from "../../hooks/menu-config/useMenuConfig";
import { useFilterListPermissions, usePermissions } from "../../hooks/permission/usePermission";

const DetailMenuList: any = () => {
  const t = localStorage.getItem("lan") || "en-US";
  const companyCode = localStorage.getItem("companyCode");
  const [isLoading, setIsLoading] = useState(true);
  const [searchAllowedField, setSearchAllowedField] = useState("");
  const [searchTableField, setSearchTableField] = useState("");
  const [searchTablePermission, setSearchTablePermission] = useState("");
  const [isMenuProcess, setIsMenuProcess] = useState(false);
  const [ishowForDropDown, setIshowForDropDown] = useState<boolean>(false);
  const [modalDelete, setModalDelete] = useState({ open: false });
  const [dataAllowedField, setDataAllowedField] = useState([]);
  const [selectedRowTableField, setSelectedRowTableField] = useState([]);
  const [dataAssociatedPermissionsField, setDataAssociatedPermissionsField] = useState([]);
  const [selectedRowTablePermission, setSelectedRowTablePermission] = useState([]);
  const [modalCreate, setModalCreate] = useState({ open: false });
  const [stateFieldInput, setStateFieldInput] = useState({
    name: "",
    screen: "",
    process_name: "",
    fee: "",
  });
  const { name, screen, process_name, fee } = stateFieldInput;
  const [stateModal, setStateModal] = useState({
    isShowModal: false,
    titleModal: "",
    dataModal: null,
    widthModal: null,
  });
  const { isShowModal, titleModal, dataModal, widthModal } = stateModal;
  const [selectedAllowedFieldRowKeys, setSelectedAllowedFieldRowKeys] = useState([]);
  const [dataTableAssociatePermission, setDataTableAssociatePermission] = useState([]);
  const [isZeus, setIsZeus] = useState(false);
  const [isHermes, setIsHermes] = useState(false);
  const [selectedRowKeysTablePermission, setSelectedRowKeysTablePermission] = useState([]);
  const [selectedRowKeysTableField, setSelectedRowKeysTableField] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState([]);
  const paginationTableField = usePagination({
    page: 1,
    itemsPerPage: 10,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
  });
  const paginationAllowedField = usePagination({
    page: 1,
    itemsPerPage: 10,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
  });
  const paginationTablePermission = usePagination({
    page: 1,
    itemsPerPage: 10,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
  });

  const {
    data: fieldMenuListById,
    refetch: refetchFieldMenuListById,
    isLoading: isLoadingMenuList,
  } = useMenuList({
    options: {
      onSuccess: (data) => {
        let tempDataAllowedField = [];
        let tempDataAssociatePermission = [];

        data.field.map((data) => {
          tempDataAllowedField.push({
            allowed_field: data.name,
            allowed_field_id: data.id,
            key: data.id,
          });
        });

        data.modules.map((data) => {
          tempDataAssociatePermission.push({
            field_name: data.name,
            key: data.id,
          });
        });

        if (data.menu.processName) {
          setIsMenuProcess(true);
        }

        setIsZeus(data.menu.isZeus === "Y" ? true : false);
        setIsHermes(data.menu.isHermes === "Y" ? true : false);

        setStateFieldInput({
          ...stateFieldInput,
          name: data.menu.name,
          process_name: data.menu.processName,
          screen: data.menu.screen,
          fee: data.menu.fee,
        });

        setDataAllowedField(tempDataAllowedField);

        onSelectChangeTablePermission(tempDataAssociatePermission.map((data) => data.key));

        onSelectChangeTableField(tempDataAllowedField.map((data) => data.key));

        setDataAssociatedPermissionsField(tempDataAssociatePermission);

        if (
          tempDataAllowedField.length > 0 &&
          tempDataAssociatePermission.length > 0 &&
          name &&
          process_name &&
          screen
        ) {
          setIsLoading(false);
        }
      },
    },
    menu_list_id: Router.query.id,
  });

  const {
    data: fieldsTablePermission,
    refetch: refetchFieldsTablePermission,
    isLoading: isLoadingPermissions,
  } = usePermissions({
    options: {
      onSuccess: (data) => {
        paginationTablePermission.setTotalItems(data.totalRow);
        setIsLoading(false);
      },
    },
    query: {
      search: searchTablePermission,
      page: paginationTablePermission.page,
      limit: paginationTablePermission.itemsPerPage,
    },
  });

  const {
    mutate: reqBodyFilterListPermission,
    data: fieldsTablePermissionFilter,
    isLoading: isLoadingFilterListPermissions,
  } = useFilterListPermissions({
    options: {
      onSuccess: (data) => {
        paginationTablePermission.setTotalItems(data.totalRow);
        setIsLoading(false);
      },
    },
  });

  useEffect(() => {
    if (fieldsTablePermissionFilter && selectedFilter.length > 0) {
      setDataTableAssociatePermission(fieldsTablePermissionFilter);
    } else if (fieldsTablePermission) {
      setDataTableAssociatePermission(fieldsTablePermission);
    }
  }, [fieldsTablePermissionFilter, fieldsTablePermission]);

  const columnsTablePermission = [
    {
      title: "Associated Module",
      dataIndex: "field_name",
    },
  ];

  const dataTablePermission = [];
  const datFieldPermission = [];
  dataTableAssociatePermission?.rows?.map((field) => {
    dataTablePermission.push({
      key: field.id,
      field_name: field.name,
    });
    datFieldPermission.push({
      value: field.id,
      label: field.name,
    });
  });

  useEffect(() => {
    if (dataTablePermission.length > 0 && datFieldPermission.length > 0) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [dataTablePermission, datFieldPermission]);

  const paginateFieldTablePermission = dataTablePermission;

  const onSelectChangeTablePermission = (selectedRowKeys, selectedRows) => {
    setSelectedRowTablePermission(selectedRows);
    setSelectedRowKeysTablePermission(selectedRowKeys);
  };

  const rowSelectionTablePermission = {
    selectedRowKeys: selectedRowKeysTablePermission,
    onChange: onSelectChangeTablePermission,
  };

  const listFilterAssociatedPermission = [
    // {
    // 	label: "All",
    // 	list: [
    // 		{
    // 			label: "All",
    // 			value: "All",
    // 		},
    // 	],
    // },
    // {
    // 	label: "By Permission Name",
    // 	list: [
    // 		{
    // 			label: "Shipment",
    // 			value: "Shipment",
    // 		},
    // 		{
    // 			label: "Sales Order",
    // 			value: "Sales Order",
    // 		},
    // 		{
    // 			label: "Logistic",
    // 			value: "Logistic",
    // 		},
    // 		{
    // 			label: "Marketing",
    // 			value: "Marketing",
    // 		},
    // 	],
    // },
    {
      label: "By Action Permission",
      list: [
        {
          label: "Create",
          value: "Create",
        },
        {
          label: "Edit",
          value: "Edit",
        },
        {
          label: "View",
          value: "View",
        },
        {
          label: "Delete",
          value: "Delete",
        },
      ],
    },
    {
      label: "By Check/Uncheck",
      list: [
        {
          label: "Checked",
          value: "Checked",
        },
        {
          label: "Unchecked",
          value: "Unchecked",
        },
      ],
    },
  ];

  const handleChangeInput = (e) => {
    setStateFieldInput({
      ...stateFieldInput,
      [e.target.id]: e.target.value,
    });
  };

  const columns = [
    {
      title: lang[t].menuList.checkBox.allowedField,
      dataIndex: "allowed_field",
    },
  ];

  const onSelectChangeAllowedField = (selectedAllowedFieldRowKeys) => {
    setSelectedAllowedFieldRowKeys(selectedAllowedFieldRowKeys);
  };

  const rowSelectionAllowedField = {
    selectedRowKeys: selectedAllowedFieldRowKeys,
    onChange: onSelectChangeAllowedField,
    getCheckboxProps: (record: DataType) => ({
      disabled: true,
      name: record.name,
    }),
  };

  const columnsTableField = [
    {
      title: "Field Name",
      dataIndex: "field_name",
    },
    {
      title: "Key",
      dataIndex: "field_key",
    },
  ];

  const { data: tableFieldData, refetch: refetchFieldData } = useFields({
    options: {
      onSuccess: (data) => {
        paginationTableField.setTotalItems(data.totalRow);
        setIsLoading(false);
      },
    },
    query: {
      search: searchTableField,
      page: paginationTableField.page,
      limit: paginationTableField.itemsPerPage,
    },
  });

  const dataTableField = [];
  tableFieldData?.rows?.map((field) => {
    dataTableField.push({
      key: field.id,
      field_id: field.id,
      field_name: field.name,
      field_key: field.key,
    });
  });

  const paginateTableField = dataTableField;

  const onSelectChangeTableField = (value, rowSelected) => {
    setSelectedRowKeysTableField(value);
    setSelectedRowTableField(rowSelected);
  };

  const rowSelectionTableField = {
    selectedRowKeys: selectedRowKeysTableField,
    onChange: onSelectChangeTableField,
  };

  const { mutate: createField } = useCreateField({
    options: {
      onSuccess: () => {
        refetchFieldData();
        setModalCreate({ open: false });
      },
    },
  });

  const handleSelectedField = () => {
    if (titleModal === "Associated Module") {
      const tempDataAssociatedPermissionsField = [];
      dataTablePermission?.map((field) => {
        if (rowSelectionTablePermission.selectedRowKeys.includes(field.key)) {
          tempDataAssociatedPermissionsField.push({
            key: field.key,
            field_name: field.field_name,
          });

          setDataAssociatedPermissionsField(tempDataAssociatedPermissionsField);
          setStateModal({ ...stateModal, isShowModal: false });
        } else {
          setDataAssociatedPermissionsField(selectedRowTablePermission);
          setStateModal({ ...stateModal, isShowModal: false });
        }
      });
    } else {
      const tempDataAllowedField = [];
      dataTableField?.map((field) => {
        if (rowSelectionTableField.selectedRowKeys.includes(field.key)) {
          tempDataAllowedField.push({
            key: field.key,
            allowed_field: field.field_name,
            allowed_field_id: field.field_id,
            allowed_field_key: field.field_key,
          });

          setDataAllowedField(tempDataAllowedField);
          setStateModal({ ...stateModal, isShowModal: false });
        } else {
          setDataAllowedField(
            selectedRowTableField.map((data) => ({
              allowed_field: data.field_name,
              allowed_field_id: data.key,
              key: data.key,
            }))
          );
          setStateModal({ ...stateModal, isShowModal: false });
        }
      });
    }
  };

  const handleRemoveAllowedField = () => {
    let tempDataAllowedField = [];

    tempDataAllowedField = dataAllowedField?.filter(
      (field) => !rowSelectionAllowedField.selectedRowKeys.includes(field.key)
    );
    setDataAllowedField(tempDataAllowedField);
  };

  const handleChangeFilterValue = (selectedFilter) => {
    setSelectedFilter(selectedFilter);
  };

  const { mutate: updateFieldMenuList } = useUpdateMenuList({
    options: {
      onSuccess: (data) => {
        if (data) {
          setIsLoading(false);
          window.alert("Menu updated successfully");
          Router.back();
        }
      },
      onSettled: (data, error) => {
        setIsLoading(false);
        window.alert(error.data.message);
      },
    },
    menuListId: Router.query.id,
  });

  useEffect(() => {
    if (isShowModal && titleModal === "Associated Module") {
      setIsLoading(true);
      const tempCheck = selectedFilter.find((finding) => finding);
      reqBodyFilterListPermission({
        ids: rowSelectionTablePermission.selectedRowKeys,
        checked: tempCheck === "Checked" ?? false,
        page: paginationTablePermission.page,
        limit: paginationTablePermission.itemsPerPage,
        action: ["Create", "Edit", "View", "Delete"].includes(selectedFilter) ? selectedFilter : [],
      });
    }
  }, [selectedFilter, isShowModal]);

  const handleUpdateMenuList = () => {
    setIsLoading(true);
    const isEmptyField = Object.keys(stateFieldInput).find(
      (thereIsEmptyField) =>
        thereIsEmptyField !== "process_name" &&
        stateFieldInput &&
        stateFieldInput[thereIsEmptyField] === ""
    );

    if (!isEmptyField) {
      if (dataAllowedField.length !== 0 && dataAssociatedPermissionsField.length !== 0) {
        const data = {
          name: stateFieldInput?.name,
          screen: stateFieldInput?.screen,
          process_name: isMenuProcess ? stateFieldInput?.process_name : undefined,
          fee: stateFieldInput?.fee,
          field: dataAllowedField.map((data) => data.key),
          is_config: isZeus ? "Y" : "N",
          is_partner: isHermes ? "Y" : "N",
          permission: dataAssociatedPermissionsField.map((data) => data.key),
		  company_id:companyCode
        };
        updateFieldMenuList(data);
      } else {
        window.alert("data allowed and data associate permission can't br empty");
      }
    } else {
      setIsLoading(false);
      window.alert(`field ${isEmptyField} must be fill!`);
    }
  };

  const { mutate: deleteFields } = useDeleteMenuList({
    options: {
      onSuccess: () => {
        setModalDelete({ open: false });
        Router.back();
      },
    },
  });

  const handleChangeInputAssociatePermission = (key) => {
    const tempDataAssociatedPermissionsField = [];
    dataTablePermission?.map((field) => {
      if (key.includes(field.key)) {
        tempDataAssociatedPermissionsField.push({
          key: field.key,
          field_name: field.field_name,
        });

        onSelectChangeTablePermission(tempDataAssociatedPermissionsField.map((data) => data.key));

        setDataAssociatedPermissionsField(tempDataAssociatedPermissionsField);
      } else if (key.length === 0) {
        onSelectChangeTablePermission([]);
        setDataAssociatedPermissionsField([]);
      }
    });
  };

  useEffect(() => {
    if (
      !isLoading &&
      !isLoadingPermissions &&
      !isLoadingMenuList &&
      !isLoadingFilterListPermissions
    ) {
      setTimeout(() => setIshowForDropDown(true), 3000);
    }
  }, [isLoading, isLoadingPermissions, isLoadingMenuList, isLoadingFilterListPermissions]);

  const onChangeIsMenuProcess = () => {
    if (isMenuProcess) {
      if (isZeus || isHermes) {
        setIsMenuProcess(!isMenuProcess);
      }
    } else {
      setIsMenuProcess(!isMenuProcess);
    }
  };

  const onChangeIsZues = () => {
    if (isZeus) {
      if (isHermes || isMenuProcess) {
        setIsZeus(!isZeus);
      }
    } else {
      setIsZeus(!isZeus);
    }
  };

  const onChangeIsHermes = () => {
    if (isHermes) {
      if (isZeus || isMenuProcess) {
        setIsHermes(!isHermes);
      }
    } else {
      setIsHermes(!isHermes);
    }
  };

  return (
    <>
      <Col>
        <Row alignItems="center" gap="4px">
          <div onClick={() => Router.back()} style={{ cursor: "pointer" }}>
            <Image src="/icons/arrow-left.svg" alt="arrow-left" width={32} height={32} />
          </div>
          <Text variant={"h4"}>{Router.query.name}</Text>
        </Row>
        <Spacer size={8} />
        <Spacer size={12} />
        <Card padding="20px">
          <Row justifyContent="flex-start" alignItems="center" nowrap>
            <Row>
              <Col>
                <Row alignItems="center">
                  <Checkbox disabled checked={isMenuProcess} onChange={onChangeIsMenuProcess} />
                  <div style={{ cursor: "pointer" }}>
                    <Text variant={"subtitle1"}>{lang[t].menuList.checkBox.thisMenu}</Text>
                  </div>
                </Row>
              </Col>
            </Row>
          </Row>
        </Card>

        <Spacer size={20} />

        <Accordion>
          <Accordion.Item key={1}>
            <Accordion.Header variant="blue">{lang[t].menuList.accordion.general}</Accordion.Header>
            <Accordion.Body>
              <Row width="100%" gap="20px" noWrap>
                <Input
                  id="name"
                  width="100%"
                  label={lang[t].menuList.menuListName}
                  value={name}
                  height="48px"
                  placeholder={"e.g Shipment and Delivery"}
                  onChange={handleChangeInput}
                  disabled
                />
                <Input
                  id="screen"
                  width="100%"
                  label={lang[t].menuList.menuListScreen}
                  value={screen}
                  onChange={handleChangeInput}
                  height="48px"
                  placeholder={"e.g Shipment and Delivery"}
                  disabled
                />
              </Row>
              <Spacer size={20} />
              <Row width="100%" gap="20px" noWrap>
                <Input
                  id="fee"
                  width="100%"
                  value={fee}
                  label={lang[t].menuList.menuListFee}
                  onChange={handleChangeInput}
                  height="48px"
                  placeholder={"e.g 10.000"}
                  disabled
                />
                <div style={{ visibility: isMenuProcess ? "visible" : "hidden", width: "100%" }}>
                  <Input
                    id="process_name"
                    width="100%"
                    value={process_name}
                    label="Process Name"
                    onChange={handleChangeInput}
                    height="48px"
                    placeholder={"e.g Shipment"}
                    isOptional
                    disabled
                  />
                </div>
              </Row>
              <Spacer size={20} />
              <Row>
                <Col>
                  <Text variant="headingRegular">
                    {lang[t].menuList.filterBar.associatedModule}
                  </Text>
                  <Spacer size={16} />
                  <Row>
                    {dataAssociatedPermissionsField?.map((data: any) => {
                      return (
                        <>
                          <Tag>{data.field_name}</Tag>
                          <Spacer size={8} />
                        </>
                      );
                    })}
                  </Row>
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
                {lang[t].menuList.checkBox.allowedField}
              </Row>
            </Accordion.Header>
            <Accordion.Body>
              <Row justifyContent="space-between">
                <Search
                  width="380px"
                  placeholder={lang[t].menuList.searchBar.menuList}
                  onChange={(e) => setSearchAllowedField(e.target.value)}
                />
              </Row>
              <Spacer size={10} />
              <Table
                loading={isLoading}
                columns={columns}
                data={dataAllowedField}
                rowSelection={rowSelectionAllowedField}
              />
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
            <Button onClick={handleSelectedField} variant="primary" size="big">
              {titleModal === "Associated Module" ? "Apply" : "Add"}
            </Button>
          </div>
        }
        content={
          <>
            <Spacer size={20} />
            <Row alignItems="flex-end" justifyContent="space-between">
              <Search
                width="380px"
                placeholder={
                  titleModal === "Associated Module"
                    ? "Search Permission Name"
                    : "Search Field ID, Name, Key"
                }
                onChange={(e) =>
                  titleModal === "Associated Module"
                    ? setSearchTablePermission(e.target.value)
                    : setSearchTableField(e.target.value)
                }
              />
              <Row gap="16px">
                {titleModal === "Associated Module" ? (
                  <DropdownMenuOptionGroup
                    label="Filter"
                    handleChangeValue={handleChangeFilterValue}
                    isShowClearFilter
                    listItems={listFilterAssociatedPermission}
                  />
                ) : (
                  <Button
                    size="big"
                    variant={"primary"}
                    onClick={() => setModalCreate({ open: true })}
                  >
                    Register
                  </Button>
                )}
              </Row>
            </Row>
            <Spacer size={10} />
            <Table
              columns={
                titleModal === "Associated Module"
                  ? columnsTablePermission
                  : columnsTableField.filter((filtering) => filtering.dataIndex !== "field_key")
              }
              data={
                titleModal === "Associated Module"
                  ? paginateFieldTablePermission
                  : paginateTableField
              }
              rowSelection={
                titleModal === "Associated Module"
                  ? rowSelectionTablePermission
                  : rowSelectionTableField
              }
            />
            <Pagination
              pagination={
                titleModal === "Associated Module"
                  ? paginationTablePermission
                  : paginationTableField
              }
            />
            <Spacer size={14} />
          </>
        }
      />

      {modalCreate.open && (
        <ModalRegisterField
          visible={modalCreate.open}
          onCancel={() => setModalCreate({ open: false })}
          onOk={(data) => createField(data)}
        />
      )}

      {modalDelete.open && (
        <ModalDeleteConfirmation
          itemTitle={Router.query.name}
          visible={modalDelete.open}
          onCancel={() => setModalDelete({ open: false })}
          onOk={() => deleteFields({ id: [Number(Router.query.id)] })}
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
  border-top: ${(p) => (p.borderTop ? "0.5px solid #AAAAAA" : "none")};
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: ${(p) => (p.padding ? p.padding : "16px")};
`;

export default DetailMenuList;
