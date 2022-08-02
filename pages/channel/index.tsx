import usePagination from "@lucasmogari/react-pagination";
import {
  Button,
  Col,
  DropdownMenu,
  FileUploadModal,
  Input,
  Modal,
  Pagination,
  Row,
  Search,
  Spacer,
  Table,
  Text,
} from "pink-lava-ui";
import { useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { ICDownload, ICUpload } from "../../assets";
import {
  useChannelsMDM,
  useCreateChannelMDM,
  useDeleteChannelMDM,
  useUpdateChannelMDM,
  useUploadFileChannelMDM,
} from "../../hooks/mdm/channel/useChannelMDM";
import { mdmDownloadService } from "../../lib/client";
import useDebounce from "../../lib/useDebounce";
import { queryClient } from "../_app";

const downloadFile = (params: any) =>
  mdmDownloadService("/sales-channel/download", { params }).then((res) => {
    let dataUrl = window.URL.createObjectURL(new Blob([res.data]));
    let tempLink = document.createElement("a");
    tempLink.href = dataUrl;
    tempLink.setAttribute("download", `sales-channel_${new Date().getTime()}.xlsx`);
    tempLink.click();
  });

const renderConfirmationText = (type: any, data: any) => {
  switch (type) {
    case "selection":
      return data.selectedRowKeys.length > 1
        ? `Are you sure to delete ${data.selectedRowKeys.length} items ?`
        : `By deleting it will affect data that already uses Channel ${
            data?.channelData?.data.find((el: any) => el.key === data.selectedRowKeys[0])?.name
          }-${
            data?.channelData?.data.find((el: any) => el.key === data.selectedRowKeys[0])
              ?.salesChannelId
          }`;
    case "detail":
      return `By deleting it will affect data that already uses Channel ${data.name}-${data.salesChannelId}`;

    default:
      break;
  }
};

const ChannelMDM = () => {
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
  const [modalChannelForm, setModalChannelForm] = useState({
    open: false,
    data: {},
    typeForm: "create",
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const debounceSearch = useDebounce(search, 1000);

  const { register, handleSubmit } = useForm();

  const {
    data: channelsMDMData,
    isLoading: isLoadingChannelsMDM,
    isFetching: isFetchingChannelsMDM,
  } = useChannelsMDM({
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
            key: element.salesChannelId,
            id: element.salesChannelId,
            salesChannelId: element.salesChannelId,
            companyId: element.companyId,
            name: element.name,
            action: (
              <div style={{ display: "flex", justifyContent: "left" }}>
                <Button
                  size="small"
                  onClick={() => {
                    setModalChannelForm({ open: true, typeForm: "edit", data: element });
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

  const { mutate: createChannelMDM, isLoading: isLoadingcreateChannelMDM } = useCreateChannelMDM({
    options: {
      onSuccess: () => {
        setModalChannelForm({ open: false, typeForm: "", data: {} });
        queryClient.invalidateQueries(["sales-channel"]);
      },
    },
  });

  const { mutate: updateChannelMDM, isLoading: isLoadingupdateChannelMDM } = useUpdateChannelMDM({
    id: `${modalChannelForm?.data?.companyId}/${modalChannelForm?.data?.salesChannelId}`,
    options: {
      onSuccess: () => {
        setModalChannelForm({ open: false, typeForm: "", data: {} });
        queryClient.invalidateQueries(["sales-channel"]);
      },
    },
  });

  const { mutate: deleteChannelMDM, isLoading: isLoadingdeleteChannelMDM } = useDeleteChannelMDM({
    options: {
      onSuccess: () => {
        setShowDelete({ open: false, data: {}, type: "" });
        setModalChannelForm({ open: false, data: {}, typeForm: "" });
        setSelectedRowKeys([]);
        queryClient.invalidateQueries(["sales-channel"]);
      },
    },
  });

  const { mutate: uploadFileChannelMDM, isLoading: isLoadinguploadFileChannelMDM } =
    useUploadFileChannelMDM({
      options: {
        onSuccess: () => {
          queryClient.invalidateQueries(["sales-channel"]);
          setShowUpload(false);
        },
      },
    });

  const columns = [
    {
      title: "Sales Channel ID",
      dataIndex: "salesChannelId",
    },
    {
      title: "Sales Channel Name",
      dataIndex: "name",
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
    switch (modalChannelForm.typeForm) {
      case "create":
        createChannelMDM({ ...data, company_id: "KSNI" });
        break;
      case "edit":
        updateChannelMDM(data);
        break;
      default:
        setModalChannelForm({ open: false, typeForm: "", data: {} });
        break;
    }
  };

  const onSubmitFile = (file: any) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("company_id", "KSNI");

    uploadFileChannelMDM(formData);
  };

  return (
    <>
      <Col>
        <Text variant={"h4"}>Sales Channel</Text>
        <Spacer size={20} />
      </Col>
      <Card>
        <Row justifyContent="space-between">
          <Search
            width="340px"
            placeholder="Search Sales Channel ID"
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
                  data: { channelData: channelsMDMData, selectedRowKeys },
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
              onClick={() => setModalChannelForm({ open: true, typeForm: "create", data: {} })}
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
            loading={isLoadingChannelsMDM || isFetchingChannelsMDM}
            columns={columns}
            data={channelsMDMData?.data}
            rowSelection={rowSelection}
          />
          <Pagination pagination={pagination} />
        </Col>
      </Card>

      {modalChannelForm.open && (
        <Modal
          width={"350px"}
          centered
          closable={false}
          visible={modalChannelForm.open}
          onCancel={() => setModalChannelForm({ open: false, data: {}, typeForm: "" })}
          title={modalChannelForm.typeForm === "create" ? "Create Channel" : "Channel"}
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
                defaultValue={modalChannelForm.data?.name}
                width="100%"
                label="Sales Channel Name"
                height="48px"
                placeholder={"e.g Modern Trade"}
                {...register("name", {
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
                {modalChannelForm.typeForm === "create" ? (
                  <Button
                    size="big"
                    variant={"tertiary"}
                    key="submit"
                    type="primary"
                    onClick={() => setModalChannelForm({ open: false, data: {}, typeForm: "" })}
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
                      setShowDelete({ open: true, type: "detail", data: modalChannelForm.data });
                    }}
                  >
                    Delete
                  </Button>
                )}

                <Button onClick={handleSubmit(onSubmit)} variant="primary" size="big">
                  {isLoadingcreateChannelMDM || isLoadingupdateChannelMDM ? "Loading..." : "Save"}
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
                      deleteChannelMDM({
                        company_id: "KSNI",
                        ids: selectedRowKeys,
                      });
                    } else {
                      deleteChannelMDM({
                        company_id: modalChannelForm.data.companyId,
                        ids: [modalChannelForm.data.salesChannelId],
                      });
                    }
                  }}
                >
                  {isLoadingdeleteChannelMDM ? "loading..." : "Yes"}
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

export default ChannelMDM;
