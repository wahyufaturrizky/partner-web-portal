import React, { useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import usePagination from "@lucasmogari/react-pagination";
import { Text, Button, Col, Row, Spacer, Search, Table, Pagination, Dropdown } from "pink-lava-ui";

import { useMenuLists } from "../../../hooks/menu-config/useMenuConfig";
import { usePartnerConfigPermissionLists } from "../../../hooks/user-config/usePermission";
import { lang } from "lang";

const UserConfigPermission: any = () => {
  const router = useRouter();
  const t = localStorage.getItem("lan") || "en-US";
  const companyCode = localStorage.getItem("companyCode");
  const pagination = usePagination({
    page: 1,
    itemsPerPage: 20,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
  });

  const [search, setSearch] = useState("");
  const [dataListDropdownMenu, setDataListDropdownMenu] = useState(null);
  const [dataListDropdownIsSystemConfig, setDataListDropdownIsSystemConfig] = useState(null);

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

  const { data: fieldsMenuList, isLoading: isLoadingMenuList } = useMenuLists({
    query: {
      company_id: companyCode,
    },
    options: {
      onSuccess: (data: any) => {
        pagination.setTotalItems(data.totalRow);
      },
    },
  });

  const {
    data: fields,
    refetch: refetchFields,
    isLoading: isLoadingFields,
  } = usePartnerConfigPermissionLists({
    options: {
      onSuccess: (data: any) => {
        pagination.setTotalItems(data.totalRow);
      },
    },
    query: {
      search,
      page: pagination.page,
      limit: pagination.itemsPerPage,
      sysConfigSearch: dataListDropdownIsSystemConfig,
      menuId: dataListDropdownMenu,
      company_id: companyCode,
    },
  });

  const columns = [
    {
      title: lang[t].permissionList.permissionListName,
      dataIndex: "field_name",
    },
    {
      title: lang[t].permissionList.permissionList.associated,
      dataIndex: "field_menu",
      render: (text: any) => text.name,
    },
    {
      title: lang[t].permissionList.permissionList.systemConfig,
      dataIndex: "field_is_system_config",
      render: (text: any) => `${text}`,
    },
    {
      title: lang[t].permissionList.permissionList.action,
      dataIndex: "action",
    },
  ];

  const data: any[] = [];
  fields?.rows?.map((field: any) => {
    data.push({
      key: field.id,
      field_name: field.name,
      field_menu: field.menu,
      field_is_system_config: field.isSystemConfig,
      approval_status: field.status,
      action: (
        <Button
          size="small"
          onClick={() => {
            router.push(`/user-config/permission//${field.id}`);
          }}
          variant="tertiary"
        >
          {lang[t].permissionList.tertier.viewDetail}
        </Button>
      ),
    });
  });

  const paginateField: any = data;
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const handleChangeDropdownMenu = (value: any) => {
    setDataListDropdownMenu(value);
  };

  const handleClearDropdownMenu = (name: any) => {
    setDataListDropdownMenu(null);
  };

  const handleChangeDropdownIsSystemConfig = (value: any) => {
    setDataListDropdownIsSystemConfig(value);
  };

  const handleClearDropdownIsSystemConfig = (name: any) => {
    setDataListDropdownIsSystemConfig(null);
  };

  return (
    <>
      <Col>
        <Text variant={"h4"}>{lang[t].permissionList.pageTitle.permissionList}</Text>
        <Spacer size={20} />
        <HeaderFilter>
          <Row alignItems="center" noWrap>
            <Search
              width="360px"
              placeholder={lang[t].permissionList.searchBar.permissionList}
              onChange={(e: any) => setSearch(e.target.value)}
            />

            <Spacer size={16} />

            <Dropdown
              width="352px"
              label=""
              allowClear
              onClear={handleClearDropdownMenu}
              loading={isLoadingMenuList}
              items={
                fieldsMenuList &&
                fieldsMenuList?.rows.map((data: any) => ({ id: data.id, value: data.name }))
              }
              placeholder={lang[t].permissionList.filterbar.menu}
              handleChange={handleChangeDropdownMenu}
              noSearch
              rounded
            />

            <Spacer size={16} />

            <Dropdown
              width="352px"
              label=""
              allowClear
              onClear={handleClearDropdownIsSystemConfig}
              items={valueIsSystemConfig}
              placeholder={lang[t].permissionList.filterbar.systemBar}
              handleChange={handleChangeDropdownIsSystemConfig}
              noSearch
              rounded
            />
          </Row>

          <Row gap="16px">
            <Button
              size="big"
              variant={"primary"}
              hidden
              onClick={() => {
                router.push("/user-config/permission/create");
              }}
            >
              {lang[t].permissionList.primary.create}
            </Button>
          </Row>
        </HeaderFilter>
        <Spacer size={10} />
        <Card style={{ padding: "16px 20px" }}>
          <Col gap="60px">
            <Table loading={isLoadingFields} columns={columns} data={paginateField} />
            <Pagination pagination={pagination} />
          </Col>
        </Card>
      </Col>
    </>
  );
};

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
`;

const HeaderFilter = styled.div`
  display: flex;
  background-color: #fff;
  border-radius: 24px;
  padding: 16px 24px;
  justify-content: space-between;
  gap: 1rem;
`;

export default UserConfigPermission;
