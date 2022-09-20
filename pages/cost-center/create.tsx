import React, { useState } from "react";
import {
  Text,
  Col,
  Row,
  Spacer,
  Dropdown2,
  Button,
  TextArea,
  Input,
  Table,
  Switch,
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
import ArrowLeft from "../../assets/icons/arrow-left.svg";
import usePagination from "@lucasmogari/react-pagination";

import { useCompanyList, useCurrenciesMDM } from "hooks/company-list/useCompany";
import { useProfitCenters } from "hooks/mdm/profit-center/useProfitCenter";
import { useLanguages } from "hooks/languages/useLanguages";
import { useCreateCostCenter } from "hooks/mdm/cost-center";


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

export interface ProfitCenterList {
    rows:     RowProfitCenter[];
    totalRow: number;
    sortBy:   string[];
}

export interface RowProfitCenter {
    companyId:         string;
    profitCenterId:    string;
    code:              string;
    name:              string;
    validFrom:         Date;
    validTo:           Date;
    externalCode:      string;
    description:       string;
    personResponsible: string;
    createdAt:         Date;
    createdBy:         number;
    modifiedAt:        Date;
    modifiedBy:        number | null;
    deletedBy:         null;
    deletedAt:         null;
}

export interface CurrenciesData {
    rows:     RowCurrenciesData[];
    totalRow: number;
    sortBy:   string[];
}

export interface RowCurrenciesData {
    id:           string;
    currency:     string;
    currencyName: string;
    createdAt:    Date;
    createdBy:    number;
    modifiedAt:   Date;
    modifiedBy:   number | null;
    deletedBy:    null;
    deletedAt:    null;
}

export interface LanguagesData {
    rows:     RowLanguagesData[];
    totalRow: number;
    sortBy:   string[];
}

export interface RowLanguagesData {
    id:         string;
    name:       string;
    createdBy:  number;
    createdAt:  Date;
    modifiedBy: null;
    modifiedAt: null;
    deletedBy:  null;
    deletedAt:  null;
}

export interface CostCenterSave { 
    language: string; 
    currency: string; 
    profit_center_id: string; 
    company_id: string; 
    code: string; 
    name: string; 
    valid_from: string; 
    valid_to: string; 
    external_code: string; 
    person_responsible: string; 
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
  const [listProfitCenter, setListProfitCenter] = useState([])
  const [listCurrencies, setListCurrencies] = useState([])
  const [listLanguages, setListLanguages] = useState([])

  const [searchCompany, setSearchCompany] = useState("");
  const [searchProfitCenter, setSearchProfitCenter] = useState("");
  const [searchLanguage, setSearchLanguage] = useState("");
  const [searchCurrency, setSearchCurrency] = useState("");
  
  const debounceFetchCompany = useDebounce(searchCompany, 1000);
  const debounceFetchProfitCenter = useDebounce(searchProfitCenter, 1000);
  const debounceFetchLanguage = useDebounce(searchLanguage, 1000);
  const debounceFetchCurrency = useDebounce(searchCurrency, 1000);

  const [languageStatus, setLanguageStatus] = useState(true)
  const [currencyStatus, setCurrencyStatus] = useState(true)
  const [checkSelectAll, setCheckSelectAll] = useState(false)
  const [description, setDescription] = useState("")
  const [costCenterCategory, setCostCenterCategory] = useState("")
  


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
  
  const {
        data: companyData,
        refetch: isFetchingMoreCompanyData,
        isFetching: isFetchingCompanyData,
        isLoading: isLoadingCompanyData,
    } = useCompanyList({
        options: {
        onSuccess: (data: CompanyList) => {
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
        search: debounceFetchCompany,
        page: pagination.page,
        limit: pagination.itemsPerPage,
        },
    });

  const {
        data: profitCenterData,
        refetch: isFetchingMoreProfitCenterData,
        isFetching: isFetchingProfitCenterData,
        isLoading: isLoadingProfitCenterData,
    } = useProfitCenters({
        options: {
        onSuccess: (data: ProfitCenterList) => {
            const mappedProfitCenterData = data?.rows?.map((element: RowProfitCenter) => {
                return {
                    value: element.profitCenterId,
                    label: element.name,
                };
            });
            setListProfitCenter(mappedProfitCenterData);
        },
        },
        query: {
        search: debounceFetchProfitCenter,
        page: pagination.page,
        limit: pagination.itemsPerPage,
        },
    });

  const {
        data: languagesData,
        refetch: isFetchingMoreLanguagesData,
        isFetching: isFetchingLanguagesData,
        isLoading: isLoadingLanguagesData,
    } = useLanguages({
        options: {
        onSuccess: (data: LanguagesData) => {
            console.log(data, 'languagedata')
            const mappedLanguagesData = data?.rows?.map((element: RowLanguagesData) => {
                return {
                    value: element.id,
                    label: element.id,
                };
            });
            setListLanguages(mappedLanguagesData)
        },
        },
        query: {
        search: debounceFetchLanguage,
        page: pagination.page,
        limit: pagination.itemsPerPage,
        },
    });

  const {
        data: currenciesData,
        refetch: isFetchingMoreCurrenciesData,
        isFetching: isFetchingCurrenciesData,
        isLoading: isLoadingCurrenciesData,
    } = useCurrenciesMDM({
        options: {
        onSuccess: (data: CurrenciesData) => {
            console.log(data, 'currencyData')
            const mappedCurrenciesData = data?.rows?.map((element: RowCurrenciesData) => {
                return {
                    value: element.currency + '-' + element.currencyName,
                    label: element.currency + '-' + element.currencyName,
                };
            });
            setListCurrencies(mappedCurrenciesData)
        },
        },
        query: {
        search: debounceFetchCurrency,
        page: pagination.page,
        limit: pagination.itemsPerPage,
        },
    });

  const { mutate: createCostCenter, isLoading: isLoadingCreateCostCenter } = useCreateCostCenter({
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries(["uom-list"]);
        router.back();
      },
    },
  });


  const onSave = (data: CostCenterSave) => {
    const newCostCenter = {
        language : data?.language,
        currency : data?.currency,
        profit_center_id :data?.profit_center_id, 
        company_id :data?.company_id.toString(),
        code :data?.code,
        name : data?.name,
        cost_center_category : costCenterCategory,
        valid_from : data?.valid_from? data?.valid_from : moment().format("DD/MM/YYYY"),
        valid_to : data?.valid_to? data?.valid_to : moment().format("DD/MM/YYYY"),
        external_code : data?.external_code,
        description : description,
        person_responsible :data?.person_responsible,
        actual_primary_cost :newCostCenterTable[0].actual_primary_cost ? "YES" : "NO",
        plant_primary_cost :newCostCenterTable[0].plant_primary_cost ? "YES" : "NO",
        actual_secondary_cost :newCostCenterTable[0].actual_secondary_cost ? "YES" : "NO",
        plant_secondary_cost :newCostCenterTable[0].plant_secondary_cost ? "YES" : "NO",
        actual_revenues :newCostCenterTable[0].actual_revenues ? "YES" : "NO",
        plant_revenues :newCostCenterTable[0].plant_revenues ? "YES" : "NO",
        commitment_update :newCostCenterTable[0].commitment_update ? "YES" : "NO"
    }
    createCostCenter(newCostCenter)
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

  const disabledDate: RangePickerProps['disabledDate'] = (current: number) => {
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
                {isLoadingCreateCostCenter? "Loading..." : "Save"}
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
                        height="48px"
                        required
                        placeholder={"e.g 0131930111"}
                        {...register("code", { required: "Please enter name." })}
                    />
                </Col>

                <Spacer size={10} />

                <Col width="100%">
                    <Input
                        width="100%"
                        label="Cost Center Name"
                        height="48px"
                        required
                        placeholder={"e.g Dept IT"}
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
                            setSearchCompany(value);
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
                    }}>
                        <Text>Refer To Company?</Text>
                        <Switch checked={languageStatus} onChange={() => setLanguageFromCompany()}/>
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
                            <Spacer size={3} />
                            <FormSelect
                            style={{ width: "100%" }}
                            size={"large"}
                            required
                            placeholder={"Select"}
                            borderColor={"#AAAAAA"}
                            arrowColor={"#000"}
                            withSearch
                            isLoading={isFetchingLanguagesData}
                            items={
                                isFetchingLanguagesData && !isFetchingMoreLanguagesData
                                ? []
                                : listLanguages
                            }
                            onChange={(value: any) => {
                                onChange(value);
                            }}
                            onSearch={(value: any) => {
                                setSearchLanguage(value);
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
                        size={"large"}
                        required
                        placeholder={"Select"}
                        borderColor={"#AAAAAA"}
                        arrowColor={"#000"}
                        withSearch
                        isLoading={isLoadingProfitCenterData}
                        items={
                            isFetchingProfitCenterData && !isFetchingMoreProfitCenterData
                            ? []
                            : listProfitCenter
                        }
                        onChange={(value: any) => {
                            onChange(value);
                        }}
                        onSearch={(value: any) => {
                            setSearchProfitCenter(value);
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
                    }}>
                        <Text>Refer To Company?</Text>
                        <Switch checked={currencyStatus} onChange={() => setCurrencyFromCompany()}/>

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
                                isLoading={isFetchingCurrenciesData}
                                items={
                                    isFetchingCurrenciesData && !isFetchingMoreCurrenciesData
                                    ? []
                                    : listCurrencies
                                }
                                onChange={(value: any) => {
                                    onChange(value);
                                }}
                                onSearch={(value: any) => {
                                    setSearchCurrency(value);
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
                />
                </Col>

                <Spacer size={10} />

                <Col width="100%">
                <Input
                    width="100%"
                    label="Person Responsible"
                    height="48px"
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
                    placeholder={"e.g 321001112"}
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
