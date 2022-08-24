import React, { useState } from 'react'
import {
  Button,
  Col,
  Input,
  Row,
  Spacer,
  Dropdown,
  Lozenge,
  Text,
  TextArea,
  FileUploaderAllFiles
} from "pink-lava-ui";
import styled from 'styled-components'

import { ICCheckPrimary } from "../../../../assets";
import IconAdd from '../../../../assets/icons/ICAdd'

import {
  Controller,
  useForm,
  Control,
  useFieldArray
} from 'react-hook-form'

interface FormContacts {
  detailInformation: {
    addresess: {
      is_primary_address: boolean;
      address_type: string;
      street: string;
      country: string;
      province: string;
      city: string;
      district: string;
      zone: string;
      postal_code: string;
      longitude: string;
      store_picture: string
      latitude: string;
      key: number;
    }[];
  };
}

export default function Addresses() {

  const addressBodyField = {
    is_primary_address: false,
    address_type: "",
    street: "",
    country: "",
    province: "",
    city: "",
    district: "",
    zone: "",
    postal_code: "",
    longitude: "",
    latitude: "",
    key: 0,
  };

  const { 
    register,
    control,
    handleSubmit,
    formState: { errors },
    getValues,
   } = useForm({
    shouldUseNativeValidation: true,
     defaultValues: {
       detailInformation: {
         addresess: [addressBodyField],
       },
     }
  });


  const {
    fields: fieldsAddresess,
    append: appendAddresess,
    replace: replaceAddresess,
    remove: removeAddresess,
  } = useFieldArray({
    control,
    name: "detailInformation.addresess",
  });

  const propsFieldForm = {
    getValues: getValues,
    control: control,
    fieldsAddresess: fieldsAddresess,
    replaceAddresess: replaceAddresess,
    removeAddresess: removeAddresess,
  }

  return (
    <div>
      <Button
        size="big"
        variant="primary"
        onClick={() =>
          appendAddresess({
            ...addressBodyField,
            key: fieldsAddresess.length
          })}>
        <IconAdd /> Add More Address
      </Button>
      <Spacer size={20} />
      {
        fieldsAddresess.map((_, index) =>
          <>
            <FormContact
              key={index}
              index={index}
              {...propsFieldForm}
            />
            <Spacer size={30} />
          </>
        )
      }
    </div>
  )
}

const FormContact = ({
  control,
  index,
  getValues,
  fieldsAddresess,
  replaceAddresess,
  removeAddresess
}: any) => {
  return (
    <>
      <Controller
        control={control}
        name={`detailInformation.addresess.${index}.is_primary_address`}
        render={({ field: { } }) => (
          <>
            <Text color={"blue.dark"} variant={"headingMedium"}>
              {getValues(`detailInformation.addresess.${index}.is_primary_address`)
                ? "Home"
                : "New Address"}
            </Text>
            <Row gap="12px" alignItems="center">
              {getValues(
                `detailInformation.addresess.${index}.is_primary_address`
              ) ? (
                <Lozenge variant="blue">
                  <Row alignItems="center">
                    <ICCheckPrimary />
                    Primary
                  </Row>
                </Lozenge>
              ) : (
                <Text
                  clickable
                  color="pink.regular"
                  onClick={() => {
                    let tempEdit = fieldsAddresess.map((mapDataItem: any) => {
                      if (mapDataItem.key === index) {
                        mapDataItem.is_primary_address = true;

                        return { ...mapDataItem };
                      } else {
                        mapDataItem.is_primary_address = false;
                        return { ...mapDataItem };
                      }
                    });
                    replaceAddresess(tempEdit);
                  }}
                >
                  Set as Primary
                </Text>
              )}
              |
              <div style={{ cursor: "pointer" }}>
                <Text color="pink.regular" onClick={() => removeAddresess(index)}>
                  Delete
                </Text>
              </div>
            </Row>
          </>
        )}
      />
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
          <UploadImage control={control} index={index} />
        </Col>
        <Col width="48%">
          <TextArea
            width="100%"
            height="48px"
            placeholder="e.g Front Groceries No. 5"
            label="Street"
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

const UploadImage = ({ control, index }: { index: number, control: Control<FormContacts> }) => {
  return (
    <Controller
      control={control}
      rules={{ required: true }}
      name={`detailInformation.addresess.${index}.is_primary_address`}
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

const DescriptionPrimary = styled.p`
  color: #1E858E;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 75px;
  height: 24px;
  background: #D5FAFD;
`

const ElementFlex = styled.div`
  display: flex;
  color: #EB008B;
  align-items: center;
  gap: 5px;
`

const Label = styled.p`
  font-weight: bold;
  line-height: 14px;
  font-size: 16px;
  margin: 0 0 10px 0;
`
