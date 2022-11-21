import React, { useState } from "react";
import styled from "styled-components";
import { Text, Button, Spin, Col, Row, Spacer, Search, Table, Pagination } from "pink-lava-ui";
import usePagination from "@lucasmogari/react-pagination";
import { ModalDeleteConfirmation } from "../../../components/elements/Modal/ModalConfirmationDelete";
import { useRouter } from "next/router";
import { useCoa, useDeleteCoa } from "../../../hooks/finance-config/useCoaTemplate";
import useDebounce from "lib/useDebounce";
import { queryClient } from "pages/_app";
import { lang } from "lang";

const FinanceConfigCoATemplate: any = () => {
  const router = useRouter();
  const t = localStorage.getItem("lan") || "en-US";
  const companyCode = localStorage.getItem("companyCode")
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
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const debounceSearch = useDebounce(search, 1000);

  const columns = [
    {
      title: lang[t].coaTemplate.list.table.name,
      dataIndex: "field_name",
    },
    {
      title: lang[t].coaTemplate.list.table.action,
      dataIndex: "action",
      width: "15%",
      align: "left",
    },
  ];

  const {
    data: coaData,
    isLoading: isLoadingCoa,
    isFetching: isFetchingCoa,
  } = useCoa({
    query: {
      company_id: companyCode,
      search: debounceSearch,
      page: pagination.page,
      limit: pagination.itemsPerPage,
      company_id : companyCode,
    },
    options: {
      onSuccess: (data: any) => {
        pagination.setTotalItems(data.totalRow);
      },
      select: (data: any) => {
        const mappedData = data?.rows?.map((element: any) => {
          return {
            key: element.id,
            field_name: element.name,
            action: (
              <div style={{ display: "flex", justifyContent: "left" }}>
                <Button
                  size="small"
                  onClick={() => {
                    router.push(`/finance-config/coa-template/${element.id}`);
                  }}
                  variant="tertiary"
                >
                  {lang[t].coaTemplate.list.button.detail}
                </Button>
              </div>
            ),
          };
        });

        return { data: mappedData, totalRow: data.totalRow };
      },
    },
  });

  const { mutate: deleteFields } = useDeleteCoa({
    options: {
      onSuccess: () => {
        setSelectedRowKeys([]);
        setModalDelete({ open: false });
        queryClient.invalidateQueries(["coa-list"]);
      },
    },
  });

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
        <Text variant={"h4"}>{lang[t].coaTemplate.list.headerTitle}</Text>
        <Spacer size={20} />
        <Card>
          <Row justifyContent="space-between">
            <Search
              width="380px"
              placeholder={lang[t].coaTemplate.list.field.searchList}
              onChange={(e: any) => setSearch(e.target.value)}
            />
            <Row gap="16px">
              <Button
                size="big"
                variant="tertiary"
                onClick={() => setModalDelete({ open: true })}
                disabled={rowSelection.selectedRowKeys?.length === 0}
              >
                {lang[t].coaTemplate.list.button.delete}
              </Button>
              <Button
                size="big"
                variant={"primary"}
                onClick={() => {
                  router.push(`/finance-config/coa-template/create`);
                }}
              >
                {lang[t].coaTemplate.list.button.create}
              </Button>
            </Row>
          </Row>
        </Card>
        <Spacer size={10} />
        <Card style={{ padding: "16px 20px" }}>
          <Spacer size={10} />
          <Col gap="60px">
            <Table
              loading={isLoadingCoa || isFetchingCoa}
              columns={columns}
              data={coaData?.data}
              rowSelection={rowSelection}
            />
            <Pagination pagination={pagination} />
          </Col>
        </Card>
      </Col>

      {modalDelete.open && (
        <ModalDeleteConfirmation
          totalSelected={selectedRowKeys?.length}
          itemTitle={
            coaData?.data?.find((element: any) => element.key === selectedRowKeys[0])?.field_name
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

export default FinanceConfigCoATemplate;
