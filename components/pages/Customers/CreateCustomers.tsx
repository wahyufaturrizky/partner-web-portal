import React, { useState } from 'react'
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

import {
  Sales,
  Addresses,
  Contact,
  Invoicing,
  Purchasing,
  UploadImage
} from './fragments'
import { useCreateCustomers } from '../../../hooks/mdm/customers/useCustomersMDM';


export default function CreateCustomers({ isUpdate }: any) {
  const router = useRouter();
  const [tabAktived, setTabAktived] = useState<string>('Contact')
  const [formType, setFormType] = useState<string>('Company')
  const [isPKP, setIsPKP] = useState<boolean>(false)
  const [visible, setVisible] = useState<{
    contact: boolean,
    bank: boolean
  }>({
    contact: false,
    bank: false
  });
  const [modalChannelForm, setModalChannelForm] = useState({
    data: {},
    typeForm: "create",
  });
  const [search, setSearch] = useState<{
    languages: string
    branch: string
    contact: string
  }>({
    languages: '',
    branch: '',
    contact: ''
  })

  const isCompany: boolean = formType === 'Company'
  const _formType: string[] = ['Company', 'Individu']
  const listTabItems: { title: string }[] = [
    { title: "Contact" },
    { title: "Addresses" },
    { title: "Sales" },
    { title: "Purchasing" },
    { title: "Invoicing" },
  ];
  const status: { id: string, value: string }[] = [
    { id: "ACTIVE", value: "Active" },
    { id: "INACTIVE", value: "Inactive" },
  ]

  const addressBodyField = {
    primary: false,
    address_type: "",
    street: "",
    country: "",
    province: "",
    city: "",
    district: "",
    zone: "",
    postal_code: "",
    longtitude: "",
    latitude: "",
    key: 0,
  };

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
    defaultValues: {
      name:'',
      is_company: true,
      phone:'',
      tax_number:'',
      mobile:'',
      ppkp:false,
      website:'',
      email:'',
      language:'',
      customer_group:'',
      external_code:'',
      company_code:'',
      bank: [],
      address: [addressBodyField],
    }
  });

  //use-forms PURCHASING
  const {
    handleSubmit: handleSubmitPurchasing,
    setValue: setValuePurchasing,
    getValues: getValuesPurchasing
  } = useForm({
    shouldUseNativeValidation: true,
  });

  //use-forms BANK
  const {
    register: registerBankAccount,
    handleSubmit: handleSubmitBankAccount,
    formState: { errors: errorsBankAccount },
  } = useForm({
    shouldUseNativeValidation: true
  })

  //use-forms INVOICING
  const {
    handleSubmit: handleSubmitInvoicing,
    setValue: setValueInvoicing,
    register: registerInvoicing,
    getValues: getValuesInvoicing,
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
    handleSubmit: handleSubmitSales,
    setValue: setValueSales,
    getValues: getValuesSales,
  } = useForm({
    shouldUseNativeValidation: true,
    defaultValues: {
      sales: {
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
    formState: { errors: contact },
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

  // useFieldArray BANK
  const {
    fields: fieldsBankAccount,
    append: appendBankAccount,
    remove: removeBankAccount,
    replace: replaceBankAccount,
  } = useFieldArray({
    control,
    name: "bank"
  });

  const { mutate: createCustomer } = useCreateCustomers({
    options: {
      onSuccess: () => alert('create success!')
    }
  })
  
  // action function
  const onSubmit = (data: any) => {
    const { invoicing } = getValuesInvoicing()
    const { purchasing } = getValuesPurchasing()
    const { sales } = getValuesSales()

    const result = { ...data, ...invoicing, purchasing, sales }
  };

  const onHandleCreateContact = (data: any) => { }

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

  const propsContacts = {
    setValueContact: setValueContact,
    control: controlContact,
    register: registerContact,
    contact: contact,
    onCreate: handleSubmitContact(onHandleCreateContact),
    visible: visible.contact,
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
    setVisible: () => setVisible({ ...visible, bank: !visible.bank }),
    errorsBankAccount, 
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
                    isShowActionLabel
                    items={[
                      { id: 'indonesia', value: 'Indonesia' },
                      { id: 'malaysia', value: 'Malaysia' },
                      { id: 'Thailand', value: 'Thailand' },
                    ]}
                    handleClickActionLabel={() => { }}
                    handleChange={(value: any) => {
                      setValue('language', value)
                    }}
                  />
                  <Spacer size={10} />
                  {
                    isCompany && <UploadImage control={control} />
                  }
                </Col>
                <Col width="50%">
                  <Input
                    width="100%"
                    label="Phone"
                    height="50px"
                    type="number"
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
                    isShowActionLabel
                    items={[
                      { id: 'indonesia', value: 'Indonesia' },
                      { id: 'malaysia', value: 'Malaysia' },
                      { id: 'Thailand', value: 'Thailand' },
                    ]}
                    handleClickActionLabel={() => { }}
                    handleChange={(value: any) => {
                      setValue('customer_group', value)
                    }}
                />
                  <Spacer size={10} />
                  <Input
                    width="100%"
                    label="External Code"
                    height="50px"
                    type="number"
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