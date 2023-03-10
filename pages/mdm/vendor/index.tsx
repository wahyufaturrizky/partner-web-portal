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
  Lozenge,
  FileUploadModal,
} from "pink-lava-ui";
import usePagination from "@lucasmogari/react-pagination";
import useDebounce from "lib/useDebounce";
import { STATUS_APPROVAL_TEXT, STATUS_APPROVAL_VARIANT } from "utils/constant";
import { useVendors, useDeleteVendor, useUploadFileVendor } from "hooks/mdm/vendor/useVendor";
import { queryClient } from "pages/_app";
import { ModalDeleteConfirmation } from "components/elements/Modal/ModalConfirmationDelete";
import ModalVendorGroup from "components/elements/Modal/ModalVendorGroup";
import Icon from "@ant-design/icons";
import { useUserPermissions } from "hooks/user-config/usePermission";
import { mdmDownloadService } from "../../../lib/client";
import { ICDownload, ICUpload, ICPackage } from "../../../assets";

const PackageSvg = () => <ICPackage />;

const PackageIcon = (props: any) => <Icon component={PackageSvg} {...props} />;

const downloadFile = (params: any) => mdmDownloadService("/vendor/template/download", { params }).then((res) => {
  const dataUrl = window.URL.createObjectURL(new Blob([res.data]));
  const tempLink = document.createElement("a");
  tempLink.href = dataUrl;
  tempLink.setAttribute("download", `vendor_${new Date().getTime()}.xlsx`);
  tempLink.click();
});

export default function Vendor() {
  const router = useRouter();
  const companyCode:any = localStorage.getItem("companyCode");

  const pagination = usePagination({
    page: 1,
    itemsPerPage: 20,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
  });

  const [search, setSearch] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showVendorGroup, setShowVendorGroup] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const debounceSearch = useDebounce(search, 1000);

  const { data: dataUserPermission } = useUserPermissions({
    options: {
      onSuccess: () => {},
    },
  });

  const listPermission = dataUserPermission?.permission?.filter(
    (filtering: any) => filtering.menu === "Vendor",
  );

  const {
    data: vendorData,
    isLoading: isLoadingVendor,
    isFetching: isFetchingVendor,
  } = useVendors({
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
          key: element.id,
          id: element.code,
          name: element.name,
          type: element.type,
          group: element.groupName,
          status: element.status,
          action: (
            <div style={{ display: "flex", justifyContent: "left" }}>
              <Button
                size="small"
                onClick={() => {
                  router.push(`/mdm/vendor/${element.id}`);
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

  const { mutate: deleteVendor, isLoading: isLoadingDeleteVendor }: any = useDeleteVendor({
    options: {
      onSuccess: () => {
        setShowDelete(false);
        setSelectedRowKeys([]);
        queryClient.invalidateQueries(["vendors"]);
      },
    },
  });

  const { mutate: uploadVendor, isLoading: isLoadingUploadFileVendor }: any = useUploadFileVendor({
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries(["vendors"]);
        setShowUpload(false);
      },
    },
  });

  const columns = [
    {
      title: "Vendor ID",
      dataIndex: "id",
    },
    {
      title: "Vendor Name",
      dataIndex: "name",
    },
    {
      title: "Vendor Type",
      dataIndex: "type",
    },
    {
      title: "Vendor Group",
      dataIndex: "group",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text: any) => (
        <Lozenge variant={STATUS_APPROVAL_VARIANT[text?.toUpperCase()]}>
          {STATUS_APPROVAL_TEXT[text?.toUpperCase()]}
        </Lozenge>
      ),
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
    onChange: (selected: any) => {
      setSelectedRowKeys(selected);
    },
  };

  const onSubmitFile = (file: any) => {
    const formData = new FormData();
    formData.append("upload_file", file);
    formData.append("company_id", companyCode);

    uploadVendor(formData);
  };

  return (
    <>
      <Col>
        <Text variant="h4">Vendor</Text>
        <Spacer size={20} />
      </Col>
      <Card>
        <Row justifyContent="space-between">
          <Search
            width="340px"
            placeholder="Search Vendor Name, Type, Group."
            onChange={(e: any) => {
              setSearch(e.target.value);
            }}
          />
          <Row gap="16px">
            {listPermission?.filter((data: any) => data.viewTypes[0]?.viewType.name === "Delete")
              .length > 0 && (
              <Button
                size="big"
                variant="tertiary"
                onClick={() => setShowDelete(true)}
                disabled={rowSelection.selectedRowKeys?.length === 0}
              >
                Delete
              </Button>
            )}

            <DropdownMenu
              title="More"
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
                    setShowVendorGroup(true);
                    break;
                  default:
                    break;
                }
              }}
              menuList={[
                {
                  ...(listPermission?.filter(
                    (data: any) => data.viewTypes[0]?.viewType.name === "Download Template",
                  ).length > 0 && {
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
                    (data: any) => data.viewTypes[0]?.viewType.name === "Upload",
                  ).length > 0 && {
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
                    (data: any) => data.viewTypes[0]?.viewType.name === "Download Data",
                  ).length > 0 && {
                    key: 3,
                    value: (
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <ICDownload />
                        <p style={{ margin: "0" }}>Download Data</p>
                      </div>
                    ),
                  }),
                },
                {
                  key: 4,
                  value: (
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <PackageIcon style={{ color: "black" }} />
                      <p style={{ margin: "0" }}>Manage Vendor Group</p>
                    </div>
                  ),
                },
              ]}
            />

            {listPermission?.filter((data: any) => data.viewTypes[0]?.viewType.name === "Create")
              .length > 0 && (
              <Button size="big" variant="primary" onClick={() => router.push("/mdm/vendor/create")}>
                Create
              </Button>
            )}
          </Row>
        </Row>
      </Card>
      <Spacer size={10} />
      <Card style={{ padding: "16px 20px" }}>
        <Col gap="60px">
          <Table
            loading={isLoadingVendor || isFetchingVendor}
            columns={columns}
            data={vendorData?.data}
            rowSelection={rowSelection}
          />
          <Pagination pagination={pagination} />
        </Col>
      </Card>

      {showVendorGroup && (
        <ModalVendorGroup
          show={showVendorGroup}
          onCancel={() => {
            setShowVendorGroup(false);
          }}
        />
      )}

      {showDelete && (
        <ModalDeleteConfirmation
          totalSelected={selectedRowKeys.length}
          visible={showDelete}
          itemTitle={vendorData?.data?.find((item: any) => item.key === selectedRowKeys[0])?.name}
          isLoading={isLoadingDeleteVendor}
          onCancel={() => setShowDelete(false)}
          onOk={() => deleteVendor({ ids: selectedRowKeys, company_id: companyCode })}
        />
      )}

      {showUpload && (
        <FileUploadModal visible={showUpload} setVisible={setShowUpload} onSubmit={onSubmitFile} />
      )}
    </>
  );
}

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
`;
