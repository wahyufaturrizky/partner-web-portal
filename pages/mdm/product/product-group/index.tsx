import React, { useEffect, useState } from "react";
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
import { usePartnerConfigPermissionLists } from "hooks/user-config/usePermission";
import { permissionProductGroup } from "permission/product-group";
import { useUserPermissions } from "hooks/user-config/useUser";
import {
  useProductsGroup,
  useUploadFileProductGroup,
  useDeleteProductGroup,
} from "../../../../hooks/mdm/product-group/useProductGroup";
import useDebounce from "../../../../lib/useDebounce";
import { queryClient } from "../../../_app";
import { ICDownload, ICUpload } from "../../../../assets/icons";
import { mdmDownloadService } from "../../../../lib/client";

const ProductGroup = () => {
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
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const debounceSearch = useDebounce(search, 1000);

  const downloadFile = (params: any) => mdmDownloadService("/product-group/download", { params }).then((res) => {
    const dataUrl = window.URL.createObjectURL(new Blob([res.data]));
    const tempLink = document.createElement("a");
    tempLink.href = dataUrl;
    tempLink.setAttribute("download", `product_group_${new Date().getTime()}.xlsx`);
    tempLink.click();
  });

  const renderConfirmationText = (type: any, data: any) => {
    switch (type) {
      case "selection":
        return data.selectedRowKeys.length > 1
          ? `Are you sure to delete ${data.selectedRowKeys.length} items ?`
          : `Are you sure to delete Product Grouping ${
            data?.productsGroupData?.data.find((el: any) => el.key === data.selectedRowKeys[0])
              ?.productGroupName
          } ?`;
      case "detail":
        return `Are you sure to delete Product Grouping ${data.name} ?`;

      default:
        break;
    }
  };

  const {
    data: productsGroupData,
    isLoading: isLoadingProductsGroup,
    isFetching: isFetchingProductsGroup,
    refetch: refetchGroupData,
  } = useProductsGroup({
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
          key: element.productGroupId,
          id: element.productGroupId,
          productGroupName: element.name,
          action: (
            <div style={{ display: "flex", justifyContent: "left" }}>
              <Button
                size="small"
                onClick={() => {
                  router.push(`/mdm/product/product-group/${element.productGroupId}`);
                }}
                variant="tertiary"
              >
                {lang[t].productGroup.list.tertier.viewDetail}
              </Button>
            </div>
          ),
        }));

        return { data: mappedData, totalRow: data.totalRow };
      },
    },
  });

  const { mutate: deleteProductGroup, isLoading: isLoadingDeleteProductGroup } = useDeleteProductGroup({
    options: {
      onSuccess: () => {
        setShowDelete({ open: false, data: {}, type: "" });
        setSelectedRowKeys([]);
        queryClient.invalidateQueries(["products-group"]);
      },
    },
  });

  const { mutate: uploadFileProductGroup, isLoading: isLoadingUploadFileProductGroup } = useUploadFileProductGroup({
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries(["products-group"]);
        setShowUpload(false);
      },
    },
  });

  const columns = [
    {
      title: lang[t].productGroup.list.table.productGrouping,
      dataIndex: "id",
    },
    {
      title: lang[t].productGroup.list.table.productGroupingName,
      dataIndex: "productGroupName",
    },
    {
      title: lang[t].productGroup.list.table.action,
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
    (filtering: any) => filtering.menu === "Product Group",
  );

  const checkUserPermission = (permissionGranted) => listPermission?.find(
    (data: any) => data?.viewTypes?.[0]?.viewType?.name === permissionGranted,
  );

  let menuList: any[] = [];

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

  const onSubmitFile = (file: any) => {
    const formData = new FormData();
    formData.append("company_id", companyCode);
    formData.append("file", file);

    uploadFileProductGroup(formData);
  };

  useEffect(() => {
    refetchGroupData();
  }, [refetchGroupData, t]);

  return (
    <>
      <Col>
        <Text variant="h4">{lang[t].productGroup.list.headerTitle}</Text>
        <Spacer size={20} />
      </Col>
      <Card>
        <Row justifyContent="space-between">
          <Search
            width="340px"
            placeholder={lang[t].productGroup.list.field.searchList}
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
                  data: { productsGroupData, selectedRowKeys },
                })}
                disabled={rowSelection.selectedRowKeys?.length === 0}
              >
                {lang[t].productGroup.list.button.delete}
              </Button>
            )}
            {checkUserPermission("Download Template")
              && checkUserPermission("Upload")
              && checkUserPermission("Download Data") && (
                <DropdownMenu
                  title={lang[t].productGroup.list.button.more}
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
                onClick={() => router.push("/mdm/product/product-group/create")}
              >
                {lang[t].productGroup.list.button.create}
              </Button>
            )}
          </Row>
        </Row>
      </Card>
      <Spacer size={10} />
      <Card style={{ padding: "16px 20px" }}>
        <Col gap="60px">
          <Table
            loading={isLoadingProductsGroup || isFetchingProductsGroup}
            columns={columns}
            data={productsGroupData?.data}
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
                    deleteProductGroup({ ids: selectedRowKeys, company_id: companyCode });
                  }}
                >
                  {isLoadingDeleteProductGroup ? "loading..." : "Yes"}
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

export default ProductGroup;
