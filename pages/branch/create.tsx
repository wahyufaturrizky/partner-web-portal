import React, { useState } from "react";
import { Text, Col, Row, Spacer, Button, Accordion, FormSelect, FormInput } from "pink-lava-ui";
import styled from "styled-components";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useCreateBranch } from "../../hooks/mdm/branch/useBranch";
import { queryClient } from "../_app";

const BranchCreate = () => {
  const router = useRouter();

  const { register, control, handleSubmit } = useForm();

  const { mutate: createBranch, isLoading: isLoadingCreateBranch } = useCreateBranch({
    options: {
      onSuccess: () => {
        router.back();
        queryClient.invalidateQueries(["branch-list"]);
      },
    },
  });

  const onSubmit = (data: any) => {
    const formData = {
      company_id: "KSNI",
      ...data,
    };
    createBranch(formData);
  };

  return (
    <Col>
      <Row gap="4px">
        <Text variant={"h4"}>Create Branch</Text>
      </Row>

      <Spacer size={20} />

      <Card>
        <Row gap="16px" justifyContent="flex-end" alignItems="center" nowrap>
          <Button size="big" variant={"tertiary"} onClick={() => router.back()}>
            Cancel
          </Button>
          <Button size="big" variant={"primary"} onClick={handleSubmit(onSubmit)}>
            {isLoadingCreateBranch ? "Loading..." : "Save"}
          </Button>
        </Row>
      </Card>

      <Spacer size={20} />

      <Accordion>
        <Accordion.Item key={1}>
          <Accordion.Header variant="blue">General</Accordion.Header>
          <Accordion.Body>
            <Row width="100%" noWrap>
              <Col width={"100%"}>
                <Controller
                  control={control}
                  name="uom_category_id"
                  render={({ field: { onChange } }) => (
                    <>
                      <Text variant="headingRegular">
                        Branch Name<span style={{ color: "#EB008B" }}>*</span>
                      </Text>
                      <FormInput size={"large"} placeholder={"e.g PMA Bandung Selatan GT"} />
                    </>
                  )}
                />
              </Col>
              <Spacer size={10} />

              <Col width="100%">
                <Controller
                  control={control}
                  name="uom_category_id"
                  render={({ field: { onChange } }) => (
                    <>
                      <Label>Parent</Label>
                      <FormSelect
                        style={{ width: "100%" }}
                        size={"large"}
                        placeholder={"Select"}
                        borderColor={"#AAAAAA"}
                        arrowColor={"#000"}
                        withSearch
                        isLoading={false}
                        isLoadingMore={false}
                        fetchMore={() => {}}
                        items={[]}
                        onChange={(value: any) => {
                          onChange(value);
                        }}
                        onSearch={(value: any) => {}}
                      />
                    </>
                  )}
                />
              </Col>
            </Row>

            <Spacer size={15} />

            <Row width="100%" noWrap>
              <Col width={"100%"}>
                <Controller
                  control={control}
                  name="uom_category_id"
                  render={({ field: { onChange } }) => (
                    <>
                      <Label>Company Internal Structure</Label>
                      <FormSelect
                        style={{ width: "100%" }}
                        size={"large"}
                        placeholder={"Select"}
                        borderColor={"#AAAAAA"}
                        arrowColor={"#000"}
                        withSearch
                        isLoading={false}
                        isLoadingMore={false}
                        fetchMore={() => {}}
                        items={[]}
                        onChange={(value: any) => {
                          onChange(value);
                        }}
                        onSearch={(value: any) => {}}
                      />
                    </>
                  )}
                />
              </Col>
              <Spacer size={10} />

              <Col width="100%">
                <Controller
                  control={control}
                  name="uom_category_id"
                  render={({ field: { onChange } }) => (
                    <>
                      <Label>Timezone</Label>
                      <FormSelect
                        style={{ width: "100%" }}
                        size={"large"}
                        placeholder={"Select"}
                        borderColor={"#AAAAAA"}
                        arrowColor={"#000"}
                        withSearch
                        isLoading={false}
                        isLoadingMore={false}
                        fetchMore={() => {}}
                        items={[]}
                        onChange={(value: any) => {
                          onChange(value);
                        }}
                        onSearch={(value: any) => {}}
                      />
                    </>
                  )}
                />
              </Col>
            </Row>

            <Spacer size={15} />

            <Row width="100%" noWrap>
              <Col width={"100%"}>
                <Controller
                  control={control}
                  name="uom_category_id"
                  render={({ field: { onChange } }) => (
                    <>
                      <Label>Start Working Day</Label>
                      <FormSelect
                        style={{ width: "100%" }}
                        size={"large"}
                        placeholder={"Select"}
                        borderColor={"#AAAAAA"}
                        arrowColor={"#000"}
                        withSearch
                        isLoading={false}
                        isLoadingMore={false}
                        fetchMore={() => {}}
                        items={[]}
                        onChange={(value: any) => {
                          onChange(value);
                        }}
                        onSearch={(value: any) => {}}
                      />
                    </>
                  )}
                />
              </Col>
              <Spacer size={10} />

              <Col width="100%">
                <Controller
                  control={control}
                  name="uom_category_id"
                  render={({ field: { onChange } }) => (
                    <>
                      <Label>End Working Day</Label>
                      <FormSelect
                        style={{ width: "100%" }}
                        size={"large"}
                        placeholder={"Select"}
                        borderColor={"#AAAAAA"}
                        arrowColor={"#000"}
                        withSearch
                        isLoading={false}
                        isLoadingMore={false}
                        fetchMore={() => {}}
                        items={[]}
                        onChange={(value: any) => {
                          onChange(value);
                        }}
                        onSearch={(value: any) => {}}
                      />
                    </>
                  )}
                />
              </Col>
            </Row>

            <Spacer size={15} />

            <Row width="100%" noWrap>
              <Col width={"100%"}>
                <Controller
                  control={control}
                  name="uom_category_id"
                  render={({ field: { onChange } }) => (
                    <>
                      <Label>Calender</Label>
                      <FormSelect
                        style={{ width: "100%" }}
                        size={"large"}
                        placeholder={"Select"}
                        borderColor={"#AAAAAA"}
                        arrowColor={"#000"}
                        withSearch
                        isLoading={false}
                        isLoadingMore={false}
                        fetchMore={() => {}}
                        items={[]}
                        onChange={(value: any) => {
                          onChange(value);
                        }}
                        onSearch={(value: any) => {}}
                      />
                    </>
                  )}
                />
              </Col>
              <Spacer size={10} />

              <Col width="100%">
                <Controller
                  control={control}
                  name="uom_category_id"
                  render={({ field: { onChange } }) => (
                    <>
                      <Text variant="headingRegular">External Code</Text>
                      <FormInput size={"large"} placeholder={"e.g 12345"} />
                    </>
                  )}
                />
              </Col>
            </Row>

            <Spacer size={15} />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <Accordion>
        <Accordion.Item key={1}>
          <Accordion.Header variant="blue">Address</Accordion.Header>
          <Accordion.Body>
            <Row width="100%" noWrap>
              <Col width="100%">
                <Controller
                  control={control}
                  name="uom_category_id"
                  render={({ field: { onChange } }) => (
                    <>
                      <Text variant="headingRegular">
                        Address<span style={{ color: "#EB008B" }}>*</span>
                      </Text>
                      <FormInput size={"large"} placeholder={"e.g 12345"} />
                    </>
                  )}
                />
              </Col>

              <Spacer size={10} />

              <Col width="100%">
                <Controller
                  control={control}
                  name="uom_category_id"
                  render={({ field: { onChange } }) => (
                    <>
                      <Label>Country</Label>
                      <FormSelect
                        style={{ width: "100%" }}
                        size={"large"}
                        placeholder={"Select"}
                        borderColor={"#AAAAAA"}
                        arrowColor={"#000"}
                        withSearch
                        isLoading={false}
                        isLoadingMore={false}
                        fetchMore={() => {}}
                        items={[]}
                        onChange={(value: any) => {
                          onChange(value);
                        }}
                        onSearch={(value: any) => {}}
                      />
                    </>
                  )}
                />
              </Col>
            </Row>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Col>
  );
};

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: ${(p: any) => (p.padding ? p.padding : "16px")};
`;

const Label = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  color: #000000;
`;

export default BranchCreate;
