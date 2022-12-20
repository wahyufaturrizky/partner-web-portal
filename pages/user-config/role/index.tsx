import React, { useState } from "react";
import usePagination from "@lucasmogari/react-pagination";
import { useRouter } from "next/router";
import { Button, Col, Pagination, Row, Search, Spacer, Table, Text } from "pink-lava-ui";

import { ModalDeleteConfirmation } from "../../../components/elements/Modal/ModalConfirmationDelete";
import { useDeletePermission, useRolePermissions } from "../../../hooks/user-config/useRole";

import styled from "styled-components";
import { lang } from "lang";
import useDebounce from "lib/useDebounce";

const UserConfigRole: any = () => {
  const t = localStorage.getItem("lan") || "en-US";
  // const companyCode = localStorage.getItem("companyCode");
  const router = useRouter();
  const pagination = usePagination({
    page: 1,
    itemsPerPage: 20,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
  });

  const [search, setSearch] = useState("");
  const [modalDelete, setModalDelete] = useState({ open: false });
  const debounceSearch = useDebounce(search, 1000)

  const {
    data: fields,
    refetch: refetchFields,
    isLoading: isLoadingField,
  } = useRolePermissions({
    options: {
      onSuccess: (data: any) => {
        pagination.setTotalItems(data.totalRow);
      },
    },
    query: {
      // company_id: companyCode,
      search : debounceSearch,
      page: pagination.page,
      limit: pagination.itemsPerPage,
    },
  });

  const { mutate: deleteFields } = useDeletePermission({
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
      title: lang[t].roleList.roleList.roleName,
      dataIndex: "field_name",
      width: "43%",
    },
    {
      title: lang[t].roleList.roleList.company,
      dataIndex: "company",
      width: "42%",
    },
    {
      title: lang[t].roleList.userListAction,
      dataIndex: "action",
      width: "15%",
      align: "left",
    },
  ];

  const data: any = [];
  fields?.rows?.map((field: any) => {
    data.push({
      key: field.id,
      field_name: field.name,
      company: field.company.name,
      action: (
        <div style={{ display: "flex", justifyContent: "left" }}>
          <Button
            size="small"
            onClick={() => {
              router.push(`/user-config/role/${field.id}`);
            }}
            variant="tertiary"
          >
            {lang[t].roleList.tertier.viewDetail}
          </Button>
        </div>
      ),
    });
  });

  const paginateField = data;
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
        <Text variant={"h4"}>{lang[t].roleList.pageTitle.roleList}</Text>
        <Spacer size={20} />
        <Card>
          <Row justifyContent="space-between">
            <Search
              width="380px"
              placeholder={lang[t].roleList.searchBar.roleList}
              onChange={(e: any) => setSearch(e.target.value)}
            />
            {/* <Row gap="16px">
              <Button
                size="big"
                variant={"primary"}
                onClick={() => {
                  router.push("/user-config/role/create");
                }}
              >
                {lang[t].roleList.primary.create}
              </Button>
            </Row> */}
          </Row>
        </Card>
        <Spacer size={10} />
        <Card style={{ padding: "16px 20px" }}>
          <Col gap="60px">
            <Table
              loading={isLoadingField}
              columns={columns}
              data={paginateField}
            />
            <Pagination pagination={pagination} />
          </Col>
        </Card>
      </Col>

      {modalDelete.open && (
        <ModalDeleteConfirmation
          totalSelected={selectedRowKeys?.length}
          itemTitle={
            paginateField?.find((role: any) => role.key === selectedRowKeys[0])?.field_name
          }
          visible={modalDelete.open}
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

export default UserConfigRole;
