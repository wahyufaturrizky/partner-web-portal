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
import { lang } from "lang";
import { useUserPermissions } from "hooks/user-config/useUser";

const ProductGroupCreate = () => {
  const t = localStorage.getItem("lan") || "en-US";
  const companyId = localStorage.getItem("companyId");
  const companyCode = localStorage.getItem("companyCode");
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
      items: [{ group: null, condition: null, value_from: "0", value_to: "0", values: "0" }],
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
      title: lang[t].productGroup.create.table.productName,
      dataIndex: "productName",
    },
    {
      title: lang[t].productGroup.create.table.productCategoryName,
      dataIndex: "productCategory",
    },
    {
      title: lang[t].productGroup.create.table.action,
      dataIndex: "action",
      width: "15%",
      align: "left",
    },
  ];

  const onSubmit = (data: any) => {
    const mappingItemData = data?.items?.map((el: any) => {
      return {
        ...el,
        group: el?.group === null ? "" : el?.group,
        condition: el?.condition === null ? "" : el.condition,
      };
    });

    const formData = {
      company_id: companyCode,
      ...data,
      items: mappingItemData,
    };

    createProductGroup(formData);
  };

  useEffect(() => {}, [pagination.fromItem, pagination.itemsPerPage]);

  const { data: dataUserPermission } = useUserPermissions({
    options: {
      onSuccess: () => {},
    },
  });

  const listPermission = dataUserPermission?.permission?.filter(
    (filtering: any) => filtering.menu === "Product Group"
  );

  const checkUserPermission = (permissionGranted) => {
    return listPermission?.find(
      (data: any) => data?.viewTypes?.[0]?.viewType?.name === permissionGranted
    );
  };

  return (
    <>
      <Col>
        <Row gap="4px">
          <Text variant={"h4"}>{lang[t].productGroup.create.headerTitle}</Text>
        </Row>

        <Spacer size={20} />

        <Card padding="20px">
          <Row justifyContent="flex-end" alignItems="center" nowrap>
            <Row gap="16px">
              <Button size="big" variant={"tertiary"} onClick={() => router.back()}>
                {lang[t].productGroup.list.tertier.cancel}
              </Button>
              {checkUserPermission("Create") && (
                <Button size="big" variant={"primary"} onClick={handleSubmit(onSubmit)}>
                  {isLoadingProductGroup ? "Loading..." : lang[t].productGroup.list.primary.save}
                </Button>
              )}
            </Row>
          </Row>
        </Card>

        <Spacer size={20} />

        <Accordion style={{ position: "relative" }} id="area">
          <Accordion.Item key={1}>
            <Accordion.Header variant="blue">
              {lang[t].productGroup.create.accordion.general}
            </Accordion.Header>
            <Accordion.Body>
              <Row width="100%">
                <Col width="100%">
                  <Input
                    width="100%"
                    label={lang[t].productGroup.create.emptyState.groupName}
                    height="48px"
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
                groupingBasedOnLable={lang[t].productGroup.create.emptyState.groupingBasedOn}
                conditionLable={lang[t].productGroup.create.emptyState.condition}
                minLable={lang[t].productGroup.create.emptyState.min}
                maxLable={lang[t].productGroup.create.emptyState.max}
                addMoreGroupingLable={lang[t].productGroup.create.emptyState.addMoreGrouping}
                groupingLable={lang[t].productGroup.grouping}
                type={"add"}
              />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <Spacer size={20} />

        <Accordion>
          <Accordion.Item key={1}>
            <Accordion.Header variant="blue">
              {lang[t].productGroup.create.accordion.resultSamples}
            </Accordion.Header>
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
