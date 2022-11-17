import React, { useState } from "react";
import { Button, Modal, Pagination, Row, Search, Spacer, Table } from "pink-lava-ui";
import { useConfigs } from "hooks/config/useConfig";
import usePagination from "@lucasmogari/react-pagination";
import useDebounce from "lib/useDebounce";
import { filterModuleConfig } from "hooks/menu-config/useMenuDesign";

const ModalAddModule = ({
  show,
  onCancel,
  onSuccess,
  selectedRowKeys,
  setSelectedRowKeys,
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
  const useDebounceSearch = useDebounce(search, 1000);

  const {
    data: moduleConfigData,
    isLoading: isLoadingModuleConfig,
    isFetching: isFetchingModuleConfig,
  } = useConfigs({
    query: {
      search: useDebounceSearch,
      page: pagination.page,
      limit: pagination.itemsPerPage,
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
            action: (
              <Row justifyContent={"center"}>
                <Button
                  size="small"
                  onClick={() => {
                    window.open(`/config/${element.id}`, "_blank");
                  }}
                  variant="tertiary"
                >
                  View Detail
                </Button>
              </Row>
            ),
          };
        });

        return { data: mappedData, totalRow: data.totalRow };
      },
    },
  });

  const { mutate: filterModule, isLoading: isLoadingFilterModule }: any = filterModuleConfig({
    options: {
      onSuccess: (data: any) => {
        onSuccess(data?.hierarchies ?? []);
      },
    },
  });

  const columns = [
    {
      title: "Module Name",
      dataIndex: "field_name",
    },
    {
      title: "Action",
      dataIndex: "action",
      width: "20%",
      align: "center",
    },
  ];

  const onSelectChange = (value: any) => {
    setSelectedRowKeys(value);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleFilterModule = () => {
    filterModule({ ids: selectedRowKeys });
  };

  return (
    <Modal
      width={1000}
      visible={show}
      onCancel={onCancel}
      title={"Add Module"}
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
          <Button disabled={false} onClick={handleFilterModule} variant="primary" size="big">
            {isLoadingFilterModule ? "Loading..." : "Add"}
          </Button>
        </div>
      }
      content={
        <>
          <Spacer size={48} />
          <Row alignItems="flex-end" justifyContent="space-between">
            <Search
              width="380px"
              placeholder={`Search Module Name`}
              onChange={(e: any) => setSearch(e.target.value)}
            />
          </Row>
          <Spacer size={10} />
          <Row gap="16px">
            <Button
              size="big"
              variant={"tertiary"}
              onClick={() => window.open(`/module-config/create`, "_blank")}
            >
              Create Module
            </Button>
          </Row>
          <Spacer size={10} />
          <Table
            loading={isLoadingModuleConfig || isFetchingModuleConfig}
            columns={columns}
            data={moduleConfigData?.data}
            rowSelection={rowSelection}
          />
          <Pagination pagination={pagination} />
          <Spacer size={14} />
        </>
      }
    />
  );
};

export default ModalAddModule;
