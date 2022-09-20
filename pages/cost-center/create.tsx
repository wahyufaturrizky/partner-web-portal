import React, { useEffect, useState } from "react";
import {
  Text,
  Col,
  Row,
  Spacer,
  Dropdown,
  Button,
  Accordion,
  TextArea,
  Input,
  Table,
  Pagination,
  Switch,
  Modal,  
  FormSelect,
  Checkbox,
  DatePickerInput,
  Spin,
} from "pink-lava-ui";
import moment from 'moment';
import styled from "styled-components";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { queryClient } from "../_app";
import useDebounce from "../../lib/useDebounce";
import { ModalDeleteConfirmation } from "../../components/elements/Modal/ModalConfirmationDelete";
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
  const pagination = usePagination({
    page: 1,
    itemsPerPage: 10,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
  });
  const [listUomCategory, setListUomCategory] = useState<any[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [search, setSearch] = useState("");

//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [isShowDelete, setShowDelete] = useState({ open: false, type: "selection", data: {} });
//   const [showCreateModal, setShowCreateModal] = useState(false)
// const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [languageStatus, setLanguageStatus] = useState(true)
  const [currencyStatus, setCurrencyStatus] = useState(true)

  const debounceFetch = useDebounce(search, 1000);
  const [checkSelectAll, setCheckSelectAll] = useState(false)
  const [newUom, setNewUom] = useState({
    company_id: "KSNI",
    name: "",
    base_uom_id: "",
  })

  const [newUomTable, setNewUomTable] = useState([{
    actualPrimaryCost: true,
    plantPrimaryCost: true,
    actualSecondaryCost: true,
    plantSecondaryCost: true,
    actualRevenues: true,
    plantRevenues: true,
    commitmentUpdate: false,
  }])
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
      company_id: "KSNI",
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
    console.log(id)
    // let tempDataTable = [...newUomTable]
    // id.forEach((uomId: number) => {
    //   tempDataTable = tempDataTable.filter(el => el.id !== uomId)
    // })
    // tempDataTable = tempDataTable.map((el, i) => {
    //   return {
    //     ...el,
    //     id : i + 1
    //   }
    // })
    // setSelectedRowKeys([])
    // setNewUomTable(tempDataTable)
    // setShowDelete({ open: false, type: "selection", data: {} })
  
  }

  const updateCreateUom = (data: any) => {
    console.log(data)
    // if(!newUomTable){
    //   setNewUomTable([{
    //     id: 1,
    //     qty: 1,
    //     uom: listUomCategory.find(e => e.value === data.uom).label,
    //     conversionNumber: data.conversionNumber,
    //     baseUom: listUomCategory.find(e => e.value === data.baseUom).label
    //   }])
    // } else {
    //   setNewUomTable(prev => [...prev, {
    //     id: newUomTable.length+1,
    //     qty: 1,
    //     uom: listUomCategory.find(e => e.value === data.uom).label,
    //     conversionNumber: data.conversionNumber,
    //     baseUom: listUomCategory.find(e => e.value === data.baseUom).label
    //   }])
    // }
    // setNewUom({
    //   company_id: "KSNI",
    //   name: data.name,
    //   base_uom_id: listUomCategory.find(e => e.value === data.uom).label,
    // })
    // setShowCreateModal(false)
  };

  const updateStatusUom = (rowKey: any) => {
    console.log(rowKey)
  }

  const onSave = (data: any) => {
    console.log(data, '<<<onsave')
    // const tempTable = [...newUomTable]
    // const savedTable = tempTable.map(uom => {
    //   return {
    //     qty: uom.qty,
    //     uom_id: listUomCategory.find(e => e.label === uom.uom).value,
    //     conversion_number: uom.conversionNumber
    //   }
    // })
    // const saveData = {
    // company_id: "KSNI",
    // name: data.name,
    // base_uom_id: data.baseUom,
    // items: savedTable
    // }
    // console.log(saveData, 910192)
    // createUom(saveData)
  }

  const columns = [
    {
      title: "Actual Primary Cost",
      dataIndex: "actualPrimaryCost",
      key: 'actualPrimaryCost',
      align:'center',
      render: (status:boolean, rowKey: any) => (
        <>
            <Checkbox checked={status} onChange={() => selectOneCheckbox(status, 'actualPrimaryCost')}/>
        </>
      )
    },
    {
      title: "Plant Primary Cost",
      dataIndex: "plantPrimaryCost",
      key: 'plantPrimaryCost',
      align:'center',
      render: (status:boolean, rowKey: any) => (
        <>
            <Checkbox checked={status} onChange={() => selectOneCheckbox(status, 'plantPrimaryCost')}/>
        </>
      )
    },
    {
      title: "Actual Secondary Cost",
      dataIndex: "actualSecondaryCost",
      key: 'actualSecondaryCost',
      align:'center',
      render: (status:boolean, rowKey: any) => (
        <>
            <Checkbox checked={status} onChange={() => selectOneCheckbox(status, 'actualSecondaryCost')}/>
        </>
      )
    },
    {
      title: "Plant Secondary Cost",
      dataIndex: "plantSecondaryCost",
      key: 'plantSecondaryCost',
      align:'center',
      render: (status:boolean, rowKey: any) => (
        <>
            <Checkbox checked={status} onChange={() => selectOneCheckbox(status, 'plantSecondaryCost')}/>
        </>
      )
    },
    {
      title: "Actual Revenues",
      dataIndex: "actualRevenues",
      key: 'actualRevenues',
      align:'center',
      render: (status:boolean, rowKey: any, column) => {
        return(
            <>
                <Checkbox checked={status} onChange={() => selectOneCheckbox(status, 'actualRevenues')}/>
            </>
          )
      }
    },
    {
      title: "Plant Revenues",
      dataIndex: "plantRevenues",
      key: 'plantRevenues',
      align:'center',
      render: (status:boolean, rowKey: any) => (
        <>
            <Checkbox checked={status} onChange={() => selectOneCheckbox(status, 'plantRevenues')}/>
        </>
      )
    },
    {
      title: "Comitment Update",
      dataIndex: "commitmentUpdate",
      key: 'commitmentUpdate',
      align:'center',
      render: (status:boolean, rowKey: any) => (
        <>
            <Checkbox checked={status} onChange={() => selectOneCheckbox(status, 'commitmentUpdate')}/>
        </>
      )
    },
  ];

  const selectOneCheckbox = (checked, name) => {
    let newCheckbox = newUomTable[0]
    switch (name) {
        case 'actualPrimaryCost':
            newCheckbox.actualPrimaryCost = !checked
            break;
        case 'plantPrimaryCost':
            newCheckbox.plantPrimaryCost = !checked
            break;
        case 'actualSecondaryCost':
            newCheckbox.actualSecondaryCost = !checked
            break;
        case 'plantSecondaryCost':
            newCheckbox.plantSecondaryCost = !checked
            break;
        case 'actualRevenues':
            newCheckbox.actualRevenues = !checked
            break;
        case 'plantRevenues':
            newCheckbox.plantRevenues = !checked
            break;
        case 'commitmentUpdate':
            newCheckbox.commitmentUpdate = !checked
            break;
    
        default:
            break;
    }
    setNewUomTable([newCheckbox])
  }

  const selectAllCheckbox = (checked) => {
    setCheckSelectAll(prev => !prev)
    if(checkSelectAll){
        setNewUomTable([{
            actualPrimaryCost: false,
            plantPrimaryCost: false,
            actualSecondaryCost: false,
            plantSecondaryCost: false,
            actualRevenues: false,
            plantRevenues: false,
            commitmentUpdate: false,
            }])
    } else{
        setNewUomTable([{
            actualPrimaryCost: true,
            plantPrimaryCost: true,
            actualSecondaryCost: true,
            plantSecondaryCost: true,
            actualRevenues: true,
            plantRevenues: true,
            commitmentUpdate: true,
            }])
    }
  }

  const setLanguageFromCompany = (data) => {
    setLanguageStatus(prev => !prev)
  }

  const setCurrencyFromCompany = (data) => {
    setCurrencyStatus(prev => !prev)
  }

  const disabledDate: RangePickerProps['disabledDate'] = current => {
    // Can not select days before today and today
    return current <= moment().startOf('day');
  };

  if (isFetchingUomCategory)
  return (
    <Center>
      <Spin tip="Loading data..." />
    </Center>
  );

  return (
    <>
      <Col>
        <Row gap="4px">
          <Text variant={"h4"}>Create Cost Center</Text>
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

            {/* cost center code & cost center name */}
            <Row width="100%" noWrap>
                <Col width={"100%"}>
                    <Input
                    width="100%"
                    label="Cost Center Code"
                    // defaultValue={newUom.name}
                    height="48px"
                    required
                    placeholder={"e.g Product Conversion"}
                    {...register("costCenterCode", { required: "Please enter name." })}
                    />
                </Col>

                <Spacer size={10} />

                <Col width="100%">
                    <Input
                    width="100%"
                    label="Cost Center Name"
                    // defaultValue={newUom.name}
                    height="48px"
                    required
                    placeholder={"e.g Product Conversion"}
                    {...register("costCenterName", { required: "Please enter name." })}
                    />
                </Col>
            </Row>

          <Spacer size={20} />

            {/* Valid From */}
            <Row width="100%" noWrap>
                <Col width={"100%"}>
                <Controller
                    control={control}
                    name={`valid_from`}
                    render={({ field: { onChange } }) => (
                        <DatePickerInput
                        fullWidth
                        disabledDate={disabledDate}
                        onChange={(date: any, dateString: any) => onChange(dateString)}
                        label="Valid From"
                        defaultValue={moment()} format={'DD/MM/YYYY'}
                        />
                    )}
                    />
                </Col>

                <Spacer size={10} />

                <Col width="100%">
                <Controller
                    control={control}
                    name={`valid_to`}
                    render={({ field: { onChange } }) => (
                        <DatePickerInput
                        fullWidth
                        disabledDate={disabledDate}
                        onChange={(date: any, dateString: any) => onChange(dateString)}
                        label="Valid To"
                        defaultValue={moment()} format={'DD/MM/YYYY'}
                        />
                    )}
                    />
                </Col>
            </Row>

          <Spacer size={20} />
          
            {/* Company */}
            <Row width="100%" noWrap>
                <Col width={"100%"}>
                <Controller
                    control={control}
                    name="baseUom"
                    render={({ field: { onChange } }) => (
                    <>
                        <Label>Company</Label>
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
                        }}
                        onSearch={(value: any) => {
                            setSearch(value);
                        }}
                        />
                    </>
                    )}
                    />
                </Col>

                <Spacer size={20} />

                <Col width={languageStatus? "100%" : "40%"}>
                    <div style={{
                        fontWeight: 'bold',
                        fontSize: '17px',
                    }}>
                        <Text>Language</Text>
                    </div>
                    <Spacer size={5} />

                    <div style={{
                        display: 'flex',
                        width: '100%',
                        gap: '1rem',
                        alignItems: 'center',
                        fontWeight: 'bold',
                        fontSize: '17px',
                        // justifyContent: 'space-between'
                    }}>
                        <Text>Refer To Company?</Text>
                        <Switch checked={languageStatus} onChange={() => setLanguageFromCompany(languageStatus)}/>
                    </div>
                </Col>

                <Spacer size={10} />
                {!languageStatus && (
                    <Col width="60%">
                    <Spacer size={20} />

                    <Controller
                        control={control}
                        name="baseUom"
                        render={({ field: { onChange } }) => (
                        <>
                            {/* <Label>Company</Label> */}
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
                            }}
                            onSearch={(value: any) => {
                                setSearch(value);
                            }}
                            />
                        </>
                        )}
                    />
                </Col>
                )}
                
            </Row>

          <Spacer size={20} />
          
            {/* Profit Center */}
            <Row width="100%" noWrap>
                <Col width={"100%"}>
                <Controller
                    control={control}
                    name="baseUom"
                    render={({ field: { onChange } }) => (
                    <>
                        <Label>Profit Center</Label>
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
                        }}
                        onSearch={(value: any) => {
                            setSearch(value);
                        }}
                        />
                    </>
                    )}
                    />
                </Col>

                <Spacer size={20} />

                <Col width={currencyStatus ? "100%" : "40%"}>
                    <div style={{
                        fontWeight: 'bold',
                        fontSize: '17px',
                    }}>
                        <Text>Currency</Text>
                    </div>
                    <Spacer size={5} />

                    <div style={{
                        display: 'flex',
                        width: '100%',
                        gap: '1rem',
                        alignItems: 'center',
                        fontWeight: 'bold',
                        fontSize: '17px',
                        // justifyContent: 'space-between'
                    }}>
                        <Text>Refer To Company?</Text>
                        <Switch checked={currencyStatus} onChange={() => setCurrencyFromCompany(currencyStatus)}/>

                    </div>
                </Col>

                <Spacer size={10} />
                {!currencyStatus && (
                    <Col width="60%">
                        <Spacer size={20} />

                        <Controller
                            control={control}
                            name="baseUom"
                            render={({ field: { onChange } }) => (
                            <>
                                {/* <Label>Company</Label> */}
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
                                }}
                                onSearch={(value: any) => {
                                    setSearch(value);
                                }}
                                />
                            </>
                            )}
                        />
                    </Col>
                )}
            </Row>

          <Spacer size={20} />
          
            {/* Cost Center Category */}
            <Row width="100%" noWrap>
                <Col width={"100%"}>
                <Dropdown
                  label="Cost Center Category"
                  height="48px"
                  width={"100%"}
                  items={[
                    {
                      id: 0,
                      value: "Development",
                    },
                    {
                      id: 1,
                      value: "Production",
                    },
                    {
                      id: 3,
                      value: "Logistics",
                    },
                    {
                      id: 4,
                      value: "Service Cost Center",
                    },
                    {
                      id: 5,
                      value: "Management",
                    },
                    {
                      id: 6,
                      value: "Material",
                    },
                    {
                      id: 7,
                      value: "Social",
                    },
                    {
                      id: 8,
                      value: "Sales",
                    },
                    {
                      id: 9,
                      value: "Administration",
                    },
                  ]}
                  placeholder={"Select"}
                  noSearch
                />
                </Col>

                <Spacer size={10} />

                <Col width="100%">
                <Input
                    width="100%"
                    label="Person Responsible"
                    height="48px"
                    required
                    placeholder={"e.g TBD"}
                    {...register("name", { required: "Please enter name." })}
                    />
                </Col>
            </Row>

          <Spacer size={20} />
            
            {/* description */}
            <Row width="100%" noWrap>
                <Col width={"100%"}>
                    <TextArea
                        width="100%"
                        label="Description"
                        required
                        placeholder={"e.g New Cost Center"}
                        {...register("name", { required: "Please enter name." })}
                        />
                </Col>

                <Spacer size={10} />

                <Col width="100%">
                <Input
                    width="100%"
                    label="External Code"
                    height="54px"
                    required
                    placeholder={"e.g TBD"}
                    {...register("name", { required: "Please enter name." })}
                    />
                </Col>
            </Row>

          <Spacer size={20} />
          <Separator/>
          <Spacer size={20} />


          <Col>
              <div style={{
                display: 'flex',
                fontWeight: 'bold',
                alignItems: "center"
              }}>
              <Checkbox checked={checkSelectAll} onChange={() => selectAllCheckbox(checkSelectAll)}/>
              <Text>Select All</Text>

              </div>
              <Spacer size={20} />
                <Col gap={"60px"}>
                  <Table
                    columns={columns}
                    data={newUomTable}
                    bordered
                    rowKey={"id"}
                  />
                </Col>
          </Col>
        </Card>
      </Col>

      {/* {showCreateModal && (
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
                    <Label>UoM</Label>
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
                      height="48px"
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
      )} */}
    </>
  );
};

const Separator = styled.div`
  display: block;
  height: 0;
  border-bottom: 1px dashed #cccccc;
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

export default UOMConversionCreate;
