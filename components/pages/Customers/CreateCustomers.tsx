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


import {
  Sales,
  Addresses,
  Contact,
  Invoicing,
  Purchasing
} from './fragments'

export default function CreateCustomers() {
  const router = useRouter();
  const [tabAktived, setTabAktived] = useState('Contact')

  const listTabItems = [
    { title: "Contact" },
    { title: "Addresses" },
    { title: "Sales" },
    { title: "Purchasing" },
    { title: "Invoicing" },
  ];

  const switchTabItem = () => {
    switch (tabAktived) {
      case 'Contact':
        return <Contact />
      case 'Addresses':
        return <Addresses />
      case 'Sales':
        return <Sales />
      case 'Purchasing':
        return <Purchasing />
      case 'Invoicing':
        return <Invoicing />
      default:
        return <Contact />
    }
  }

  return (
    <div>
      <Col>
        <Text variant={"h4"}>Customer Group</Text>
        <Spacer size={20} />
      </Col>
      <Card>
        <Row justifyContent="space-between" alignItems="center" nowrap>
          <Dropdown
            label=""
            width="185px"
            noSearch
            items={[
              { id: "ACTIVE", value: "Active" },
              { id: "INACTIVE", value: "Inactive" },
            ]}
            defaultValue="ACTIVE"
            handleChange={() => { }}
          />

          <Row gap="16px">
            <Button size="big" variant={"tertiary"} onClick={() => router.back()}>
              Cancel
            </Button>
            <Button size="big" variant={"primary"} onClick={() => { }}>
              Save
            </Button>
          </Row>
        </Row>
      </Card>

      <Card>
        <Accordion>
          <Accordion.Item key={1}>
            <Accordion.Header variant="blue">General</Accordion.Header>
            <Accordion.Body>
              <Row width="100%" gap="12px">
                <Col width="48%">
                  <Input
                    width="100%"
                    label="Name"
                    height="40px"
                    placeholder={"e.g PT. Kaldu Sari Nabati Indonesia"}
                  />
                  <Input
                    width="100%"
                    label="Tax Number"
                    height="40px"
                    placeholder={"e.g 123456789"}
                  />
                  <Input
                    width="100%"
                    label="Website"
                    height="40px"
                    placeholder={"e.g ksni.com"}
                  />
                  <Input
                    width="100%"
                    label="Language"
                    height="40px"
                    placeholder={"e.g gram"}
                  />
                </Col>
                <Col width="50%">
                  <Input
                    width="100%"
                    label="Phone"
                    height="40px"
                    placeholder={"e.g 021 123456"}
                  />
                  <Input
                    width="100%"
                    label="Mobile"
                    height="40px"
                    placeholder={"e.g 081234567891011"}
                  />
                  <Input
                    width="100%"
                    label="Email"
                    height="40px"
                    placeholder={"e.g admin@kasni.co.id"}
                  />
                  <Input
                    width="100%"
                    label="Customer Group"
                    height="40px"
                    placeholder={"e.g gram"}
                  />
                  <Input
                    width="100%"
                    label="External Code"
                    height="40px"
                    placeholder={"e.g 123456"}
                  />
                </Col>
              </Row>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Card>
      <Card>
        <Accordion>
          <Accordion.Item key={1}>
            <Accordion.Header variant="blue">Detail Information</Accordion.Header>
            <Accordion.Body>
              <Tabs
                defaultActiveKey={tabAktived}
                listTabPane={listTabItems}
                onChange={(e: any) => setTabAktived(e)}
              />
              {switchTabItem()}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Card>
    </div>
  )
}


const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
`;