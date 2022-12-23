import usePagination from "@lucasmogari/react-pagination";
import Router from "next/router";
import {
  Accordion,
  Button,
  Checkbox,
  Col,
  Input,
  Modal,
  Pagination,
  Row,
  Search,
  Spacer,
  Table,
  Text,
  DropdownMenuOptionGroup,
  DropdownMenuOptionCustome,
} from "pink-lava-ui";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useConfigs } from "hooks/config/useConfig";
import { ModalRegisterField } from "../../../components/elements/Modal/ModalRegisterField";
import { useCreateField, useFields } from "../../../hooks/field/useField";
import { useCreateMenuList } from "../../../hooks/menu-config/useMenuConfig";
import { usePartnerConfigPermissionLists } from "../../../hooks/user-config/usePermission";
import { useFilterListPermissions } from "../../../hooks/permission/usePermission";

const CreateMenuList: any = () => {
  const companyCode = localStorage.getItem("companyCode");
  const [isLoading, setLoading] = useState(true);
  const [setSearchAllowedField] = useState("");
  const [searchTableField, setSearchTableField] = useState("");
  const [searchTablePermission, setSearchTablePermission] = useState("");
  const [isMenuProcess, setIsMenuProcess] = useState(false);
  const [isZeus, setIsZeus] = useState(true);
  const [isHermes, setIsHermes] = useState(false);
  const [dataAllowedField, setDataAllowedField] = useState<any[]>([]);
  const [dataAssociatedPermissionsField, setDataAssociatedPermissionsField] = useState([]);
  const [modalCreate, setModalCreate] = useState({ open: false });
  const [stateFieldInput, setStateFieldInput] = useState<any>({
    name: "",
    screen: "",
    process_name: "",
  });
  const [stateModal, setStateModal] = useState({
    isShowModal: false,
    titleModal: "",
    dataModal: null,
    widthModal: null,
  });
  const {
    isShowModal, titleModal, dataModal, widthModal,
  } = stateModal;
  const [selectedAllowedFieldRowKeys, setSelectedAllowedFieldRowKeys] = useState([]);
  const [dataTableAssociatePermission, setDataTableAssociatePermission] = useState<any>([]);
  const [selectedRowKeysTablePermission, setSelectedRowKeysTablePermission] = useState([]);
  const [selectedRowTablePermission, setSelectedRowTablePermission] = useState([]);
  const [selectedRowKeysTableField, setSelectedRowKeysTableField] = useState([]);
  const [selectedRowTableField, setSelectedRowTableField] = useState<any[]>([]);
  const [selectedFilter, setSelectedFilter] = useState([]);
  const paginationTableField = usePagination({
    page: 1,
    itemsPerPage: 20,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
  });
  const paginationAllowedField = usePagination({
    page: 1,
    itemsPerPage: 20,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
  });
  const paginationTablePermission = usePagination({
    page: 1,
    itemsPerPage: 20,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
  });

  const { data: fieldsTablePermission } = useConfigs({
    options: {
      onSuccess: (data: any) => {
        paginationTablePermission.setTotalItems(data.totalRow);
        setLoading(false);
      },
    },
    query: {
      search: searchTablePermission,
      page: paginationTablePermission.page,
      limit: paginationTablePermission.itemsPerPage,
    },
  });

  const { mutate: reqBodyFilterListPermission, data: fieldsTablePermissionFilter }: any =		useFilterListPermissions({
		  options: {
		    onSuccess: (data: any) => {
		      paginationTablePermission.setTotalItems(data.totalRow);
		      setLoading(false);
		    },
		  },
  });

  useEffect(() => {
    if (fieldsTablePermissionFilter && selectedFilter.length > 0) {
      setDataTableAssociatePermission(fieldsTablePermissionFilter);
    } else if (fieldsTablePermission) {
      setDataTableAssociatePermission(fieldsTablePermission);
    }
  }, [fieldsTablePermissionFilter, fieldsTablePermission, selectedFilter.length]);

  const columnsTablePermission = [
    {
      title: "Permission Name",
      dataIndex: "field_name",
    },
  ];

  const dataTablePermission: any = [];
  const datFieldPermission: any = [];

  dataTableAssociatePermission?.rows?.map((field: any) => {
    dataTablePermission.push({
      key: field.id,
      field_name: field.name,
    });
    datFieldPermission.push({
      value: field.id,
      label: field.name,
    });
  });

  const paginateFieldTablePermission = dataTablePermission;

  const onSelectChangeTablePermission: any = (selectedRowKeys: any, selectedRows: any): void => {
    setSelectedRowKeysTablePermission(selectedRowKeys);
    setSelectedRowTablePermission(selectedRows);
  };

  const rowSelectionTablePermission: any = {
    selectedRowKeys: selectedRowKeysTablePermission,
    onChange: onSelectChangeTablePermission,
  };

  const listFilterAssociatedPermission = [
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

  const handleChangeInput = (e: any) => {
    setStateFieldInput({
      ...stateFieldInput,
      [e.target.id]: e.target.value,
    });
  };

  const columns = [
    {
      title: "Allowed Field",
      dataIndex: "allowed_field",
    },
  ];

  const onSelectChangeAllowedField = (id: any) => {
    setSelectedAllowedFieldRowKeys(id);
  };

  const rowSelectionAllowedField = {
    selectedRowKeys: selectedAllowedFieldRowKeys,
    onChange: onSelectChangeAllowedField,
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
      onSuccess: (data: any) => {
        paginationTableField.setTotalItems(data.totalRow);
        setLoading(false);
      },
    },
    query: {
      search: searchTableField,
      page: paginationTableField.page,
      limit: paginationTableField.itemsPerPage,
    },
  });

  const dataTableField: any = [];
  tableFieldData?.rows?.map((field: any) => {
    dataTableField.push({
      key: field.id,
      field_id: field.id,
      field_name: field.name,
      field_key: field.key,
    });
  });

  const paginateTableField = dataTableField;

  const onSelectChangeTableField: any = (value: any, rowSelected: any): void => {
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
    if (titleModal === "Associated Permissions") {
      const tempDataAssociatedPermissionsField: any = [];
      dataTablePermission?.map((field: any) => {
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
      const tempDataAllowedField: any = [];
      dataTableField?.map((field: any) => {
        if (rowSelectionTableField?.selectedRowKeys?.includes(field.key)) {
          tempDataAllowedField.push({
            key: field?.key,
            allowed_field: field?.field_name,
            allowed_field_id: field?.field_id,
            allowed_field_key: field?.field_key,
          });

          setDataAllowedField(tempDataAllowedField);
          setStateModal({ ...stateModal, isShowModal: false });
        } else {
          setDataAllowedField(
            selectedRowTableField.map((data) => ({
              allowed_field: data?.field_name,
              allowed_field_id: data?.key,
              key: data?.key,
            })),
          );
          setStateModal({ ...stateModal, isShowModal: false });
        }
      });
    }
  };

  const handleRemoveAllowedField = () => {
    let tempDataAllowedField: any = [];

    tempDataAllowedField = dataAllowedField?.filter(
      (field: any) => !rowSelectionAllowedField.selectedRowKeys.includes(field.key),
    );

    onSelectChangeTableField(tempDataAllowedField.map((data: any) => data.key));
    setDataAllowedField(tempDataAllowedField);
  };

  const handleChangeFilterValue = (selectedFilter: any) => setSelectedFilter(selectedFilter);

  const { mutate: createFieldMenuList } = useCreateMenuList({
    options: {
      onSuccess: (data: any) => {
        if (data) {
          setLoading(false);
          Router.back();
        }
      },
    },
  });

  useEffect(() => {
    if (isShowModal && titleModal === "Associated Permissions") {
      setLoading(true);
      const tempCheck: any = selectedFilter.find((finding) => finding);
      reqBodyFilterListPermission({
        ids: rowSelectionTablePermission.selectedRowKeys,
        checked: tempCheck === "Checked" ?? false,
        page: paginationTablePermission.page,
        limit: paginationTablePermission.itemsPerPage,
        action: ["Create", "Edit", "View", "Delete"].includes(selectedFilter) ? selectedFilter : [],
      });
    }
  }, [selectedFilter, isShowModal]);

  const handleCreateMenuList = () => {
    setLoading(true);
    const isEmptyField: any = Object.keys(stateFieldInput).find(
      (thereIsEmptyField) => thereIsEmptyField !== "process_name"
				&& thereIsEmptyField !== "screen"
				&& stateFieldInput
				&& stateFieldInput[thereIsEmptyField] === "",
    );

    if (!isEmptyField) {
      // if (dataAllowedField.length !== 0 && dataAssociatedPermissionsField.length !== 0) {
      if (dataAssociatedPermissionsField.length !== 0) {
        const data: any = {
          name: stateFieldInput?.name,
          screen: stateFieldInput?.screen,
          process_name: stateFieldInput?.process_name,
          isZeus: isZeus ? "Y" : "N",
          isHermes: isHermes ? "Y" : "N",
          field: dataAllowedField.map((data) => data.key),
          modules: dataAssociatedPermissionsField.map((data) => data.key),
          company_id: companyCode,
        };
        createFieldMenuList(data);
      } else {
        window.alert("data associate permission can't be empty");
      }
    } else {
      setLoading(false);
      window.alert(`field ${isEmptyField} must be fill!`);
    }
  };

  const handleChangeInputAssociatePermission = (key: any) => {
    const tempDataAssociatedPermissionsField: any = [];
    dataTablePermission?.map((field: any) => {
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
        <Row gap="4px">
          <Text variant="h4">Create Menu</Text>
        </Row>
        <Spacer size={8} />
        <Row alignItems="center" gap="12px">
          <Col>
            <Row alignItems="center">
              <Checkbox checked={isMenuProcess} onChange={onChangeIsMenuProcess} />
              <div style={{ cursor: "pointer" }} onClick={onChangeIsMenuProcess}>
                <Text variant="h6">This menu is process</Text>
              </div>
            </Row>
          </Col>
          <Col>
            <Row alignItems="center">
              <Checkbox checked={isZeus} onChange={onChangeIsZues} />
              <div style={{ cursor: "pointer" }} onClick={onChangeIsZues}>
                <Text variant="h6">Menu Zeus</Text>
              </div>
            </Row>
          </Col>
          <Col>
            <Row alignItems="center">
              <Checkbox checked={isHermes} onChange={onChangeIsHermes} />
              <div style={{ cursor: "pointer" }} onClick={onChangeIsHermes}>
                <Text variant="h6">Menu Hermes</Text>
              </div>
            </Row>
          </Col>
        </Row>
        <Spacer size={12} />
        <Card padding="20px">
          <Row justifyContent="flex-end" alignItems="center" nowrap>
            <Row>
              <Row gap="16px">
                <Button size="big" variant="tertiary" onClick={() => Router.back()}>
                  Cancel
                </Button>
                <Button size="big" variant="primary" onClick={handleCreateMenuList}>
                  {isLoading ? "loading..." : "Save"}
                </Button>
              </Row>
            </Row>
          </Row>
        </Card>

        <Spacer size={20} />

        <Accordion style={{ display: "relative" }} id="area">
          <Accordion.Item key={1}>
            <Accordion.Header variant="blue">General</Accordion.Header>
            <Accordion.Body>
              <Row width="100%" gap="20px" noWrap>
                <Input
                  id="name"
                  width="100%"
                  label="Name"
                  height="48px"
                  placeholder="e.g Shipment and Delivery"
                  onChange={handleChangeInput}
                />
                <Input
                  id="screen"
                  width="100%"
                  label="Screen"
                  onChange={handleChangeInput}
                  height="48px"
                  placeholder="e.g Shipment and Delivery"
                />
              </Row>
              {isMenuProcess && (
              <Row width="100%" gap="20px" noWrap>
                <Input
                  id="process_name"
                  width="100%"
                  label="Process Name"
                  onChange={handleChangeInput}
                  height="48px"
                  placeholder="e.g Shipment"
                />
              </Row>
              )}

              <DropdownMenuOptionCustome
                containerId="area"
                handleOpenTotalBadge={() => setStateModal({
								    ...stateModal,
								    isShowModal: true,
								    titleModal: "Associated Permissions",
								    widthModal: 1000,
								  })}
                isAllowClear
                handleChangeValue={handleChangeInputAssociatePermission}
                valueSelectedItems={
									dataAssociatedPermissionsField
									&& dataAssociatedPermissionsField?.map((data: any) => data.key)
								}
                label="Associated Module"
                listItems={datFieldPermission}
              />

              <div
                style={{ cursor: "pointer" }}
                onClick={() => setStateModal({
								    ...stateModal,
								    isShowModal: true,
								    titleModal: "Associated Module",
								    widthModal: 1000,
								  })}
              >
                <Text variant="headingSmall" color="pink.regular">
                  Advance View
                </Text>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <Spacer size={20} />

        <Accordion>
          <Accordion.Item key={1}>
            <Accordion.Header variant="blue">
              <Row gap="8px" alignItems="baseline">
                Allowed Field
              </Row>
            </Accordion.Header>
            <Accordion.Body>
              <Row justifyContent="space-between">
                <Search
                  width="380px"
                  placeholder="Search Menu Name"
                  onChange={(e) => setSearchAllowedField(e.target.value)}
                />
                <Row gap="16px">
                  <Button size="big" variant="tertiary" onClick={handleRemoveAllowedField}>
                    Remove
                  </Button>
                  <Button
                    size="big"
                    variant="primary"
                    onClick={() => setStateModal({
										    ...stateModal,
										    isShowModal: true,
										    titleModal: "Add Field",
										    widthModal: 1000,
										  })}
                  >
                    Add Field
                  </Button>
                </Row>
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
        footer={(
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
              {titleModal === "Associated Permissions" ? "Apply" : "Add"}
            </Button>
          </div>
   )}
        content={(
          <>
            <Spacer size={20} />
            <Row alignItems="flex-end" justifyContent="space-between">
              <Search
                width="380px"
                placeholder={
									titleModal === "Associated Permissions"
									  ? "Search Permission Name"
									  : "Search Field ID, Name, Key"
								}
                onChange={(e: any) => (titleModal === "Associated Permissions"
								    ? setSearchTablePermission(e.target.value)
								    : setSearchTableField(e.target.value))}
              />
              <Row gap="16px">
                {titleModal === "Associated Permissions" ? (
                  <DropdownMenuOptionGroup
                    label="Filter"
                    handleChangeValue={handleChangeFilterValue}
                    isShowClearFilter
                    listItems={listFilterAssociatedPermission}
                  />
                ) : (
                  <Button
                    size="big"
                    variant="primary"
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
								titleModal === "Associated Permissions"
								  ? columnsTablePermission
								  : columnsTableField.filter((filtering) => filtering.dataIndex !== "field_key")
							}
              data={
								titleModal === "Associated Permissions"
								  ? paginateFieldTablePermission
								  : paginateTableField
							}
              rowSelection={
								titleModal === "Associated Permissions"
								  ? rowSelectionTablePermission
								  : rowSelectionTableField
							}
            />
            <Pagination
              pagination={
								titleModal === "Associated Permissions"
								  ? paginationTablePermission
								  : paginationTableField
							}
            />
            <Spacer size={14} />
          </>
   )}
      />

      {modalCreate.open && (
      <ModalRegisterField
        visible={modalCreate.open}
        onCancel={() => setModalCreate({ open: false })}
        onOk={(data: any) => createField(data)}
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

export default CreateMenuList;
