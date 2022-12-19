import React, { useState, useMemo, useEffect } from "react";
import { Text, Col, Row, Spacer, Button, Input, EmptyState, Modal ,Spin,Dropdown,DatePickerInput} from "pink-lava-ui";
import styled from "styled-components";
import { useRouter } from "next/router";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useCompanyList } from "hooks/company-list/useCompany";
import { useCreateProfitCenter, useUpdateProfitCenter } from "hooks/mdm/profit-center/useProfitCenter";
import moment from "moment";
import { defaultValuesCreate } from "components/pages/ProfitCenter/contants";
import _ from 'lodash';
import { toSnakeCase } from "lib/caseConverter";
import { queryClient } from "pages/_app";
import ArrowLeft from "../../assets/icons/arrow-left.svg";

function ProfitCenterCreate({isUpdate,detailProfitCenter,isLoadingProfit,isFetchingProfit} :any) {

  const router = useRouter();
  const companyId = localStorage.getItem("companyId")
  const companyCode = localStorage.getItem("companyCode")  
  const [validFromValue, setValidFromValue] = useState<any>(null);
  const [validToValue, setValidToValue] = useState<any>(null);
  const {
    control,
    handleSubmit,
    register,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    shouldUseNativeValidation: true,
    defaultValues: isUpdate ? detailProfitCenter : defaultValuesCreate
  });
  useEffect(() => {
    if (isUpdate && detailProfitCenter) {      
        mapDataDetail();
    }else{
      setValidFromValue(defaultValuesCreate.valid_from)
      setValidToValue(defaultValuesCreate.valid_to)
    }
  },[detailProfitCenter,isUpdate]);

  const mapDataDetail = () => {
      const dataDetail = toSnakeCase(detailProfitCenter);
      Object.keys(dataDetail).forEach(key => {
        if (key == 'valid_from') {
          setValidFromValue(moment(dataDetail[key]));
        }else if(key == 'valid_to'){
          setValidToValue(moment(dataDetail[key]));
        }
          setValue(key, dataDetail[key]);
      })
      return dataDetail
  }
  const [searchCompany, setSearchCompany] = useState();
  const { data: companyData, isLoading: isLoadingCompanyList } = useCompanyList({
    options: {
      onSuccess: (data :any) => {},
    },
    query: {
      search: searchCompany,
      limit: 10000
    },
  });
  const companyList = companyData?.rows?.map((company: any) => ({
    id: company.code,
    value: company.name,
  }));
  const profitForm = useWatch({
    control
  });
  
  // functional react-query
  const { mutate: createProfitCenter } = useCreateProfitCenter({
    options: {
      onSuccess: () => {
        router.back();
        queryClient.invalidateQueries(["profit-list"]);
      }
    }
  })

  const { mutate: updateProfitCenter } = useUpdateProfitCenter({
    options: {
      onSuccess: () => {
        router.back();
        queryClient.invalidateQueries(["profit-list"]);
      }
    },
    id:detailProfitCenter?.profitCenterId,
    companyId: detailProfitCenter?.companyId
  })

  // action function
  const onSubmit = (data: any) => {
    let payload:any = _.pick(data,[
      'code',
      'name',
      'valid_from',
      'valid_to',
      'company_id',
      'external_code',
      'description',
      'person_responsible'
    ])
      payload.code = data.code,
      payload.name = data.name,
      payload.valid_from = typeof data?.valid_from === "string" ? data.valid_from : moment(data.valid_from).utc().format('DD/MM/YYYY').toString(),
      payload.valid_to = typeof data?.valid_to === "string" ? data.valid_to : moment(data.valid_to).utc().format('DD/MM/YYYY').toString(),
      payload.company_id = data.company_id,
      payload.external_code = data.external_code,
      payload.description = data.description,
      payload.person_responsible = data.person_responsible
    
    if (isUpdate && detailProfitCenter) {
      delete payload.company_id;
      updateProfitCenter(payload);
    }else{      
      createProfitCenter(payload);
    }
  };

    if (isLoadingProfit || isFetchingProfit)
    return (
      <Center>
        <Spin tip="Loading data..." />
      </Center>
    );
  return (
    <>
      <Col>
        <Row gap="4px" alignItems={"center"}>
          {isUpdate ? <ArrowLeft style={{ cursor: "pointer" }} onClick={() => router.back()} /> : null}
          <Text variant={"h4"}>{isUpdate ? profitForm?.name : "Create Profit Center"}</Text>
        </Row>

        <Spacer size={20} />

        <Card>
          <Row justifyContent="flex-end" alignItems="center" nowrap>
            <Row gap="16px">
              <Button size="big" variant={"tertiary"} onClick={() => router.back()}>
                Cancel
              </Button>
              <Button size="big" variant={"primary"} onClick={handleSubmit(onSubmit)}>
                Save
              </Button>
            </Row>
          </Row>
        </Card>

        <Spacer size={10} />
        <Card>
            <Row width="100%" gap="14px" noWrap>
              <Col width={"100%"}>
                <Input
                  type="text"
                  width="100%"
                  label="Profit Center Code"
                  height="48px"
                  required
                  placeholder="e.g D01G011001"
                  defaultValue={profitForm?.code}
                  error={errors?.code?.message}
                  {...register('code', {
                    required: 'Profit center code must be filled'
                  })}
                />
              </Col>

              <Col width={"100%"}>
                <Input
                  type="text"
                  width="100%"
                  label="Profit Center Name"
                  height="48px"
                  placeholder="e.g Jakarta Barat"
                  defaultValue={profitForm?.name}
                  error={errors?.name?.message}
                  {...register('name', {
                    required: 'Profit center name must be filled'
                  })}
                />
              </Col>
            </Row>
            <Spacer size={10} />
            <Row width="100%" gap="14px" noWrap>
              <Col width={"100%"}>
                <Controller
                  control={control}
                  name={`valid_from`}
                  rules={{ required: 'Valid to must be filled' }}

                  render={({ field: { onChange ,value} }) => {
                    return(
                      <DatePickerInput
                        fullWidth
                        onChange={(date: any, dateString: any) => {
                          setValidFromValue(date);
                          setValue('valid_from',dateString)
                        }}
                        label={`Valid From`}
                        defaultValue={moment(profitForm.valid_from)}
                        value={validFromValue}
                        format={'DD/MM/YYYY'}
                        error={errors?.valid_from?.message}
                      />
                    )
                  }}
                />
              </Col>

              <Col width={"100%"}>

                <Controller
                  control={control}
                  name={`valid_to`}
                  rules={{ required: 'Valid to must be filled' }}
                  render={({ field: { onChange ,value} }) => (
                    <DatePickerInput
                      fullWidth
                      onChange={(date: any, dateString: any) => {
                        setValidToValue(date);
                        setValue('valid_to',dateString)
                      }}
                      label={`Valid To`}
                      defaultValue={moment(profitForm.valid_to)}
                      format={'DD/MM/YYYY'}
                      value={validToValue}
                      error={errors?.valid_to?.message}
                    />
                  )}
                />
              </Col>
            </Row>
            <Spacer size={10} />
            <Row width="100%" gap="14px" noWrap>
              <Col width={"100%"}>
                {isLoadingCompanyList ? (
                    <Spin tip="Loading data..." />
                  ) : (
                    <Dropdown
                      label="Company"
                      width={"100%"}
                      items={companyList}
                      placeholder={"Select"}
                      handleChange={(value :any) => {
                        setValue("company_id", value);
                      }}
                      onSearch={(search :any) => setSearchCompany(search)}
                      defaultValue={profitForm.company_id}
                      error={errors?.company_id?.message}
                      {...register("company_id",{
                        required: 'Company must be filled'
                      })}
                    />
                  )}
              </Col>

              <Col width={"100%"}>
                <Input
                  type="Text"
                  width="100%"
                  label="External Code"
                  height="48px"
                  required
                  placeholder={"e.g 123456789"}
                  defaultValue={profitForm.external_code}
                  error={errors?.external_code?.message}
                  {...register("external_code",{
                    required: 'External Code must be filled'
                  })}
                />
              </Col>
            </Row>
            <Spacer size={10} />
            <Row width="100%" gap="14px" noWrap>
              <Col width={"100%"}>
                <Input
                  type="texarea"
                  width="100%"
                  label="Description"
                  height="48px"
                  required
                  placeholder={"e.g New Profit Center"}
                  defaultValue={profitForm?.description}
                  error={errors?.description?.message}
                  {...register('description', {
                    required: 'Description must be filled'
                  })}
                />
              </Col>

              <Col width={"100%"}>
                <Input
                  type="text"
                  width="100%"
                  label="Person Responsible"
                  height="48px"
                  required
                  placeholder={"e.g TBD"}
                  defaultValue={profitForm?.person_responsible}
                  error={errors?.person_responsible?.message}
                  {...register('person_responsible', {
                    required: 'Person Responsible must be filled'
                  })}
                />
              </Col>
            </Row>
        </Card>
      </Col>
    </>
  )
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

export default ProfitCenterCreate