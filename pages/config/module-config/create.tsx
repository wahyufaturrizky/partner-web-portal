import React from "react";
import {
  Text, Col, Row, Spacer, Dropdown, Button, Accordion, Input,
} from "pink-lava-ui";
import styled from "styled-components";
import { useRouter } from "next/router";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useConfigs, useCreateConfig } from "../../../hooks/config/useConfig";

const schema = yup
  .object({
    name: yup.string().required("Name is Required"),
  })
  .required();

const CreateConfig: any = () => {
  const router = useRouter();
  const companyCode = localStorage.getItem("companyCode");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { mutate: createConfig } = useCreateConfig({
    options: {
      onSuccess: () => {
        router.push("/config/module-config");
      },
    },
  });

  const onSubmit = (data) => {
    const payload = {
      ...data,
      company_id: companyCode,
    };
    createConfig(payload);
  };

  const { data: configs, refetch: refetchConfig } = useConfigs();

  const data = [];
  configs?.rows?.map((config) => {
    data.push({
      key: config.id,
      module_name: config.name,
      parent: config.parentName || "-",
      action: (
        <Button size="small" onClick={() => router.push(`/config/module-config/${config.id}`)} variant="tertiary">
          View Detail
        </Button>
      ),
    });
  });

  const parents = configs?.rows?.map((config: any) => ({ id: config.id, value: config.name }));

  return (
    <Col>
      <Row gap="4px">
        <Text variant="h4">Create Module</Text>
      </Row>
      <Spacer size={12} />
      <Card padding="20px">
        <Row justifyContent="flex-end" alignItems="center" nowrap>
          <Row>
            <Row gap="16px">
              <Button size="big" variant="tertiary" onClick={() => router.push("/config/module-config")}>
                Cancel
              </Button>
              <Button size="big" variant="primary" onClick={handleSubmit(onSubmit)}>
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
              <Input
                width="100%"
                label="Name"
                height="48px"
                placeholder="E.g Sales"
                {...register("name", { required: true })}
              />
              <Dropdown
                label="Parent Module"
                width="100%"
                items={parents}
                placeholder="Select"
                noSearch
                handleChange={(value) => setValue("parentId", value)}
              />
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
	padding: ${(p) => (p.padding ? p.padding : "16px")};
`;

export default CreateConfig;
