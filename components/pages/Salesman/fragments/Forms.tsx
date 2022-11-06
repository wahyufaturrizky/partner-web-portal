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
}: any) => {
  return (
    <Row width="100%" gap="12px">
      <Col width="48%">
        <Input
          width="100%"
          label={salesmanName}
          height="50px"
          placeholder={salesmanName}
          required
          value={forms?.name}
          disabled
        />
        <Spacer size={10} />
        <Input
          width="100%"
          label={branch}
          height="50px"
          placeholder={branch}
          required
          value={forms?.branch}
          disabled
        />
        <Spacer size={10} />
        <Input
          width="100%"
          label={idCard}
          height="50px"
          placeholder={idCard}
          required
          value={forms?.idCard}
          disabled
        />
        <Spacer size={10} />
        <Input
          width="100%"
          label={externalCode}
          height="50px"
          placeholder={externalCode}
          required
          value={forms?.externalCode}
          disabled
        />
      </Col>
      <Col width="48%">
        <Dropdown2
          width="100%"
          label={divisionName}
          height="50px"
          placeholder={divisionName}
          required
          items={salesDivision?.map((item: any) => {
            return {
              id: item?.code,
              value: item?.divisiName,
            };
          })}
          handleChange={(value: any) => setDivision(value)}
          defaultValue={queryDivision}
          onSearch={(value: any) => setSearch(value)}
          disabled={status === "Rejected" || status === "Waiting for Approval"}
        />
        <Spacer size={10} />
        <Input
          width="100%"
          label={mobileNumber}
          height="50px"
          value={forms?.mobileNumber}
          placeholder="External Code"
          required
          disabled
        />
        <Spacer size={10} />
        <Input
          width="100%"
          label={email}
          height="50px"
          placeholder={email}
          required
          value={forms?.email}
          disabled
        />
      </Col>
    </Row>
  );
};

export default Forms;
