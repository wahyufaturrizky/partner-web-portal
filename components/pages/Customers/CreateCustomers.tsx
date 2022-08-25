import React, { useState } from 'react'
import {
  Button,
  Col,
  Input,
  Row,
  Tabs,
  Spacer,
  Dropdown,
  FileUploaderAllFiles,
  Accordion,
  Radio
} from "pink-lava-ui";
import { Controller, useForm, Control } from 'react-hook-form'
import { useRouter } from 'next/router';

import {
  Sales,
  Addresses,
  Contact,
  Invoicing,
  Purchasing
} from './fragments'
import styled from 'styled-components'

type FormValues = {
  profile_picture: string;
};

export default function CreateCustomers() {
  const router = useRouter();
  const [tabAktived, setTabAktived] = useState('Contact')
  const [formType, setFormType] = useState('Company')
  const isCompany = formType === 'Company'

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm <FormValues>({ shouldUseNativeValidation: true });

  const listTabItems = [
    { title: "Contact" },
    { title: "Addresses" },
    { title: "Sales" },
    { title: "Purchasing" },
    { title: "Invoicing" },
  ];

  const switchTabItem = (type: string) => {
    switch (tabAktived) {
      case type === 'Company' && 'Contact':
        return <Contact />
      case 'Addresses':
        return <Addresses />
      case 'Sales':
        return <Sales />
      case 'Purchasing':
        return <Purchasing />
      case 'Invoicing':
        return <Invoicing />
      default:
        return null
    }
  }

  const status = [
    { id: "ACTIVE", value: "Active" },
    { id: "INACTIVE", value: "Inactive" },
  ]

  const _formType = ['Company', 'Individu']

  const onSubmit = (data: any) => {};

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
              onClick={handleSubmit(onSubmit)}>
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
                    style={{marginBotton: '1rem'}}
                    width="100%"
                    label="Name"
                    height="50px"
                    placeholder={"e.g PT. Kaldu Sari Nabati Indonesia"}
                  />
                  <Spacer size={10} />
                  <Input
                    width="100%"
                    label="Tax Number"
                    height="50px"
                    placeholder={"e.g 123456789"}
                  />
                  <Spacer size={10} />
                  <Input
                    width="100%"
                    label="Website"
                    height="50px"
                    placeholder={"e.g ksni.com"}
                  />
                  <Spacer size={10} />
                  <Input
                    width="100%"
                    label="Language"
                    height="50px"
                    placeholder={"e.g gram"}
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
                    placeholder={"e.g 021 123456"}
                  />
                  <Spacer size={10} />
                  <Input
                    width="100%"
                    label="Mobile"
                    height="50px"
                    placeholder={"e.g 081234567891011"}
                  />
                  <Spacer size={10} />
                  <Input
                    width="100%"
                    label="Email"
                    height="50px"
                    placeholder={"e.g admin@kasni.co.id"}
                  />
                  <Spacer size={10} />
                  <Input
                    width="100%"
                    label="Customer Group"
                    height="50px"
                    placeholder={"e.g gram"}
                  />
                  <Spacer size={10} />
                  <Input
                    width="100%"
                    label="External Code"
                    height="50px"
                    placeholder={"e.g 123456"}
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
              {switchTabItem(formType)}
              <Spacer size={100} />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Card>
    </div>
  )
}

const UploadImage = ({ control }: { control: Control<FormValues> }) => {
  return (
    <Controller
      control={control}
      rules={{ required: true }}
      name="profile_picture"
      render={({ field: { onChange } }) => (
        <FileUploaderAllFiles
          label="Company Logo"
          onSubmit={(file: any) => onChange(file)}
          defaultFile="/placeholder-employee-photo.svg"
          withCrop
          sizeImagePhoto="125px"
          removeable
          textPhoto={[
            "Dimension Minimum 72 x 72, Optimal size 300 x 300",
            "File Size Max. 1MB",
          ]}
        />
      )}
    ></Controller>
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