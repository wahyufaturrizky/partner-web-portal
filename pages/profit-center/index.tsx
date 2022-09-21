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
  DropdownMenu,
  FileUploadModal,
} from "pink-lava-ui";
import usePagination from "@lucasmogari/react-pagination";
import {
  useProfitCenters,
  useUploadFileProfitCenter,
  useDeleteProfitCenter,
} from "../../hooks/mdm/profit-center/useProfitCenter";
import useDebounce from "../../lib/useDebounce";
import { queryClient } from "../_app";
import { ICDownload, ICUpload } from "../../assets/icons";
import { mdmDownloadService } from "../../lib/client";
import { useRouter } from "next/router";

const downloadFile = (params: any) =>
  mdmDownloadService("/profit-center/download", { params }).then((res) => {
    let dataUrl = window.URL.createObjectURL(new Blob([res.data]));
    let tempLink = document.createElement("a");
    tempLink.href = dataUrl;
    tempLink.setAttribute("download", `profit_center${new Date().getTime()}.xlsx`);
    tempLink.click();
  });

const renderConfirmationText = (type: any, data: any) => {
  switch (type) {
    case "selection":
      return data.selectedRowKeys.length > 1
        ? `Are you sure to delete ${data.selectedRowKeys.length} items ?`
        : `Are you sure to delete Profit Center ${
            data?.profitData?.data.find((el: any) => el.key === data.selectedRowKeys[0])?.profCenName
          } ?`;
    case "detail":
      return `Are you sure to delete Profit Center ${data.profCenName} ?`;

    default:
      break;
  }
};

const ProfitCenter = () => {
  const router = useRouter();
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
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const debounceSearch = useDebounce(search, 1000);

  const {
    data: ProfitData,
    isLoading: isLoadingProfit,
    isFetching: isFetchingProfit,
  } = useProfitCenters({
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
      select: (data: any) => {
        const mappedData = data?.rows?.map((element: any) => {
          return {
            key: element.profitCenterId,
            id: element.profitCenterId,
            profCenCode: element.code,
            profCenName: element.name,
            action: (
              <div style={{ display: "flex", justifyContent: "left" }}>
                <Button
                  size="small"
                  onClick={() => {
                    router.push(`/profit-center/${element.profitCenterId}`);
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

  const { mutate: deleteProfit, isLoading: isLoadingDeleteProfit } = useDeleteProfitCenter({
    options: {
      onSuccess: () => {
        setShowDelete({ open: false, data: {}, type: "" });
        setSelectedRowKeys([]);
        queryClient.invalidateQueries(["profit-list"]);
      },
    },
  });

  const { mutate: uploadFileProfit, isLoading: isLoadingUploadFileTop } = useUploadFileProfitCenter({
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries(["profit-list"]);
        setShowUpload(false);
      },
    },
  });

  const columns = [
    {
      title: "Profit Center ID",
      dataIndex: "id",
    },
    {
      title: "Profit Center Code",
      dataIndex: "profCenCode",
    },
    {
      title: "Profit Center Name",
      dataIndex: "profCenName",
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

  const onSubmitFile = (file: any) => {
    const formData = new FormData();
    formData.append("company_id", "KSNI");
    formData.append("file", file);

    uploadFileProfit(formData);
  };

  return (
    <>
      <Col>
        <Text variant={"h4"}>Profit Center</Text>
        <Spacer size={20} />
      </Col>
      <Card>
        <Row justifyContent="space-between">
          <Search
            width="340px"
            placeholder="Search Profit Center ID, Term."
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
                  data: { profitData: ProfitData, selectedRowKeys },
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
              onClick={() => router.push("/profit-center/create")}
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
            loading={isLoadingProfit || isFetchingProfit}
            columns={columns}
            data={ProfitData?.data}
            rowSelection={rowSelection}
          />
          <Pagination pagination={pagination} />
        </Col>
      </Card>

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
                    deleteProfit({ profit_center_ids: selectedRowKeys, company_ids: ["KSNI"] });
                  }}
                >
                  {isLoadingDeleteProfit ? "loading..." : "Yes"}
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

export default ProfitCenter