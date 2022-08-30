import React from 'react'
import styled from 'styled-components'
import { Spacer, Dropdown2 } from 'pink-lava-ui'

export default function Purchasing(props: any) {
  const { setValuePurchasing } = props
  const listFakeBranch = [
    { value: 'items-1', id: 'items-1' },
    { value: 'items-2', id: 'items-2' },
    { value: 'items-3', id: 'items-3' },
    { value: 'items-4', id: 'items-4' },
  ]

  return (
    <div>
      <Label>Payment</Label>
      <Spacer size={20} />
      <Dropdown2
        label="Term of Payment"
        width="60%"
        actionLabel="Add New Term of Payment"
        isShowActionLabel
        handleClickActionLabel={() => { }}
        items={listFakeBranch}
        handleChange={(value: string) =>
          setValuePurchasing("purchasing.term_of_payment", value)}
        onSearch={(search: string) => { }}
        required
      />
    </div>
  )
}

const Label = styled.p`
  font-weight: 600;
  font-size: 20px;
  line-height: 27px;
  color: #1E858E;
`