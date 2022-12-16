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
import { useDeletUOMConversion, useUOMConversions, useUploadFileUOMConversion } from "../../hooks/mdm/unit-of-measure-conversion/useUOMConversion";
import useDebounce from "../../lib/useDebounce";
import { queryClient } from "../_app";
import { ICDownload, ICUpload } from "../../assets/icons";
import { mdmDownloadService } from "../../lib/client";
import { useRouter } from "next/router";
import { useUserPermissions } from "hooks/user-config/usePermission";

const downloadFile = (params: any) =>
  mdmDownloadService("/uom-conversion/download", { params }).then((res) => {
    let dataUrl = window.URL.createObjectURL(new Blob([res.data]));
    let tempLink = document.createElement("a");
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
            data?.uomData?.find((el: any) => el.id === data.selectedRowKeys[0])?.name
          } ?`;
    case "detail":
      return `Are you sure to delete Uom Name ${data.uomName} ?`;

    default:
      break;
  }
};

const UOMConversion = () => {
  const router = useRouter();
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

  const { data: dataUserPermission } = useUserPermissions({
    options: {
      onSuccess: () => {},
    },
  });

  const listPermission = dataUserPermission?.permission?.filter(
    (filtering: any) => filtering.menu === "UoM Conversion"
  );

  const {
    data: UOMConversionData,
    isLoading: isLoadingUOM,
    isFetching: isFetchingUOM,
  } = useUOMConversions({
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
            key: element.conversionId,
            id: element.conversionId,
            name: element.name,
            action: (
              <div style={{ display: "flex", justifyContent: "left" }}>
                <Button
                  size="small"
                  onClick={() => {
                    router.push(`/unit-of-measure-conversion/${element.conversionId}`);
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

  const { mutate: deleteUom, isLoading: isLoadingDeleteUom } = useDeletUOMConversion({
    options: {
      onSuccess: () => {
        setShowDelete({ open: false, data: {}, type: "" });
        setSelectedRowKeys([]);
        queryClient.invalidateQueries(["uom-conversions"]);
      },
    },
  });

  const { mutate: uploadFileUom, isLoading: isLoadingUploadFileUom } = useUploadFileUOMConversion({
    query: {
      with_data: "N",
      company_id: companyCode,
    },
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries(["uom-conversions"]);
        setShowUpload(false);
      },
    },
  });

  const columns = [
    {
      title: "UoM Conversion ID",
      dataIndex: "id",
      key: 'id',
    },
    {
      title: "Uom Conversion Name",
      dataIndex: "name",
      key: 'name'
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
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      if(!selectedRowKeys) {
      }
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  const onSubmitFile = (file: any) => {
    const formData: any = new FormData();
    formData.append("company_id", companyCode);
    formData.append("file", file);
    uploadFileUom(formData);
  };

  return (
    <>
      <Col>
        <Text variant={"h4"}>UoM Conversion</Text>
        <Spacer size={20} />
      </Col>
      <Card>
        <Row justifyContent="space-between">
          <Search
            width="340px"
            placeholder="Search UoM Conversion ID, Name"
            onChange={(e: any) => {
              setSearch(e.target.value);
            }}
          />
          <Row gap="16px">
          {listPermission?.filter((data: any) => data.viewTypes[0]?.viewType.name === "Delete")
							.length > 0  && (
                <Button
                size="big"
                variant={"tertiary"}
                onClick={() =>
                  setShowDelete({
                    open: true,
                    type: "selection",
                    data: { uomData: UOMConversionData?.data, selectedRowKeys },
                  })
                }
                disabled={rowSelection.selectedRowKeys?.length === 0}
              >
                Delete
              </Button>
              )}

          {(listPermission?.filter(
							(data: any) => data.viewTypes[0]?.viewType.name === "Download Template"
						).length > 0 ||
							listPermission?.filter(
								(data: any) => data.viewTypes[0]?.viewType.name === "Download Data"
							).length > 0 ||
							listPermission?.filter((data: any) => data.viewTypes[0]?.viewType.name === "Upload")
								.length > 0) && (
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
                          (data: any) => data.viewTypes[0]?.viewType.name === "Download Template"
                        ).length > 0 &&  {
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
                          (data: any) => data.viewTypes[0]?.viewType.name === "Upload"
                        ).length > 0 &&   {
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
                          (data: any) => data.viewTypes[0]?.viewType.name === "Download Data"
                        ).length > 0 &&  {
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
                  <Button
                  size="big"
                  variant="primary"
                  onClick={() => router.push("/unit-of-measure-conversion/create")}
                >
                  Create
                </Button>
              )}
           
          </Row>
        </Row>
      </Card>
      <Spacer size={10} />
      <Card style={{ padding: "16px 20px" }}>
        <Col gap={"60px"}>
          <Table
            loading={isLoadingUOM || isFetchingUOM}
            columns={columns}
            data={UOMConversionData?.data}
            rowSelection={rowSelection}
            rowKey={"id"}
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
            <TopButtonHolder>
              <Spacer size={4} />
              {renderConfirmationText(isShowDelete.type, isShowDelete.data)}
              <Spacer size={20} />
              <DeleteCardButtonHolder>
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
              </DeleteCardButtonHolder>
            </TopButtonHolder>
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

const DeleteCardButtonHolder = styled.div`
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 20px;
`

const TopButtonHolder = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`
export default UOMConversion;
