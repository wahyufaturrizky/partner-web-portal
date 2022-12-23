import React, { useState } from "react";
import { Button, Modal, Pagination, Row, Search, Spacer, Table } from "pink-lava-ui";
import usePagination from "@lucasmogari/react-pagination";
import useDebounce from "lib/useDebounce";
import { useVendors } from "hooks/mdm/vendor/useVendor";

const ModalVendorList = ({ show, onCancel, selectedRowKeys, onAddMenu }: any) => {
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

  const debounceSearch = useDebounce(search, 1000);

  const {
    data: vendorData,
    isLoading: isLoadingVendor,
    isFetching: isFetchingVendor,
  } = useVendors({
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
            id: element.code,
            name: element.name,
            type: element.type,
            group: element.groupName,
            validUntil: "-",
          };
        });

        return { data: mappedData, totalRow: data.totalRow };
      },
    },
  });

  const columns = [
    {
      title: "Vendor ID",
      dataIndex: "id",
    },
    {
      title: "Vendor Name",
      dataIndex: "name",
    },
    {
      title: "Vendor Type",
      dataIndex: "type",
    },
    {
      title: "Vendor Group",
      dataIndex: "group",
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
      title={"Vendor List"}
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
              onAddMenu(selectedMenu, selectedRowKeysMenu);
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
          <Table
            loading={isLoadingVendor || isFetchingVendor}
            columns={columns}
            data={vendorData?.data}
            rowSelection={rowSelection}
          />
          <Pagination pagination={pagination} />
          <Spacer size={14} />
        </>
      }
    />
  );
};

export default ModalVendorList;
