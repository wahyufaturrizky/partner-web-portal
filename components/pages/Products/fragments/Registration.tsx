import React from 'react'
import { Controller } from 'react-hook-form'
import {
  Button,
  Col,
  Input,
  Row,
  Spacer,
  Text,
  DatePickerInput
} from "pink-lava-ui";

import styled from 'styled-components';

export default function Registration(props: any) {
  const {
    fieldsRegistration,
    appendRegistration,
    removeRegistration,
    control,
    register,
    registration,
    registrationBodyField,
  } = props

  const propsFieldForm = {
    control,
    removeRegistration,
    register,
    registration
  }

  const handleAddMoreRegistrations = () => {
    appendRegistration({
      ...registrationBodyField,
      key: fieldsRegistration?.length
    })
  }

  return (
    <div>
      <Text variant="headingMedium" color="blue.darker">Registration</Text>
      <Spacer size={14} />
      <Button
        size="big"
        variant="primary"
        onClick={handleAddMoreRegistrations}
      >
        Add New Registration
      </Button>
      <Spacer size={20} />
      {
        fieldsRegistration.map((field: any, index: number | string) =>
        <React.Fragment key={index}>
          <FormContact key={index} index={index} {...propsFieldForm} />
          <Spacer size={30} />
          <Divider />
          <Spacer size={30} />
        </React.Fragment>
        )
      }
    </div>
  )
}

const FormContact = ({
  control,
  index,
  removeRegistration,
  register,
}: any) => {

  const propsButtonSetPrimary = {
    index,
    removeRegistration,
  }

  return (
    <>
      <ButtonSetFormsPrimary {...propsButtonSetPrimary} />
      <Spacer size={20} />
      <Row width="100%" noWrap>
         <Input
            height="48px"
            placeholder="e.g 1421.31231.1231"
            label={`Registration Number Type ${index+1}`}
            width="100%"
            required
            {...register(`registration.${index}.number_type`, {
              required: 'registration number type must be filled'
            })}
          />
          <Spacer size={20} />
          <Input
            height="48px"
            placeholder="e.g 1421.31231.1231"
            label={`Registration Number`}
            width="100%"
            required
            {...register(`registration.${index}.number`, {
              required: 'registration number must be filled'
            })}
          />
      </Row>

      <Spacer size={20} />

      <Row width="100%" noWrap>
        <Col width="100%">
          <Controller
            control={control}
            name={`registration.${index}.valid_from`}
            render={({ field: { onChange } }) => (
              <DatePickerInput
                fullWidth
                onChange={(date: any, dateString: any) => onChange(dateString)}
                label="Valid From"
              />
            )}
          />
        </Col>
        <Spacer size={20} />
        <Col width="100%">
          <Controller
            control={control}
            name={`registration.${index}.valid_to`}
            render={({ field: { onChange } }) => (
              <DatePickerInput
                fullWidth
                onChange={(date: any, dateString: any) => onChange(dateString)}
                label="Valid To"
              />
            )}
          />
        </Col>
      </Row>
    </>
  )
}

const ButtonSetFormsPrimary = ({
  index,
  removeRegistration,
}: any) => {
  return (
    <>
      <Row gap="12px" alignItems="center">
        <Text
          clickable
          variant="subtitle2"
          color="blue.dark"
        >
          Registration {index+1}
        </Text>
        |
        <div style={{ cursor: "pointer" }}>
          <Text color="pink.regular" onClick={() => removeRegistration(index)}>
            Delete
          </Text>
        </div>
      </Row>
    </>
  )
}

const Divider = styled.div`
	border: 1px dashed #dddddd;
`;
