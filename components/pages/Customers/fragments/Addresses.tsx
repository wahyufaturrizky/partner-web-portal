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

import { ICCheckPrimary, IconAdd } from "assets";

export default function Addresses(props: any) {
  const {} = props

  const handleAddMoreAddresss = () => {}

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
      <div>
        <FormContact />
        <Spacer size={30} />
        <hr />
        <Spacer size={30} />
      </div>
    </div>
  )
}

const FormContact = ({}: any) => {

  const setAsPrimary = () => {}
  
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
    { id: "Home", value: "Home" },
    { id: "Office", value: "Office" },
    { id: "Apartment", value: "Apartment" },
    { id: "School", value: "School" },
  ]

  return (
    <>
      <Controller
        name={`address.is_primary`}
        render={() => <ButtonSetFormsPrimary />}
      />
      <Spacer size={30} />
      <Row gap="20px" width="100%">
        <Col width="48%">
          <Controller
            name={`address.address_type`}
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
            name={`address.country`}
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
            name={`address.city`}
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
            name={`address.zone`}
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
            // {...register(`address.${index}.longtitude`, {
            //   required: 'longtitude must be filled'
            // })}
          />
          <Spacer size={30} />
          {/* <UploadImage control={control} index={index} /> */}
        </Col>
        <Col width="48%">
          <Input
            width="100%"
            height="48px"
            placeholder="e.g Front Groceries No. 5"
            label="Street"
            required
            // {...register(`address.${index}.street`, {
            //   required: 'street must be filled'
            // })}
          />
          <Spacer size={10} />
          <Controller
            name={`address.province`}
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
            name={`address.district`}
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
            name={`address.postal_code`}
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
            // {...register(`address.${index}.latitude`, {
            //   required: 'latitude must be filled'
            // })}
          />
        </Col>
      </Row>
    </>
  )
}

const ButtonSetFormsPrimary = ({
}: any) => {
  // const isDeleteAktifed: boolean = fieldsAddress?.length > 1
  return (
    <>
      <Text color="blue.dark" variant="headingMedium">
        {/* {getValues(`address.${index}.is_primary`)
          ? "Home"
          : "New Address"} */}
      </Text>
      <Row gap="12px" alignItems="center">
        {/* {(index === 0 && fieldsAddress.length < 2) || getValues(`address.${index}.is_primary`)
          ? (
            <Lozenge variant="blue">
              <Row alignItems="center">
                <ICCheckPrimary />
                Primary
              </Row>
            </Lozenge>
          )
          : (
            <Text
              clickable
              color="pink.regular"
              onClick={setAsPrimary}>
              Set as Primary
            </Text>
          )
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
        } */}
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


