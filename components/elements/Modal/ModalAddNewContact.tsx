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
  visible: true | false
  onCancel: () => void
  onSubmit: () => VoidFunction
  register: any
  setValueContact: any
  contact: {
    name: { message: string }
    role: { message: string }
    email: { message: string }
    mobile: { message: string }
    nik: { message: string }
    job_position: { message: string }
  }
}

export default function ModalAddNewContact({
  visible,
  onCancel,
  onSubmit,
  register,
  contact,
  setValueContact
}: PropsContactModal) {
  const listFakeTitle = [
    { id: 'frontend', value: 'Frontend Engineer' },
    { id: 'backend', value: 'Backend Engineer' },
    { id: 'qa', value: 'Quality Asurance' },
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
            width={"100%"}
            noSearch
            required
            handleChange={(value: string) => {
              setValueContact('contact.role', value)
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
            {...register('contact.name', {
              required: 'full name must be filled'
            })}
          />
          <Spacer size={10} />
          <Input
            width="100%"
            placeholder="e.g Business"
            label="Job Position"
            required
            error={contact?.job_position?.message}
            {...register('contact.job_position', {
              required: 'job_position must be filled'
            })}
          />
          <Spacer size={10} />
          <Input
            width="100%"
            placeholder="e.g 08123456789"
            label="Mobile"
            required
            error={contact?.mobile?.message}
            {...register('contact.mobile', {
              required: 'mobile must be filled'
            })}
          />
          <Spacer size={10} />
          <Input
            width="100%"
            placeholder="e.g lala.lulu@kasni.co.id"
            label="Email"
            required
            error={contact?.email?.message}
            {...register('contact.email', {
              required: 'email must be filled'
            })}
          />
          <Spacer size={10} />
          <Input
            width="100%"
            placeholder="e.g 123456789"
            label="NIK (optional)"
            required
            error={contact?.nik?.message}
            {...register('contact.nik', {
              required: 'nik must be filled'
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