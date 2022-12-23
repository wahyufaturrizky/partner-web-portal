import Router from "next/router";
import {
  Accordion, Button, Col, Dropdown, Input, Row, Spacer, Text,
} from "pink-lava-ui";
import React, { useState } from "react";
import styled from "styled-components";
import { useConfigs } from "../../../../hooks/config/useConfig";
import { useCreateProcessList } from "../../../../hooks/business-process/useProcess";

export interface ConfigModuleList {}

const CreateProcessList: any = () => {
  const [dataListDropdownModul, setDataListDropdownModul] = useState(null);
  const [stateFieldInput, setStateFieldInput] = useState({
    name: "",
  });
  const { name } = stateFieldInput;

  const handleChangeInput = (e) => {
    setStateFieldInput({
      ...stateFieldInput,
      [e.target.id]: e.target.value,
    });
  };

  const { mutate: createFieldProcessList, isLoading: isLoadingCreateProcessList } =		useCreateProcessList({
		  options: {
		    onSuccess: (data) => {
		      if (data) {
		        window.alert("Process created successfully");
		        Router.back();
		      }
		    },
		    onError: (error) => {
		      if (error?.data) {
		        window.alert(error.data.errors && error.data.errors[0].message);
		      } else {
		        window.alert(error.data.message);
		      }
		    },
		  },
  });

  const {
    data: dataConfigsModule,
    refetch: refetchConfigModule,
    isLoading: isLoadingConfigModule,
  } = useConfigs();

  const handleCreateProcessList = () => {
    const isEmptyField = Object.keys(stateFieldInput).find(
      (thereIsEmptyField) => stateFieldInput && stateFieldInput[thereIsEmptyField] === "",
    );

    if (!isEmptyField) {
      const data = {
        name,
        module_id: dataListDropdownModul,
      };
      createFieldProcessList(data);
    } else {
      window.alert(`field ${isEmptyField} must be fill!`);
    }
  };

  const handleChangeDropdown = (value) => {
    setDataListDropdownModul(value);
  };

  return (
    <Col>
      <Row gap="4px">
        <Text variant="h4">Create Process</Text>
      </Row>
      <Card padding="20px">
        <Row justifyContent="flex-end" alignItems="center" nowrap>
          <Row>
            <Row gap="16px">
              <Button size="big" variant="tertiary" onClick={() => Router.back()}>
                Cancel
              </Button>
              <Button size="big" variant="primary" onClick={handleCreateProcessList}>
                {isLoadingCreateProcessList ? "loading..." : "Save"}
              </Button>
            </Row>
          </Row>
        </Row>
      </Card>

      <Spacer size={20} />

      <Accordion style={{ display: "relative" }} id="area">
        <Accordion.Item key={1}>
          <Accordion.Header variant="blue">General</Accordion.Header>
          <Accordion.Body>
            <Row width="100%" gap="20px" noWrap>
              {/* TODO: HIDE AFTER INCLUDING IN SPRINT */}
              {/* <Row alignItems="center" gap="4px">
									<Checkbox checked={isApproval} onChange={() => setIsApproval(!isApproval)} />
									<div style={{ cursor: "pointer" }} onClick={() => setIsApproval(!isApproval)}>
										<Text variant={"h6"}>Approval</Text>
									</div>
								</Row> */}
            </Row>
            <Row width="100%" gap="20px" noWrap>
              <Col width="100%">
                <Input
                  id="name"
                  width="100%"
                  label="Name"
                  height="48px"
                  placeholder="e.g Shipment and Delivery"
                  onChange={handleChangeInput}
                />
              </Col>
              <Col width="100%">
                <Dropdown
                  containerId="area"
                  width="100%"
                  label="Modul"
                  loading={isLoadingConfigModule}
                  items={
											dataConfigsModule
											&& dataConfigsModule?.rows.map((data) => ({ id: data.id, value: data.name }))
										}
                  placeholder="Select"
                  handleChange={handleChangeDropdown}
                  noSearch
                />
                {/* <div style={{ cursor: "pointer" }} onClick={() => {}}>
										<Text variant="headingSmall" color="pink.regular">
											Go to Associated Modul >
										</Text>
									</div> */}
              </Col>
            </Row>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Col>
  );
};

const Span = styled.div`
	font-size: 14px;
	line-height: 18px;
	font-weight: normal;
	color: #ffe12e;
`;

const Record = styled.div`
	height: 54px;
	padding: 0px 20px;
	display: flex;
	align-items: center;
	border-top: ${(p) => (p.borderTop ? "0.5px solid #AAAAAA" : "none")};
`;

const Card = styled.div`
	background: #ffffff;
	border-radius: 16px;
	padding: ${(p) => (p.padding ? p.padding : "16px")};
`;

export default CreateProcessList;
