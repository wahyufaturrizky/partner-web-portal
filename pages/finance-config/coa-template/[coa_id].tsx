import React, { useState } from "react";
import Router, { useRouter } from "next/router";
import styled from "styled-components";
import usePagination from "@lucasmogari/react-pagination";
import _ from "lodash";
import {
  Text,
  Button,
  Col,
  Row,
  Spacer,
  Input,
  Table,
  Pagination,
  Search,
  Switch,
  Spin,
  DropdownMenuOptionGroupCustom,
} from "pink-lava-ui";
import {
  useDeleteCoa,
  useDetailCoa,
  useFilterAccountCoa,
  useUpdateCoa,
} from "../../../hooks/finance-config/useCoaTemplate";

import { ModalCopyCoA } from "../../../components/elements/Modal/ModalCopyCoA";
import CreateAccount from "../../../components/pages/CoA/CraeteCoA";
import DetailAccount from "../../../components/pages/CoA/DetailCoA";
import { ModalDeleteConfirmation } from "../../../components/elements/Modal/ModalConfirmationDelete";
import ArrowLeft from "../../../assets/icons/arrow-left.svg";
import VectorPeople from "../../../assets/icons/vector-people.svg";
import PlusAdd from "../../../assets/icons/plus-add.svg";

const DetailCoa: any = () => {
  const router = useRouter();
  const { coa_id } = router.query;
  const [coaName, setCoaName] = useState("");
  const [coaItems, setCoaItems] = useState([]);
  const [coaItemsNew, setCoaItemsNew] = useState([]);
  const [error, setError] = useState("");

  const [coaItemsUpdated, setCoaItemsUpdated] = useState([]);
  const [coaItemsDeleted, setCoaItemsDeleted] = useState([]);
  const [accountGroupId, setAccountGroupId] = useState([]);
  const [accountCode, setAccountCode] = useState([]);

  const [searchAccountGroup, setSearchAccountGroup] = useState("");
  const [modalDelete, setModalDelete] = useState({ open: false });

  let allCoaItems = [];
  allCoaItems = [...coaItemsNew, ...coaItems];
  allCoaItems = allCoaItems?.filter((item) => !coaItemsDeleted?.includes(item?.accountCode));

  if (searchAccountGroup) {
    allCoaItems = allCoaItems?.filter(
      (item) =>
        item.accountGroup.groupName.includes(searchAccountGroup) ||
        item.accountName.includes(searchAccountGroup) ||
        item.accountCode.includes(searchAccountGroup)
    );
  }

  allCoaItems = allCoaItems.slice(0, 10);

  const [modalCopyCoa, setModalCopyCoa] = useState({ open: false });
  const [mode, setMode] = useState({
    mode: "LIST_ACCOUNT",
    field: null,
    source: "",
  });
  const [copyCoaId, setCopyCoaId] = useState(coa_id);

  const columns = [
    {
      title: "Code",
      dataIndex: "account_code",
    },
    {
      title: "Account Name",
      dataIndex: "account_name",
    },
    {
      title: "Account Group",
      dataIndex: "account_group",
    },
    {
      title: "Allow Reconciliation",
      dataIndex: "allow_reconciliation",
    },
    {
      title: "Action",
      dataIndex: "action",
      width: "15%",
      align: "left",
    },
  ];

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const onSelectChange = (selectedRowKeys: any) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const { mutate: updateCoa } = useUpdateCoa({
    options: {
      onSuccess: () => {
        router.push("/finance-config/coa-template");
      },
    },
    coa_id,
  });

  const { mutate: deleteCoa } = useDeleteCoa({
    options: {
      onSuccess: () => {
        router.push("/finance-config/coa-template");
      },
    },
  });

  const onSubmitCoa = () => {
    const newCoaItems = coaItemsNew.map((data: any) => ({
      accountCode: data.accountCode,
      accountName: data.accountName,
      accountGroupId: data.accountGroupId,
      deprecated: data.deprecated,
      allowReconciliation: "N",
    }));

    const updateCoaItems = coaItemsUpdated.map((data: any) => ({
      accountCode: data.accountCode,
      accountName: data.accountName,
      accountGroupId: data.accountGroupId,
      deprecated: data.deprecated,
      allowReconciliation: data.allowReconciliation,
      id: data.id,
    }));

    const payload: any = {
      name: coaName,
      coa_items: {
        copyFrom: coa_id === copyCoaId ? "" : copyCoaId,
        addNew: newCoaItems,
        update: updateCoaItems,
        delete: coaItemsDeleted,
      },
    };

    if (!coaName) {
      setError("Name is required");
    } else {
      updateCoa(payload);
    }
  };

  const paginationCoaAccount = usePagination({
    page: 1,
    itemsPerPage: 20,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
  });

  const { data: dataCoa, isLoading } = useDetailCoa({
    coa_id: copyCoaId,
    options: {
      enabled: !!copyCoaId,
      onSuccess: (data) => {
        setCoaItems(data.coaItems.rows);
        setCoaName(data.name);
        paginationCoaAccount.setTotalItems(data.coaItems.totalRow);
      },
    },
    query: {
      page: paginationCoaAccount.page,
      limit: paginationCoaAccount.itemsPerPage,
      search: searchAccountGroup,
      account_group_id: accountGroupId,
      code: accountCode,
    },
  });

  const paginateField: any = [];

  allCoaItems?.map((field: any) => {
    paginateField.push({
      key: field.id,
      account_code: field.accountCode,
      account_name: field.accountName,
      account_group: field.accountGroup.groupName,
      allow_reconciliation: (
        <Switch
          defaultChecked={field.allowReconciliation == "Y" ? true : false}
          onChange={() => {
            const source = field.id ? "copy" : "new";
            if (source === "new") {
              const coaItemsUpdated = coaItemsNew?.map((coaItem) => {
                if (coaItem.accountCode === field.accountCode) {
                  field.allowReconciliation = field.allowReconciliation === "Y" ? "N" : "Y";
                  return field;
                } else {
                  return coaItem;
                }
              });
              setCoaItemsNew(coaItemsUpdated);
            } else {
              const coaItemsUpdatedNew = coaItems?.map((coaItem) => {
                if (coaItem.accountCode === field.accountCode) {
                  field.allowReconciliation = field.allowReconciliation === "Y" ? "N" : "Y";
                  return field;
                }
                return coaItem;
              });
              setCoaItems(coaItemsUpdatedNew);
              const coaItemsUpdatedNewUpdated = _.unionBy([field], coaItemsUpdated, "accountCode");
              setCoaItemsUpdated(coaItemsUpdatedNewUpdated);
            }
          }}
        />
      ),
      action: (
        <div style={{ display: "flex", justifyContent: "left" }}>
          <Button
            size="small"
            onClick={() => {
              setMode({
                mode: "EDIT_ACCOUNT",
                field: field,
                source: field.id ? "copy" : "new",
              });
            }}
            variant="tertiary"
          >
            View Detail
          </Button>
        </div>
      ),
    });
  });

  const onChangeFilterAccount = (filter) => {
    const accountCode = [];
    const accountGroupId = [];
    filter.forEach((filter) => {
      if (typeof filter === "number") {
        accountGroupId.push(filter);
      } else {
        accountCode.push(filter);
      }
    });
    setAccountCode(accountCode);
    setAccountGroupId(accountGroupId);
  };

  const addCopyCoa = (selectedCoa: any) => {
    setCoaItems([]);
    setCoaItemsNew([]);
    setCoaItemsDeleted([]);
    setCoaItemsUpdated([]);
    setCopyCoaId(selectedCoa);
    setModalCopyCoa({ open: false });
  };

  const { data: filterData, isLoading: isLoadingFilter } = useFilterAccountCoa({
    options: {},
    query: {},
  });

  const listFilterAssociatedPermission = [
    {
      label: "By Account Group",
      list:
        filterData?.accountGroup?.map((data) => ({
          label: data.groupName,
          value: data.id,
        })) ?? [],
    },
    {
      label: "By Code",
      list:
        filterData?.accountCode?.map((data) => ({
          label: data,
          value: data,
        })) ?? [],
    },
  ];

  return (
    <>
      <Col>
        {isLoading || isLoadingFilter ? (
          <Center>
            <Spin tip="Loading data..." />
          </Center>
        ) : (
          <>
            {mode.mode === "LIST_ACCOUNT" && (
              <>
                <Row gap="4px" alignItems="center">
                  <ArrowLeft
                    style={{ cursor: "pointer" }}
                    onClick={() => Router.push("/coa-template")}
                  />
                  <Text variant={"h4"}>{dataCoa?.name}</Text>
                </Row>
                <Spacer size={20} />
                <Card style={{ height: "88px" }}>
                  <Row alignItems="center" justifyContent="space-between" gap="20" noWrap>
                    <Row width="50%" alignItems="center">
                      <Input
                        id="name"
                        label=""
                        height="48px"
                        placeholder={"Type CoA Template Name, e.g CoA Indonesia - FMCG Maufacture"}
                        defaultValue={coaName ? coaName : ""}
                        onChange={(e) => setCoaName(e.target.value)}
                        onBlur={(e) => {
                          if (!e.target.value) {
                            setError("Name is required");
                          }
                        }}
                        error={error}
                        onFocus={() => setError("")}
                      />
                    </Row>
                    <Row justifyContent="flex-end" width="50%" gap="16px">
                      <Button
                        size="big"
                        variant={"tertiary"}
                        onClick={() => setModalDelete({ open: true })}
                      >
                        Delete
                      </Button>
                      <Button size="big" variant={"primary"} onClick={() => onSubmitCoa()}>
                        Save
                      </Button>
                    </Row>
                  </Row>
                </Card>
                <Spacer size={10} />

                <Card style={{ padding: "16px 20px", height: "626px" }}>
                  <Spacer size={10} />
                  <Col gap="30px">
                    {allCoaItems.length !== 0 ? (
                      <>
                        <Row justifyContent="space-between" alignItems="center">
                          <Row gap="16px" alignItems="center">
                            <Search
                              width="380px"
                              placeholder="Search Code, Account Name, Account Group"
                              onChange={(e) => setSearchAccountGroup(e.target.value)}
                            />

                            <Row gap="8px" alignItems="center">
                              <Text variant="subtitle1">Filter</Text>
                              <DropdownMenuOptionGroupCustom
                                handleChangeValue={(filter) => onChangeFilterAccount(filter)}
                                listItems={listFilterAssociatedPermission}
                                label=""
                                width={194}
                                roundedSelector={true}
                                defaultValue={"All"}
                                placeholder="Select"
                              />
                            </Row>
                          </Row>

                          <Row gap="20px">
                            <Button
                              size="big"
                              variant={"ghost"}
                              onClick={() => setModalCopyCoa({ open: true })}
                            >
                              Copy from CoA template
                            </Button>
                            <Button
                              size="big"
                              variant={"ghost"}
                              onClick={() =>
                                setMode({ field: null, mode: "ADD_ACCOUNT", source: "" })
                              }
                            >
                              <div style={{ marginRight: "6px" }}>
                                <PlusAdd />
                              </div>
                              Add Account
                            </Button>
                          </Row>
                        </Row>
                        <Table columns={columns} data={paginateField} rowSelection={rowSelection} />
                        {paginationCoaAccount.totalItems > 10 && (
                          <Pagination pagination={paginationCoaAccount} />
                        )}
                      </>
                    ) : (
                      <>
                        <Row justifyContent="center">
                          <VectorPeople />
                        </Row>
                        <Row justifyContent="center">
                          <Text variant="headingLarge">No Data Chart of Account</Text>
                        </Row>
                        <Row justifyContent="center">
                          <Text variant="headingRegular">
                            Please add account or copy from CoA template first.
                          </Text>
                        </Row>
                        <Row justifyContent="center" gap="15px">
                          <Button
                            size="big"
                            variant={"tertiary"}
                            onClick={() => setModalCopyCoa({ open: true })}
                          >
                            Copy from CoA Template
                          </Button>
                          <Button
                            size="big"
                            variant={"primary"}
                            onClick={() =>
                              setMode({ field: null, mode: "ADD_ACCOUNT", source: "" })
                            }
                          >
                            Add Account
                          </Button>
                        </Row>
                      </>
                    )}
                  </Col>
                </Card>
              </>
            )}

            {mode.mode === "ADD_ACCOUNT" && (
              <CreateAccount
                onSubmit={(newAccount) => {
                  const cloneCoaItems = _.cloneDeep(coaItemsNew);
                  cloneCoaItems.push(newAccount);
                  setCoaItemsNew(cloneCoaItems);
                  setMode({ field: null, mode: "LIST_ACCOUNT", source: "" });
                }}
                onBack={() => setMode({ field: null, mode: "LIST_ACCOUNT", source: "" })}
                coaId={copyCoaId}
                coaItemsDeleted={coaItemsDeleted?.map((coa) => coa.accessCode) || []}
              />
            )}

            {mode.mode === "EDIT_ACCOUNT" && (
              <DetailAccount
                onSubmit={(newAccount, source) => {
                  if (source === "new") {
                    const coaItemsUpdated = coaItemsNew?.map((coaItem) => {
                      if (coaItem.accountCode === newAccount.accountCode) {
                        return newAccount;
                      } else {
                        return coaItem;
                      }
                    });
                    setCoaItemsNew(coaItemsUpdated);
                  } else {
                    const coaItemsUpdatedNew = coaItems?.map((coaItem) => {
                      if (coaItem.accountCode === newAccount.accountCode) {
                        return newAccount;
                      }
                      return coaItem;
                    });
                    setCoaItems(coaItemsUpdatedNew);
                    const coaItemsUpdatedNewUpdated = _.unionBy(
                      [newAccount],
                      coaItemsUpdated,
                      "accountCode"
                    );
                    setCoaItemsUpdated(coaItemsUpdatedNewUpdated);
                  }
                  setMode({ field: null, mode: "LIST_ACCOUNT", source: "" });
                }}
                onDelete={(deletedId) => {
                  if (coaItemsNew?.some((item) => item.accountCode === deletedId)) {
                    let cloneCoaItemsNew = _.cloneDeep(coaItemsNew);
                    cloneCoaItemsNew = cloneCoaItemsNew.filter(
                      (acc) => acc.accountCode !== deletedId
                    );
                    setCoaItemsNew(cloneCoaItemsNew);
                  } else {
                    const cloneDeletedCoaItems = _.cloneDeep(coaItemsDeleted);
                    cloneDeletedCoaItems.push(deletedId);
                    setCoaItemsDeleted(cloneDeletedCoaItems);
                  }
                  setMode({ field: null, mode: "LIST_ACCOUNT", source: "" });
                }}
                onBack={() => setMode({ field: null, mode: "LIST_ACCOUNT", source: "" })}
                account={mode.field}
                source={mode.source}
                coaId={copyCoaId}
              />
            )}
          </>
        )}

        {modalCopyCoa.open && (
          <ModalCopyCoA
            visible={modalCopyCoa.open}
            onCancel={() => setModalCopyCoa({ open: false })}
            onOk={(key: any) => addCopyCoa(key)}
            coaId={coa_id}
          />
        )}

        {modalDelete.open && (
          <ModalDeleteConfirmation
            itemTitle={dataCoa?.name}
            visible={modalDelete.open}
            onCancel={() => setModalDelete({ open: false })}
            onOk={() => deleteCoa({ ids: [coa_id] })}
          />
        )}
      </Col>
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
	padding: 16px;
`;

export default DetailCoa;
