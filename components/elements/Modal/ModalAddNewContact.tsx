import React from 'react'
import {
  Modal,
  Spacer,
  Input,
  Dropdown,
  Button,
} from "pink-lava-ui";
import styled from 'styled-components';

interface PropsContactModal {
  visible?: true | false
  onCancel?: () => void
  onSubmit?: () => void
  registerContact?: any
  setValueContact?: any
  contact?: any
}

export default function ModalAddNewContact({
  visible,
  onCancel,
  onSubmit,
  contact,
  setValueContact
}: PropsContactModal) {
  const listFakeTitle = [
    { id: 'mr.', value: 'Mr.' },
    { id: 'mrs.', value: 'Mrs.' },
  ]

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
            width="100%"
            noSearch
            required
            handleChange={(value: string) => {
              setValueContact(`contact.tittle`, value)
            }}
            items={listFakeTitle}
          />
          <Spacer size={10} />
          <Input
            width="100%"
            placeholder="e.g Lala Lulu"
            label="Full Name" 
            required
            error={contact?.name?.message}
            // {...registerContact('contact.name', {
            //   required: 'full name must be filled'
            // })}
          />
          <Spacer size={10} />
          <Input
            width="100%"
            placeholder="e.g Business"
            label="Job Position"
            required
            error={contact?.job_position?.message}
            // {...registerContact('contact.role', {
            //   required: 'job position must be filled'
            // })}
          />
          <Spacer size={10} />
          <Input
            width="100%"
            placeholder="e.g 08123456789"
            label="Mobile"
            required
            type="number"
            error={contact?.mobile?.message}
            // {...registerContact('contact.mobile', {
            //   required: 'mobile must be filled'
            // })}
          />
          <Spacer size={10} />
          <Input
            width="100%"
            placeholder="e.g lala.lulu@kasni.co.id"
            label="Email"
            required
            type="email"
            error={contact?.email?.message}
            // {...registerContact('contact.email', {
            //   required: 'email must be filled'
            // })}
          />
          <Spacer size={10} />
          <Input
            width="100%"
            placeholder="e.g 123456789"
            label="NIK (optional)"
            required
            type="number"
            error={contact?.nik?.message}
            // {...registerContact('contact.nik', {
            //   required: 'nik must be filled'
            // })}
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