import React, { useState } from "react";
import {
  Text,
  Col,
  Row,
  Spacer,
  Dropdown,
  Button,
  Accordion,
  Input,
  TextArea,
  Dropdown2,
  Switch,
  Spin,
  Checkbox,
} from "pink-lava-ui";
import styled from "styled-components";
import Router, { useRouter } from "next/router";
import ArrowLeft from "../../../assets/icons/arrow-left.svg";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import usePagination from "@lucasmogari/react-pagination";

const AddSequenceNumber: any = () => {
  const router = useRouter();

  const pagination = usePagination({
    page: 1,
    itemsPerPage: 10,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
  });

  return (
    <>
      <Col>
        <Row gap="4px" alignItems="center">
          <ArrowLeft style={{ cursor: "pointer" }} onClick={() => Router.push("/company-list")} />
          <Text variant={"h4"}>Add Sequence</Text>
        </Row>
        <Spacer size={12} />
        <Card padding="20px">
          <Row justifyContent="flex-end" alignItems="center" nowrap>
            <Row>
              <Row gap="16px">
                <Button
                  size="big"
                  variant={"tertiary"}
                  onClick={() => Router.push("/company-list")}
                >
                  Cancel
                </Button>
                <Button size="big" variant={"primary"}>
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
              <Row width="100%" justifyContent="space-between">
                <Col width="50%">
                  <Input
                    label="Sequence Name"
                    height="48px"
                    placeholder={"e.g"}
                    // {...register("name", { required: true })}
                    required
                  />
                </Col>
                <Col width="48%">
                  <Dropdown
                    width="100%"
                    label="Process"
                    items={[]}
                    placeholder={"Select"}
                    // handleChange={(value) => setValue("numberFormat", value)}
                    required
                    // error={errors?.numberFormat?.message}
                    // {...register("numberFormat", { required: true })}
                    noSearch
                  />
                </Col>
              </Row>
              <Row width="100%" justifyContent="space-between">
                <Col width="50%">
                  <Input
                    label="Company"
                    height="48px"
                    placeholder={"e.g"}
                    disabled={true}
                    // {...register("name", { required: true })}
                  />
                </Col>
                <Col width="48%">
                  <Dropdown
                    width="100%"
                    label="Branch"
                    items={[]}
                    placeholder={"Select"}
                    // handleChange={(value) => setValue("numberFormat", value)}
                    // error={errors?.numberFormat?.message}
                    // {...register("numberFormat", { required: true })}
                    noSearch
                  />
                </Col>
              </Row>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <Spacer size={20} />

        <Accordion>
          <Accordion.Item key={1}>
            <Accordion.Header variant="blue">Number Allocation</Accordion.Header>
            <Accordion.Body>
              <Spacer size={12} />
              <Row>
                <Input
                  width="100%"
                  label="Sequence Code Preview"
                  height="48px"
                  placeholder={"e.g"}
                  disabled={true}
                  // {...register("name", { required: true })}
                />
              </Row>
              <Spacer size={20} />

              <Row width="100%">
                <Col>
                  <Row>
                    <Label>Include</Label>
                  </Row>
                  <Spacer size={10} />

                  <Row style={{ marginRight: "12px" }} alignItems="center" gap="12px">
                    <Row>
                      <Checkbox
                        checked={false}
                        //   onChange={(value: boolean) => {
                        //     onChange(value);
                        //     setIsCompany(value);
                        //   }}
                      />

                      <Text variant={"h6"} bold>
                        Company
                      </Text>
                    </Row>
                    <Row>
                      <Checkbox
                        checked={false}
                        //   onChange={(value: boolean) => {
                        //     onChange(value);
                        //     setIsBranch(value);
                        //   }}
                      />
                      <Text variant={"h6"} bold>
                        Branch
                      </Text>
                    </Row>
                  </Row>
                </Col>
                <Spacer size={20} />
                <Col>
                  <Row>
                    <Label>Periodically Updated</Label>
                  </Row>
                  <Spacer size={10} />

                  <Row style={{ marginRight: "12px" }} alignItems="center" gap="12px">
                    <Row>
                      <Checkbox
                        checked={false}
                        //   onChange={(value: boolean) => {
                        //     onChange(value);
                        //     setIsCompany(value);
                        //   }}
                      />

                      <Text variant={"h6"} bold>
                        Month
                      </Text>
                    </Row>
                    <Row>
                      <Checkbox
                        checked={false}
                        //   onChange={(value: boolean) => {
                        //     onChange(value);
                        //     setIsBranch(value);
                        //   }}
                      />
                      <Text variant={"h6"} bold>
                        Year
                      </Text>
                    </Row>
                  </Row>
                </Col>
              </Row>

              <Spacer size={12} />

              <Row>
                <Row width="100%" alignItems="center">
                  <Col width="15%">
                    <Text variant="headingSmall">Prefix</Text>
                  </Col>
                  <Col width="85%">
                    <Input
                      width="100%"
                      label=""
                      height="48px"
                      placeholder={"e.g"}
                      // {...register("name", { required: true })}
                    />
                  </Col>
                </Row>
              </Row>
              <Row>
                <Row width="100%" alignItems="center">
                  <Col width="15%">
                    <Text variant="headingSmall">Suffix</Text>
                  </Col>
                  <Col width="85%">
                    <Input
                      width="100%"
                      label=""
                      height="48px"
                      placeholder={"e.g"}
                      // {...register("name", { required: true })}
                    />
                  </Col>
                </Row>
              </Row>
              <Row>
                <Row width="100%" alignItems="center">
                  <Col width="15%">
                    <Text variant="headingSmall">Digit Size</Text>
                  </Col>
                  <Col width="85%">
                    <Input
                      width="100%"
                      label=""
                      height="48px"
                      placeholder={"e.g"}
                      // {...register("name", { required: true })}
                    />
                  </Col>
                </Row>
              </Row>
              <Row>
                <Row width="100%" alignItems="center">
                  <Col width="15%">
                    <Text variant="headingSmall">Separator</Text>
                  </Col>
                  <Col width="85%">
                    <Input
                      width="100%"
                      label=""
                      height="48px"
                      placeholder={"e.g"}
                      // {...register("name", { required: true })}
                    />
                  </Col>
                </Row>
              </Row>
              <Row>
                <Row width="100%" alignItems="center">
                  <Col width="15%">
                    <Text variant="headingSmall">Start Number</Text>
                  </Col>
                  <Col width="85%">
                    <Input
                      width="100%"
                      label=""
                      height="48px"
                      placeholder={"e.g"}
                      // {...register("name", { required: true })}
                    />
                  </Col>
                </Row>
              </Row>
              <Row>
                <Row width="100%" alignItems="center">
                  <Col width="15%">
                    <Text variant="headingSmall">Next Number</Text>
                  </Col>
                  <Col width="85%">
                    <Input
                      width="100%"
                      label=""
                      height="48px"
                      placeholder={"e.g"}
                      // {...register("name", { required: true })}
                    />
                  </Col>
                </Row>
              </Row>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <Spacer size={20} />
      </Col>
    </>
  );
};

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: ${(p) => (p.padding ? p.padding : "16px")};
`;

const Label = styled.div`
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  color: #000000;
`;

export default AddSequenceNumber;
