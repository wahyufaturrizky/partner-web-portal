import React from "react";
import { Modal, Spacer, Input, Button, FormSelect, Text } from "pink-lava-ui";
import styled from "styled-components";
import { useForm } from "react-hook-form";

export default function ModalAddBankAccounts({ visible, onCancel, bankData, onSaveBank }: any) {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    onSaveBank(data);
  };

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      title="Add Bank Account"
      footer={
        <Footer>
          <Button onClick={onCancel} variant="tertiary" size="big" full>
            Cancel
          </Button>
          <Button full onClick={handleSubmit(onSubmit)} variant="primary" size="big">
            Add
          </Button>
        </Footer>
      }
      content={
        <div>
          <Spacer size={10} />
          <Input
            width="100%"
            required
            height="40px"
            placeholder="e.g BCA"
            label="Bank Name"
            defaultValue={bankData?.name ?? ""}
            {...register("bank", { shouldUnregister: true })}
          />
          <Spacer size={10} />
          <Input
            width="100%"
            required
            height="40px"
            placeholder="e.g 123456789"
            label="Account Number"
            defaultValue={bankData?.account_number ?? ""}
            {...register("account_number", { shouldUnregister: true })}
          />
          <Spacer size={10} />
          <Input
            width="100%"
            required
            height="40px"
            placeholder="e.g Jane Done"
            label="Account Name"
            defaultValue={bankData?.account_name ?? ""}
            {...register("account_name", { shouldUnregister: true })}
          />
          <Spacer size={20} />
        </div>
      }
    />
  );
}

const Footer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
