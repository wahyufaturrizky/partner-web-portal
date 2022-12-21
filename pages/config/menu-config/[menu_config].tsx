import React, { useState } from "react";
import styled from "styled-components";
import {
  Text,
  Col,
  Row,
  Spacer,
  Dropdown,
  Table,
  Button,
  Accordion,
  Input,
} from "pink-lava-ui";

import { ModalDeleteConfirmation } from "../../../components/elements/Modal/ModalConfirmationDelete";

const PermissionDetail: any = () => {
  const [modalDelete, setModalDelete] = useState({ open: false });

  const columns = [
    {
      title: "Modules",
      dataIndex: "modules",
    },
    {
      title: "",
      dataIndex: "action",
      width: 160,
    },
  ];

  const data = [
    {
      key: 1,
      modules: "SFA",
      action: (
        <Button size="small" onClick={() => {}} variant="tertiary">
          View Detail
        </Button>
      ),
    },
    {
      key: 2,
      modules: "Taking Order",
      action: (
        <Button size="small" onClick={() => {}} variant="tertiary">
          View Detail
        </Button>
      ),
    },
  ];

  return (
    <>
      <Col>
        <Row gap="4px">
          <Text variant="h4">Sales</Text>
        </Row>
        <Spacer size={12} />
        <Card padding="20px">
          <Row justifyContent="flex-end" alignItems="center" nowrap>
            <Row>
              <Row gap="16px">
                <Button
                  size="big"
                  variant="tertiary"
                  onClick={() => setModalDelete({ open: true })}
                >
                  Delete
                </Button>
                <Button size="big" variant="primary" onClick={() => {}}>
                  Save
                </Button>
              </Row>
            </Row>
          </Row>
        </Card>

        <Spacer size={20} />

        <Accordion>
          <Accordion.Item key={1}>
            <Accordion.Header variant="blue">General</Accordion.Header>
            <Accordion.Body>
              <Row width="100%" gap="20px" noWrap>
                <Input width="100%" label="Name" height="48px" placeholder="e.g Sales" />
                <Dropdown
                  label="Parent Module"
                  width="100%"
                  items={["None", "Shipment"]}
                  placeholder="Select"
                  onSelect={() => {}}
                  noSearch
                />
              </Row>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <Spacer size={20} />

        <Accordion>
          <Accordion.Item key={1}>
            <Accordion.Header variant="blue">
              <Row gap="8px" alignItems="baseline">
                Sub Module
              </Row>
            </Accordion.Header>
            <Accordion.Body>
              <Table columns={columns} data={data} />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Col>

      {modalDelete.open && (
      <ModalDeleteConfirmation
        visible={modalDelete.open}
        onCancel={() => setModalDelete({ open: false })}
        onOk={() => {}}
        itemTitle="Test"
      />
      )}
    </>
  );
};

const Card = styled.div`
	background: #ffffff;
	border-radius: 16px;
	padding: ${(p) => (p.padding ? p.padding : "16px")};
`;

export default PermissionDetail;
