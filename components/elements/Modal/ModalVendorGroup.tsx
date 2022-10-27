import React, { useState } from "react";
import {
  Button,
  Col,
  Pagination,
  Row,
  Search,
  Spacer,
  Table,
  Modal,
  Input,
  Text,
} from "pink-lava-ui";
import {
  useVendorGroups,
  useDeleteVendorGroup,
  useCreateVendorGroup,
  useUpdateVendorGroup,
} from "hooks/mdm/vendor/useVendorGroup";
import useDebounce from "lib/useDebounce";
import usePagination from "@lucasmogari/react-pagination";
import { ModalDeleteConfirmation } from "./ModalConfirmationDelete";
import { queryClient } from "pages/_app";
import { useForm } from "react-hook-form";

const ModalVendorGroup = ({ show, onCancel }: any) => {
  const pagination = usePagination({
    page: 1,
    itemsPerPage: 10,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
  });

  const [search, setSearch] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [modalForm, setModalForm] = useState({
    open: false,
    data: {},
    typeForm: "create",
  });
  const debounceSearch = useDebounce(search, 1000);

  const { register, handleSubmit } = useForm();

  const {
    data: vendorGroupData,
    isLoading: isLoadingVendorGroup,
    isFetching: isFetchingVendorGroup,
  } = useVendorGroups({
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
            id: element.id,
            vendorGroup: element.name,
            action: (
              <div style={{ display: "flex", justifyContent: "left" }}>
                <Button
                  size="small"
                  onClick={() => {
                    setModalForm({ open: true, typeForm: "edit", data: element });
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

  const { mutate: createVendorGroup, isLoading: isLoadingCreateVendorGroup } = useCreateVendorGroup(
    {
      options: {
        onSuccess: () => {
          setModalForm({ open: false, typeForm: "", data: {} });
          queryClient.invalidateQueries(["vendor-groups"]);
        },
      },
    }
  );

  const { mutate: updateVendorGroup, isLoading: isLoadingUpdateVendorGroup } = useUpdateVendorGroup(
    {
      id: modalForm?.data?.id,
      options: {
        onSuccess: () => {
          setModalForm({ open: false, typeForm: "", data: {} });
          queryClient.invalidateQueries(["vendor-groups"]);
        },
      },
    }
  );

  const { mutate: deleteVendorGroup, isLoading: isLoadingDeleteVendorGroup }: any =
    useDeleteVendorGroup({
      options: {
        onSuccess: () => {
          setShowDelete(false);
          setSelectedRowKeys([]);
          queryClient.invalidateQueries(["vendor-groups"]);
        },
      },
    });

  const columns = [
    {
      title: "Vendor Group",
      dataIndex: "vendorGroup",
    },
    {
      title: "Action",
      dataIndex: "action",
      width: "20%",
      align: "left",
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: any) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  const onSubmit = (data: any) => {
    switch (modalForm.typeForm) {
      case "create":
        createVendorGroup(data);
        break;
      case "edit":
        updateVendorGroup(data);
        break;
      default:
        setModalForm({ open: false, typeForm: "", data: {} });
        break;
    }
  };

  return (
    <>
      <Modal
        centered
        width={"800px"}
        visible={show}
        onCancel={onCancel}
        title={"Manage Vendor Group"}
        footer={null}
        content={
          <Col style={{ marginTop: "16px" }}>
            <Row noWrap>
              <Search
                placeholder="Search Name"
                onChange={(e: any) => {
                  setSearch(e.target.value);
                }}
              />

              <Spacer size={10} />

              <Button
                size="big"
                variant={"tertiary"}
                onClick={() => setShowDelete(true)}
                disabled={rowSelection.selectedRowKeys?.length === 0}
              >
                Delete
              </Button>

              <Spacer size={5} />
              <Button
                size="big"
                variant="primary"
                onClick={() => setModalForm({ open: true, typeForm: "create", data: {} })}
              >
                Create
              </Button>
            </Row>

            <Spacer size={20} />

            <Table
              loading={isLoadingVendorGroup || isFetchingVendorGroup}
              columns={columns}
              data={vendorGroupData?.data}
              rowSelection={rowSelection}
            />
            <Pagination pagination={pagination} />

            <Spacer size={10} />
          </Col>
        }
      />

      {modalForm.open && (
        <Modal
          centered
          visible={modalForm.open}
          onCancel={() => setModalForm({ open: false, data: {}, typeForm: "" })}
          title={modalForm.typeForm === "create" ? "Create Vendor Group" : "View Vendor Group"}
          footer={null}
          content={
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                marginTop: "12px",
              }}
            >
              <Text variant="headingRegular">
                Group Name<span style={{ color: "#EB008B" }}>*</span>
              </Text>
              <Input
                defaultValue={modalForm.data?.name}
                width="100%"
                label=""
                height="48px"
                placeholder={"Type here..."}
                {...register("name", {
                  shouldUnregister: true,
                })}
              />

              <Spacer size={30} />

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                  marginBottom: "20px",
                }}
              >
                <Button
                  size="big"
                  variant={"tertiary"}
                  key="submit"
                  type="primary"
                  onClick={() => setModalForm({ open: false, data: {}, typeForm: "" })}
                >
                  Cancel
                </Button>

                <Button onClick={handleSubmit(onSubmit)} variant="primary" size="big">
                  {isLoadingCreateVendorGroup || isLoadingUpdateVendorGroup ? "Loading..." : "Save"}
                </Button>
              </div>
            </div>
          }
        />
      )}

      {showDelete && (
        <ModalDeleteConfirmation
          totalSelected={selectedRowKeys.length}
          visible={showDelete}
          itemTitle={
            vendorGroupData?.data?.find((item: any) => item.key === selectedRowKeys[0])?.vendorGroup
          }
          isLoading={isLoadingDeleteVendorGroup}
          onCancel={() => setShowDelete(false)}
          onOk={() => deleteVendorGroup({ ids: selectedRowKeys })}
        />
      )}
    </>
  );
};

export default ModalVendorGroup;
