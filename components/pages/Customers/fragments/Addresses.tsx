import React from 'react'
import { Controller } from 'react-hook-form'
import {
  Button,
  Col,
  Input,
  Row,
  Spacer,
  Dropdown,
  Lozenge,
  Text,
  FileUploaderAllFiles
} from "pink-lava-ui";

import { ICCheckPrimary } from "../../../../assets";
import IconAdd from '../../../../assets/icons/ICAdd'

export default function Addresses(props: any) {
  const {
    getValues,
    fieldsAddress,
    appendAddress,
    replaceAddress,
    removeAddress,
    control,
    register,
    addressBodyField,
  } = props

  const propsFieldForm = {
    getValues,
    control,
    fieldsAddress,
    replaceAddress,
    removeAddress,
    register,
  }

  const handleAddMoreAddresss = () => {
    appendAddress({
      ...addressBodyField,
      key: fieldsAddress?.length
    })
  }

  return (
    <div>
      <Button
        size="big"
        variant="primary"
        onClick={handleAddMoreAddresss}
      >
        <IconAdd />
        Add More Address
      </Button>
      <Spacer size={20} />
      {
        fieldsAddress.map((field: any, index: number | string) =>
        <div key={index}>
          <FormContact index={index} {...propsFieldForm} />
          <Spacer size={30} />
          <hr />
          <Spacer size={30} />
        </div>
        )
      }
    </div>
  )
}

const FormContact = ({
  control,
  index,
  getValues,
  fieldsAddress,
  replaceAddress,
  removeAddress,
  register,
}: any) => {

  const setAsPrimary = () => {
    let editAsPrimary = fieldsAddress?.map((items: any) => {
      if (items?.key === index) {
        items.is_primary = true;
        return { ...items };
      } else {
        items.is_primary = false;
        return { ...items };
      }
    });
    replaceAddress(editAsPrimary);
  }

  const propsButtonSetPrimary = {
    getValues,
    index,
    removeAddress,
    fieldsAddress,
    setAsPrimary: () => setAsPrimary()
  }
  
  const listFakeCountres = [
    { id: 1, value: 'Indonesia' },
    { id: 2, value: 'Japan' },
    { id: 3, value: 'Malaysia' },
    { id: 4, value: 'Singepore' },
  ]


  const listFakePostalCode = [
    { id: 'POSTAL-1', value: 'Example - postal code - 1' },
    { id: 'POSTAL-2', value: 'Example - postal code - 2' },
    { id: 'POSTAL-3', value: 'Example - postal code - 3' },
    { id: 'POSTAL-4', value: 'Example - postal code - 4' },
  ]

  const listFakeProvince = [
    { id: 1, value: 'Lampung' },
    { id: 2, value: 'Jawa Barat' },
    { id: 3, value: 'Jawa Tengah' },
    { id: 4, value: 'DKI Timur' },
  ]

  const listFakeAddressType = [
    { id: 'TYPE-1', value: 'Type 1' },
    { id: 'TYPE-2', value: 'Type 3' },
    { id: 'TYPE-3', value: 'Type 3' },
    { id: 'TYPE-4', value: 'Type 4' },
  ]


  return (
    <>
      <Controller
        control={control}
        name={`address.${index}.is_primary`}
        render={() => <ButtonSetFormsPrimary {...propsButtonSetPrimary} />}
      />
      <Spacer size={30} />
      <Row gap="20px" width="100%">
        <Col width="48%">
          <Controller
            control={control}
            name={`address.${index}.address_type`}
            rules={{ required: "Please enter address type." }}
            render={({ field: { onChange }, fieldState: { error } }) => (
              <Dropdown
                label="Address Type"
                width="100%"
                noSearch
                error={error?.message}
                items={listFakeAddressType}
                handleChange={(value: string) => onChange(value)}
              />
            )}
          />

          <Spacer size={10} />
          <Controller
            control={control}
            name={`address.${index}.country`}
            rules={{ required: "Please enter country." }}
            render={({ field: { onChange }, fieldState: { error } }) => (
              <Dropdown
                label="Country"
                width="100%"
                noSearch
                error={error?.message}
                items={listFakeCountres}
                handleChange={(value: string) => onChange(value)}
              />
            )} />
          <Spacer size={10} />
          <Controller
            control={control}
            name={`address.${index}.city`}
            rules={{ required: "Please enter city." }}
            render={({ field: { onChange }, fieldState: { error } }) => (
              <Dropdown
                label="City"
                width="100%"
                noSearch
                error={error?.message}
                items={listFakeCountres}
                handleChange={(value: string) => onChange(value)}
              />
            )} />
          <Spacer size={10} />
          <Controller
            control={control}
            name={`address.${index}.zone`}
            rules={{ required: "Please enter zone." }}
            render={({ field: { onChange }, fieldState: { error } }) => (
              <Dropdown
                label="Zone"
                width="100%"
                noSearch
                error={error?.message}
                items={listFakeCountres}
                handleChange={(value: string) => onChange(value)}
              />
            )} />
          <Spacer size={10} />
          <Input
            height="48px"
            placeholder="e.g 1421.31231.1231"
            label="Longitude"
            width="100%"
            noSearch
            required
            {...register(`address.${index}.longtitude`, {
              required: 'longtitude must be filled'
            })}
          />
          <Spacer size={30} />
          <UploadImage control={control} index={index} />
        </Col>
        <Col width="48%">
          <Input
            width="100%"
            height="48px"
            placeholder="e.g Front Groceries No. 5"
            label="Street"
            required
            {...register(`address.${index}.street`, {
              required: 'street must be filled'
            })}
          />
          <Spacer size={10} />
          <Controller
            control={control}
            name={`address.${index}.province`}
            rules={{ required: "Please enter province." }}
            render={({ field: { onChange }, fieldState: { error } }) => (
              <Dropdown
                label="Province"
                width="100%"
                noSearch
                error={error?.message}
                items={listFakeProvince}
                handleChange={(value: string) => onChange(value)}
              />
            )} />
          <Spacer size={10} />
          <Controller
            rules={{ required: "Please enter district" }}
            control={control}
            name={`address.${index}.district`}
            render={({ field: { onChange }, fieldState: { error } }) => (
              <Dropdown
                label="District"
                width="100%"
                noSearch
                error={error?.message}
                items={listFakeCountres}
                handleChange={(value: string) => onChange(value)}
              />
            )} />
          <Spacer size={10} />
          <Controller
            rules={{ required: "Please enter postal code." }}
            control={control}
            name={`address.${index}.postal_code`}
            render={({ field: { onChange }, fieldState: { error } }) => (
              <Dropdown
                label="Postal Code"
                width="100%"
                noSearch
                items={listFakePostalCode}
                error={error?.message}
                handleChange={(value: string) => onChange(value)}
              />
            )} />
          <Spacer size={10} />
          <Input
            height="48px"
            placeholder="e.g 1421.31231.1231"
            label="Latitude"
            width="100%"
            {...register(`address.${index}.latitude`, {
              required: 'latitude must be filled'
            })}
          />
        </Col>
      </Row>
    </>
  )
}

const ButtonSetFormsPrimary = ({
  getValues,
  index,
  setAsPrimary,
  removeAddress,
  fieldsAddress,
}: any) => {
  const isDeleteAktifed: boolean = fieldsAddress?.length > 1
  return (
    <>
      <Text color="blue.dark" variant="headingMedium">
        {getValues(`address.${index}.is_primary`)
          ? "Home"
          : "New Address"}
      </Text>
      <Row gap="12px" alignItems="center">
        {getValues(`address.${index}.is_primary`)
          ? <Lozenge variant="blue">
            <Row alignItems="center">
              <ICCheckPrimary />
              Primary
            </Row>
          </Lozenge>
          : <Text
            clickable
            color="pink.regular"
            onClick={setAsPrimary}>
            Set as Primary
          </Text>
        }
        {
          isDeleteAktifed && (
            <> |
              <div style={{ cursor: "pointer" }}>
                <Text color="pink.regular" onClick={() => removeAddress(index)}>
                  Delete
                </Text>
              </div>
            </>
          )
        }
      </Row>
    </>
  )
}

const UploadImage = ({ control, index }:
  { index: number, control: any }) => {
  return (
    <Controller
      control={control}
      name={`address.${index}.logo_store`}
      render={({ field: { onChange } }) => (
        <FileUploaderAllFiles
          label="Store photo"
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


