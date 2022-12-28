import React, { useState } from "react";
import Router from "next/router";
import usePagination from "@lucasmogari/react-pagination";
import { Button, Col, Pagination, Row, Search, Spacer, Table, Text } from "pink-lava-ui";

import { colors } from "utils/color";
import { useDeleteMenuDesignList, useMenuDesignLists } from "hooks/menu-config/useMenuDesign";
import { ModalDeleteConfirmation } from "components/elements/Modal/ModalConfirmationDelete";
import { lang } from "lang";

import styled from "styled-components";
import { useUserPermissions } from "hooks/user-config/usePermission";

const MenuConfigDesign: any = () => {
  const pagination = usePagination({
    page: 1,
    itemsPerPage: 20,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
  });
  const t = localStorage.getItem("lan") || "en-US";
  const companyCode = localStorage.getItem("companyCode");
  const [search, setSearch] = useState("");
  const [modalDelete, setModalDelete] = useState({ open: false });

  const { data: dataUserPermission } = useUserPermissions({
    options: {
      onSuccess: () => {},
    },
  });

  const listPermission = dataUserPermission?.permission?.filter(
    (filtering: any) => filtering.menu === "Menu Design"
  );

  const {
    data: fields,
    refetch: refetchFields,
    isLoading: isLoadingField,
    isFetching: isFetchingField,
  } = useMenuDesignLists({
    query: {
      search,
      page: pagination.page,
      limit: pagination.itemsPerPage,
      company_id: companyCode,
    },
    options: {
      onSuccess: (data: any) => {
        pagination.setTotalItems(data.totalRow);
      },
      select: (data: any) => {
        const mappedData = data?.rows?.map((element: any) => ({
          key: element.id,
          id: element.id,
          field_name: element.name,
          action: (
            <div style={{ display: "flex", justifyContent: "left" }}>
              <Button
                size="small"
                onClick={() =>
                  Router.push({
                    pathname: `/config/menu-config/design/${element.id}`,
                  })
                }
                variant="tertiary"
              >
                {lang[t].menuDesign.tertier.viewDetail}
              </Button>
            </div>
          ),
        }));

        return { data: mappedData, totalRow: data.totalRow };
      },
    },
  });

  const { mutate: deleteFields, isLoading: isLoadingDeleteProcessList } = useDeleteMenuDesignList({
    options: {
      onSuccess: () => {
        refetchFields();
        setModalDelete({ open: false });
        setSelectedRowKeys([]);
      },
    },
  });

  const columns = [
    {
      title: lang[t].menuDesign.menuDesignName,
      dataIndex: "field_name",
      width: "80%",
    },
    ...(listPermission?.filter((el: any) => el.viewTypes[0]?.viewType.name === "View").length > 0
      ? [
          {
            title: lang[t].menuDesign.menuDesignAction,
            dataIndex: "action",
            width: "15%",
            align: "left",
          },
        ]
      : []),
  ];

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const onSelectChange = (selectedRowKeys: any) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <>
      <Col>
        <Text variant="h4">{lang[t].menuDesign.pageTitle.menuDesign}</Text>
        <Spacer size={20} />
        <Card>
          <Row justifyContent="space-between">
            <Search
              width="380px"
              nameIcon="SearchOutlined"
              placeholder={lang[t].menuDesign.searchBar.menuDesign}
              colorIcon={colors.grey.regular}
              onChange={({ target }: any) => setSearch(target.value)}
            />
            <Row gap="16px">
              {listPermission?.filter((data: any) => data.viewTypes[0]?.viewType.name === "Delete")
                .length > 0 && (
                <Button
                  size="big"
                  variant="tertiary"
                  onClick={() => setModalDelete({ open: true })}
                  disabled={rowSelection.selectedRowKeys?.length === 0}
                >
                  Delete
                </Button>
              )}

              {listPermission?.filter((data: any) => data.viewTypes[0]?.viewType.name === "Create")
                .length > 0 && (
                <Button
                  size="big"
                  variant="primary"
                  onClick={() => Router.push("/config/menu-config/design/create")}
                >
                  Create
                </Button>
              )}
            </Row>
          </Row>
        </Card>
        <Spacer size={10} />
        <Card style={{ padding: "16px 20px" }}>
          <Col gap="60px">
            <Table
              loading={isLoadingField || isFetchingField}
              columns={columns}
              data={fields?.data}
              rowSelection={rowSelection}
            />
            <Pagination pagination={pagination} />
          </Col>
        </Card>
      </Col>

      {modalDelete.open && (
        <ModalDeleteConfirmation
          totalSelected={selectedRowKeys?.length}
          itemTitle={fields?.data?.find((menu: any) => menu.key === selectedRowKeys[0])?.field_name}
          visible={modalDelete.open}
          isLoading={isLoadingDeleteProcessList}
          onCancel={() => setModalDelete({ open: false })}
          onOk={() => deleteFields({ ids: selectedRowKeys })}
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

export default MenuConfigDesign;
