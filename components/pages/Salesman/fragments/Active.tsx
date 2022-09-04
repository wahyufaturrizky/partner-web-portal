import React from 'react'
import { Table, Button, Spacer, Pagination } from 'pink-lava-ui'
import { useRouter } from 'next/router'
import styled from 'styled-components'

export default function Active() {
  const router = useRouter()

  const columns = [
    {
      title: "Salesman ID",
      dataIndex: "salesman_id",
    },
    {
      title: "Salesman Name",
      dataIndex: "salesman_name",
    },
    {
      title: "Division Name",
      dataIndex: "division_name",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: () => <StatusAktif>Aktif</StatusAktif>
    },
    {
      title: "Action",
      dataIndex: "action",
      render: () => (
        <Button
          size="small"
          onClick={() => router.push({
            pathname: '/salesman/[salesman_id]',
            query: {
              status: 'active',
              salesman_id: 123,
            },
          })}
          variant="tertiary"
        >
          View Detail
        </Button>
      )  
    },
  ]

  return (
    <Card>
      <Table
        width="100%"
        loading={false}
        columns={columns}
        data={[1, 2, 3, 4]}
      />
      <Spacer size={50} />
      <Pagination pagination={{}} />
    </Card>
  )
}

const Card = styled.div`
  background: #ffff;
  padding: 1rem;
  border-radius: 16px;
`

const StatusAktif = styled.div`
  background: #E2FFF3;
  border-radius: 4px;
  color: #01A862;
  width: 56px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  font-size: 14px;
  line-height: 24px;
`
