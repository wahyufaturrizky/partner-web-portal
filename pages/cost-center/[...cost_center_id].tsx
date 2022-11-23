import React, { useState } from "react";
import {
  Text,
  Col,
  Row,
  Spacer,
  Dropdown,
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

import { useCompany, useCompanyList, useCurrenciesMDM } from "hooks/company-list/useCompany";
import { useProfitCenters } from "hooks/mdm/profit-center/useProfitCenter";
import { useLanguages } from "hooks/languages/useLanguages";
import { useCostCenter, useCreateCostCenter, useUpdateCostCenter } from "hooks/mdm/cost-center/useCostCenter";
import { CompanyList, CostCenterSave, CurrenciesData, LanguagesData, ProfitCenterList, RowCompanyList, RowCurrenciesData, RowLanguagesData, RowProfitCenter } from "./cost_center_interface";
import { colors } from "utils/color";


const costCenterCategoryDropdown = [
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

const CostCenterCreate = () => {
  const router = useRouter();
  const companyId = localStorage.getItem("companyId")
  const companyCode = localStorage.getItem("companyCode")
  const { cost_center_id } = router.query;
  const pagination = usePagination({
    page: 1,
    itemsPerPage: 20,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
  });

  const [listCompany, setlistCompany] = useState<any[]>([]);
  const [listProfitCenter, setListProfitCenter] = useState([])
  const [listCurrencies, setListCurrencies] = useState([])
  const [listLanguages, setListLanguages] = useState([])
  const [newCostCenterTable, setNewCostCenterTable] = useState([{
    actual_primary_cost: false,
    plant_primary_cost: false,
    actual_secondary_cost: false,
    plant_secondary_cost: false,
    actual_revenues: false,
    plant_revenues: false,
    commitment_update: false,
  }])
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
  
  const { register, control, handleSubmit,formState: { errors }, } = useForm();
  

  const {
    data: costCenterData,
    isLoading: isLoadingCostCenter,
    isFetching: isFetchingCostCenter,
  } = useCostCenter({
    id: cost_center_id && cost_center_id[1],
    companyId: cost_center_id && cost_center_id[0],
    query: {},
    options: {
      onSuccess: (data: any) => {
        setDescription(data?.description)
        setCostCenterCategory(data?.costCenterCategory)
        setNewCostCenterTable([{
          actual_primary_cost: data?.actualPrimaryCost === 'YES'? true : false,
          plant_primary_cost: data?.plantPrimaryCost === 'YES'? true : false,
          actual_secondary_cost: data?.actualSecondaryCost === 'YES'? true : false,
          plant_secondary_cost: data?.plantSecondaryCost === 'YES'? true : false,
          actual_revenues: data?.actualRevenues === 'YES'? true : false,
          plant_revenues: data?.plantRevenues === 'YES'? true : false,
          commitment_update: data?.commitmentUpdate === 'YES'? true : false,
          }])
      },
      select: (data: any) => {
        return data
      },
    },
  });

    const {
      data: companyData,
      refetch: isFetchingMoreCompanyData,
      isFetching: isFetchingCompanyData,
      isLoading: isLoadingCompanyData,
  } = useCompany({
      id: companyCode,
      options: {
      onSuccess: (data: CompanyList) => {
          setlistCompany([{
            value: data.code,
            label: data.name,
            language: data.language,
            currency: data.currency
          }])
      },
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
                    label: element.code + '-' + element.name,
                };
            });
            setListProfitCenter(mappedProfitCenterData);
        },
        },
        query: {
        search: debounceFetchProfitCenter,
        page: pagination.page,
        limit: pagination.itemsPerPage,
        company_id: companyCode
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
            const mappedCurrenciesData = data?.rows?.map((element: RowCurrenciesData) => {
                return {
                    value: element.id,
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

  const { mutate: updateCostCenter, isLoading: isLoadingCreateCostCenter } = useUpdateCostCenter({
    id: cost_center_id && cost_center_id[1],
    companyId: cost_center_id && cost_center_id[0],
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries(["cost-centers"]);
        router.back();
      },
    },
  });


  const onSave = (data: CostCenterSave) => {
    const newCostCenter = {
        language : languageStatus? costCenterData?.language : data?.language ? data?.language : costCenterData?.language,
        currency : currencyStatus? costCenterData?.currency : data?.currency ? data?.currency : costCenterData?.currency,
        profit_center_id :data?.profit_center_id ? data?.profit_center_id : costCenterData?.profitCenterId, 
        company_id : data?.company_id? data?.company_id?.toString() : costCenterData?.companyId,
        code :data?.code,
        name : data?.name ? data?.name : costCenterData?.name,
        cost_center_category : costCenterCategory,
        valid_from : data?.valid_from? data?.valid_from : moment(costCenterData?.validFrom).utc().format('DD/MM/YYYY'),
        valid_to : data?.valid_to? data?.valid_to : moment(costCenterData?.validTo).utc().format('DD/MM/YYYY'),
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
    updateCostCenter(newCostCenter)
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
    return current <= moment().startOf('day');
  };

  if ( isLoadingCostCenter || isFetchingCostCenter || isFetchingProfitCenterData )
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
                        defaultValue={costCenterData?.code}
                        required
                        placeholder={"e.g 0131930111"}
                        {...register("code", { required: 'Profit center code must be filled' })}
                        error={errors?.code?.message}
                    />
                </Col>

                <Spacer size={10} />

                <Col width="100%">
                    <Input
                        width="100%"
                        label="Cost Center Name"
                        height="48px"
                        defaultValue={costCenterData?.name}
                        required
                        placeholder={"e.g Dept IT"}
                        {...register("name", { required: "Profit center name must be filled" })}
                        error={errors?.name?.message}
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
                        defaultValue={moment(costCenterData?.validFrom)} 
                        format={'DD/MM/YYYY'}
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
                        defaultValue={moment(costCenterData?.validTo)} 
                        format={'DD/MM/YYYY'}
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
                    defaultValue={listCompany[0]?.value}
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
                        disabled
                        defaultValue={listCompany[0]?.label}
                        isLoading={isFetchingCompanyData}
                        items={listCompany}
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
                            defaultValue={costCenterData?.language}
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
                    rules={{
                      required: {
                        value: true,
                        message: "Please enter profit center.",
                      },
                    }}
                    defaultValue={costCenterData.profitCenterId}
                    render={({ field: { onChange }, fieldState: { error } }) => (
                    <>
                        <Label>
                          Profit Center <span style={{ color: colors.red.regular }}>*</span>
                        </Label>
                        <Spacer size={3} />
                        <FormSelect
                        error={error?.message}
                        style={{ width: "100%" }}
                        size={"large"}
                        required
                        placeholder={"Select"}
                        borderColor={"#AAAAAA"}
                        arrowColor={"#000"}
                        withSearch
                        defaultValue={listProfitCenter.filter(profitCenter => profitCenter.value === costCenterData?.profitCenterId)[0]?.label}
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
                                defaultValue={costCenterData?.currency}
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
                {/* <Dropdown
                  label="Cost Center Category"
                  height="48px"
                  width={"100%"}
                  defaultValue={costCenterData?.costCenterCategory}
                  handleChange={handleCostCenterCategory}
                  items={costCenterCategoryDropdown}
                  placeholder={"Select"}
                  noSearch
                /> */}
                <Controller
                  control={control}
                  name="cost_center_category"
                  rules={{
                    required: {
                      value: true,
                      message: "Please enter title.",
                    },
                  }}
                  defaultValue={costCenterData?.costCenterCategory}
                  render={({ field: { onChange }, fieldState: { error } }) => (
                    <Dropdown
                      defaultValue={costCenterData?.costCenterCategory}
                      error={error?.message}
                      label="Cost Center Category"
                      required
                      height="48px"
                      width={"100%"}
                      handleChange={(value: any) => {
                        onChange(value);
                      }}
                      items={costCenterCategoryDropdown}
                      placeholder={"Select"}
                      noSearch
                    />
                  )}
                />
                </Col>

                <Spacer size={10} />

                <Col width="100%">
                <Input
                    width="100%"
                    label="Person Responsible"
                    height="48px"
                    defaultValue={costCenterData?.personResponsible}
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
                    defaultValue={costCenterData?.externalCode}
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
