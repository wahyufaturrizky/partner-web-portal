import React, { useState } from "react";
import { useRouter } from "next/router";
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
import { lang } from "lang";

const DetailCoa: any = () => {
  const router = useRouter();
  const t = localStorage.getItem("lan") || "en-US";

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
      title: lang[t].coaTemplate.create.template.table.code,
      dataIndex: "account_code",
    },
    {
      title: lang[t].coaTemplate.create.template.table.accountName,
      dataIndex: "account_name",
    },
    {
      title: lang[t].coaTemplate.create.template.table.accountGroup,
      dataIndex: "account_group",
    },
    {
      title: lang[t].coaTemplate.create.template.table.allowReconciliation,
      dataIndex: "allow_reconciliation",
    },
    {
      title: lang[t].coaTemplate.create.template.table.action,
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

  const { data: coaData, isLoading: isLoadingCoa } = useDetailCoa({
    coa_id: coa_id,
    options: {
      onSuccess: (data: any) => {},
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

  console.log(allCoaItems);

  allCoaItems?.map((field: any, index) => {
    paginateField.push({
      key: field.accountCode,
      account_code: field.accountCode,
      account_name: field.accountName,
      account_group: field?.accountGroup?.groupName,
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
            {lang[t].coaTemplate.list.button.detail}
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

  const isSearchAndFilter =
    !!searchAccountGroup || accountGroupId.length > 0 || accountCode.length > 0;
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
                    onClick={() => {
                      router.back();
                    }}
                  />
                  <Text variant={"h4"}>{coaData?.name}</Text>
                </Row>
                <Spacer size={20} />
                <Card style={{ height: "88px" }}>
                  <Row alignItems="center" justifyContent="space-between" gap="20" noWrap>
                    <Row width="50%" alignItems="center">
                      <Input
                        id="name"
                        label=""
                        height="48px"
                        placeholder={lang[t].coaTemplate.create.template.field.searchList}
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
                        disabled={rowSelection.selectedRowKeys?.length === 0}
                      >
                        {lang[t].coaTemplate.list.button.delete}
                      </Button>
                      <Button size="big" variant={"primary"} onClick={() => onSubmitCoa()}>
                        {lang[t].coaTemplate.list.button.save}
                      </Button>
                    </Row>
                  </Row>
                </Card>
                <Spacer size={10} />

                <Card style={{ padding: "16px 20px", height: "626px" }}>
                  <Spacer size={10} />
                  <Col gap="30px">
                    {allCoaItems.length !== 0 || isSearchAndFilter ? (
                      <>
                        <Row justifyContent="space-between" alignItems="center">
                          <Row gap="16px" alignItems="center">
                            <Search
                              width="380px"
                              placeholder={lang[t].coaTemplate.create.template.field.search}
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
                              {lang[t].coaTemplate.create.template.button.copyCoa}
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
                              {lang[t].coaTemplate.create.template.button.addAccount}
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
                          <Text variant="headingLarge">
                            {lang[t].coaTemplate.create.template.dictionary.noDataChart}
                          </Text>
                        </Row>
                        <Row justifyContent="center">
                          <Text variant="headingRegular">
                            {lang[t].coaTemplate.create.template.dictionary.noAccount}
                          </Text>
                        </Row>
                        <Row justifyContent="center" gap="15px">
                          <Button
                            size="big"
                            variant={"tertiary"}
                            onClick={() => setModalCopyCoa({ open: true })}
                          >
                            {lang[t].coaTemplate.create.template.button.copyCoa}
                          </Button>
                          <Button
                            size="big"
                            variant={"primary"}
                            onClick={() =>
                              setMode({ field: null, mode: "ADD_ACCOUNT", source: "" })
                            }
                          >
                            {lang[t].coaTemplate.create.template.button.addAccount}
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
                    // Update COA to view
                    const coaItemsUpdatedNew = coaItems?.map((coaItem) => {
                      if (coaItem.accountCode === newAccount.accountCode) {
                        return {
                          id: coaItem?.id,
                          ...newAccount,
                        };
                      }
                      return coaItem;
                    });
                    setCoaItems(coaItemsUpdatedNew);

                    // Update COA for payload update
                    const getIdCoa = coaItems?.filter(
                      (coaItem) => coaItem.accountCode === newAccount.accountCode
                    )[0]?.id;
                    const coaItemsUpdatedNewUpdated = _.unionBy(
                      [{ id: getIdCoa, ...newAccount }],
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
            totalSelected={selectedRowKeys?.length}
            itemTitle={
              allCoaItems?.find((element: any) => element.accountCode === selectedRowKeys[0])
                ?.accountName
            }
            visible={modalDelete.open}
            onCancel={() => setModalDelete({ open: false })}
            onOk={() => {
              if (selectedRowKeys?.length > 1) {
                let getCoaItemNew = coaItemsNew.filter(
                  (item) => !selectedRowKeys.includes(item.accountCode)
                );
                let getAccountCode = coaItems.map((item) => item.accountCode);

                let deletedCoa = selectedRowKeys.filter((item) => getAccountCode.includes(item));

                setCoaItemsNew(getCoaItemNew);
                setCoaItemsDeleted(deletedCoa);
                setModalDelete({ open: false });
              } else {
                if (coaItemsNew?.some((item) => item.accountCode === selectedRowKeys[0])) {
                  let cloneCoaItemsNew = _.cloneDeep(coaItemsNew);
                  cloneCoaItemsNew = cloneCoaItemsNew.filter(
                    (acc) => acc.accountCode !== selectedRowKeys[0]
                  );
                  setCoaItemsNew(cloneCoaItemsNew);
                  setModalDelete({ open: false });
                } else {
                  const cloneDeletedCoaItems = _.cloneDeep(coaItemsDeleted);
                  cloneDeletedCoaItems.push(selectedRowKeys[0]);
                  setCoaItemsDeleted(cloneDeletedCoaItems);
                  setModalDelete({ open: false });
                }
              }
            }}
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
