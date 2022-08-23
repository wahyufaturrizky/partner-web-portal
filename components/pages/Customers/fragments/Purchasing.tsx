import React from 'react'
import styled from 'styled-components'
import { Spacer, Dropdown } from 'pink-lava-ui'

export default function Purchasing() {
  return (
    <div>
      <Label>Payment</Label>
      <Spacer size={20} />
      <Dropdown
        label="Term of Payment"
        width="60%"
        actionLabel="Add New Term of Payment"
        isShowActionLabel
        handleClickActionLabel={() => { }}
        noSearch
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