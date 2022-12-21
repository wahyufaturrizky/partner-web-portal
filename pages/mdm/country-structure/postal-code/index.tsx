import usePagination from "@lucasmogari/react-pagination";
import {
  Button,
  Col,
  Pagination,
  Row,
  Search,
  Spacer,
  Table,
  Text,
  DropdownMenu,
  FileUploadModal,
  Spin,
  DropdownMenuOptionGroupCustom,
} from "pink-lava-ui";
import React, { useState } from "react";
import styled from "styled-components";

import DownloadSvg from "../../../assets/icons/ic-download.svg";
import UploadSvg from "../../../assets/icons/ic-upload.svg";
import { ModalCreatePostalCode } from "../../../../components/elements/Modal/ModalCreatePostalCode";
import { ModalDeleteConfirmation } from "../../../../components/elements/Modal/ModalConfirmationDelete";
import { ModalDetailPostalCode } from "../../../../components/elements/Modal/ModalDetailPostalCode";
import {
  useDeletePostalCode,
  usePostalCodes,
  useUploadFilePostalCodesMDM,
  usePostalCodesFilter,
} from "../../../../hooks/mdm/postal-code/usePostalCode";

import useDebounce from "lib/useDebounce";
import { mdmDownloadService } from "lib/client";
import { queryClient } from "pages/_app";
import { lang } from "lang";
import { useUserPermissions } from "hooks/user-config/usePermission";

const downloadFile = (params: any) =>
  mdmDownloadService("/postal-code/download", { params }).then((res) => {
    let dataUrl = window.URL.createObjectURL(new Blob([res.data]));
    let tempLink = document.createElement("a");
    tempLink.href = dataUrl;
    tempLink.setAttribute("download", `postal_code_${new Date().getTime()}.xlsx`);
    tempLink.click();
  });

const CountryPostalCode = () => {
  const t = localStorage.getItem("lan") || "en-US";
  const pagination = usePagination({
    page: 1,
    itemsPerPage: 20,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
  });
  const companyCode = localStorage.getItem("companyCode");
  const [modalDelete, setModalDelete] = useState({ open: false });
  const [isShowUpload, setShowUpload] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [filterCountry, setFilterCountry] = useState("");
  const [modalCreate, setModalCreate] = useState({ open: false });
  const [modalDetail, setModalDetail] = useState<any>({ open: false, dataDetail: null });
  const [listCountry, setListCountry] = useState([]);
  const debounceSearch = useDebounce(search, 1000);
  const debounceFilter = useDebounce(filterCountry, 1000);

  const { data: dataUserPermission } = useUserPermissions({
    options: {
      onSuccess: () => {},
    },
  });

  const listPermission = dataUserPermission?.permission?.filter(
    (filtering: any) => filtering.menu === "Postal Code"
  );

  const columns = [
    {
      title: lang[t].postalCode.postalCodeID,
      dataIndex: "postal_code",
    },
    {
      title: lang[t].postalCode.postalCode,
      dataIndex: "postal_code_id",
    },
    {
      title: lang[t].postalCode.postalCountryName,
      dataIndex: "country_name",
    },
    ...(listPermission?.some((el: any) => el.viewTypes[0]?.viewType.name === "View")
      ? [
          {
            title: lang[t].postalCode.postalAction,
            dataIndex: "action",
          },
        ]
      : []),
  ];

  const { isLoading: isLoadingFilter } = usePostalCodesFilter({
    query: {},
    options: {
      onSuccess: (data: any) => {
        const mappingFilter = data?.map((el: any) => {
          return {
            label: el.name,
            value: el.id,
          };
        });
        setListCountry(mappingFilter);
      },
    },
  });

  const {
    data: postalCodeData,
    isLoading: isLoadingPostalCode,
    isRefetching: isRefetchingPostalCode,
    refetch: refetchPostalCode,
  } = usePostalCodes({
    query: {
      search: debounceSearch,
      country: debounceFilter,
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
            key: element.id,
            postal_code_id: element?.codeText,
            postal_code: element?.code,
            country_name: element?.countryRecord?.name,
            action: (
              <Button
                size="small"
                onClick={() => setModalDetail({ open: true, dataDetail: element })}
                variant="tertiary"
              >
                {lang[t].postalCode.tertier.viewDetail}
              </Button>
            ),
          };
        });

        return { data: mappedData, totalRow: data.totalRow };
      },
    },
  });

  const onSelectChange = (selectedRowKeys: any) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const onChangeFilterPostalCode = (filter: any) => {
    setFilterCountry(filter?.join(","));
  };

  const onHandleClear = () => {
    setFilterCountry("");
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const { mutate: mutateDeletePostalCode }: any = useDeletePostalCode({
    options: {
      onSuccess: () => {
        refetchPostalCode();
        setModalDelete({ open: false });
        setSelectedRowKeys([]);
      },
    },
  });

  const listFilterCountry = [
    {
      label: "By Country",
      list: listCountry,
    },
  ];

  const { mutate: uploadFilePostalCodesMDM }: any = useUploadFilePostalCodesMDM({
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries(["postal-code"]);
        setShowUpload(false);
      },
    },
  });

  const onSubmitFile = (file: any) => {
    const formData = new FormData();
    formData.append("upload_file", file);

    uploadFilePostalCodesMDM(formData);
  };

  return (
    <>
      <Col>
        <Text variant={"h4"}>{lang[t].postalCode.pageTitle.postalCode}</Text>
        <Spacer size={20} />
        <Card className="">
          <Row justifyContent="space-between">
            <Row gap="16px">
              <Search
                width="380px"
                nameIcon="SearchOutlined"
                placeholder={lang[t].postalCode.searchBar.postalCode}
                onChange={({ target }: React.ChangeEvent<HTMLInputElement>) =>
                  setSearch(target.value)
                }
              />
              {isLoadingFilter ? (
                <Spin tip={""} />
              ) : (
                <DropdownMenuOptionGroupCustom
                  showArrow={true}
                  showSearch={false}
                  showClearButton
                  handleClearValue={onHandleClear}
                  handleChangeValue={onChangeFilterPostalCode}
                  listItems={listFilterCountry}
                  label=""
                  width={194}
                  roundedSelector={true}
                  defaultValue={""}
                  placeholder="Country"
                />
              )}
            </Row>
            <Row gap="16px">
              {listPermission?.filter((data: any) => data.viewTypes[0]?.viewType.name === "Delete") && (
                <Button
                  size="big"
                  variant="tertiary"
                  onClick={() => setModalDelete({ open: true })}
                  disabled={!(selectedRowKeys.length > 0)}
                >
                  {lang[t].postalCode.tertier.delete}
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
                      ).length > 0  && {
                        key: 1,
                        value: (
                          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                            <DownloadSvg />
                            <p style={{ margin: "0" }}>
                              {lang[t].postalCode.ghost.downloadTemplate}
                            </p>
                          </div>
                        ),
                      }),
                    },
                    {
                      ...(listPermission?.filter(
                        (data: any) => data.viewTypes[0]?.viewType.name === "Upload"
                      ).length > 0 && {
                        key: 2,
                        value: (
                          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                            <UploadSvg />
                            <p style={{ margin: "0" }}>{lang[t].postalCode.ghost.uploadTemplate}</p>
                          </div>
                        ),
                      }),
                    },
                    {
                      ...(listPermission?.filter(
                        (data: any) => data.viewTypes[0]?.viewType.name === "Download Data"
                      ).length > 0 && {
                        key: 3,
                        value: (
                          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                            <DownloadSvg />
                            <p style={{ margin: "0" }}>{lang[t].postalCode.ghost.downloadData}</p>
                          </div>
                        ),
                      }),
                    },
                  ]}
                />
              )}

              {listPermission?.filter((data: any) => data.viewTypes[0]?.viewType.name === "Create")
							.length > 0 && (
                <Button size="big" variant="primary" onClick={() => setModalCreate({ open: true })}>
                  {lang[t].postalCode.primary.create}
                </Button>
              )}
            </Row>
          </Row>
        </Card>
        <Spacer size={10} />
        <Card>
          <Col gap="60px">
            <Table
              loading={isLoadingPostalCode || isRefetchingPostalCode}
              rowSelection={rowSelection}
              columns={columns}
              data={postalCodeData?.data}
            />
            <Pagination pagination={pagination} />
          </Col>
        </Card>
      </Col>

      {modalDelete.open && (
        <ModalDeleteConfirmation
          totalSelected={selectedRowKeys?.length}
          itemTitle={
            postalCodeData?.data?.find((menu: any) => menu.key === selectedRowKeys[0])?.country_name
          }
          visible={modalDelete.open}
          onCancel={() => setModalDelete({ open: false })}
          onOk={() => mutateDeletePostalCode({ ids: selectedRowKeys })}
        />
      )}

      {modalCreate.open && (
        <ModalCreatePostalCode
          visible={modalCreate.open}
          onCancel={() => setModalCreate({ open: false })}
          refetchPostalCode={refetchPostalCode}
        />
      )}

      {modalDetail.open && (
        <ModalDetailPostalCode
          dataModal={modalDetail.dataDetail}
          visible={modalDetail.open}
          onCancel={() => setModalDetail({ open: false })}
          efetchPostalCode={refetchPostalCode}
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

export default CountryPostalCode;
