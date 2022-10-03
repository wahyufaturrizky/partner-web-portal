import React, { useEffect, useState } from "react";

import { Col, Spacer, Input, Button, Row, Dropdown,Dropdown2, Text, Switch } from "pink-lava-ui";
import styled from "styled-components";
import { IconAdd } from "assets";
import { Controller } from "react-hook-form";
import { glAccountList } from "../constants";

export default function WithholdingForm(props: any) {
  const {
    getValues,
    fieldsTax,
    appendTax,
    replaceTax,
    removeTax,
    control,
    register,
    TaxBodyFields,
    reset,
    setShowTaxTypeModal
  } = props;
  const [isPeriod, setIsPeriod] = useState<boolean>(false);
  
  const [array,setArray] = useState<{data:string}[]>([]);

  const handleAddMorePeriod = () => {    
    appendTax({
      ...TaxBodyFields,
      key: fieldsTax?.length,
    });
    setArray(oldArray => [...oldArray,fieldsTax?.length] );
  };
  useEffect(() => {
    if (isPeriod && fieldsTax?.length < 1) {
        handleAddMorePeriod()
    }
    else {
        removeTax(array)
    }
  },[isPeriod]);
  
  
  const propsFieldForm = {
    getValues,
    control,
    fieldsTax,
    replaceTax,
    removeTax,
    register,
  };
  
  const listFakeCountres = [
    { id: 1, value: "Indonesia" },
    { id: 2, value: "Japan" },
    { id: 3, value: "Malaysia" },
    { id: 4, value: "Singepore" },
  ];


  return (
    <>
      <Row gap="20px" width="100%">
        <Col width="48%">
          <Input
            width="100%"
            height="48px"
            placeholder="e.g Front Groceries No. 5"
            label="Tax Name"
            required
            {...register(`tax_name`, {
              required: "Tax Name must be filled",
            })}
          />
          <Spacer size={10} />
          <Controller
            rules={{ required: "Please select tax type" }}
            control={control}
            name={`tax_type`}
            render={({ field: { onChange }, fieldState: { error } }) => (
              <Dropdown
                label="Tax Type"
                width="100%"
                error={error?.message}
                actionLabel="Add New Tax Type"
                isShowActionLabel
                handleClickActionLabel={() => setShowTaxTypeModal(true)}
                items={listFakeCountres}
                handleChange={(value: string) => onChange(value)}
                noSearch
              />
            )}
          />
          <Spacer size={10} />
        </Col>
        <Col width="48%">
          <Controller
            rules={{ required: "Please select g/l account" }}
            control={control}
            name={`gl_account`}
            render={({ field: { onChange }, fieldState: { error } }) => (
              <Dropdown
                label="G/L Account"
                width="100%"
                noSearch
                error={error?.message}
                items={glAccountList}
                handleChange={(value: string) => onChange(value)}
              />
            )}
          />
          <Spacer size={10} />
          <Input
            width="100%"
            height="48px"
            placeholder="e.g A1"
            label="Tax Code"
            required
            {...register(`tax_code`, {
              required: "Tax code must be filled",
            })}
          />
          <Spacer size={10} />
        </Col>
      </Row>
      <FlexElement>
        <Spacer size={5} />
        <Text>Use Period?</Text>
        <Spacer size={10} />
        <Switch
          defaultChecked={isPeriod}
          checked={isPeriod}
          onChange={(value: boolean) => setIsPeriod(value)}
        />
      </FlexElement>
      <Spacer size={20} />
      <hr style={{'borderTop': 'dashed 1px'}}/>
      <Spacer size={20} />
      {fieldsTax.map((field: any, index: number | string) => (
        <div key={index}>
          <FormContact index={index} {...propsFieldForm} />
        </div>
      ))}
      {isPeriod ? (
      <Text variant={"h6"} color="pink.regular" onClick={handleAddMorePeriod}>
        + Add more period
      </Text>
      ): ''}
    </>
  );
}

const FormContact = ({
  control,
  index,
  getValues,
  fieldsTax,
  replaceTax,
  removeTax,
  register,
}: any) => {
  const propsButtonSetPrimary = {
    getValues,
    index,
    removeTax,
    fieldsTax,
  };
  return (
    <>
      <ButtonSetFormsPrimary {...propsButtonSetPrimary} />
      <Spacer size={30} />
      <Row gap="20px" width="100%">
        <Col width="48%">
          <Input
            width="100%"
            height="48px"
            placeholder="e.g Front Groceries No. 5"
            label="Period"
            required
            {...register(`item_details.${index}.period_from`, {
              required: "Period from must be filled",
            })}
          />
        </Col>
      </Row>
      <Spacer size={30} />
      <Row gap="20px" width="100%">
        <Col width="48%">
            <CreateInputDiv>
                <Input
                    width="80%"
                    label="Percentage Subject to Tax"
                    height="48px"
                    required
                    placeholder={"e.g 10"}
                    {...register(`item_details.${index}.percentage_subject_to_tax`, {
                      required: "Percentage Subject to Tax must be filled",
                    })}
                />
                <InputAddonBefore>%</InputAddonBefore>
            </CreateInputDiv>
        </Col>
        <Col width="48%">
          <CreateInputDiv>
              <Input
                  width="80%"
                  label="Withholding Tax Rate"
                  height="48px"
                  required
                  placeholder={"e.g 10"}
                  {...register(`item_details.${index}.withholding_tax_rate`, {
                    required: "Withholding Tax Rate street must be filled",
                  })}
              />
              <InputAddonBefore>%</InputAddonBefore>
          </CreateInputDiv>
        </Col>
      </Row>
      <Spacer size={30} />
    </>
  );
};
const ButtonSetFormsPrimary = ({
  index,
  removeTax,
  fieldsTax,
}: any) => {
  const isDeleteAktifed: boolean = fieldsTax?.length >= 1;
  return (
    <>
      <Row gap="12px" alignItems="center">
        {isDeleteAktifed && (
          <>
            <Text color="pink.regular">Period {index + 1}</Text>|
            <div style={{ cursor: "pointer" }}>
              <Text color="pink.regular" onClick={() => removeTax(index)}>
                Delete
              </Text>
            </div>
          </>
        )}
      </Row>
    </>
  );
};

const CreateInputDiv = styled.div`
  display: flex;
  position: relative;
`;

const CreateTitle = styled.div`
  margin-top: 1rem;
  font-weight: 600;
  font-size: 1.5rem;
`;

const InputAddonBefore = styled.div`
  z-index: 10;
  right: 0;
  bottom: 4;
  background: #f4f4f4;
  position: absolute;
  height: 48px;
  width: 20%;
  border-radius: 0 5px 5px 0;
  margin: 0 auto;
  margin-top: 1.75rem;
  text-align: center;
  padding-top: 12px;
  border: 1px solid #aaaaaa;
`;
const FlexElement = styled.div`
  display: flex;
  align-items: center;
`;
