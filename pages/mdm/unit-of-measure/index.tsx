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
  Lozenge,
} from "pink-lava-ui";
import usePagination from "@lucasmogari/react-pagination";
import { useRouter } from "next/router";
import { lang } from "lang";
import { useUserPermissions } from "hooks/user-config/usePermission";
import { useUOMList, useUploadFileUOM, useDeletUOM } from "../../../hooks/mdm/unit-of-measure/useUOM";
import useDebounce from "../../../lib/useDebounce";
import { queryClient } from "../../_app";
import { ICDownload, ICUpload } from "../../../assets/icons";
import { mdmDownloadService } from "../../../lib/client";

const downloadFile = (params: any) => mdmDownloadService("/uom/download", { params }).then((res) => {
  const dataUrl = window.URL.createObjectURL(new Blob([res.data]));
  const tempLink = document.createElement("a");
  tempLink.href = dataUrl;
  tempLink.setAttribute("download", `uom_${new Date().getTime()}.xlsx`);
  tempLink.click();
});

const renderConfirmationText = (type: any, data: any) => {
  switch (type) {
    case "selection":
      return data.selectedRowKeys.length > 1
        ? `Are you sure to delete ${data.selectedRowKeys.length} items ?`
        : `Are you sure to delete Uom Name ${
          data?.uomData?.data.find((el: any) => el.key === data.selectedRowKeys[0])?.uomName
        } ?`;
    case "detail":
      return `Are you sure to delete Uom Name ${data.uomName} ?`;

    default:
      break;
  }
};

const UOM = () => {
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
    (filtering: any) => filtering.menu === "Unit of Measure",
  );

  const {
    data: UOMData,
    isLoading: isLoadingUOM,
    isFetching: isFetchingUOM,
  } = useUOMList({
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
          key: element.uomId,
          id: element.uomId,
          uomName: element.name,
          uomCategoryName: element.uomCategoryName,
          status: element.activeStatus,
          action: listPermission?.filter((data: any) => data.viewTypes[0]?.viewType.name === "View")
            .length > 0 && (
            <div style={{ display: "flex", justifyContent: "left" }}>
              <Button
                size="small"
                onClick={() => {
                  router.push(`/mdm/unit-of-measure/${element.uomId}`);
                }}
                variant="tertiary"
              >
                {lang[t].unitOfMeasure.tertier.viewDetail}
              </Button>
            </div>
          ),
        }));

        return { data: mappedData, totalRow: data.totalRow };
      },
    },
  });

  const { mutate: deleteUom, isLoading: isLoadingDeleteUom } = useDeletUOM({
    options: {
      onSuccess: () => {
        setShowDelete({ open: false, data: {}, type: "" });
        setSelectedRowKeys([]);
        queryClient.invalidateQueries(["uom-list"]);
      },
    },
  });

  const { mutate: uploadFileUom, isLoading: isLoadingUploadFileUom } = useUploadFileUOM({
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries(["uom-list"]);
        setShowUpload(false);
      },
    },
  });

  const columns = [
    {
      title: lang[t].unitOfMeasure.uoMID,
      dataIndex: "id",
    },
    {
      title: lang[t].unitOfMeasure.uoMName,
      dataIndex: "uomName",
    },
    {
      title: lang[t].unitOfMeasure.uoMCategory,
      dataIndex: "uomCategoryName",
    },
    {
      title: lang[t].unitOfMeasure.ghost.status,
      dataIndex: "status",
      render: (status: any) => (
        <Lozenge variant={status === "ACTIVE" ? "green" : "black"}>
          {status === "ACTIVE" ? "Active" : "Inactive"}
        </Lozenge>
      ),
    },
    {
      title: lang[t].unitOfMeasure.uoMAction,
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
    formData.append("company_id", companyCode);
    formData.append("file", file);

    uploadFileUom(formData);
  };

  return (
    <>
      <Col>
        <Text variant="h4">{lang[t].unitOfMeasure.pageTitle.uoM}</Text>
        <Spacer size={20} />
      </Col>
      <Card>
        <Row justifyContent="space-between">
          <Search
            width="340px"
            placeholder={lang[t].unitOfMeasure.searchBar.uoM}
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
                  data: { uomData: UOMData, selectedRowKeys },
                })}
                disabled={rowSelection.selectedRowKeys?.length === 0}
              >
                {lang[t].unitOfMeasure.tertier.delete}
              </Button>
            )}

            <DropdownMenu
              title={lang[t].unitOfMeasure.secondary.more}
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
                  value: (
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <ICDownload />
                      <p style={{ margin: "0" }}>{lang[t].unitOfMeasure.ghost.downloadTemplate}</p>
                    </div>
                  ),
                },
                {
                  key: 2,
                  value: (
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <ICUpload />
                      <p style={{ margin: "0" }}>{lang[t].unitOfMeasure.ghost.uploadTemplate}</p>
                    </div>
                  ),
                },
                {
                  key: 3,
                  value: (
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <ICDownload />
                      <p style={{ margin: "0" }}>{lang[t].unitOfMeasure.ghost.downloadData}</p>
                    </div>
                  ),
                },
              ]}
            />
            <Button
              size="big"
              variant="primary"
              onClick={() => router.push("/mdm/unit-of-measure/create")}
            >
              {lang[t].unitOfMeasure.primary.create}
            </Button>
          </Row>
        </Row>
      </Card>
      <Spacer size={10} />
      <Card style={{ padding: "16px 20px" }}>
        <Col gap="60px">
          <Table
            loading={isLoadingUOM || isFetchingUOM}
            columns={columns}
            data={UOMData?.data}
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
                      deleteUom({ ids: selectedRowKeys, company_id: companyCode });
                    } else {
                      deleteUom({ ids: [modalForm.data.id], company_id: companyCode });
                    }
                  }}
                >
                  {isLoadingDeleteUom ? "loading..." : "Yes"}
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

export default UOM;
