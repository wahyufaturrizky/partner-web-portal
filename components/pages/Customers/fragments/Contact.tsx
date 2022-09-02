import React from 'react'
import { Col, Row, Search, Spacer, CustomPopover } from "pink-lava-ui";
import styled from 'styled-components'

import ModalAddNewContact from '../../../elements/Modal/ModalAddNewContact';
import IconAdd from '../../../../.../../assets/icons/ic-add-rounded.svg'
import IconAvatar from '../../../../.../../assets/icons/ic-avatar-xs.svg'
import IconEdit from '../../../../.../../assets/icons/ic-more.svg'

import styles from '../styles.module.css'

export default function Contact(props: any) {
  const {
    onCreate,
    setVisible,
    visible,
    registerContact,
    contact,
    setValueContact,
    fieldsContact,
    removeContact,
    handleEditContact
    } = props 

  return (
    <div>
      <Search
        width="340px"
        placeholder="search contact name, role, email"
        onChange={() => { }}
      />
      <Spacer size={20} />
      <Row gap="12px" width="100%"> 
        <Col width="32%">
          <CardAddContact onClick={setVisible} />
        </Col>
        {
          fieldsContact.map((items: any, index: number) => (
            <Col key={index} width="32%">
              <CardContact
                key={items.id}
                onRemove={() => removeContact(index)}
                onEdit={handleEditContact}
                {...items}
              />
            </Col>
          ))
        }
      </Row>

      <ModalAddNewContact
        setValueContact={setValueContact}
        contact={contact}
        visible={visible}
        onSubmit={onCreate}
        onCancel={setVisible}
        registerContact={registerContact}
      />
    </div>
  )
}

const CardContact = ({ contact, onRemove, onEdit }: any) => {
  const actionMore = (
    <PopoverAction>
      <EditButton onClick={() => onEdit(contact)}>Edit</EditButton>
      <RemoveButton onClick={onRemove}>Remove</RemoveButton>
    </PopoverAction>
  )

  return (
    <CardUser>
      <div className={styles['card-contact-user']}>
        <FlexElement>
          <IconAvatar />
          <Spacer size={10} />
          <div className={styles['detail-contact']}>
            <p className={styles['title']}>{contact?.name}</p>
            <p className={styles['status']}>{contact?.role}</p>
            <p className={styles['email']}>{contact?.email}</p>
          </div>
        </FlexElement>
        <CustomPopover content={actionMore}>
          <IconEdit />
        </CustomPopover>
      </div>
    </CardUser>
  )
}

export const CardAddContact = ({ onClick }: any) => {
  return (
    <Card onClick={onClick}>
      <IconAdd /> Add New contact
    </Card>
  )
}

const PopoverAction = styled.div`
  width: 164px;
  height: 85.87px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const EditButton = styled.p`
  margin: 0 0 1rem 0;
  cursor: pointer;
  font-size: 1rem;
`
const RemoveButton = styled.p`
  margin: 0;
  color: #EB008B;
  cursor: pointer;
  font-size: 1rem;
`

const FlexElement = styled.div`
  display: flex;
  align-items: center;
`

const CardUser = styled.div`
  border: 1px solid #DDDDDD;
  border-radius: 16px;
`

const Card = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #DDDDDD;
  border-radius: 16px;
  padding: 37px 92px;
`