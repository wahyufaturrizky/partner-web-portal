import React, { useEffect, useState } from "react";
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
  Tabs
} from "pink-lava-ui";
import styled from "styled-components";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { queryClient } from "../_app";
import useDebounce from "../../lib/useDebounce";
import { ModalDeleteConfirmation } from "../../components/elements/Modal/ModalConfirmationDelete";
import ArrowLeft from "../../assets/icons/arrow-left.svg";
import usePagination from "@lucasmogari/react-pagination";
import { useCountryTaxInfiniteLists, useCreateTax, useDeleteTaxItem, useDeletTax, useTaxInfiniteLists, useUpdateTax } from "hooks/mdm/Tax/useTax";
import { columnsTaxType, dataTaxType, listTabItems, TaxBodyFields } from "components/pages/Tax/constants";
import TaxList from "components/pages/Tax/fragments/TaxList";
import VatList from "components/pages/Tax/fragments/VatList";
import { ICDelete, ICEdit } from "assets";
import WithholdingForm from "components/pages/Tax/fragments/WithholdingForm";
import TaxTypeForm from "components/pages/Tax/fragments/TaxTypeForm";
import moment from "moment";

const renderConfirmationText = (type: any, data: any) => {
switch (type) {
  case "selection":
    return data.selectedRowKeys.length > 1
      ? `Are you sure to delete ${data.selectedRowKeys.length} items ?`
      : `Are you sure to delete Tax Name ${
          data?.taxData?.tax_item_name
        } ?`;
  case "detail":
    return `Are you sure to delete Uom Name ${data.uomName} ?`;

  default:
    break;
}
};

interface TaxDetail {
    countryName: string; 
    taxId: string; 
    country: {name: string};
    countryId: string;
    name: string;
    percentage: string; 
    activeStatus: string;
    taxItems : [{
      taxItemId :string,
      taxItemType: string,
      taxName : string,
      glAccount: string,
      taxType : string,
      taxCode : string,
        details: [{
          tax_item_id : string,
          tax_item_detail_id : string,
          period_from : string,
          period_to : string,
          percentage : string,
          percentage_subject_to_tax : string,
          withholding_tax_rate : string,
        }]
    }] 
}



const TaxDetail = () => {

  const router = useRouter();
  const pagination = usePagination({
    page: 1,
    itemsPerPage: 20,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
  });
  const { tax_id } = router.query;
  const [listTaxCountries, setListTaxCountries] = useState<any[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [search, setSearch] = useState("");

  const [isShowDelete, setShowDelete] = useState({ open: false, type: "selection", data: {} });
  const [showCreateModal, setShowCreateModal] = useState({ open: false, type: "", data: {} })
  const [showTaxTypeModal, setShowTaxTypeModal] = useState(false)

  const debounceSearch = useDebounce(search, 1000);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [statusId, setStatusId] = useState(null)
  const [updatedTaskData, setUpdatedTaskData] = useState(null)
  const [tabAktived, setTabAktived] = useState<string>('Withholding Tax')
  const [formType, setFormType] = useState<string>('Withholding Tax')
  const [arrayTax,setArrayTax] = useState<{data:string}[]>([])
  const [allTaxData,setAllTaxData] = useState<{data:string}[]>([])
  const { register, control, handleSubmit, reset, getValues ,formState: { errors },} = useForm();
  
  const {
    isFetching: isFetchingCountryList,
    isFetchingNextPage: isFetchingMoreCountryList,
    hasNextPage,
    fetchNextPage,
  } = useCountryTaxInfiniteLists({
    query: {
      search: debounceSearch,
      limit: 10,
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRows(data.pages[0].totalRow);
        const mappedData = data?.pages[0]?.map((country: any) => {
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
  // switch elements detail information
  const switchTabItem = () => {
    switch (tabAktived) {
      case 'Withholding Tax':
        return <TaxList {...propsTaxList}/>
      case 'VAT':
        return <VatList {...propsTaxList}/>
      default:
        return null
    }
  }
  //useFieldArray ADDRESSES
  const {
    fields: fieldsTax,
    append: appendTax,
    replace: replaceTax,
    remove: removeTax,
  } = useFieldArray({
    control,
    name: "item_details",
  });

  const {
    data: TaxData,
    isLoading: isLoadingTax,
    isFetching: isFetchingTax,
  } = useTaxInfiniteLists({
    query: {
    country_id: tax_id,
    search: debounceSearch,
      page: pagination.page,
      limit: pagination.itemsPerPage,
      },
    options: {
      onSuccess: (data: any) => {
        pagination.setTotalItems(data?.totalRow);
        setAllTaxData(data.data);
      },
      select: (data: any) => {

        const mappedData = data?.pages[0]?.rows?.map((taxDetail: TaxDetail,_index : any) => {          
            return {
                key: _index,
                id: taxDetail.taxId,
                country_name: taxDetail.country.name,
                country_id: taxDetail.countryId,
                name: taxDetail.name,
                percentage: taxDetail.percentage,
                active_status: taxDetail.activeStatus,
                tax_item: taxDetail.taxItems.map((item :any ) => {
                  
                  return {
                    tax_item_id :item.taxItemId,
                    tax_item_name : item.taxName,
                    tax_item_type : item.taxItemType,
                    gl_account : item.glAccount,
                    tax_type : item.taxType,
                    tax_code : item.taxCode,
                    deleted_by : item.deletedBy,
                    details: item.details.map((item_detail :any) => {
                      return {
                          tax_item_id : item_detail.taxItemId,
                          tax_item_detail_id : item_detail.taxItemDetailId,
                          period_from : item_detail.periodFrom,
                          period_to : item_detail.periodTo,
                          percentage : item_detail.percentage,
                          percentage_subject_to_tax : item_detail.percentageSubjectToTax,
                          withholding_tax_rate : item_detail.withholdingTaxRate,
                      }
                    })
                  }
                })
            }
        })
        return {data :mappedData, totalRows: data.totalRow}
      }
    },
  });

  const { mutate: deleteTaxItem, isLoading: isLoadingDeleteTaxItem } = useDeleteTaxItem({
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries(["tax/infinite"]);
        setShowDelete({ open: false, type: "selection", data: {} });
        // router.back();
      },
    },
  });

  const { mutate: updateTax, isLoading: isLoadingUpdateTax } = useUpdateTax({
    countryId: tax_id,
    id: statusId && statusId,
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries(["tax/infinite"]);
      },
    },
  });

  const { mutate: createTax, isLoading: isLoadingCreateTax } = useCreateTax({
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries(["tax/infinite"]);
        reset()
      },
    },
  });

  useEffect(() => {
    if(updatedTaskData){
      updateTax(updatedTaskData)
    }
  }, [updatedTaskData])

  
  // belum bisa dari backend
  const deleteTax = (param: any) => {     
    const deleteParam: any = {
      tax_ids:[TaxData?.data[0]?.id],
      tax_item_ids:[param.taxData.tax_item_detail_id]
    } 
    deleteTaxItem(deleteParam)
  }

  const handleNewTax = (data: any) => {
    
    const newTax: any = {
        tax_id : TaxData?.data[0]?.id,
        tax_name : data.tax_name,
        tax_item_type : tabAktived == 'Withholding Tax' ? 'WITHHOLDING' : tabAktived ,
        gl_account : `${data.gl_account}`,
        tax_type : data.tax_type,
        tax_code : data.tax_code,
        status : "ACTIVE",
        item_details : data.item_details?.map((item: any) => {
          return {
            percentage: item.percentage,
            period_from: item.period[0],
            period_to: item.period[1],
            percentage_subject_to_tax: item.percentage_subject_to_tax,
            withholding_tax_rate: item.withholding_tax_rate
          }
        })
    }
    createTax(newTax)
    setShowCreateModal({ open: false, type: "", data: {} })
  }

  const updateTaxStatus = (rowKey: any) => {
      const data: any = {
        name: rowKey.name,
        percentage: rowKey.percentage,
        active_status: rowKey?.active_status === "ACTIVE"? "INACTIVE" : "ACTIVE"
      }
      setStatusId(rowKey.key)
      setUpdatedTaskData(data)
  }

  const checkedStatus = (status: string) => {
    return status === 'ACTIVE' ? true : false
  }
  
  const columns = [
    { title: "", dataIndex: "key" },
    { title: "", dataIndex: "id" },
    { title: "", dataIndex: "tax_item_type" },
    {
      title: "",
      dataIndex: "action",
      width: "15%",
      render: (_: any, record: any) => {
        if (record.tax_item_name) {
          return (
            <Row gap="16px" alignItems="center" nowrap>
              <Col>
                <ICEdit onClick={() => onHandleEdit(record)}/>
              </Col>
              <Col>
                <ICDelete onClick={() =>
                        setShowDelete({
                          open: true,
                          type: "selection",
                          data: { taxData: record, selectedRowKeys },
                        })
                      } />
              </Col>
            </Row>
          )
        }
      }
    },
    {
      title: "Tax Name",
      dataIndex: "tax_item_name",
      key: 'tax_item_name',
    },
    {
      title: "G/L Account",
      dataIndex: "gl_account",
      key: 'gl_account'
    },
    {
      title: "Tax Type",
      dataIndex: "tax_type",
      key: 'tax_type'
    },
    {
      title: "Tax Code",
      dataIndex: "tax_code",
      key: 'tax_code'
    },
    {
      title: "Percentage Subject Tax",
      dataIndex: "percentage_subject_to_tax",
      key: 'percentage_subject_to_tax'
    },
    {
      title: "Percentage Subject Tax",
      dataIndex: "withholding_tax_rate",
      key: 'withholding_tax_rate'
    },
    {
      title: "Period",
      dataIndex: "period",
      key: 'period'
    },
    {
      title: "Active",
      dataIndex: 'active_status',
      render: (status: string, rowKey: any) => {
        if (rowKey.tax_item_name) {
          return (
            <>
              <Switch checked={checkedStatus(status)} onChange={() => updateTaxStatus(rowKey)}/>
            </>
          )
        }
      },
    },
  ];
  
  const datadetails = allTaxData[0]?.tax_item.map((item) => {
    const datadetails = item.details.map((item2, index) => {  
      return {
        tax_item_detail_id: item.tax_item_id,
        tax_item_name: index !== 0 ? null : item.tax_item_name,
        gl_account: index !== 0 ? null : item.gl_account,
        tax_type: index !== 0 ? null : item.tax_type,
        tax_item_type: item.tax_item_type,
        tax_code: index !== 0 ? null : item.tax_code,
        percentage_subject_to_tax: item2.percentage_subject_to_tax,
        withholding_tax_rate: item2.withholding_tax_rate,
        period: `${moment(item2.period_from).format("D MMM YYYY")} to ${moment(item2.period_to).format("D MMM YYYY")}`,
        details: item.details,
        deleted_by: item.deleted_by
      };
    });
    return datadetails;
  });
  const dataMerge = [].concat.apply([], datadetails);

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: any) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  if(isLoadingTax || isFetchingTax || isLoadingUpdateTax) {
    return (
        <Center>
            <Spin tip="Loading data..." />
        </Center>
    )
  }
    const onHandleEdit = (render: any) => {
        setShowCreateModal({ open: true, type: "edit", data: render })
    };
    const removeBankAccount = (param :any) => {
        const columns= arrayTax.filter(
          (filtering :any) => filtering?.key !== param 
        )
        setArrayTax(columns);
    }
    const propsTaxList = {
      onHandleEdit,
      isLoadingTax:isLoadingTax,
      isFetchingTax:isFetchingTax,
      columns:columns,
      data:TaxData?.data[0]?.tax_item,
      rowSelection:rowSelection,
      pagination:pagination,
      removeBankAccount,
      setShowCreateModal,
      dataSource:dataMerge
  }
    const propsWithHolding = {
    control,
    register,
    fieldsTax,
    appendTax,
    replaceTax,
    removeTax,
    TaxBodyFields,
    getValues,
    reset,
    setShowTaxTypeModal,
    tabAktived,
    errors,
    showCreateModal
  }

  const propsTaxType = {
    control,
    register,
    getValues,
    reset,
    setShowTaxTypeModal,
    columns : columnsTaxType,
    data : dataTaxType[0].data.rows
  }
  
  return (
    <>
      <Col>
        <Row gap="4px">
        <ArrowLeft style={{ cursor: "pointer" }} onClick={() => router.back()} />
          <Text variant={"h4"}>Tax-{TaxData?.data[0]?.country_name}</Text>
        </Row>

        <Spacer size={20} />

        <Card>
          <Row justifyContent="space-between" alignItems="center" nowrap>
            <Row gap="16px"></Row>

            <Row gap="16px">
              {/* <Button size="big" variant={"tertiary"} onClick={() => router.back()}>
                cancel
              </Button> */}
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
                    defaultValue={TaxData?.data[0]?.country_id}
                    render={({ field: { onChange } }) => (
                    <>
                        <Label>Country</Label>
                        <Spacer size={3} />
                        <FormSelect
                        defaultValue={TaxData?.data[0]?.country_name}
                        style={{ width: "100%" }}
                        size={"large"}
                        placeholder={"Select"}
                        borderColor={"#AAAAAA"}
                        arrowColor={"#000"}
                        required
                        withSearch
                        disabled
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
              {/* <HeaderLabel>Tax</HeaderLabel>
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
                      data: { taxData: TaxData?.data, selectedRowKeys },
                    })
                  }
                  disabled={rowSelection.selectedRowKeys?.length === 0}
                >
                  Delete
                </Button>
              </Row>
              <Spacer size={20} /> */}
              <Tabs
                defaultActiveKey={tabAktived}
                listTabPane={listTabItems.slice(0, listTabItems.length)}
                onChange={(e: any) => setTabAktived(e)}
              />
              <Spacer size={20} />
              {switchTabItem()}
              <Spacer size={100} />
          </Col>
        </Card>
      </Col>

      {showCreateModal.open && (
        <Modal
        // style={{fontSize: '20px'}}
        centered
        width={'60%'}
        visible={showCreateModal.open}
        onCancel={() => setShowCreateModal({ open: false, type: "", data: {} })}
        footer={null}
        content={
          <TopButtonHolder>
            <CreateTitle>
              Add New {tabAktived}
            </CreateTitle>
            <Spacer size={20} />
            <WithholdingForm {...propsWithHolding}/>
            <Spacer size={100} />
            <DeleteCardButtonHolder>
              <Button
                // size="medium"
                variant="tertiary"
                key="submit"
                type="primary"
                onClick={() => setShowCreateModal({ open: false, type: "", data: {} })}
              >
                Cancels
              </Button>
              <Button
                variant="primary"
                // size="small"
                onClick={handleSubmit(handleNewTax)}
              >
                save
              </Button>
            </DeleteCardButtonHolder>
          </TopButtonHolder>
        }
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
                      deleteTax(isShowDelete.data)
                  }}
                >
                  {isLoadingDeleteTaxItem ? "loading..." : "Yes"}
                </Button>
              </DeleteCardButtonHolder>
            </TopButtonHolder>
          }
        />
      )}

      {showTaxTypeModal && (
        <Modal
        // style={{fontSize: '20px'}}
        centered
        width={'60%'}
        visible={showTaxTypeModal}
        onCancel={() => setShowTaxTypeModal(false)}
        footer={null}
        content={
          <TopButtonHolder>
            <CreateTitle>
              Add New Tax Type Modal
            </CreateTitle>
            <Spacer size={20} />
            <TaxTypeForm {...propsTaxType} />
            <Spacer size={100} />
            <DeleteCardButtonHolder>
              <Button
                // size="medium"
                variant="tertiary"
                key="submit"
                type="primary"
                onClick={() => setShowTaxTypeModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                // size="small"
                onClick={handleSubmit(handleNewTax)}
              >
                save
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

const CreateTitle = styled.div`
  margin-top: 1rem;
  font-weight: 600;
  font-size: 1.5rem;
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

export default TaxDetail;
