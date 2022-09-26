import React, { useEffect, useState } from 'react'
import {
  Button,
  Col,
  Input,
  Row,
  Tabs,
  Spacer,
  Dropdown,
  Text,
  Accordion,
  Radio,
  Switch
} from "pink-lava-ui";
import { useForm, Controller } from 'react-hook-form'
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useRouter } from 'next/router';
import styled from 'styled-components'

import UploadImage from './fragments/UploadImages'
import { listTabItems, status } from './constants'
import { useCreateCustomers, useUploadLogo } from 'hooks/mdm/customers/useCustomersMDM';
import Sales from './fragments/Sales';

export default function CreateCustomers({
  detailCustomer,
  getDataLanguages,
  getDataCustomerGroup,
  setSearchCustomerGroup,
  setSearchLanguages,
}: any) {
  const router = useRouter();
  const [tabAktived, setTabAktived] = useState<string>('Contact')
  const [formType, setFormType] = useState<string>('Company')
  const [imageLogo, setImageLogo] = useState<string>('')
  const [isPKP, setIsPKP] = useState<boolean>(false)

  const listItemsCustomerGruop = getDataCustomerGroup?.rows?.map
    (({ id, name }: any) => { return { value: name, id }})

  const listItemsLanguages = getDataLanguages?.rows?.map
    (({ name, id }: any) => { return { value: name, id }});

  const isCompany: boolean = formType === 'Company'
  const _formType: string[] = ['Company', 'Individu']

  //use-forms customers / global
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    shouldUseNativeValidation: true
  });

  // functional react-query
  const { mutate: createCustomer } = useCreateCustomers({
    options: {
      onSuccess: () => alert('create success!')
    }
  })

  const { mutate: uploadCustomer } = useUploadLogo({
    options: {
      onSuccess: ({ imageUrl }: { imageUrl: string }) => {
        setImageLogo(imageUrl)
      }
    }
  })
  
  // action function
  const onSubmit = (data: any) => {
    const payloads = {
      customer: {
        ...data.customer,
        company_logo: imageLogo,
        is_company: isCompany,
        ppkp: isPKP,
      },
      sales: {
        ...data.sales
      }
    }
  };

  const handleUploadCustomer = async (files: any) => {
    const formData: any = new FormData()
    await formData.append('image', files)

    return uploadCustomer(formData)
  }

  // switch elements detail information
  const switchTabItem = () => {
    switch (tabAktived) {
      case formType === 'Company' && 'Contact':
      case 'Addresses':
      case 'Sales':
      case 'Purchasing':
      case 'Invoicing':
      default:
        return <Sales control={control} />
    }
  }
  return (
    <div>
      <FlexElement>
        <Label>Create Customer</Label>
          {
            _formType.map((item) => (
              <FlexElement key={item}>
                <Radio
                  value={item}
                  defaultValue="Company"
                  checked={item === formType}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFormType(e.target.value)
                    item === 'Individu' && setTabAktived('Addresses')
                  }}
                /> {item}
                <Spacer size={20} />
              </FlexElement>
            ))
          }
      </FlexElement>
      <Spacer size={20} />
      <Card>
        <Row justifyContent="space-between" alignItems="center" nowrap>
          <Controller
            control={control}
            name="customer.active_status"
            defaultValue="ACTIVE"
            render={({ field: { onChange, value }}) => (
              <>
                <Dropdown
                  width="185px"
                  noSearch
                  items={status}
                  value={value}
                  handleChange={onChange}
                />
              </>
            )}
          />
          <Row gap="16px">
            <Button
              size="big"
              variant="tertiary"
              onClick={() => router.back()}>
              Cancel
            </Button>
            <Button
              size="big"
              variant="primary"
              onClick={handleSubmit(onSubmit)}
            >
              Save
            </Button>
          </Row>
        </Row>
      </Card>

      <Spacer size={20} />

      <Card>
        <Accordion>
          <Accordion.Item key={1}>
            <Accordion.Header variant="blue">General</Accordion.Header>
            <Accordion.Body>
              <Row width="100%" gap="12px">
                <Col width="48%">
                  <Input
                    style={{ marginBotton: '1rem' }}
                    width="100%"
                    label="Name"
                    height="50px"
                    defaultValue={detailCustomer?.name}
                    placeholder="e.g PT. Kaldu Sari Nabati Indonesia"
                    required
                    error={errors?.name?.message}
                    {...register('customer.name', {
                      required: 'name must be filled'
                    })}
                  />
                  <Spacer size={10} />
                  <Input
                    width="100%"
                    label="Tax Number"
                    height="50px"
                    placeholder="e.g 123456789"
                    defaultValue={detailCustomer?.taxNumber}
                    type="number"
                    {...register('customer.tax_number')}
                  />
                  <FlexElement>
                    <Spacer size={5} />
                    <Text>PKP?</Text>
                    <ExclamationCircleOutlined />
                    <Spacer size={10} />
                    <Switch
                      defaultChecked={isPKP}
                      checked={isPKP}
                      onChange={(value: boolean) => setIsPKP(value)}
                    />
                  </FlexElement>
                  <Spacer size={10} />
                  <Input
                    width="100%"
                    label="Website"
                    height="50px"
                    defaultValue={detailCustomer?.website}
                    placeholder={"e.g ksni.com"}
                    error={errors?.website?.message}
                    required
                    {...register('customer.website')}
                  />
                  <Spacer size={10} />
                  <Controller
                    control={control}
                    name="customer.language"
                    render={({ field: { onChange } }) => (
                      <>
                        <Dropdown
                          label="Language"
                          height="50px"
                          width="100%"
                          items={listItemsLanguages}
                          onSearch={(value: string) => setSearchLanguages(value)}
                          handleChange={onChange}
                        />
                      </>
                    )}
                  />
                  <Spacer size={10} />
                  {
                    isCompany &&
                    <UploadImage handleUpload={handleUploadCustomer} control={control} />
                  }
                </Col>
                <Col width="50%">
                  <Input
                    width="100%"
                    label="Phone"
                    height="50px"
                    type="number"
                    defaultValue={detailCustomer?.phone}
                    placeholder="e.g 021 123456"
                    {...register('customer.phone')}
                  />
                  <Spacer size={10} />
                  <Input
                    width="100%"
                    label="Mobile"
                    height="50px"
                    defaultValue={detailCustomer?.mobile}
                    type="number"
                    error={errors?.mobile?.message}
                    placeholder="e.g 081234567891011"
                    {...register('customer.mobile', {
                      required: 'mobile must be filled'
                    })}
                  />
                  <Spacer size={10} />
                  <Input
                    width="100%"
                    label="Email"
                    height="50px"
                    type="email"
                    defaultValue={detailCustomer?.email}
                    placeholder={"e.g admin@kasni.co.id"}
                    {...register('customer.email')}
                  />
                  <Spacer size={10} />
                  <Controller
                    control={control}
                    name="customer.customer_group"
                    render={({ field: { onChange }}) => (
                      <>
                        <Dropdown
                          label="Customer Group"
                          height="50px"
                          width="100%"
                          isLoading
                          items={listItemsCustomerGruop}
                          handleChange={onChange}
                          onSearch={(value: string) => setSearchCustomerGroup(value)}
                        />
                      </>
                    )}
                  />
                  <Spacer size={10} />
                  <Input
                    width="100%"
                    label="External Code"
                    height="50px"
                    type="number"
                    defaultValue={detailCustomer?.externalCode}
                    placeholder={"e.g 123456"}
                    {...register('customer.external_code')}
                  />
                </Col>
              </Row>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Card>
      <Spacer size={20} />
      <Card>
        <Accordion>
          <Accordion.Item key={1}>
            <Accordion.Header variant="blue">Detail Information</Accordion.Header>
            <Accordion.Body>
              <Tabs
                defaultActiveKey={tabAktived}
                listTabPane={isCompany ? listTabItems : listTabItems.slice(1, listTabItems.length)}
                onChange={(e: any) => setTabAktived(e)}
              />
              <Spacer size={20} />
              {switchTabItem()}
              <Spacer size={100} />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Card>
    </div>
  )
}

const Label = styled.p`
  font-size: 30px;
  font-weight: 600;
  line-height: 14px;
  margin: 0;
  margin-right: 1rem;
`

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
`;

const FlexElement = styled.div`
  display: flex;
  align-items: center;
`