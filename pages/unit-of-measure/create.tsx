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
} from "pink-lava-ui";
import styled from "styled-components";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useCreateUOM } from "../../hooks/mdm/unit-of-measure/useUOM";
import { queryClient } from "../_app";
import useDebounce from "../../lib/useDebounce";
import { useUOMCategoryInfiniteLists } from "../../hooks/mdm/unit-of-measure-category/useUOMCategory";

const UOMCreate = () => {
  const router = useRouter();

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

  const { mutate: createUom, isLoading: isLoadingCreateUom } = useCreateUOM({
    options: {
      onSuccess: () => {
        router.back();
        queryClient.invalidateQueries(["uom-list"]);
      },
    },
  });

  const onSubmit = (data: any) => {
    const formData = {
      company_id: "KSNI",
      ...data,
    };
    createUom(formData);
  };

  return (
    <Col>
      <Row gap="4px">
        <Text variant={"h4"}>Create Unit of Measure</Text>
      </Row>

      <Spacer size={20} />

      <Card padding="20px">
        <Row justifyContent="space-between" alignItems="center" nowrap>
          <Controller
            control={control}
            name="active_status"
            defaultValue={"ACTIVE"}
            render={({ field: { onChange } }) => (
              <Dropdown
                label=""
                width="185px"
                noSearch
                items={[
                  { id: "ACTIVE", value: "Active" },
                  { id: "INACTIVE", value: "Inactive" },
                ]}
                defaultValue="ACTIVE"
                handleChange={(value: any) => {
                  onChange(value);
                }}
              />
            )}
          />

          <Row gap="16px">
            <Button size="big" variant={"tertiary"} onClick={() => router.back()}>
              Cancel
            </Button>
            <Button size="big" variant={"primary"} onClick={handleSubmit(onSubmit)}>
              {isLoadingCreateUom ? "Loading..." : "Save"}
            </Button>
          </Row>
        </Row>
      </Card>

      <Spacer size={20} />

      <Accordion>
        <Accordion.Item key={1}>
          <Accordion.Header variant="blue">General</Accordion.Header>
          <Accordion.Body>
            <Row width="100%" noWrap>
              <Col width={"100%"}>
                <Input
                  width="100%"
                  label="Uom Name"
                  height="40px"
                  placeholder={"e.g gram"}
                  {...register("name")}
                />
              </Col>
              <Spacer size={10} />

              <Col width="100%">
                <Controller
                  control={control}
                  name="uom_category_id"
                  render={({ field: { onChange } }) => (
                    <>
                      <Label>UoM Category</Label>
                      <Spacer size={3} />
                      <FormSelect
                        style={{ width: "100%" }}
                        size={"large"}
                        placeholder={"select uom category"}
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
                          isFetchingUomCategory && !isFetchingMoreUomCategory ? [] : listUomCategory
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
                placeholder={"e.g gr"}
                {...register("format")}
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
  padding: ${(p: any) => (p.padding ? p.padding : "16px")};
`;

const Label = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  color: #000000;
`;

export default UOMCreate;
