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
import { lang } from "lang";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
const schema = yup
	.object({
		name: yup.string().required("Name is Required"),
		format: yup.string().required("format is Required"),
		uom_category_id: yup.string().required("Category is Required"),
	})
	.required();

const UOMCreate = () => {
  const t = localStorage.getItem("lan") || "en-US";
  const router = useRouter();
  const companyId = localStorage.getItem("companyId")
  const companyCode = localStorage.getItem("companyCode")
  const [listUomCategory, setListUomCategory] = useState<any[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [search, setSearch] = useState("");
  const debounceFetch = useDebounce(search, 1000);

  const { register, control, handleSubmit, formState: { errors }, } = useForm({resolver: yupResolver(schema),});

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
      company_id: companyCode,
      ...data,
    };
    createUom(formData);
  };

  return (
    <Col>
      <Row gap="4px">
        <Text variant={"h4"}>{lang[t].unitOfMeasure.pageTitle.create}</Text>
      </Row>

      <Spacer size={20} />

      <Card>
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
              {lang[t].unitOfMeasure.tertier.cancel}
            </Button>
            <Button size="big" variant={"primary"} onClick={handleSubmit(onSubmit)}>
              {isLoadingCreateUom ? "Loading..." : lang[t].unitOfMeasure.primary.save}
            </Button>
          </Row>
        </Row>
      </Card>

      <Spacer size={20} />

      <Accordion>
        <Accordion.Item key={1}>
          <Accordion.Header variant="blue">{lang[t].unitOfMeasure.accordion.general}</Accordion.Header>
          <Accordion.Body>
            <Row width="100%" noWrap>
              <Col width={"100%"}>
                <Input
                  width="100%"
                  label="Uom Name"
                  height="40px"
                  required
                  placeholder={"e.g gram"}
                  error={errors?.name?.message}
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
                    <div style={{
                      display: 'flex'
                      }}>
                      <Label>UoM Category</Label>
                      <Span>&#42;</Span>
                    </div>
                      <Spacer size={3} />
                      <FormSelect
                        style={{ width: "100%" }}
                        size={"large"}
                        placeholder={"select uom category"}
                        borderColor={"#AAAAAA"}
                        arrowColor={"#000"}
                        withSearch
                        required
                        error={errors?.uom_category_id?.message}
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
                required
                error={errors?.format?.message}
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

const Span = styled.span`
  color: #ed1c24;
  margin-left: 5px;
  font-weight: bold;
`;

export default UOMCreate;
