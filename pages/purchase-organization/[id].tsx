import usePagination from "@lucasmogari/react-pagination";
import { lang } from "lang";
import Router from "next/router";
import {
  Accordion,
  Button,
  Col,
  Dropdown,
  DropdownMenuOptionCustome,
  DropdownMenuOptionGroup,
  Input,
  Modal,
  Pagination,
  Row,
  Search,
  Spacer,
  Spin,
  Table,
  Text,
} from "pink-lava-ui";
import { useEffect, useState } from "react";
import styled from "styled-components";
import ArrowLeft from "../../assets/icons/arrow-left.svg";
import { ModalDeleteConfirmation } from "../../components/elements/Modal/ModalConfirmationDelete";
import { ModalRegisterField } from "../../components/elements/Modal/ModalRegisterField";
import { useCreateField, useFields } from "../../hooks/field/useField";
import {
  useDeletePurchaseOrganizationMDM,
  useParentPurchaseOrganizationMDM,
  usePurchaseOrganizationMDM,
  useUpdatePurchaseOrganizationMDM,
} from "../../hooks/mdm/purchase-organization/usePurchaseOrganizationMDM";
import { useFilterListPermissions } from "../../hooks/permission/usePermission";
import { usePartnerConfigPermissionLists } from "../../hooks/user-config/usePermission";

const DetailMenuList: any = () => {
  const t = localStorage.getItem("lan") || "en-US";
  const companyCode = localStorage.getItem("companyCode");
  const [isLoading, setIsLoading] = useState(true);
  const [searchTableField, setSearchTableField] = useState("");
  const [searchTablePermission, setSearchTablePermission] = useState("");
  const [ishowForDropDown, setIshowForDropDown] = useState<boolean>(false);
  const [modalDelete, setModalDelete] = useState({ open: false });
  const [dataAllowedField, setDataAllowedField] = useState([]);
  const [parent, setParent] = useState("");
  const [selectedRowTableField, setSelectedRowTableField] = useState([]);
  const [dataAssociatedPermissionsField, setDataAssociatedPermissionsField] = useState([]);
  const [selectedRowTablePermission, setSelectedRowTablePermission] = useState([]);
  const [modalCreate, setModalCreate] = useState({ open: false });
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
  const [dataTableAssociatePermission, setDataTableAssociatePermission] = useState([]);
  const [selectedRowKeysTablePermission, setSelectedRowKeysTablePermission] = useState([]);
  const [selectedRowKeysTableField, setSelectedRowKeysTableField] = useState([]);
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

  const { isLoading: isLoadingPurchaseOrganization } = usePurchaseOrganizationMDM({
    options: {
      onSuccess: (data) => {
        // let tempDataAllowedField = [];
        // let tempDataAssociatePermission = [];

        // data.field.map((data) => {
        //   tempDataAllowedField.push({
        //     allowed_field: data.name,
        //     allowed_field_id: data.id,
        //     key: data.id,
        //   });
        // });

        // data.modules.map((data) => {
        //   tempDataAssociatePermission.push({
        //     field_name: data.name,
        //     key: data.id,
        //   });
        // });

        // if (data.menu.processName) {
        //   setIsMenuProcess(true);
        // }

        // setIsZeus(data.menu.isZeus === "Y" ? true : false);
        // setIsHermes(data.menu.isHermes === "Y" ? true : false);

        setParent(data.parent);

        setStateFieldInput({
          ...stateFieldInput,
          name: data.name,
        });

        // setDataAllowedField(tempDataAllowedField);

        // onSelectChangeTablePermission(tempDataAssociatePermission.map((data) => data.key));

        // onSelectChangeTableField(tempDataAllowedField.map((data) => data.key));

        // setDataAssociatedPermissionsField(tempDataAssociatePermission);

        if (name) {
          setIsLoading(false);
        }
      },
    },
    id: Router.query.id,
  });

  const { data: fieldsTablePermission, isLoading: isLoadingPermissions } =
    usePartnerConfigPermissionLists({
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

  const { mutate: updatePurchaseOrganization, isLoading: isLoadingUpdatePurchaseOrganization } =
    useUpdatePurchaseOrganizationMDM({
      options: {
        onSuccess: (data) => {
          if (data) {
            setIsLoading(false);
            window.alert("Purchase organization updated successfully");
            Router.back();
          }
        },
        onSettled: (data, error) => {
          setIsLoading(false);
          window.alert(error.data.message);
        },
      },
      id: Router.query.id,
    });

  useEffect(() => {
    if (isShowModal && titleModal === "Product Category") {
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

    const data = {
      company: companyCode,
      name: stateFieldInput?.name,
      parent: parent,
      product_categories: "",
      // process_name: stateFieldInput?.process_name,
      // field: dataAllowedField.map((data) => data.key),
      // is_config: isZeus ? "Y" : "N",
      // is_partner: isHermes ? "Y" : "N",
      // permission: dataAssociatedPermissionsField.map((data) => data.key),
    };
    updatePurchaseOrganization(data);

    // if (!isEmptyField) {
    //   if (dataAllowedField.length !== 0 && dataAssociatedPermissionsField.length !== 0) {

    //   } else {
    //     window.alert("data allowed and data associate permission can't br empty");
    //   }
    // } else {
    //   setIsLoading(false);
    //   window.alert(`field ${isEmptyField} must be fill!`);
    // }
  };

  const { mutate: deleteFields } = useDeletePurchaseOrganizationMDM({
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
      !isLoadingPurchaseOrganization &&
      !isLoadingFilterListPermissions
    ) {
      setTimeout(() => setIshowForDropDown(true), 3000);
    }
  }, [
    isLoading,
    isLoadingPermissions,
    isLoadingPurchaseOrganization,
    isLoadingFilterListPermissions,
  ]);

  const { data: dataParentPurchaseOrganization, isLoading: isLoadingParentPurchaseOrganization } =
    useParentPurchaseOrganizationMDM({
      id: Router.query.id + `/${companyCode}`,
    });

  return (
    <>
      <Col>
        <Row gap="4px">
          <ArrowLeft style={{ cursor: "pointer" }} onClick={() => Router.back()} />
          <Text variant={"h4"}>{stateFieldInput?.name}</Text>
        </Row>

        <Spacer size={12} />
        <Card padding="20px">
          <Row justifyContent="flex-end" alignItems="center" nowrap>
            <Row>
              <Row gap="16px">
                <Button
                  size="big"
                  variant={"tertiary"}
                  onClick={() => setModalDelete({ open: true })}
                >
                  {lang[t].purchaseOrg.tertier.delete}
                </Button>
                <Button size="big" variant={"primary"} onClick={handleUpdateMenuList}>
                  {isLoadingUpdatePurchaseOrganization ? "loading..." : lang[t].purchaseOrg.primary.save}
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
                  value={name}
                  height="48px"
                  placeholder={"e.g Shipment and Delivery"}
                  onChange={handleChangeInput}
                />

                {isLoadingParentPurchaseOrganization || isLoadingPurchaseOrganization ? (
                  <Spin tip="Loading data..." />
                ) : (
                  <>
                    <Dropdown
                      label={lang[t].purchaseOrg.filterbar.parent}
                      isOptional
                      defaultValue={parent}
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

              {!isLoadingPurchaseOrganization && !isLoadingFilterListPermissions ? (
                <DropdownMenuOptionCustome
                  loading={isLoading}
                  handleOpenTotalBadge={() =>
                    setStateModal({
                      ...stateModal,
                      isShowModal: true,
                      titleModal: lang[t].purchaseOrg.filterbar.productCategory,
                      widthModal: 1000,
                    })
                  }
                  isAllowClear
                  valueSelectedItems={
                    dataAssociatedPermissionsField &&
                    dataAssociatedPermissionsField?.map((data) => data.key)
                  }
                  handleChangeValue={handleChangeInputAssociatePermission}
                  label={lang[t].purchaseOrg.filterbar.productCategory}
                  listItems={datFieldPermission}
                />
              ) : (
                <Spin tip="loading data..." />
              )}

              <div
                style={{ cursor: "pointer" }}
                onClick={() =>
                  setStateModal({
                    ...stateModal,
                    isShowModal: true,
                    titleModal: "Product Category",
                    widthModal: 1000,
                  })
                }
              >
                <Text variant="headingSmall" color="pink.regular">
                  Advance View
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
                    ? "Search Permission Name"
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
