import usePagination from "@lucasmogari/react-pagination";
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
import styled from "styled-components";
import { lang } from "lang";
import { useUserPermissions } from "hooks/user-config/usePermission";
import { ICDownload, ICUpload } from "../../../../assets/icons";
import {
  useDeleteProductOptionMDM,
  useProductOptionsMDM,
  useUploadFileProductOptionMDM,
} from "../../../../hooks/mdm/product-option/useProductOptionMDM";
import { mdmDownloadService } from "../../../../lib/client";
import useDebounce from "../../../../lib/useDebounce";
import { queryClient } from "../../../_app";

const downloadFile = (params: any) => mdmDownloadService("/product-option/download", { params }).then((res) => {
  const dataUrl = window.URL.createObjectURL(new Blob([res.data]));
  const tempLink = document.createElement("a");
  tempLink.href = dataUrl;
  tempLink.setAttribute("download", `product_option_${new Date().getTime()}.xlsx`);
  tempLink.click();
});

const renderConfirmationText = (type: any, data: any) => {
  switch (type) {
    case "selection":
      return data.selectedRowKeys.length > 1
        ? `Are you sure to delete ${data.selectedRowKeys.length} items ?`
        : `Are you sure to delete product option name ${
          data?.ProductOptionData?.data.find((el: any) => el.key === data.selectedRowKeys[0])
            ?.name
        } ?`;
    case "detail":
      return `Are you sure to delete product option name ${data.name} ?`;

    default:
      break;
  }
};

const ProductOption = () => {
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
    (filtering: any) => filtering.menu === "Product Option",
  );

  const {
    data: ProductOptionData,
    isLoading: isLoadingProductOption,
    isFetching: isFetchingProductOption,
  } = useProductOptionsMDM({
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
          key: element.productOptionId,
          id: element.productOptionId,
          name: element.name,
          company_id: element.companyId,
          action: (
            <div style={{ display: "flex", justifyContent: "left" }}>
              <Button
                size="small"
                onClick={() => {
                  router.push(`/mdm/product/product-option/${element.productOptionId}`);
                }}
                variant="tertiary"
              >
                {lang[t].productOption.tertier.viewDetail}
              </Button>
            </div>
          ),
        }));

        return { data: mappedData, totalRow: data.totalRow };
      },
    },
  });

  const { mutate: deleteProductOption, isLoading: isLoadingDeleteProductOption }: any = useDeleteProductOptionMDM({
    options: {
      onSuccess: () => {
        setShowDelete({ open: false, data: {}, type: "" });
        setSelectedRowKeys([]);
        queryClient.invalidateQueries(["product-option"]);
      },
    },
  });

  const { mutate: uploadFileProductOption } = useUploadFileProductOptionMDM({
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries(["product-option"]);
        setShowUpload(false);
      },
    },
  });

  const columns = [
    {
      title: lang[t].productOption.productOptionID,
      dataIndex: "id",
    },
    {
      title: lang[t].productOption.productOptionName,
      dataIndex: "name",
    },
    {
      title: "Company Id",
      dataIndex: "companyId",
    },
    ...(listPermission?.some((el: any) => el.viewTypes[0]?.viewType.name === "View")
      ? [
        {
          title: lang[t].productOption.productOptionAction,
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
    const formData: any = new FormData();
    formData.append("company_id", companyCode);
    formData.append("file", file);

    uploadFileProductOption(formData);
  };

  return (
    <>
      <Col>
        <Text variant="h4">{lang[t].productOption.pageTitle.productOption}</Text>
        <Spacer size={20} />
      </Col>
      <Card>
        <Row justifyContent="space-between">
          <Search
            width="340px"
            placeholder={lang[t].productOption.searchBar.productOption}
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
                  data: { ProductOptionData, selectedRowKeys },
                })}
                disabled={rowSelection.selectedRowKeys?.length === 0}
              >
                {lang[t].productOption.tertier.delete}
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
  title={lang[t].productOption.secondary.more}
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
            <p style={{ margin: "0" }}>
              {lang[t].productOption.ghost.downloadTemplate}
            </p>
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
            <p style={{ margin: "0" }}>
              {lang[t].productOption.ghost.uploadTemplate}
            </p>
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
            <p style={{ margin: "0" }}>{lang[t].productOption.ghost.downloadData}</p>
          </div>
        ),
      }),
    },
  ]}
/>
            )}

            {listPermission?.filter((data: any) => data.viewTypes[0]?.viewType.name === "Create")
              .length > 0 && (
              <Button
                size="big"
                variant="primary"
                onClick={() => router.push("/mdm/product/product-option/create")}
              >
                {lang[t].productOption.primary.create}
              </Button>
            )}
          </Row>
        </Row>
      </Card>
      <Spacer size={10} />
      <Card style={{ padding: "16px 20px" }}>
        <Col gap="60px">
          <Table
            loading={isLoadingProductOption || isFetchingProductOption}
            columns={columns.filter((filtering) => filtering.dataIndex !== "companyId")}
            data={ProductOptionData?.data}
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
                      deleteProductOption({ ids: selectedRowKeys, company_id: companyCode });
                    } else {
                      deleteProductOption({ ids: [modalForm.data.id], company_id: companyCode });
                    }
                  }}
                >
                  {isLoadingDeleteProductOption ? "loading..." : "Yes"}
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

export default ProductOption;
