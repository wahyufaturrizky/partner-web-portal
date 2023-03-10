import React, { useState } from "react";
import styled from "styled-components";
import { Text, Button, Col, Row, Spacer, Search, Table, Pagination, Switch } from "pink-lava-ui";
import usePagination from "@lucasmogari/react-pagination";
import { useRouter } from "next/router";
import { lang } from "lang";
import { useUserPermissions } from "hooks/user-config/usePermission";
import { useCompanyList, useStatusCompany } from "../../../hooks/company-list/useCompany";

const CompanyList: any = () => {
  const router = useRouter();
  const companyId = localStorage.getItem("companyId");
  const companyCode = localStorage.getItem("companyCode");
  const t = localStorage.getItem("lan") || "en-US";
  const pagination = usePagination({
    page: 1,
    itemsPerPage: 20,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [toggleSelectedId, setToggleSelectedId] = useState();
  const [statusToggle, setStatusToggle] = useState(0);

  const { data: dataUserPermission } = useUserPermissions({
    options: {
      onSuccess: () => {},
    },
  });

  const listPermission = dataUserPermission?.permission?.filter(
    (filtering: any) => filtering.menu === "Company List"
  );

  const columns = [
    {
      title: lang[t].companyList.companyName,
      dataIndex: "name",
    },
    {
      title: lang[t].companyList.companyType,
      dataIndex: "type",
    },
    {
      title: lang[t].companyList.industryFields,
      dataIndex: "fields",
    },
    {
      title: lang[t].companyList.active,
      dataIndex: "active",
    },
    {
      title: lang[t].companyList.action,
      dataIndex: "action",
      width: "15%",
      align: "left",
    },
  ];

  const {
    data: fields,
    refetch: refetchFields,
    isLoading: isLoadingData,
  } = useCompanyList({
    options: {
      onSuccess: (data) => {
        pagination.setTotalItems(data.totalRow);
        setIsLoading(false);
      },
    },
    query: {
      search,
      page: pagination.page,
      limit: pagination.itemsPerPage,
      company_id: companyCode,
    },
  });

  const { mutate: updateStatusCompany, isLoading: isLoadingUpdateStatus } = useStatusCompany({
    companyId: toggleSelectedId,
    status: statusToggle,
    options: {
      onSuccess: (data) => {
        if (data) {
          // setIsLoading(false);
          refetchFields();
          alert("Updated successfully");
        }
      },
      onSettled: (error) => {
        // setIsLoading(false);
        window.alert(error.data.message);
      },
    },
  });

  const data = [];
  fields?.rows?.map((field) => {
    data.push({
      key: field.id,
      name: field.name,
      type: field.companyType,
      fields: field.industry,
      // active: field.status ? 'active' : 'inactive',
      active: (
        <Switch
          defaultChecked={!!field.isActive}
          onChange={() => handleChangeStatus(field.id, field.isActive)}
        />
      ),
      action: listPermission?.filter((data: any) => data.viewTypes[0]?.viewType.name === "View")
        .length > 0 && (
        <div style={{ display: "flex", justifyContent: "left" }}>
          <Button
            size="small"
            onClick={() => {
              router.push(`/config/company-list/${field.id}`);
            }}
            variant="tertiary"
          >
            {lang[t].companyList.tertier.viewDetail}
          </Button>
        </div>
      ),
    });
  });

  const paginateField = data;
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleChangeStatus = async (id, status) => {
    await setToggleSelectedId(id);
    await setStatusToggle(status ? 0 : 1);
    // setIsLoading(true)
    updateStatusCompany(id, status);
  };

  return (
    <Col>
      <Text variant="h4">{lang[t].companyList.companyList}</Text>
      <Spacer size={20} />
      <Card>
        <Row justifyContent="space-between">
          <Search
            width="380px"
            placeholder={lang[t].companyList.placeholderSearchCompanyName}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Row gap="16px">
            {/* <Button
                size="big"
                variant={"tertiary"}
                onClick={() => setModalDelete({ open: true })}
                disabled={rowSelection.selectedRowKeys?.length === 0}
              >
                Delete
              </Button> */}
            <Button
              size="big"
              variant="primary"
              onClick={() => {
                router.push("/config/company-list/create");
              }}
            >
              {lang[t].companyList.addNewCompany}
            </Button>
          </Row>
        </Row>
      </Card>
      <Spacer size={10} />
      {!isLoading && (
        <Card style={{ padding: "16px 20px" }}>
          <Col gap="60px">
            {!isLoadingData && <Table columns={columns} data={paginateField} />}

            <Pagination pagination={pagination} />
          </Col>
        </Card>
      )}
    </Col>
  );
};

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
`;

export default CompanyList;
