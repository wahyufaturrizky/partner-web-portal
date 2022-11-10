import React, { useState } from "react";
import styled from "styled-components";
import { Text, Button, Col, Row, Spacer, Search, Table, Pagination } from "pink-lava-ui";
import usePagination from "@lucasmogari/react-pagination";

import { ModalCreateAccountGroup } from "../../../components/elements/Modal/ModalCreateAccountGroup";
import { ModalDetailAccountGroup } from "../../../components/elements/Modal/ModalDetailAccountGroup";
import { ModalDeleteConfirmation } from "../../../components/elements/Modal/ModalConfirmationDelete";
import {
  useAccountGroups,
  useCreateAccountGroup,
  useDeleteAccountGroup,
  useUpdateAccountGroup,
} from "../../../hooks/finance-config/useAccountGroup";
import useDebounce from "lib/useDebounce";
import { lang } from "lang";

const FinanceConfigAccountGroud: any = () => {
  const pagination = usePagination({
    page: 1,
    itemsPerPage: 20,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
  });

  const [search, setSearch] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [modalDetail, setModalDetail] = useState({ open: false, data: {}, id: 0 });
  const [modalCreate, setModalCreate] = useState({ open: false });
  const [modalDelete, setModalDelete] = useState({ open: false });
  const useDebounceSearchAccountGroup = useDebounce(search, 1000);
  const t = localStorage.getItem("lan") || "en-US";

  const columns = [
    {
      title: lang[t].accountGroup.checkBoxAccountGroupID,
      dataIndex: "account_group_id",
    },
    {
      title: lang[t].accountGroup.accountGroupName,
      dataIndex: "account_group_name",
    },
    {
      title: lang[t].accountGroup.accountGroupParent,
      dataIndex: "parent",
    },
    {
      title: lang[t].accountGroup.accountGroupAction,
      dataIndex: "action",
      width: 160,
    },
  ];

  const onSelectChange = (selectedRowKeys: any) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const {
    data: accountGroup,
    refetch: refetchAccountGroup,
    isLoading: isLoadingAccountGroup,
    isFetching: isFetchingAccountGroup,
  } = useAccountGroups({
    query: {
      search: useDebounceSearchAccountGroup,
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
            account_group_id: element.code,
            account_group_name: element.groupName,
            parent: element?.parents?.completeName ?? "-",
            action: (
              <Button
                size="small"
                onClick={() => setModalDetail({ open: true, data: element, id: element.id })}
                variant="tertiary"
              >
                {lang[t].accountGroup.tertier.viewDetail}
              </Button>
            ),
          };
        });

        return { data: mappedData, totalRow: data.totalRow };
      },
    },
  });

  const { mutate: createAccountGroup } = useCreateAccountGroup({
    options: {
      onSuccess: (data) => {
        if (data) {
          refetchAccountGroup();
          setModalCreate({ open: false });
        }
      },
      onError: (error: any) => {
        if (error?.data) {
          window.alert(error.data.errors && error.data.errors[0].message);
        } else {
          window.alert(error.data.message);
        }
      },
    },
  });

  const { mutate: deleteAccountGroup } = useDeleteAccountGroup({
    options: {
      onSuccess: () => {
        refetchAccountGroup();
        setModalDelete({ open: false });
        setSelectedRowKeys([]);
      },
      onError: (error: any) => {
        alert(error?.message);
      },
    },
  });

  const { mutate: updateAccountGroup } = useUpdateAccountGroup({
    accountGroupId: modalDetail?.data?.id ?? null,
    options: {
      onSuccess: () => {
        refetchAccountGroup();
        setModalDetail({ open: false });
      },
    },
  });

  return (
    <>
      <Col>
        <Text variant={"h4"}>{lang[t].accountGroup.pageTitle.accountGroup}</Text>
        <Spacer size={20} />
        <Card>
          <Row justifyContent="space-between">
            <Row alignItems="center">
              <Search
                width="380px"
                placeholder={lang[t].accountGroup.search}
                onChange={(e: any) => setSearch(e.target.value)}
              />
              <Spacer size={16} />
            </Row>
            <Row gap="16px">
              <Button
                size="big"
                variant={"tertiary"}
                onClick={() => setModalDelete({ open: true })}
                disabled={rowSelection.selectedRowKeys?.length === 0}
              >
                {lang[t].accountGroup.tertier.delete}
              </Button>
              <Button size="big" variant={"primary"} onClick={() => setModalCreate({ open: true })}>
                {lang[t].accountGroup.primary.create}
              </Button>
            </Row>
          </Row>
        </Card>
        <Spacer size={10} />
        <Card style={{ padding: "16px 20px" }}>
          <Col gap="60px">
            <Table
              loading={isLoadingAccountGroup || isFetchingAccountGroup}
              columns={columns}
              data={accountGroup?.data}
              rowSelection={rowSelection}
            />
            <Pagination pagination={pagination} />
          </Col>
        </Card>
      </Col>

      {modalDetail.open && (
        <ModalDetailAccountGroup
          visible={modalDetail.open}
          defaultValue={modalDetail?.data}
          onCancel={() => setModalDetail({ open: false, data: {}, id: 0 })}
          onOk={(data: any) => updateAccountGroup(data)}
          id={modalDetail?.id}
        />
      )}

      {modalCreate.open && (
        <ModalCreateAccountGroup
          visible={modalCreate.open}
          onCancel={() => setModalCreate({ open: false })}
          onOk={(data: any) => createAccountGroup(data)}
        />
      )}

      {modalDelete.open && (
        <ModalDeleteConfirmation
          totalSelected={selectedRowKeys.length}
          itemTitle={
            accountGroup?.data?.find((field: any) => field.account_group_id === selectedRowKeys[0])
              ?.account_group_name
          }
          visible={modalDelete.open}
          onCancel={() => setModalDelete({ open: false })}
          onOk={() => deleteAccountGroup({ ids: selectedRowKeys })}
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

export default FinanceConfigAccountGroud;
