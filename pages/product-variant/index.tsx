import usePagination from "@lucasmogari/react-pagination";
import { useRouter } from "next/router";
import {
  Button,
  Col,
  DropdownMenu,
  FileUploadModal,
  Lozenge,
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
import { ICDownload, ICUpload } from "../../assets/icons";
import {
  useDeleteProductVariant,
  useProductVariantList,
  useUploadFileProductVariant,
} from "../../hooks/mdm/product-variant/useProductVariant";
import { mdmDownloadService } from "../../lib/client";
import useDebounce from "../../lib/useDebounce";
import { queryClient } from "../_app";

const downloadFile = (params: any) =>
  mdmDownloadService("/product/download", { params }).then((res) => {
    let dataUrl = window.URL.createObjectURL(new Blob([res.data]));
    let tempLink = document.createElement("a");
    tempLink.href = dataUrl;
    tempLink.setAttribute("download", `product_list_${new Date().getTime()}.xlsx`);
    tempLink.click();
  });

const renderConfirmationText = (type: any, data: any) => {
  switch (type) {
    case "selection":
      return data.selectedRowKeys.length > 1
        ? `Are you sure to delete ${data.selectedRowKeys.length} items ?`
        : `Are you sure to delete ProductVariant Name ${
            data?.productVariantData?.data.find((el: any) => el.key === data.selectedRowKeys[0])
              ?.name
          } ?`;
    case "detail":
      return `Are you sure to delete ProductVariant Name ${data.productName} ?`;

    default:
      break;
  }
};

const ProductVariant = () => {
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
  const modalForm  = {
    open: false,
    data: {},
    typeForm: "create",
  };
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const debounceSearch = useDebounce(search, 1000);

  const {
    data: productVariantData,
    isLoading: isLoadingProductVariantList,
    isFetching: isFetchingProductVariantList,
  } = useProductVariantList({
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
            key: element.productId,
            id: element.productId,
            name: element.name,
            status: element.status,
            productCategoryName: element.productCategoryName,
            hasVariant: element.hasVariant,
            action: (
              <div style={{ display: "flex", justifyContent: "left" }}>
                <Button
                  size="small"
                  onClick={() => {
                    router.push(`/product-variant/${element.productId}`);
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

  const { mutate: deleteProductVariantList, isLoading: isLoadingDeleteProductVariantList } =
    useDeleteProductVariant({
      options: {
        onSuccess: () => {
          setShowDelete({ open: false, data: {}, type: "" });
          setSelectedRowKeys([]);
          queryClient.invalidateQueries(["product-variant"]);
        },
      },
    });

  const { mutate: uploadFileProductVariant, isLoading: isLoadingUploadFileProductVariant} = useUploadFileProductVariant(
    {
      options: {
        onSuccess: () => {
          queryClient.invalidateQueries(["product-variant"]);
          setShowUpload(false);
        },
      },
    }
  );

  const columns = [
    {
      title: "Product ID",
      dataIndex: "id",
    },
    {
      title: "Product Variant Name",
      dataIndex: "name",
    },
    {
      title: "Product Category Name",
      dataIndex: "productCategoryName",
    },
    {
      title: "status",
      dataIndex: "status",
      render: (status: any) => (
        <Lozenge variant={status === "active" ? "green" : "black"}>
          {status === "active" ? "Active" : "Inactive"}
        </Lozenge>
      ),
    },  
    {
      title: "Action",
      dataIndex: "action",
      width: "15%",
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: any) => {
      setSelectedRowKeys(selectedRowKeys);
    },
    getCheckboxProps: (record: any) => ({
      disabled: !!record.hasVariant, // Column configuration not to be checked
      name: record.name,
    }),
  };

  const onSubmitFile = (file: any) => {
    const formData = new FormData();
    formData.append("company_id", "KSNI");
    formData.append("company_code", "KSNI");
    formData.append("file", file);

    uploadFileProductVariant(formData);
  };

  return (
    <>
      <Col>
        <Text variant={"h4"}>Product Variant</Text>
        <Spacer size={20} />
      </Col>
      <Card>
        <Row justifyContent="space-between">
          <Search
            width="340px"
            placeholder="Search Product Variant ID, Name, Category, Status"
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
                  data: { productVariantData: productVariantData, selectedRowKeys },
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
              onClick={() => router.push("/product-variant/create")}
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
            loading={isLoadingProductVariantList || isFetchingProductVariantList}
            columns={columns}
            data={productVariantData?.data}
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
                    if (isShowDelete.type === "selection") {
                      deleteProductVariantList({ ids: selectedRowKeys });
                    } else {
                      deleteProductVariantList({ ids: [modalForm.data.id] });
                    }
                  }}
                >
                  {isLoadingDeleteProductVariantList ? "loading..." : "Yes"}
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

export default ProductVariant;
