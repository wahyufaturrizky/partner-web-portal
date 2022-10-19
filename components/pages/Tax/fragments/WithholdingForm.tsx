import React, { useEffect, useState } from "react";

import {
  Col,
  Spacer,
  Input,
  Button,
  Row,
  Dropdown,
  RangeDatePicker,
  Text,
  Switch,
} from "pink-lava-ui";
import styled from "styled-components";
import { IconAdd } from "assets";
import { Controller } from "react-hook-form";
import { glAccountList } from "../constants";
import moment from "moment";

export default function WithholdingForm(props: any) {
  const {
    getValues,
    fieldsTax,
    appendTax,
    replaceTax,
    remove,
    control,
    register,
    TaxBodyFields,
    reset,
    setShowTaxTypeModal,
    tabAktived,
    errors,
    showCreateModal,
    setValue,
    setShowDelete
  } = props;
  const [isPeriod, setIsPeriod] = useState<boolean>(false);
  const [isUpdated, setIsUpdated] = useState<boolean>(false);
  const [array, setArray] = useState<{ data: string }[]>([]);
  const [dataUpdate, setDataUpdate] = useState({});

  const handleAddMorePeriod = () => {
    if (showCreateModal?.type === "create") {
      appendTax({
        ...TaxBodyFields,
        key: fieldsTax?.length,
      });
      setArray((oldArray) => [...oldArray, fieldsTax?.length]);
    } else if (showCreateModal?.type === "edit") {
      setDataUpdate((prevState: any) => ({
        ...prevState,
        details: [
          ...prevState.details,
          {
            period_from: "2022-10-06T01:52:15.998Z",
            period_to: "2022-10-06T01:52:15.998Z",
            percentage: "10",
            percentage_subject_to_tax: "10",
            withholding_tax_rate: "10",
          },
        ],
      }));
    }
  };
  useEffect(() => {
    if (showCreateModal?.type === "create") {
      reset();
      if (isPeriod && fieldsTax?.length < 1) {
        handleAddMorePeriod();
      } else {
        reset();
        // console.log("edit");
      }
    }
  }, [isPeriod, showCreateModal]);
  useEffect(() => {
    if (showCreateModal.type == 'edit') {      
      const detailData = showCreateModal?.data;
      setValue(`tax_name`, detailData.tax_item_name);
      setValue(`tax_code`, detailData.tax_code);
      setValue(`gl_account`, detailData.gl_account)
      showCreateModal?.data?.details?.map((v, i) => {
        // console.log("Value",v);
        
        setValue(`item_details.${i}.percentage`, v.percentage);
        setValue(`item_details.${i}.period`, [v.period_from, v.period_to]);
        setValue(`item_details.${i}.withholding_tax_rate`, v.withholding_tax_rate);
        setValue(`item_details.${i}.percentage_subject_to_tax`, v.percentage_subject_to_tax);
        setValue(`item_details.${i}.tax_item_detail_id`, v.tax_item_detail_id);
      });
    }
  }, []);
  const propsFieldForm = {
    getValues,
    control,
    fieldsTax,
    replaceTax,
    remove,
    register,
    tabAktived,
  };

  const listTaxType = [
    { id: "W1", value: "W1" },
    { id: "W2", value: "W2" },
    { id: "W3", value: "W3" },
  ];

  const FormContact = ({ index, field, fieldsTax, remove, tabAktived }: any) => {
    const propsButtonSetPrimary = {
      index,
      field,
      remove,
      fieldsTax,
    };

    // console.log("fieldnya ", field);
    // const dateFormat = "YYYY-MM-DD";
    // console.log("dataUpdate",dataUpdate);
    
    return (
      <>
        <ButtonSetFormsPrimary {...propsButtonSetPrimary} />
        <Spacer size={30} />
        <Row gap="20px" width="100%">
          <Col width="48%">
            <Controller
              control={control}
              name={`item_details.${index}.period`}
              defaultValue={[moment(field.period_from).format("DD/MM/YYYY"), moment(field.period_to).format("DD/MM/YYYY")]}
              render={({ field: { onChange } }) => (
                <Col width="100%">
                  <RangeDatePicker
                    fullWidth
                    defaultValue={[moment(field.period_from), moment(field.period_to)]}

                    onChange={(date: any, dateString: any) => onChange(dateString)}
                    label="Period"
                    format={"DD/MM/YYYY"}
                  />
                </Col>
              )}
            />
          </Col>
          {tabAktived === "VAT" ? (
            <Col width="48%">
              <CreateInputDiv>
                <Input
                  width="80%"
                  label="Percentage"
                  height="48px"
                  required
                  placeholder={"e.g 10"}
                  key={field.tax_item_detail_id}
                  {...register(`item_details.${index}.percentage`, {
                    required: "Percentage must be filled",
                  })}
                  // value={field.percentage}
                  // onChange= {(event: any) => setDataUpdate((prevState:any) => ({
                  //   ...prevState,
                  //   tax_item_name : event.target.value
                  // }))}
                  defaultValue={field.percentage}
                />
                <InputAddonBefore>%</InputAddonBefore>
              </CreateInputDiv>
            </Col>
          ) : null}
        </Row>
        <Spacer size={30} />
        {tabAktived === "Withholding Tax" ? (
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
                  defaultValue={field.percentage_subject_to_tax}
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
                  defaultValue={field.withholding_tax_rate}
                />
                <InputAddonBefore>%</InputAddonBefore>
              </CreateInputDiv>
            </Col>
          </Row>
        ) : null}
        <Spacer size={30} />
      </>
    );
  };
  
  const ButtonSetFormsPrimary = ({ index, remove, fieldsTax }: any) => {

    const isDeleteAktifed: boolean = fieldsTax?.length >= 1;
    return (
      <>
        <Row gap="12px" alignItems="center">
          {isDeleteAktifed && (
            <>
              <Text color="pink.regular">Period {index + 1}</Text>|
              <div style={{ cursor: "pointer" }}>
                <Text color="pink.regular" onClick={() => {
                  console.log(fieldsTax[index])
                  
                  showCreateModal.type == 'edit' && fieldsTax[index].tax_item_id ? 
                    setShowDelete({ open: true,
                      type: "item-detail",
                      data: { name: `Period ${index+1}` ,tax_item_id: fieldsTax[index].tax_item_id, tax_item_detail_id:fieldsTax[index].tax_item_detail_id, index:index }
                    }) : remove(index)
                  }
                }>
                  Delete
                </Text>
              </div>
            </>
          )}
        </Row>
      </>
    );
  };

  useEffect(() => {
    if (showCreateModal) {
      if (showCreateModal?.open && !isUpdated) {
        // console.log("showCreateModalEffect", showCreateModal);

        setDataUpdate(showCreateModal.data);
        if (showCreateModal?.type === "edit" && showCreateModal?.data?.details.length > 0) {
          setIsPeriod(true);
        }else{
          console.log("masuk");
          
        }
        setIsUpdated(true);
      } else if (!showCreateModal?.open) {
        setIsPeriod(false);
        setDataUpdate({});
      }
    }
  }, [showCreateModal, isUpdated]);

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
            // defaultValue={dataUpdate?.tax_item_name}
            // value={dataUpdate?.tax_item_name}
            // onChange={(event: any) =>
            //   setDataUpdate((prevState: any) => ({
            //     ...prevState,
            //     tax_item_name: event.target.value,
            //   }))
            // }
            error={errors?.tax_name?.message}
          />
          <Spacer size={10} />
          {control && (
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
                  items={listTaxType}
                  handleChange={(value: string) => {
                    onChange(value);
                  }}
                  noSearch
                />
              )}
            />
          )}
          <Spacer size={10} />
        </Col>
        <Col width="48%">
          {control && (
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
          )}
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
            value={dataUpdate?.tax_code}
            onChange={(event: any) =>
              setDataUpdate((prevState: any) => ({
                ...prevState,
                tax_code: event.target.value,
              }))
            }
            error={errors?.tax_code?.message}
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
      <hr style={{ borderTop: "dashed 1px" }} />
      <Spacer size={20} />
      {!isPeriod && tabAktived === "VAT" && (
        <Row gap="20px" width="100%">
          <Col width="48%">
            <CreateInputDiv>
              <Input
                width="80%"
                label="Percentage"
                height="48px"
                required
                placeholder={"e.g 10"}
                {...register(`item_details.0.percentage`, {
                  required: "Percentage must be filled",
                })}
              />
              <InputAddonBefore>%</InputAddonBefore>
            </CreateInputDiv>
          </Col>
        </Row>
      )}
      {!isPeriod && tabAktived === "Withholding Tax" && (
        <Row gap="20px" width="100%">
          <Col width="48%">
            <CreateInputDiv>
              <Input
                width="80%"
                label="Percentage Subject to Tax"
                height="48px"
                required
                placeholder={"e.g 10"}
                {...register(`item_details.0.percentage_subject_to_tax`, {
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
                {...register(`item_details.0.withholding_tax_rate`, {
                  required: "Withholding Tax Rate street must be filled",
                })}
              />
              <InputAddonBefore>%</InputAddonBefore>
            </CreateInputDiv>
          </Col>
        </Row>
      )}
      {showCreateModal?.type === "create" && isPeriod &&
        fieldsTax.map((field: any, index: number | string) => (
          <div key={index}>
            <FormContact
              index={index}
              field={field}
              fieldsTax={fieldsTax}
              tabAktived={tabAktived}
              remove={remove}
            />
          </div>
        ))}
      {showCreateModal?.type === "edit" && isPeriod &&
        typeof dataUpdate?.details !== undefined &&
        Array.isArray(dataUpdate?.details) &&
        dataUpdate?.details?.length &&
        dataUpdate?.details.map((field: any, index: number | string) => (
          <div key={index}>
            <FormContact
              index={index}
              field={field}
              fieldsTax={dataUpdate?.details}
              tabAktived={tabAktived}
              remove={(index: any) => {
                // console.log(index);
                setDataUpdate((prevState: any) => ({
                  ...prevState,
                  details: [
                    ...prevState.details.slice(0, index),
                    ...prevState.details.slice(index + 1),
                  ],
                }));
              }}
            />
          </div>
        ))}
      {isPeriod ? (
        <Text variant={"h6"} color="pink.regular" onClick={handleAddMorePeriod}>
          + Add more period
        </Text>
      ) : (
        ""
      )}
    </>
  );
}

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
