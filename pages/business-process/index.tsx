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

const BusinessProcess = () => {
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

  const {
    data: businessProcessesData,
    isLoading: isLoadingBP,
    isFetching: isFetchingBP,
  } = useBusinessProcesses({
    query: {
      search: debounceSearch,
      page: pagination.page,
      limit: pagination.itemsPerPage,
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
                  View Detail
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
      title: "Business Process Name",
      dataIndex: "name",
    },
    {
      title: "Status",
      dataIndex: "status",
      width: "30%",
      render: (status: any) => (
        <Lozenge variant={STATUS_BUSINESS_PROCESS[status].COLOR}>
          {STATUS_BUSINESS_PROCESS[status].TEXT}
        </Lozenge>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      align: "left",
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: any) => setSelectedRowKeys(selectedRowKeys),
  };

  return (
    <>
      <Col>
        <Text variant={"h4"}>Business Process List</Text>
        <Spacer size={20} />
        <Card>
          <Row justifyContent="space-between">
            <Search
              width="380px"
              placeholder="Search Business Process Name, Status"
              onChange={(e: any) => {
                setSearch(e.target.value);
              }}
            />
            <Row gap="16px">
              <Button
                size="big"
                variant={"tertiary"}
                onClick={() => setShow(true)}
                disabled={rowSelection.selectedRowKeys?.length === 0}
              >
                Delete
              </Button>
              <Button
                size="big"
                variant="primary"
                onClick={() => router.push("/business-process/create")}
              >
                Create
              </Button>
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
