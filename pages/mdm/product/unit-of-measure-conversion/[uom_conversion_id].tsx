import React, { useState } from "react";
import {
  Text,
  Col,
  Row,
  Spacer,
  Button,
  Input,
  Table,
  Pagination,
  Modal,
  FormSelect,
  Switch,
  Spin,
} from "pink-lava-ui";
import styled from "styled-components";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import usePagination from "@lucasmogari/react-pagination";
import { useDeletUOMConversion, useUOMConversion, useUpdateUOMConversion } from "hooks/mdm/unit-of-measure-conversion/useUOMConversion";
import { useUOMInfiniteLists } from "hooks/mdm/unit-of-measure/useUOM";
import { useUserPermissions } from "hooks/user-config/usePermission";
import { queryClient } from "../../../_app";
import useDebounce from "../../../../lib/useDebounce";
import { ModalDeleteConfirmation } from "../../../../components/elements/Modal/ModalConfirmationDelete";
import ArrowLeft from "../../../../assets/icons/arrow-left.svg";

const renderConfirmationText = (type: any, data: any) => {
  switch (type) {
    case "selection":
      return data.selectedRowKeys.length > 1
        ? `Are you sure to delete ${data.selectedRowKeys.length} items ?`
        : `Are you sure to delete Uom Conversion with ID's ${
          data?.uomData?.find((el: any) => el.key === data.selectedRowKeys[0]).key
        } ?`;
    case "detail":
      return `Are you sure to delete Uom Name ${data.uomName} ?`;

    default:
      break;
  }
};

const UOMConversionDetail = () => {
  const router = useRouter();
  const companyId = localStorage.getItem("companyId");
  const companyCode = localStorage.getItem("companyCode");
  const pagination = usePagination({
    page: 1,
    itemsPerPage: 20,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
  });
  const { uom_conversion_id } = router.query;
  const [listUomCategory, setListUomCategory] = useState<any[]>([]);
  const [listUomCategoryModal, setListUomCategoryModal] = useState<any[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [search, setSearch] = useState("");
  const [searchModal, setSearchModal] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isShowDelete, setShowDelete] = useState({ open: false, type: "selection", data: {} });
  const [showCreateModal, setShowCreateModal] = useState(false);

  const debounceFetch = useDebounce(search, 1000);
  const debounceFetchModal = useDebounce(searchModal, 1000);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const {
    register, control, handleSubmit, setValue,
  } = useForm();

  const { data: dataUserPermission } = useUserPermissions({
    options: {
      onSuccess: () => {},
    },
  });

  const listPermission = dataUserPermission?.permission?.filter(
    (filtering: any) => filtering.menu === "UoM Conversion",
  );

  const {
    isFetching: isFetchingUomCategory,
    isFetchingNextPage: isFetchingMoreUomCategory,
    isLoading: isLoadingUOMCategory,
    hasNextPage,
    fetchNextPage,
  } = useUOMInfiniteLists({
    query: {
      search: debounceFetch,
      company_id: companyCode,
      limit: 10,
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRows(data.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => group.rows?.map((element: any) => ({
          value: element.uomId,
          label: element.name,
        })));
        const flattenArray = [].concat(...mappedData);
        setListUomCategory(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (listUomCategory.length < totalRows) {
          return pages.length + 1;
        }
        return undefined;
      },
    },
  });

  const {
    isFetching: isFetchingUomCategoryModal,
    isFetchingNextPage: isFetchingMoreUomCategoryModal,
    isLoading: isLoadingUOMCategoryModal,
    hasNextPage: hasNextPageModal,
    fetchNextPage: fetchNextPageModal,
  } = useUOMInfiniteLists({
    query: {
      search: debounceFetchModal,
      company_id: companyCode,
      limit: 10,
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRows(data.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => group.rows?.map((element: any) => ({
          value: element.uomId,
          label: element.name,
        })));
        const flattenArray = [].concat(...mappedData);
        setListUomCategoryModal(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (listUomCategoryModal.length < totalRows) {
          return pages.length + 1;
        }
        return undefined;
      },
    },
  });

  const {
    data: UomData,
    isLoading: isLoadingUom,
    isFetching: isFetchingUom,
  } = useUOMConversion({
    id: uom_conversion_id,
    companyId: companyCode,
    query: {
      page: pagination.page,
      limit: pagination.itemsPerPage,
    },
    options: {
      onSuccess: (data: any) => {
        pagination.setTotalItems(data.totalRow);
      },
      select: (data: any) => {
        const mappedData: { id: any; key: any; uom: any; conversionNumber: any; baseUom: any; qty: any; active: boolean; }[] = [];
        const dataForUpdate: {
          // base_uom_id: any;
          id: number;
          uom_id: any; conversion_number: any; qty: any; active_status: any; }[] = [];

        const parent = {
          name: data?.uomConversionItem?.parent?.name,
          baseUom: data?.uomConversionItem?.parent?.baseUomName,
          baseUomId: data?.uomConversionItem?.parent?.baseUomId,
        };

        data?.uomConversionItem?.rows?.forEach((uomConversion: any, i: number) => {
          mappedData.push({
            id: uomConversion.id,
            key: uomConversion.id,
            baseUom: uomConversion?.uomConversion?.name,
            conversionNumber: uomConversion.conversionNumber,
            uom: uomConversion?.uom?.name,
            qty: uomConversion.qty,
            active: uomConversion.activeStatus,
          });
          dataForUpdate.push({
            id: uomConversion.id,
            qty: uomConversion.qty,
            uom_id: uomConversion.uomId,
            conversion_number: uomConversion.conversionNumber,
            active_status: uomConversion.activeStatus,
          });
        });

        setValue("baseUom", parent?.baseUomId);
        return {
          parent, dataForUpdate, data: mappedData, totalRow: data?.uomConversion?.totalRow, name: data?.name, baseUomId: data?.baseUomId, baseUomName: data?.baseUom?.name,
        };
      },
    },
  });

  const { mutate: updateUom, isLoading: isLoadingUpdateUom } = useUpdateUOMConversion({
    companyId: companyCode,
    id: uom_conversion_id,
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries(["uom-conversion"]);
        // router.back()
      },
    },
  });

  const { mutate: deleteUOM, isLoading: isLoadingDeleteUOM } = useDeletUOMConversion({
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries(["uom-list"]);
        setShowDeleteModal(false);
      },
    },
  });

  const updateDeleteUom = (id: any) => {
    const newData = {
      name: UomData?.name,
      base_uom_id: UomData?.baseUomId,
      items: UomData?.dataForUpdate,
      remove_items: [],
    };

    id?.forEach((uomId:number) => {
      newData.remove_items.push({ id: uomId });
    });
    updateUom(newData);
    setSelectedRowKeys([]);
    setShowDelete({ open: false, type: "", data: {} });
  };

  const updateCreateUom = (data: any) => {
    const newData = {
      name: data?.name,
      base_uom_id: data?.baseUom,
      items: UomData?.dataForUpdate,
    };
    newData.items.push({
      id: 0,
      qty: 1,
      uom_id: data?.uom,
      conversion_number: data?.conversionNumber,
      active_status: true,
    });
    setShowCreateModal(false);
    updateUom(newData);
  };

  const updateStatusUom = (rowKey: any) => {
    const newData: any = {
      name: UomData?.name,
      base_uom_id: UomData?.baseUomId,
      items: UomData?.dataForUpdate,
    };
    const updatedStatus: any[] = [];
    newData?.items.forEach((uomConversion: any) => {
      if (uomConversion.id === rowKey.id) {
        if (rowKey.active === true) {
          uomConversion.activeStatus = false;
          rowKey.active = false;
        } else {
          uomConversion.activeStatus = true;
          rowKey.active = true;
        }
      }
      updatedStatus.push(uomConversion);
    });

    newData.items = updatedStatus;
    updateUom(newData);
  };

  const onSave = (data: any) => {
    const newData: any = {
      name: data?.name,
      base_uom_id: data?.baseUom,
      items: UomData?.dataForUpdate,
    };
    updateUom(newData);
  };

  const columns = [
    {
      title: "Qty",
      dataIndex: "qty",
      key: 'qty',
    },
    {
      title: "UoM",
      dataIndex: "uom",
      key: 'uom',
    },
    {
      title: "Conversion Number",
      dataIndex: "conversionNumber",
      key: 'conversionNumber',
    },
    {
      title: "Base UoM",
      dataIndex: "baseUom",
      key: 'baseUom',
    },
    {
      title: "Active",
      dataIndex: 'active',
      render: (active: boolean, rowKey: any) => (
        <Switch checked={active} onChange={() => updateStatusUom(rowKey)} />
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  if (isLoadingUom || isFetchingUom || isLoadingUOMCategory || isLoadingUOMCategoryModal) {
    return (
      <Center>
        <Spin tip="Loading data..." />
      </Center>
    );
  }

  return (
    <>
      <Col>
        <Row gap="4px">
          <ArrowLeft style={{ cursor: "pointer" }} onClick={() => router.back()} />
          <Text variant="h4">{UomData?.parent?.name}</Text>
        </Row>

        <Spacer size={20} />

        <Card>
          <Row justifyContent="space-between" alignItems="center" nowrap>
            <Row gap="16px" />

            <Row gap="16px">
              {listPermission?.filter((data: any) => data.viewTypes[0]?.viewType.name === "Delete")
                .length > 0 && (
                <Button size="big" variant="tertiary" onClick={() => setShowDeleteModal(true)}>
                  Delete
                </Button>
              )}

              {listPermission?.filter((data: any) => data.viewTypes[0]?.viewType.name === "Update")
                .length > 0 && (
                <Button
                  size="big"
                  variant="primary"
                  onClick={(e) => {
                    handleSubmit(onSave)(e);
                    router.back();
                  }}
                >
                  {isLoadingUpdateUom ? "Loading..." : "Save"}
                </Button>
              )}

            </Row>
          </Row>
        </Card>

        <Spacer size={20} />

        <Card>
          <Spacer size={10} />

          <Row width="100%" noWrap>
            <Col width="100%">
              <Input
                width="100%"
                label="Uom Conversion Name"
                height="40px"
                required
                defaultValue={UomData?.parent?.name}
                placeholder="e.g gram"
                {...register("name", { required: "Please enter name." })}
              />
            </Col>

            <Spacer size={10} />

            <Col width="100%">
              <Controller
                control={control}
                name="baseUom"
                defaultValue={UomData?.parent?.baseUom}
                render={({ field: { onChange } }) => (
                  <>
                    <div style={{
                      display: 'flex',
                    }}
                    >
                      <Label>Base UoM</Label>
                      <Span>&#42;</Span>
                    </div>
                    <Spacer size={3} />
                    <CustomFormSelect
                      defaultValue={UomData?.parent?.baseUom}
                      style={{ width: "100%" }}
                      size="large"
                      required
                      placeholder="PCS"
                      borderColor="#AAAAAA"
                      arrowColor="#000"
                      withSearch
                      isLoading={isFetchingUomCategory}
                      isLoadingMore={isFetchingMoreUomCategory}
                      fetchMore={() => {
                        if (hasNextPage) {
                          fetchNextPage();
                        }
                      }}
                      items={
                        isFetchingUomCategory && !isFetchingMoreUomCategory
                          ? []
                          : listUomCategory
                      }
                      onChange={(value: any) => {
                        onChange(value);
                      }}
                      onSearch={(value: any) => {
                        setSearch(value);
                      }}
                    />
                  </>
                )}
              />
            </Col>
          </Row>

          <Spacer size={20} />

          <Col>
            <HeaderLabel>Conversion</HeaderLabel>
            <Spacer size={20} />
            <Row gap="16px">
              <Button size="big" variant="primary" onClick={() => setShowCreateModal(true)}>
                + Add New
              </Button>
              <Button
                size="big"
                variant="tertiary"
                onClick={() => setShowDelete({
                  open: true,
                  type: "selection",
                  data: { uomData: UomData?.data, selectedRowKeys },
                })}
                disabled={selectedRowKeys?.length === 0}
              >
                Delete
              </Button>
            </Row>
            <Spacer size={20} />
            <Col gap="60px">
              <Table
                loading={isLoadingUOMCategory || isFetchingUom}
                columns={columns}
                data={UomData?.data}
                rowSelection={rowSelection}
                rowKey="id"
              />
              <Pagination pagination={pagination} />
            </Col>
          </Col>
        </Card>
      </Col>

      {showCreateModal && (
        <Modal
          centered
          width="400px"
          visible={showCreateModal}
          onCancel={() => setShowCreateModal(false)}
          footer={null}
          content={(
            <TopButtonHolder>
              <CreateTitle>
                Add New Conversion
              </CreateTitle>
              <Spacer size={20} />
              <Col width="100%">
                <Controller
                  control={control}
                  name="uom"
                  render={({ field: { onChange } }) => (
                    <>
                      <Label>UoM</Label>
                      <Spacer size={3} />
                      <CreateSelectDiv>
                        <InputAddonAfter>Per</InputAddonAfter>
                        <CustomFormSelect
                          style={{ width: "82%", marginLeft: '18%', paddingLeft: '2px' }}
                          size="large"
                          placeholder="PCS"
                          required
                          borderColor="#AAAAAA"
                          arrowColor="#000"
                          withSearch
                          isLoading={isFetchingUomCategoryModal}
                          isLoadingMore={isFetchingMoreUomCategoryModal}
                          fetchMore={() => {
                            if (hasNextPageModal) {
                              fetchNextPageModal();
                            }
                          }}
                          items={
                          isFetchingUomCategoryModal && !isFetchingMoreUomCategoryModal
                            ? []
                            : listUomCategoryModal
                        }
                          onChange={(value: any) => {
                            onChange(value);
                          }}
                          onSearch={(value: any) => {
                            setSearchModal(value);
                          }}
                        />
                      </CreateSelectDiv>
                    </>
                  )}
                />
              </Col>
              <Spacer size={15} />

              <Col width="100%">
                <CreateInputDiv>
                  <Input
                    width="80%"
                    label="Conversion Number"
                    height="40px"
                    required
                    placeholder="e.g 12"
                    addonAfter="PCS"
                    {...register("conversionNumber", { required: "Please enter Conversion Number." })}
                  />
                  <InputAddonBefore>{UomData?.baseUomName?.length > 4 ? UomData?.baseUomName?.slice(0, 4) : UomData?.baseUomName}</InputAddonBefore>
                </CreateInputDiv>
              </Col>

              <Spacer size={100} />
              <DeleteCardButtonHolder>
                <Button
                  variant="tertiary"
                  key="submit"
                  type="primary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSubmit(updateCreateUom, false)}
                >
                  save
                </Button>
              </DeleteCardButtonHolder>
            </TopButtonHolder>
        )}
        />
      )}

      {showDeleteModal && (
        <ModalDeleteConfirmation
          totalSelected={1}
          itemTitle={UomData?.name}
          visible={showDeleteModal}
          isLoading={isLoadingDeleteUOM}
          onCancel={() => setShowDeleteModal(false)}
          onOk={() => deleteUOM({ ids: [uom_conversion_id], company_id: companyCode })}
        />
      )}

      {isShowDelete.open && (
        <Modal
          closable={false}
          centered
          visible={isShowDelete.open}
          onCancel={() => setShowDelete({ open: false, type: "", data: {} })}
          title="Confirm Delete"
          footer={null}
          content={(
            <TopButtonHolder>
              <Spacer size={4} />
              {renderConfirmationText(isShowDelete.type, isShowDelete.data)}
              <Spacer size={20} />
              <DeleteCardButtonHolder>
                <Button
                  size="big"
                  variant="tertiary"
                  key="submit"
                  type="primary"
                  onClick={() => setShowDelete({ open: false, type: "", data: {} })}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="big"
                  onClick={() => {
                    updateDeleteUom(selectedRowKeys);
                  }}
                >
                  {isLoadingDeleteUOM ? "loading..." : "Yes"}
                </Button>
              </DeleteCardButtonHolder>
            </TopButtonHolder>
          )}
        />
      )}
    </>
  );
};

const CustomFormSelect = styled(FormSelect)`
  
  .ant-select-selection-placeholder {
    line-height: 48px !important;
  }

  .ant-select-selection-search-input {
    height: 48px !important;
  }

  .ant-select-selector {
    height: 48px !important;
  }

  .ant-select-selection-item {
    display: flex;
    align-items: center;
  }
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: ${(p: any) => (p.padding ? p.padding : "16px")};
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Label = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  color: #000000;
`;

const HeaderLabel = styled.p`
  font-weight: 600;
  font-size: 20px;
  line-height: 27px;
  color: #1E858E;
`;
const Span = styled.span`
  color: #ed1c24;
  margin-left: 5px;
  font-weight: bold;
`;

const DeleteCardButtonHolder = styled.div`
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 20px;
`;

const TopButtonHolder = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const CreateInputDiv = styled.div`
  display: flex;
  position: relative;
`;

const CreateSelectDiv = styled.div`
  display: flex;
  position: relative;
  justify-content: space-between;
`;

const CreateTitle = styled.div`
  margin-top: 1rem;
  font-weight: 600;
  font-size: 1.5rem;
`;
const InputAddonAfter = styled.div`
  z-index: 10;
  background: #f4f4f4;
  position: absolute;
  height: 40px;
  width: 20%;
  border-radius: 5px 0 0 5px;
  margin: 0 auto;
  text-align: center;
  padding-top: .5rem;
  border: 1px solid #aaaaaa;
`;

const InputAddonBefore = styled.div`
  z-index: 10;
  right: 0;
  bottom: 4;
  background: #f4f4f4;
  position: absolute;
  height: 40px;
  width: 20%;
  border-radius: 0 5px 5px 0;
  margin: 0 auto;
  margin-top: 1.75rem;
  text-align: center;
  padding-top: .5rem;
  border: 1px solid #aaaaaa;
`;

export default UOMConversionDetail;