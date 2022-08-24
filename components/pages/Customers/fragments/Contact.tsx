import React, { useState } from 'react'
import { Col, Row, Search, Spacer } from "pink-lava-ui";
import styled from 'styled-components'

import ModalAddNewContact from '../../../elements/Modal/ModalAddNewContact';
import IconAdd from '../../../../.../../assets/icons/ic-add-rounded.svg'
import IconAvatar from '../../../../.../../assets/icons/ic-avatar-xs.svg'
import IconEdit from '../../../../.../../assets/icons/ic-more.svg'

import styles from './styles.module.css'

export default function Contact() {
  const [visible, setVisible] = useState(false)

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
          <CardAddContact onClick={() => setVisible(!visible)} />
        </Col>
        {
          [1, 2].map((index) => (
            <Col key={index} width="32%">
              <CardContact />
            </Col>
          ))
        }
      </Row>

      <ModalAddNewContact
        visible={visible}
        onSubmit={() => setVisible(!visible)}
        onCancel={() => setVisible(!visible)}
      />
    </div>
  )
}

const CardContact = () => {
  return (
    <CardUser>
      <div className={styles['card-contact-user']}>
        <FlexElement>
          <IconAvatar />
          <Spacer size={10} />
          <div className={styles['detail-contact']}>
            <p className={styles['title']}>Tri Tipang</p>
            <p className={styles['status']}>COO</p>
            <p className={styles['email']}>duolipa@indomarco.com</p>
          </div>
        </FlexElement>
        <IconEdit />
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

const CardBoxAdd = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid red;
  border: 1px solid #DDDDDD;
  border-radius: 16px;
  padding: 37px 92px;
`