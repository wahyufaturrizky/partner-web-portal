import React, { useEffect, useState } from "react";

import { Col, Spacer, Input, Button, Row, Search, Table } from "pink-lava-ui";

export default function TaxTypeForm(props: any) {
  const { register, columns ,data} = props;
  console.log(data);

  return (
    <>
      <Row gap="20px" width="100%" justifyContent="space-between">
        <Col width="80%">
          <Input
            width="100%"
            height="48px"
            placeholder="e.g Front Groceries No. 5"
            label="Tax Name"
            required
            {...register(`tax_name`, {
              required: "Tax Name must be filled",
            })}
          />
        </Col>
        <Col justifyContent="flex-end" alignItems="center" style={{ paddingBottom: "5px" }} nowrap>
          <Button size="big" variant={"primary"}>
            View
          </Button>
        </Col>
      </Row>
      <Spacer size={20} />
      <hr style={{ borderTop: "dashed 1px" }} />
      <Spacer size={20} />
      <Row gap="20px" width="100%" justifyContent="space-between">
        <Search width="80%" placeholder="Search Tax ID, Country" />
        <Button size="big" variant={"tertiary"}>
          Delete
        </Button>
      </Row>
      <Spacer size={20} />
      <Col gap={"60px"}>
        <Table
          // loading={isLoadingTop || isFetchingTop}
          columns={columns}
          data={data}
        />
      </Col>
    </>
  );
}
