import React from 'react'
import styled from 'styled-components'
import { Spacer, Dropdown } from 'pink-lava-ui'

import { useTermOfPayments } from '../../../../hooks/mdm/term-of-payment/useTermOfPayment';

export default function Purchasing(props: any) {
  const { setValuePurchasing } = props

  const { data: getDataTermOfPayment } = useTermOfPayments({
    options: {
      onSuccess: () => {}
    },
    query: {
      company_id: "KSNI"
    }
  })

  const listItemsOfPayment = getDataTermOfPayment?.rows?.map
    (({ topId, name }: any) => { return { value: name, id: topId } })
  
  return (
    <div>
      <Label>Payment</Label>
      <Spacer size={20} />
      <Dropdown
        label="Term of Payment"
        width="70%"
        actionLabel="Add New Term of Payment"
        isShowActionLabel
        handleClickActionLabel={() => window.open('/term-of-payment/create')}
        items={listItemsOfPayment}
        handleChange={(value: string) => {
          setValuePurchasing("purchasing.term_of_payment", value)
        }}
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