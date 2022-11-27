import usePagination from "@lucasmogari/react-pagination";
import useDebounce from "../../lib/useDebounce";
import { queryClient } from "../_app";
import { ICDelete } from "../../assets";

import {
  Button,
  Col,
  ContentSwitcher,
  Input,
  Modal,
  Row,
  Search,
  Spacer,
  Spin,
  Table,
  Text,
  Pagination,
  DropdownMenuOptionCustome,
  FormSelect,
} from "pink-lava-ui";
import { useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import styled from "styled-components";
import ActivePricingStructure from "../../components/pricing-structure/active";
import DraftPricingStructure from "../../components/pricing-structure/draft";
import InActivePricingStructure from "../../components/pricing-structure/inactive";
import RejectedPricingStructure from "../../components/pricing-structure/rejected";
import WaitingApprovalPricingStructure from "../../components/pricing-structure/waiting-approval";
import {
  useCreateGroupBuying,
  useCreatePricingConfig,
  useDeleteGroupBuyingList,
  useDeletePricingConfigList,
  useGroupBuyingInfiniteLists,
  useGroupBuyingLists,
  usePricingConfigLists,
  usePricingStructureLists,
  useUpdateGroupBuyingList,
  useUpdatePricingConfigList,
} from "../../hooks/pricing-structure/usePricingStructure";
import { useCustomerGroupsMDM } from "hooks/mdm/customers/useCustomersGroupMDM";

const renderConfirmationTextGroupBuying = (type: any, data: any) => {
  switch (type) {
    case "selection":
      return data.selectedRowKeysGroupBuying.length > 1
        ? `Are you sure to delete ${data.selectedRowKeysGroupBuying.length} items ?`
        : `Are you sure to delete group buying name ${
            data?.dataGroupBuying?.data.find(
              (el: any) => el.key === data.selectedRowKeysGroupBuying[0]
            )?.name
          } ?`;
    case "detail":
      return `Are you sure to delete group buying name ${data.name} ?`;

    default:
      break;
  }
};

const renderConfirmationTextPricingConfig = (type: any, data: any) => {
  switch (type) {
    case "selection":
      return data.selectedRowKeysPricingConfig.length > 1
        ? `Are you sure to delete ${data.selectedRowKeysPricingConfig.length} items ?`
        : `Are you sure to delete pricing config name ${
            data?.dataPricingConfig?.data.find(
              (el: any) => el.key === data.selectedRowKeysPricingConfig[0]
            )?.name
          } ?`;
    case "detail":
      return `Are you sure to delete pricing config name ${data.name} ?`;

    default:
      break;
  }
};

const PricingStructureList: any = () => {
  const companyCode = localStorage.getItem("companyCode");
  const [searchGroupBuying, setSearchGroupBuying] = useState("");
  const [searchPricingConfig, setSearchPricingConfig] = useState("");

  const [isShowDeleteGroupBuying, setShowDeleteGroupBuying] = useState({
    open: false,
    type: "selection",
    data: {},
  });

  const [isShowDeletePricingConfig, setShowDeletePricingConfig] = useState({
    open: false,
    type: "selection",
    data: {},
  });

  const [selectedRowKeysGroupBuying, setSelectedRowKeysGroupBuying] = useState([]);
  const [selectedRowKeysPricingConfig, setSelectedRowKeysPricingConfig] = useState([]);

  const [totalRowsGroupBuyingList, setTotalRowsGroupBuyingList] = useState(0);

  const [groupBuyingList, setGroupBuyingList] = useState<any[]>([]);

  const [searchGroupBuyingList, setSearchGroupBuyingList] = useState("");

  const paginationGroupBuying = usePagination({
    page: 1,
    itemsPerPage: 20,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
  });

  const paginationPricingConfig = usePagination({
    page: 1,
    itemsPerPage: 20,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
  });

  const debounceSearch = useDebounce(
    searchGroupBuying || searchGroupBuyingList || searchPricingConfig,
    1000
  );

  const {
    data: pricingStructureLists,
    isLoading: isLoadingPricingStructureList,
    refetch,
  } = usePricingStructureLists({
    options: {
      onSuccess: (data: any) => {},
    },
    query: {
      status: "ACTIVE",
      company_id: companyCode
    },
  });

  const { mutate: deleteGroupBuying, isLoading: isLoadingDeleteGroupBuying }: any =
    useDeleteGroupBuyingList({
      options: {
        onSuccess: () => {
          setShowDeleteGroupBuying({ open: false, data: {}, type: "" });
          setSelectedRowKeysGroupBuying([]);
          queryClient.invalidateQueries(["group-buying"]);
        },
      },
    });

  const {
    data: customerGroupsMDMData,
    isLoading: isLoadingCustomerGroupsMDM,
    isFetching: isFetchingCustomerGroupsMDM,
  } = useCustomerGroupsMDM({
    query: {
      limit: 10000,
      company: companyCode,
    },
    options: {
      onSuccess: (data: any) => {},
    },
  });

  const { mutate: deletePricingConfig, isLoading: isLoadingDeletePricingConfig }: any =
    useDeletePricingConfigList({
      options: {
        onSuccess: () => {
          setShowDeletePricingConfig({ open: false, data: {}, type: "" });
          setSelectedRowKeysPricingConfig([]);
          queryClient.invalidateQueries(["pricing-config"]);
        },
      },
    });

  const {
    data: dataGroupBuying,
    isLoading: isLoadingGroupBuying,
    isFetching: isFetchingGroupBuying,
  } = useGroupBuyingLists({
    query: {
      search: debounceSearch,
      page: paginationGroupBuying.page,
      limit: paginationGroupBuying.itemsPerPage,
    },
    options: {
      onSuccess: (data: any) => {
        paginationGroupBuying.setTotalItems(data.totalRow);
      },
      select: (data: any) => {
        const mappedData = data?.rows?.map((element: any) => {
          return {
            key: element.id,
            id: element.id,
            name: element.name,
            groupBuyingPriceToCustomerGroups: element.groupBuyingPriceToCustomerGroups,
            action: (
              <div style={{ display: "flex", justifyContent: "left" }}>
                <Button
                  size="small"
                  onClick={() =>
                    setModalPricingStructureForm({
                      open: true,
                      typeForm: "Customer Group Buying Price",
                      data: element,
                    })
                  }
                  variant="tertiary"
                >
                  View Detail
                </Button>
              </div>
            ),
          };
        });

        return { data: mappedData, totalRow: data.totalRow };
      },
    },
  });

  const {
    isFetching: isFetchingInfiniteGroupBuying,
    isFetchingNextPage: isFetchingMoreInfiniteGroupBuying,
    hasNextPage: hasNextPageInfiniteGroupBuying,
    fetchNextPage: fetchNextPageInfiniteGroupBuying,
  } = useGroupBuyingInfiniteLists({
    query: {
      search: debounceSearch,
      limit: 10,
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRowsGroupBuyingList(data.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => {
          return group.rows?.map((element: any) => {
            return {
              value: element.id,
              label: element.name,
            };
          });
        });
        const flattenArray = [].concat(...mappedData);
        setGroupBuyingList(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (groupBuyingList.length < totalRowsGroupBuyingList) {
          return pages.length + 1;
        } else {
          return undefined;
        }
      },
    },
  });

  const {
    data: dataPricingConfig,
    isLoading: isLoadingPricingConfig,
    isFetching: isFetchingPricingConfig,
  } = usePricingConfigLists({
    query: {
      search: debounceSearch,
      page: paginationPricingConfig.page,
      limit: paginationPricingConfig.itemsPerPage,
    },
    options: {
      onSuccess: (data: any) => {
        paginationPricingConfig.setTotalItems(data.totalRow);
      },
      select: (data: any) => {
        const mappedData = data?.rows?.map((element: any) => {
          return {
            key: element.id,
            id: element.id,
            name: element.name,
            priceStructureLevelings: element.priceStructureLevelings,
            action: (
              <div style={{ display: "flex", justifyContent: "left" }}>
                <Button
                  size="small"
                  onClick={() => {
                    replaceLeveling(
                      element.priceStructureLevelings.map((data: any) => ({
                        index: data.id,
                        level: data.level,
                        buying_price: data.buyingPrice,
                      }))
                    );

                    setModalPricingStructureForm({
                      open: true,
                      typeForm: "Price Structure Config",
                      data: element,
                    });
                  }}
                  variant="tertiary"
                >
                  View Detail
                </Button>
              </div>
            ),
          };
        });

        return { data: mappedData, totalRow: data.totalRow };
      },
    },
  });

  const {
    register: registerGroupBuying,
    control: controlGroupBuying,
    handleSubmit: handleSubmitGroupBuying,
    formState: { errors: errorsGroupBuying },
  } = useForm({
    shouldUseNativeValidation: true,
    defaultValues: { name: "", customer_group: null },
  });

  const levelingBodyField = {
    index: 1,
    level: 1,
    buying_price: null,
  };

  const {
    register: registerPricingConfig,
    formState: { errors: errorsPricingConfig },
    handleSubmit: handleSubmitPricingConfig,
    control: controlPricingConfig,
  } = useForm({
    shouldUseNativeValidation: true,
    defaultValues: { name: "", leveling: [levelingBodyField] },
  });

  const {
    fields: fieldsLeveling,
    append: appendLeveling,
    replace: replaceLeveling,
    remove: removeLeveling,
  } = useFieldArray({
    control: controlPricingConfig,
    name: "leveling",
  });

  const [modalPricingStructureForm, setModalPricingStructureForm] = useState({
    open: false,
    data: {},
    typeForm: "",
  });

  const options = [
    {
      label: (
        <Flex>
          Active{" "}
          {pricingStructureLists?.active > 0 && (
            <Notif hidden>{pricingStructureLists?.active}</Notif>
          )}
        </Flex>
      ),
      value: "active",
    },
    {
      label: (
        <Flex>
          Inactive{" "}
          {pricingStructureLists?.inactive > 0 && (
            <Notif hidden>{pricingStructureLists?.inactive}</Notif>
          )}
        </Flex>
      ),
      value: "inactive",
    },
    {
      label: (
        <Flex>
          Waiting for Approval{" "}
          {pricingStructureLists?.waiting > 0 && <Notif>{pricingStructureLists?.waiting}</Notif>}
        </Flex>
      ),
      value: "waiting-approval",
    },
    {
      label: (
        <Flex>
          Rejected{" "}
          {pricingStructureLists?.rejected > 0 && (
            <Notif hidden>{pricingStructureLists?.rejected}</Notif>
          )}
        </Flex>
      ),
      value: "rejected",
    },
    {
      label: (
        <Flex>
          Draft{" "}
          {pricingStructureLists?.drafted > 0 && (
            <Notif hidden>{pricingStructureLists?.drafted}</Notif>
          )}
        </Flex>
      ),
      value: "draft",
    },
  ];

  const [tab, setTab] = useState("active");

  const { mutate: createGroupBuying, isLoading: isLoadingCreateGroupBuying } = useCreateGroupBuying(
    {
      options: {
        onSuccess: () => {
          setModalPricingStructureForm({ open: false, typeForm: "", data: {} });
          queryClient.invalidateQueries(["group-buying"]);
        },
      },
    }
  );

  const { mutate: updateGroupBuying, isLoading: isLoadingUpdateGroupBuying } =
    useUpdateGroupBuyingList({
      groupBuyingListId: modalPricingStructureForm.data?.id,
      options: {
        onSuccess: () => {
          setModalPricingStructureForm({ open: false, typeForm: "", data: {} });
          queryClient.invalidateQueries(["group-buying"]);
        },
      },
    });

  const { mutate: createPricingConfig, isLoading: isLoadingCreatePricingConfig } =
    useCreatePricingConfig({
      options: {
        onSuccess: () => {
          setModalPricingStructureForm({ open: false, typeForm: "", data: {} });
          queryClient.invalidateQueries(["pricing-config"]);
        },
      },
    });

  const { mutate: updatePricingConfig, isLoading: isLoadingUpdatePricingConfig } =
    useUpdatePricingConfigList({
      pricingConfigListId: modalPricingStructureForm.data?.id,
      options: {
        onSuccess: () => {
          setModalPricingStructureForm({ open: false, typeForm: "", data: {} });
          queryClient.invalidateQueries(["pricing-config"]);
        },
      },
    });

  const onSubmitGroupBuying = (data: any) => {
    switch (modalPricingStructureForm.typeForm) {
      case "Create Cust Group Buying Price":
        createGroupBuying({ ...data });
        break;
      case "Customer Group Buying Price":
        updateGroupBuying({
          deleted_ids: customerGroupsMDMData?.rows
            ?.filter((filtering) => !data.customer_group.includes(filtering.id))
            .map((data) => data.id),
          add_customer_group: data.customer_group,
          name: data.name,
        });
        break;
      default:
        setModalPricingStructureForm({ open: false, typeForm: "", data: {} });
        break;
    }
  };

  const onSubmitPricingConfig = (data: any) => {
    switch (modalPricingStructureForm.typeForm) {
      case "Create Price Structure Config":
        createPricingConfig({ ...data });
        break;
      case "Price Structure Config":
        updatePricingConfig({
          name: data.name,
          leveling: data.leveling.map((subLevel) => ({
            id: subLevel.buying_price,
            index: subLevel.index,
            level: subLevel.level,
            buying_price: subLevel.buying_price,
          })),
          add_level: data.leveling,
          remove_level: groupBuyingList
            ?.filter(
              (filtering) =>
                !data.leveling
                  .map((existLeveling) => existLeveling.buying_price)
                  .includes(filtering.value)
            )
            .map((data) => data.id),
        });
        break;
      default:
        setModalPricingStructureForm({ open: false, typeForm: "", data: {} });
        break;
    }
  };

  const columnsGroupBuying = [
    {
      title: "id",
      dataIndex: "id",
    },
    {
      title: "Product Options Name",
      dataIndex: "name",
    },
    {
      title: "Customer Group",
      dataIndex: "groupBuyingPriceToCustomerGroups",
      render: (text: any) => `${text?.length} Customer Group`,
    },
    {
      title: "Action",
      dataIndex: "action",
      width: "15%",
      align: "left",
    },
  ];

  const columnsPricingConfig = [
    {
      title: "id",
      dataIndex: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "priceStructureLevelings",
      dataIndex: "priceStructureLevelings",
    },
    {
      title: "Action",
      dataIndex: "action",
      width: "15%",
      align: "left",
    },
  ];

  const rowSelectionGroupBuying = {
    selectedRowKeys: selectedRowKeysGroupBuying,
    onChange: (selectedRowKeys: any) => {
      setSelectedRowKeysGroupBuying(selectedRowKeys);
    },
  };

  const rowSelectionPricingConfig = {
    selectedRowKeys: selectedRowKeysPricingConfig,
    onChange: (selectedRowKeys: any) => {
      setSelectedRowKeysPricingConfig(selectedRowKeys);
    },
  };

  return (
    <>
      {isLoadingPricingStructureList ? (
        <Center>
          <Spin tip="Loading data..." />
        </Center>
      ) : (
        <Col>
          <Text variant={"h4"}>Pricing Structure</Text>
          <Spacer size={20} />
          <ContentSwitcher
            options={options}
            defaultValue={tab}
            onChange={(value: string) => {
              setTab(value);
              // refetch();
            }}
          />
          <Spacer size={10} />

          {tab === "active" ? (
            <ActivePricingStructure
              modalPricingStructureForm={modalPricingStructureForm}
              setModalPricingStructureForm={setModalPricingStructureForm}
            />
          ) : tab === "inactive" ? (
            <InActivePricingStructure
              modalPricingStructureForm={modalPricingStructureForm}
              setModalPricingStructureForm={setModalPricingStructureForm}
              refetchCount={refetch}
            />
          ) : tab === "draft" ? (
            <DraftPricingStructure
              modalPricingStructureForm={modalPricingStructureForm}
              setModalPricingStructureForm={setModalPricingStructureForm}
              refetchCount={refetch}
            />
          ) : tab === "rejected" ? (
            <RejectedPricingStructure
              modalPricingStructureForm={modalPricingStructureForm}
              setModalPricingStructureForm={setModalPricingStructureForm}
              refetchCount={refetch}
            />
          ) : (
            <WaitingApprovalPricingStructure
              modalPricingStructureForm={modalPricingStructureForm}
              setModalPricingStructureForm={setModalPricingStructureForm}
              refetchCount={refetch}
            />
          )}
        </Col>
      )}

      {modalPricingStructureForm.open && (
        <Modal
          centered
          width={
            modalPricingStructureForm.typeForm === "Manage Customer Group Buying Price" ||
            modalPricingStructureForm.typeForm === "Manage Price Structure Configuration"
              ? "90%"
              : "50%"
          }
          closable={true}
          visible={modalPricingStructureForm.open}
          onCancel={() => setModalPricingStructureForm({ open: false, data: {}, typeForm: "" })}
          title={modalPricingStructureForm.typeForm}
          footer={null}
          content={
            modalPricingStructureForm.typeForm === "Create Cust Group Buying Price" ||
            modalPricingStructureForm.typeForm === "Customer Group Buying Price" ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Input
                  defaultValue={modalPricingStructureForm.data?.name}
                  width="100%"
                  label="Name"
                  height="48px"
                  required
                  error={errorsGroupBuying.name?.message}
                  placeholder={"Type here..."}
                  {...registerGroupBuying("name", {
                    shouldUnregister: true,
                    required: "Please enter name.",
                    maxLength: {
                      value: 100,
                      message: "Max length exceeded",
                    },
                  })}
                />

                <Spacer size={14} />

                {isLoadingCustomerGroupsMDM || isFetchingCustomerGroupsMDM ? (
                  <Spin tip="Loading data..." />
                ) : (
                  <Controller
                    control={controlGroupBuying}
                    name="customer_group"
                    rules={{
                      required: {
                        value: true,
                        message: "Please enter Customer Group.",
                      },
                    }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => {
                      return (
                        <DropdownMenuOptionCustome
                          label="Customer Group"
                          actionLabel="Add New Customer Group"
                          isShowActionLabel
                          handleClickActionLabel={() => window.open("/customers/group")}
                          isAllowClear
                          required
                          error={error?.message}
                          handleChangeValue={(value: string[]) => onChange(value)}
                          valueSelectedItems={
                            value ||
                            modalPricingStructureForm.data?.groupBuyingPriceToCustomerGroups?.map(
                              (data) => data.customerGroupId
                            ) ||
                            []
                          }
                          listItems={customerGroupsMDMData?.rows?.map(
                            ({ name, id }: { name: string; id: string }) => {
                              return { value: id, label: name };
                            }
                          )}
                        />
                      );
                    }}
                  />
                )}

                <Spacer size={14} />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                    marginBottom: "20px",
                  }}
                >
                  <Button
                    size="big"
                    variant={"tertiary"}
                    key="submit"
                    type="primary"
                    onClick={() =>
                      setModalPricingStructureForm({ open: false, data: {}, typeForm: "" })
                    }
                  >
                    Cancel
                  </Button>

                  <Button
                    onClick={handleSubmitGroupBuying(onSubmitGroupBuying)}
                    variant="primary"
                    size="big"
                  >
                    {isLoadingCreateGroupBuying || isLoadingUpdateGroupBuying
                      ? "Loading..."
                      : "Save"}
                  </Button>
                </div>
              </div>
            ) : modalPricingStructureForm.typeForm === "Create Price Structure Config" ||
              modalPricingStructureForm.typeForm === "Price Structure Config" ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Input
                  defaultValue={modalPricingStructureForm.data?.name}
                  width="100%"
                  label="Name"
                  erorr={errorsPricingConfig?.name}
                  height="48px"
                  required
                  placeholder={"Type here..."}
                  {...registerPricingConfig("name", {
                    shouldUnregister: true,
                    required: "Please enter name.",
                    maxLength: {
                      value: 100,
                      message: "Max length exceeded",
                    },
                  })}
                />
                <Spacer size={14} />

                {fieldsLeveling.map((item, index) => {
                  return (
                    <div key={index}>
                      <Row width="100%" gap="16px" alignItems="center" noWrap>
                        <Col justifyContent="space-between" width="10%">
                          <Text color={"blue.dark"} variant={"headingMedium"}>
                            {`Level ${index + 1}`}
                          </Text>
                          <ICDelete onClick={() => removeLeveling(index)} />
                        </Col>

                        <Col width="90%">
                          <Controller
                            control={controlPricingConfig}
                            name={`leveling.${index}.buying_price`}
                            render={({ field: { onChange, value } }) => {
                              return (
                                <>
                                  <Label>Buying Price</Label>
                                  <Spacer size={3} />
                                  <FormSelect
                                    height="48px"
                                    defaultValue={
                                      isFetchingInfiniteGroupBuying ? "loading..." : value
                                    }
                                    style={{ width: "100%" }}
                                    size={"large"}
                                    placeholder={"Select"}
                                    borderColor={"#AAAAAA"}
                                    arrowColor={"#000"}
                                    withSearch
                                    isLoading={isFetchingInfiniteGroupBuying}
                                    isLoadingMore={isFetchingMoreInfiniteGroupBuying}
                                    fetchMore={() => {
                                      if (hasNextPageInfiniteGroupBuying) {
                                        fetchNextPageInfiniteGroupBuying();
                                      }
                                    }}
                                    items={
                                      isFetchingGroupBuying && !isFetchingMoreInfiniteGroupBuying
                                        ? []
                                        : groupBuyingList
                                    }
                                    onChange={(value: any) => {
                                      onChange(value);
                                    }}
                                    onSearch={(value: any) => {
                                      setSearchGroupBuyingList(value);
                                    }}
                                  />
                                </>
                              );
                            }}
                          />
                        </Col>
                      </Row>

                      <Spacer size={14} />
                    </div>
                  );
                })}

                <Spacer size={8} />

                <Text
                  onClick={() =>
                    appendLeveling({
                      index: fieldsLeveling.length + 1,
                      level: fieldsLeveling.length + 1,
                      buying_price: null,
                    })
                  }
                  clickable
                  variant="headingSmall"
                  color="pink.regular"
                >
                  + Add Level
                </Text>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                    marginBottom: "20px",
                  }}
                >
                  <Button
                    size="big"
                    variant={"tertiary"}
                    key="submit"
                    type="primary"
                    onClick={() =>
                      setModalPricingStructureForm({ open: false, data: {}, typeForm: "" })
                    }
                  >
                    Cancel
                  </Button>

                  <Button
                    onClick={handleSubmitPricingConfig(onSubmitPricingConfig)}
                    variant="primary"
                    size="big"
                  >
                    {isLoadingCreatePricingConfig || isLoadingUpdatePricingConfig
                      ? "Loading..."
                      : "Save"}
                  </Button>
                </div>
              </div>
            ) : modalPricingStructureForm.typeForm === "Manage Customer Group Buying Price" ? (
              <>
                <Card>
                  <Row justifyContent="space-between">
                    <Search
                      width="340px"
                      placeholder="Search Name"
                      onChange={(e: any) => {
                        setSearchGroupBuying(e.target.value);
                      }}
                    />
                    <Row gap="16px">
                      <Button
                        size="big"
                        variant={"tertiary"}
                        onClick={() =>
                          setShowDeleteGroupBuying({
                            open: true,
                            type: "selection",
                            data: { dataGroupBuying: dataGroupBuying, selectedRowKeysGroupBuying },
                          })
                        }
                        disabled={rowSelectionGroupBuying.selectedRowKeys?.length === 0}
                      >
                        Delete
                      </Button>
                      <Button
                        size="big"
                        variant="primary"
                        onClick={() =>
                          setModalPricingStructureForm({
                            ...modalPricingStructureForm,
                            open: true,
                            typeForm: "Create Cust Group Buying Price",
                          })
                        }
                      >
                        Create
                      </Button>
                    </Row>
                  </Row>
                </Card>
                <Spacer size={10} />
                <Card style={{ padding: "16px 20px" }}>
                  <Col gap={"60px"}>
                    <Table
                      loading={isLoadingGroupBuying || isFetchingGroupBuying}
                      columns={columnsGroupBuying.filter(
                        (filtering) => filtering.dataIndex !== "id"
                      )}
                      data={dataGroupBuying?.data}
                      rowSelection={rowSelectionGroupBuying}
                    />

                    <Pagination pagination={paginationGroupBuying} />
                  </Col>
                </Card>
              </>
            ) : modalPricingStructureForm.typeForm === "Manage Price Structure Configuration" ? (
              <>
                <Card>
                  <Row justifyContent="space-between">
                    <Search
                      width="340px"
                      placeholder="Search Name"
                      onChange={(e: any) => {
                        setSearchPricingConfig(e.target.value);
                      }}
                    />
                    <Row gap="16px">
                      <Button
                        size="big"
                        variant={"tertiary"}
                        onClick={() =>
                          setShowDeletePricingConfig({
                            open: true,
                            type: "selection",
                            data: {
                              dataPricingConfig: dataPricingConfig,
                              selectedRowKeysPricingConfig,
                            },
                          })
                        }
                        disabled={rowSelectionPricingConfig.selectedRowKeys?.length === 0}
                      >
                        Delete
                      </Button>
                      <Button
                        size="big"
                        variant="primary"
                        onClick={() => {
                          replaceLeveling(levelingBodyField);
                          setModalPricingStructureForm({
                            ...modalPricingStructureForm,
                            open: true,
                            typeForm: "Create Price Structure Config",
                          });
                        }}
                      >
                        Create
                      </Button>
                    </Row>
                  </Row>
                </Card>
                <Spacer size={10} />
                <Card style={{ padding: "16px 20px" }}>
                  <Col gap={"60px"}>
                    <Table
                      loading={isLoadingPricingConfig || isFetchingPricingConfig}
                      columns={columnsPricingConfig.filter(
                        (filtering) =>
                          filtering.dataIndex !== "id" &&
                          filtering.dataIndex !== "priceStructureLevelings"
                      )}
                      data={dataPricingConfig?.data}
                      rowSelection={rowSelectionPricingConfig}
                    />

                    <Pagination pagination={paginationPricingConfig} />
                  </Col>
                </Card>
              </>
            ) : null
          }
        />
      )}

      {isShowDeleteGroupBuying.open && (
        <Modal
          closable={false}
          centered
          visible={isShowDeleteGroupBuying.open}
          onCancel={() => setShowDeleteGroupBuying({ open: false, type: "", data: {} })}
          title={"Confirm Delete"}
          footer={null}
          content={
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Spacer size={4} />
              {renderConfirmationTextGroupBuying(
                isShowDeleteGroupBuying.type,
                isShowDeleteGroupBuying.data
              )}
              <Spacer size={20} />
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                  marginBottom: "20px",
                }}
              >
                <Button
                  size="big"
                  variant="tertiary"
                  key="submit"
                  type="primary"
                  onClick={() => setShowDeleteGroupBuying({ open: false, type: "", data: {} })}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="big"
                  onClick={() => {
                    if (isShowDeleteGroupBuying.type === "selection") {
                      deleteGroupBuying({ ids: selectedRowKeysGroupBuying });
                    } else {
                      deleteGroupBuying({ ids: [modalPricingStructureForm.data.id] });
                    }
                  }}
                >
                  {isLoadingDeleteGroupBuying ? "loading..." : "Yes"}
                </Button>
              </div>
            </div>
          }
        />
      )}

      {isShowDeletePricingConfig.open && (
        <Modal
          closable={false}
          centered
          visible={isShowDeletePricingConfig.open}
          onCancel={() => setShowDeletePricingConfig({ open: false, type: "", data: {} })}
          title={"Confirm Delete"}
          footer={null}
          content={
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Spacer size={4} />
              {renderConfirmationTextPricingConfig(
                isShowDeletePricingConfig.type,
                isShowDeletePricingConfig.data
              )}
              <Spacer size={20} />
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                  marginBottom: "20px",
                }}
              >
                <Button
                  size="big"
                  variant="tertiary"
                  key="submit"
                  type="primary"
                  onClick={() => setShowDeletePricingConfig({ open: false, type: "", data: {} })}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="big"
                  onClick={() => {
                    if (isShowDeletePricingConfig.type === "selection") {
                      deletePricingConfig({ ids: selectedRowKeysPricingConfig });
                    } else {
                      deletePricingConfig({ ids: [modalPricingStructureForm.data.id] });
                    }
                  }}
                >
                  {isLoadingDeletePricingConfig ? "loading..." : "Yes"}
                </Button>
              </div>
            </div>
          }
        />
      )}
    </>
  );
};

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Notif = styled.div`
  background: #ffffff;
  border: 1px solid #eb008b;
  box-sizing: border-box;
  border-radius: 24px;
  display: ${(p: any) => (p.hidden ? "none" : "flex")};
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  font-weight: 600;
  font-size: 10px;
  line-height: 14px;
  color: #eb008b;
`;

const Label = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  color: #000000;
`;

const Flex = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 7.5px;
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
`;

export default PricingStructureList;
