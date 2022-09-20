import React from 'react'
import {
  Pagination,
  Checkbox,
  Spacer,
  Text,
  Row,
  Col,
  Table,
  DatePickerInput,
} from 'pink-lava-ui'
import moment from 'moment'
import { columnsDetailCustomers } from '../constants'
import { FlexElement } from './ActionButton'

const ContentDetailCustomer = ({
  checkedDate = false,
  onChecked,
  pagination
}: any) => {

  return (
    <div>
      <Spacer size={20} />
      <Row alignItems="center" justifyContent="space-between">
        <Col width="45%">
          <DatePickerInput
            fullWidth
            placeholder="input start date"
            value={checkedDate && moment()}
            defaultValue={moment()}
            label="Start Date"
          />
        </Col>
        <Col width="45%">
          <DatePickerInput
            fullWidth
            disabled={checkedDate}
            placeholder="end start date"
            defaultValue={moment()}
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
      <Table
        columns={columnsDetailCustomers}
        data={[
          { branch: 'PT. Indomaret Buah Batu', frequency: 'M1', day: 'Monday', date: '02/02/2022', startTime: '08:00:00', endTime: '08:30:00', duration: '0 Days, 0 Hours, 30 minutes, 00 seconds' },
          { branch: 'PT. Indomaret Buah Batu', frequency: 'M2', day: 'Tuesday', date: '02/02/2022', startTime: '09:00:00', endTime: '08:30:00', duration: '0 Days, 0 Hours, 30 minutes, 00 seconds' },
          { branch: 'PT. Indomaret Buah Batu', frequency: 'M3', day: 'Wednesday', date: '02/02/2022', startTime: '10:00:00', endTime: '08:30:00', duration: '0 Days, 0 Hours, 30 minutes, 00 seconds' },
        ]}
      />
      <Spacer size={20} />
      <Pagination pagination={pagination} />
      <Spacer size={20} />
    </div>
  )
}

export default ContentDetailCustomer