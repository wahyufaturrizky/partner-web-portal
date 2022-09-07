import React, { useState } from 'react'
import { useRouter } from 'next/router'
import {
  Accordion,
  Dropdown2,
  Dropdown,
  Spacer,
  Modal,
  Text,
  Row,
  Col,
  Input,
  Table,
  Button,
  Checkbox,
  TextArea,
  Pagination,
  DatePickerInput,
} from 'pink-lava-ui'
import moment from 'moment'
import styled from 'styled-components'
usePagination

import ArrowLeft from 'assets/icons/arrow-left.svg'
import { ModalConfirmation } from 'components/elements/Modal/ModalConfirmation'
import usePagination from '@lucasmogari/react-pagination'

const dropdownStatus = [
  { id: "active", value: "active" },
  { id: "inactive", value: "Inactive" },
]

export default function ComponentDetailSalesman({
  listCustomers,
  isLoading
}: any) {
  const pagination = usePagination({
    page: 1,
    itemsPerPage: 10,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
  });
  const router = useRouter();
  const { status, salesman_id }: any = router.query || {}
  const [labelConfirmation, setLabelConfirmation] = useState<string>('')
  const [titleModal, setTitleModal] = useState<string>('')
  const [modalCustomer, setModalCustomer] = useState<{ visible: boolean, data: any }>({
    visible: false,
    data: {}
  })
  const [defaultChecked, setDefaultChecked] = useState<boolean>(false)
  const [modalConfirmation, setModalConfirmation] = useState<any>({
    active: false,
    inactive: false,
    approve: false,
    reject: false,
    waiting: false
  })

  const columns = [
    {
      title: 'Customer',
      dataIndex: 'name',
      width: "80%"
    },
    {
      title: 'Action',
      render: (items: any) => (
        <Button
          size="small"
          onClick={() => setModalCustomer({ ...modalCustomer, visible: true, data: items })}
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

  const setActionButton = () => {
    switch(status) {
      case 'aktif' || 'inactive' || 'reject':
        return <ActionButton status={status} onCancel={() => router.back()} />
      case 'waiting':
        return <ActionButton status={status} onReject={() => onHandleRejected()} />
      case 'draft':
        return <ActionButton status={status} />
      default:
        return <ActionButton status={status} onCancel={() => router.back()} />
    }
  }

  const setColorStatus = () => {
    switch(status) {
      case 'waiting':
        return '#FFB400'
      case 'rejected':
        return '#ED1C24'
      case 'draft':
        return '#00000'
    }
  }

  const modalContent = () => {
    switch(titleModal) {
      case "Are you sure to reject?":
        return (
           <>
           <Spacer size={20} />
            <TextArea
              rows={5}
              label={false}
              placeholder="Write your remarks here..."
              onChange={({ target }: any) => {}}
            />
            <Spacer size={20} />
           </>
        )
      case "Confirmation":
        return (
          <>
            <TextConfirmation>
              Are you sure to {labelConfirmation} this salesman?
            </TextConfirmation>
            <Spacer size={30} />
          </>
        );
    }
  }

  const onhandleSetStatus = (value: string) => {
    setTitleModal("Confirmation")
    setModalConfirmation({ ...modalConfirmation, [status]: value })
    setLabelConfirmation(value)
  }

  const onHandleRejected = () => {
    setTitleModal("Are you sure to reject?")
    setModalConfirmation({ ...modalConfirmation, [status]: true })
  }

  return (
    <div>
      <Row gap="4px" alignItems="center">
        <ArrowLeft style={{ cursor: "pointer" }} onClick={() => router.back()} />
        <Text variant="h4">Detail Salesman {salesman_id}</Text>
      </Row>
      <Spacer size={30} />
      <Card>
        <Row justifyContent="space-between">
          {
            status === 'active' || status === 'inactive'
              ? (
                <Dropdown
                  label={false}
                  width="185px"
                  noSearch
                  items={dropdownStatus}
                  defaultValue={status}
                  placeholder="Select"
                  handleChange={(value: any) => onhandleSetStatus(value)}
                />
              ) : (
                <StatusCustomer color={setColorStatus()}>
                  {statusSalesman()}
                </StatusCustomer>
              )
          }
          {setActionButton()}
       </Row>
      </Card>
      <Spacer size={30} />
      <Card>
        <Accordion>
          <Accordion.Item key={1}>
            <Accordion.Header variant="blue">General</Accordion.Header>
            <Accordion.Body>
              <Forms status={status} />
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
              <Table loading={isLoading} columns={columns} data={listCustomers} />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Card>

      {/* modal confirmation */}
      <ModalConfirmation
        title={titleModal}
        visible={modalConfirmation[status]}
        content={modalContent()}
        variantBtnLeft={status === "waiting" ? "tertiary" : "secondary"}
        onCancel={() => setModalConfirmation({ ...modalConfirmation, [status]: false })}
      />

      {/* modal view detail customers */}
      {console.log(modalConfirmation)}
      <Modal
        width={900}
        visible={modalCustomer.visible}
        title={modalCustomer?.data?.name}
        onCancel={() => setModalCustomer({visible: false, data: {}})}
        footer={
          <Row justifyContent="end">
            <Button onClick={() => window.open(`/customers/${modalCustomer?.data?.id}`)}>
              Open Customer Page
            </Button>
          </Row>
        }
        content={
          <ContentDetailCustomer
            detailCustomer={modalCustomer.data}
            pagination={pagination}
            checkedDate={defaultChecked}
            onChecked={(value: any) => {
              setDefaultChecked(!defaultChecked)
            }}
          />
        }
      />
    </div> 
  )
}

const ContentDetailCustomer = ({ checkedDate, onChecked, pagination, detailCustomer = {} }:any) => {
  const columns: any = [
    { title: 'Permission Name', dataIndex: 'customer' },
    { title: 'Module', dataIndex: 'module' },
  ]
  console.log(detailCustomer)
  return (
    <div>
      <Spacer size={20} />
      <Row alignItems="center" justifyContent="space-between">
        <Col width="45%">
          <DatePickerInput
            fullWidth
            value={checkedDate && moment()}
            label="Start Date"
          />
        </Col>
        <Col width="45%">
          <DatePickerInput
            fullWidth
            disabled={checkedDate}
            value={checkedDate && moment()}
            label="End Date"
          />
        </Col>
        <FlexElement style={{ paddingTop: "1.5rem", gap: "1px" }}>
          <Checkbox
            checked={checkedDate}
            onChange={onChecked}
          />
          <Text>Today</Text>
        </FlexElement>
      </Row>
      <Spacer size={20} />
      <Table columns={columns} data={[
        { customer: 'Approval Payment', module: 'Finance' },
        { customer: 'Create Payment', module: 'Finance' },
        { customer: 'Create Payment', module: 'Finance' },
        ]}
      />
      <Spacer size={20} />
      <Pagination pagination={pagination} />
      <Spacer size={20} />
    </div>
  )
}

const ActionButton = ({ onCancel, onReject, status }: any) => {
  const labelButtonLeft = status === "waiting" ? "Reject" : "Cancel"
  const labelButtonRight = status === "waiting" ? "Approve" : status === "draft" ? "Submit" : "Save"
  const fnButtonLeft = status === "waiting" ? onReject : onCancel
  const fnButtonRight = status === "waiting" ? onReject : onCancel

  const middleButtonAction = status === "draft" && (
    <Button variant="secondary">
      Save as Draft
    </Button>
  )

  return (
    <FlexElement style={{ gap: "10px" }}>
      <Button onClick={fnButtonLeft} variant="tertiary">
        {labelButtonLeft}
      </Button>
      {middleButtonAction}
      <Button onClick={fnButtonRight} variant="primary">
        {labelButtonRight}
      </Button>
    </FlexElement>
  )
}

const Forms = ({ status }: any) => {
  return (
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
        <Dropdown2
          width="100%"
          label="Division Name"
          height="50px"
          placeholder="Division Name"
          required
          disabled={status === "rejected" || status === "waiting"}
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
  gap: ${({ style }: any) => style?.gap};
  padding-top: ${({ style }: any) => style?.paddingTop};
`

const TextConfirmation = styled.p`
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
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