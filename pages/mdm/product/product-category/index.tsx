import { useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import {
  Button,
  Col,
  DropdownMenu,
  Pagination,
  Row,
  Search,
  Spacer,
  Table,
  Text,
  FileUploadModal,
} from "pink-lava-ui";
import usePagination from "@lucasmogari/react-pagination";
import {
  useDeleteProductCategory,
  useProductCategoryList,
  useUploadFileProductCategory,
} from "hooks/mdm/product-category/useProductCategory";
import { useUserPermissions } from "hooks/user-config/usePermission";
import { ICDownload, ICUpload } from "../../../../assets";
import { ModalDeleteConfirmation } from "../../../../components/elements/Modal/ModalConfirmationDelete";
import { mdmDownloadService } from "../../../../lib/client";
import useDebounce from "../../../../lib/useDebounce";

const ProductCategory = () => {
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
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [itemsSelected, setItemsSelected] = useState([]);
  const [visible, setVisible] = useState({
    delete: false,
    upload: false,
  });

  const debounceSearch = useDebounce(search, 1000);

  const { data: dataUserPermission } = useUserPermissions({
    options: {
      onSuccess: () => {},
    },
  });

  const listPermission = dataUserPermission?.permission?.filter(
    (filtering: any) => filtering.menu === "Product Category",
  );

  const columns = [
    {
      title: "Product Category ID",
      dataIndex: "id",
    },
    {
      title: "Product Category Name",
      dataIndex: "name",
    },
    {
      title: "Parent",
      dataIndex: "parent",
    },
    ...(listPermission?.some((el: any) => el.viewTypes[0]?.viewType.name === "View")
      ? [
        {
          title: "Action",
          dataIndex: "action",
          width: "15%",
        },
      ]
      : []),
  ];

  const {
    data: productCategoryData,
    isLoading: isLoadingProductCategory,
    refetch: refetchProductCategory,
  } = useProductCategoryList({
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
          key: element.productCategoryId,
          id: element.productCategoryId,
          name: element.name,
          parent: element.parent || "-",
          action: (
            <div style={{ display: "flex", justifyContent: "left" }}>
              <Button
                size="small"
                onClick={() => {
                  router.push(`/mdm/product/product-category/${element.productCategoryId}`);
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

  const { mutate: deleteProductCategory, isLoading: loadingDelete }: any = useDeleteProductCategory(
    {
      options: {
        onSuccess: () => {
          setItemsSelected([]);
          setVisible({ upload: false, delete: false });
          refetchProductCategory();
        },
      },
    },
  );

  const actDrowpdown = [
    {
      ...(listPermission?.filter(
        (data: any) => data.viewTypes[0]?.viewType.name === "Download Template",
      ).length > 0 && {
        key: 1,
        value: (
          <ButtonAction onClick={() => handleDownloadFile({ with_data: "N" })}>
            <ICDownload />
            <p style={{ margin: "0" }}>Download Template</p>
          </ButtonAction>
        ),
      }),
    },
    {
      ...(listPermission?.filter(
        (data: any) => data.viewTypes[0]?.viewType.name === "Upload",
      ).length > 0 && {
        key: 2,
        value: (
          <ButtonAction onClick={() => setVisible({ upload: true, delete: false })}>
            <ICUpload />
            <p style={{ margin: "0" }}>Upload Template</p>
          </ButtonAction>
        ),
      }),
    },
    {
      ...(listPermission?.filter(
        (data: any) => data.viewTypes[0]?.viewType.name === "Download Data",
      ).length > 0 && {
        key: 3,
        value: (
          <ButtonAction onClick={() => handleDownloadFile({ with_data: "Y" })}>
            <ICDownload />
            <p style={{ margin: "0" }}>Download Data</p>
          </ButtonAction>
        ),
      }),
    },
  ];

  const rowSelection = {
    itemsSelected,
    onChange: (selected: any) => {
      setItemsSelected(selected);
    },
  };

  const handleDownloadFile = (params) => {
    mdmDownloadService(`/product-category/download?company_id=${companyCode}`, { params }).then(
      (res) => {
        const dataUrl = window.URL.createObjectURL(new Blob([res?.data]));
        const tempLink = document.createElement("a");
        tempLink.href = dataUrl;
        tempLink.setAttribute("download", `product-category ${new Date().getTime()}.xlsx`);
        tempLink.click();
      },
    );
  };

  const { mutate: uploadFileProductCategory } = useUploadFileProductCategory({
    company_id: companyCode,
    options: {
      onSuccess: () => {
        refetchProductCategory();
        setVisible({ delete: false, upload: false });
      },
    },
  });

  const submitUploadFile = (file: any) => {
    const formData: any = new FormData();
    formData.append("file", file);

    uploadFileProductCategory(formData);
  };

  return (
    <div>
      <Col>
        <Text variant="h4">Product Category</Text>
        <Spacer size={20} />
      </Col>
      <Card>
        <Row justifyContent="space-between">
          <Search
            width="340px"
            placeholder="Search Product Category ID, Name, Parent"
            onChange={({ target }: any) => setSearch(target.value)}
          />
          <Row gap="16px">
            {listPermission?.filter((data: any) => data.viewTypes[0]?.viewType.name === "Delete")
              .length > 0 && (
              <Button
                size="big"
                variant="tertiary"
                onClick={() => setVisible({ upload: false, delete: true })}
                disabled={itemsSelected?.length < 1}
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
                //   onClick={({ key }: any) => key === '1' && handleDownloadFile()}
  menuList={actDrowpdown}
/>
            )}
            {listPermission?.filter((data: any) => data.viewTypes[0]?.viewType.name === "Create")
              .length > 0 && (
              <Button
                size="big"
                variant="primary"
                onClick={() => router.push("/mdm/product/product-category/create")}
              >
                Create
              </Button>
            )}
          </Row>
        </Row>
      </Card>
      <Spacer size={20} />
      <Card style={{ padding: "16px 20px" }}>
        <Col gap="60px">
          <Table
            loading={isLoadingProductCategory}
            columns={columns}
            data={productCategoryData?.data}
            rowSelection={rowSelection}
          />
          <Pagination pagination={pagination} />
        </Col>
      </Card>

      {visible.upload && (
        <FileUploadModal
          visible={visible.upload}
          setVisible={() => setVisible({ upload: false, delete: false })}
          onSubmit={submitUploadFile}
        />
      )}

      {visible.delete && (
        <ModalDeleteConfirmation
          totalSelected={itemsSelected.length}
          visible={visible.delete}
          itemTitle={
            productCategoryData?.data?.find((item: any) => item.key === itemsSelected[0])?.name
          }
          isLoading={loadingDelete}
          onCancel={() => setVisible({ delete: false, upload: false })}
          onOk={() => deleteProductCategory({
            product_category_ids: itemsSelected,
            company_id: [companyCode],
          })}
        />
      )}
    </div>
  );
};

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
`;

const ButtonAction = styled.button`
  background: transparent;
  border: 0;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export default ProductCategory;
