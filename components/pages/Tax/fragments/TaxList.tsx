import React from "react";
import { Col, Table, Pagination, Button, Row, Spacer } from "pink-lava-ui";
export default function TaxList(props: any) {

  return (
    <>
      <Row gap="16px">
        <Button size="big" variant={"tertiary"} onClick={() => props.setShowCreateModal({ open: true, type: "create", data: {} })}>
          + Add New
        </Button>
      </Row>
      <Spacer size={20} />
      <Col gap={"60px"}>
        <Table
          loading={props.isLoading || props.isFetchingTax}
          dataSource={props.dataSource.filter((filtering: any) => filtering?.tax_item_type == "WITHHOLDING" && filtering?.deleted_by == null)}
          columns={props.columns.filter(
            (filtering: any) => filtering?.dataIndex !== "id" && filtering?.dataIndex !== "key" && filtering?.dataIndex !== "tax_item_type"
          )}
          // data={props.data.filter((filtering: any) => filtering?.tax_item_type == "WITHHOLDING")}
          // rowSelection={props.rowSelection}
        />
        <Pagination pagination={props.pagination} />
      </Col>
    </>
  );
}
