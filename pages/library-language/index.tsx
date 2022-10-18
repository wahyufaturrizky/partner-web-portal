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
  Spin,
  DropdownMenu,
  FileUploadModal,
} from "pink-lava-ui";
import usePagination from "@lucasmogari/react-pagination";
import useDebounce from "../../lib/useDebounce";
import { queryClient } from "../_app";
import { ICDownload, ICUpload } from "../../assets/icons";

import { mdmDownloadService } from "../../lib/client";
import { useRouter } from "next/router";
import ModalManageLanguage from "components/elements/Modal/ModalManageLanguage";
import moment from "moment";
import { useAllLibraryLanguage, useAllLibraryLanguageModule, useUploadLibraryLanguage } from "hooks/mdm/library-language/useLibraryLanguage";

const downloadFile = (params: any) =>
  mdmDownloadService("/library-language/download-template", { params }).then((res) => {
    let dataUrl = window.URL.createObjectURL(new Blob([res.data]));
    let tempLink = document.createElement("a");
    tempLink.href = dataUrl;
    console.log(dataUrl, '<<<<url')
    tempLink.setAttribute("download", `cost_center_${new Date().getTime()}.xlsx`);
    tempLink.click();
  });

const GlobeSVG = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_2877_89608)">
<path d="M12 0C9.62663 0 7.30655 0.703788 5.33316 2.02236C3.35977 3.34094 1.8217 5.21509 0.913451 7.4078C0.00519943 9.60051 -0.232441 12.0133 0.230582 14.3411C0.693605 16.6689 1.83649 18.8071 3.51472 20.4853C5.19295 22.1635 7.33115 23.3064 9.65892 23.7694C11.9867 24.2324 14.3995 23.9948 16.5922 23.0866C18.7849 22.1783 20.6591 20.6402 21.9776 18.6668C23.2962 16.6935 24 14.3734 24 12C23.9966 8.81846 22.7312 5.76821 20.4815 3.51852C18.2318 1.26883 15.1815 0.00344108 12 0V0ZM20.647 7H17.426C16.705 5.32899 15.7556 3.76609 14.605 2.356C17.1515 3.04893 19.3223 4.71747 20.647 7ZM16.5 12C16.4918 13.0181 16.3314 14.0293 16.024 15H7.97601C7.66866 14.0293 7.50821 13.0181 7.50001 12C7.50821 10.9819 7.66866 9.97068 7.97601 9H16.024C16.3314 9.97068 16.4918 10.9819 16.5 12ZM8.77801 17H15.222C14.3732 18.6757 13.2882 20.2208 12 21.588C10.7114 20.2212 9.62625 18.676 8.77801 17ZM8.77801 7C9.62677 5.32427 10.7119 3.77916 12 2.412C13.2886 3.77877 14.3738 5.32396 15.222 7H8.77801ZM9.40001 2.356C8.24767 3.76578 7.29659 5.3287 6.57401 7H3.35301C4.67886 4.71643 6.85166 3.04775 9.40001 2.356ZM2.46101 9H5.90001C5.64076 9.97915 5.50636 10.9871 5.50001 12C5.50636 13.0129 5.64076 14.0209 5.90001 15H2.46101C1.84635 13.0472 1.84635 10.9528 2.46101 9ZM3.35301 17H6.57401C7.29659 18.6713 8.24767 20.2342 9.40001 21.644C6.85166 20.9522 4.67886 19.2836 3.35301 17ZM14.605 21.644C15.7556 20.2339 16.705 18.671 17.426 17H20.647C19.3223 19.2825 17.1515 20.9511 14.605 21.644ZM21.539 15H18.1C18.3592 14.0209 18.4936 13.0129 18.5 12C18.4936 10.9871 18.3592 9.97915 18.1 9H21.537C22.1517 10.9528 22.1517 13.0472 21.537 15H21.539Z" fill="black"/>
</g>
<defs>
<clipPath id="clip0_2877_89608">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>
</svg>
)

const LibraryLanguage = () => {
  const router = useRouter();
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
  const [isShowManageLang, setShowManageLang] = useState(false)

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const debounceSearch = useDebounce(search, 1000);

  const {
    data: libraryLanguageData,
    isLoading: isLoadingLibraryLanguage,
    isFetching: isFetchingLibraryLanguage,
  } = useAllLibraryLanguageModule({
    query: {
      search: debounceSearch,
      page: pagination.page,
      limit: pagination.itemsPerPage,
    },
    options: {
      onSuccess: (data: any) => {
        pagination.setTotalItems(data?.totalRow);
      },
      select: (data: any) => {
        const mappedData = data?.rows?.map((element: any) => {
          return {
            key: element.code,
            code: element.code,
            name: element.name,
            modified_at: element.modified_at? moment(element?.modified_at).format("DD/MM/YYYY") : moment(element?.created_at).format("DD/MM/YYYY") ,
            action: (
              <div style={{ display: "flex", justifyContent: "left" }}>
                <Button
                  size="small"
                  onClick={() => {
                    router.push(`/library-language/${element.code}`);
                  }}
                  variant="tertiary"
                >
                  View Detail
                </Button>
              </div>
            ),
          };
        });
        return { data: mappedData, totalRow: data?.total_row };
      },
    },
  });


  const { mutate: uploadFileLibraryLanguage, isLoading: isLoadingUploadFileLibraryLanguage } = useUploadLibraryLanguage({
    // query: {
    //   with_data: "N",
    //   company_id: libraryLanguageData?.data[0]?.companyId,
    // },
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries(["cost-centers"]);
        setShowUpload(false);
      },
    },
  });

  const columns = [
    {
      title: "Module",
      dataIndex: "name",
      key: 'code',
    },
    {
      title: "Last Update",
      dataIndex: "modified_at",
      key: 'modified_at'
    },
    {
      title: "Action",
      dataIndex: "action",
      width: "15%",
      align: "left",
    },
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
    const formData = new FormData();
    formData.append("company_id", libraryLanguageData?.data[0]?.companyId);
    formData.append("file", file);
    const uploadedData = {
      file: formData,
      company_id: libraryLanguageData?.data[0]?.companyId
    }
    uploadFileLibraryLanguage(formData);
  };

  if(isLoadingLibraryLanguage){
  return (
    <Center>
      <Spin tip="Loading data..." />
    </Center>
  )}

  return (
    <>
      <Col>
        <Text variant={"h4"}>Library Language</Text>
        <Spacer size={20} />
      </Col>
      <Card>
        <Row justifyContent="space-between">
          <Search
            width="340px"
            placeholder="Search Cost Center Code, Cost Center Name, etc"
            onChange={(e: any) => {
              setSearch(e.target.value);
            }}
          />
          <Row gap="16px">
            <DropdownMenu
              title={"More"}
              buttonVariant={"secondary"}
              buttonSize={"big"}
              textVariant={"button"}
              textColor={"pink.regular"}
              iconStyle={{ fontSize: "12px" }}
              onClick={(e: any) => {
                const companyId = libraryLanguageData?.data[0]?.companyId
                switch (parseInt(e.key)) {
                  case 1:
                    downloadFile({ with_data: "N"});
                    break;
                  case 2:
                    setShowUpload(true);
                    break;
                  case 3:
                    downloadFile({ with_data: "Y"});
                    break;
                  case 4:
                    setShowManageLang(true);
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
                {
                  key: 4,
                  value: (
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <GlobeSVG/>
                      <p style={{ margin: "0" }}>Manage Language</p>
                    </div>
                  ),
                },
              ]}
            />
          </Row>
        </Row>
      </Card>
      <Spacer size={10} />
      <Card style={{ padding: "16px 20px" }}>
        <Col gap={"60px"}>
          <Table
            loading={isLoadingLibraryLanguage || isFetchingLibraryLanguage}
            columns={columns}
            data={libraryLanguageData?.data}
            // rowSelection={rowSelection}
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

        <ModalManageLanguage
          visible={isShowManageLang}
          onCancel={() => setShowManageLang(false)}
        />
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

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default LibraryLanguage;
