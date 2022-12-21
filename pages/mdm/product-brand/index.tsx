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
  Dropdown,
  Spin,
} from "pink-lava-ui";
import { useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { lang } from "lang";
import { useUserPermissions } from "hooks/user-config/usePermission";
import { ICDownload, ICUpload } from "../../assets";
import { mdmDownloadService } from "../../lib/client";
import useDebounce from "../../lib/useDebounce";
import { queryClient } from "../_app";
import {
  useCreateProductBrandMDM,
  useDeleteProductBrandMDM,
  useParentProductBrandMDM,
  useProductBrandsMDM,
  useUpdateProductBrandMDM,
  useUploadFileProductBrandMDM,
} from "../../hooks/mdm/product-brand/useProductBrandMDM";

const downloadFile = (params: any) =>
  mdmDownloadService("/product-brand/template/download", { params }).then((res) => {
    const dataUrl = window.URL.createObjectURL(new Blob([res.data]));
    const tempLink = document.createElement("a");
    tempLink.href = dataUrl;
    tempLink.setAttribute("download", `product-brand_${new Date().getTime()}.xlsx`);
    tempLink.click();
  });

const renderConfirmationText = (type: any, data: any) => {
  switch (type) {
    case "selection":
      return data.selectedRowKeys.length > 1
        ? `Are you sure to delete ${data.selectedRowKeys.length} items ?`
        : `By deleting it will affect data that already uses product brand ${
            data?.productBrandData?.data.find((el: any) => el.key === data.selectedRowKeys[0])?.name
          }-${
            data?.productBrandData?.data.find((el: any) => el.key === data.selectedRowKeys[0])
              ?.productBrandCode
          }`;
    case "detail":
      return `By deleting it will affect data that already uses product brand ${data.name}-${data.productBrandCode}`;

    default:
      break;
  }
};

const ProductBrandMDM = () => {
  const companyId = localStorage.getItem("companyId");
  const companyCode = localStorage.getItem("companyCode");
  const t = localStorage.getItem("lan") || "en-US";
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
  const [modalProductBrandForm, setModalProductBrandForm] = useState({
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
    (filtering: any) => filtering.menu === "Product Brand"
  );

  const { register, handleSubmit, setValue } = useForm({
    defaultValues: { parent: "" },
  });

  const {
    data: productBrandsMDMData,
    isLoading: isLoadingProductBrandsMDM,
    isFetching: isFetchingProductBrandsMDM,
  } = useProductBrandsMDM({
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
          productBrandCode: element.code,
          brand: element.brand,
          parent: element.parent,
          company: element.company,
          action: listPermission?.filter((data: any) => data.viewTypes[0]?.viewType.name === "View")
            .length > 0 && (
            <div style={{ display: "flex", justifyContent: "left" }}>
              <Button
                size="small"
                onClick={() => {
                  setModalProductBrandForm({ open: true, typeForm: "edit", data: element });
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

  const { mutate: createProductBrandMDM, isLoading: isLoadingCreateProductBrandMDM } =
    useCreateProductBrandMDM({
      options: {
        onSuccess: () => {
          setModalProductBrandForm({ open: false, typeForm: "", data: {} });
          queryClient.invalidateQueries(["product-brand"]);
        },
      },
    });

  const { mutate: updateProductBrandMDM, isLoading: isLoadingUpdateProductBrandMDM } =
    useUpdateProductBrandMDM({
      id: modalProductBrandForm.data?.id,
      options: {
        onSuccess: () => {
          setModalProductBrandForm({ open: false, typeForm: "", data: {} });
          queryClient.invalidateQueries(["product-brand"]);
        },
      },
    });

  const { data: dataParentProductBrandMDM, isLoading: isLoadingParentProductBrandMDM } =
    useParentProductBrandMDM({
      id: `${modalProductBrandForm.data?.id ?? 0}/KSNI`,
    });

  const { mutate: deleteProductBrandMDM, isLoading: isLoadingDeleteProductBrandMDM } =
    useDeleteProductBrandMDM({
      options: {
        onSuccess: () => {
          setShowDelete({ open: false, data: {}, type: "" });
          setModalProductBrandForm({ open: false, data: {}, typeForm: "" });
          setSelectedRowKeys([]);
          queryClient.invalidateQueries(["product-brand"]);
        },
      },
    });

  const { mutate: uploadFileProductBrandMDM } = useUploadFileProductBrandMDM({
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries(["product-brand"]);
        setShowUpload(false);
      },
    },
  });

  const columns = [
    {
      title: lang[t].productBrand.productBrandID,
      dataIndex: "productBrandCode",
    },
    {
      title: lang[t].productBrand.productBrandName,
      dataIndex: "brand",
    },
    {
      title: lang[t].productBrand.productBrandParent,
      dataIndex: "parent",
    },
    {
      title: "Company",
      dataIndex: "company",
    },
    {
      title: lang[t].productBrand.productBrandAction,
      dataIndex: "action",
      width: 160,
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: any) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  const onSubmit = (data: any) => {
    switch (modalProductBrandForm.typeForm) {
      case "create":
        createProductBrandMDM({ ...data, company: companyCode });
        break;
      case "edit":
        updateProductBrandMDM({ ...data, company: companyCode });
        break;
      default:
        setModalProductBrandForm({ open: false, typeForm: "", data: {} });
        break;
    }
  };

  const onSubmitFile = (file: any) => {
    const formData = new FormData();
    formData.append("upload_file", file);

    uploadFileProductBrandMDM(formData);
  };

  return (
    <>
      <Col>
        <Text variant="h4">{lang[t].productBrand.pageTitle.productBrand}</Text>
        <Spacer size={20} />
      </Col>
      <Card>
        <Row justifyContent="space-between">
          <Search
            width="340px"
            placeholder={lang[t].productBrand.searchBar.productBrand}
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
                onClick={() =>
                  setShowDelete({
                    open: true,
                    type: "selection",
                    data: { productBrandData: productBrandsMDMData, selectedRowKeys },
                  })
                }
                disabled={rowSelection.selectedRowKeys?.length === 0}
              >
                {lang[t].productBrand.tertier.delete}
              </Button>
            )}

            <DropdownMenu
              title={lang[t].productBrand.secondary.more}
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
                    (data: any) => data.viewTypes[0]?.viewType.name === "Download Template"
                  ).length > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <ICDownload />
                      <p style={{ margin: "0" }}>{lang[t].productBrand.ghost.downloadTemplate}</p>
                    </div>
                  ),
                },
                {
                  key: 2,
                  value: listPermission?.filter(
                    (data: any) => data.viewTypes[0]?.viewType.name === "Upload"
                  ).length > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <ICUpload />
                      <p style={{ margin: "0" }}>{lang[t].productBrand.ghost.uploadTemplate}</p>
                    </div>
                  ),
                },
                {
                  key: 3,
                  value: listPermission?.filter(
                    (data: any) => data.viewTypes[0]?.viewType.name === "Download Data"
                  ).length > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <ICDownload />
                      <p style={{ margin: "0" }}>{lang[t].productBrand.ghost.downloadData}</p>
                    </div>
                  ),
                },
              ]}
            />
            <Button
              size="big"
              variant="primary"
              onClick={() => setModalProductBrandForm({ open: true, typeForm: "create", data: {} })}
            >
              {lang[t].productBrand.primary.create}
            </Button>
          </Row>
        </Row>
      </Card>
      <Spacer size={10} />
      <Card style={{ padding: "16px 20px" }}>
        <Col gap="60px">
          <Table
            loading={isLoadingProductBrandsMDM || isFetchingProductBrandsMDM}
            columns={columns.filter((filtering) => filtering.dataIndex !== "company")}
            data={productBrandsMDMData?.data}
            rowSelection={rowSelection}
          />
          <Pagination pagination={pagination} />
        </Col>
      </Card>

      {modalProductBrandForm.open && (
        <Modal
          centered
          closable
          visible={modalProductBrandForm.open}
          onCancel={() => setModalProductBrandForm({ open: false, data: {}, typeForm: "" })}
          title={
            modalProductBrandForm.typeForm === "create"
              ? lang[t].productBrand.modalTitleCreate.productBrand
              : lang[t].productBrand.modalTitleUpdate.viewDetail
          }
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
                defaultValue={modalProductBrandForm.data?.brand}
                width="100%"
                label={lang[t].productBrand.productBrandName}
                height="48px"
                required
                placeholder="e.g Brand 1"
                {...register("brand", {
                  shouldUnregister: true,
                })}
              />
              <Spacer size={14} />
              {isLoadingParentProductBrandMDM ? (
                <Spin tip="Loading data..." />
              ) : (
                <>
                  <Dropdown
                    label={lang[t].productBrand.productBrandParent}
                    isOptional
                    width="100%"
                    items={dataParentProductBrandMDM.map((data) => ({
                      value: data.brand,
                      id: data.code,
                    }))}
                    placeholder="Select"
                    handleChange={(text) => setValue("parent", text)}
                    noSearch
                    defaultValue={modalProductBrandForm.data?.parent}
                  />

                  <Spacer size={14} />
                </>
              )}

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                  marginBottom: "20px",
                }}
              >
                {modalProductBrandForm.typeForm === "create" ? (
                  <Button
                    size="big"
                    variant="tertiary"
                    key="submit"
                    type="primary"
                    onClick={() =>
                      setModalProductBrandForm({ open: false, data: {}, typeForm: "" })
                    }
                  >
                    {lang[t].productBrand.tertier.cancel}
                  </Button>
                ) : (
                  <Button
                    size="big"
                    variant="tertiary"
                    key="submit"
                    type="primary"
                    onClick={() => {
                      setShowDelete({
                        open: true,
                        type: "detail",
                        data: modalProductBrandForm.data,
                      });
                    }}
                  >
                    {lang[t].productBrand.tertier.delete}
                  </Button>
                )}

                {listPermission?.filter(
                  (data: any) =>
                    data.viewTypes[0]?.viewType.name === "Update" ||
                    data.viewTypes[0]?.viewType.name === "Create"
                ).length > 0 && (
                  <Button onClick={handleSubmit(onSubmit)} variant="primary" size="big">
                    {isLoadingCreateProductBrandMDM || isLoadingUpdateProductBrandMDM
                      ? "Loading..."
                      : lang[t].productBrand.primary.save}
                  </Button>
                )}
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
          title="Confirm Delete"
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
                      deleteProductBrandMDM({
                        ids: selectedRowKeys,
                      });
                    } else {
                      deleteProductBrandMDM({
                        ids: [modalProductBrandForm.data.id],
                      });
                    }
                  }}
                >
                  {isLoadingDeleteProductBrandMDM ? "loading..." : "Yes"}
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

export default ProductBrandMDM;
