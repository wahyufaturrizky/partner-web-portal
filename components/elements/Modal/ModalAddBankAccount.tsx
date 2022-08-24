import React from 'react'
import { Modal, Spacer, Input, Dropdown, Button } from "pink-lava-ui";
import styled from 'styled-components';

interface PropsModalAddBankAccount {
  visible: true | false,
  onCancel: () => void,
  onSubmit: () => void
}

export default function ModalAddBankAccount({
  visible,
  onCancel,
  onSubmit
}: PropsModalAddBankAccount) {
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
            onClick={onSubmit}
            variant="primary"
            size="big">
            Add
          </Button>
        </Footer>
      }
      content={
        <div key={1}>
          <Spacer size={20} />
          <Input width="100%" placeholder="e.g BCA" label="Bank Name" />
          <Spacer size={10} />
          <Input width="100%" placeholder="e.g 12317912" label="Account Number" />
          <Spacer size={10} />
          <Input width="100%" placeholder="e.g Jhone Doe" label="Account Name" />
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