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
  FormSelect,
} from "pink-lava-ui";
import { useState } from "react";
import styled from "styled-components";
import { useProductCategoryInfiniteLists } from "hooks/mdm/product-category/useProductCategory";
import { lang } from "lang";
import { useUserPermissions } from "hooks/user-config/usePermission";
import { ICDownload, ICUpload } from "../../../../assets/icons";
import {
  useDeleteProductVariant,
  useProductVariantList,
  useUploadFileProductVariant,
} from "../../../../hooks/mdm/product-variant/useProductVariant";
import { mdmDownloadService } from "../../../../lib/client";
import useDebounce from "../../../../lib/useDebounce";
import { queryClient } from "../../../_app";

const downloadFile = (params: any) => mdmDownloadService("/product-variant/download", { params }).then((res) => {
  const dataUrl = window.URL.createObjectURL(new Blob([res.data]));
  const tempLink = document.createElement("a");
  tempLink.href = dataUrl;
  tempLink.setAttribute("download", `product_variant_list_${new Date().getTime()}.xlsx`);
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
  const t = localStorage.getItem("lan") || "en-US";
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

  const [productCategory, setProductCategory] = useState("");
  const [search, setSearch] = useState("");
  const [isShowDelete, setShowDelete] = useState({ open: false, type: "selection", data: {} });
  const [isShowUpload, setShowUpload] = useState(false);
  const modalForm = {
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
      company_id: companyCode,
      category_id: productCategory,
    },
    options: {
      onSuccess: (data: any) => {
        pagination.setTotalItems(data.totalRow);
      },
      select: (data: any) => {
        const mappedData = data?.rows?.map((element: any) => ({
          key: element.productVariantId,
          id: element.productVariantId,
          name: element.name,
          status: element.status,
          productCategoryName: element.productCategoryName,
          hasVariant: element.hasVariant,
          variant: element?.productVariants?.length ?? "-",
          action: (
            <div style={{ display: "flex", justifyContent: "left" }}>
              <Button
                size="small"
                onClick={() => {
                  router.push(`/mdm/product/product-variant/${element.productVariantId}`);
                }}
                variant="tertiary"
              >
                {lang[t].productList.list.button.detail}
              </Button>
            </div>
          ),
        }));

        return { data: mappedData, totalRow: data.totalRow };
      },
    },
  });

  const { mutate: deleteProductVariantList, isLoading: isLoadingDeleteProductVariantList } = useDeleteProductVariant({
    options: {
      onSuccess: () => {
        setShowDelete({ open: false, data: {}, type: "" });
        setSelectedRowKeys([]);
        queryClient.invalidateQueries(["product-variant"]);
      },
    },
  });

  const { mutate: uploadFileProductVariant, isLoading: isLoadingUploadFileProductVariant } = useUploadFileProductVariant({
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries(["product-variant"]);
        setShowUpload(false);
      },
    },
  });
  const { data: dataUserPermission } = useUserPermissions({
    options: {
      onSuccess: () => {},
    },
  });

  const listPermission = dataUserPermission?.permission?.filter(
    (filtering: any) => filtering.menu === "Product Variant",
  );
  console.log(listPermission);

  const columns = [
    {
      title: lang[t].productVariant.list.table.productId,
      dataIndex: "id",
    },
    {
      title: lang[t].productVariant.list.table.productVariantName,
      dataIndex: "name",
    },
    {
      title: lang[t].productVariant.list.table.productCategoryName,
      dataIndex: "productCategoryName",
    },
    {
      title: lang[t].productVariant.list.table.status,
      dataIndex: "status",
      render: (status: any) => (
        <Lozenge variant={status === "active" ? "green" : "black"}>
          {status === "active" ? "Active" : "Inactive"}
        </Lozenge>
      ),
    },
    ...(listPermission?.filter((x: any) => x.viewTypes[0]?.viewType.name === "View").length > 0
      ? [
        {
          title: lang[t].productList.list.table.action,
          dataIndex: "action",
          width: "15%",
        },
      ]
      : []),
  ];

  const onSubmitFile = (file: any) => {
    const formData = new FormData();
    formData.append("company_id", companyCode);
    formData.append("company_code", companyCode);
    formData.append("file", file);

    uploadFileProductVariant(formData);
  };

  let menuList: any[] = [];

  if (
    listPermission?.filter((x: any) => x.viewTypes[0]?.viewType.name === "Download Template")
      .length > 0
  ) {
    menuList = [
      ...menuList,
      {
        key: 1,
        value: (
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <ICDownload />
            <p style={{ margin: "0" }}>Download Template</p>
          </div>
        ),
      },
    ];
  }
  if (listPermission?.filter((x: any) => x.viewTypes[0]?.viewType.name === "Upload").length > 0) {
    menuList = [
      ...menuList,
      {
        key: 2,
        value: (
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <ICUpload />
            <p style={{ margin: "0" }}>{lang[t].productVariant.list.button.upload}</p>
          </div>
        ),
      },
    ];
  }
  if (
    listPermission?.filter((x: any) => x.viewTypes[0]?.viewType.name === "Download Data").length > 0
  ) {
    menuList = [
      ...menuList,
      {
        key: 3,
        value: (
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <ICDownload />
            <p style={{ margin: "0" }}>{lang[t].productVariant.list.button.downloadData}</p>
          </div>
        ),
      },
    ];
  }
  const [listProductCategory, setListProductCategory] = useState<any[]>([]);
  const [totalRowsProductCategory, setTotalRowsProductCategory] = useState(0);
  const [searchProductCategory, setSearchProductCategory] = useState("");
  const debounceFetchProductCategory = useDebounce(searchProductCategory, 1000);

  const {
    isFetching: isFetchingProductCategory,
    isFetchingNextPage: isFetchingMoreProductCategory,
    hasNextPage: hasNextProductCategory,
    fetchNextPage: fetchNextPageProductCategory,
  } = useProductCategoryInfiniteLists({
    query: {
      search: debounceFetchProductCategory,
      company_id: companyCode,
      limit: 10,
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRowsProductCategory(data?.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => group.rows?.map((element: any) => ({
          label: element.name,
          value: element.productCategoryId,
        })));
        const flattenArray = [].concat(...mappedData);
        setListProductCategory(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (listProductCategory.length < totalRowsProductCategory) {
          return pages.length + 1;
        }
        return undefined;
      },
    },
  });

  return (
    <>
      <Col>
        <Text variant="h4">{lang[t].productVariant.list.headerTitle}</Text>
        <Spacer size={20} />
      </Col>
      <Card>
        <Row justifyContent="space-between">
          <Row Row gap="16px">
            <Search
              width="360px"
              placeholder={lang[t].productVariant.list.field.searchBar}
              onChange={(e: any) => {
                setSearch(e.target.value);
              }}
            />
            <Col width="200px">
              <CustomFormSelect
                style={{ width: "100%", height: "48px" }}
                size="large"
                placeholder="Product Category"
                borderColor="#AAAAAA"
                arrowColor="#000"
                withSearch
                isLoading={isFetchingProductCategory}
                isLoadingMore={isFetchingMoreProductCategory}
                fetchMore={() => {
                  if (hasNextProductCategory) {
                    fetchNextPageProductCategory();
                  }
                }}
                items={
                  isFetchingProductCategory || isFetchingMoreProductCategory
                    ? []
                    : listProductCategory
                }
                onChange={(value: any) => {
                  setProductCategory(value);
                }}
                onSearch={(value: any) => {
                  setSearchProductCategory(value);
                }}
              />
            </Col>
          </Row>
          <Row gap="16px">
            <DropdownMenu
              title={lang[t].productVariant.list.button.more}
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
            {listPermission?.filter((x: any) => x.viewTypes[0]?.viewType.name === "Create").length
              > 0 && (
              <Button
                size="big"
                variant="primary"
                onClick={() => router.push("/mdm/product/product-variant/create")}
              >
                {lang[t].productVariant.list.button.create}
              </Button>
            )}
          </Row>
        </Row>
      </Card>
      <Spacer size={10} />
      <Card style={{ padding: "16px 20px" }}>
        <Col gap="60px">
          <Table
            loading={isLoadingProductVariantList || isFetchingProductVariantList}
            columns={columns}
            data={productVariantData?.data}
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

const CustomFormSelect = styled(FormSelect)`
  .ant-select-selection-placeholder {
    line-height: 48px !important;
  }

  .ant-select-selection-search-input {
    height: 48px !important;
  }

  .ant-select-selector {
    height: 48px !important;
    border-radius: 64px !important;
  }

  .ant-select-selection-item {
    display: flex;
    align-items: center;
  }
`;

const Label = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  color: #000000;
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
`;

export default ProductVariant;
