import React from 'react'
import { Table, Button, Spacer, Pagination } from 'pink-lava-ui'
import { useRouter } from 'next/router'
import styled from 'styled-components'

export default function Rejected() {
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
      render: () => <StatusAktif>Rejected</StatusAktif>
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
              salesman_id: 123,
              status: 'rejected'
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
  background: #FFE4E5;
  border-radius: 4px;
  color: #ED1C24;
  width: 76px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  font-size: 14px;
  line-height: 24px;
`