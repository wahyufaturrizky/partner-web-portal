import React from 'react'
import { Spacer, Table, Text, Dropdown } from 'pink-lava-ui'
import moment from 'moment';

export default function Purchasing() {

  const data = [
    {vendor: "Vendor A", validUntil: moment().format("DD/mm/YYYY")},
    {vendor: "Vendor B", validUntil: moment().format("DD/mm/YYYY")},
    {vendor: "Vendor C", validUntil: moment().format("DD/mm/YYYY")}
  ]

  const columns = [
    {
      title: "Vendor",
      dataIndex: "vendor",
    },
    {
      title: "Valid Until",
      dataIndex: "validUntil",
    }
  ]

  return (
    <div>
      <Text variant="headingMedium" color="blue.darker">Source of Supply</Text>
      <Spacer size={20} />
      <Table
        loading={false}
        columns={columns}
        data={data}
      />
      <Spacer size={21} />
      <Text
        clickable
        variant="button"
        color="pink.regular"
      >
        View Product Vendor Assignment &gt;
      </Text>
      <Spacer size={36} />
      <Dropdown
        label="Purchasing Tax"
        width="536px"
        noSearch
        items={[]}
        handleChange={(_: any) => {}}
      />
    </div>
  )
}