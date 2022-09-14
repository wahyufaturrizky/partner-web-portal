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
import { useCreateTax, useDeletTax, useTax } from "hooks/mdm/Tax/useTax";
import { useCountryInfiniteLists } from "hooks/mdm/country-structure/useCountries";

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

const TaxCreate = () => {

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
  const [listTaxCountries, setListTaxCountries] = useState<any[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [search, setSearch] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isShowDelete, setShowDelete] = useState({ open: false, type: "selection", data: {} });
  const [showCreateModal, setShowCreateModal] = useState(false)

  const debounceFetch = useDebounce(search, 1000);
  const [taxData, setTaxData] = useState<any | null>(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);


  const { register, control, handleSubmit } = useForm();
  
  const {
    isFetching: isFetchingCountryList,
    isFetchingNextPage: isFetchingMoreCountryList,
    hasNextPage,
    fetchNextPage,
  } = useCountryInfiniteLists({
    query: {
      search: debounceFetch,
    //   company_id: "KSNI",
      limit: 10,
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRows(data.pages[0].totalRow);
        const mappedData = data?.pages[0]?.rows?.map((country: any) => {
          return {
            id: country.id,
            value: country.id,
            label: country.name
          }
        });
        setListTaxCountries(mappedData);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (listTaxCountries?.length < totalRows) {
          return pages.length + 1;
        } else {
          return undefined;
        }
      },
    },
  });


  const { mutate: deleteUOM, isLoading: isLoadingDeleteUOM } = useDeletTax({
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries(["tax-list"]);
        setShowDeleteModal(false);
        router.back();
      },
    },
  });

  const deletedProduct = (id: any) => {
    console.log(id, '<<delete prod')
  }


  const checkTableChildren = (rowKey: any) => {
    const newTableData = taxData?.map(el => {
      if(el.key === rowKey.key){
        el.status === 'ACTIVE' ? el.status = 'INACTIVE' : el.status = 'ACTIVE'
      }
      return el
    })
    setTaxData(newTableData)
  }

  const checkedStatus = (status: string) => {
    return status === 'ACTIVE' ? true : false
  }

  const columns = [
    {
      title: "Tax Name",
      dataIndex: "name",
      key: 'name',
    },
    {
      title: "Percentage",
      dataIndex: "percentage",
      key: 'percentage'
    },
    {
      title: "Active",
      dataIndex: 'active_status',
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

  const { mutate: createTax, isLoading: isLoadingCreateTax } = useCreateTax({
    options: {
      onSuccess: () => {
        // router.back();
        queryClient.invalidateQueries(["tax-list"]);
      },
    },
  });

  const handleDataTax = (tax: any) => {
    const newTax = {
            country_id : tax.country_id,
            name : tax.name,
            percentage : tax.percentage,
            active_status:"ACTIVE"
    }
    createTax(newTax)
    if(taxData){
        setTaxData((prev: any) => [...prev, newTax])
    } else setTaxData([newTax])
    setShowCreateModal(false)
  }

  return (
    <>
      <Col>
        <Row gap="4px">
          <Text variant={"h4"}>{"Create UoM Conversion"}</Text>
        </Row>

        <Spacer size={20} />

        <Card>
          <Row justifyContent="space-between" alignItems="center" nowrap>
            <Row gap="16px"></Row>

            <Row gap="16px">
              <Button size="big" variant={"tertiary"} onClick={() => router.back()}>
                cancel
              </Button>
              {/* <Button size="big" variant={"primary"} onClick={handleSubmit(onSubmit)}> */}
              <Button size="big" variant={"primary"} onClick={() => router.back()}>
                {isLoadingCreateTax ? "Loading..." : "Save"}
              </Button>
            </Row>
          </Row>
        </Card>

        <Spacer size={20} />

        <Card>
          <Spacer size={10} />
          <Row width="50%" noWrap>
            <Col width="100%">
              <Controller
                control={control}
                name="country_id"
                render={({ field: { onChange } }) => (
                  <>
                    <Label>Country</Label>
                    <Spacer size={3} />
                    <FormSelect
                      style={{ width: "100%" }}
                      size={"large"}
                      placeholder={"Select"}
                      borderColor={"#AAAAAA"}
                      arrowColor={"#000"}
                      required
                      withSearch
                      isLoading={isFetchingCountryList}
                      isLoadingMore={isFetchingMoreCountryList}
                      fetchMore={() => {
                        if (hasNextPage) {
                          fetchNextPage();
                        }
                      }}
                      items={
                        isFetchingCountryList && !isFetchingMoreCountryList
                          ? []
                          : listTaxCountries
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
                      data: { uomData: taxData, selectedRowKeys },
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
                    // loading={isLoadingUOM || isFetchingUomCategory}
                    columns={columns}
                    data={taxData}
                    rowSelection={rowSelection}
                    rowKey={"name"}
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
        footer={null}
        content={
          <TopButtonHolder>
            <CreateTitle>
              Add New Tax
            </CreateTitle>
            <Spacer size={20} />
            <Col width="100%">
              <Input
                      width="80%"
                      label="Tax Name"
                      required
                      height="40px"
                      placeholder={"e.g PPh 21"}
                      {...register("name", { required: "Please enter name." })}
                    />
            </Col>
              <Spacer size={15} />

            <Col width={"100%"}>
            <CreateInputDiv>
                {/* {UOMDataFake &&  */}
                <Input
                    width="80%"
                    label="Percentage"
                    height="40px"
                    required
                    placeholder={"e.g 10"}
                    addonAfter="PCS"
                    {...register("percentage", { required: "Please enter name." })}
                />
                {/* } */}
                <InputAddonBefore>%</InputAddonBefore>
            </CreateInputDiv>
            </Col>
              
            <Spacer size={100} />
            <DeleteCardButtonHolder>
              <Button
                // size="medium"
                variant="tertiary"
                key="submit"
                type="primary"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                // size="small"
                onClick={handleSubmit(handleDataTax)}
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

export default TaxCreate;
