import React, { useState } from "react";
import Router from "next/router";
import usePagination from "@lucasmogari/react-pagination";
import { Button, Col, Pagination, Row, Search, Spacer, Table, Tabs, Text } from "pink-lava-ui";

import styled from "styled-components";
import { lang } from "lang";
import { useUserPermissions } from "hooks/user-config/usePermission";
import { useDeleteMenuList, useMenuLists } from "../../../hooks/menu-config/useMenuConfig";
import { ModalDeleteConfirmation } from "../../../components/elements/Modal/ModalConfirmationDelete";

import { colors } from "../../../utils/color";

const MenuConfigList: any = () => {
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
  const [defaultActiveKey, setDefaultActiveKey] = useState("All");
  const [modalDelete, setModalDelete] = useState({ open: false });
  const t = localStorage.getItem("lan") || "en-US";
  const {
    data: fields,
    refetch: refetchFields,
    isLoading: isLoadingField,
  } = useMenuLists({
    options: {
      onSuccess: (data: any) => {
        pagination.setTotalItems(data.totalRow);
      },
    },
    query:
      defaultActiveKey === "All" || defaultActiveKey === "Semua"
        ? {
            company_id: companyCode,
            search,
            page: pagination.page,
            limit: pagination.itemsPerPage,
          }
        : {
            company_id: companyCode,
            search,
            page: pagination.page,
            limit: pagination.itemsPerPage,
            type: defaultActiveKey === "Menu" ? "menu" : "process",
          },
  });

  const { mutate: deleteFields }: any = useDeleteMenuList({
    options: {
      onSuccess: () => {
        refetchFields();
        setModalDelete({ open: false });
        setSelectedRowKeys([]);
      },
    },
  });
  const { data: dataUserPermission } = useUserPermissions({
    options: {
      onSuccess: () => {},
    },
  });

  const listPermission = dataUserPermission?.permission?.filter(
    (filtering: any) => filtering.menu === "Menu List"
  );

  const columns = [
    {
      title: lang[t].menuList.menuListName,
      dataIndex: "field_name",
      width: "43%",
    },
    {
      title: lang[t].menuList.menuListType,
      dataIndex: "field_type",
      width: "42%",
    },
    ...(listPermission?.filter((x: any) => x.viewTypes[0]?.viewType.name === "View").length > 0
      ? [
          {
            title: lang[t].menuList.menuList.action,
            dataIndex: "action",
            width: "15%",
          },
        ]
      : []),
  ];

  const data: any = [];
  fields?.rows?.map((field: any) => {
    data.push({
      key: field.id,
      field_name: field.name,
      field_type: field.type,
      action: (
        <Button
          size="small"
          onClick={() =>
            Router.push({
              pathname: "/config/menu-config/detail",
              query: field,
            })
          }
          variant="tertiary"
        >
          {lang[t].menuList.tertier.viewDetail}
        </Button>
      ),
    });
  });

  const paginateField: any = data;
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const onSelectChange = (selectedRowKeys: any) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleChangeTabs = (e: any) => {
    setDefaultActiveKey(e);
  };

  const listTab = [
    { title: lang[t].menuList.tabs.all },
    { title: lang[t].menuList.tabs.menu },
    { title: lang[t].menuList.tabs.process },
  ];

  return (
    <>
      <Col>
        <Text variant="h4">{lang[t].menuList.pageTitle.menuList}</Text>
        <Spacer size={20} />
        <Card>
          <Row justifyContent="space-between">
            <Search
              width="380px"
              nameIcon="SearchOutlined"
              placeholder={lang[t].menuList.searchBar.menuList}
              colorIcon={colors.grey.regular}
              onChange={(e: any) => setSearch(e.target.value)}
            />
            {/* <Row gap="16px">
							<Button
								size="big"
								variant={"tertiary"}
								onClick={() => setModalDelete({ open: true })}
								disabled={rowSelection.selectedRowKeys?.length === 0}
							>
								Delete
							</Button>
							<Button
								size="big"
								variant={"primary"}
								onClick={() => router.push("/config/menu-config/create")}
							>
								Create
							</Button>
						</Row> */}
          </Row>
        </Card>
        <Spacer size={10} />
        <Card style={{ padding: "16px 20px" }}>
          <Tabs
            defaultActiveKey={defaultActiveKey}
            listTabPane={listTab}
            onChange={handleChangeTabs}
          />
          <Col gap="60px">
            <Table
              loading={isLoadingField}
              columns={columns.filter(
                (filtering) =>
                  filtering.dataIndex !== "id" &&
                  filtering.dataIndex !== "screen" &&
                  filtering.dataIndex !== "created_at" &&
                  filtering.dataIndex !== "modified_by" &&
                  filtering.dataIndex !== "modified_at" &&
                  filtering.dataIndex !== "deleted_by" &&
                  filtering.dataIndex !== "deleted_at" &&
                  filtering.dataIndex !== "process_name" &&
                  filtering.dataIndex !== "created_by"
              )}
              data={paginateField}
              // rowSelection={rowSelection}
            />
            <Pagination pagination={pagination} />
          </Col>
        </Card>
      </Col>

      {modalDelete.open && (
        <ModalDeleteConfirmation
          totalSelected={selectedRowKeys?.length}
          itemTitle={
            paginateField?.find((menu: any) => menu.key === selectedRowKeys[0])?.field_name
          }
          visible={modalDelete.open}
          onCancel={() => setModalDelete({ open: false })}
          onOk={() => deleteFields({ id: selectedRowKeys })}
        />
      )}
    </>
  );
};

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
`;

export default MenuConfigList;
