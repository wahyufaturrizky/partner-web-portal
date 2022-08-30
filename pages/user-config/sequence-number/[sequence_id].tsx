import React, { useState } from "react";
import Router, { useRouter } from "next/router";
import usePagination from "@lucasmogari/react-pagination";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import styled from "styled-components";
import {
  Text,
  Col,
  Row,
  Spacer,
  Dropdown,
  Table,
  Alert,
  Button,
  Accordion,
  Spin,
  Input,
  Modal,
  Search,
  Pagination,
  AccordionCheckbox,
  Checkbox,
} from "pink-lava-ui";

import ArrowLeft from "../../../assets/icons/arrow-left.svg";
import AddSequenceNumber from "../../../components/pages/SequenceNumber/AddSequenceNumber";

const DetailSequenceNumber: any = () => {
  const router = useRouter();
  const { sequence_id } = router.query;

  const [search, setSearch] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [isAdd, setIsAdd] = useState(true);

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
      {isAdd ? (
        <Col>
          <Row gap="16px" justifyContent="flex" alignItems="center">
            <ArrowLeft style={{ cursor: "pointer" }} onClick={() => Router.back()} />
            <Text variant={"h4"}>{"PMA Bandung Selatan"}</Text>
          </Row>
          <Spacer size={12} />
          <Card>
            <Row width="100%" noWrap>
              <Col width="25%" style={{ padding: "12px", borderRight: "3px solid #f0f2f5" }}>
                <Row>
                  <Search placeholder="Search" onChange={(e: any) => setSearch(e.target.value)} />
                </Row>
                <Spacer size={20} />
                <Row>
                  <Text
                    clickable
                    variant={"label"}
                    color={"red.regular"}
                    onClick={() => setIsAdd(!isAdd)}
                  >
                    + Add Sequence
                  </Text>
                </Row>
              </Col>
              <Col width="75%" style={{ padding: "12px" }}>
                <Row justifyContent={"flex-end"}>
                  {!isEdit ? (
                    <Button size="big" variant={"primary"} onClick={() => setIsEdit(!isEdit)}>
                      Edit
                    </Button>
                  ) : (
                    <Button size="big" variant={"primary"} onClick={() => setIsEdit(!isEdit)}>
                      Save
                    </Button>
                  )}
                </Row>
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
                          disabled={isEdit ? false : true}
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
                          disabled={isEdit ? false : true}
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
                          disabled={isEdit ? false : true}
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
                          disabled={isEdit ? false : true}
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
                        disabled={isEdit ? false : true}
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
                        disabled={isEdit ? false : true}
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
                        disabled={isEdit ? false : true}
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
                        disabled={isEdit ? false : true}
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
                        disabled={isEdit ? false : true}
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
                        disabled={isEdit ? false : true}
                        // {...register("name", { required: true })}
                      />
                    </Col>
                  </Row>
                </Row>
              </Col>
            </Row>
          </Card>
        </Col>
      ) : (
        <AddSequenceNumber onBack={() => setIsAdd(!isAdd)} />
      )}
    </>
  );
};

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
`;

const Label = styled.div`
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  color: #000000;
`;

export default DetailSequenceNumber;
