import React, { useState } from 'react'
import {
  Button,
  Col,
  DropdownMenu,
  FileUploadModal,
  Input,
  Modal,
  Pagination,
  Row,
  Search,
  Tabs,
  Spacer,
  Table,
  Text,
  Dropdown,
  Accordion,
  Spin,
} from "pink-lava-ui";
import styled from 'styled-components'
import { useRouter } from 'next/router';

export default function Contact() {
  return (
    <div>
      <Search
        width="340px"
        placeholder="search contact name, role, email"
        onChange={() => { }}
      />
      <Row style={{marginTop: '1rem'}}>
        <Col md="8">
          <CardBoxAdd>
            Add New Contact
          </CardBoxAdd>
        </Col>
        <Col md="8">
          <CardBoxAdd>
            Add New Contact
          </CardBoxAdd>
        </Col>
        <Col md="8">
          <CardBoxAdd>
            Add New Contact
          </CardBoxAdd>
        </Col>
      </Row>
    </div>
  )
}


const CardBoxAdd = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid red;
  border: 1px solid #DDDDDD;
  border-radius: 16px;
  padding: 37px 92px;
`