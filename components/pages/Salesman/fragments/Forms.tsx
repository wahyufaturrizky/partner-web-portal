import React from 'react'
import {
  Dropdown2,
  Spacer,
  Row,
  Col,
  Input,
} from 'pink-lava-ui'

const Forms = ({
  code,
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
          items={salesDivision?.map((item: any) => {
            return {
              id: item?.code,
              value: item?.divisiName,
            }
          })}
          handleChange={(value: any) => setDivision(value)}
          defaultValue={code || 'sales division not found'}
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

export default Forms