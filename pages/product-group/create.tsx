import React, { useEffect, useState } from "react";
import { Text, Col, Row, Spacer, Button, Input, Accordion, Table, Pagination } from "pink-lava-ui";
import styled from "styled-components";
import { useRouter } from "next/router";
import { useForm, useWatch } from "react-hook-form";
import {
  useCreateProductGroup,
  useFilterProductGroup,
} from "../../hooks/mdm/product-group/useProductGroup";
import { queryClient } from "../_app";
import usePagination from "@lucasmogari/react-pagination";
import ConditionalField from "../../components/pages/ProductGroup/ConditionalField";

const ProductGroupCreate = () => {
  const router = useRouter();
  const pagination = usePagination({
    page: 1,
    itemsPerPage: 20,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 0,
  });

  const [filteredProduct, setFilteredProduct] = useState([]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      items: [{ group: "", condition: "", value_from: "0", value_to: "0", values: "0" }],
    },
  });

  const itemsWatch = useWatch({
    name: "items",
    control,
  });

  const { mutate: createProductGroup, isLoading: isLoadingProductGroup } = useCreateProductGroup({
    options: {
      onSuccess: () => {
        router.back();
        queryClient.invalidateQueries(["products-group"]);
      },
    },
  });

  const { mutate: filterProduct, isLoading: isLoadingFilterProduct } = useFilterProductGroup({
    pagingationParam: {
      page: pagination.page,
      limit: pagination.itemsPerPage,
    },
    options: {
      onSuccess: (data: any) => {
        pagination.setTotalItems(data?.totalRow);

        const mappedFilterProduct = data?.rows?.map((item: any) => {
          return {
            id: item.id,
            key: item.id,
            productName: item.name,
            productCategory: item.productCategoryName,
            action: (
              <div style={{ display: "flex", justifyContent: "left" }}>
                <Button
                  size="small"
                  onClick={() => {
                    router.push(`/product/${item.id}`);
                  }}
                  variant="tertiary"
                >
                  View Detail
                </Button>
              </div>
            ),
          };
        });

        setFilteredProduct(mappedFilterProduct);
      },
    },
  });

  const columns = [
    {
      title: "Product Name",
      dataIndex: "productName",
    },
    {
      title: "Product Category Name",
      dataIndex: "productCategory",
    },
    {
      title: "Action",
      dataIndex: "action",
      width: "15%",
      align: "left",
    },
  ];

  const onSubmit = (data: any) => {
    const formData = {
      company_id: "KSNI",
      ...data,
    };

    createProductGroup(formData);
  };

  useEffect(() => {}, [pagination.fromItem, pagination.itemsPerPage]);

  return (
    <>
      <Col>
        <Row gap="4px">
          <Text variant={"h4"}>Create Product Group</Text>
        </Row>

        <Spacer size={20} />

        <Card padding="20px">
          <Row justifyContent="flex-end" alignItems="center" nowrap>
            <Row gap="16px">
              <Button size="big" variant={"tertiary"} onClick={() => router.back()}>
                Cancel
              </Button>
              <Button size="big" variant={"primary"} onClick={handleSubmit(onSubmit)}>
                {isLoadingProductGroup ? "Loading..." : "Save"}
              </Button>
            </Row>
          </Row>
        </Card>

        <Spacer size={20} />

        <Accordion>
          <Accordion.Item key={1}>
            <Accordion.Header variant="blue">General</Accordion.Header>
            <Accordion.Body>
              <Row width="100%">
                <Col width="100%">
                  <Input
                    width="100%"
                    label="Product Group Name"
                    height="40px"
                    placeholder={"e.g Wafer 1K"}
                    {...register("name", { required: true })}
                  />
                  {errors?.name?.type === "required" && (
                    <Text variant="alert" color={"red.regular"}>
                      This field is required
                    </Text>
                  )}
                </Col>
              </Row>

              <ConditionalField
                register={register}
                control={control}
                setValue={setValue}
                itemsWatch={itemsWatch}
                filterProduct={filterProduct}
                type={"add"}
              />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <Spacer size={20} />

        <Accordion>
          <Accordion.Item key={1}>
            <Accordion.Header variant="blue">Result Samples</Accordion.Header>
            <Accordion.Body>
              <Table loading={isLoadingFilterProduct} columns={columns} data={filteredProduct} />
              <Pagination pagination={pagination} />
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
  padding: ${(p: any) => (p.padding ? p.padding : "16px")};
`;

export default ProductGroupCreate;
