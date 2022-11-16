import React from 'react'
import { Spacer, Table, Text, Dropdown } from 'pink-lava-ui'
import moment from 'moment';
import { lang } from 'lang';

export default function Purchasing() {
  const t = localStorage.getItem("lan") || "en-US";

  const data = [
    {vendor: "Vendor A", validUntil: moment().format("DD/mm/YYYY")},
    {vendor: "Vendor B", validUntil: moment().format("DD/mm/YYYY")},
    {vendor: "Vendor C", validUntil: moment().format("DD/mm/YYYY")}
  ]

  const columns = [
    {
      title: lang[t].productList.create.table.vendor,
      dataIndex: "vendor",
    },
    {
      title: lang[t].productList.create.table.validUntil,
      dataIndex: "validUntil",
    }
  ]

  return (
    <div>
      <Text variant="headingMedium" color="blue.darker">{lang[t].productList.create.field.purchasing.sourceOfSupply}</Text>
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
        label={lang[t].productList.create.field.purchasing.purchasingTax}
        width="536px"
        noSearch
        items={[]}
        handleChange={(_: any) => {}}
      />
    </div>
  )
}