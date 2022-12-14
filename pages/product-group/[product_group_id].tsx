import React, { useEffect, useState } from "react";
import {
  Text,
  Col,
  Row,
  Spacer,
  Button,
  Input,
  Accordion,
  Table,
  Pagination,
  Spin,
} from "pink-lava-ui";
import styled from "styled-components";
import { useRouter } from "next/router";
import { useForm, useWatch } from "react-hook-form";
import {
  useUpdateProductGroup,
  useProductGroup,
  useFilterProductGroup,
  useDeleteProductGroup,
} from "../../hooks/mdm/product-group/useProductGroup";
import { queryClient } from "../_app";
import usePagination from "@lucasmogari/react-pagination";
import ArrowLeft from "../../assets/icons/arrow-left.svg";
import { ModalDeleteConfirmation } from "../../components/elements/Modal/ModalConfirmationDelete";
import ConditionalField from "../../components/pages/ProductGroup/ConditionalField";
import { lang } from "lang";
import { useUserPermissions } from "hooks/user-config/useUser";

const itemDefaultValue = [
  { id: 0, group: null, condition: null, value_from: "0", value_to: "0", values: "0" },
];

const ProductGroupDetail = () => {
  const t = localStorage.getItem("lan") || "en-US";
  const companyId = localStorage.getItem("companyId");
  const companyCode = localStorage.getItem("companyCode");
  const router = useRouter();
  const { product_group_id } = router.query;

  const pagination = usePagination({
    page: 1,
    itemsPerPage: 20,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 0,
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSuccessGetAllData, setIsSuccessGetAllData] = useState(false);
  const [filteredProduct, setFilteredProduct] = useState([]);
  const [removeList, setRemoveList] = useState<any[]>([]);
  const [isFetchingProductBrand, setIsFetchingProductBrand] = useState(true);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      items: itemDefaultValue,
    },
  });

  const itemsWatch = useWatch({
    name: "items",
    control,
  });

  const { mutate: updateProductGroup, isLoading: isLoadingUpdateProductGroup } =
    useUpdateProductGroup({
      id: product_group_id,
      companyId: companyCode,
      options: {
        onSuccess: () => {
          router.back();
          queryClient.invalidateQueries(["products-group"]);
        },
      },
    });

  const { mutate: deleteProductGroup, isLoading: isLoadingDeleteProductGroup } =
    useDeleteProductGroup({
      options: {
        onSuccess: () => {
          queryClient.invalidateQueries(["products-group"]);
          setShowDeleteModal(false);
          router.back();
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

  const {
    data: productGroupData,
    isLoading: isLoadingProductGroup,
    isFetching: isFetchingProductGroup,
  } = useProductGroup({
    id: product_group_id,
    companyId: companyCode,
    options: {
      retry: true,
      onSuccess: (data: any) => {
        pagination.setTotalItems(data?.products?.totalRow);

        const mappedFilterProduct = data?.products?.rows?.map((item: any) => {
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

        const mappedItemProduct = data?.items?.map((item: any) => {
          return {
            id: item.id,
            group: item.group,
            condition: item.condition,
            value_from: item.valueFrom,
            value_to: item.valueTo,
            values: item.values,
          };
        });

        setValue("items", mappedItemProduct);
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
      ...data,
      remove_items: removeList,
    };
    updateProductGroup(formData);
  };

  useEffect(() => {
    if ((!isLoadingProductGroup || !isFetchingProductGroup) && !isFetchingProductBrand) {
      setIsSuccessGetAllData(true);
    }
  }, [isLoadingProductGroup, isFetchingProductGroup, isFetchingProductBrand]);

  const { data: dataUserPermission } = useUserPermissions({
    options: {
      onSuccess: () => {},
    },
  });

  const listPermission = dataUserPermission?.permission?.filter(
    (filtering: any) => filtering.menu === "Product Group"
  );

  if ((isLoadingProductGroup || isFetchingProductGroup) && !isSuccessGetAllData)
    return (
      <Center>
        <Spin tip="Loading data..." />
      </Center>
    );

    

  return (
    <>
      <Col>
        <Row gap="4px" alignItems={"center"}>
          <ArrowLeft style={{ cursor: "pointer" }} onClick={() => router.back()} />
          <Text variant={"h4"}>{productGroupData?.name}</Text>
        </Row>

        <Spacer size={20} />

        <Card padding="20px">
          <Row justifyContent="flex-end" alignItems="center" nowrap>
            <Row gap="16px">
              <Button size="big" variant={"tertiary"} onClick={() => setShowDeleteModal(true)}>
                {lang[t].productGroup.list.button.delete}
              </Button>
							{listPermission?.map((data: any) => data.name)?.includes("Create Product Group") && (
              <Button size="big" variant={"primary"} onClick={handleSubmit(onSubmit)}>
                {isLoadingUpdateProductGroup
                  ? "Loading..."
                  : lang[t].productGroup.detail.button.save}
              </Button>
              )}
            </Row>
          </Row>
        </Card>

        <Spacer size={20} />

        <Accordion>
          <Accordion.Item key={1}>
            <Accordion.Header variant="blue">
              {lang[t].productGroup.detail.accordion.general}
            </Accordion.Header>
            <Accordion.Body>
              <Row width="100%">
                <Col width="100%">
                  <Input
                    width="100%"
                    label={lang[t].productGroup.detail.emptyState.groupName}
                    height="48px"
                    placeholder={"e.g Wafer 1K"}
                    defaultValue={productGroupData?.name}
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
                setIsFetchingBrand={setIsFetchingProductBrand}
                removeList={setRemoveList}
                groupingBasedOnLable={lang[t].productGroup.detail.emptyState.groupingBasedOn}
                conditionLable={lang[t].productGroup.detail.emptyState.condition}
                minLable={lang[t].productGroup.detail.emptyState.min}
                maxLable={lang[t].productGroup.detail.emptyState.max}
                addMoreGroupingLable={lang[t].productGroup.detail.emptyState.addMoreGrouping}
                groupingLable={lang[t].productGroup.grouping}
                type={"edit"}
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

      {showDeleteModal && (
        <ModalDeleteConfirmation
          totalSelected={1}
          itemTitle={productGroupData?.name}
          visible={showDeleteModal}
          isLoading={isLoadingDeleteProductGroup}
          onCancel={() => setShowDeleteModal(false)}
          onOk={() => deleteProductGroup({ ids: [product_group_id], company_id: "KSNI" })}
        />
      )}
    </>
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

const Separator = styled.div`
  display: block;
  height: 0;
  border-bottom: 1px dashed #dddddd;
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default ProductGroupDetail;
