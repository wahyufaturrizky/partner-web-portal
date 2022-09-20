import React, { useEffect, useState } from "react";
import {
  Text,
  Col,
  Row,
  Spacer,
  Dropdown2,
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
import { useCompanyList } from "hooks/company-list/useCompany";


const costCenterCategoryTable = [
    {
      id: "Development",
      value: "Development",
    },
    {
      id: "Production",
      value: "Production",
    },
    {
      id: "Logistics",
      value: "Logistics",
    },
    {
      id: "Service Cost Center",
      value: "Service Cost Center",
    },
    {
      id: "Management",
      value: "Management",
    },
    {
      id: "Material",
      value: "Material",
    },
    {
      id: "Social",
      value: "Social",
    },
    {
      id: "Sales",
      value: "Sales",
    },
    {
      id: "Administration",
      value: "Administration",
    },
  ]

export interface CompanyList {
    rows:     RowCompanyList[];
    totalRow: number;
    sortBy:   string[];
}

export interface RowCompanyList {
    id:          number;
    name:        string;
    code:        string;
    companyType: string;
    industry:    string;
    status:      string;
    isActive:    boolean;
}

const CostCenterCreate = () => {
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
  const [description, setDescription] = useState("")
  const [costCenterCategory, setCostCenterCategory] = useState("")
  const debounceFetch = useDebounce(search, 1000);
  const [checkSelectAll, setCheckSelectAll] = useState(false)


  const [newCostCenterTable, setNewCostCenterTable] = useState([{
    actual_primary_cost: false,
    plant_primary_cost: false,
    actual_secondary_cost: false,
    plant_secondary_cost: false,
    actual_revenues: false,
    plant_revenues: false,
    commitment_update: false,
  }])
  const { register, control, handleSubmit } = useForm();

//   const {
//     isFetching: isFetchingCompanyData,
//     isFetchingNextPage: isFetchingMoreCompanyData,
//     isLoading: isLoadingUOM,
//     hasNextPage,
//     fetchNextPage,
//   } = useCompanyInfiniteLists({
//     query: {
//       search: debounceFetch,
//     //   company_id: "KSNI",
//       limit: 10,
//     },
//     options: {
//       onSuccess: (data: any) => {
//         console.log(data, '<<<<')
//         setTotalRows(data.pages[0].totalRow);
//         const mappedData = data?.pages?.map((group: any) => {
//           return group.rows?.map((element: any) => {
//             return {
//               value: element.id,
//               label: element.name,
//             };
//           });
//         });
//         const flattenArray = [].concat(...mappedData);
//         // setListUomCategory(flattenArray);
//       },
//       getNextPageParam: (_lastPage: any, pages: any) => {
//         if (listUomCategory.length < totalRows) {
//           return pages.length + 1;
//         } else {
//           return undefined;
//         }
//       },
//     },
//   });

const {
    data: companyData,
    refetch: isFetchingMoreCompanyData,
    isFetching: isFetchingCompanyData,
    isLoading: isLoadingCompanyData,
  } = useCompanyList({
    options: {
      onSuccess: (data: CompanyList) => {
        pagination.setTotalItems(data.totalRow);
        const mappedCompanyData = data?.rows?.map((element: RowCompanyList) => {
              return {
                value: element.id,
                label: element.name,
              };
          });
          setListUomCategory(mappedCompanyData);
      },
    },
    query: {
      search: debounceFetch,
      page: pagination.page,
      limit: pagination.itemsPerPage,
    },
  });

  console.log(companyData, '<<<ini companyData')

//   const { mutate: createUom, isLoading: isLoadingCreateUom } = useCreateUOMConversion({
//     options: {
//       onSuccess: () => {
//         queryClient.invalidateQueries(["uom-list"]);
//         setShowDeleteModal(false);
//         router.back();
//       },
//     },
//   });


  const onSave = (data) => {
    console.log(data)
    const newCostCenter = {
        // profit_center_id :data?.profit_center_id, 
        // language :"EN-US",
        // currency :"IDR-Indonesia",
        company_id :data?.company_id,
        // code :data?.code,
        // name : data?.name,
        // cost_center_category : costCenterCategory,
        // valid_from : data?.valid_from? data?.valid_from : moment().format("DD/MM/YY"),
        // valid_to : data?.valid_to? data?.valid_to : moment().format("DD/MM/YY"),
        // external_code : data?.external_code,
        // description : description,
        // person_responsible :data?.person_responsible,
        // actual_primary_cost :newCostCenterTable[0].actual_primary_cost ? "YES" : "NO",
        // plant_primary_cost :newCostCenterTable[0].plant_primary_cost ? "YES" : "NO",
        // actual_secondary_cost :newCostCenterTable[0].actual_secondary_cost ? "YES" : "NO",
        // plant_secondary_cost :newCostCenterTable[0].plant_secondary_cost ? "YES" : "NO",
        // actual_revenues :newCostCenterTable[0].actual_revenues ? "YES" : "NO",
        // plant_revenues :newCostCenterTable[0].plant_revenues ? "YES" : "NO",
        // commitment_update :newCostCenterTable[0].commitment_update ? "YES" : "NO"
    }

    console.log(newCostCenter)
  }

  const columns = [
    {
      title: "Actual Primary Cost",
      dataIndex: "actual_primary_cost",
      key: 'actual_primary_cost',
      align:'center',
      render: (status:boolean, rowKey: any) => (
        <>
            <Checkbox checked={status} onChange={() => selectOneCheckbox(status, 'actual_primary_cost')}/>
        </>
      )
    },
    {
      title: "Plant Primary Cost",
      dataIndex: "plant_primary_cost",
      key: 'plant_primary_cost',
      align:'center',
      render: (status:boolean, rowKey: any) => (
        <>
            <Checkbox checked={status} onChange={() => selectOneCheckbox(status, 'plant_primary_cost')}/>
        </>
      )
    },
    {
      title: "Actual Secondary Cost",
      dataIndex: "actual_secondary_cost",
      key: 'actual_secondary_cost',
      align:'center',
      render: (status:boolean, rowKey: any) => (
        <>
            <Checkbox checked={status} onChange={() => selectOneCheckbox(status, 'actual_secondary_cost')}/>
        </>
      )
    },
    {
      title: "Plant Secondary Cost",
      dataIndex: "plant_secondary_cost",
      key: 'plant_secondary_cost',
      align:'center',
      render: (status:boolean, rowKey: any) => (
        <>
            <Checkbox checked={status} onChange={() => selectOneCheckbox(status, 'plant_secondary_cost')}/>
        </>
      )
    },
    {
      title: "Actual Revenues",
      dataIndex: "actual_revenues",
      key: 'actual_revenues',
      align:'center',
      render: (status:boolean, rowKey: any, column) => {
        return(
            <>
                <Checkbox checked={status} onChange={() => selectOneCheckbox(status, 'actual_revenues')}/>
            </>
          )
      }
    },
    {
      title: "Plant Revenues",
      dataIndex: "plant_revenues",
      key: 'plant_revenues',
      align:'center',
      render: (status:boolean, rowKey: any) => (
        <>
            <Checkbox checked={status} onChange={() => selectOneCheckbox(status, 'plant_revenues')}/>
        </>
      )
    },
    {
      title: "Comitment Update",
      dataIndex: "commitment_update",
      key: 'commitment_update',
      align:'center',
      render: (status:boolean, rowKey: any) => (
        <>
            <Checkbox checked={status} onChange={() => selectOneCheckbox(status, 'commitment_update')}/>
        </>
      )
    },
  ];

  const selectOneCheckbox = (checked: boolean, name: string) => {
    let newCheckbox = newCostCenterTable[0]
    switch (name) {
        case 'actual_primary_cost':
            newCheckbox.actual_primary_cost = !checked
            break;
        case 'plant_primary_cost':
            newCheckbox.plant_primary_cost = !checked
            break;
        case 'actual_secondary_cost':
            newCheckbox.actual_secondary_cost = !checked
            break;
        case 'plant_secondary_cost':
            newCheckbox.plant_secondary_cost = !checked
            break;
        case 'actual_revenues':
            newCheckbox.actual_revenues = !checked
            break;
        case 'plant_revenues':
            newCheckbox.plant_revenues = !checked
            break;
        case 'commitment_update':
            newCheckbox.commitment_update = !checked
            break;
    
        default:
            break;
    }
    setNewCostCenterTable([newCheckbox])
  }

  const selectAllCheckbox = () => {
    setCheckSelectAll(prev => !prev)
    if(checkSelectAll){
        setNewCostCenterTable([{
            actual_primary_cost: false,
            plant_primary_cost: false,
            actual_secondary_cost: false,
            plant_secondary_cost: false,
            actual_revenues: false,
            plant_revenues: false,
            commitment_update: false,
            }])
    } else{
        setNewCostCenterTable([{
            actual_primary_cost: true,
            plant_primary_cost: true,
            actual_secondary_cost: true,
            plant_secondary_cost: true,
            actual_revenues: true,
            plant_revenues: true,
            commitment_update: true,
            }])
    }
  }

  const handleCostCenterCategory = (costCenterValue : string) => {
    setCostCenterCategory(costCenterValue)
  }

  const handleDescription = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setDescription(e.target.value)
  }
  const setLanguageFromCompany = () => {
    setLanguageStatus(prev => !prev)
  }

  const setCurrencyFromCompany = () => {
    setCurrencyStatus(prev => !prev)
  }

  const disabledDate: RangePickerProps['disabledDate'] = current => {
    // Can not select days before today and today
    return current <= moment().startOf('day');
  };

  if (isLoadingCompanyData)
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
                {"Save"}
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
                        {...register("code", { required: "Please enter name." })}
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
                        {...register("name", { required: "Please enter name." })}
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
                    name="company_id"
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
                        isLoading={isFetchingCompanyData}
                        items={listUomCategory}
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
                        name="language"
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
                            isLoading={isFetchingCompanyData}
                            isLoadingMore={isFetchingMoreCompanyData}
                            fetchMore={() => {
                                if (hasNextPage) {
                                fetchNextPage();
                                }
                            }}
                            items={
                                isFetchingCompanyData && !isFetchingMoreCompanyData
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
                    name="profit_center_id"
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
                        isLoading={isFetchingCompanyData}
                        isLoadingMore={isFetchingMoreCompanyData}
                        fetchMore={() => {
                            if (hasNextPage) {
                            fetchNextPage();
                            }
                        }}
                        items={
                            isFetchingCompanyData && !isFetchingMoreCompanyData
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
                            name="currency"
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
                                isLoading={isFetchingCompanyData}
                                isLoadingMore={isFetchingMoreCompanyData}
                                fetchMore={() => {
                                    if (hasNextPage) {
                                    fetchNextPage();
                                    }
                                }}
                                items={
                                    isFetchingCompanyData && !isFetchingMoreCompanyData
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
                <Dropdown2
                  label="Cost Center Category"
                  height="48px"
                  width={"100%"}
                  handleChange={handleCostCenterCategory}
                  items={costCenterCategoryTable}
                  placeholder={"Select"}
                  noSearch
                //   {...register("costCenterCategory")}
                />
                </Col>

                <Spacer size={10} />

                <Col width="100%">
                <Input
                    width="100%"
                    label="Person Responsible"
                    height="48px"
                    // required
                    // defaultValue={" "}
                    placeholder={"e.g TBD"}
                    {...register("person_responsible")}
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
                        defaultValue={description}
                        // required
                        placeholder={"e.g New Cost Center"}
                        onChange={handleDescription}
                        />
                </Col>

                <Spacer size={10} />

                <Col width="100%">
                <Input
                    width="100%"
                    label="External Code"
                    height="54px"
                    // required
                    // defaultValue={" "}
                    placeholder={"e.g TBD"}
                    {...register("external_code")}
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
                <Checkbox checked={checkSelectAll} onChange={() => selectAllCheckbox()}/>
                <Text>Select All</Text>
              </div>

              <Spacer size={20} />

                <Col gap={"60px"}>
                    <Table
                    columns={columns}
                    data={newCostCenterTable}
                    bordered
                    rowKey={"id"}
                    />
                </Col>
          </Col>
        </Card>
      </Col>

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

export default CostCenterCreate;
