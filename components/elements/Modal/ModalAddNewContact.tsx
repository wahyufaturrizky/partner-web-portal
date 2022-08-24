import React from 'react'
import { Modal, Spacer, Input, Dropdown, Button } from "pink-lava-ui";
import styled from 'styled-components';

interface PropsContactModal {
  visible: true | false,
  onCancel: () => void,
  onSubmit: () => void
}

export default function ModalAddNewContact({
  visible,
  onCancel,
  onSubmit
}: PropsContactModal) {
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
          <Dropdown
            label="Title"
            width={"100%"}
            noSearch
          />
          <Spacer size={10} />
          <Input width="100%" placeholder="e.g Lala Lulu" label="Full Name" />
          <Spacer size={10} />
          <Input width="100%" placeholder="e.g Business" label="Job Position" />
          <Spacer size={10} />
          <Input width="100%" placeholder="e.g 08123456789" label="Mobile" />
          <Spacer size={10} />
          <Input width="100%" placeholder="e.g lala.lulu@kasni.co.id" label="Email" />
          <Spacer size={10} />
          <Input width="100%" placeholder="e.g 123456789" label="NIK (optional)" />
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