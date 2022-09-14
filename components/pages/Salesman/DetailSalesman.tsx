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
import usePagination from '@lucasmogari/react-pagination'

import ArrowLeft from 'assets/icons/arrow-left.svg'
import { ModalConfirmation } from 'components/elements/Modal/ModalConfirmation'
import { useFetchDetailSalesman, useUpdateSalesman } from 'hooks/mdm/salesman/useSalesman'
import { useFetchSalesmanDivision } from 'hooks/mdm/salesman/useSalesmanDivision'

const dropdownStatus = [
  { id: "Active", value: "Active" },
  { id: "Inactive", value: "Inactive" },
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
  const [search, setSearch] = useState<string>('')
  const [division, setDivision] = useState('')
  const [remarks, setRemarks] = useState('')
  const [defaultChecked, setDefaultChecked] = useState<boolean>(false)
  const [modalCustomer, setModalCustomer] = useState<any>({
    visible: false,
    data: {}
  })
  const [modalActive, setModalActive] = useState('')
  const [modal, setModal] = useState({
    visible: false,
    confirmation: false,
    reason: false
  })
  const [modalConfirmation, setModalConfirmation] = useState<any>({
    Active: false,
    Inactive: false,
    Approve: false,
    Rejected: false,
    Waiting: false
  })

  const { data } = useFetchDetailSalesman({
    id: salesman_id,
    options: {
      onSuccess: (response: any) => {
        setDivision(response?.division)
      }
    }
  })

  const { data: listSalesDivision } = useFetchSalesmanDivision({
    options: { onSuccess: () => { } },
    query: {
      search
    }
  })

  const { mutate: handleUpdateSalesman } = useUpdateSalesman({
    options: {
      onSuccess: () => {
        router.push('/salesman')
      }
    },
    id: salesman_id,
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
          variant="tertiary"
          onClick={() => setModalCustomer({ ...modalCustomer, visible: true, data: items })}
        >
          View Detail
        </Button>
      )
    },
  ]

  let setDvs = status === 'Waiting for Approval' ? data?.division : division
  const payloads = {
    code: data?.code,
    company: data?.company,
    name: data?.name,
    division: data?.division,
    branch: data?.branch,
    mobile_number: data?.mobileNumber,
    email: data?.email,
    external_code: data?.externalCode,
    id_card: data?.idCard,
    status: 0,
    tobe: 0,
    remark: ""
  }


  const setActionButton = () => {
    switch(status) {
      case 'Active' || 'Inactive' || 'Rejected':
        return <ActionButton
          status={status}
          onSubmit={_handleUpdateSalesman}
          onCancel={() => router.back()}
        />
      case 'Waiting for Approval':
        return <ActionButton
          status={status}
          onSubmit={_handleUpdateSalesman}
          onReject={() => setModalConfirmation({ ...modalConfirmation, Rejected: true  })}
        />
      case 'Draft':
        return <ActionButton
          onSubmit={_handleUpdateSalesman}
          status={status}
          onDraft={_handleDraftedSalesman}
        />
      default:
        return <ActionButton
          status={status}
          onCancel={() => router.back()} />
    }
  }

  const _handleUpdateSalesman = () => {
    const stt = status === 'Draft' ? 2 : 0
    const setTobe = status === 'Waiting for Approval' ? -1: 0
    const dataUpdated: any = {
      ...payloads,
      division: setDvs,
      status: stt,
      tobe: setTobe
    }

    handleUpdateSalesman(dataUpdated)
  }

  const _handleDraftedSalesman = () => {
    const dataUpdated: any = {
      ...payloads,
      division,
      status: 4,
      tobe: -1
    }

    handleUpdateSalesman(dataUpdated)
  }

  const setColorStatus = () => {
    switch(status) {
      case 'Waiting for Approval':
        return '#FFB400'
      case 'Rejected':
        return '#ED1C24'
      case 'Draft':
        return '#00000'
    }
  }

  const onhandleSwitchStatus = () => {
    const dataUpdated: any = {
      ...payloads,
      division,
      status: modalActive === 'Active' ? 0 : 1,
      tobe: modalActive === 'Active' ? 0 : 1,
      remark: remarks,
    }
    handleUpdateSalesman(dataUpdated)
  }

  const onhandleRejected = () => {
    const dataUpdated: any = {
      ...payloads,
      division: setDvs,
      remark: remarks,
      status: 3,
      tobe: -1
    }
    return handleUpdateSalesman(dataUpdated)
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
            status === 'Active' || status === 'Inactive'
              ? (
                <Dropdown
                  label={false}
                  width="185px"
                  noSearch
                  items={dropdownStatus}
                  defaultValue={status}
                  placeholder="Select"
                  handleChange={(value: any) => {
                    setModalActive(value)
                    setModal({
                      ...modal,
                      visible: true,
                      confirmation: true,
                      reason: false
                    })
                  }}
                />
              ) : (
                <StatusCustomer color={setColorStatus()}>
                  {status}
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
              <Forms
                forms={data}
                salesDivision={listSalesDivision?.rows || []}
                status={status}
                setDivision={setDivision}
                setSearch={setSearch}  
              />
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
              <Table
                loading={isLoading}
                columns={columns}
                data={listCustomers}
              />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Card>

      <ModalConfirmation
        title={
          modal.reason
            ? `Add Reason ${modalActive}`
            : 'Confirmation'
        }
        visible={modal.visible}
        content={[
          modal.confirmation === true && modal.reason === false
          ? (
              <>
                <TextConfirmation>
                  Are you sure to {modalActive} this salesman?
                  <Spacer size={30} />
                </TextConfirmation>
              </>
          )
          : (
              <>
                <Spacer size={20} />
                <TextArea
                  rows={5}
                  label={false}
                  placeholder="type here..."
                  onChange={({ target }: any) => setRemarks(target.value)}
                />
                <Spacer size={20} />
              </>
          )
        ]}
        onOk={() => modal.reason
          ? onhandleSwitchStatus()
          : setModal({
            ...modal,
            visible: true,
            confirmation: false,
            reason: true
          })
        }
        variantBtnLeft={status === "Waiting For Approval" ? "tertiary" : "secondary"}
        onCancel={() =>
          setModal({
            ...modal,
            confirmation: false,
            visible: false,
            reason: false
          })}
      />

      {/* modal confirmation rejected */}
      <ModalConfirmation
        title="Are you sure to reject?"
        visible={modalConfirmation.Rejected}
        content={[
          <>
            <Spacer size={20} />
            <TextArea
              rows={5}
              label={false}
              placeholder="Write your remarks here..."
              onChange={({ target }: any) => setRemarks(target.value)}
            />
            <Spacer size={20} />
          </>
        ]}
        onOk={onhandleRejected}
        variantBtnLeft={status === "waiting" ? "tertiary" : "secondary"}
        onCancel={() => setModalConfirmation({ ...modalConfirmation, Rejected: false })}
      />

      {/* modal view detail customers */}
      <Modal
        width={900}
        visible={modalCustomer.visible}
        title={modalCustomer?.data?.name}
        onCancel={() => setModalCustomer({ visible: false, data: {}})}
        footer={
          <Row justifyContent="end">
            <Button onClick={() => window.open(`/customers/${modalCustomer?.data?.id}`)}>
              Open Customer Page
            </Button>
          </Row>
        }
        content={
          <ContentDetailCustomer
            detailCustomer={modalCustomer?.data}
            pagination={pagination}
            checkedDate={defaultChecked}
            // onChecked={(value: any) => setDefaultChecked(!defaultChecked)}
          />
        }
      />
    </div> 
  )
}

const ContentDetailCustomer = ({
  checkedDate = false,
  onChecked,
  pagination
}:any) => {
  const columns: any = [
    {
      title: 'Permission Name',
      dataIndex: 'customer'
    },
    {
      title: 'Module',
      dataIndex: 'module'
    },
  ]

  return (
    <div>
      <Spacer size={20} />
      <Row alignItems="center" justifyContent="space-between">
        <Col width="45%">
          <DatePickerInput
            fullWidth
            // value={checkedDate && moment()}
            label="Start Date"
          />
        </Col>
        <Col width="45%">
          <DatePickerInput
            fullWidth
            // disabled={checkedDate}
            // value={checkedDate && moment()}
            label="End Date"
          />
        </Col>
        <FlexElement style={{ paddingTop: "1.5rem", gap: "1px" }}>
          <Checkbox
            // checked={checkedDate}
            // onChange={onChecked}
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
      {/* <Pagination pagination={pagination} /> */}
      <Spacer size={20} />
    </div>
  )
}

const ActionButton = ({
  onCancel,
  onReject,
  onSubmit,
  onDraft,
  status
}: any) => {
  const labelButtonLeft = status === "Waiting for Approval" ? "Reject" : "Cancel"
  const labelButtonRight = status === "Waiting for Approval" ? "Approve" : status === "Draft" ? "Submit" : "Save"
  const fnButtonLeft = status === "Waiting for Approval" ? onReject : onCancel

  const middleButtonAction = status === "Draft" && (
    <Button onClick={onDraft} variant="secondary">
      Save as Draft
    </Button>
  )

  return (
    <FlexElement style={{ gap: "10px" }}>
      <Button onClick={fnButtonLeft} variant="tertiary">
        {labelButtonLeft}
      </Button>
      {middleButtonAction}
      <Button onClick={onSubmit} variant="primary">
        {labelButtonRight}
      </Button>
    </FlexElement>
  )
}

const Forms = ({
  status,
  forms,
  setDivision,
  salesDivision,
  setSearch
}: any) => {
  return (
    <Row width="100%" gap="12px">
      <Col width="48%">
        <Input
          width="100%"
          label="Salesman Name"
          height="50px"
          placeholder="Salesman Name"
          required
          value={forms?.name}
          disabled
        />
        <Spacer size={10} />
        <Input
          width="100%"
          label="Branch"
          height="50px"
          placeholder="Branch"
          required
          value={forms?.branch}
          disabled
        />
        <Spacer size={10} />
        <Input
          width="100%"
          label="ID Card"
          height="50px"
          placeholder="ID Card"
          required
          value={forms?.idCard}
          disabled
        />
        <Spacer size={10} />
        <Input
          width="100%"
          label="External Code"
          height="50px"
          placeholder="External Code"
          required
          value={forms?.externalCode}
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
          items={salesDivision?.map((item: any) => { return {
            id: item?.code,
            value: item?.divisiName,
          } })}
          handleChange={(value: any) => setDivision(value)}
          defaultValue={forms?.division || 'sales division not found'}
          onSearch={(value: any) => setSearch(value)}
          disabled={status === "Rejected" || status === "Waiting for Approval"}
        />
        <Spacer size={10} />
        <Input
          width="100%"
          label="Mobile Number"
          height="50px"
          value={forms?.mobileNumber}
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
          value={forms?.email}
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