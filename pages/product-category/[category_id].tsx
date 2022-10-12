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
  useProductCategory,
  useProductCategoryList,
  useUpdateProductCategory,
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

const UpdateProductCategory: any = () => {
  const router = useRouter();
  const { category_id } = router.query;

  const [automate, setAutomate] = useState("");
  const [searchProductCategory, setSearchProductCategory] = useState("");
  const [searchCoa, setSearchCoa] = useState("");
  const [catList, setCatList] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    // resolver: yupResolver(schema),
    // defaultValues: defaultValue,
  });

  const { data: categoryData, isLoading: isLoadingCategoryData } = useProductCategory({
    id: category_id,
    options: {
      onSuccess: (data) => {
        data.inventoryValuation == "Automated" && setAutomate("Automated");
        setValue("name", data.name);
        setValue("parent", data.parent);
        setValue("costing_method", data.costingMethod);
        setValue("inventory_valuation", data.inventoryValuation);
        // setValue("price_difference_account", data.priceDifferenceAccount);
        setValue("expense_account", data.expenseAccount);
        setValue("income_account", data.incomeAccount);
        // setValue("stock_valuation_account", data.stockValuationAccount);
        // setValue("stock_journal", data.stockJournal);
        setValue("stock_input_account", data.stockInputAccount);
        setValue("stock_output_account", data.stockOutputAccount);
      },
    },
  });

  const { data: productCategoryList, isLoading: isLoadingProductCategory } = useProductCategoryList(
    {
      query: {
        search: searchProductCategory,
        // page: pagination.page,
        // limit: pagination.itemsPerPage,
      },
      options: {
        onSuccess: (data: any) => {
          const newCatList = data?.rows?.filter((item) => item.productCategoryId != category_id);
          setCatList(newCatList);
        },
      },
    }
  );
    // console.log(catList)
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

  const { mutate: updateProductCategory, isLoading: isLoadingUpdateProductCategory } =
    useUpdateProductCategory({
      id: category_id,
      options: {
        onSuccess: () => {
          alert("Update Success!");
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

    updateProductCategory(payload);
  };

  return (
    <>
      {!isLoadingCategoryData ? (
        <Col>
          <Row gap="4px" alignItems="center">
            <ArrowLeft style={{ cursor: "pointer" }} onClick={() => Router.back()} />
            <Text variant={"h4"}>{category_id}</Text>
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
                    // placeholder={"e.g Water Flat"}
                    {...register("name", { required: "Name is Required" })}
                    error={errors?.name?.message}
                    defaultValue={categoryData.name}
                    required
                  />
                  <Dropdown
                    label="Parent"
                    width={"100%"}
                    items={catList?.map((data) => ({
                      id: data.name,
                      value: data.name,
                    }))}
                    placeholder={"Select"}
                    handleChange={(value) => setValue("parent", value)}
                    onSearch={(search) => setSearchProductCategory(search)}
                    //   error={errors?.country?.message}
                    //   {...register("country")}
                    defaultValue={categoryData.parent}
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
                  <Dropdown
                    label="Costing Method"
                    width={"100%"}
                    items={costingMethodData}
                    placeholder={"Select"}
                    handleChange={(value) => setValue("costing_method", value)}
                    //   onSearch={(search) => setSearchCountry(search)}
                    //   error={errors?.country?.message}
                    //   {...register("country")}
                    defaultValue={categoryData.costingMethod}
                    noSearch
                  />
                  <Dropdown
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
                    defaultValue={categoryData.inventoryValuation}
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
              <Row width="49%" gap="20px" noWrap>
                  {automate == "Automated" && (
                    <Dropdown
                      label="Price Difference Account"
                      width={"100%"}
                      items={[]}
                      placeholder={"Select"}
                      //   handleChange={(value) => setValue("country", value)}
                      //   onSearch={(search) => setSearchCountry(search)}
                      //   error={errors?.country?.message}
                      //   {...register("country")}
                    />
                  )}
                </Row>
                <Row width="100%" gap="20px" noWrap>
                  <Dropdown
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
                    defaultValue={categoryData.incomeAccount}
                    noSearch
                  />
                  <Dropdown
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
                    defaultValue={categoryData.expenseAccount}
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
                      <Dropdown
                        label="Stock Valuation Account"
                        width={"100%"}
                        items={[]}
                        placeholder={"Select"}
                        //   handleChange={(value) => setValue("country", value)}
                        //   onSearch={(search) => setSearchCountry(search)}
                        //   error={errors?.country?.message}
                        //   {...register("country")}
                      />
                      <Dropdown
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
                      <Dropdown
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
                        defaultValue={categoryData.stockInputAccount}
                      />
                      <Dropdown
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
                        defaultValue={categoryData.stockOutputAccount}
                      />
                    </Row>
                  </>
                )}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
      ) : (
        <Spin tip="Loading data..." />
      )}
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
export default UpdateProductCategory;
