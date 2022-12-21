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
  FormSelect,
  Spin,
} from "pink-lava-ui";
import styled from "styled-components";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { lang } from "lang";
import { useUserPermissions } from "hooks/user-config/usePermission";
import { useUOMDetail, useUpdateUOM, useDeletUOM } from "../../../hooks/mdm/unit-of-measure/useUOM";
import { queryClient } from "../../_app";
import useDebounce from "../../../lib/useDebounce";
import { useUOMCategoryInfiniteLists } from "../../../hooks/mdm/unit-of-measure-category/useUOMCategory";
import { ModalDeleteConfirmation } from "../../../components/elements/Modal/ModalConfirmationDelete";
import ArrowLeft from "../../assets/icons/arrow-left.svg";

const UOMDetail = () => {
  const t = localStorage.getItem("lan") || "en-US";
  const router = useRouter();
  const companyId = localStorage.getItem("companyId");
  const companyCode = localStorage.getItem("companyCode");
  const { uom_id } = router.query;

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [listUomCategory, setListUomCategory] = useState<any[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [search, setSearch] = useState("");
  const debounceFetch = useDebounce(search, 1000);

  const { register, control, handleSubmit } = useForm();

  const { data: dataUserPermission } = useUserPermissions({
    options: {
      onSuccess: () => {},
    },
  });

  const listPermission = dataUserPermission?.permission?.filter(
    (filtering: any) => filtering.menu === "Unit of Measure",
  );

  const {
    isFetching: isFetchingUomCategory,
    isFetchingNextPage: isFetchingMoreUomCategory,
    hasNextPage,
    fetchNextPage,
  } = useUOMCategoryInfiniteLists({
    query: {
      search: debounceFetch,
      company_id: companyCode,
      limit: 10,
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRows(data.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => group.rows?.map((element: any) => ({
          value: element.uomCategoryId,
          label: element.name,
        })));
        const flattenArray = [].concat(...mappedData);
        setListUomCategory(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (listUomCategory.length < totalRows) {
          return pages.length + 1;
        }
        return undefined;
      },
    },
  });

  const {
    data: UomData,
    isLoading: isLoadingUom,
    isFetching: isFetchingUom,
  } = useUOMDetail({
    id: uom_id,
    companyId: companyCode,
    options: {
      onSuccess: (data: any) => {},
    },
  });

  const { mutate: updateUom, isLoading: isLoadingUpdateUom } = useUpdateUOM({
    companyId: companyCode,
    id: uom_id,
    options: {
      onSuccess: () => {
        router.back();
        queryClient.invalidateQueries(["uom-list"]);
      },
    },
  });

  const { mutate: deleteUOM, isLoading: isLoadingDeleteUOM } = useDeletUOM({
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries(["uom-list"]);
        setShowDeleteModal(false);
        router.back();
      },
    },
  });

  const onSubmit = (data: any) => {
    updateUom(data);
  };

  if (isLoadingUom || isFetchingUom) {
    return (
      <Center>
        <Spin tip="Loading data..." />
      </Center>
    );
  }

  return (
    <>
      <Col>
        <Row gap="4px">
          <ArrowLeft style={{ cursor: "pointer" }} onClick={() => router.back()} />
          <Text variant="h4">{UomData.name}</Text>
        </Row>

        <Spacer size={20} />

        <Card padding="20px">
          <Row justifyContent="space-between" alignItems="center" nowrap>
            <Controller
              control={control}
              name="active_status"
              defaultValue={UomData.activeStatus}
              render={({ field: { onChange } }) => (
                <Dropdown
                  label=""
                  width="185px"
                  noSearch
                  items={[
                    { id: "ACTIVE", value: "Active" },
                    { id: "INACTIVE", value: "Inactive" },
                  ]}
                  defaultValue={UomData.activeStatus}
                  handleChange={(value: any) => {
                    onChange(value);
                  }}
                />
              )}
            />

            <Row gap="16px">
              {listPermission?.filter((data: any) => data.viewTypes[0]?.viewType.name === "Delete")
                .length > 0 && (
                <Button size="big" variant="tertiary" onClick={() => setShowDeleteModal(true)}>
                  {lang[t].unitOfMeasure.tertier.delete}
                </Button>
              )}

              {listPermission?.filter((data: any) => data.viewTypes[0]?.viewType.name === "Update")
                .length > 0 && (
                <Button size="big" variant="primary" onClick={handleSubmit(onSubmit)}>
                  {isLoadingUpdateUom ? "Loading..." : lang[t].unitOfMeasure.primary.save}
                </Button>
              )}
            </Row>
          </Row>
        </Card>

        <Spacer size={20} />

        <Accordion>
          <Accordion.Item key={1}>
            <Accordion.Header variant="blue">
              {lang[t].unitOfMeasure.accordion.general}
            </Accordion.Header>
            <Accordion.Body>
              <Row width="100%" noWrap>
                <Col width="100%">
                  <Input
                    width="100%"
                    label="Uom Name"
                    height="40px"
                    placeholder="e.g gram"
                    defaultValue={UomData.name}
                    {...register("name")}
                  />
                </Col>
                <Spacer size={10} />

                <Col width="100%">
                  <Controller
                    control={control}
                    name="uom_category_id"
                    defaultValue={UomData.uomCategoryId}
                    render={({ field: { onChange } }) => (
                      <>
                        <Label>UoM Category</Label>
                        <Spacer size={3} />
                        <FormSelect
                          defaultValue={UomData.uomCategoryId}
                          style={{ width: "100%" }}
                          size="large"
                          placeholder="select uom category"
                          borderColor="#AAAAAA"
                          arrowColor="#000"
                          withSearch
                          isLoading={isFetchingUomCategory}
                          isLoadingMore={isFetchingMoreUomCategory}
                          fetchMore={() => {
                            if (hasNextPage) {
                              fetchNextPage();
                            }
                          }}
                          items={
                            isFetchingUomCategory && !isFetchingMoreUomCategory
                              ? []
                              : listUomCategory
                          }
                          onChange={(value: any) => {
                            onChange(value);
                          }}
                          onSearch={(value: any) => {
                            setSearch(value);
                          }}
                        />
                      </>
                    )}
                  />

                  <Text
                    onClick={() => window.open(`/unit-of-measure/create`, "_blank")}
                    clickable
                    variant="headingSmall"
                    color="pink.regular"
                  >
                    Go to UoM Category &gt;
                  </Text>
                </Col>
              </Row>

              <Row width="50%" noWrap>
                <Input
                  width="100%"
                  label="Uom Format"
                  height="40px"
                  placeholder="e.g gr"
                  defaultValue={UomData.format}
                  {...register("format")}
                />
              </Row>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Col>

      {showDeleteModal && (
        <ModalDeleteConfirmation
          totalSelected={1}
          itemTitle={UomData.name}
          visible={showDeleteModal}
          isLoading={isLoadingDeleteUOM}
          onCancel={() => setShowDeleteModal(false)}
          onOk={() => deleteUOM({ ids: [uom_id], company_id: companyCode })}
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

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Label = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  color: #000000;
`;

export default UOMDetail;
