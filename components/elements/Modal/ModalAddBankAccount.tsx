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
  handleAddItemBankAccount,
  handleSubmitBankAccount,
  registerBankAccount,
  visible,
  onCancel,
  errorsBankAccount
}: PropsModalAddBankAccount) {
  const {
    account_name,
    account_number,
    bank_name
  } = errorsBankAccount || {}

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
            onClick={handleSubmitBankAccount(handleAddItemBankAccount)}
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
            width="100%"
            placeholder="e.g BCA"
            label="Bank Name"
            required
            error={bank_name?.message}
            {...registerBankAccount('bank_name', {
              required: 'bank name name must be filled'
            })}
          />
          <Spacer size={10} />
          <Input
            width="100%"
            placeholder="e.g 12317912"
            label="Account Number"
            required
            type="number"
            error={account_number?.message}
            {...registerBankAccount('account_number', {
              required: 'account number name must be filled'
            })}
          />
          <Spacer size={10} />
          <Input
            width="100%"
            placeholder="e.g Jhone Doe"
            label="Account Name"
            required
            error={account_name?.message}
            {...registerBankAccount('account_name', {
              required: 'account name must be filled'
            })}  
          />
          <Spacer size={20} />
        </div>
      }
    />
  )
}


const Footer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`