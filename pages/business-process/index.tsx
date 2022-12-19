import React, { useState } from "react";
import styled from "styled-components";
import { Text, Button, Col, Row, Spacer, Search, Table, Pagination, Lozenge } from "pink-lava-ui";
import { useRouter } from "next/router";
import usePagination from "@lucasmogari/react-pagination";

import { ModalDeleteConfirmation } from "../../components/elements/Modal/ModalConfirmationDelete";
import {
  useBusinessProcesses,
  useDeleteBusinessProcess,
} from "../../hooks/business-process/useBusinessProcess";
import { STATUS_BUSINESS_PROCESS } from "../../utils/constant";
import useDebounce from "../../lib/useDebounce";
import { queryClient } from "../_app";
import { lang } from "lang";
import { useUserPermissions } from "hooks/user-config/usePermission";

const BusinessProcess = () => {
  const t = localStorage.getItem("lan") || "en-US";
  const companyCode = localStorage.getItem("companyCode");
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
  const [isShow, setShow] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const debounceSearch = useDebounce(search, 1000);

  const { data: dataUserPermission } = useUserPermissions({
    options: {
      onSuccess: () => {},
    },
  });

  const listPermission = dataUserPermission?.permission?.filter(
    (filtering: any) => filtering.menu === "Business Process"
  );

  const {
    data: businessProcessesData,
    isLoading: isLoadingBP,
    isFetching: isFetchingBP,
  } = useBusinessProcesses({
    query: {
      search: debounceSearch,
      page: pagination.page,
      limit: pagination.itemsPerPage,
      company_id: companyCode,
    },
    options: {
      onSuccess: (data: any) => {
        pagination.setTotalItems(data.totalRow);
      },
      select: (data: any) => {
        const mappedData = data?.rows?.map((element: any) => {
          return {
            key: element.id,
            name: element.name,
            status: element.status,
            action: (
              <div style={{ display: "flex", justifyContent: "left" }}>
                <Button
                  size="small"
                  onClick={() => {
                    router.push(`/business-process/${element.id}`);
                  }}
                  variant="tertiary"
                >
                  {lang[t].businessProcess.tertier.viewDetail}
                </Button>
              </div>
            ),
          };
        });

        return { data: mappedData, totalRow: data.totalRow };
      },
    },
  });

  const { mutate: deleteBusinessProcess, isLoading: isLoadingDeleteBP } = useDeleteBusinessProcess({
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries(["bprocesses"]);
        setShow(false);
        setSelectedRowKeys([]);
      },
    },
  });

  const columns = [
    {
      title: lang[t].businessProcess.businessProcessName,
      dataIndex: "name",
    },
    {
      title: lang[t].businessProcess.businessProcessStatus,
      dataIndex: "status",
      width: "30%",
      render: (status: any) => (
        <Lozenge variant={STATUS_BUSINESS_PROCESS[status].COLOR}>
          {STATUS_BUSINESS_PROCESS[status].TEXT}
        </Lozenge>
      ),
    },
    ...(listPermission?.some((el: any) => el.viewTypes[0]?.viewType.name === "View")
      ? [
          {
            title: lang[t].businessProcess.businessProcessAction,
            dataIndex: "action",
            align: "left",
          },
        ]
      : []),
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: any) => setSelectedRowKeys(selectedRowKeys),
  };

  return (
    <>
      <Col>
        <Text variant={"h4"}>{lang[t].businessProcess.pageTitle.businessProcess}</Text>
        <Spacer size={20} />
        <Card>
          <Row justifyContent="space-between">
            <Search
              width="380px"
              placeholder={lang[t].businessProcess.searchBar.businessProcess}
              onChange={(e: any) => {
                setSearch(e.target.value);
              }}
            />
            <Row gap="16px">
              {listPermission?.filter((data: any) => data.viewTypes[0]?.viewType.name === "Delete")
							.length > 0 && (
                <Button
                  size="big"
                  variant={"tertiary"}
                  onClick={() => setShow(true)}
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
                  onClick={() => router.push("/business-process/create")}
                >
                  {lang[t].businessProcess.primary.create}
                </Button>
              )}
            </Row>
          </Row>
        </Card>
        <Spacer size={10} />
        <Card style={{ padding: "16px 20px" }}>
          <Col gap={"60px"}>
            <Table
              loading={isLoadingBP || isFetchingBP}
              columns={columns}
              data={businessProcessesData?.data}
              rowSelection={rowSelection}
            />
            <Pagination pagination={pagination} />
          </Col>
        </Card>
      </Col>

      {isShow && (
        <ModalDeleteConfirmation
          totalSelected={selectedRowKeys.length}
          itemTitle={
            businessProcessesData?.data.find((data: any) => data.key === selectedRowKeys[0])?.name
          }
          visible={isShow}
          onCancel={() => setShow(false)}
          isLoading={isLoadingDeleteBP}
          onOk={() => deleteBusinessProcess({ ids: selectedRowKeys })}
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

export default BusinessProcess;
