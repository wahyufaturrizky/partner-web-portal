import React from "react";
import { Button, Spacer, Modal, Input, Dropdown, Spin } from "pink-lava-ui";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";

import {
  useAccountGroupParent,
  useAccountGroupsDetail,
} from "../../../hooks/finance-config/useAccountGroup";
import styled from "styled-components";

const schema = yup
  .object({
    groupName: yup.string().required("Name is Required"),
  })
  .required();

export const ModalDetailAccountGroup: any = ({
  visible,
  defaultValue,
  onCancel,
  onOk,
  id,
}: any) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: any) => onOk({ groupName: data.groupName, parentId: data.parentId });

  const { data: accountGroupParent } = useAccountGroupParent({
    options: {},
  });

  const {
    data: accountGroup,
    isLoading: isLoadingAccountGroup,
    isFetching: isFetchingAccountGroup,
  } = useAccountGroupsDetail({
    id,
    query: {},
    options: {
      onSuccess: (data: any) => {
        console.log(data);
      },
    },
  });

  const parents = accountGroupParent
    ?.filter((account: any) => account.id !== id)
    .map((account: any) => ({ id: account.id, value: account.groupName }));

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      title={"Account Group"}
      footer={
        <div
          style={{
            display: "flex",
            marginBottom: "12px",
            marginRight: "12px",
            justifyContent: "flex-end",
            gap: "12px",
          }}
        >
          <Button onClick={handleSubmit(onSubmit)} variant="primary" size="big">
            Save
          </Button>
        </div>
      }
      content={
        <>
          {isLoadingAccountGroup || isFetchingAccountGroup ? (
            <Center>
              <Spin tip="Loading Data..." />
            </Center>
          ) : (
            <>
              <Spacer size={20} />
              <Input
                error={errors?.groupName?.message}
                defaultValue={accountGroup?.groupName}
                {...register("groupName", { required: true })}
                label="Name"
                placeholder="e.g Receivable"
              />
              <Spacer size={20} />

              <Controller
                control={control}
                shouldUnregister={true}
                defaultValue={accountGroup?.parents?.id}
                name="parentId"
                render={({ field: { onChange, value }, formState: { errors } }) => (
                  <Dropdown
                    label="Parent (optional)"
                    placeholder="Select"
                    width="100%"
                    items={parents}
                    defaultValue={value}
                    handleChange={(value: any) => {
                      onChange(value);
                    }}
                    noSearch
                  />
                )}
              />

              <Spacer size={14} />
            </>
          )}
        </>
      }
    />
  );
};

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
