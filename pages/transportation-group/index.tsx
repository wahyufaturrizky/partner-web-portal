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
  FormInput,
} from "pink-lava-ui";
import usePagination from "@lucasmogari/react-pagination";
import {
  useTransportations,
  useCreateTransportation,
  useUpdateTransportation,
  useUploadFileTransportation,
  useDeleteTransportation,
} from "../../hooks/mdm/transportation-group/useTransportationGroup";
import useDebounce from "../../lib/useDebounce";
import { queryClient } from "../_app";
import { useForm } from "react-hook-form";
import { ICDownload, ICUpload } from "../../assets/icons";
import { mdmDownloadService } from "../../lib/client";

const downloadFile = (params: any) =>
  mdmDownloadService("/transportation-group/download", { params }).then((res) => {
    let dataUrl = window.URL.createObjectURL(new Blob([res.data]));
    let tempLink = document.createElement("a");
    tempLink.href = dataUrl;
    tempLink.setAttribute("download", `transportation_group_${new Date().getTime()}.xlsx`);
    tempLink.click();
  });

const renderConfirmationText = (type: any, data: any) => {
  switch (type) {
    case "selection":
      return data.selectedRowKeys.length > 1
        ? `Are you sure to delete ${data.selectedRowKeys.length} items ?`
        : `Are you sure to delete Transportation Name - ${
            data?.transportationData?.data.find((el: any) => el.key === data.selectedRowKeys[0])
              ?.transportationName
          } ?`;
    case "detail":
      return `Are you sure to delete Transportation Name - ${data.transportationName} ?`;

    default:
      break;
  }
};

const TransportationGroup = () => {
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

  const { register, handleSubmit } = useForm();

  const {
    data: transportationsData,
    isLoading: isLoadingTransportations,
    isFetching: isFetchingTransportations,
  } = useTransportations({
    query: {
      search: debounceSearch,
      page: pagination.page,
      limit: pagination.itemsPerPage,
      company_id: "KSNI",
    },
    options: {
      initialData: [],
      onSuccess: (data: any) => {
        pagination.setTotalItems(data.totalRow);
      },
      select: (data: any) => {
        const mappedData = data?.rows?.map((element: any) => {
          return {
            key: element.transportationId,
            id: element.transportationId,
            transportationType: element.type,
            transportationVolume: element.volume,
            transportationWeight: element.weight,
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

  const { mutate: createTransportation, isLoading: isLoadingCreateTransportation } =
    useCreateTransportation({
      options: {
        onSuccess: () => {
          setModalForm({ open: false, typeForm: "", data: {} });
          queryClient.invalidateQueries(["transportations"]);
        },
      },
    });

  const { mutate: updateTransportation, isLoading: isLoadingTransportation } =
    useUpdateTransportation({
      id: modalForm?.data?.transportationId,
      companyId: "KSNI",
      options: {
        onSuccess: () => {
          setModalForm({ open: false, typeForm: "", data: {} });
          queryClient.invalidateQueries(["transportations"]);
        },
      },
    });

  const { mutate: deleteTransportation, isLoading: isLoadingDeleteUomCategory } =
    useDeleteTransportation({
      options: {
        onSuccess: () => {
          setShowDelete({ open: false, data: {}, type: "" });
          setModalForm({ open: false, data: {}, typeForm: "" });
          setSelectedRowKeys([]);
          queryClient.invalidateQueries(["transportations"]);
        },
      },
    });

  const { mutate: uploadFileTransportation, isLoading: isLoadingUploadFileTransportation } =
    useUploadFileTransportation({
      options: {
        onSuccess: () => {
          queryClient.invalidateQueries(["transportations"]);
          setShowUpload(false);
        },
      },
    });

  const columns = [
    {
      title: "Transportation Group ID",
      dataIndex: "id",
    },
    {
      title: "Transportation Group",
      dataIndex: "transportationGroup",
    },
    {
      title: "Transportation Type",
      dataIndex: "transportationType",
    },
    {
      title: "Volume",
      dataIndex: "transportationVolume",
    },
    {
      title: "Weight",
      dataIndex: "transportationWeight",
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
        createTransportation(formData);
        break;
      case "edit":
        updateTransportation(data);
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

    uploadFileTransportation(formData);
  };

  return (
    <>
      <Col>
        <Text variant={"h4"}>Transportation Group</Text>
        <Spacer size={20} />
      </Col>
      <Card>
        <Row justifyContent="space-between">
          <Search
            width="340px"
            placeholder="Search Transportation Group, Name."
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
                  data: { transportationsData, selectedRowKeys },
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
            loading={isLoadingTransportations || isFetchingTransportations}
            columns={columns}
            data={transportationsData?.data}
            rowSelection={rowSelection}
          />
          <Pagination pagination={pagination} />
        </Col>
      </Card>

      {modalForm.open && (
        <Modal
          width={"700px"}
          centered
          visible={modalForm.open}
          onCancel={() => setModalForm({ open: false, data: {}, typeForm: "" })}
          title={
            modalForm.typeForm === "create"
              ? "Create New Transportation Group"
              : "Transportation Group"
          }
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
              <Row width="100%" noWrap gap="10px">
                <Col width={"100%"}>
                  <Text variant="headingRegular">
                    Transportation Group<span style={{ color: "#EB008B" }}>*</span>
                  </Text>
                  <FormSelect
                    style={{ width: "100%" }}
                    size={"large"}
                    showArrow
                    items={[
                      { label: "Land Freight", value: "Land Freight" },
                      { label: "Air Freight", value: "Air Freight" },
                      { label: "Sea Freight", value: "Sea Freight" },
                    ]}
                    placeholder={"Select"}
                    onChange={(value: any) => {}}
                  />
                </Col>
                <Col width={"100%"}>
                  <Text variant="headingRegular">
                    Transportation Type<span style={{ color: "#EB008B" }}>*</span>
                  </Text>
                  <FormInput size={"large"} placeholder={"e.g Tronton Box"} />
                </Col>
              </Row>

              <Spacer size={15} />

              <Row width="100%" noWrap gap="10px">
                <Col width={"100%"}>
                  <Text variant="headingRegular">Volume</Text>
                  <FormInput size={"large"} placeholder={"e.g 55"} addonAfter="m3" />
                </Col>
                <Col width={"100%"}>
                  <Text variant="headingRegular">Weight</Text>
                  <FormInput size={"large"} placeholder={"e.g 15.000"} addonAfter="kg" />
                </Col>
              </Row>

              <Spacer size={30} />

              <Text variant="headingRegular" color={"blue.dark"} hoverColor={"blue.dark"}>
                Dimension
              </Text>

              <Spacer size={15} />

              <Row width="100%" noWrap gap="10px">
                <Col width={"100%"}>
                  <Text variant="headingRegular">length</Text>
                  <FormInput size={"large"} placeholder={"e.g 950"} addonAfter="cm" />
                </Col>
                <Col width={"100%"}>
                  <Text variant="headingRegular">Width</Text>
                  <FormInput size={"large"} placeholder={"e.g 240"} addonAfter="cm" />
                </Col>
                <Col width={"100%"}>
                  <Text variant="headingRegular">Height</Text>
                  <FormInput size={"large"} placeholder={"e.g 240"} addonAfter="cm" />
                </Col>
              </Row>

              <Spacer size={30} />
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                  marginBottom: "20px",
                }}
              >
                {modalForm.typeForm === "create" ? (
                  <Button
                    size="big"
                    variant={"tertiary"}
                    key="submit"
                    type="primary"
                    onClick={() => setModalForm({ open: false, data: {}, typeForm: "" })}
                  >
                    Cancel
                  </Button>
                ) : (
                  <Button
                    size="big"
                    variant={"tertiary"}
                    key="submit"
                    type="primary"
                    onClick={() => {
                      setShowDelete({ open: true, type: "detail", data: modalForm.data });
                    }}
                  >
                    Delete
                  </Button>
                )}

                <Button onClick={handleSubmit(onSubmit)} variant="primary" size="big">
                  {isLoadingCreateTransportation || isLoadingTransportation ? "Loading..." : "Save"}
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
                      deleteTransportation({ ids: selectedRowKeys, company_id: "KSNI" });
                    } else {
                      deleteTransportation({
                        ids: [modalForm.data.uomCategoryId],
                        company_id: "KSNI",
                      });
                    }
                  }}
                >
                  {isLoadingDeleteUomCategory ? "loading..." : "Yes"}
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

export default TransportationGroup;
