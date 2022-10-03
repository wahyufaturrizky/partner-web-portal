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
import {
  useCoaList,
  useCreateProductCategory,
  useProductCategoryList,
} from "hooks/mdm/product-category/useProductCategory";
import { useCoa } from "hooks/finance-config/useCoaTemplate";

const costingMethodData = [
  {
    id: "Standart Price",
    value: "Standart Price",
  },
  {
    id: "First in First Out (FIFO)",
    value: "First in First Out (FIFO)",
  },
  {
    id: "Average Cost (AVCO)",
    value: "Average Cost (AVCO)",
  },
];

const CreateProductCategory: any = () => {
  const router = useRouter();

  const [automate, setAutomate] = useState("");
  const [searchProductCategory, setSearchProductCategory] = useState("");
  const [searchCoa, setSearchCoa] = useState("");

  const pagination = usePagination({
    page: 1,
    itemsPerPage: 20,
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

  const { data: productCategoryList, isLoading: isLoadingProductCategory } = useProductCategoryList(
    {
      query: {
        search: searchProductCategory,
      },
      options: {
        onSuccess: (data: any) => {
        },
      },
    }
  );

  const { data: coaListPayable, isLoading: isLoadingCoaListPayable } = useCoaList({
    status: "payable",
    query: {},
    options: {
      onSuccess: (data: any) => {},
    },
  });

  const { data: coaListReceivable, isLoading: isLoadingCoaListReceivable } = useCoaList({
    status: "receivable",
    query: {},
    options: {
      onSuccess: (data: any) => {},
    },
  });

  const { data: coaList, isLoading: isLoadingCoaList } = useCoa({
    options: {
      onSuccess: (data: any) => {},
    },
    query: {
      search: searchCoa,
    },
  });

  const { mutate: createProductCategory } = useCreateProductCategory({
    options: {
      onSuccess: (data) => {
        alert("Create Success!");
        router.push("/product-category");
      },
    },
  });

  const onSubmit = (data) => {
    const payload = {
      company_id: "KSNI",
      name: data.name,
      parent: data.parent || "",
      costing_method: data.costing_method || "",
      inventory_valuation: data.inventory_valuation != "Automated" ? "Manual" : "Automated",
      price_difference_account: data.price_different_account || "",
      expense_account: data.expense_account || "",
      income_account: data.income_account || "",
      stock_valuation_account:
        data.inventory_valuation != "Automated" ? "" : data.stock_valuation_account || "",
      stock_journal: data.inventory_valuation != "Automated" ? "" : data.stock_jurnal || "",
      stock_input_account:
        data.inventory_valuation != "Automated" ? "" : data.stock_input_account || "",
      stock_output_account:
        data.inventory_valuation != "Automated" ? "" : data.stock_output_account || "",
    };

    createProductCategory(payload);
  };

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
            <Button size="big" variant={"primary"} onClick={handleSubmit(onSubmit)}>
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
                  items={productCategoryList?.rows?.map((data) => ({
                    id: data.name,
                    value: data.name,
                  }))}
                  placeholder={"Select"}
                  handleChange={(value) => setValue("parent", value)}
                  onSearch={(search) => setSearchProductCategory(search)}
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
                  items={costingMethodData}
                  placeholder={"Select"}
                  handleChange={(value) => setValue("costing_method", value)}
                  //   onSearch={(search) => setSearchCountry(search)}
                  //   error={errors?.country?.message}
                  //   {...register("country")}
                />
                <Dropdown2
                  label="Inventory Valuation"
                  width={"100%"}
                  items={[
                    {
                      id: "Automated",
                      value: "Automated",
                    },
                    {
                      id: "Manual",
                      value: "Manual",
                    },
                  ]}
                  placeholder={"Select"}
                  handleChange={(value) => {
                    setAutomate(value);
                    setValue("inventory_valuation", value);
                  }}
                  //   onSearch={(search) => setSearchCountry(search)}
                  //   error={errors?.country?.message}
                  //   {...register("country")}
                  defaultValue={"Manual"}
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
                  items={coaListPayable?.rows?.map((data) => ({
                    id: data.accountName,
                    value: data.accountName,
                  }))}
                  placeholder={"Select"}
                  handleChange={(value) => setValue("expense_account", value)}
                  //   onSearch={(search) => setSearchCountry(search)}
                  //   error={errors?.country?.message}
                  //   {...register("country")}
                  noSearch
                />
              </Row>
              <Row width="49%">
                <Dropdown2
                  label="Income Account"
                  width={"100%"}
                  items={coaListReceivable?.rows?.map((data) => ({
                    id: data.accountName,
                    value: data.accountName,
                  }))}
                  placeholder={"Select"}
                  handleChange={(value) => setValue("income_account", value)}
                  //   onSearch={(search) => setSearchCountry(search)}
                  //   error={errors?.country?.message}
                  //   {...register("country")}
                  noSearch
                />
              </Row>
              <Spacer size={10} />
              {automate == "Automated" && (
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
                      items={coaList?.rows?.map((data) => ({
                        id: data.name,
                        value: data.name,
                      }))}
                      placeholder={"Select"}
                      handleChange={(value) => setValue("stock_input_account", value)}
                      onSearch={(search) => setSearchCoa(search)}
                      //   error={errors?.country?.message}
                      //   {...register("country")}
                      noSearch
                    />
                    <Dropdown2
                      label="Stock Output Account"
                      width={"100%"}
                      items={coaList?.rows?.map((data) => ({
                        id: data.name,
                        value: data.name,
                      }))}
                      placeholder={"Select"}
                      handleChange={(value) => setValue("stock_output_account", value)}
                      onSearch={(search) => setSearchCoa(search)}
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
