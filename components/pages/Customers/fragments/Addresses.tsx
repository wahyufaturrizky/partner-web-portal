import React, { useState } from 'react'
import {
  Button,
  Col,
  Input,
  Row,
  Spacer,
  Dropdown,
  Checkbox,
  Text,
  TextArea,
  FileUploaderAllFiles
} from "pink-lava-ui";
import styled from 'styled-components'
import { Controller, useForm, Control } from 'react-hook-form'

import IconAdd from '../../../../assets/icons/ICAdd'

type FormValues = {
  store_picture: string;
};

interface PropsFormContact {
  isPrimary: boolean;
  label: number;
  onChangeChecked: () => void;
  control: Control<FormValues>
}

export default function Addresses() {
  const [isPrimary, setIsPrimary] = useState(false)
  const { control } = useForm<FormValues>({ shouldUseNativeValidation: true });
  const [addContact, setAddContact] = useState([0])

  return (
    <div>
      <Button
        size="big"
        variant="primary"
        onClick={() => setAddContact([...addContact, addContact[0] + 1])}>
        <IconAdd /> Add More Address
      </Button>
      <Spacer size={20} />
      {
        addContact.map((item, index) =>
          <>
            <FormContact
              label={index + 1}
              key={item}
              isPrimary={isPrimary}
              control={control}
              onChangeChecked={() => setIsPrimary(!isPrimary)}
            />
            <Spacer size={30} />
            {addContact.length > 1 && <hr />}
            <Spacer size={30} />
          </>
        )
      }
    </div>
  )
}

const FormContact = ({
  label,
  isPrimary,
  onChangeChecked,
  control
}: PropsFormContact) => {
  return (
    <>
      <ElementFlex>
        <LabelChekbox>Address {label}</LabelChekbox>
        <Row alignItems="center">
          <Checkbox checked={isPrimary} onChange={onChangeChecked} />
          <div style={{ cursor: "pointer" }} onClick={() => { }}>
            <Text>Primary</Text>
          </div>
        </Row>
      </ElementFlex>
      <Spacer size={30} />
      <Row gap="20px" width="100%">
        <Col width="48%">
          <Dropdown label="Address Type" width="100%" />
          <Spacer size={10} />
          <Dropdown label="Country" width="100%" />
          <Spacer size={10} />
          <Dropdown label="City" width="100%" />
          <Spacer size={10} />
          <Dropdown label="Zone" width="100%" />
          <Spacer size={10} />
          <Input
            height="48px"
            placeholder="e.g 1421.31231.1231"
            label="Longitude"
            width="100%"
          />
          <Spacer size={30} />
          <UploadImage control={control} />
        </Col>
        <Col width="48%">
          <TextArea
            width="100%"
            rows={1}
            height="10px"
            placeholder="e.g Front Groceries No. 5"
            label={<Label>Street</Label>}
            onChange={() => { }}
            defaultValue={['']}
          />
          <Spacer size={10} />
          <Dropdown label="Province" width="100%" />
          <Spacer size={10} />
          <Dropdown label="District" width="100%" />
          <Spacer size={10} />
          <Dropdown label="Postal Code" width="100%" />
          <Spacer size={10} />
          <Input
            height="48px"
            placeholder="e.g 1421.31231.1231"
            label="Latitude"
            width="100%"
          />
        </Col>
      </Row>
    </>
  )
}

const UploadImage = ({ control }: { control: Control<FormValues> }) => {
  return (
    <Controller
      control={control}
      rules={{ required: true }}
      name="store_picture"
      render={({ field: { onChange } }) => (
        <FileUploaderAllFiles
          label="Company Logo"
          onSubmit={(file: any) => onChange(file)}
          defaultFile="/placeholder-employee-photo.svg"
          withCrop
          sizeImagePhoto="125px"
          removeable
          textPhoto={[
            "Dimension Minimum Size 300 x 300",
            "File Size Max. 1MB",
          ]}
        />
      )}
    ></Controller>
  )
}

const LabelChekbox = styled.p`
  margin: 0;
  font-weight: 600;
  font-size: 20px;
  line-height: 27px;
  color: #1E858E;
`

const ElementFlex = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`

const Label = styled.p`
  font-weight: bold;
  line-height: 14px;
  font-size: 16px;
  margin: 0 0 10px 0;
`
