import usePagination from "@lucasmogari/react-pagination";
import { useUserPermissions } from "hooks/user-config/usePermission";
import { lang } from "lang";
import { useRouter } from "next/router";
import {
  Button,
  Col,
  DropdownMenu,
  FileUploadModal,
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
import { ICDownload, ICUpload } from "../../../../assets";
import {
  useDeletePurchaseOrganizationMDM,
  usePurchaseOrganizationsMDM,
  useUploadFilePurchaseOrganizationMDM,
} from "../../../../hooks/mdm/purchase-organization/usePurchaseOrganizationMDM";
import { mdmDownloadService } from "../../../../lib/client";
import useDebounce from "../../../../lib/useDebounce";
import { queryClient } from "../../../_app";

const downloadFile = (params: any) => mdmDownloadService("/purchase-organization/download", { params }).then((res) => {
  const dataUrl = window.URL.createObjectURL(new Blob([res.data]));
  const tempLink = document.createElement("a");
  tempLink.href = dataUrl;
  tempLink.setAttribute("download", `purchase-organization_${new Date().getTime()}.xlsx`);
  tempLink.click();
});

const renderConfirmationText = (type: any, data: any) => {
  switch (type) {
    case "selection":
      return data.selectedRowKeys.length > 1
        ? `Are you sure to delete ${data.selectedRowKeys.length} items ?`
        : `By deleting it will affect data that already uses purchase organization ${
          data?.channelData?.data.find((el: any) => el.key === data.selectedRowKeys[0])?.name
        }-${data?.channelData?.data.find((el: any) => el.key === data.selectedRowKeys[0])?.id}`;
    case "detail":
      return `By deleting it will affect data that already uses purchase organization ${data.name}-${data.id}`;

    default:
      break;
  }
};

const ChannelMDM = () => {
  const t = localStorage.getItem("lan") || "en-US";
  const companyId = localStorage.getItem("companyId");
  const companyCode = localStorage.getItem("companyCode");

  const router = useRouter();
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
  const [modalChannelForm, setModalChannelForm] = useState({
    open: false,
    data: {},
    typeForm: "create",
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const debounceSearch = useDebounce(search, 1000);

  const { data: dataUserPermission } = useUserPermissions({
    options: {
      onSuccess: () => {},
    },
  });

  const listPermission = dataUserPermission?.permission?.filter(
    (filtering: any) => filtering.menu === "Purchase Organization",
  );

  const { register, handleSubmit } = useForm();

  const {
    data: dataPurchaseOrganizations,
    isLoading: isLoadingPurchaseOrganizations,
    isFetching: isFetchingPurchaseOrganizations,
  } = usePurchaseOrganizationsMDM({
    query: {
      search: debounceSearch,
      page: pagination.page,
      limit: pagination.itemsPerPage,
      company: companyCode,
    },
    options: {
      onSuccess: (data: any) => {
        pagination.setTotalItems(data.totalRow);
      },
      select: (data: any) => {
        const mappedData = data?.rows?.map((element: any) => ({
          key: element.id,
          id: element.id,
          code: element.code,
          name: element.name,
          parent: element.parent,
          action: listPermission?.filter((data: any) => data.viewTypes[0]?.viewType.name === "View")
            .length > 0 && (
            <div style={{ display: "flex", justifyContent: "left" }}>
              <Button
                size="small"
                onClick={() => router.push(`/mdm/company-structure/purchase-organization/${element.id}`)}
                variant="tertiary"
              >
                {lang[t].purchaseOrg.tertier.viewDetail}
              </Button>
            </div>
          ),
        }));

        return { data: mappedData, totalRow: data.totalRow };
      },
    },
  });

  const { mutate: deletePurchaseOrganization, isLoading: isLoadingDeletePurchaseOrganization } = useDeletePurchaseOrganizationMDM({
    options: {
      onSuccess: () => {
        setShowDelete({ open: false, data: {}, type: "" });
        setModalChannelForm({ open: false, data: {}, typeForm: "" });
        setSelectedRowKeys([]);
        queryClient.invalidateQueries(["purchase-organization"]);
      },
    },
  });

  const { mutate: uploadFilePurchaseOrganization } = useUploadFilePurchaseOrganizationMDM({
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries(["purchase-organization"]);
        setShowUpload(false);
      },
    },
  });

  const columns = [
    {
      title: lang[t].purchaseOrg.purchaseOrgID,
      dataIndex: "code",
    },
    {
      title: lang[t].purchaseOrg.purchaseOrgName,
      dataIndex: "name",
    },
    {
      title: lang[t].purchaseOrg.purchaseOrgParent,
      dataIndex: "parent",
    },
    {
      title: lang[t].purchaseOrg.purchaseOrgAction,
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
    formData.append("upload_file", file);

    uploadFilePurchaseOrganization(formData);
  };

  return (
    <>
      <Col>
        <Text variant="h4">{lang[t].purchaseOrg.pageTitle.purchaseOrganization}</Text>
        <Spacer size={20} />
      </Col>
      <Card>
        <Row justifyContent="space-between">
          <Search
            width="340px"
            placeholder={lang[t].purchaseOrg.search}
            onChange={(e: any) => {
              setSearch(e.target.value);
            }}
          />
          <Row gap="16px">
            {listPermission?.filter(
              (data: any) => data.viewTypes[0]?.viewType.name === "Download Template",
            ).length > 0 && (
              <Button
                size="big"
                variant="tertiary"
                onClick={() => setShowDelete({
                  open: true,
                  type: "selection",
                  data: { channelData: dataPurchaseOrganizations, selectedRowKeys },
                })}
                disabled={rowSelection.selectedRowKeys?.length === 0}
              >
                {lang[t].purchaseOrg.tertier.delete}
              </Button>
            )}

            <DropdownMenu
              title={lang[t].purchaseOrg.secondary.more}
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
              menuList={[
                {
                  key: 1,
                  value: listPermission?.filter(
                    (data: any) => data.viewTypes[0]?.viewType.name === "Download Template",
                  ).length > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <ICDownload />
                      <p style={{ margin: "0" }}>{lang[t].purchaseOrg.ghost.downloadTemplate}</p>
                    </div>
                  ),
                },
                {
                  key: 2,
                  value: listPermission?.filter(
                    (data: any) => data.viewTypes[0]?.viewType.name === "Upload",
                  ).length > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <ICUpload />
                      <p style={{ margin: "0" }}>{lang[t].purchaseOrg.ghost.uploadTemplate}</p>
                    </div>
                  ),
                },
                {
                  key: 3,
                  value: listPermission?.filter(
                    (data: any) => data.viewTypes[0]?.viewType.name === "Download Data",
                  ).length > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <ICDownload />
                      <p style={{ margin: "0" }}>{lang[t].purchaseOrg.ghost.downloadData}</p>
                    </div>
                  ),
                },
              ]}
            />
            <Button
              size="big"
              variant="primary"
              onClick={() => router.push("/mdm/company-structure/purchase-organization/create")}
            >
              {lang[t].purchaseOrg.primary.create}
            </Button>
          </Row>
        </Row>
      </Card>
      <Spacer size={10} />
      <Card style={{ padding: "16px 20px" }}>
        <Col gap="60px">
          <Table
            loading={isLoadingPurchaseOrganizations || isFetchingPurchaseOrganizations}
            columns={columns}
            data={dataPurchaseOrganizations?.data}
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
                    if (isShowDelete.type === "selection") {
                      deletePurchaseOrganization({
                        ids: selectedRowKeys,
                      });
                    } else {
                      deletePurchaseOrganization({
                        ids: [modalChannelForm.data.id],
                      });
                    }
                  }}
                >
                  {isLoadingDeletePurchaseOrganization ? "loading..." : "Yes"}
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

export default ChannelMDM;
