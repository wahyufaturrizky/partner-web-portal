import React from "react";
import { Dropdown2, Spacer, Row, Col, Input } from "pink-lava-ui";

const Forms = ({
  queryDivision,
  status,
  forms,
  setDivision,
  salesDivision,
  setSearch,
  salesmanName,
  branch,
  idCard,
  externalCode,
  divisionName,
  mobileNumber,
  email,
}: any) => (
  <Row width="100%" gap="12px">
    <Col width="48%">
      <Input
        width="100%"
        label={salesmanName}
        height="50px"
        placeholder={salesmanName}
        required
        value={forms?.name}
        disabled={status !== "Rejected"}
      />
      <Spacer size={10} />
      <Input
        width="100%"
        label={branch}
        height="50px"
        placeholder={branch}
        required
        value={forms?.branch}
        disabled={status !== "Rejected"}
      />
      <Spacer size={10} />
      <Input
        width="100%"
        label={idCard}
        height="50px"
        placeholder={idCard}
        required
        value={forms?.idCard}
        disabled={status !== "Rejected"}
      />
      <Spacer size={10} />
      <Input
        width="100%"
        label={externalCode}
        height="50px"
        placeholder={externalCode}
        value={forms?.externalCode}
        disabled={status !== "Rejected"}
      />
    </Col>
    <Col width="48%">
      <Dropdown2
        width="100%"
        labelBold
        label={divisionName}
        height="50px"
        placeholder={divisionName}
        required
        items={salesDivision?.map((item: any) => ({
          id: item?.code,
          value: item?.divisiName,
        }))}
        handleChange={(value: any) => setDivision(value)}
        defaultValue={queryDivision}
        onSearch={(value: any) => setSearch(value)}
        disabled={status === "Waiting for Approval"}
      />
      <Spacer size={10} />
      <Input
        width="100%"
        label={mobileNumber}
        height="50px"
        value={forms?.mobileNumber}
        placeholder="082274586011"
        required
        disabled={status !== "Rejected"}
      />
      <Spacer size={10} />
      <Input
        width="100%"
        label={email}
        height="50px"
        placeholder={email}
        value={forms?.email}
        disabled={status !== "Rejected"}
      />
    </Col>
  </Row>
);

export default Forms;
