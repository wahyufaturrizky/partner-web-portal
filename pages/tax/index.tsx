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
import {useCountryTaxes, useDeletTax, useTaxes, useTaxInfiniteLists, useUploadFileTax} from '../../hooks/mdm/Tax/useTax'
import useDebounce from "../../lib/useDebounce";
import { queryClient } from "../_app";
import { ICDownload, ICUpload } from "../../assets/icons";
import { mdmDownloadService } from "../../lib/client";
import { useRouter } from "next/router";
import { useUserPermissions } from "hooks/user-config/usePermission";
import { permissionTax } from "permission/tax";

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

const Tax = () => {
  const router = useRouter();
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
  const [isShowUpload, setShowUpload] = useState(false);

  const debounceSearch = useDebounce(search, 1000);

  const { data: dataUserPermission } = useUserPermissions({
    options: {
      onSuccess: () => {},
    },
  });

  const listPermission = dataUserPermission?.permission?.filter(
    (filtering: any) => filtering.menu === "Tax"
  );

  const allowPermissionToShow = listPermission?.filter((data: any) =>
    permissionTax.role[dataUserPermission?.role?.name].component.includes(data.name)
  );

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
    ...(allowPermissionToShow?.some((el: any) => el.name === "View Tax")
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

  const {
    data: TaxData,
    isLoading: isLoadingTax,
    isFetching: isFetchingTax,
  } = useTaxInfiniteLists({
    query: {
      search: debounceSearch,
      page: pagination.page,
      limit: pagination.itemsPerPage,
      company_id: companyCode,
    },
    options: {
      onSuccess: (data: any) => {
        pagination.setTotalItems(data?.totalRow);
      },
      select: (data: any) => {
        const mappedData: TaxTable[] = [];
        let n = 1;
        let taxes: any = {}
        data?.pages[0]?.rows?.forEach((element: any, i: number) => {
          if(!taxes[element.country?.name]) {
            taxes[element.country?.name] = 1
            let padded = ('000000'+ n).slice(-7); // Prefix three zeros, and get the last 4 chars
            padded = 'TAX-' + padded
            n++
            mappedData.push({
              key: element.taxId,
              id: element.taxId,
              taxId: element.taxId,
              country_id: element.countryId,
              taxCountryName: element.country?.name,
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

  //   // for upload
  const { mutate: uploadFileTax, isLoading: isLoadingUploadFileTax } = useUploadFileTax({
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries(["tax-list"]);
        setShowUpload(false);
      },
    },
  });


  const onSubmitFile = (file: any) => {
    const formData = new FormData();
    formData.append("country_id", "MCS-1015213");
    formData.append("file", file);

    uploadFileTax(formData);
  };

  return (
    <>
      <Col>
        <Text variant={"h4"}>Tax</Text>
        <Spacer size={20} />
      </Col>
      <Card>
        <Row justifyContent="space-between">
          <Search
            width="340px"
            placeholder="Search Tax ID, Country"
            onChange={(e: any) => {setSearch(e.target.value)}}
          />
          <Row gap="16px">
          {(allowPermissionToShow
              ?.map((data: any) => data.name)
              ?.includes("Download Template Tax") ||
              allowPermissionToShow
                ?.map((data: any) => data.name)
                ?.includes("Download Data Tax") ||
              allowPermissionToShow
                ?.map((data: any) => data.name)
                ?.includes("Upload Tax")) && (
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
                            downloadFile({ with_data: "N", country_id: "MCS-1015229" });
                            break;
                          case 2:
                            setShowUpload(true);
                            break;
                          case 3:
                            downloadFile({ with_data: "Y", country_id: "MCS-1015229" });
                            break;
                          case 4:
                            break;
                          default:
                            break;
                        }
                      }}
                      menuList={[
                        {
                          ...(allowPermissionToShow
                            ?.map((data: any) => data.name)
                            ?.includes("Download Template Tax") &&    {
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
                          ...(allowPermissionToShow
                            ?.map((data: any) => data.name)
                            ?.includes("Upload Tax") &&   {
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
                        ...(allowPermissionToShow
                          ?.map((data: any) => data.name)
                          ?.includes("Download Data Tax") &&   {
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
            rowKey={"id"}
          />
          <Pagination pagination={pagination} />
        </Col>
      </Card>

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

const TopButtonHolder = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`
export default Tax;
