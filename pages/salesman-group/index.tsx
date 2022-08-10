import React, { useState } from "react";
import styled from "styled-components";
import {
  Text,
  Button,
  Col,
  Row,
  Spacer,
  Search,
  Table,
  Pagination,
  Modal,
  Input,
  DropdownMenu,
  FileUploadModal,
  FormSelect,
} from "pink-lava-ui";
import usePagination from "@lucasmogari/react-pagination";
import {
  useSalesmanGroups,
  useCreateSalesmanGroup,
  useUpdateSalesmanGroup,
  useUploadFileSalesmanGroup,
  useDeleteSalesmanGroup,
} from "../../hooks/mdm/salesman-group/useSalesmanGroup";
import useDebounce from "../../lib/useDebounce";
import { queryClient } from "../_app";
import { useForm, Controller } from "react-hook-form";
import { ICDownload, ICUpload } from "../../assets/icons";
import { mdmDownloadService } from "../../lib/client";

const downloadFile = (params: any) =>
  mdmDownloadService("/salesman-group/download", { params }).then((res) => {
    let dataUrl = window.URL.createObjectURL(new Blob([res.data]));
    let tempLink = document.createElement("a");
    tempLink.href = dataUrl;
    tempLink.setAttribute("download", `salesman_group_${new Date().getTime()}.xlsx`);
    tempLink.click();
  });

const renderConfirmationText = (type: any, data: any) => {
  switch (type) {
    case "selection":
      return data.selectedRowKeys.length > 1
        ? `Are you sure to delete ${data.selectedRowKeys.length} items ?`
        : `Are you sure to delete ${
            data?.salesmanGroupData?.data.find((el: any) => el.key === data.selectedRowKeys[0])
              ?.name
          } ?`;
    case "detail":
      return `Are you sure to delete ${data.name} ?`;

    default:
      break;
  }
};

const SalesmanGroup = () => {
  const pagination = usePagination({
    page: 1,
    itemsPerPage: 10,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
  });

  const [search, setSearch] = useState("");
  const [isShowDelete, setShowDelete] = useState({ open: false, type: "selection", data: {} });
  const [isShowUpload, setShowUpload] = useState(false);
  const [modalForm, setModalForm] = useState({
    open: false,
    data: {},
    typeForm: "create",
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const debounceSearch = useDebounce(search, 1000);

  const { register, handleSubmit, control } = useForm();

  const {
    data: salesmanGroupsData,
    isLoading: isLoadingSalesmanGroup,
    isFetching: isFetchingSalesmanGroup,
  } = useSalesmanGroups({
    query: {
      search: debounceSearch,
      page: pagination.page,
      limit: pagination.itemsPerPage,
      company_id: "KSNI",
    },
    options: {
      onSuccess: (data: any) => {
        pagination.setTotalItems(data.totalRow);
      },
      initialData: () => [],
      select: (data: any) => {
        const mappedData = data?.rows?.map((element: any) => {
          return {
            key: element.salesmanGroupId,
            id: element.salesmanGroupId,
            name: element.name,
            parent: element.name,
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

  const { mutate: createSalesmanGroup, isLoading: isLoadingCreateSalesmanGroup } =
    useCreateSalesmanGroup({
      options: {
        onSuccess: () => {
          setModalForm({ open: false, typeForm: "", data: {} });
          queryClient.invalidateQueries(["salesman-groups"]);
        },
      },
    });

  const { mutate: updateSalemanGroup, isLoading: isLoadingUpdateSalesmanGroup } =
    useUpdateSalesmanGroup({
      id: modalForm?.data?.salesmanGroupId,
      companyId: "KSNI",
      options: {
        onSuccess: () => {
          setModalForm({ open: false, typeForm: "", data: {} });
          queryClient.invalidateQueries(["salesman-groups"]);
        },
      },
    });

  const { mutate: deleteSalesmanGroup, isLoading: isLoadingDeleteSalesmanGroup } =
    useDeleteSalesmanGroup({
      options: {
        onSuccess: () => {
          setShowDelete({ open: false, data: {}, type: "" });
          setModalForm({ open: false, data: {}, typeForm: "" });
          setSelectedRowKeys([]);
          queryClient.invalidateQueries(["salesman-groups"]);
        },
      },
    });

  const { mutate: uploadFileSalesmanGroup, isLoading: isLoadingUploadFileSalesmanGroup } =
    useUploadFileSalesmanGroup({
      options: {
        onSuccess: () => {
          queryClient.invalidateQueries(["salesman-groups"]);
          setShowUpload(false);
        },
      },
    });

  const columns = [
    {
      title: "Salesman Group ID",
      dataIndex: "id",
    },
    {
      title: "Salesman Group Name",
      dataIndex: "name",
    },
    {
      title: "Parent",
      dataIndex: "parent",
    },
    {
      title: "Action",
      dataIndex: "action",
      width: "15%",
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
        const formData = {
          company_id: "KSNI",
          ...data,
        };
        createSalesmanGroup(formData);
        break;
      case "edit":
        updateSalemanGroup(data);
        break;
      default:
        setModalForm({ open: false, typeForm: "", data: {} });
        break;
    }
  };

  const onSubmitFile = (file: any) => {
    const formData = new FormData();
    formData.append("company_id", "KSNI");
    formData.append("file", file);

    uploadFileSalesmanGroup(formData);
  };

  return (
    <>
      <Col>
        <Text variant={"h4"}>Salesman Group</Text>
        <Spacer size={20} />
      </Col>
      <Card>
        <Row justifyContent="space-between">
          <Search
            width="340px"
            placeholder="Search Salesman Group ID, Name."
            onChange={(e: any) => {
              setSearch(e.target.value);
            }}
          />
          <Row gap="16px">
            <Button
              size="big"
              variant={"tertiary"}
              onClick={() =>
                setShowDelete({
                  open: true,
                  type: "selection",
                  data: { salesmanGroupData: salesmanGroupsData, selectedRowKeys },
                })
              }
              disabled={rowSelection.selectedRowKeys?.length === 0}
            >
              Delete
            </Button>
            <DropdownMenu
              title={"More"}
              buttonVariant={"secondary"}
              buttonSize={"big"}
              textVariant={"button"}
              textColor={"pink.regular"}
              iconStyle={{ fontSize: "12px" }}
              onClick={(e: any) => {
                switch (parseInt(e.key)) {
                  case 1:
                    downloadFile({ with_data: "N", company_id: "KSNI" });
                    break;
                  case 2:
                    setShowUpload(true);
                    break;
                  case 3:
                    downloadFile({ with_data: "Y", company_id: "KSNI" });
                    break;
                  case 4:
                    break;
                  default:
                    break;
                }
              }}
              menuList={[
                {
                  key: 1,
                  value: (
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <ICDownload />
                      <p style={{ margin: "0" }}>Download Template</p>
                    </div>
                  ),
                },
                {
                  key: 2,
                  value: (
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <ICUpload />
                      <p style={{ margin: "0" }}>Upload Template</p>
                    </div>
                  ),
                },
                {
                  key: 3,
                  value: (
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <ICDownload />
                      <p style={{ margin: "0" }}>Download Data</p>
                    </div>
                  ),
                },
              ]}
            />
            <Button
              size="big"
              variant="primary"
              onClick={() => setModalForm({ open: true, typeForm: "create", data: {} })}
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
            loading={isLoadingSalesmanGroup || isFetchingSalesmanGroup}
            columns={columns}
            data={salesmanGroupsData?.data}
            rowSelection={rowSelection}
          />
          <Pagination pagination={pagination} />
        </Col>
      </Card>

      {modalForm.open && (
        <Modal
          width={"350px"}
          centered
          closable={false}
          visible={modalForm.open}
          onCancel={() => setModalForm({ open: false, data: {}, typeForm: "" })}
          title={modalForm.typeForm === "create" ? "Create Salesman Group" : modalForm.data?.name}
          footer={null}
          content={
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Input
                defaultValue={modalForm.data?.name}
                width="100%"
                label="Salesman Group Name"
                height="40px"
                placeholder={"e.g Motoris"}
                {...register("name", {
                  shouldUnregister: true,
                })}
              />

              <Spacer size={10} />

              <Controller
                control={control}
                name="parent"
                defaultValue={modalForm.data?.parent}
                render={({ field: { onChange } }) => (
                  <>
                    <Label>Parent</Label>
                    <Spacer size={3} />
                    <FormSelect
                      defaultValue={modalForm.data?.parent}
                      style={{ width: "100%" }}
                      size={"large"}
                      placeholder={"Select"}
                      borderColor={"#AAAAAA"}
                      arrowColor={"#000"}
                      withSearch={[].length !== 0}
                      isLoading={false}
                      isLoadingMore={false}
                      fetchMore={() => {
                        if (false) {
                          // fetchNextPage();
                        }
                      }}
                      // items={
                      //   isFetchingUomCategory && !isFetchingMoreUomCategory ? [] : listUomCategory
                      // }
                      items={[]}
                      onChange={(value: any) => {
                        onChange(value);
                      }}
                      onSearch={(value: any) => {
                        setSearch(value);
                      }}
                    />
                  </>
                )}
              />

              <Spacer size={15} />

              <Input
                defaultValue={modalForm.data?.externalCode}
                width="100%"
                label="External Code"
                height="40px"
                placeholder={""}
                {...register("external_code", {
                  shouldUnregister: true,
                })}
              />

              <Spacer size={14} />
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
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
                  {isLoadingCreateSalesmanGroup || isLoadingUpdateSalesmanGroup
                    ? "Loading..."
                    : "Save"}
                </Button>
              </div>
            </div>
          }
        />
      )}

      {isShowDelete.open && (
        <Modal
          closable={false}
          centered
          visible={isShowDelete.open}
          onCancel={() => setShowDelete({ open: false, type: "", data: {} })}
          title={"Confirm Delete"}
          footer={null}
          content={
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Spacer size={4} />
              {renderConfirmationText(isShowDelete.type, isShowDelete.data)}
              <Spacer size={20} />
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                  marginBottom: "20px",
                }}
              >
                <Button
                  size="big"
                  variant="tertiary"
                  key="submit"
                  type="primary"
                  onClick={() => setShowDelete({ open: false, type: "", data: {} })}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="big"
                  onClick={() => {
                    if (isShowDelete.type === "selection") {
                      deleteSalesmanGroup({ ids: selectedRowKeys, company_id: "KSNI" });
                    } else {
                      deleteSalesmanGroup({
                        ids: [modalForm.data.trainingTypeId],
                        company_id: "KSNI",
                      });
                    }
                  }}
                >
                  {isLoadingDeleteSalesmanGroup ? "loading..." : "Yes"}
                </Button>
              </div>
            </div>
          }
        />
      )}

      {isShowUpload && (
        <FileUploadModal
          visible={isShowUpload}
          setVisible={setShowUpload}
          onSubmit={onSubmitFile}
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

const Label = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  color: #000000;
`;

export default SalesmanGroup;
