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
import { ICDownload, ICUpload } from "../../assets";
import { ModalDeleteConfirmation } from "../../components/elements/Modal/ModalConfirmationDelete";
import { mdmDownloadService } from "../../lib/client";
import {
  useDeleteProductCategory,
  useProductCategoryList,
  useUploadFileProductCategory,
} from "hooks/mdm/product-category/useProductCategory";
import useDebounce from "../../lib/useDebounce";

const ProductCategory = () => {
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
    {
      title: "Action",
      dataIndex: "action",
      width: "15%",
    },
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
    },
    options: {
      onSuccess: (data: any) => {
        pagination.setTotalItems(data.totalRow);
      },
      select: (data: any) => {
        const mappedData = data?.rows?.map((element: any) => {
          return {
            key: element.productCategoryId,
            id: element.productCategoryId,
            name: element.name,
            parent: element.parent || "-",
            action: (
              <div style={{ display: "flex", justifyContent: "left" }}>
                <Button
                  size="small"
                  onClick={() => {
                    router.push(`/product-category/${element.productCategoryId}`);
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

  const { mutate: deleteProductCategory, isLoading: loadingDelete }: any = useDeleteProductCategory(
    {
      options: {
        onSuccess: () => {
          setItemsSelected([]);
          setVisible({ upload: false, delete: false });
          refetchProductCategory();
        },
      },
    }
  );

  const actDrowpdown = [
    {
      key: 1,
      value: (
        <ButtonAction onClick={() => handleDownloadFile({ with_data: "N" })}>
          <ICDownload />
          <p style={{ margin: "0" }}>Download Template</p>
        </ButtonAction>
      ),
    },
    {
      key: 2,
      value: (
        <ButtonAction onClick={() => setVisible({ upload: true, delete: false })} >
          <ICUpload />
          <p style={{ margin: "0" }}>Upload Template</p>
        </ButtonAction>
      ),
    },
    {
      key: 3,
      value: (
        <ButtonAction onClick={() => handleDownloadFile({ with_data: "Y" })}>
          <ICDownload />
          <p style={{ margin: "0" }}>Download Data</p>
        </ButtonAction>
      ),
    },
  ];

  const rowSelection = {
    itemsSelected,
    onChange: (selected: any) => {
      setItemsSelected(selected);
    },
  };

  const handleDownloadFile = (params) => {
    mdmDownloadService(`/product-category/download?company_id=KSNI`, { params }).then((res) => {
      let dataUrl = window.URL.createObjectURL(new Blob([res?.data]));
      let tempLink = document.createElement("a");
      tempLink.href = dataUrl;
      tempLink.setAttribute("download", `product-category ${new Date().getTime()}.xlsx`);
      tempLink.click();
    });
  };

  const { mutate: uploadFileProductCategory } = useUploadFileProductCategory({
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
        <Text variant={"h4"}>Product Category</Text>
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
            <Button
              size="big"
              variant={"tertiary"}
              onClick={() => setVisible({ upload: false, delete: true })}
              disabled={itemsSelected?.length < 1}
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
              //   onClick={({ key }: any) => key === '1' && handleDownloadFile()}
              menuList={actDrowpdown}
            />
            <Button
              size="big"
              variant="primary"
              onClick={() => router.push("/product-category/create")}
            >
              Create
            </Button>
          </Row>
        </Row>
      </Card>
      <Spacer size={20} />
      <Card style={{ padding: "16px 20px" }}>
        <Col gap={"60px"}>
          <Table
            loading={isLoadingProductCategory}
            columns={columns}
            data={productCategoryData?.data}
            rowSelection={rowSelection}
          />
          <Pagination pagination={pagination} />
        </Col>
      </Card>

      <FileUploadModal
        visible={visible.upload}
        setVisible={() => setVisible({ upload: false, delete: false })}
        onSubmit={submitUploadFile}
      />

      <ModalDeleteConfirmation
        totalSelected={itemsSelected.length}
        visible={visible.delete}
        itemTitle={
          productCategoryData?.data?.find((item: any) => item.key === itemsSelected[0])?.name
        }
        isLoading={loadingDelete}
        onCancel={() => setVisible({ delete: false, upload: false })}
        onOk={() => deleteProductCategory({ product_category_ids: itemsSelected, company_id: ["KSNI"] })}
      />
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
