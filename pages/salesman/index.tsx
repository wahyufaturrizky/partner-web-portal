import React, { useState } from 'react'
import {
  Search,
  DropdownMenuOptionGroupCustom,
  ContentSwitcher,
  DropdownMenu,
  Text,
  Spacer,
  Button,
  Table,
  Pagination,
} from 'pink-lava-ui'
import styled from 'styled-components'

import { useFetchListSalesman } from 'hooks/mdm/salesman/useSalesman'
import { options, downloadOptions } from 'components/pages/Salesman/constants'
import { useRouter } from 'next/router'

export default function Salesman() {
  const [tabActived, setTabActived] = useState('active')
  const [search, setSearch] = useState('')
  const router = useRouter()
  const propsSet = {
    status: {
      active: 10,
      inactive: 3,
      waiting : 3,
      reject: 3,
      draft: 3
    }
  }

  const columns = [
    {
      title: "Salesman ID",
      dataIndex: "idCard",
    },
    {
      title: "Salesman Name",
      dataIndex: "name",
    },
    {
      title: "Division Name",
      dataIndex: "division",
    },
    {
      title: "Status",
      dataIndex: "statusText",
      render: (value: string) => {
        const colors = value === 'Active'
          ? '#01A862'
          : value === 'Waiting for Approval'
            ? '#FFB400'
            : value === 'Rejected'
              ? '#ED1C24'
              : '#000000'
        const backgrounds = value === 'Active'
          ? '#E2FFF3'
          : value === 'Waiting for Approval'
            ? '#FFFBDF'
            : value === 'Rejected'
              ? '#FFE4E5'
              : '#F4F4F4'
        return (
          <StatusAktif style={{ background: backgrounds, color: colors}}>
            {value}
          </StatusAktif>
        )
      }
    },
    {
      title: "Action",
      render: ({ id, statusText }: any) => (
        <Button
          size="small"
          variant="tertiary"
          onClick={() => router.push({
            pathname: '/salesman/[salesman_id]',
            query: {
              salesman_id: id,
              status: statusText
            },
          })}
        >
          View Detail
        </Button>
      )
    },
  ]

  const isStatus = () => {
    switch (tabActived) {
      case 'active':
        return '0'
      case 'inactive':
        return '1'
      case 'waiting':
        return '2'
      case 'rejected':
        return '3'
      case 'draft':
        return '4'
      default:
        return '0'
    }
  }

  const { data, isLoading } = useFetchListSalesman({
    options: { onSuccess: () => {} },
    query: {
      status: isStatus(),
      search
    }
  })

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

      <CardHeader>
        <FlexElement>
          <Search
            width="380px"
            placeholder="Search Salesman ID, Employee, etc"
            onChange={({ target }: any) => setSearch(target.value)}
          /> 
          <DropdownMenuOptionGroupCustom
            handleChangeValue={(value: string[]) => {}}
            listItems={[
              {
                label: "By Country",
                list: [
                  { label: 'filter-1', value: 'filter-1' },
                  { label: 'filter-2', value: 'filter-2' },
                  { label: 'filter-3', value: 'filter-3' },
                ]
              }
            ]}
            label={false}
            width={194}
            roundedSelector
            defaultValue="All"
            placeholder="Filter"
            noSearch
          />
        </FlexElement>

        <DropdownMenu
          title="More"
          buttonVariant="secondary"
          buttonSize="big"
          textVariant="button"
          textColor="pink.regular"
          onClick={(e: any) => {}}
          menuList={downloadOptions(data)}
        />
      </CardHeader>
      <Spacer size={10} />
      <Card>
        <Table
          width="100%"
          loading={isLoading}
          columns={columns}
          data={data?.rows}
        />
        <Spacer size={50} />
        <Pagination pagination={{}} />
      </Card>
    </div>
  )
}

const FlexElement = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`


const Card = styled.div`
  background: #ffff;
  padding: 1rem;
  border-radius: 16px;
`

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
	background: #ffffff;
	border-radius: 16px;
	padding: 16px;
`;

const StatusAktif = styled.div`
  background: #F4F4F4;
  border-radius: 4px;
  color: ${({ style }: any) => style.color};
  background: ${({ style }) => style?.background};
  width: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  font-size: 14px;
  line-height: 24px;
`