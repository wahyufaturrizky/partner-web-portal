import React from 'react'
import {
  Dropdown,
  Spacer,
  Row,
  Text,
  Accordion,
  Col,
  Input,
  Table,
  Button
} from 'pink-lava-ui'
import styled from 'styled-components'
import { useRouter } from 'next/router'

import ArrowLeft from '../../../assets/icons/arrow-left.svg'

export default function ComponentDetailSalesman() {
  const router = useRouter();
  const { status, salesman_id } = router.query

  const columns = [
    {
      title: 'Customer',
      dataIndex: 'customer',
      width: "80%"
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: () => (
        <Button
          size="small"
          onClick={() => router.push(`/customer/1334`)}
          variant="tertiary"
        >
          View Detail
        </Button>
      )
    },
  ]

  const statusSalesman = () => {
    switch (status) {
      case 'active':
        return 'Active'
      case 'waiting':
        return 'Waiting for Approval'
      case 'rejected':
        return 'Rejected'
      case 'inactive':
        return 'Inactive'
      case 'draft':
        return 'Draft'
      default:
        return 'active'
    }
  }
  
  const setColorStatus = () => {
    switch (status) {
      case 'active':
        return '#01A862'
      case 'waiting':
        return '#FFB400'
      case 'rejected':
        return '#ED1C24'
      case 'inactive':
        return '#000000'
      default:
        return '#000000'
  }}

  return (
    <div>
      <Row gap="4px" alignItems="center">
        <ArrowLeft
          style={{ cursor: "pointer" }}
          onClick={() => router.back()}
        />
        <Text variant="h4">Detail Salesman {salesman_id}</Text>
      </Row>
      <Spacer size={30} />
      <Card>
        <Row justifyContent="space-between">
        <StatusCustomer color={setColorStatus()}>
          {statusSalesman()}
        </StatusCustomer>
        <FlexElement>
          <Button variant="tertiary">
            Reject
          </Button>
          <Button variant="primary">
            Approve
          </Button>
        </FlexElement>
       </Row>
      </Card>
        <Spacer size={30} />
      <Card>
        <Accordion>
          <Accordion.Item key={1}>
            <Accordion.Header variant="blue">General</Accordion.Header>
            <Accordion.Body>
              <Row width="100%" gap="12px">
                <Col width="48%">
                  <Input
                    width="100%"
                    label="Salesman Name"
                    height="50px"
                    placeholder="Salesman Name"
                    required
                    disabled
                  />
                  <Spacer size={10} />
                  <Input
                    width="100%"
                    label="Branch"
                    height="50px"
                    placeholder="Branch"
                    required
                    disabled
                  />
                  <Spacer size={10} />
                  <Input
                    width="100%"
                    label="ID Card"
                    height="50px"
                    placeholder="ID Card"
                    required
                    disabled
                  />
                  <Spacer size={10} />
                  <Input
                    width="100%"
                    label="External Code"
                    height="50px"
                    placeholder="External Code"
                    required
                    disabled
                  />
                </Col>
                <Col width="48%">
                  <Dropdown
                    width="100%"
                    label="Division Name"
                    height="50px"
                    placeholder="Division Name"
                    required
                    disabled
                  />
                  <Spacer size={10} />
                  <Input
                    width="100%"
                    label="Mobile Number"
                    height="50px"
                    placeholder="External Code"
                    required
                    disabled
                  />
                  <Spacer size={10} />
                  <Input
                    width="100%"
                    label="Email"
                    height="50px"
                    placeholder="Email"
                    required
                    disabled
                  />
                </Col>
              </Row>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Card>
      <Spacer size={30} />
      <Card>
        <Accordion>
          <Accordion.Item key={1}>
            <Accordion.Header variant="blue">Customer</Accordion.Header>
            <Accordion.Body>
              <Spacer size={20} />
              <TextWarning> *Auto added from Customer</TextWarning>
              <Spacer size={20} />
              <Table columns={columns} data={[1, 2, 3]} />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Card>
    </div> 
  )
}

const Card = styled.div`
  background: #ffff;
  padding: 1rem;
  border-radius: 16px;
`

const FlexElement = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

const TextWarning = styled.p`
  color: #FFB400;
  font-weight: 600;
  font-size: 16px;
`

const StatusCustomer = styled.p`
  color: ${({ color }: any) => color};
  font-weight: 600;
  border: 1px solid #AAAAAA;
  border-radius: 8px;
  margin: 0;
  text-align: center;
  display: flex;
  padding: 0 1rem;
  align-items: center;
`