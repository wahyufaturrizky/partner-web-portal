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
import { useRouter } from "next/router";
import { lang } from "lang";
import { useUserPermissions } from "hooks/user-config/useUser";
import { permissionTermOfPayment } from "permission/term-of-payment";
import { usePartnerConfigPermissionLists } from "hooks/user-config/usePermission";
import {
  useTermOfPayments,
  useUploadFileTermOfPayment,
  useDeleteTermOfPayment,
} from "../../../hooks/mdm/term-of-payment/useTermOfPayment";
import useDebounce from "../../../lib/useDebounce";
import { queryClient } from "../../_app";
import { ICDownload, ICUpload } from "../../../assets/icons";
import { mdmDownloadService } from "../../../lib/client";

const downloadFile = (params: any) => mdmDownloadService("/top/download", { params }).then((res) => {
  const dataUrl = window.URL.createObjectURL(new Blob([res.data]));
  const tempLink = document.createElement("a");
  tempLink.href = dataUrl;
  tempLink.setAttribute("download", `term_of_payment_${new Date().getTime()}.xlsx`);
  tempLink.click();
});

const renderConfirmationText = (type: any, data: any) => {
  switch (type) {
    case "selection":
      return data.selectedRowKeys.length > 1
        ? `Are you sure to delete ${data.selectedRowKeys.length} items ?`
        : `Are you sure to delete Term of Payment ${
          data?.topData?.data.map((data: any) => data.name)?.includes(edRowKeys[0])?.topTerm
        } ?`;
    case "detail":
      return `Are you sure to delete Term of Payment ${data.topTerm} ?`;

    default:
      break;
  }
};

const TermOfPayment = () => {
  const t = localStorage.getItem("lan") || "en-US";
  const router = useRouter();
  const companyId = localStorage.getItem("companyId");
  const companyCode = localStorage.getItem("companyCode");
  const pagination = usePagination({
    page: 1,
    itemsPerPage: 20,
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
    data: TopData,
    isLoading: isLoadingTop,
    isFetching: isFetchingTop,
  } = useTermOfPayments({
    query: {
      search: debounceSearch,
      page: pagination.page,
      limit: pagination.itemsPerPage,
      company_id: companyCode,
    },
    options: {
      onSuccess: (data: any) => {
        pagination.setTotalItems(data.totalRow);
      },
      select: (data: any) => {
        const mappedData = data?.rows?.map((element: any) => ({
          key: element.topId,
          id: element.topId,
          topTerm: element.name,
          action: (
            <div style={{ display: "flex", justifyContent: "left" }}>
              <Button
                size="small"
                onClick={() => {
                  router.push(`/mdm/term-of-payment/${element.topId}`);
                }}
                variant="tertiary"
              >
                View Detail
              </Button>
            </div>
          ),
        }));

        return { data: mappedData, totalRow: data.totalRow };
      },
    },
  });

  const { mutate: deleteTop, isLoading: isLoadingDeleteTop } = useDeleteTermOfPayment({
    options: {
      onSuccess: () => {
        setShowDelete({ open: false, data: {}, type: "" });
        setSelectedRowKeys([]);
        queryClient.invalidateQueries(["top-list"]);
      },
    },
  });

  const { mutate: uploadFileTop, isLoading: isLoadingUploadFileTop } = useUploadFileTermOfPayment({
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries(["top-list"]);
        setShowUpload(false);
      },
    },
  });

  const columns = [
    {
      title: lang[t].termOfPayment.termofPaymentID,
      dataIndex: "id",
    },
    {
      title: lang[t].termOfPayment.paymentTerm,
      dataIndex: "topTerm",
    },
    {
      title: lang[t].termOfPayment.termofPaymentAction,
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

  const { data: dataUserPermission } = useUserPermissions({
    options: {
      onSuccess: () => {},
    },
  });

  const listPermission = dataUserPermission?.permission?.filter(
    (filtering: any) => filtering.menu === "Term Of Payment",
  );

  const onSubmitFile = (file: any) => {
    const formData = new FormData();
    formData.append("company_id", companyCode);
    formData.append("file", file);
    uploadFileTop(formData);
  };

  let menuList: any[] = [];

  const checkUserPermission = (permissionGranted) => listPermission?.find(
    (data: any) => data?.viewTypes?.[0]?.viewType?.name === permissionGranted,
  );

  if (listPermission) {
    menuList = [
      checkUserPermission("Download Template")
        ? {
          key: 1,
          value: (
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <ICDownload />
              <p style={{ margin: "0" }}>{lang[t].termOfPayment.ghost.downloadTemplate}</p>
            </div>
          ),
        }
        : "",
      checkUserPermission("Upload")
        ? {
          key: 2,
          value: (
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <ICUpload />
              <p style={{ margin: "0" }}>{lang[t].termOfPayment.ghost.uploadTemplate}</p>
            </div>
          ),
        }
        : "",
      checkUserPermission("Download Data")
        ? {
          key: 3,
          value: (
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <ICDownload />
              <p style={{ margin: "0" }}>{lang[t].termOfPayment.ghost.downloadData}</p>
            </div>
          ),
        }
        : "",
    ];
  }

  return (
    <>
      <Col>
        <Text variant="h4">{lang[t].termOfPayment.pageTitle.termOfPayment}</Text>
        <Spacer size={20} />
      </Col>
      <Card>
        <Row justifyContent="space-between">
          <Search
            width="370px"
            placeholder={lang[t].termOfPayment.searchBar.termOfPayment}
            onChange={(e: any) => {
              setSearch(e.target.value);
            }}
          />
          <Row gap="16px">
            {checkUserPermission("Delete") && (
              <Button
                size="big"
                variant="tertiary"
                onClick={() => setShowDelete({
                  open: true,
                  type: "selection",
                  data: { topData: TopData, selectedRowKeys },
                })}
                disabled={rowSelection.selectedRowKeys?.length === 0}
              >
                {lang[t].termOfPayment.tertier.delete}
              </Button>
            )}
            {checkUserPermission("Download Template")
              && checkUserPermission("Upload")
              && checkUserPermission("Download Data") && (
                <DropdownMenu
                  title={lang[t].termOfPayment.secondary.more}
                  buttonVariant="secondary"
                  buttonSize="big"
                  textVariant="button"
                  textColor="pink.regular"
                  iconStyle={{ fontSize: "12px" }}
                  onClick={(e: any) => {
                    switch (parseInt(e.key)) {
                      case 1:
                        downloadFile({ with_data: "N", company_id: companyCode });
                        break;
                      case 2:
                        setShowUpload(true);
                        break;
                      case 3:
                        downloadFile({ with_data: "Y", company_id: companyCode });
                        break;
                      case 4:
                        break;
                      default:
                        break;
                    }
                  }}
                  menuList={menuList}
                />
            )}
            {checkUserPermission("Create") && (
              <Button
                size="big"
                variant="primary"
                onClick={() => router.push("/mdm/term-of-payment/create")}
              >
                {lang[t].termOfPayment.primary.create}
              </Button>
            )}
          </Row>
        </Row>
      </Card>
      <Spacer size={10} />
      <Card style={{ padding: "16px 20px" }}>
        <Col gap="60px">
          <Table
            loading={isLoadingTop || isFetchingTop}
            columns={columns}
            data={TopData?.data}
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
          title="Confirm Delete"
          footer={null}
          content={(
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
                    deleteTop({ ids: selectedRowKeys, company_id: companyCode });
                  }}
                >
                  {isLoadingDeleteTop ? "loading..." : "Yes"}
                </Button>
              </div>
            </div>
          )}
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

export default TermOfPayment;
