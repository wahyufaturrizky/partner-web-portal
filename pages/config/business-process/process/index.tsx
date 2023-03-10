import usePagination from "@lucasmogari/react-pagination";
import Router from "next/router";
import {
  Button, Col, Dropdown, Pagination, Row, Search, Spacer, Table, Text,
} from "pink-lava-ui";
import React, { useState } from "react";
import styled from "styled-components";
import { lang } from "lang";
import { useUserPermissions } from "hooks/user-config/usePermission";
import { ModalDeleteConfirmation } from "../../../../components/elements/Modal/ModalConfirmationDelete";
import { useConfigs } from "../../../../hooks/config/useConfig";
import { useDeleteProcessList, useProcessLists } from "../../../../hooks/business-process/useProcess";
import { colors } from "../../../../utils/color";

const ProcessList: any = () => {
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
  const [dataListDropdownModul, setDataListDropdownModul] = useState(null);
  const [modalDelete, setModalDelete] = useState({ open: false });

  const { data: dataUserPermission } = useUserPermissions({
    options: {
		  onSuccess: () => {},
    },
	  });

	  const listPermission = dataUserPermission?.permission?.filter(
    (filtering: any) => filtering.menu === "Process",
	  );

  const {
    data: dataConfigsModule,
    refetch: refetchConfigModule,
    isLoading: isLoadingConfigModule,
  } = useConfigs();

  const {
    data: fields,
    refetch: refetchFields,
    isLoading: isLoadingField,
  } = useProcessLists({
    options: {
      onSuccess: (data: any) => {
        pagination.setTotalItems(data.totalRow);
      },
    },
    query: dataListDropdownModul
      ? {
        search,
        page: pagination.page,
        limit: pagination.itemsPerPage,
        module: dataListDropdownModul,
        company_id: companyCode,
			  }
      : {
        search,
        page: pagination.page,
        limit: pagination.itemsPerPage,
        company_id: companyCode,
      },
  });

  const { mutate: deleteFields, isLoading: isLoadingDeleteProcessList } = useDeleteProcessList({
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
      title: lang[t].process.permissionList.name,
      dataIndex: "field_name",
      width: "43%",
    },
    {
      title: lang[t].process.permissionList.module,
      dataIndex: "field_module",
      width: "42%",
    },
    ...(listPermission?.some((el: any) => el.viewTypes[0]?.viewType.name === "View")
      ? [
        {
          title: lang[t].process.permissionList.action,
          dataIndex: "action",
          width: "15%",
        },
		  ]
      : []),

  ];

  const data: any[] = [];
  fields?.rows?.map((field: any) => {
    data.push({
      key: field.id,
      field_name: field.name,
      field_module: field?.module?.name,
      action: (
        <Button
          size="small"
          onClick={() => Router.push({
					    pathname: "/config/business-process/process/detail",
					    query: field,
					  })}
          variant="tertiary"
        >
          {lang[t].process.tertier.viewDetail}
        </Button>
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

  const handleChangeDropdown = (value: any) => {
    setDataListDropdownModul(value);
  };

  const handleClearDropdownModul = () => {
    setDataListDropdownModul(null);
  };

  return (
    <>
      <Col>
        <Text variant="h4">{lang[t].process.pageTitle.processList}</Text>
        <Spacer size={20} />
        <Card>
          <Row justifyContent="space-between">
            <Row alignItems="center">
              <Search
                width="380px"
                nameIcon="SearchOutlined"
                placeholder={lang[t].process.searchBar.processList}
                colorIcon={colors.grey.regular}
                onChange={(e: any) => setSearch(e.target.value)}
              />
              <Spacer size={16} />
              <Spacer size={8} />
              <Dropdown
                width="200px"
                label=""
                allowClear
                onClear={handleClearDropdownModul}
                loading={isLoadingConfigModule}
                items={
									dataConfigsModule
									&& dataConfigsModule?.rows.map((data: any) => ({ id: data.id, value: data.name }))
								}
                placeholder={lang[t].process.filterbar.module}
                handleChange={handleChangeDropdown}
                noSearch
                rounded
              />
            </Row>
            <Row gap="16px">
              { listPermission?.filter((data: any) => data.viewTypes[0]?.viewType.name === "Delete")
							  .length > 0
								&& (
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
							  .length > 0
								&& (
<Button size="big" variant="primary" onClick={() => Router.push("/config/business-process/process/create")}>
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
              loading={isLoadingField}
              columns={columns.filter(
							  (filtering) => filtering.dataIndex !== "id"
									&& filtering.dataIndex !== "created_at"
									&& filtering.dataIndex !== "modified_by"
									&& filtering.dataIndex !== "modified_at"
									&& filtering.dataIndex !== "deleted_by"
									&& filtering.dataIndex !== "deleted_at"
									&& filtering.dataIndex !== "created_by",
              )}
              data={paginateField}
            />
            <Pagination pagination={pagination} />
          </Col>
        </Card>
      </Col>

      {modalDelete.open && (
      <ModalDeleteConfirmation
        totalSelected={selectedRowKeys?.length}
        itemTitle={paginateField?.find((menu) => menu.key === selectedRowKeys[0])?.field_name}
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

export default ProcessList;
