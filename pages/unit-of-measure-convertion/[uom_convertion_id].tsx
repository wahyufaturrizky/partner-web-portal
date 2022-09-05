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
import { useUOMDetail, useUpdateUOM, useDeletUOM } from "../../hooks/mdm/unit-of-measure/useUOM";
import { queryClient } from "../_app";
import useDebounce from "../../lib/useDebounce";
import { useUOMCategoryInfiniteLists } from "../../hooks/mdm/unit-of-measure-category/useUOMCategory";
import { ModalDeleteConfirmation } from "../../components/elements/Modal/ModalConfirmationDelete";
import ArrowLeft from "../../assets/icons/arrow-left.svg";

const UOMConvertionDetail = () => {
  const router = useRouter();
  const { uom_convertion_id } = router.query;

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [listUomCategory, setListUomCategory] = useState<any[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [search, setSearch] = useState("");
  const debounceFetch = useDebounce(search, 1000);

  const { register, control, handleSubmit } = useForm();

  const {
    isFetching: isFetchingUomCategory,
    isFetchingNextPage: isFetchingMoreUomCategory,
    hasNextPage,
    fetchNextPage,
  } = useUOMCategoryInfiniteLists({
    query: {
      search: debounceFetch,
      company_id: "KSNI",
      limit: 10,
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRows(data.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => {
          return group.rows?.map((element: any) => {
            return {
              value: element.uomCategoryId,
              label: element.name,
            };
          });
        });
        const flattenArray = [].concat(...mappedData);
        setListUomCategory(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (listUomCategory.length < totalRows) {
          return pages.length + 1;
        } else {
          return undefined;
        }
      },
    },
  });

  const {
    data: UomData,
    isLoading: isLoadingUom,
    isFetching: isFetchingUom,
  } = useUOMDetail({
    id: uom_convertion_id,
    companyId: "KSNI",
    options: {
      onSuccess: (data: any) => {},
    },
  });

  const { mutate: updateUom, isLoading: isLoadingUpdateUom } = useUpdateUOM({
    companyId: "KSNI",
    id: uom_convertion_id,
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

  if (isLoadingUom || isFetchingUom)
    return (
      <Center>
        <Spin tip="Loading data..." />
      </Center>
    );

  return (
    <>
      <Col>
        <Row gap="4px">
          <ArrowLeft style={{ cursor: "pointer" }} onClick={() => router.back()} />
          <Text variant={"h4"}>{UomData.name}</Text>
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
              <Button size="big" variant={"tertiary"} onClick={() => setShowDeleteModal(true)}>
                Delete
              </Button>
              <Button size="big" variant={"primary"} onClick={handleSubmit(onSubmit)}>
                {isLoadingUpdateUom ? "Loading..." : "Save"}
              </Button>
            </Row>
          </Row>
        </Card>

        <Spacer size={20} />

        <Accordion>
          <Accordion.Item key={1}>
            <Accordion.Body>
              <Row width="100%" noWrap>
                <Col width={"100%"}>
                  <Input
                    width="100%"
                    label="Uom Conversion Name"
                    height="40px"
                    placeholder={"e.g gram"}
                    // defaultValue={UomData.name}
                    {...register("name", { required: "Please enter name." })}
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
                        <Label>Base UoM</Label>
                        <Spacer size={3} />
                        <FormSelect
                        //   defaultValue={UomData.uomCategoryId}
                          style={{ width: "100%" }}
                          size={"large"}
                          placeholder={"PCS"}
                          borderColor={"#AAAAAA"}
                          arrowColor={"#000"}
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
                <Col>
                    <HeaderLabel>Conversion</HeaderLabel>
                    <Spacer size={20} />
                    <Row width="100%" noWrap>
                        <Input
                        width="100%"
                        label="Conversion Number"
                        height="40px"
                        placeholder={"e.g gr"}
                        defaultValue={UomData.format}
                        {...register("format", { required: "Please enter name." })}
                        />
                        <Spacer size={20} />
                        <Controller
                            control={control}
                            name="uom_category_id"
                            defaultValue={UomData.uomCategoryId}
                            render={({ field: { onChange } }) => (
                            <Col width="100%" noWrap>
                                <Label>UoM (per 1 Qty)</Label>
                                <Spacer size={3} />
                                <FormSelect
                                //   defaultValue={UomData.uomCategoryId}
                                style={{ width: "100%" }}
                                size={"large"}
                                placeholder={"PACK"}
                                borderColor={"#AAAAAA"}
                                arrowColor={"#000"}
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
                            </Col>
                            )}
                        />
                    </Row>
                </Col>
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
          onOk={() => deleteUOM({ ids: [uom_convertion_id], company_id: "KSNI" })}
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

const HeaderLabel = styled.p`
  font-weight: 600;
  font-size: 20px;
  line-height: 27px;
  color: #1E858E;
`

export default UOMConvertionDetail;
