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
import { useUOMDetail, useUpdateUOM, useDeletUOM } from "../../hooks/mdm/unit-of-measure/useUOM";
import { queryClient } from "../_app";
import useDebounce from "../../lib/useDebounce";
import { useUOMCategoryInfiniteLists } from "../../hooks/mdm/unit-of-measure-category/useUOMCategory";
import { ModalDeleteConfirmation } from "../../components/elements/Modal/ModalConfirmationDelete";
import ArrowLeft from "../../assets/icons/arrow-left.svg";
import usePagination from "@lucasmogari/react-pagination";
import styles from './index.module.css'

const renderConfirmationText = (type: any, data: any) => {
switch (type) {
  case "selection":
    return data.selectedRowKeys.length > 1
      ? `Are you sure to delete ${data.selectedRowKeys.length} items ?`
      : `Are you sure to delete Uom with ID's ${
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
  const pagination = usePagination({
    page: 1,
    itemsPerPage: 10,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
  });
  const { uom_conversion_id } = router.query;
  const [listUomCategory, setListUomCategory] = useState<any[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [search, setSearch] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isShowDelete, setShowDelete] = useState({ open: false, type: "selection", data: {} });
  const [showCreateModal, setShowCreateModal] = useState(false)

  const debounceFetch = useDebounce(search, 1000);
  const [dataUoM, setDataUoM] = useState<any | null>(null)
  const [UOMDataFake, setUOMDataFake] = useState<any | null>(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);


  const { register, control, handleSubmit } = useForm();

  useEffect(() => {
    let data = [
      {
        id: 'MPC-0000005',
        name: 'Conversion Product',
        action: (
          <div style={{ display: "flex", justifyContent: "left" }}>
            <Button
              size="small"
              onClick={() => {
                router.push(`/unit-of-measure-conversion/${'MPC-0000005'}`);
              }}
              variant="tertiary"
            >
              View Detail
            </Button>
          </div>
        ),
        children: [
          {
          key: 'UMC-0000001-1',
          Qty: 1,
          UoM: 'PACK',
          conversionNumber: 12,
          baseUoM: 'PCS',
          status: "ACTIVE"
          },
          {
          key: 'UMC-0000001-2',
          Qty: 1,
          UoM: 'CTN',
          conversionNumber: 24,
          baseUoM: 'PCS',
          status: "INACTIVE"
          },
        ]
      },
      {
        // key: 'UMC-0000002',
        id: 'MPC-0000006',
        name: 'Conversion Transport',
        action: (
          <div style={{ display: "flex", justifyContent: "left" }}>
            <Button
              size="small"
              onClick={() => {
                router.push(`/unit-of-measure-conversion/${'MPC-0000006'}`);
              }}
              variant="tertiary"
            >
              View Detail
            </Button>
          </div>
        ),
        children: [
          {
          key: 'UMC-0000002-1',
          Qty: 1,
          UoM: 'PACK',
          conversionNumber: 22,
          baseUoM: 'PCS',
          status: "ACTIVE"
          },
          {
          key: 'UMC-0000002-2',
          Qty: 1,
          UoM: 'CTN',
          conversionNumber: 21,
          baseUoM: 'PCS',
          status: "INACTIVE"
          },
        ]
      }
    ]
    const filteredData = data.filter(el => el.id === uom_conversion_id)
    setDataUoM(filteredData[0].children)
    setUOMDataFake(filteredData[0])
  }, [])
  
  const {
    isFetching: isFetchingUomCategory,
    isFetchingNextPage: isFetchingMoreUomCategory,
    isLoading: isLoadingUOM,
    hasNextPage,
    fetchNextPage,
  } = useUOMCategoryInfiniteLists({
    query: {
      search: debounceFetch,
      company_id: "KSNI",
      limit: 10,
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRows(data.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => {
          return group.rows?.map((element: any) => {
            return {
              value: element.uomCategoryId,
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
    data: UomData,
    isLoading: isLoadingUom,
    isFetching: isFetchingUom,
  } = useUOMDetail({
    id: uom_conversion_id,
    companyId: "KSNI",
    options: {
      onSuccess: (data: any) => {},
    },
  });

  const { mutate: updateUom, isLoading: isLoadingUpdateUom } = useUpdateUOM({
    companyId: "KSNI",
    id: uom_conversion_id,
    options: {
      onSuccess: () => {
        router.back();
        queryClient.invalidateQueries(["uom-list"]);
      },
    },
  });

  const { mutate: deleteUOM, isLoading: isLoadingDeleteUOM } = useDeletUOM({
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries(["uom-list"]);
        setShowDeleteModal(false);
        router.back();
      },
    },
  });

  const deletedProduct = (id: any) => {
    console.log(id, '<<delete prod')
  }

  const createProduct = () => {
    const newDataUOM = [...dataUoM]

  }
  const onSubmit = (data: any) => {
    updateUom(data);
  };

  if (isLoadingUom || isFetchingUomCategory)
    return (
      <Center>
        <Spin tip="Loading data..." />
      </Center>
    );

  const checkTableChildren = (rowKey: any) => {
    const newTableData = dataUoM?.map(el => {
      if(el.key === rowKey.key){
        el.status === 'ACTIVE' ? el.status = 'INACTIVE' : el.status = 'ACTIVE'
      }
      return el
    })
    setDataUoM(newTableData)
  }

  const checkedStatus = (status: string) => {
    return status === 'ACTIVE' ? true : false
  }

  const columns = [
    {
      title: "Qty",
      dataIndex: "Qty",
      key: 'Qty',
    },
    {
      title: "UoM",
      dataIndex: "UoM",
      key: 'UoM'
    },
    {
      title: "Conversion Number",
      dataIndex: "conversionNumber",
      key: 'conversionNumber'
    },
    {
      title: "Base UoM",
      dataIndex: "baseUoM",
      key: 'baseUoM',
    },
    {
      title: "Active",
      dataIndex: 'status',
      render: (status: string, rowKey: any) => (
        <>
          <Switch checked={checkedStatus(status)} onChange={() => checkTableChildren(rowKey)}/>
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

  return (
    <>
      <Col>
        <Row gap="4px">
          <ArrowLeft style={{ cursor: "pointer" }} onClick={() => router.back()} />
          <Text variant={"h4"}>{UOMDataFake?.name}</Text>
        </Row>

        <Spacer size={20} />

        <Card>
          <Row justifyContent="space-between" alignItems="center" nowrap>
            <Row gap="16px"></Row>

            <Row gap="16px">
              <Button size="big" variant={"tertiary"} onClick={() => setShowDeleteModal(true)}>
                Delete
              </Button>
              <Button size="big" variant={"primary"} onClick={handleSubmit(onSubmit)}>
                {isLoadingUpdateUom ? "Loading..." : "Save"}
              </Button>
            </Row>
          </Row>
        </Card>

        <Spacer size={20} />

        <Card>
          <Spacer size={10} />
          <Row width="100%" noWrap>
            <Col width={"100%"}>
              {UOMDataFake && 
                <Input
                  width="100%"
                  label="Uom Conversion Name"
                  height="40px"
                  defaultValue={UOMDataFake?.name}
                  placeholder={"e.g gram"}
                  {...register("name", { required: "Please enter name." })}
                />
              }
            </Col>
            <Spacer size={10} />
            <Col width="100%">
              <Controller
                control={control}
                name="uom_category_id"
                defaultValue={UomData.uomCategoryId}
                render={({ field: { onChange } }) => (
                  <>
                    <Label>Base UoM</Label>
                    <Spacer size={3} />
                    <FormSelect
                      defaultValue={UomData.uomCategoryId}
                      style={{ width: "100%" }}
                      size={"large"}
                      placeholder={"PCS"}
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
                      data: { uomData: dataUoM, selectedRowKeys },
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
                    loading={isLoadingUOM || isFetchingUomCategory}
                    columns={columns}
                    data={dataUoM}
                    rowSelection={rowSelection}
                    // rowKey={"id"}
                  />
                  <Pagination pagination={pagination} />
                </Col>
          </Col>
        </Card>
      </Col>
      {showCreateModal && (
        <Modal
        // style={{fontSize: '20px'}}
        centered
        width={'400px'}
        visible={showCreateModal}
        onCancel={() => setShowCreateModal(false)}
        title={"Add New Conversion"}
        footer={null}
        content={
          <TopButtonHolder>
            <Spacer size={20} />
            <Col width="100%">
              <Controller
                control={control}
                name="uom_category_id"
                defaultValue={UomData.uomCategoryId}
                render={({ field: { onChange } }) => (
                  <>
                    <Label>UoM</Label>
                    <Spacer size={3} />
                    <div style={{
                      display: 'flex',
                      position: 'relative',
                      justifyContent: 'space-between'
                    }}
                    >
                      <div style={{
                        zIndex: '10',
                        background: 'lightgray',
                        position: 'absolute',
                        height: '40px',
                        width: '25%',
                        borderRadius: '5px 0 0 5px',
                        margin: '0 auto',
                        textAlign: 'center',
                        paddingTop: '.5rem',
                        border: '1px solid gray'
                      }}>Per</div>
                      <FormSelect
                        // dropdownStyle={{ borderRadius: '0 5px 5px 0' }}
                        defaultValue={UomData.uomCategoryId}
                        style={{ width: "77%", marginLeft: '23%', paddingLeft: '2px' }}
                        size={"large"}
                        placeholder={"PCS"}
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
                        }}
                        onSearch={(value: any) => {
                          setSearch(value);
                        }}
                      />
                    </div>
                  </>
                )}
              />
            </Col>
              <Spacer size={15} />

              <Col width={"100%"}>
                <div style={{
                  display: 'flex',
                  position: 'relative'
                }}>
                  {UOMDataFake && 
                    <Input
                      width="80%"
                      label="Conversion Number"
                      height="40px"
                      defaultValue={UOMDataFake?.name}
                      placeholder={"e.g gram"}
                      addonAfter="PCS"
                      {...register("name", { required: "Please enter name." })}
                    />
                  }
                  <div style={{
                          zIndex: '10',
                          position: 'absolute',
                          right: 0,
                          bottom: 4,
                          background: 'lightgray',
                          height: '40px',
                          width: '25%',
                          borderRadius: '0 5px 5px 0',
                          margin: '0 auto',
                          marginTop: '2rem',
                          textAlign: 'center',
                          paddingTop: '.5rem',
                          border: '1px solid gray'
                        }}>PCS</div>
                </div>
              </Col>
              
            <Spacer size={100} />
            <DeleteCardButtonHolder>
              <Button
                // size="medium"
                variant="tertiary"
                key="submit"
                type="primary"
                onClick={() => setShowDelete({ open: false, type: "", data: {} })}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                // size="small"
                onClick={() => {
                    deletedProduct(selectedRowKeys)
                }}
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
          itemTitle={UOMDataFake.name}
          visible={showDeleteModal}
          isLoading={isLoadingDeleteUOM}
          onCancel={() => setShowDeleteModal(false)}
          onOk={() => deleteUOM({ ids: [uom_conversion_id], company_id: "KSNI" })}
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
                      deletedProduct(selectedRowKeys)
                  }}
                >
                  {isLoadingDeleteUOM ? "loading..." : "Yes"}
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

export default UOMConversionDetail;
