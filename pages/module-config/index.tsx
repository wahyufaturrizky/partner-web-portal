import usePagination from "@lucasmogari/react-pagination";
import { useUserPermissions } from "hooks/user-config/usePermission";
import { lang } from "lang";
import { useRouter } from "next/router";
import { permissionModuleConfig } from "permission/module-config";
import {
  Button,
  Col,
  Dropdown,
  Pagination,
  Row,
  Search,
  Spacer,
  Table,
  Text,
  DropdownMenuOptionGroupCustom,
  Spin
} from "pink-lava-ui";
import React, { useState } from "react";
import styled from "styled-components";
import { ModalDeleteConfirmation } from "../../components/elements/Modal/ModalConfirmationDelete";
import { useConfigs, useDeleteConfig } from "../../hooks/config/useConfig";

const ModuleConfig: any = () => {
  const router = useRouter();
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
  const [modalDelete, setModalDelete] = useState({ open: false });
  const [parent, setParent] = useState("");
  const [parentList, setParentList] = useState([]);
  const t = localStorage.getItem("lan") || "en-US";

  const {
    data: configs,
    refetch: refetchConfig,
    isLoading: isLoadingConfigs,
  } = useConfigs({
    options: {
      onSuccess: (data: any) => {
        pagination.setTotalItems(data.totalRow);
        const mappingFilter = data?.rows
          ?.filter((filter) => filter.parentId == null)
          .map((el: any) => {
            return {
              label: el.name,
              value: el.id,
            };
          });
        setParentList(mappingFilter);
      },
    },
    query: {
      search,
      page: pagination.page,
      limit: pagination.itemsPerPage,
      company_id: companyCode,
      parent,
    },
  });

  const { mutate: deleteConfig } = useDeleteConfig({
    options: {
      onSuccess: () => {
        refetchConfig();
        setModalDelete({ open: false });
      },
    },
  });

  const { data: dataUserPermission } = useUserPermissions({
    options: {
      onSuccess: () => {},
    },
  });

  const listPermission = dataUserPermission?.permission?.filter(
    (filtering: any) => filtering.menu === "Module Config"
  );

  const columns = [
    {
      title: lang[t].moduleConfig.modulConfigName,
      dataIndex: "module_name",
    },
    {
      title: lang[t].moduleConfig.modulConfigParent,
      dataIndex: "parent",
    },
    ...(listPermission?.filter((x :any) => x.viewTypes[0]?.viewType.name === "View").length > 0
    ? [
        {
          title: lang[t].moduleConfig.modulConfigAction,
          dataIndex: "action",
          width: 160,
        },
    ]:[])
  ];

  const data: any = [];
  configs?.rows?.map((config: any) => {
    data.push({
      key: config.id,
      module_name: config.name,
      parent: config.parentName || "-",
      action: (
        <Button
          size="small"
          onClick={() => router.push(`/module-config/${config.id}`)}
          variant="tertiary"
        >
          {lang[t].moduleConfig.tertier.viewDetail}
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

  const onChangeFilterPostalCode = (filter: any) => {
    setParent(filter?.join(","));
  };
  const onHandleClear = () => {
    setParent("");
  };

  const listFilterParent = [
    {
      list: parentList,
    },
  ];
  return (
    <>
      <Col>
        <Text variant={"h4"}>Module Config</Text>
        <Spacer size={20} />
        <Card>
          <Row justifyContent="space-between">
            <Row alignItems="center">
              <Search
                width="380px"
                placeholder={lang[t].moduleConfig.searchBar.moduleConfig}
                onChange={(e: any) => setSearch(e.target.value)}
              />
              <Spacer size={8} />
			{isLoadingConfigs ? (
				<Spin tip={""} />
			) : (
				<DropdownMenuOptionGroupCustom
					handleChangeValue={onChangeFilterPostalCode}
					listItems={listFilterParent}
					handleClearValue={onHandleClear}
					label={false}
					width={194}
					roundedSelector
					showClearButton
					defaultValue="All"
					placeholder={lang[t].moduleConfig.filterBar.parent}
					noSearch
				/>
			)}
            </Row>
            {/* <Row gap="16px">
							<Button
								size="big"
								variant={"tertiary"}
								onClick={() => setModalDelete({ open: true })}
								disabled={rowSelection.selectedRowKeys?.length === 0}
							>
								Delete
							</Button>
							<Button size="big" variant={"primary"} onClick={() => router.push("/module-config/create")}>
								Create
							</Button>
						</Row> */}
          </Row>
        </Card>
        <Spacer size={10} />
        <Card style={{ padding: "16px 20px" }}>
          <Col gap="60px">
            <Table
              loading={isLoadingConfigs}
              columns={columns}
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
            paginateField?.find((config: any) => config?.key === selectedRowKeys[0])?.module_name
          }
          visible={modalDelete.open}
          onCancel={() => setModalDelete({ open: false })}
          onOk={() => deleteConfig({ id: selectedRowKeys })}
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

export default ModuleConfig;
