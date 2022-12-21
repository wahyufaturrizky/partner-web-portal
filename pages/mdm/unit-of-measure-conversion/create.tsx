import React, { useEffect, useState } from "react";
import {
  Text,
  Col,
  Row,
  Spacer,
  Dropdown,
  Button,
  Accordion,
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
import { queryClient } from "../../_app";
import useDebounce from "../../../lib/useDebounce";
import { useUOMCategoryInfiniteLists } from "../../../hooks/mdm/unit-of-measure-category/useUOMCategory";
import { ModalDeleteConfirmation } from "../../../components/elements/Modal/ModalConfirmationDelete";
import ArrowLeft from "../../assets/icons/arrow-left.svg";
import usePagination from "@lucasmogari/react-pagination";

import { useCreateUOMConversion } from "hooks/mdm/unit-of-measure-conversion/useUOMConversion";
import { useUOMInfiniteLists } from "hooks/mdm/unit-of-measure/useUOM";

const renderConfirmationText = (type: any, data: any) => {
switch (type) {
  case "selection":
    return data.selectedRowKeys.length > 1
      ? `Are you sure to delete ${data.selectedRowKeys.length} items ?`
      : `Are you sure to delete Uom Conversion with ID's ${
          data?.uomData?.find((el: any) => el.id === data.selectedRowKeys[0]).id
        } ?`;
  case "detail":
    return `Are you sure to delete Uom Name ${data.uomName} ?`;

  default:
    break;
}
};

const UOMConversionCreate = () => {
  const router = useRouter();
  const companyId = localStorage.getItem("companyId")
  const companyCode = localStorage.getItem("companyCode")
  const pagination = usePagination({
    page: 1,
    itemsPerPage: 20,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
  });
  const [listUomCategory, setListUomCategory] = useState<any[]>([]);
  const [listUomCategoryModal, setListUomCategoryModal] = useState<any[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [search, setSearch] = useState("");
  const [searchModal, setSearchModal] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isShowDelete, setShowDelete] = useState({ open: false, type: "selection", data: {} });
  const [showCreateModal, setShowCreateModal] = useState(false)

  const debounceFetch = useDebounce(search, 1000);
  const debounceFetchModal = useDebounce(searchModal, 1000);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [newUom, setNewUom] = useState({
    company_id: companyCode,
    name: "",
    base_uom_id: "",
  })
  const [newUomTable, setNewUomTable] = useState<any[] | null>(null)
  const { register, control, handleSubmit } = useForm();


  const {
    isFetching: isFetchingUomCategory,
    isFetchingNextPage: isFetchingMoreUomCategory,
    isLoading: isLoadingUOM,
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
        const mappedData = data?.pages?.map((group: any) => {
          return group.rows?.map((element: any) => {
            return {
              value: element.uomId,
              label: element.name,
            };
          });
        });
        const flattenArray = [].concat(...mappedData);
        setListUomCategory(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (listUomCategory.length < totalRows) {
          return pages.length + 1;
        } else {
          return undefined;
        }
      },
    },
  });

  const {
    isFetching: isFetchingUomCategoryModal,
    isFetchingNextPage: isFetchingMoreUomCategoryModal,
    isLoading: isLoadingUOMModal,
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
        const mappedData = data?.pages?.map((group: any) => {
          return group.rows?.map((element: any) => {
            return {
              value: element.uomId,
              label: element.name,
            };
          });
        });
        const flattenArray = [].concat(...mappedData);
        setListUomCategoryModal(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (listUomCategory.length < totalRows) {
          return pages.length + 1;
        } else {
          return undefined;
        }
      },
    },
  });

  const { mutate: createUom, isLoading: isLoadingCreateUom } = useCreateUOMConversion({
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries(["uom-list"]);
        setShowDeleteModal(false);
        router.back();
      },
    },
  });

  const updateDeleteUom = (id: any) => {
    let tempDataTable = [...newUomTable]
    id.forEach((uomId: number) => {
      tempDataTable = tempDataTable.filter(el => el.id !== uomId)
    })
    tempDataTable = tempDataTable.map((el, i) => {
      return {
        ...el,
        id : i + 1
      }
    })
    setSelectedRowKeys([])
    setNewUomTable(tempDataTable)
    setShowDelete({ open: false, type: "selection", data: {} })
  
  }

  const updateCreateUom = (data: any) => {
    if(!newUomTable){
      setNewUomTable([{
        id: 1,
        qty: 1,
        uom: listUomCategory?.find(e => e.value === data.uom)?.label ? listUomCategory?.find(e => e.value === data.uom)?.label : listUomCategoryModal?.find(e => e.value === data.uom)?.label,
        conversionNumber: data.conversionNumber,
        baseUom: listUomCategory?.find(e => e.value === data.baseUom)?.label ? listUomCategory?.find(e => e.value === data.baseUom)?.label : listUomCategoryModal?.find(e => e.value === data.baseUom)?.label
      }])
    } else {
      setNewUomTable(prev => [...prev, {
        id: newUomTable.length+1,
        qty: 1,
        uom: listUomCategory?.find(e => e.value === data.uom)?.label ? listUomCategory?.find(e => e.value === data.uom)?.label : listUomCategoryModal?.find(e => e.value === data.uom)?.label,
        conversionNumber: data.conversionNumber,
        baseUom: listUomCategory?.find(e => e.value === data.baseUom)?.label ? listUomCategory?.find(e => e.value === data.baseUom)?.label : listUomCategoryModal?.find(e => e.value === data.baseUom)?.label
      }])
    }
    setNewUom({
      company_id: companyCode,
      name: data.name,
      base_uom_id: listUomCategory?.find(e => e.value === data.uom)?.label ? listUomCategory?.find(e => e.value === data.uom)?.label : listUomCategoryModal?.find(e => e.value === data.uom)?.label,
    })
    setShowCreateModal(false)
  };

  const updateStatusUom = (rowKey: any) => {}

  const onSave = (data: any) => {
    const savedTable: { qty: any; uom_id: any; conversion_number: any; }[] = [] 
    if(newUomTable){
      const tempTable = [...newUomTable]
      tempTable.forEach(uom => {
        savedTable?.push({
          qty: uom.qty,
          uom_id: listUomCategory.find(e => e.label === uom.uom).value ? listUomCategory.find(e => e.label === uom.uom).value : listUomCategoryModal.find(e => e.label === uom.uom).value,
          conversion_number: uom.conversionNumber
        })
      })
    }
    const saveData = {
    company_id: companyCode,
    name: data.name,
    base_uom_id: data.baseUom,
    items: savedTable
    }
    createUom(saveData)
  }

  const columns = [
    {
      title: "Qty",
      dataIndex: "qty",
      key: 'qty',
    },
    {
      title: "UoM",
      dataIndex: "uom",
      key: 'uom'
    },
    {
      title: "Conversion Number",
      dataIndex: "conversionNumber",
      key: 'conversionNumber'
    },
    {
      title: "Base UoM",
      dataIndex: "baseUom",
      key: 'baseUom',
    },
    {
      title: "Active",
      dataIndex: 'status',
      render: (status: string, rowKey: any) => (
        <>
          <Switch checked={status} onChange={() => updateStatusUom(rowKey)}/>
        </>
      ),
    },
  ];
  
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  // if (isFetchingUomCategory)
  // return (
  //   <Center>
  //     <Spin tip="Loading data..." />
  //   </Center>
  // );

  return (
    <>
      <Col>
        <Row gap="4px">
          <Text variant={"h4"}>Create UoM Conversion</Text>
        </Row>

        <Spacer size={20} />

        <Card>
          <Row justifyContent="space-between" alignItems="center" nowrap>
            <Row gap="16px"></Row>

            <Row gap="16px">
              <Button size="big" variant={"tertiary"} onClick={() => router.back()}>
                Cancel
              </Button>
              <Button size="big" variant={"primary"} onClick={handleSubmit(onSave)}>
                {isLoadingCreateUom? "Loading..." : "Save"}
              </Button>
            </Row>
          </Row>
        </Card>

        <Spacer size={20} />

        <Card>
          <Spacer size={10} />

          <Row width="100%" noWrap>
            <Col width={"100%"}>
                <Input
                  width="100%"
                  label="Uom Conversion Name"
                  defaultValue={newUom.name}
                  height="40px"
                  required
                  placeholder={"e.g Product Conversion"}
                  {...register("name", { required: "Please enter name." })}
                />
            </Col>

            <Spacer size={10} />

            <Col width="100%">
              <Controller
                control={control}
                name="baseUom"
                render={({ field: { onChange } }) => (
                  <>
                    <div style={{
                      display: 'flex'
                    }}>
                      <Label>Base UoM</Label>
                      <Span>&#42;</Span>
                    </div>
                    <Spacer size={3} />
                    <FormSelect
                      style={{ width: "100%" }}
                      // defaultValue={newUom.base_uom_id}
                      size={"large"}
                      required
                      placeholder={"Select"}
                      borderColor={"#AAAAAA"}
                      arrowColor={"#000"}
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
                        setSearch("")
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
                <Button size="big" variant={"primary"} onClick={() => setShowCreateModal(true)}>
                  + Add New
                </Button>
                <Button
                  size="big"
                  variant={"tertiary"}
                  onClick={() =>
                    setShowDelete({
                      open: true,
                      type: "selection",
                      // data: { uomData: UomData?.data, selectedRowKeys },
                      data: { uomData: newUomTable, selectedRowKeys },
                    })
                  }
                  disabled={rowSelection.selectedRowKeys?.length === 0}
                >
                  Delete
                </Button>
              </Row>
              <Spacer size={20} />
                <Col gap={"60px"}>
                  <Table
                    // loading={isLoadingUOM || isFetchingUom}
                    columns={columns}
                    data={newUomTable}
                    rowSelection={rowSelection}
                    rowKey={"id"}
                  />
                  <Pagination pagination={pagination} />
                </Col>
          </Col>
        </Card>
      </Col>

      {showCreateModal && (
        <Modal
        centered
        width={'400px'}
        visible={showCreateModal}
        onCancel={() => setShowCreateModal(false)}
        footer={null}
        content={
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
                    <div style={{
                      display: 'flex'
                    }}>
                      <Label>UoM</Label>
                      <Span>&#42;</Span>
                    </div>
                    <Spacer size={3} />
                    <CreateSelectDiv>
                      <InputAddonAfter>Per</InputAddonAfter>
                      <FormSelect
                        style={{ width: "82%", marginLeft: '18%', paddingLeft: '2px' }}
                        size={"large"}
                        placeholder={"PCS"}
                        required
                        borderColor={"#AAAAAA"}
                        arrowColor={"#000"}
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
                          setSearchModal("")
                        }}
                        onSearch={(value: any) => {
                          setSearchModal(value);
                        }}
                        />
                    </CreateSelectDiv>
                  </>
                )}
                // {...register("Uom", { required: "Please enter Uom." })}
              />
            </Col>
              <Spacer size={15} />

              <Col width={"100%"}>
                <CreateInputDiv>
                    <Input
                      width="80%"
                      label="Conversion Number"
                      height="40px"
                      required
                      placeholder={"e.g 12"}
                      addonAfter="PCS"
                      {...register("conversionNumber", { required: "Please enter Conversion Number." })}
                    />
                  <InputAddonBefore>{"PCS"}</InputAddonBefore>
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
                onClick={handleSubmit(updateCreateUom)}
              >
                save
              </Button>
            </DeleteCardButtonHolder>
          </TopButtonHolder>
        }
      />
      )}

      {showDeleteModal && (
        <ModalDeleteConfirmation
          totalSelected={1}
          itemTitle={"electrical conversion"}
          visible={showDeleteModal}
          // isLoading={isLoadingDeleteUOM}
          onCancel={() => setShowDeleteModal(false)}
          // onOk={() => deleteUOM({ ids: [uom_conversion_id], company_id: "KSNI" })}
        />
      )}

      {isShowDelete.open && (
        <Modal
          closable={false}
          centered
          visible={isShowDelete.open}
          onCancel={() => setShowDelete({ open: false, type: "", data: {} })}
          title={"Confirm Delete"}
          footer={null}
          content={
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
                      updateDeleteUom(selectedRowKeys)
                  }}
                >
                  {"Yes"}
                </Button>
              </DeleteCardButtonHolder>
            </TopButtonHolder>
          }
        />
      )}
    </>
  );
};

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
`
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
`

const TopButtonHolder = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const CreateInputDiv = styled.div`
  display: flex;
  position: relative;
`

const CreateSelectDiv = styled.div`
  display: flex;
  position: relative;
  justify-content: space-between;
`

const CreateTitle = styled.div`
  margin-top: 1rem;
  font-weight: 600;
  font-size: 1.5rem;
`
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
`

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
`

export default UOMConversionCreate;
