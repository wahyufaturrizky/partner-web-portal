import React from "react";
import { Col, Table, Pagination, Button, Row, Spacer } from "pink-lava-ui";
export default function VatList(props: any) {
  return (
    <>
      <Row gap="16px">
        <Button
          size="big"
          variant={"tertiary"}
          onClick={() => props.setShowCreateModal({ open: true, type: "create", data: {} })}
        >
          + Add New
        </Button>
      </Row>
      <Spacer size={20} />
      <Col gap={"60px"}>
        <Table
          loading={props.isLoading || props.isFetchingTax}
          dataSource={props.dataSource.filter(
            (filtering: any) => filtering?.tax_item_type == "VAT" && filtering?.deleted_by == null
          )}
          columns={props.columns.filter(
            (filtering: any) =>
              filtering?.dataIndex !== "id" &&
              filtering?.dataIndex !== "key" &&
              filtering?.dataIndex !== "tax_item_type" &&
              filtering?.dataIndex !== "percentage_subject_to_tax" &&
              filtering?.dataIndex !== "withholding_tax_rate"
          )}
          // data={props.data.filter((filtering: any) => filtering?.tax_item_type == "VAT")}
          // rowSelection={props.rowSelection}
        />
        <Pagination pagination={props.pagination} />
      </Col>
    </>
  );
}
