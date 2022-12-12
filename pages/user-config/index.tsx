import React, { useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import usePagination from "@lucasmogari/react-pagination";
import {
  Text,
  Button,
  Col,
  Row,
  Spacer,
  Search,
  Table,
  Pagination,
  DropdownMenu,
  Lozenge,
  FileUploadModal,
} from "pink-lava-ui";
import DownloadSvg from "assets/icons/ic-download.svg";
import UploadSvg from "assets/icons/ic-upload.svg";
import { ModalDeleteConfirmation } from "components/elements/Modal/ModalConfirmationDelete";
import { useUsers, useDeleteUser, useUploadFileUserConfig } from "hooks/user-config/useUser";
import { STATUS_APPROVAL_VARIANT, STATUS_APPROVAL_TEXT } from "utils/constant";
import { lang } from "lang";
import useDebounce from "lib/useDebounce";
import { clientDownloadService } from "lib/client";
import { queryClient } from "pages/_app";
import { useUserPermissions } from "hooks/user-config/usePermission";
import { permissionSequenceNumber } from "permission/sequenceNumber";

const UserConfigUser: any = () => {
  const router = useRouter();
  const t = localStorage.getItem("lan") || "en-US";
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
  const [modalDelete, setModalDelete] = useState({ open: false });
  const [isShowUpload, setShowUpload] = useState(false);
  const debounceSearch = useDebounce(search, 1000);

  const { data: dataUserPermission } = useUserPermissions({
    options: {
      onSuccess: () => {},
    },
  });

  const listPermission = dataUserPermission?.permission?.filter(
    (filtering: any) => filtering.menu === "Sequence Number"
  );

  const allowPermissionToShow = listPermission?.filter((data: any) =>
    permissionSequenceNumber.role[dataUserPermission?.role?.name].component.includes(data.name)
  );


  const {
    data: users,
    refetch: refetchFields,
    isLoading: isLoadingField,
  } = useUsers({
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
            key: element.id,
            name: element.fullname,
            email: element.email,
            role: element?.userRole?.name,
            status: element.status,
            action: (
              <Button
                size="small"
                onClick={() => router.push(`/user-config/${element.id}`)}
                variant="tertiary"
              >
                {lang[t].userList.list.button.detail}
              </Button>
            ),
          };
        });

        return { data: mappedData, totalRow: data.totalRow };
      },
    },
  });

  const { mutate: deleteFields } = useDeleteUser({
    options: {
      onSuccess: () => {
        refetchFields();
        setModalDelete({ open: false });
        setSelectedRowKeys([]);
      },
    },
  });

  const { mutate: uploadFileUserConfig, isLoading: isLoadingUploadFileTrainingType } =
    useUploadFileUserConfig({
      options: {
        onSuccess: () => {
          queryClient.invalidateQueries(["users"]);
          setShowUpload(false);
        },
      },
    });

  const columns = [
    {
      title: lang[t].userList.list.table.employeeId,
      dataIndex: "key",
    },
    {
      title: lang[t].userList.list.table.name,
      dataIndex: "name",
    },
    {
      title: lang[t].userList.list.table.status,
      dataIndex: "status",
      render: (text: any) => (
        <Lozenge variant={STATUS_APPROVAL_VARIANT[text]}>{STATUS_APPROVAL_TEXT[text]}</Lozenge>
      ),
    },
    ...(allowPermissionToShow?.some((el: any) => el.name === "View Sequence Number")
    ? [
        {
          title: lang[t].userList.list.table.action,
          dataIndex: "action",
          width: "20%",
        },
      ]
    : []),

  ];

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const onSelectChange = (selectedRowKeys: any) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const downloadFile = (params: any) =>
    clientDownloadService("/partner-user/download", { params }).then((res) => {
      let dataUrl = window.URL.createObjectURL(new Blob([res.data]));
      let tempLink = document.createElement("a");
      tempLink.href = dataUrl;
      tempLink.setAttribute("download", `user_config_${new Date().getTime()}.xlsx`);
      tempLink.click();
    });

  const onSubmitFile = (file: any) => {
    const formData = new FormData();
    formData.append("file", file);

    uploadFileUserConfig(formData);
  };

  return (
    <>
      <Col>
        <Text variant={"h4"}>{lang[t].userList.list.headerTitle}</Text>
        <Spacer size={20} />
        <Card>
          <Row justifyContent="space-between">
            <Search
              width="380px"
              placeholder={lang[t].userList.list.field.searchBar}
              onChange={(e: any) => setSearch(e.target.value)}
            />
            <Row gap="16px">
            {allowPermissionToShow
                ?.map((data: any) => data.name)
                ?.includes("Delete Postal Code") && (
                <Button
                  size="big"
                  variant={"tertiary"}
                  onClick={() => setModalDelete({ open: true })}
                  disabled={rowSelection.selectedRowKeys?.length === 0}
                >
                  {lang[t].userList.list.button.delete}
                </Button>
              )}

              {(allowPermissionToShow
                ?.map((data: any) => data.name)
                ?.includes("Download Template Sequence Number") ||
                allowPermissionToShow
                  ?.map((data: any) => data.name)
                  ?.includes("Download Data Sequence Number") ||
                allowPermissionToShow
                  ?.map((data: any) => data.name)
                  ?.includes("Upload Sequence Number")) && (
                    <DropdownMenu
                    title={lang[t].userList.list.button.more}
                    buttonVariant="secondary"
                    buttonSize="big"
                    textVariant="button"
                    textColor="pink.regular"
                    iconStyle={{ fontSize: "12px" }}
                    onClick={(e: any) => {
                      switch (parseInt(e.key)) {
                        case 1:
                          downloadFile({ with_data: "N" });
                          break;
                        case 2:
                          setShowUpload(true);
                          break;
    
                        default:
                          break;
                      }
                    }}
                    menuList={[
                      {
                        ...(allowPermissionToShow
                          ?.map((data: any) => data.name)
                          ?.includes("Download Template Sequence Number") &&  {
                            key: 1,
                            value: (
                              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                <DownloadSvg />
                                <p style={{ margin: "0" }}>{lang[t].userList.list.button.download}</p>
                              </div>
                            ),
                          }),
                      },
                      {
                        ...(allowPermissionToShow
                          ?.map((data: any) => data.name)
                          ?.includes("Upload Sequence Number") &&   {
                            key: 2,
                            value: (
                              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                <UploadSvg />
                                <p style={{ margin: "0" }}>{lang[t].userList.list.button.upload}</p>
                              </div>
                            ),
                          }),
                      },
                    ]}
                  />
                  )}
             
             {allowPermissionToShow
                ?.map((data: any) => data.name)
                ?.includes("Create Postal Code") && (
                  <Button
                  size="big"
                  variant={"primary"}
                  onClick={() => router.push("/user-config/create")}
                >
                  {lang[t].userList.list.button.create}
                </Button>
              )}
              
            </Row>
          </Row>
        </Card>
        <Spacer size={10} />
        <Card style={{ padding: "16px 20px" }}>
          <Col gap="60px">
            <Table
              loading={isLoadingField}
              columns={columns}
              data={users?.data}
              rowSelection={rowSelection}
            />
            <Pagination pagination={pagination} />
          </Col>
        </Card>
      </Col>

      {modalDelete.open && (
        <ModalDeleteConfirmation
          totalSelected={selectedRowKeys.length}
          itemTitle={users?.data?.find((user: any) => user.key === selectedRowKeys[0])?.name}
          visible={modalDelete.open}
          onCancel={() => setModalDelete({ open: false })}
          onOk={() => deleteFields({ ids: selectedRowKeys })}
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

export default UserConfigUser;
