import React, { useState } from "react";
import { Button, Modal, Pagination, Row, Search, Spacer, Table } from "pink-lava-ui";
import usePagination from "@lucasmogari/react-pagination";
import useDebounce from "lib/useDebounce";
import { useMenuLists } from "hooks/menu-config/useMenuConfig";

const ModalAddMenu = ({ show, onCancel, selectedRowKeys, onAddMenu }: any) => {
  const pagination = usePagination({
    page: 1,
    itemsPerPage: 20,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
  });

  const [search, setSearch] = useState("");
  const [selectedMenu, setSelectedMenu] = useState([]);

  const [selectedRowKeysMenu, setSelectedRowKeysMenu] = useState(selectedRowKeys);

  const useDebounceSearch = useDebounce(search, 1000);

  const {
    data: menuListData,
    isLoading: isLoadingMenuLists,
    isFetching: isFetchingMenuList,
  } = useMenuLists({
    query: {
      search: useDebounceSearch,
      page: pagination.page,
      limit: pagination.itemsPerPage,
      selected: selectedRowKeys.join(","),
    },
    options: {
      refetchOnWindowFocus: "always",
      onSuccess: (data: any) => {
        pagination.setTotalItems(data.totalRow);
      },
      select: (data: any) => {
        const mappedData = data?.rows?.map((element: any) => {
          return {
            key: element.id,
            field_id: element.id,
            field_name: element.name,
            field_key: element.key,
          };
        });

        return { data: mappedData, totalRow: data.totalRow };
      },
    },
  });

  const columnsMenuLists = [
    {
      title: "Menu Name",
      dataIndex: "field_name",
    },
  ];

  const onSelectChange = (selectedRowKeys: any, selectedRows: any) => {
    setSelectedMenu(selectedRows);
    setSelectedRowKeysMenu(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys: selectedRowKeysMenu,
    onChange: onSelectChange,
  };

  return (
    <Modal
      width={1000}
      visible={show}
      onCancel={onCancel}
      title={"Add Menu"}
      footer={
        <div
          style={{
            display: "flex",
            marginBottom: "12px",
            marginRight: "12px",
            justifyContent: "flex-end",
            gap: "12px",
          }}
        >
          <Button onClick={onCancel} variant="tertiary" size="big">
            Cancel
          </Button>
          <Button
            disabled={false}
            onClick={() => {
              onAddMenu(selectedMenu);
            }}
            variant="primary"
            size="big"
          >
            Add
          </Button>
        </div>
      }
      content={
        <>
          <Spacer size={48} />
          <Row alignItems="flex-end" justifyContent="space-between">
            <Search
              width="380px"
              placeholder={`Search Menu Name`}
              onChange={(e: any) => setSearch(e.target.value)}
            />
          </Row>
          <Spacer size={10} />
          <Row gap="16px">
            <Button
              size="big"
              variant={"tertiary"}
              onClick={() => window.open(`/menu-list/create`, "_blank")}
            >
              Add Menu
            </Button>
          </Row>
          <Spacer size={10} />
          <Table
            loading={isLoadingMenuLists || isFetchingMenuList}
            columns={columnsMenuLists}
            data={menuListData?.data}
            rowSelection={rowSelection}
          />
          <Pagination pagination={pagination} />
          <Spacer size={14} />
        </>
      }
    />
  );
};

export default ModalAddMenu;
