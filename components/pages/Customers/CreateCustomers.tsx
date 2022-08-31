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
import { useForm, useFieldArray } from 'react-hook-form'
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useRouter } from 'next/router';
import styled from 'styled-components'
import dynamic from 'next/dynamic'

const Contact = dynamic(() => import('./fragments/Contact'))
const Addresses = dynamic(() => import('./fragments/Addresses'))
const Sales = dynamic(() => import('./fragments/Sales'))
const Invoicing = dynamic(() => import('./fragments/Invoicing'))
const Purchasing = dynamic(() => import('./fragments/Purchasing'))
import UploadImage from './fragments/UploadImages'

import { defaultValuesCreate, addressBodyField, listTabItems, status } from './constants'
import { useCreateCustomers, useUploadLogo } from '../../../hooks/mdm/customers/useCustomersMDM';

export default function CreateCustomers({
  isUpdate,
  detailCustomer,
  getDataLanguages,
  getDataCustomerGroup,
  setSearchCustomerGroup,
  setSearchLanguages
}: any) {
  const router = useRouter();
  const [tabAktived, setTabAktived] = useState<string>('Contact')
  const [formType, setFormType] = useState<string>('Company')
  const [imageLogo, setImageLogo] = useState<string>('')
  const [isPKP, setIsPKP] = useState<boolean>(false)
  const [visible, setVisible] = useState<{
    contact: boolean,
    bank: boolean
  }>({
    contact: false,
    bank: false
  });
  const [modalChannelForm, setModalChannelForm] = useState<any>({
    data: {},
    typeForm: "create",
  });

  const listItemsCustomerGruop = getDataCustomerGroup?.rows?.map
    (({ id, name }: any) => { return { value: name, id }})

  const listItemsLanguages = getDataLanguages?.rows?.map
    (({ name, id }: any) => { return { value: name, id }});

  const isCompany: boolean = formType === 'Company'
  const _formType: string[] = ['Company', 'Individu']

  //use-forms customers
  const {
    control,
    handleSubmit,
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    shouldUseNativeValidation: true,
    defaultValues: isUpdate ? detailCustomer : defaultValuesCreate
  });

  //use-forms PURCHASINGS
  const { setValue: setValuePurchasing } = useForm({
    shouldUseNativeValidation: true,
  });

  //use-forms BANKS
  const {
    register: registerBankAccount,
    handleSubmit: handleSubmitBankAccount,
    formState: { errors: errorsBankAccount },
  } = useForm({
    shouldUseNativeValidation: true
  })

  //use-forms INVOICING
  const {
    setValue: setValueInvoicing,
    register: registerInvoicing,
    getValues: getValueInvoicing
  } = useForm({
    shouldUseNativeValidation: true,
    defaultValues: {
     invoicing: {
        credit_limit: 0,
        expense_account: "",
        credit_balance: 0,
        tax_name: "",
        credit_used: 0,
        income_account: "",
        tax_city: "",
        tax_address: "",
        currency: ""
     }
    }
  });

  //use-forms SALES
  const {
    setValue: setValueSales,
    getValues: getValuesSales,
  } = useForm({
    shouldUseNativeValidation: true,
    defaultValues: {
      sales: {
        branch: 0,
        salesman: 0,
        term_payment: "",
        billing_blocking: false,
        delivery_order_blocking: false,
        sales_order_blocking: false
      }
    }
  });

  //use-forms CONTACTS
  const {
    control: controlContact,
    handleSubmit: handleSubmitContact,
    register: registerContact,
    setValue: setValueContact,
    formState: { errors: { contact } },
  } = useForm({
    shouldUseNativeValidation: true
  })

  //useFieldArray ADDRESSES
  const {
    fields: fieldsAddress,
    append: appendAddress,
    replace: replaceAddress,
    remove: removeAddress,
  } = useFieldArray({
    control,
    name: "address",
  });

  // useFieldArray BANKS
  const {
    fields: fieldsBankAccount,
    append: appendBankAccount,
    remove: removeBankAccount,
    replace: replaceBankAccount,
  } = useFieldArray<any>({
    control,
    name: "bank"
  });

  // useFieldArray CONTACTS
  const {
    fields: fieldsContact,
    append: appendContact,
    remove: removeContact,
    replace: replaceContact,
  } = useFieldArray<any>({
    control,
    name: "contact"
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
    const { sales } = getValuesSales()
    const { invoicing } = getValueInvoicing()
  
    const result: any = { 
      customer: {
        active_status: 'ACTIVE',
        name: data?.name,
        is_company: isCompany,
        phone: data?.phone,
        tax_number: data?.tax_number,
        mobile: data?.mobile,
        ppkp: isPKP,
        website: data?.website,
        email: data?.email,
        language: data?.language,
        customer_group: data?.customer_group,
        external_code: data?.external_code,
        company_logo: imageLogo
      },
      sales,
      address: data?.address?.map((item: any) =>  {
        return {
          is_primary: item?.is_primary,
          address_type: item?.address_type,
          street: item?.street,
          country: 1,
          postal_code: item?.postal_code,
          longtitude: item?.longtitude,
          latitude: item?.latitude,
          lvl_1: item?.province,
          lvl_2: item?.city,
          lvl_3: item?.zone,
          lvl_4: item?.district,
        }
      }),
      purchasing: data?.purchasing,
      invoicing,
      bank: data?.bank?.map((item: any) => {
        return {
          bank_name: item?.bank_name,
          account_number: item?.account_number,
          account_name: item?.account_name
        }
      }),
      contact: data?.contact?.map((item: any) => item?.contact)
    }
    createCustomer(result)
  };

  const onHandleCreateContact = (data: any) => {
    appendContact({ ...data  })
    setVisible({ ...visible, contact: false })
  }

  const handleAddItemBankAccount = async (data: any) => {
    if (modalChannelForm?.typeForm === "Edit Bank Account") {
      let tempEdit: any = fieldsBankAccount.map((mapDataItem: any) => {
        if (mapDataItem?.id === modalChannelForm.data?.id) {
          mapDataItem?.bank_name = data?.bank_name;
          mapDataItem?.account_number = data?.account_number;
          mapDataItem?.account_name = data?.account_name;

          return { ...mapDataItem };
        } else {
          return mapDataItem;
        }
      });
      setVisible({ ...visible, bank: false })
      replaceBankAccount(tempEdit);
    } else {
      appendBankAccount({ ...data, key: fieldsBankAccount.length });
      setVisible({ ...visible, bank: false })
    }
  }

  const handleUploadCustomer = async (files: any) => {
    const formData: any = new FormData()
    await formData.append('image', files)

    return uploadCustomer(formData)
  }

  const propsContacts = {
    setValueContact: setValueContact,
    controlContact,
    registerContact,
    contact,
    onCreate: handleSubmitContact(onHandleCreateContact),
    visible: visible.contact,
    fieldsContact,
    setVisible: () => setVisible({ ...visible, contact: !visible.contact })
  }

  const propsAddresses = {
    control,
    register,
    fieldsAddress,
    appendAddress,
    replaceAddress,
    removeAddress,
    addressBodyField,
    getValues,
  }

  const propsInvoicing = {
    register: registerInvoicing,
    setValueInvoicing,
    onHandleEdit: (render: any) => {
      setVisible({ ...visible, bank: true })
      setModalChannelForm({
        typeForm: "Edit Bank Account",
        data: render,
      })
    },
    handleAddItemBankAccount,
    visible: visible.bank,
    errorsBankAccount, 
    setVisible: () => setVisible({ ...visible, bank: !visible.bank }),
    handleSubmitBankAccount, 
    registerBankAccount, 
    fieldsBankAccount, 
    appendBankAccount, 
    removeBankAccount, 
    replaceBankAccount, 
  }

  const switchTabItem = () => {
    switch (tabAktived) {
    case formType === 'Company' && 'Contact':
        return <Contact {...propsContacts} />
      case 'Addresses':
        return <Addresses {...propsAddresses} />
      case 'Sales':
        return <Sales setValueSales={setValueSales} />
      case 'Purchasing':
        return <Purchasing setValuePurchasing={setValuePurchasing} />
      case 'Invoicing':
        return <Invoicing {...propsInvoicing} />
      default:
        return null
    }
  }

  useEffect(() => {
    if(isUpdate && detailCustomer) {
      setIsPKP(detailCustomer?.ppkp)
    }
  }, [detailCustomer, isUpdate])

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
          <Dropdown
            width="185px"
            noSearch
            items={status}
            defaultValue="ACTIVE"
            handleChange={() => { }}
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
                    {...register('name', {
                      required: 'name must be filled'
                    })}
                  />
                  <Spacer size={10} />
                  <Input
                    width="100%"
                    label="Tax Number"
                    height="50px"
                    placeholder="e.g 123456789"
                    required
                    defaultValue={detailCustomer?.taxNumber}
                    type="number"
                    error={errors?.tax_number?.message}
                    {...register('tax_number', {
                      required: 'tax number must be filled'
                    })}
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
                    {...register('website', {
                      required: 'website must be filled'
                    })}
                  />
                  <Spacer size={10} />
                  <Dropdown
                    label="Language"
                    height="50px"
                    width="100%"
                    items={listItemsLanguages}
                    onSearch={(value: string) => setSearchLanguages(value)}
                    handleChange={(value: any) => {
                      setValue('language', value)
                    }}
                  />
                  <Spacer size={10} />
                  {
                    isCompany && <UploadImage handleUpload={handleUploadCustomer} control={control} />
                  }
                </Col>
                <Col width="50%">
                  <Input
                    width="100%"
                    label="Phone"
                    height="50px"
                    type="number"
                    defaultValue={detailCustomer?.phone}
                    error={errors?.phone?.message}
                    placeholder="e.g 021 123456"
                    {...register('phone', {
                      required: 'phone must be filled'
                    })}
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
                    {...register('mobile', {
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
                    error={errors?.email?.message}
                    placeholder={"e.g admin@kasni.co.id"}
                    {...register('email', {
                      required: 'email must be filled'
                    })}
                  />
                  <Spacer size={10} />
                  <Dropdown
                    label="Customer Group"
                    height="50px"
                    width="100%" 
                    isLoading
                    items={listItemsCustomerGruop}
                    handleChange={(value: any) => {
                      setValue('customer_group', value)
                    }}
                    onSearch={(value: string) => setSearchCustomerGroup(value)}
                />
                  <Spacer size={10} />
                  <Input
                    width="100%"
                    label="External Code"
                    height="50px"
                    type="number"
                    defaultValue={detailCustomer?.external_code}
                    error={errors?.external_code?.message}
                    placeholder={"e.g 123456"}
                    {...register('external_code', {
                      required: 'external code must be filled'
                    })}
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