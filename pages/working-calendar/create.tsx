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
  Radio,
} from "pink-lava-ui";
import styled from "styled-components";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useCreateUOM } from "../../hooks/mdm/unit-of-measure/useUOM";
import { queryClient } from "../_app";
import useDebounce from "../../lib/useDebounce";
import { useUOMCategoryInfiniteLists } from "../../hooks/mdm/unit-of-measure-category/useUOMCategory";
import ICCompany from "../../assets/icons/ic-company.svg";
import ICWorld from "../../assets/icons/ic-world.svg";
import Icon from "@ant-design/icons";

const WorldSvg = () => <ICWorld />;

const WorldIcon = (props: any) => <Icon component={WorldSvg} {...props} />;

const CompanySvg = () => <ICCompany />;

const CompanyIcon = (props: any) => <Icon component={CompanySvg} {...props} />;

const WorkingCalendarCreate = () => {
  const router = useRouter();

  const [statusCard, setStatusCard] = useState("country");
  const [radioValue, setRadioValue] = useState("companyInternal");

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
        <Text variant={"h4"}>Create Working Calendar</Text>
      </Row>

      <Spacer size={20} />

      <Card>
        <Row justifyContent="space-between" alignItems="center" nowrap>
          <Row gap="16px">
            <Button size="big" variant={"tertiary"} onClick={() => router.back()}>
              Cancel
            </Button>
            <Button size="big" variant={"secondary"} onClick={() => {}}>
              Preview Calendar
            </Button>
            <Button size="big" variant={"primary"} onClick={handleSubmit(onSubmit)}>
              {isLoadingCreateUom ? "Loading..." : "Save"}
            </Button>
          </Row>
        </Row>
      </Card>

      <Spacer size={20} />

      <Card>
        <Row width="100%" noWrap>
          <Col width={"100%"}>
            <Text variant="headingRegular">
              Calendar Name<span style={{ color: "#EB008B" }}>*</span>
            </Text>
            <Row width={"50%"}>
              <Input
                width="50%"
                height="40px"
                label=""
                placeholder={"e.g NBT-ID"}
                {...register("calendar_name")}
              />
            </Row>

            <Spacer size={20} />

            <Separator />

            <Spacer size={20} />

            <Text variant={"headingMedium"}>How do you want this type of calendar ?</Text>

            <Spacer size={10} />

            <Row gap="8px">
              <CardSelection
                isActive={statusCard === "country"}
                onClick={() => {
                  setStatusCard("country");
                }}
              >
                <Col alignItems={"center"} justifyContent={"center"}>
                  <WorldIcon
                    style={{
                      color: statusCard === "country" ? "#EB008B" : "#666666",
                    }}
                  />

                  <Text
                    variant={"body2"}
                    textAlign={"center"}
                    color={statusCard === "country" ? "pink.regular" : "black.dark"}
                    hoverColor={statusCard === "country" ? "pink.regular" : "black.dark"}
                  >
                    Use for country only
                  </Text>
                </Col>
              </CardSelection>

              <CardSelection
                isActive={statusCard === "company"}
                onClick={() => {
                  setStatusCard("company");
                }}
              >
                <Col alignItems={"center"} justifyContent={"center"}>
                  <CompanyIcon
                    style={{
                      color: statusCard === "company" ? "#EB008B" : "#666666",
                    }}
                  />

                  <Text
                    variant={"body2"}
                    textAlign={"center"}
                    color={statusCard === "company" ? "pink.regular" : "black.dark"}
                    hoverColor={statusCard === "company" ? "pink.regular" : "black.dark"}
                  >
                    Set custom for company
                  </Text>
                </Col>
              </CardSelection>
            </Row>

            <Spacer size={20} />

            <Text variant="headingRegular">
              Country<span style={{ color: "#EB008B" }}>*</span>
            </Text>
            <FormSelect
              defaultValue={""}
              style={{ width: "50%" }}
              size={"large"}
              placeholder={"Select"}
              borderColor={"#AAAAAA"}
              arrowColor={"#000"}
              withSearch
              isLoading={false}
              isLoadingMore={false}
              fetchMore={() => {}}
              items={[]}
              onChange={(value: any) => {}}
              onSearch={(value: any) => {}}
            />

            <Spacer size={20} />

            <Row gap={"8px"} alignItems={"center"}>
              <Radio
                value={"companyInternal"}
                checked={radioValue === "companyInternal"}
                onChange={(e: any) => {
                  setRadioValue(e.target.value);
                }}
              >
                Company Internal Structure
              </Radio>
              <Radio
                value={"branch"}
                checked={radioValue === "branch"}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setRadioValue(e.target.value);
                }}
              >
                Branch
              </Radio>
            </Row>

            
            {/* 
            <Text variant="headingRegular">
              Country<span style={{ color: "#EB008B" }}>*</span>
            </Text>
            <FormSelect
              defaultValue={""}
              style={{ width: "50%" }}
              size={"large"}
              placeholder={"Select"}
              borderColor={"#AAAAAA"}
              arrowColor={"#000"}
              withSearch
              isLoading={false}
              isLoadingMore={false}
              fetchMore={() => {}}
              items={[]}
              onChange={(value: any) => {}}
              onSearch={(value: any) => {}}
            /> */}
          </Col>
        </Row>
      </Card>
    </Col>
  );
};

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: ${(p: any) => (p.padding ? p.padding : "16px")};
`;

const CardSelection = styled.div`
  width: 258px;
  background: #ffffff;
  border-radius: 16px;
  border: ${(props) => (props.isActive ? "2px solid #EB008B" : "1px solid #aaaaaa")};
  box-sizing: border-box;
  cursor: pointer;
  padding: 8px;
`;

const Separator = styled.div`
  display: block;
  height: 0;
  border-bottom: 1px dashed #dddddd;
`;

const Label = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  color: #000000;
`;

export default WorkingCalendarCreate;
