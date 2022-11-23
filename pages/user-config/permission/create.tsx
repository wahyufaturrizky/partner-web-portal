import { yupResolver } from "@hookform/resolvers/yup";
import Router from "next/router";
import {
  Accordion,
  Button,
  Col,
  Dropdown,
  Input,
  Row,
  Spacer,
  Spin,
  Text,
  FormSelectCustom,
} from "pink-lava-ui";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import * as yup from "yup";
import ArrowLeft from "../../../assets/icons/arrow-left.svg";

import { useMenuLists } from "../../../hooks/menu-config/useMenuConfig";
import { useCreatePartnerConfigPermissionList } from "../../../hooks/user-config/usePermission";
import { useRolePermissions, useViewTypeListInfiniteList } from "../../../hooks/role/useRole";
import useDebounce from "lib/useDebounce";
import { useEmployeeInfiniteLists } from "hooks/mdm/employee-list/useEmployeeListMDM";

const schema = yup
  .object({
    name: yup.string().required("Name is Required"),
    menuId: yup.string().required("Associated Menu is Required"),
    activeStatus: yup.string().required(),
  })
  .required();

const defaultValue = {
  activeStatus: "Y",
};

const CreatePartnerConfigPermissionList: any = () => {
  const [searchViewType, setSearchViewType] = useState("");
  const [totalRowsViewTypeList, setTotalRowsViewTypeList] = useState(0);
  const [viewTypeList, setListViewTypeList] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultValue,
  });

  const debounceFetchViewType = useDebounce(searchViewType, 1000);

  const { mutate: mutatePartnerConfigPermissionList } = useCreatePartnerConfigPermissionList({
    options: {
      onSuccess: () => {
        window.alert("Permission partner success created!");
        Router.back();
      },
      onError: (error: any) => {
        window.alert(error.errors.map((data: any) => `${data.label} ${data.message}`));
      },
    },
  });

  const { data: menuLists } = useMenuLists({
    query: { limit: 0, owner: "HERMES", company_id: "KSNI" },
    options: {
      refetchOnWindowFocus: "always",
    },
  });
  const menus = menuLists?.rows?.map((menu: any) => ({ id: menu.id, value: menu.name }));
  const onSubmit = (data: any) => mutatePartnerConfigPermissionList(data);

  const activeStatus = [
    { id: "Y", value: '<div key="1" style="color:green;">Active</div>' },
    { id: "N", value: '<div key="2" style="color:red;">Non Active</div>' },
  ];

  const valueIsSystemConfig = [
    {
      id: true,
      value: "True",
    },
    {
      id: false,
      value: "False",
    },
  ];

  const handleAddNewAssociated = () => {
    window.open("/menu-config/create", "_blank");
  };

  const { data: fieldRole, isLoading: isLoadingFieldRole } = useRolePermissions({
    query: {
      company_id: "KSNI",
    },
  });

  const {
    isFetching: isFetchingViewTypeList,
    isFetchingNextPage: isFetchingMoreViewTypeList,
    hasNextPage: hasNextPageViewTypeList,
    fetchNextPage: fetchNextPageViewTypeList,
    isLoading: isLoadingViewTypeList,
  } = useViewTypeListInfiniteList({
    query: {
      search: debounceFetchViewType,
      limit: 10,
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRowsViewTypeList(data.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => {
          return group.rows?.map((element: any) => {
            return {
              value: element.id,
              label: element.name,
            };
          });
        });
        const flattenArray = [].concat(...mappedData);
        setListViewTypeList(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (viewTypeList.length < totalRowsViewTypeList) {
          return pages.length + 1;
        } else {
          return undefined;
        }
      },
    },
  });

  return (
    <>
      <Col>
        <Row gap="4px" alignItems="center">
          <ArrowLeft style={{ cursor: "pointer" }} onClick={() => Router.back()} />
          <Text variant={"h4"}>Permission List</Text>
        </Row>
        <Spacer size={12} />
        <Card padding="20px">
          <Row justifyContent="space-between" alignItems="center" nowrap>
            <Dropdown
              label=""
              isHtml
              width={"185px"}
              items={activeStatus}
              placeholder={"Status"}
              handleChange={(text: any) => setValue("activeStatus", text)}
              noSearch
              defaultValue="Y"
            />
            <Row>
              <Row gap="16px">
                <Button size="big" variant={"tertiary"} onClick={() => Router.back()}>
                  Cancel
                </Button>
                <Button size="big" variant={"primary"} onClick={handleSubmit(onSubmit)}>
                  Save
                </Button>
              </Row>
            </Row>
          </Row>
        </Card>

        <Spacer size={20} />
        {/* <Alert>
					<Text variant="subtitle2" color="white">
						“General” Associated Menu must be filled.
					</Text>
				</Alert>
				<Spacer size={20} /> */}

        <Accordion>
          <Accordion.Item key={1}>
            <Accordion.Header variant="blue">General</Accordion.Header>
            <Accordion.Body>
              <Row width="100%" gap="20px" noWrap>
                <Input
                  width="100%"
                  label="Name"
                  height="48px"
                  placeholder={"e.g View Shipment"}
                  {...register("name", { required: true })}
                />
                <Dropdown
                  label="Associated Menu"
                  handleClickActionLabel={handleAddNewAssociated}
                  isShowActionLabel
                  actionLabel="Add New Associated Menu"
                  width={"100%"}
                  items={menus}
                  placeholder={"Select"}
                  handleChange={(value) => setValue("menuId", value)}
                  noSearch
                />
              </Row>
              <Row width="100%" gap="20px" noWrap>
                <Col width="100%">
                  <Dropdown
                    label="Is System Config"
                    width={"100%"}
                    items={valueIsSystemConfig}
                    placeholder={"Select"}
                    handleChange={(value) => setValue("isSystemConfig", value)}
                    noSearch
                  />
                </Col>

                <Col width="100%">
                  {isLoadingViewTypeList ? (
                    <Center>
                      <Spin tip="loading..." />
                    </Center>
                  ) : (
                    <>
                      <Label>View Type</Label>
                      <Spacer size={5} />
                      <FormSelectCustom
                        showArrow
                        height="48px"
                        style={{ width: "100%" }}
                        size={"large"}
                        placeholder={"Select"}
                        borderColor={"#AAAAAA"}
                        arrowColor={"#000"}
                        withSearch
                        isLoading={isFetchingViewTypeList}
                        isLoadingMore={isFetchingMoreViewTypeList}
                        fetchMore={() => {
                          if (hasNextPageViewTypeList) {
                            fetchNextPageViewTypeList();
                          }
                        }}
                        items={
                          isFetchingViewTypeList && !isFetchingMoreViewTypeList ? [] : viewTypeList
                        }
                        onChange={(value: any) => {
                          setValue("viewType", value);
                        }}
                        onSearch={(value: any) => {
                          setSearchViewType(value);
                        }}
                      />
                    </>
                  )}
                </Col>
              </Row>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <Spacer size={20} />

        <Accordion>
          <Accordion.Item key={1}>
            <Accordion.Header variant="blue">
              <Row gap="8px" alignItems="baseline">
                Associated Role <Span>(Auto added from roles)</Span>
              </Row>
            </Accordion.Header>
            <Accordion.Body>
              <Accordion>
                <Accordion.Item key={1}>
                  <Accordion.Header>Roles</Accordion.Header>
                  <Accordion.Body padding="0px">
                    {isLoadingFieldRole ? (
                      <Spin tip="Loading roles..." />
                    ) : (
                      fieldRole.rows.map((data) => (
                        <Record borderTop key={data.id}>
                          {data.name}

                          <Button
                            size="small"
                            onClick={() => Router.push(`/role/${data.id}`)}
                            variant="tertiary"
                          >
                            View Detail
                          </Button>
                        </Record>
                      ))
                    )}
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Col>
    </>
  );
};

const Label = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  color: #000000;
`;

const Span = styled.div`
  font-size: 14px;
  line-height: 18px;
  font-weight: normal;
  color: #ffe12e;
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: ${(p) => (p.padding ? p.padding : "16px")};
`;

const Record = styled.div`
  height: 54px;
  padding: 0px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: ${(p) => (p.borderTop ? "0.5px solid #AAAAAA" : "none")};
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default CreatePartnerConfigPermissionList;
