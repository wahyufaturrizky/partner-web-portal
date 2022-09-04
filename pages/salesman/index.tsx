import React, { useState } from 'react'
import { Search, ContentSwitcher, DropdownMenu, Text, Spacer } from 'pink-lava-ui'
import styled from 'styled-components'

import {
  Active,
  Draft,
  Inactive,
  Rejected,
  WaitingForApproval
} from '../../components/pages/Salesman/fragments'
import { options, downloadOptions } from '../../components/pages/Salesman/constants'

export default function Salesman() {
  const [tabActived, setTabActived] = useState('active')
  const propsSet = {
    status: {
      active: 10,
      inactive: 3,
      waiting : 3,
      reject: 3,
      draft: 3
    }
  }

  const switchTabItem = () => {
    switch (tabActived) {
      case 'active':
        return <Active />
      case 'inactive':
        return <Inactive />
      case 'waiting':
        return <WaitingForApproval />
      case 'rejected':
        return <Rejected />
      case 'draft':
        return <Draft />
      default:
        return <Active />
    }
  }

  return (
    <div>
      <Text variant="h4">Salesman List</Text>
      <Spacer size={20} />
      <ContentSwitcher
        options={options(propsSet)}
        defaultValue={tabActived}
        onChange={(value: string) => setTabActived(value)}
      />

      <Spacer size={10} />

      <Card>
        <FlexElement>
          <Search
            width="380px"
            placeholder="Search Salesman ID, Employee, etc"
            onChange={({ target }: any) => { }}
          /> 
          <Search
            width="260px"
            placeholder="Search Salesman ID, Employee, etc"
            onChange={({ target }: any) => { }}
          />
        </FlexElement>

        <DropdownMenu
          title="More"
          buttonVariant="secondary"
          buttonSize="big"
          textVariant="button"
          textColor="pink.regular"
          onClick={(e: any) => {}}
          menuList={downloadOptions()}
        />
      </Card>
      <Spacer size={10} />
      {switchTabItem()}
    </div>
  )
}

const FlexElement = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const Card = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
	background: #ffffff;
	border-radius: 16px;
	padding: 16px;
`;