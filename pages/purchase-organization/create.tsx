import usePagination from "@lucasmogari/react-pagination";
import { lang } from "lang";
import Router from "next/router";
import {
  Accordion,
  Button,
  Col,
  DropdownMenuOptionCustome,
  DropdownMenuOptionGroup,
  Input,
  Modal,
  Pagination,
  Row,
  Search,
  Spacer,
  Table,
  Text,
  Dropdown,
  Spin,
} from "pink-lava-ui";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { ModalRegisterField } from "../../components/elements/Modal/ModalRegisterField";
import { useCreateField, useFields } from "../../hooks/field/useField";
import {
  useCreatePurchaseOrganizationMDM,
  useParentPurchaseOrganizationMDM,
} from "../../hooks/mdm/purchase-organization/usePurchaseOrganizationMDM";
import { useFilterListPermissions } from "../../hooks/permission/usePermission";
import { usePartnerConfigPermissionLists } from "../../hooks/user-config/usePermission";

const CreateMenuList: any = () => {
  const t = localStorage.getItem("lan") || "en-US";
  const companyCode = localStorage.getItem("companyCode");
  const [isLoading, setLoading] = useState(true);
  const [searchTableField, setSearchTableField] = useState("");
  const [searchTablePermission, setSearchTablePermission] = useState("");
  const [parent, setParent] = useState("");
  const [dataAllowedField, setDataAllowedField] = useState([]);
  const [dataAssociatedPermissionsField, setDataAssociatedPermissionsField] = useState([]);
  const [modalCreate, setModalCreate] = useState({ open: false });
  const [stateFieldInput, setStateFieldInput] = useState({
    name: "",
  });
  const [stateModal, setStateModal] = useState({
    isShowModal: false,
    titleModal: "",
    dataModal: null,
    widthModal: null,
  });
  const { isShowModal, titleModal, widthModal } = stateModal;
  const [dataTableAssociatePermission, setDataTableAssociatePermission] = useState([]);
  const [selectedRowKeysTablePermission, setSelectedRowKeysTablePermission] = useState([]);
  const [selectedRowTablePermission, setSelectedRowTablePermission] = useState([]);
  const [selectedRowKeysTableField, setSelectedRowKeysTableField] = useState([]);
  const [selectedRowTableField, setSelectedRowTableField] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState([]);
  const paginationTableField = usePagination({
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

  const { data: fieldsTablePermission } = usePartnerConfigPermissionLists({
    options: {
      onSuccess: (data) => {
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

  const { mutate: reqBodyFilterListPermission, data: fieldsTablePermissionFilter } =
    useFilterListPermissions({
      options: {
        onSuccess: (data) => {
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
      title: "Product Category",
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

  const paginateFieldTablePermission = dataTablePermission;

  const onSelectChangeTablePermission = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeysTablePermission(selectedRowKeys);
    setSelectedRowTablePermission(selectedRows);
  };

  const rowSelectionTablePermission = {
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

  const handleChangeInput = (e) => {
    setStateFieldInput({
      ...stateFieldInput,
      [e.target.id]: e.target.value,
    });
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
        setLoading(false);
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

  const { data: dataParentPurchaseOrganization, isLoading: isLoadingParentPurchaseOrganization } =
    useParentPurchaseOrganizationMDM({
      id: 0 + `/${companyCode}`,
    });

  const handleSelectedField = () => {
    if (titleModal === "Product Category") {
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

  const handleChangeFilterValue = (selectedFilter) => {
    setSelectedFilter(selectedFilter);
  };

  const { mutate: createPurchaseOrganization, isLoading: isLoadingurchaseOrganization } =
    useCreatePurchaseOrganizationMDM({
      options: {
        onSuccess: (data) => {
          if (data) {
            setLoading(false);
            window.alert("Menu created successfully");
            Router.back();
          }
        },
      },
    });

  useEffect(() => {
    if (isShowModal && titleModal === "Product Category") {
      setLoading(true);
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

  const handleCreateMenuList = () => {
    setLoading(true);
    const isEmptyField = Object.keys(stateFieldInput).find(
      (thereIsEmptyField) =>
        thereIsEmptyField !== "process_name" &&
        stateFieldInput &&
        stateFieldInput[thereIsEmptyField] === ""
    );

    const data = {
      company: companyCode,
      name: stateFieldInput?.name,
      parent: parent,
      product_categories: "",
      // process_name: stateFieldInput?.process_name,
      // isZeus: isZeus ? "Y" : "N",
      // isHermes: isHermes ? "Y" : "N",
      // field: dataAllowedField.map((data) => data.key),
      // permission: dataAssociatedPermissionsField.map((data) => data.key),
    };

    createPurchaseOrganization(data);

    // if (!isEmptyField) {

    //   if (dataAllowedField.length !== 0 && dataAssociatedPermissionsField.length !== 0) {
    //   } else {
    //     window.alert("data allowed and data associate permission can't be empty");
    //   }
    // } else {
    //   setLoading(false);
    //   window.alert(`field ${isEmptyField} must be fill!`);
    // }
  };

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

  return (
    <>
      <Col>
        <Row gap="4px">
          <Text variant={"h4"}>{lang[t].purchaseOrg.pageTitle.createPurchaseOrganization}</Text>
        </Row>
        <Spacer size={12} />
        <Card padding="20px">
          <Row justifyContent="flex-end" alignItems="center" nowrap>
            <Row>
              <Row gap="16px">
                <Button size="big" variant={"tertiary"} onClick={() => Router.back()}>
                  {lang[t].purchaseOrg.tertier.cancel}
                </Button>
                <Button size="big" variant={"primary"} onClick={handleCreateMenuList}>
                  {isLoading ? "loading..." : lang[t].purchaseOrg.primary.save}
                </Button>
              </Row>
            </Row>
          </Row>
        </Card>

        <Spacer size={20} />

        <Accordion>
          <Accordion.Item key={1}>
            <Accordion.Header variant="blue">{lang[t].purchaseOrg.accordion.purchaseOrg}</Accordion.Header>
            <Accordion.Body>
              <Row width="100%" gap="20px" noWrap>
                <Input
                  id="name"
                  width="100%"
                  label={lang[t].purchaseOrg.emptyState.purchaseGroupName}
                  height="48px"
                  placeholder={"e.g Packaging Material"}
                  onChange={handleChangeInput}
                />

                {isLoadingParentPurchaseOrganization ? (
                  <Spin tip="Loading data..." />
                ) : (
                  <>
                    <Dropdown
                      label={lang[t].purchaseOrg.filterbar.parent}
                      isOptional
                      width="100%"
                      items={dataParentPurchaseOrganization.map((data) => ({
                        value: data.name,
                        id: data.code,
                      }))}
                      placeholder={"Select"}
                      handleChange={(text) => setParent(text)}
                      noSearch
                    />

                    <Spacer size={14} />
                  </>
                )}
              </Row>

              <DropdownMenuOptionCustome
                handleOpenTotalBadge={() =>
                  setStateModal({
                    ...stateModal,
                    isShowModal: true,
                    titleModal: lang[t].purchaseOrg.filterbar.productCategory,
                    widthModal: 1000,
                  })
                }
                isAllowClear
                handleChangeValue={handleChangeInputAssociatePermission}
                valueSelectedItems={
                  dataAssociatedPermissionsField &&
                  dataAssociatedPermissionsField?.map((data) => data.key)
                }
                label={lang[t].purchaseOrg.filterbar.productCategory}
                listItems={datFieldPermission}
              />

              <div
                style={{ cursor: "pointer" }}
                onClick={() =>
                  setStateModal({
                    ...stateModal,
                    isShowModal: true,
                    titleModal: lang[t].purchaseOrg.filterbar.productCategory,
                    widthModal: 1000,
                  })
                }
              >
                <Text variant="headingSmall" color="pink.regular">
                  {lang[t].purchaseOrg.button.advanceView}
                </Text>
              </div>
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
              {titleModal === "Product Category" ? "Apply" : "Add"}
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
                  titleModal === "Product Category"
                    ? "Search Product Category Name"
                    : "Search Field ID, Name, Key"
                }
                onChange={(e) =>
                  titleModal === "Product Category"
                    ? setSearchTablePermission(e.target.value)
                    : setSearchTableField(e.target.value)
                }
              />
              <Row gap="16px">
                {titleModal === "Product Category" ? (
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
                titleModal === "Product Category"
                  ? columnsTablePermission
                  : columnsTableField.filter((filtering) => filtering.dataIndex !== "field_key")
              }
              data={
                titleModal === "Product Category"
                  ? paginateFieldTablePermission
                  : paginateTableField
              }
              rowSelection={
                titleModal === "Product Category"
                  ? rowSelectionTablePermission
                  : rowSelectionTableField
              }
            />
            <Pagination
              pagination={
                titleModal === "Product Category" ? paginationTablePermission : paginationTableField
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
