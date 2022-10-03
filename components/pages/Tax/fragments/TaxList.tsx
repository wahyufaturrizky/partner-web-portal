import React from 'react'
import {
  Col,
  Table,
  Pagination,
  Button,
  Row,
  Spacer
} from "pink-lava-ui";
export default function TaxList(props: any) {
  console.log("list tax",props.data);
  
  return (
    <>
    <Row gap="16px">
    <Button size="big" variant={"tertiary"} onClick={() => props.setShowCreateModal(true)}>
        + Add New
    </Button>
    </Row>
    <Spacer size={20}/>
    <Col gap={"60px"}>
        <Table
        loading={props.isLoading || props.isFetchingTax}
        columns={props.columns.filter(
          (filtering :any) => filtering?.dataIndex !== "id" && filtering?.dataIndex !== "key"
        )}
        data={props.data}
        // rowSelection={props.rowSelection}
        />
        <Pagination pagination={props.pagination} />
    </Col>
    </>
  )
}
