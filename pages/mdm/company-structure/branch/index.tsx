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
import { useUserPermissions } from "hooks/user-config/usePermission";
import {
  useBranchList,
  useUploadFileBranch,
  useDeleteBranch,
} from "../../../../hooks/mdm/branch/useBranch";
import useDebounce from "../../../../lib/useDebounce";
import { queryClient } from "../../../_app";
import { ICDownload, ICUpload } from "../../../../assets/icons";
import { mdmDownloadService } from "../../../../lib/client";

const downloadFile = (params: any) => mdmDownloadService("/branch/download", { params }).then((res) => {
  const dataUrl = window.URL.createObjectURL(new Blob([res.data]));
  const tempLink = document.createElement("a");
  tempLink.href = dataUrl;
  tempLink.setAttribute("download", `branch_${new Date().getTime()}.xlsx`);
  tempLink.click();
});

const renderConfirmationText = (type: any, data: any) => {
  switch (type) {
    case "selection":
      return data.selectedRowKeys.length > 1
        ? `Are you sure to delete ${data.selectedRowKeys.length} items ?`
        : `Are you sure to delete Branch Name ${
          data?.uomData?.data.find((el: any) => el.key === data.selectedRowKeys[0])?.uomName
        } ?`;
    case "detail":
      return `Are you sure to delete Branch Name ${data.uomName} ?`;

    default:
      break;
  }
};

const Branch = () => {
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
  const [modalForm, setModalForm] = useState({
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
    (filtering: any) => filtering.menu === "Branch",
  );

  const {
    data: branchData,
    isLoading: isLoadingBranch,
    isFetching: isFetchingBranch,
  } = useBranchList({
    query: {
      search: debounceSearch,
      page: pagination.page,
      limit: pagination.itemsPerPage,
      company_id: companyCode,
    },
    options: {
      onSuccess: (data: any) => {
        console.log(data, "<<< abis tembak");
        pagination.setTotalItems(data.totalRow);
      },
      select: (data: any) => {
        const mappedData = data?.rows?.map((element: any) => ({
          key: element.branchId,
          id: element.branchId,
          branchName: element.name,
          action: (
            <div style={{ display: "flex", justifyContent: "left" }}>
              <Button
                size="small"
                onClick={() => {
                  router.push(`/mdm/company-structure/branch/${element.companyId}/${element.branchId}`);
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

  const { mutate: deleteBranch, isLoading: isLoadingDeleteBranch } = useDeleteBranch({
    options: {
      onSuccess: () => {
        setShowDelete({ open: false, data: {}, type: "" });
        setSelectedRowKeys([]);
        queryClient.invalidateQueries(["branch-list"]);
      },
    },
  });

  const { mutate: uploadFileBranch, isLoading: isLoadingUploadFileBranch } = useUploadFileBranch({
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries(["branch-list"]);
        setShowUpload(false);
      },
    },
  });

  const columns = [
    {
      title: "Branch ID",
      dataIndex: "id",
    },
    {
      title: "Branch Name",
      dataIndex: "branchName",
    },
    ...(listPermission?.some((el: any) => el.viewTypes[0]?.viewType.name === "View")
      ? [
        {
          title: "Action",
          dataIndex: "action",
          width: "15%",
          align: "left",
        },
      ]
      : []),
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: any) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  const onSubmitFile = (file: any) => {
    const formData = new FormData();
    formData.append("company_id", companyCode);
    formData.append("file", file);

    uploadFileBranch(formData);
  };

  return (
    <>
      <Col>
        <Text variant="h4">Branch</Text>
        <Spacer size={20} />
      </Col>
      <Card>
        <Row justifyContent="space-between">
          <Search
            width="340px"
            placeholder="Search Branch ID, Branch Name"
            onChange={(e: any) => {
              setSearch(e.target.value);
            }}
          />
          <Row gap="16px">
            {listPermission?.filter((data: any) => data.viewTypes[0]?.viewType.name === "Delete")
              .length > 0 && (
              <Button
                size="big"
                variant="tertiary"
                onClick={() => setShowDelete({
                  open: true,
                  type: "selection",
                  data: { branchData, selectedRowKeys },
                })}
                disabled={rowSelection.selectedRowKeys?.length === 0}
              >
                Delete
              </Button>
            )}

            {(listPermission?.filter(
              (data: any) => data.viewTypes[0]?.viewType.name === "Download Template",
            ).length > 0
							|| listPermission?.filter(
							  (data: any) => data.viewTypes[0]?.viewType.name === "Download Data",
							).length > 0
							|| listPermission?.filter((data: any) => data.viewTypes[0]?.viewType.name === "Upload")
							  .length > 0) && (
<DropdownMenu
  title="More"
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
      ...(listPermission?.filter(
        (data: any) => data.viewTypes[0]?.viewType.name === "Download Template",
      ).length > 0 && {
        key: 1,
        value: (
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <ICDownload />
            <p style={{ margin: "0" }}>Download Template</p>
          </div>
        ),
      }),
    },
    {
      ...(listPermission?.filter(
        (data: any) => data.viewTypes[0]?.viewType.name === "Upload",
      ).length > 0 && {
        key: 2,
        value: (
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <ICUpload />
            <p style={{ margin: "0" }}>Upload Template</p>
          </div>
        ),
      }),
    },
    {
      ...(listPermission?.filter(
        (data: any) => data.viewTypes[0]?.viewType.name === "Download Data",
      ).length > 0 && {
        key: 3,
        value: (
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <ICDownload />
            <p style={{ margin: "0" }}>Download Data</p>
          </div>
        ),
      }),
    },
  ]}
/>
            )}

            {listPermission?.filter((data: any) => data.viewTypes[0]?.viewType.name === "Create")
              .length > 0 && (
              <Button size="big" variant="primary" onClick={() => router.push("/mdm/company-structure/branch/create")}>
                Create
              </Button>
            )}
          </Row>
        </Row>
      </Card>
      <Spacer size={10} />
      <Card style={{ padding: "16px 20px" }}>
        <Col gap="60px">
          <Table
            loading={isLoadingBranch || isFetchingBranch}
            columns={columns}
            data={branchData?.data}
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
                      deleteBranch({ ids: selectedRowKeys, company_id: companyCode });
                    } else {
                      deleteBranch({ ids: [modalForm.data.id], company_id: companyCode });
                    }
                  }}
                >
                  {isLoadingDeleteBranch ? "loading..." : "Yes"}
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

export default Branch;
