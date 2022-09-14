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
  Switch,
} from "pink-lava-ui";
import usePagination from "@lucasmogari/react-pagination";
import {useDeletTax, useTax, useTaxes, useTaxInfiniteLists, useUploadFileTax} from '../../hooks/mdm/Tax/useTax'
import useDebounce from "../../lib/useDebounce";
import { queryClient } from "../_app";
import { ICDownload, ICUpload } from "../../assets/icons";
import { mdmDownloadService } from "../../lib/client";
import { useRouter } from "next/router";

interface TaxTable { 
  key: string; 
  id: string; 
  taxId: string;
  taxCountryName: string; 
  country_id: string; 
  action: JSX.Element; 
}


const downloadFile = (params: any) =>
  mdmDownloadService("/tax/download", { params }).then((res) => {
    let dataUrl = window.URL.createObjectURL(new Blob([res.data]));
    let tempLink = document.createElement("a");
    tempLink.href = dataUrl;
    tempLink.setAttribute("download", `tax_${new Date().getTime()}.xlsx`);
    tempLink.click();
  });

const renderConfirmationText = (type: any, data: any) => {
  switch (type) {
    case "selection":
      return data.selectedRowKeys.length > 1
        ? `Are you sure to delete ${data.selectedRowKeys.length} items ?`
        : `Are you sure to delete Tax ID - ${data.selectedRowKeys[0]} ?`;
    case "detail":
      return `Are you sure to delete Tax ID - ${data.taskData} ?`;

    default:
      break;
  }
};

const columns = [
  {
    title: "Tax ID",
    dataIndex: "id",
    key: 'id',
  },
  {
    title: "Country",
    dataIndex: "taxCountryName",
    key: 'taxCountryName'
  },
  {
    title: "Action",
    dataIndex: "action",
    width: "15%",
    align: "left",
  },
];


const Tax = () => {
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
  const [modalForm, setModalForm] = useState({
    open: false,
    data: {},
    typeForm: "create",
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const debounceSearch = useDebounce(search, 1000);

  const {
    data: TaxData,
    isLoading: isLoadingTax,
    isFetching: isFetchingTax,
  } = useTaxes({
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
        const mappedData: TaxTable[] = [];
        let n = 1;
        let taxes: any = {}
        data?.rows?.forEach((element: any, i: number) => {
          if(!taxes[element.countryName]) {
            taxes[element.countryName] = 1
            let padded = ('000000'+ n).slice(-7); // Prefix three zeros, and get the last 4 chars
            padded = 'TAX-' + padded
            n++
            mappedData.push({
              key: padded,
              id: padded,
              taxId: element.taxId,
              country_id: element.countryId,
              taxCountryName: element.countryName,
              action: (
                <div style={{ display: "flex", justifyContent: "left" }}>
                  <Button
                    size="small"
                    onClick={() => {
                      router.push(`/tax/${element.countryId}`);
                    }}
                    variant="tertiary"
                  >
                    View Detail
                  </Button>
                </div>
              ),
            })
          }
        });
        return { data: mappedData, totalRow: data.totalRow };
      },
    },
  });

  //   // for delete
  const { mutate: deleteTax, isLoading: isLoadingDeleteTax } = useDeletTax({
    options: {
      onSuccess: () => {
        setShowDelete({ open: false, data: {}, type: "" });
        setSelectedRowKeys([]);
        queryClient.invalidateQueries(["tax-list"]);
      },
    },
  });
  //   // for upload
  const { mutate: uploadFileTax, isLoading: isLoadingUploadFileTax } = useUploadFileTax({
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries(["tax-list"]);
        setShowUpload(false);
      },
    },
  });

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      if(!selectedRowKeys) {
      }
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  const onSubmitFile = (file: any) => {
    const formData = new FormData();
    formData.append("country_id", "MCS-1015213");
    formData.append("file", file);

    uploadFileTax(formData);
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
            placeholder="Search Tax ID, Country"
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
                  data: { taxData: TaxData?.data, selectedRowKeys },
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
                    downloadFile({ with_data: "N", country_id: "MCS-1015213" });
                    break;
                  case 2:
                    setShowUpload(true);
                    break;
                  case 3:
                    downloadFile({ with_data: "Y", country_id: "MCS-1015213" });
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
              onClick={() => router.push("/tax/create")}
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
            loading={isLoadingTax || isFetchingTax}
            columns={columns}
            data={TaxData?.data}
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
                      const deletedData = isShowDelete?.data?.taxData.find(element => element.key === isShowDelete?.data?.selectedRowKeys[0])
                      console.log(isShowDelete?.data?.taxData.find(element => element.key === isShowDelete?.data?.selectedRowKeys[0]), '<<<<<<<')
                      // deleteTax({ ids: selectedRowKeys, country_id: deletedData?.country_id });
                      deleteTax({ ids: [deletedData?.taxId], country_id: deletedData?.country_id });
                    } else {
                      // deleteTax({ ids: [modalForm.data.id], company_id: "MCS-0000001" });
                    }
                  }}
                >
                  {isLoadingDeleteTax ? "loading..." : "Yes"}
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
export default Tax;
