import React from 'react'
import { Modal, Spacer, Input, Button } from "pink-lava-ui";
import styled from 'styled-components';

interface PropsModalAddBankAccount {
  handleSubmitBankAccount?: any;
  registerBankAccount?: any;
  visible?: true | false;
  onCancel?: () => void,
  handleAddItemBankAccount?: any
  errorsBankAccount?: any
}

export default function ModalAddBankAccount({
  onCancel,
  visible,

  fieldsBank,
  handleBankSubmit,
  errorsFormBank: { bank },
  onHandleBankSubmit,
  bankRegister,
}: any) {
  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      title="Add New Contact"
      footer={
        <Footer>
          <Button
            onClick={onCancel}
            variant="tertiary"
            size="big"
            full
          >
            Cancel
          </Button>
          <Button
            full
            onClick={handleBankSubmit(onHandleBankSubmit)}
            variant="primary"
            size="big">
            Add
          </Button>
        </Footer>
      }
      content={
        <div key={1}>
          <Spacer size={20} />
          <Input
            required
            width="100%"
            label="Bank Name"
            placeholder="e.g BCA"
            error={bank?.bank_name?.message}
            {...bankRegister(`bank_name`, {
              required: 'bank name name must be filled'
            })}
          />
          <Spacer size={10} />
          <Input
            required
            width="100%"
            type="number"
            label="Account Number"
            placeholder="e.g 12317912"
            error={bank?.account_number?.message}
            {...bankRegister(`account_number`, {
              required: 'account number name must be filled'
            })}
          />
          <Spacer size={10} />
          <Input
            required
            width="100%"
            label="Account Name"
            placeholder="e.g Jhone Doe"
            error={bank?.account_name?.message}
            {...bankRegister(`account_name`, {
              required: 'account name must be filled'
            })}
          />
          <Spacer size={20} />
        </div>
      }  
    />
  )}


const Footer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`