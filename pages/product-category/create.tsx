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
  FileUploaderAllFiles,
  Spin,
} from "pink-lava-ui";
import styled from "styled-components";
import Router, { useRouter } from "next/router";
import ArrowLeft from "../../assets/icons/arrow-left.svg";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import usePagination from "@lucasmogari/react-pagination";

const CreateProductCategory: any = () => {
  const router = useRouter();

  const [automate, setAutomate] = useState(false);

  const pagination = usePagination({
    page: 1,
    itemsPerPage: 10,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    // resolver: yupResolver(schema),
    // defaultValues: defaultValue,
  });
  return (
    <>
      <Col>
        <Row gap="4px" alignItems="center">
          <ArrowLeft style={{ cursor: "pointer" }} onClick={() => Router.back()} />
          <Text variant={"h4"}>Create Product Category</Text>
        </Row>
        <Spacer size={12} />
        <Card padding="20px">
          <Row justifyContent="end" alignItems="center" nowrap gap="12px">
            <Button size="big" variant={"tertiary"} onClick={() => Router.back()}>
              Cancel
            </Button>
            <Button
              size="big"
              variant={"primary"}
              // onClick={handleSubmit(onSubmit)}
            >
              Save
            </Button>
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
                  placeholder={"e.g Water Flat"}
                  error={errors?.name?.message}
                  {...register("name", { required: true })}
                  required
                />
                <Dropdown2
                  label="Parent"
                  width={"100%"}
                  items={[]}
                  placeholder={"Select"}
                  //   handleChange={(value) => setValue("country", value)}
                  //   onSearch={(search) => setSearchCountry(search)}
                  //   error={errors?.country?.message}
                  //   {...register("country")}
                />
              </Row>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <Spacer size={20} />

        <Accordion>
          <Accordion.Item key={2}>
            <Accordion.Header variant="blue">Inventory Valuation</Accordion.Header>
            <Accordion.Body>
              <Row width="100%" gap="20px" noWrap>
                <Dropdown2
                  label="Costing Method"
                  width={"100%"}
                  items={[]}
                  placeholder={"Select"}
                  //   handleChange={(value) => setValue("country", value)}
                  //   onSearch={(search) => setSearchCountry(search)}
                  //   error={errors?.country?.message}
                  //   {...register("country")}
                />
                <Dropdown2
                  label="Inventory Valuation"
                  width={"100%"}
                  items={[
                    {
                      id: 1,
                      value: "Automated",
                    },
                    {
                      id: 0,
                      value: "Manual",
                    },
                  ]}
                  placeholder={"Select"}
                  handleChange={(value) => setAutomate(value == 1 ? true : false)}
                  //   onSearch={(search) => setSearchCountry(search)}
                  //   error={errors?.country?.message}
                  //   {...register("country")}
                  noSearch
                />
              </Row>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <Spacer size={20} />

        <Accordion>
          <Accordion.Item key={3}>
            <Accordion.Header variant="blue">Account Properties</Accordion.Header>
            <Accordion.Body>
              <Row width="100%" gap="20px" noWrap>
                <Dropdown2
                  label="Price Difference Account"
                  width={"100%"}
                  items={[]}
                  placeholder={"Select"}
                  //   handleChange={(value) => setValue("country", value)}
                  //   onSearch={(search) => setSearchCountry(search)}
                  //   error={errors?.country?.message}
                  //   {...register("country")}
                />
                <Dropdown2
                  label="Expense Account"
                  width={"100%"}
                  items={[]}
                  placeholder={"Select"}
                  //   handleChange={(value) => setValue("country", value)}
                  //   onSearch={(search) => setSearchCountry(search)}
                  //   error={errors?.country?.message}
                  //   {...register("country")}
                />
              </Row>
              <Row width="49%">
                <Dropdown2
                  label="Income Account"
                  width={"100%"}
                  items={[]}
                  placeholder={"Select"}
                  //   handleChange={(value) => setValue("country", value)}
                  //   onSearch={(search) => setSearchCountry(search)}
                  //   error={errors?.country?.message}
                  //   {...register("country")}
                />
              </Row>
              <Spacer size={10} />
              {automate && (
                <>
                  <Row>
                    <Label>Account Stock Properties</Label>
                  </Row>
                  <Spacer size={10} />

                  <Row width="100%" gap="20px" noWrap>
                    <Dropdown2
                      label="Stock Valuation Account"
                      width={"100%"}
                      items={[]}
                      placeholder={"Select"}
                      //   handleChange={(value) => setValue("country", value)}
                      //   onSearch={(search) => setSearchCountry(search)}
                      //   error={errors?.country?.message}
                      //   {...register("country")}
                    />
                    <Dropdown2
                      label="Stock Journal"
                      width={"100%"}
                      items={[]}
                      placeholder={"Select"}
                      //   handleChange={(value) => setValue("country", value)}
                      //   onSearch={(search) => setSearchCountry(search)}
                      //   error={errors?.country?.message}
                      //   {...register("country")}
                    />
                  </Row>
                  <Row width="100%" gap="20px" noWrap>
                    <Dropdown2
                      label="Stock Input Account"
                      width={"100%"}
                      items={[]}
                      placeholder={"Select"}
                      //   handleChange={(value) => setValue("country", value)}
                      //   onSearch={(search) => setSearchCountry(search)}
                      //   error={errors?.country?.message}
                      //   {...register("country")}
                    />
                    <Dropdown2
                      label="Stock Output Account"
                      width={"100%"}
                      items={[]}
                      placeholder={"Select"}
                      //   handleChange={(value) => setValue("country", value)}
                      //   onSearch={(search) => setSearchCountry(search)}
                      //   error={errors?.country?.message}
                      //   {...register("country")}
                    />
                  </Row>
                </>
              )}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Col>
    </>
  );
};

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: ${(p) => (p.padding ? p.padding : "16px")};
`;

const Label = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #1a727a;
`;
export default CreateProductCategory;
