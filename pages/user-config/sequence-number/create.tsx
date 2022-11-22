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
  Checkbox,
} from "pink-lava-ui";
import styled from "styled-components";
import Router, { useRouter } from "next/router";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { useCreateSequenceNumber } from "../../../hooks/sequence-number/useSequenceNumber";
import { useBusinessProcesses } from "../../../hooks/business-process/useBusinessProcess";
import { useBranchList } from "hooks/mdm/branch/useBranch";

const schema = yup
  .object({
    name: yup.string().required("Name is Required"),
    process_id: yup.string().required("Process is Required"),
    branch_id: yup.string().default(""),
    branch_name: yup.string().default(""),
  })
  .required();

const CreateSequenceNumber: any = () => {
  const router = useRouter();
  const companyId = localStorage.getItem("companyId")
  const companyCode = localStorage.getItem("companyCode")
  const [incCompany, setIncCompany] = useState(false);
  const [incBranch, setIncBranch] = useState(false);
  const [periodMonth, setPeriodMonth] = useState(false);
  const [periodYear, setPeriodYear] = useState(false);

  const {
    data: businessProcessesData,
    isLoading: isLoadingBP,
    isFetching: isFetchingBP,
  } = useBusinessProcesses({
    query: {},
    options: {
      onSuccess: (data: any) => {},
    },
  });

  const { data: listBranch, isLoading: isLoadingBranch } = useBranchList({
    query: { company_id: "KSNI" },
    options: {
      onSuccess: (data) => {
      },
    },
  });

  const { mutate: createSequence } = useCreateSequenceNumber({
    options: {
      onSuccess: (data) => {
        router.push("/user-config/sequence-number");
      },
    },
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    // defaultValues: defaultValue,
  });

  const onSubmit = (data: any) => {
    let include = [];
    incCompany && include.push("COMPANY");
    incBranch && include.push("BRANCH");

    let periodically_update = [];
    periodMonth && periodically_update.push("MONTH");
    periodYear && periodically_update.push("YEAR");

    const payload = {
      ...data,
      company_id: companyCode,
      include: include,
      periodically_update: periodically_update,
      parent_id: `1${data.branch_id != undefined ? data.branch_id : ""}`,
    };

    // console.log(payload, "payload");
    createSequence(payload);
  };

  const handleChangeBranch = ({ value }) => {
    const isBranch = listBranch.rows.filter((b) => b.branchId == value);
    if (isBranch) {
      setValue("branch_id", `${isBranch[0].branchId}`);
      setValue("branch_name", `${isBranch[0].name}`);
    }
  };

  return (
    <>
      <Col>
        <Row gap="4px" alignItems="center">
          {/* <ArrowLeft style={{ cursor: "pointer" }} onClick={onBack} /> */}
          <Text variant={"h4"}>Create Sequence</Text>
        </Row>
        <Spacer size={12} />
        <Card padding="20px">
          <Row justifyContent="flex-end" alignItems="center" nowrap>
            <Row>
              <Row gap="16px">
                <Button
                  size="big"
                  variant={"tertiary"}
                  onClick={() => Router.push("/user-config/sequence-number")}
                >
                  Cancel
                </Button>
                <Button size="big" variant={"primary"} onClick={handleSubmit(onSubmit)}>
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
                    placeholder={"e.g Transaction Quotation"}
                    {...register("name", { required: true })}
                    error={errors?.name?.message}
                    required
                  />
                </Col>
                <Col width="48%">
                  <Dropdown
                    width="100%"
                    label="Process"
                    items={businessProcessesData?.rows?.map((data) => ({
                      id: data.id,
                      value: data.name,
                    }))}
                    placeholder={"Select"}
                    handleChange={(value) => setValue("process_id", value)}
                    error={errors?.process_id?.message}
                    required
                    noSearch
                    isLoading={isLoadingBP}
                  />
                </Col>
              </Row>
              <Row width="100%" justifyContent="space-between">
                <Col width="50%">
                  <Input
                    label="Company"
                    height="48px"
                    placeholder={"PT. Kaldu Sari Nabati"}
                    disabled={true}
                    // {...register("name", { required: true })}
                  />
                </Col>
                <Col width="48%">
                  <Dropdown
                    width="100%"
                    label="Branch"
                    items={listBranch?.rows?.map((data) => ({
                      id: data.branchId,
                      value: data.name,
                    }))}
                    placeholder={"Select"}
                    // handleChange={(value) => {
                    //   console.log(value);
                    //   setValue("branch_id", value);
                    // }}
                    handleChange={(value) => handleChangeBranch({ value })}
                    // error={errors?.numberFormat?.message}
                    {...register("branch_id")}
                    noSearch
                    isLoading={isLoadingBranch}
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
                  placeholder={""}
                  // disabled={true}
                  {...register("sequenceCode", { required: true })}
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
                        checked={incCompany}
                        onChange={(checked: any) => setIncCompany(checked)}
                      />
                      <Text variant={"h6"} bold>
                        Company
                      </Text>
                    </Row>
                    <Row>
                      <Checkbox
                        checked={incBranch}
                        onChange={(checked: any) => setIncBranch(checked)}
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
                        checked={periodMonth}
                        onChange={(checked: any) => setPeriodMonth(checked)}
                      />

                      <Text variant={"h6"} bold>
                        Month
                      </Text>
                    </Row>
                    <Row>
                      <Checkbox
                        checked={periodYear}
                        onChange={(checked: any) => setPeriodYear(checked)}
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
                      placeholder={"e.g SO"}
                      {...register("prefix")}
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
                      placeholder={"e.g PMA"}
                      {...register("suffix")}
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
                      placeholder={"e.g 7"}
                      {...register("digit_size")}
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
                      placeholder={"e.g - (Strip) or / (Slash)"}
                      {...register("separator")}
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
                      placeholder={"e.g 1"}
                      {...register("start_number")}
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
                      placeholder={"e.g 1"}
                      {...register("next_number")}
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

export default CreateSequenceNumber;
