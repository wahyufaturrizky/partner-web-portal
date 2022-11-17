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
  Input,
  DropdownMenu,
  FileUploadModal,
} from "pink-lava-ui";
import usePagination from "@lucasmogari/react-pagination";
import {
  useUOMCategories,
  useCreateUOMCategory,
  useUpdateUOMCategory,
  useUploadFileUOMCategory,
  useDeletUOMCategory,
} from "../../hooks/mdm/unit-of-measure-category/useUOMCategory";
import useDebounce from "../../lib/useDebounce";
import { queryClient } from "../_app";
import { useForm } from "react-hook-form";
import { ICDownload, ICUpload } from "../../assets/icons";
import { mdmDownloadService } from "../../lib/client";
import { lang } from "lang";

const downloadFile = (params: any) =>
  mdmDownloadService("/uom-category/download", { params }).then((res) => {
    let dataUrl = window.URL.createObjectURL(new Blob([res.data]));
    let tempLink = document.createElement("a");
    tempLink.href = dataUrl;
    tempLink.setAttribute("download", `uom_category_${new Date().getTime()}.xlsx`);
    tempLink.click();
  });

const renderConfirmationText = (type: any, data: any) => {
  switch (type) {
    case "selection":
      return data.selectedRowKeys.length > 1
        ? `Are you sure to delete ${data.selectedRowKeys.length} items ?`
        : `Are you sure to delete Uom Category Name ${
            data?.uomCategoryData?.data.find((el: any) => el.key === data.selectedRowKeys[0])
              ?.uomCategoryName
          } ?`;
    case "detail":
      return `Are you sure to delete Uom Category Name ${data.uomCategoryName} ?`;

    default:
      break;
  }
};

const UOMCategory = () => {
  const t = localStorage.getItem("lan") || "en-US";
  const companyId = localStorage.getItem("companyId")
  const companyCode = localStorage.getItem("companyCode")
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

  const { register, handleSubmit } = useForm();

  const {
    data: UOMCategoriesData,
    isLoading: isLoadingUOMCategories,
    isFetching: isFetchingUOMCategories,
  } = useUOMCategories({
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
        const mappedData = data?.rows?.map((element: any) => {
          return {
            key: element.uomCategoryId,
            id: element.uomCategoryId,
            uomCategoryName: element.name,
            action: (
              <div style={{ display: "flex", justifyContent: "left" }}>
                <Button
                  size="small"
                  onClick={() => {
                    setModalForm({ open: true, typeForm: "edit", data: element });
                  }}
                  variant="tertiary"
                >
                  {lang[t].uomCategory.tertier.viewDetail}
                </Button>
              </div>
            ),
          };
        });

        return { data: mappedData, totalRow: data.totalRow };
      },
    },
  });

  const { mutate: createUomCategory, isLoading: isLoadingCreateUomCategory } = useCreateUOMCategory(
    {
      options: {
        onSuccess: () => {
          setModalForm({ open: false, typeForm: "", data: {} });
          queryClient.invalidateQueries(["uom-categories"]);
        },
      },
    }
  );

  const { mutate: updateUomCategory, isLoading: isLoadingUpdateUomCategory } = useUpdateUOMCategory(
    {
      id: modalForm?.data?.uomCategoryId,
      companyId: companyCode,
      options: {
        onSuccess: () => {
          setModalForm({ open: false, typeForm: "", data: {} });
          queryClient.invalidateQueries(["uom-categories"]);
        },
      },
    }
  );

  const { mutate: deleteUomCategory, isLoading: isLoadingDeleteUomCategory } = useDeletUOMCategory({
    options: {
      onSuccess: () => {
        setShowDelete({ open: false, data: {}, type: "" });
        setModalForm({ open: false, data: {}, typeForm: "" });
        setSelectedRowKeys([]);
        queryClient.invalidateQueries(["uom-categories"]);
      },
    },
  });

  const { mutate: uploadFileUomCategory, isLoading: isLoadingUploadFileUomCategory } =
    useUploadFileUOMCategory({
      options: {
        onSuccess: () => {
          queryClient.invalidateQueries(["uom-categories"]);
          setShowUpload(false);
        },
      },
    });

  const columns = [
    {
      title: lang[t].uomCategory.uoMCategoryID,
      dataIndex: "id",
    },
    {
      title: lang[t].uomCategory.uoMCategoryName,
      dataIndex: "uomCategoryName",
    },
    {
      title: lang[t].uomCategory.uoMCategoryAction,
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

  const onSubmit = (data: any) => {
    switch (modalForm.typeForm) {
      case "create":
        const formData = {
          company_id: companyCode,
          ...data,
        };
        createUomCategory(formData);
        break;
      case "edit":
        updateUomCategory(data);
        break;
      default:
        setModalForm({ open: false, typeForm: "", data: {} });
        break;
    }
  };

  const onSubmitFile = (file: any) => {
    const formData = new FormData();
    formData.append("company_id", companyCode);
    formData.append("file", file);

    uploadFileUomCategory(formData);
  };

  return (
    <>
      <Col>
        <Text variant={"h4"}>{lang[t].uomCategory.pageTitle.uoMCategory}</Text>
        <Spacer size={20} />
      </Col>
      <Card>
        <Row justifyContent="space-between">
          <Search
            width="340px"
            placeholder={lang[t].uomCategory.searchBar.uoMCategory}
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
                  data: { uomCategoryData: UOMCategoriesData, selectedRowKeys },
                })
              }
              disabled={rowSelection.selectedRowKeys?.length === 0}
            >
              {lang[t].uomCategory.tertier.delete}
            </Button>
            <DropdownMenu
              title={lang[t].uomCategory.secondary.more}
              buttonVariant={"secondary"}
              buttonSize={"big"}
              textVariant={"button"}
              textColor={"pink.regular"}
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
              onClick={() => setModalForm({ open: true, typeForm: "create", data: {} })}
            >
              {lang[t].uomCategory.primary.create}
            </Button>
          </Row>
        </Row>
      </Card>
      <Spacer size={10} />
      <Card style={{ padding: "16px 20px" }}>
        <Col gap={"60px"}>
          <Table
            loading={isLoadingUOMCategories || isFetchingUOMCategories}
            columns={columns}
            data={UOMCategoriesData?.data}
            rowSelection={rowSelection}
          />
          <Pagination pagination={pagination} />
        </Col>
      </Card>

      {modalForm.open && (
        <Modal
          width={"420px"}
          centered
          visible={modalForm.open}
          onCancel={() => setModalForm({ open: false, data: {}, typeForm: "" })}
          title={modalForm.typeForm === "create" ? lang[t].uomCategory.modalTitleCreate.uoMCategory : lang[t].uomCategory.modalTitleUpdate.uoMCategory}
          footer={null}
          content={
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                marginTop: "12px",
              }}
            >
              <Input
                defaultValue={modalForm.data?.name}
                width="100%"
                label={lang[t].uomCategory.uoMCategoryName}
                height="48px"
                placeholder={"e.g Weight"}
                {...register("name", {
                  shouldUnregister: true,
                })}
              />
              <Spacer size={30} />
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                  marginBottom: "20px",
                }}
              >
                {modalForm.typeForm === "create" ? (
                  <Button
                    size="big"
                    variant={"tertiary"}
                    key="submit"
                    type="primary"
                    full
                    onClick={() => setModalForm({ open: false, data: {}, typeForm: "" })}
                  >
                    Cancel
                  </Button>
                ) : (
                  <Button
                    size="big"
                    variant={"tertiary"}
                    key="submit"
                    type="primary"
                    full
                    onClick={() => {
                      setShowDelete({ open: true, type: "detail", data: modalForm.data });
                    }}
                  >
                    {lang[t].uomCategory.tertier.delete}
                  </Button>
                )}

                <Button full onClick={handleSubmit(onSubmit)} variant="primary" size="big">
                  {isLoadingCreateUomCategory || isLoadingUpdateUomCategory ? "Loading..." : lang[t].uomCategory.primary.save}
                </Button>
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
                      deleteUomCategory({ ids: selectedRowKeys, company_id: companyCode });
                    } else {
                      deleteUomCategory({
                        ids: [modalForm.data.uomCategoryId],
                        company_id: companyCode,
                      });
                    }
                  }}
                >
                  {isLoadingDeleteUomCategory ? "loading..." : "Yes"}
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

export default UOMCategory;
