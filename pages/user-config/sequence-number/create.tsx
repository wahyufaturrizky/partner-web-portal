import React from "react";
import { Text, Col, Row, Spacer, Dropdown, Button, Accordion, Input, Checkbox } from "pink-lava-ui";
import styled from "styled-components";
import Router from "next/router";

export default function SequenceConfig() {
  return (
    <Col>
    <Row gap="4px" alignItems="center">
      <Text variant={"h4"}>Create New Sequence</Text>
    </Row>
    <Spacer size={12} />
    <HeaderAction>
        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
          <Button
            size="big"
            variant={"tertiary"}
            onClick={() => Router.push("/user-config/sequence-number")}>
            Cancel
          </Button>
          <Button size="big" variant={"primary"}>
            Save
          </Button>
        </div>    
    </HeaderAction>

    <Spacer size={20} />

    <Accordion>
      <Accordion.Item key={1}>
        <Accordion.Header variant="blue">General</Accordion.Header>
        <Accordion.Body>
          <Col width="100%" gap="20px">
            <Row width="100%" gap="20px" noWrap>
              <Input
                width="100%"
                label="Sequence Name"
                height="48px"
                noSearch
                placeholder="e.g Transaction Quotation"
              />
              <Dropdown
                label="Process"
                width={"536px"}
                noSearch
                placeholder="Select"
              />
            </Row>
            <Row width="100%" gap="20px" noWrap>
              <Input
                width="100%"
                label="Company"
                height="48px"
                noSearch
                placeholder={"e.g Grace"}
              />
              <Dropdown
                label={[""]}
                width={"536px"}
                noSearch
                placeholder={"Select"}
              />
            </Row>
          </Col>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>

    <Spacer size={20} />

    <Accordion>
      <Accordion.Item key={2}>
        <Accordion.Header variant="blue">Number Allocation</Accordion.Header>
        <Accordion.Body>
          <Row width="100%" gap="20px" noWrap>
            <Input
              width="100%"
              label="Sequence Code Preview"
              height="48px"
              placeholder={"e.g grace@nabatisnack.co.id"}
            />
          </Row>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  </Col>
  )
}


const HeaderAction = styled.div`
  background: #ffffff;
	border-radius: 16px;
  padding: 16px;
  display: flex;
  justify-content: end
`