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
  FormSelect,
} from "pink-lava-ui";

import { lang } from "lang";
import { useInfiniteIndustry } from "hooks/industry/useIndustries";
import { useSegmentInfiniteLists } from "hooks/segment/useSegment";
import { useCountryInfiniteLists } from "hooks/mdm/country-structure/useCountries";
import useDebounce from "lib/useDebounce";
import { Controller, useForm } from "react-hook-form";
import { colors } from "utils/color";
import { permissionCoaTemplate } from "permission/coa-template";
import { useUserPermissions } from "hooks/user-config/usePermission";
import PlusAdd from "../../../assets/icons/plus-add.svg";
import VectorPeople from "../../../assets/icons/vector-people.svg";
import ArrowLeft from "../../../assets/icons/arrow-left.svg";
import { ModalDeleteConfirmation } from "../../../../components/elements/Modal/ModalConfirmationDelete";
import DetailAccount from "../../../../components/pages/CoA/DetailCoA";
import CreateAccount from "../../../../components/pages/CoA/CraeteCoA";
import { ModalCopyCoA } from "../../../../components/elements/Modal/ModalCopyCoA";
import {
  useDeleteCoa,
  useDetailCoa,
  useFilterAccountCoa,
  useUpdateCoa,
} from "../../../../hooks/finance-config/useCoaTemplate";

const DetailCoa: any = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({});

  const router = useRouter();
  const t = localStorage.getItem("lan") || "en-US";
  const companyCode = localStorage.getItem("companyCode");
  const { coa_id } = router.query;
  const [coaName, setCoaName] = useState("");
  const [countryId, setCountryId] = useState("");
  const [industryId, setIndustryId] = useState("");
  const [segmentId, setSegmentId] = useState("");
  const [coaItems, setCoaItems] = useState([]);
  const [coaItemsNew, setCoaItemsNew] = useState([]);
  const [error, setError] = useState("");

  const [coaItemsUpdated, setCoaItemsUpdated] = useState([]);
  const [coaItemsDeleted, setCoaItemsDeleted] = useState([]);
  const [accountGroupId, setAccountGroupId] = useState([]);
  const [accountCode, setAccountCode] = useState([]);

  const [searchAccountGroup, setSearchAccountGroup] = useState("");
  const [modalDelete, setModalDelete] = useState({ open: false });

  const [countryList, setCountryList] = useState<any[]>([]);
  const [totalRowsCountryList, setTotalRowsCountryList] = useState(0);
  const [industryList, setIndustryList] = useState<any[]>([]);
  const [totalRowsIndustryList, setTotalRowsIndustryList] = useState(0);
  const [segmentList, setSegmentList] = useState<any[]>([]);
  const [totalRowsSegmentList, setTotalRowsSegmentList] = useState(0);
  const [searchCountry, setSearchCountry] = useState("");
  const [searchIndustry, setSearchIndustry] = useState("");
  const [searchSegment, setSearchSegment] = useState("");

  const { data: dataUserPermission } = useUserPermissions({
    options: {
      onSuccess: () => {},
    },
  });

  const listPermission = dataUserPermission?.permission?.filter(
    (filtering: any) => filtering.menu === "Coa Template",
  );

  const debounceFetch = useDebounce(searchCountry || searchSegment || searchIndustry, 1000);
  let allCoaItems = [];
  allCoaItems = [...coaItemsNew, ...coaItems];
  allCoaItems = allCoaItems?.filter((item) => !coaItemsDeleted?.includes(item?.accountCode));

  if (searchAccountGroup) {
    allCoaItems = allCoaItems?.filter(
      (item) => item.accountGroup.groupName.includes(searchAccountGroup)
        || item.accountName.includes(searchAccountGroup)
        || item.accountCode.includes(searchAccountGroup),
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
  const [isModalDelete, setIsModalDelete] = useState({ open: false });

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
  const {
    isFetching: isFetchingCountry,
    isFetchingNextPage: isFetchingMoreCountry,
    hasNextPage: hasNextPageCountry,
    fetchNextPage: fetchNextPageCountry,
  } = useCountryInfiniteLists({
    query: {
      search: debounceFetch,
      limit: 10,
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRowsCountryList(data.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => group.rows?.map((element: any) => ({
          value: element.id,
          label: element.name,
        })));
        const flattenArray = [].concat(...mappedData);
        setCountryList(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (countryList.length < totalRowsCountryList) {
          return pages.length + 1;
        }
        return undefined;
      },
    },
  });
  const {
    isFetching: isFetchingSegment,
    isFetchingNextPage: isFetchingMoreSegment,
    hasNextPage: hasNextPageSegment,
    fetchNextPage: fetchNextPageSegment,
  } = useSegmentInfiniteLists({
    query: {
      search: debounceFetch,
      limit: 10,
      industry_id: industryId,
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRowsSegmentList(data.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => group.rows?.map((element: any) => ({
          value: element.id,
          label: element.name,
        })));
        const flattenArray = [].concat(...mappedData);
        setSegmentList(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (segmentList.length < totalRowsSegmentList) {
          return pages.length + 1;
        }
        return undefined;
      },
    },
  });

  const {
    isLoading: isLoadingIndustry,
    isFetching: isFetchingIndustry,
    isFetchingNextPage: isFetchingMoreIndustry,
    hasNextPage: hasNextIndustry,
    fetchNextPage: fetchNextIndustry,
  } = useInfiniteIndustry({
    query: {
      search: debounceFetch,
      limit: 10,
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRowsIndustryList(data.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => group.rows?.map((element: any) => ({
          label: element.name,
          value: element.id,
        })));
        const flattenArray = [].concat(...mappedData);
        setIndustryList(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (industryList.length < totalRowsIndustryList) {
          return pages.length + 1;
        }
        return undefined;
      },
    },
  });
  const { mutate: updateCoa } = useUpdateCoa({
    options: {
      onSuccess: () => {
        router.push("/config/finance-config/coa-template");
      },
    },
    coa_id,
  });
  console.log(coa_id);
  const { mutate: deleteCoa, isLoading: isLoadingDeleteCoa } = useDeleteCoa({
    options: {
      onSuccess: () => {
        router.push("/config/finance-config/coa-template");
      },
    },
  });

  const onSubmitCoa = (value: any) => {
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
      name: value.name,
      industry_id: value.industry_id,
      segment_id: value.segment_id,
      country_id: value.country_id,
      company_id: companyCode,
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
        setCountryId(data.countryId);
        setIndustryId(data.industryId);
        setSegmentId(data.segmentId);
        paginationCoaAccount.setTotalItems(data.coaItems.totalRow);
      },
    },
    query: {
      page: paginationCoaAccount.page,
      limit: paginationCoaAccount.itemsPerPage,
      search: searchAccountGroup,
      account_group_id: accountGroupId,
      code: accountCode,
      company_id: "KSNI",
    },
  });

  const { data: coaData, isLoading: isLoadingCoa } = useDetailCoa({
    coa_id,
    options: {
      onSuccess: (data: any) => {},
    },
    query: {
      page: paginationCoaAccount.page,
      limit: paginationCoaAccount.itemsPerPage,
      search: searchAccountGroup,
      account_group_id: accountGroupId,
      code: accountCode,
      company_id: "KSNI",
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
          defaultChecked={field.allowReconciliation == "Y"}
          onChange={() => {
            const source = field.id ? "copy" : "new";
            if (source === "new") {
              const coaItemsUpdated = coaItemsNew?.map((coaItem) => {
                if (coaItem.accountCode === field.accountCode) {
                  field.allowReconciliation = field.allowReconciliation === "Y" ? "N" : "Y";
                  return field;
                }
                return coaItem;
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
                field,
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

  const isSearchAndFilter = !!searchAccountGroup || accountGroupId.length > 0 || accountCode.length > 0;
  return (
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
              <Text variant="h4">{coaData?.name}</Text>
            </Row>
            <Spacer size={20} />
            <Card style={{ height: "88px" }}>
              <Row alignItems="center" justifyContent="space-between" gap="20" noWrap>
                <Row justifyContent="flex-end" width="100%" gap="16px">
                  {listPermission?.filter(
                    (x: any) => x.viewTypes[0]?.viewType.name === "Delete",
                  ).length > 0 && (
                        <Button
                          size="big"
                          variant="tertiary"
                          onClick={() => setIsModalDelete({ open: true })}
                        >
                          {lang[t].coaTemplate.list.button.delete}
                        </Button>
                  )}
                  {listPermission?.filter(
                    (x: any) => x.viewTypes[0]?.viewType.name === "Update",
                  ).length > 0 && (
                        <Button size="big" variant="primary" onClick={handleSubmit(onSubmitCoa)}>
                          {lang[t].coaTemplate.list.button.save}
                        </Button>
                  )}
                </Row>
              </Row>
            </Card>
            <Spacer size={10} />

            <Card style={{ padding: "16px 20px", height: "700px" }}>
              <Row width="100%" gap="20px" noWrap>
                <Col width="100%">
                  <Input
                    label="Name"
                    height="48px"
                    placeholder={lang[t].coaTemplate.create.template.field.searchList}
                    defaultValue={coaName || ""}
                    {...register("name", { required: true })}
                    error={errors?.name?.type === "required" && "This  field is required"}
                    required
                  />
                </Col>
                <Col width="100%">
                  <Controller
                    control={control}
                    name="country_id"
                    defaultValue={countryId || ""}
                    rules={{
                          required: {
                            value: true,
                            message: "Please enter country.",
                          },
                        }}
                    render={({ field: { onChange }, fieldState: { error } }) => (
                          <>
                            <Label>
                              Country
                              {' '}
                              <span style={{ color: colors.red.regular }}>*</span>
                            </Label>
                            <Spacer size={3} />
                            <FormSelect
                              defaultValue={countryId || ""}
                              error={error?.message}
                              height="48px"
                              style={{ width: "100%" }}
                              size="large"
                              placeholder="Select"
                              borderColor="#AAAAAA"
                              arrowColor="#000"
                              withSearch
                              isLoading={isFetchingCountry}
                              isLoadingMore={isFetchingMoreCountry}
                              fetchMore={() => {
                                if (hasNextPageCountry) {
                                  fetchNextPageCountry();
                                }
                              }}
                              items={isFetchingCountry && !isFetchingMoreCountry ? [] : countryList}
                              onChange={(value: any) => {
                                onChange(value);
                              }}
                              onSearch={(value: any) => {
                                setSearchCountry(value);
                              }}
                            />
                          </>
                        )}
                  />
                </Col>
              </Row>
              <Row width="100%" gap="20px" noWrap>
                <Col width="100%">
                  <Controller
                    control={control}
                    name="industry_id"
                    defaultValue={industryId || ""}
                    rules={{
                          required: {
                            value: true,
                            message: "Please enter country.",
                          },
                        }}
                    render={({ field: { onChange }, fieldState: { error } }) => (
                          <>
                            <Label>
                              Industry
                              {' '}
                              <span style={{ color: colors.red.regular }}>*</span>
                            </Label>
                            <Spacer size={3} />
                            <FormSelect
                              defaultValue={industryId || ""}
                              error={error?.message}
                              height="48px"
                              style={{ width: "100%" }}
                              size="large"
                              placeholder="Select"
                              borderColor="#AAAAAA"
                              arrowColor="#000"
                              withSearch
                              isLoading={isFetchingIndustry}
                              isLoadingMore={isFetchingMoreIndustry}
                              fetchMore={() => {
                                if (hasNextIndustry) {
                                  fetchNextIndustry();
                                }
                              }}
                              items={
                                isFetchingIndustry && !isFetchingMoreIndustry ? [] : industryList
                              }
                              onChange={(value: any) => {
                                onChange(value);
                                setIndustryId(value);
                              }}
                              onSearch={(value: any) => {
                                setSearchIndustry(value);
                              }}
                            />
                          </>
                        )}
                  />
                </Col>
                <Col width="100%">
                  <Controller
                    control={control}
                    name="segment_id"
                    defaultValue={segmentId || ""}
                    rules={{
                          required: {
                            value: true,
                            message: "Please enter country.",
                          },
                        }}
                    render={({ field: { onChange }, fieldState: { error } }) => (
                          <>
                            <Label>
                              Segment
                              {' '}
                              <span style={{ color: colors.red.regular }}>*</span>
                            </Label>
                            <Spacer size={3} />
                            <FormSelect
                              defaultValue={segmentId || ""}
                              error={error?.message}
                              height="48px"
                              style={{ width: "100%" }}
                              size="large"
                              placeholder="Select"
                              borderColor="#AAAAAA"
                              arrowColor="#000"
                              withSearch
                              isLoading={isFetchingSegment}
                              isLoadingMore={isFetchingMoreSegment}
                              fetchMore={() => {
                                if (hasNextPageSegment) {
                                  fetchNextPageSegment();
                                }
                              }}
                              items={isFetchingSegment && !isFetchingMoreSegment ? [] : segmentList}
                              onChange={(value: any) => {
                                onChange(value);
                              }}
                              onSearch={(value: any) => {
                                setSearchSegment(value);
                              }}
                            />
                          </>
                        )}
                  />
                </Col>
              </Row>
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
                                roundedSelector
                                defaultValue="All"
                                placeholder="Select"
                              />
                            </Row>
                          </Row>

                          <Row gap="20px">
                            <Button
                              size="big"
                              variant="tertiary"
                              onClick={() => setModalDelete({ open: true })}
                              disabled={rowSelection.selectedRowKeys?.length === 0}
                            >
                              Delete
                            </Button>
                            <Button
                              size="big"
                              variant="tertiary"
                              onClick={() => setModalCopyCoa({ open: true })}
                            >
                              {lang[t].coaTemplate.create.template.button.copyCoa}
                            </Button>
                            <Button
                              size="big"
                              variant="tertiary"
                              onClick={() => setMode({ field: null, mode: "ADD_ACCOUNT", source: "" })}
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
                            variant="tertiary"
                            onClick={() => setModalCopyCoa({ open: true })}
                          >
                            {lang[t].coaTemplate.create.template.button.copyCoa}
                          </Button>
                          <Button
                            size="big"
                            variant="primary"
                            onClick={() => setMode({ field: null, mode: "ADD_ACCOUNT", source: "" })}
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
                  }
                  return coaItem;
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
                  (coaItem) => coaItem.accountCode === newAccount.accountCode,
                )[0]?.id;
                const coaItemsUpdatedNewUpdated = _.unionBy(
                  [{ id: getIdCoa, ...newAccount }],
                  coaItemsUpdated,
                  "accountCode",
                );
                setCoaItemsUpdated(coaItemsUpdatedNewUpdated);
              }
              setMode({ field: null, mode: "LIST_ACCOUNT", source: "" });
            }}
            onDelete={(deletedId) => {
              if (coaItemsNew?.some((item) => item.accountCode === deletedId)) {
                let cloneCoaItemsNew = _.cloneDeep(coaItemsNew);
                cloneCoaItemsNew = cloneCoaItemsNew.filter(
                  (acc) => acc.accountCode !== deletedId,
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
            const getCoaItemNew = coaItemsNew.filter(
              (item) => !selectedRowKeys.includes(item.accountCode),
            );
            const getAccountCode = coaItems.map((item) => item.accountCode);

            const deletedCoa = selectedRowKeys.filter((item) => getAccountCode.includes(item));

            setCoaItemsNew(getCoaItemNew);
            setCoaItemsDeleted(deletedCoa);
            setModalDelete({ open: false });
          } else if (coaItemsNew?.some((item) => item.accountCode === selectedRowKeys[0])) {
            let cloneCoaItemsNew = _.cloneDeep(coaItemsNew);
            cloneCoaItemsNew = cloneCoaItemsNew.filter(
              (acc) => acc.accountCode !== selectedRowKeys[0],
            );
            setCoaItemsNew(cloneCoaItemsNew);
            setModalDelete({ open: false });
          } else {
            const cloneDeletedCoaItems = _.cloneDeep(coaItemsDeleted);
            cloneDeletedCoaItems.push(selectedRowKeys[0]);
            setCoaItemsDeleted(cloneDeletedCoaItems);
            setModalDelete({ open: false });
          }
        }}
      />
      )}

      {isModalDelete.open && (
      <ModalDeleteConfirmation
        totalSelected={selectedRowKeys?.length}
        itemTitle={coaData?.name}
        isLoading={isLoadingDeleteCoa}
        visible={isModalDelete.open}
        onCancel={() => setIsModalDelete({ open: false })}
        onOk={() => deleteCoa({ ids: [coa_id], company_id: companyCode })}
      />
      )}
    </Col>
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
const Label = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  color: #000000;
`;
export default DetailCoa;
