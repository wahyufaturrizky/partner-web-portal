import usePagination from "@lucasmogari/react-pagination";
import {
  Button,
  Col,
  Dropdown,
  Pagination,
  Row,
  Search,
  Spacer,
  Table,
  Text,
  DropdownMenu,
  FileUploadModal,
} from "pink-lava-ui";
import React, { useState } from "react";
import styled from "styled-components";

import DownloadSvg from "../../../assets/icons/ic-download.svg";
import UploadSvg from "../../../assets/icons/ic-upload.svg";
import SyncSvg from "../../../assets/icons/ic-sync.svg";

import { ModalCreatePostalCode } from "../../../components/elements/Modal/ModalCreatePostalCode";
import { ModalDeleteConfirmation } from "../../../components/elements/Modal/ModalConfirmationDelete";
import { ModalDetailPostalCode } from "../../../components/elements/Modal/ModalDetailPostalCode";
import {
  useDeletePostalCode,
  usePostalCodes,
  useUploadFilePostalCodesMDM,
} from "../../../hooks/mdm/postal-code/usePostalCode";

import useDebounce from "lib/useDebounce";
import { mdmDownloadService } from "lib/client";
import { queryClient } from "pages/_app";
import { useCountries } from "hooks/company-list/useCompany";

const downloadFile = (params: any) =>
  mdmDownloadService("/postal-code/download", { params }).then((res) => {
    let dataUrl = window.URL.createObjectURL(new Blob([res.data]));
    let tempLink = document.createElement("a");
    tempLink.href = dataUrl;
    tempLink.setAttribute("download", `postal_code_${new Date().getTime()}.xlsx`);
    tempLink.click();
  });

const CountryPostalCode = () => {
  const pagination = usePagination({
    page: 1,
    itemsPerPage: 20,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
  });
  const [selectedCountry, setSelectedCountry] = useState("");
  const [searchCountry, setSearchCountry] = useState("");
  const [modalDelete, setModalDelete] = useState({ open: false });
  const [isShowUpload, setShowUpload] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [modalCreate, setModalCreate] = useState({ open: false });
  const [modalDetail, setModalDetail] = useState({ open: false, dataDetail: null });

  const debounceSearch = useDebounce(search, 1000);
  const debounceSearchCountry = useDebounce(searchCountry, 1000);

  const columns = [
    {
      title: "Postal Code ID",
      dataIndex: "postal_code_id",
    },
    {
      title: "Postal Code",
      dataIndex: "postal_code",
    },
    {
      title: "Country Name",
      dataIndex: "country_name",
    },
    {
      title: "Action",
      dataIndex: "action",
    },
  ];

  const { data: countries, isLoading: isLoadingCountries } = useCountries({
    options: {
      onSuccess: () => {},
    },
    query: {
      search: debounceSearchCountry,
    },
  });

  const dataCountries: any = [];
  countries?.rows?.map((item: any) => {
    dataCountries.push({
      id: item?.id,
      value: item?.name,
    });
  });

  const {
    data: fields,
    isLoading,
    refetch: refetchPostalCode,
  } = usePostalCodes({
    options: {
      onSuccess: (data: any) => {
        pagination.setTotalItems(data?.totalRow);
      },
    },
    query: {
      search: debounceSearch,
      page: pagination.page,
      limit: pagination.itemsPerPage,
      country: selectedCountry,
    },
  });

  const data: any = [];
  fields?.rows?.map((field: any) => {
    data.push({
      key: field.id,
      postal_code_id: field?.code,
      postal_code: field?.country,
      country_name: field?.countryRecord?.name,
      action: (
        <Button
          size="small"
          onClick={() => setModalDetail({ open: true, dataDetail: field })}
          variant="tertiary"
        >
          View Detail
        </Button>
      ),
    });
  });

  const paginateField = data;

  const onSelectChange = (selectedRowKeys: any) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const { mutate: mutateDeletePostalCode } = useDeletePostalCode({
    options: {
      onSuccess: () => {
        refetchPostalCode();
        setModalDelete({ open: false });
      },
    },
  });

  const { mutate: uploadFilePostalCodesMDM } = useUploadFilePostalCodesMDM({
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
        <Text variant={"h4"}>Postal Code</Text>
        <Spacer size={20} />
        <Card className="">
          <Row justifyContent="space-between">
            <Row gap="16px">
              <Search
                width="380px"
                nameIcon="SearchOutlined"
                placeholder="Search Postal Code ID. Postal Code, etc"
                onChange={({ target }: React.ChangeEvent<HTMLInputElement>) =>
                  setSearch(target.value)
                }
              />
              <Dropdown
                width="200px"
                allowClear
                items={dataCountries}
                placeholder={"Country"}
                noSearch
                rounded
                loading={isLoadingCountries}
                handleChange={(value: any) => setSelectedCountry(value)}
                onSearch={(search: any) => setSearch(search)}
              />
            </Row>
            <Row gap="16px">
              <Button
                size="big"
                variant="tertiary"
                onClick={() => setModalDelete({ open: true })}
                disabled={!(selectedRowKeys.length > 0)}
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
                      downloadFile({ with_data: "N" });
                      break;
                    case 2:
                      setShowUpload(true);
                      break;
                    case 3:
                      downloadFile({ with_data: "Y" });
                      break;
                    case 4:
                      refetchPostalCode();
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
                        <DownloadSvg />
                        <p style={{ margin: "0" }}>Download Template</p>
                      </div>
                    ),
                  },
                  {
                    key: 2,
                    value: (
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <UploadSvg />
                        <p style={{ margin: "0" }}>Upload Template</p>
                      </div>
                    ),
                  },
                  {
                    key: 3,
                    value: (
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <DownloadSvg />
                        <p style={{ margin: "0" }}>Download Data</p>
                      </div>
                    ),
                  },
                  {
                    key: 4,
                    value: (
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <SyncSvg />
                        <p style={{ margin: "0" }}>Sync Data</p>
                      </div>
                    ),
                  },
                ]}
              />
              <Button size="big" variant="primary" onClick={() => setModalCreate({ open: true })}>
                Create
              </Button>
            </Row>
          </Row>
        </Card>
        <Spacer size={10} />
        <Card>
          <Col gap="60px">
            <Table
              loading={isLoading}
              rowSelection={rowSelection}
              columns={columns}
              data={data || []}
            />
            <Pagination pagination={pagination} />
          </Col>
        </Card>
      </Col>

      <ModalDeleteConfirmation
        totalSelected={selectedRowKeys?.length}
        itemTitle={
          paginateField?.find((menu: any) => menu.key === selectedRowKeys[0])?.country_name
        }
        visible={modalDelete.open}
        onCancel={() => setModalDelete({ open: false })}
        onOk={() => mutateDeletePostalCode({ ids: selectedRowKeys })}
      />

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
