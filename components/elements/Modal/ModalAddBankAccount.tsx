import React from "react";
import { Modal, Spacer, Input, Button } from "pink-lava-ui";
import styled from "styled-components";

export default function ModalAddBankAccount({
  onCancel,
  visible,
  handleBankSubmit,
  errorsFormBank: { bank },
  onHandleBankSubmit,
  bankRegister,
}: any) {
  return (
    <Modal
      visible={visible.open}
      onCancel={onCancel}
      title={visible.typeForm}
      footer={
        <Footer>
          <Button onClick={onCancel} variant="tertiary" size="big" full>
            Cancel
          </Button>
          <Button full onClick={handleBankSubmit(onHandleBankSubmit)} variant="primary" size="big">
            Add
          </Button>
        </Footer>
      }
      content={
        <div key={1}>
          <Spacer size={20} />

          <Input
            defaultValue={visible.data?.bank_name}
            width="100%"
            label="Bank Name"
            required
            error={bankRegister.bank_name?.message}
            placeholder={"e.g BCA"}
            {...bankRegister("bank_name", {
              shouldUnregister: true,
              required: "Please enter bank name.",
              maxLength: {
                value: 100,
                message: "Max length exceeded",
              },
            })}
          />

          <Spacer size={10} />
          <Input
            defaultValue={visible.data?.account_number}
            required
            width="100%"
            type="number"
            label="Account Number"
            placeholder="e.g 12317912"
            error={bank?.account_number?.message}
            {...bankRegister(`account_number`, {
              required: "account number name must be filled",
              shouldUnregister: true,
            })}
          />
          <Spacer size={10} />
          <Input
            defaultValue={visible.data?.account_name}
            required
            width="100%"
            label="Account Name"
            placeholder="e.g Jhone Doe"
            error={bank?.account_name?.message}
            {...bankRegister(`account_name`, {
              required: "account name must be filled",
              shouldUnregister: true,
            })}
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
