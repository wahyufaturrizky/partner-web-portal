import React, { useState } from 'react'
import {
  Button,
  Col,
  Input,
  Row,
  Tabs,
  Spacer,
  Text,
  Dropdown,
  FileUploaderAllFiles,
  Accordion,
} from "pink-lava-ui";
import { useRouter } from 'next/router';
import { Controller, useForm, Control } from 'react-hook-form'
import styled from 'styled-components'

import {
  Sales,
  Addresses,
  Contact,
  Invoicing,
  Purchasing
} from './fragments'


type FormValues = {
  profile_picture: string;
};

export default function CreateCustomers() {
  const router = useRouter();
  const [tabAktived, setTabAktived] = useState('Contact')


  const {
    register,
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

  const switchTabItem = () => {
    switch (tabAktived) {
      case 'Contact':
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
        return <Contact />
    }
  }

  const onSubmit = (data: any) => {};

  return (
    <div>
      <Col>
        <Text variant={"h4"}>Create Customer</Text>
        <Spacer size={20} />
      </Col>
      <Card>
        <Row justifyContent="space-between" alignItems="center" nowrap>
          <Dropdown
            label=""
            width="185px"
            noSearch
            items={[
              { id: "ACTIVE", value: "Active" },
              { id: "INACTIVE", value: "Inactive" },
            ]}
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
                  <UploadImage
                    control={control}
                  />
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
                listTabPane={listTabItems}
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


const UploadImage = ({ control }: { control: Control<FormValues> }) => {
  return (
    //  <div>
    //   <Label>Company Logo</Label>
    //   <CardUploader>
    //     <div className={styles['image-uploader']}>
    //       <PicturePlaceholder />
    //     </div>
    //     <Spacer size={10} />
    //     <div className={styles['description-uploader']}>
    //       <p className={styles['rules-dimension']}>Dimension Minimum 72 x 72, Optimal size 300 x 300</p>
    //       <p className={styles['rules-size']}>File Size Max. 1MB</p>
    //       <Spacer size={5} />
    //       <Button type="primary" size="small">
    //         Upload
    //       </Button>
    //     </div>
    //   </CardUploader>
    // </div>
    <Controller
      control={control}
      rules={{ required: true }}
      name="profile_picture"
      render={({ field: { onChange } }) => (
        <FileUploaderAllFiles
          label="Company Logo"
          onSubmit={(file: any) => onChange(file)}
          defaultFile="/icons/placeholder-employee-photo.svg"
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


const CardUploader = styled.div`
  display: flex;
  align-items: top;
`

const Label = styled.p`
  font-weight: bold;
  line-height: 14px;
  font-size: 16px;
  margin: 0 0 10px 0;
`

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
`;