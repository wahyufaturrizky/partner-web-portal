import { yupResolver } from "@hookform/resolvers/yup";
import Router, { useRouter } from "next/router";
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
  FormSelect,
} from "pink-lava-ui";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import * as yup from "yup";
import ArrowLeft from "../../../assets/icons/arrow-left.svg";
import { ModalDeleteConfirmation } from "../../../components/elements/Modal/ModalConfirmationDelete";
import { useMenuLists } from "../../../hooks/menu-config/useMenuConfig";
import {
  useDeletePartnerConfigPermissionList,
  usePartnerConfigPermissionList,
  useUpdatePartnerConfigPermissionList,
  useUserPermissions,
} from "../../../hooks/user-config/usePermission";
import { useRolePermissions, useViewTypeListInfiniteList } from "../../../hooks/role/useRole";
import { lang } from "lang";
import useDebounce from "lib/useDebounce";
import Link from "next/link";

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

const DetailPartnerConfigPermissionList: any = () => {
  const router = useRouter();
  const companyCode = localStorage.getItem("companyCode");
  const [searchViewType, setSearchViewType] = useState("");
  const [totalRowsViewTypeList, setTotalRowsViewTypeList] = useState(0);
  const [viewTypeList, setListViewTypeList] = useState<any[]>([]);

  const debounceFetchViewType = useDebounce(searchViewType, 1000);

  const [searchAssociatedMenu, setSearchAssociatedMenu] = useState("");
  const debounceSearchAssociatedMenu = useDebounce(searchAssociatedMenu, 1000);

  const { permission_id } = Router.query;
  const t = localStorage.getItem("lan") || "en-US";
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  }: any = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultValue,
  });

  const [modalDelete, setModalDelete] = useState({ open: false });

  const { mutate: mutateUpdatePartnerConfigPermissionList } = useUpdatePartnerConfigPermissionList({
    options: {
      onSuccess: () => {
        window.alert("Permission partner success updated!");
        Router.back();
      },
      onError: (error: any) => {
        window.alert(error.errors.map((data: any) => `${data.label} ${data.message}`));
      },
    },
    partnerConfigPermissionListId: permission_id,
  });

  const { data: dataPartnerConfigPermissionList, isLoading: isLoadingPartnerConfigPermissionList } =
    usePartnerConfigPermissionList({
      partner_config_menu_list_id: permission_id,
      company_id: companyCode,
      options: {
        onSuccess: (data: any) => {
          setValue("isSystemConfig", data?.isSystemConfig);
          setValue("menuId", data?.menuId);
          setValue("activeStatus", data?.activeStatus);
          setValue("name", data?.name);
        },
      },
    });

  const { data: menuLists } = useMenuLists({
    query: { limit: 0, company_id: companyCode, search: debounceSearchAssociatedMenu },
    options: {
      refetchOnWindowFocus: "always",
    },
  });
  const menus = menuLists?.rows?.map((menu: any) => ({ id: menu.id, value: menu.name }));
  const onSubmit = (data: any) => mutateUpdatePartnerConfigPermissionList(data);
  const { data: dataUserPermission } = useUserPermissions({
    options: {
      onSuccess: () => {},
    },
  });

  const listPermission = dataUserPermission?.permission?.filter(
    (filtering: any) => filtering.menu === "Channel"
  );
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
    window.open("/menu-list/create", "_blank");
  };

  const { mutate: deletePermissions } = useDeletePartnerConfigPermissionList({
    options: {
      onSuccess: () => {
        window.alert("Success deleted");
        Router.back();
      },
    },
  });

  const { data: fieldRole, isLoading: isLoadingFieldRole } = useRolePermissions({
    options: {},
    query: {
      company_id: companyCode,
    },
  });
  // const { data: fieldRole, isLoading: isLoadingFieldRole } = usePartnerConfigPermissionList({
  //   options: {},
  //   query: {
  //     company_id: companyCode,
  //   },
  // });

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
  console.log(dataPartnerConfigPermissionList, "<<<<partner");
  console.log(fieldRole, "<<<<role");
  const systemConfig = watch("isSystemConfig");
  return (
    <>
      <Col>
        <Row gap="4px" alignItems="center">
          <ArrowLeft style={{ cursor: "pointer" }} onClick={() => Router.back()} />
          <Text variant={"h4"}>
            Permission Detail - {dataPartnerConfigPermissionList?.name || "Unknown"}
          </Text>
          {systemConfig && <Lozenge>System Config</Lozenge>}
        </Row>
        <Spacer size={12} />
        <Card padding="20px">
          <Row justifyContent="flex-end" alignItems="center" nowrap>
            <Row>
              <Row gap="16px">
                <Button size="big" variant={"tertiary"} onClick={() => router.back()}>
                  Cancel
                </Button>
                {listPermission?.filter((x: any) => x.viewTypes[0]?.viewType.name === "Update")
                  .length > 0 && (
                  <Button size="big" variant={"primary"} onClick={handleSubmit(onSubmit)}>
                    {lang[t].permissionList.primary.save}
                  </Button>
                )}
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

        <Accordion style={{ position: "relative" }} id="area2">
          <Accordion.Item key={1}>
            <Accordion.Header variant="blue">
              {lang[t].permissionList.accordion.general}
            </Accordion.Header>
            {isLoadingPartnerConfigPermissionList ? (
              <Spin ip="Loading..." />
            ) : (
              <Accordion.Body>
                <Row width="100%" gap="20px" noWrap>
                  <Input
                    width="100%"
                    label={lang[t].permissionList.emptyState.name}
                    height="48px"
                    defaultValue={dataPartnerConfigPermissionList?.name}
                    placeholder={"e.g View Shipment"}
                    {...register("name", { required: true })}
                  />
                  <Dropdown
                    label={lang[t].permissionList.permissionListAssociatedMenu}
                    handleClickActionLabel={handleAddNewAssociated}
                    isShowActionLabel
                    actionLabel="Add New Associated Menu"
                    width={"100%"}
                    containerId="area2"
                    defaultValue={dataPartnerConfigPermissionList?.menuId}
                    items={menus}
                    placeholder={"Select"}
                    handleChange={(value: any) => setValue("menuId", value)}
                    onSearch={(search) => setSearchAssociatedMenu(search)}
                    disabled={systemConfig}
                  />
                </Row>
                <Spacer size={20} />
                <Row width="100%" gap="20px" noWrap>
                  <Col width="100%">
                    {isLoadingViewTypeList ? (
                      <Center>
                        <Spin tip="loading..." />
                      </Center>
                    ) : (
                      <>
                        <Label>View Type</Label>
                        <Spacer size={5} />
                        <CustomFormSelect
                          showArrow
                          height="48px"
                          style={{ width: "100%" }}
                          size={"large"}
                          containerId="area2"
                          placeholder={"Select"}
                          borderColor={"#AAAAAA"}
                          arrowColor={"#000"}
                          withSearch
                          isLoading={isFetchingViewTypeList}
                          isLoadingMore={isFetchingMoreViewTypeList}
                          // fetchMore={() => {
                          //   if (hasNextPageViewTypeList) {
                          //     fetchNextPageViewTypeList();
                          //   }
                          // }}
                          items={
                            isFetchingViewTypeList && !isFetchingMoreViewTypeList
                              ? []
                              : viewTypeList
                          }
                          onChange={(value: any) => {
                            setValue("viewTypes", [value]);
                          }}
                          onSearch={(value: any) => {
                            setSearchViewType(value);
                          }}
                        />
                      </>
                    )}
                  </Col>
                  <div style={{ visibility: "hidden", width: "100%" }}>
                    <Input label="Name" height="48px" placeholder={"e.g 10000000"} />
                  </div>
                </Row>
              </Accordion.Body>
            )}
          </Accordion.Item>
        </Accordion>

        <Spacer size={20} />

        <Row>
          <Col>
            <Button
              size="big"
              variant={"secondary"}
              onClick={() => window.open("/user-config/approval/create", "_self")}
            >
              {lang[t].permissionList.secondary.createApproval}
            </Button>
          </Col>
        </Row>

        <Spacer size={20} />

        <Accordion>
          <Accordion.Item key={1}>
            <Accordion.Header variant="blue">
              <Row gap="8px" alignItems="baseline">
                {lang[t].permissionList.accordion.associatedRole}{" "}
                <Span>(Auto added from roles)</Span>
              </Row>
            </Accordion.Header>
            <Accordion.Body>
              <Accordion>
                <Accordion.Item key={1}>
                  <Accordion.Header>{lang[t].permissionList.permissionListRole}</Accordion.Header>
                  <Accordion.Body padding="0px">
                    {isLoadingPartnerConfigPermissionList ? (
                      <Spin tip="Loading roles..." />
                    ) : (
                      dataPartnerConfigPermissionList?.associatedRole?.map((data: any) => (
                        <Record borderTop key={data.id}>
                          {data.name}

                          <Button
                            size="small"
                            // href={}
                            // onClick={() => router.push(`/user-config/role/${data.id}`)}
                            variant="tertiary"
                          >
                            <Link href={`/user-config/role/${data.id}`}>
                              <p style={{ color: "#EB008B" }}>
                                {lang[t].permissionList.tertier.viewDetail}
                              </p>
                            </Link>
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

      {modalDelete.open && (
        <ModalDeleteConfirmation
          itemTitle={Router.query.name}
          visible={modalDelete.open}
          onCancel={() => setModalDelete({ open: false })}
          onOk={() => deletePermissions({ id: [Number(permission_id)] })}
        />
      )}
    </>
  );
};

const Lozenge = styled.div`
  background: #dddddd;
  border-radius: 64px;
  padding: 4px 8px;
  color: #666666;
  display: flex;
  align-items: center;
  text-align: center;
  height: 32px;
  font-weight: 600;
  font-size: 14px;
  line-height: 24px;
`;

const CustomFormSelect = styled(FormSelect)`
  .ant-select-selection-placeholder {
    line-height: 48px !important;
  }

  .ant-select-selection-search-input {
    height: 48px !important;
  }

  .ant-select-selector {
    height: 48px !important;
  }

  .ant-select-selection-item {
    display: flex;
    align-items: center;
  }
`;

const Label = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  color: #000000;
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
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

export default DetailPartnerConfigPermissionList;
