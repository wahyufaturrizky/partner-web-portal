import React, { useState } from "react";
import { Button, Modal, Pagination, Row, Search, Spacer, Table } from "pink-lava-ui";
import usePagination from "@lucasmogari/react-pagination";
import useDebounce from "lib/useDebounce";
import { useMenuLists } from "hooks/menu-config/useMenuConfig";

const ModalAddMenu = ({
  show,
  onCancel,
  selectedRowKeys,
  onAddMenu,
  selectedRowsMenu,
  type,
}: any) => {
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
    const mapSelectedRows = selectedRows.map((element: any, index: any) => {
      if (element === undefined && selectedRowKeys[index] !== undefined) {
        const filterSelectedRowsMenu =
          selectedRowsMenu.filter((rowMenu: any) => rowMenu.field_id === selectedRowKeys[index]) ??
          [];
        return {
          id: filterSelectedRowsMenu.length > 0 ? filterSelectedRowsMenu[0].id ?? 0 : 0,
          field_id: filterSelectedRowsMenu[0]?.field_id,
          field_name: filterSelectedRowsMenu[0]?.field_name,
          key: filterSelectedRowsMenu[0]?.key,
          field_key: filterSelectedRowsMenu[0]?.field_key,
        };
      } else {
        if (type === "edit") {
          const filterSelectedRowsMenu =
            selectedRowsMenu.filter((rowMenu: any) => rowMenu.field_id === element.field_id) ?? [];
          return {
            id: filterSelectedRowsMenu.length > 0 ? filterSelectedRowsMenu[0].id ?? 0 : 0,
            ...element,
          };
        } else {
          return element;
        }
      }
    });
    setSelectedMenu(mapSelectedRows);
    setSelectedRowKeysMenu(selectedRowKeys);
  };

  const rowSelection = {
    preserveSelectedRowKeys: true,
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
