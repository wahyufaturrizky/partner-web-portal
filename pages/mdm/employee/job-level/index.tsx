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
import { useForm } from "react-hook-form";
import { lang } from "lang";
import { useUserPermissions } from "hooks/user-config/usePermission";
import {
  useJobLevels,
  useCreateJobLevel,
  useUpdateJobLevel,
  useUploadFileJobLevel,
  useDeleteJobLevel,
} from "../../../../hooks/mdm/job-level/useJobLevel";
import useDebounce from "../../../../lib/useDebounce";
import { queryClient } from "../../../_app";
import { ICDownload, ICUpload } from "../../../../assets/icons";
import { mdmDownloadService } from "../../../../lib/client";

const JobPosition = () => {
  const t = localStorage.getItem("lan") || "en-US";
  const companyId = localStorage.getItem("companyId");
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

  const { data: dataUserPermission } = useUserPermissions({
    options: {
      onSuccess: () => {},
    },
  });

  const listPermission = dataUserPermission?.permission?.filter(
    (filtering: any) => filtering.menu === "Job Level",
  );

  const downloadFile = (params: any) => mdmDownloadService("/job-level/download", { params }).then((res) => {
    const dataUrl = window.URL.createObjectURL(new Blob([res.data]));
    const tempLink = document.createElement("a");
    tempLink.href = dataUrl;
    tempLink.setAttribute("download", `job_level_${new Date().getTime()}.xlsx`);
    tempLink.click();
  });

  const renderConfirmationText = (type: any, data: any) => {
    switch (type) {
      case "selection":
        return data.selectedRowKeys.length > 1
          ? `${lang[t].jobLevel.areYouSureToDelete} ${data.selectedRowKeys.length} items ?`
          : `${lang[t].jobLevel.areYouSureToDelete} ${
            data?.jobLevelData?.data.find((el: any) => el.key === data.selectedRowKeys[0])?.name
          } ?`;
      case "detail":
        return `${lang[t].jobLevel.areYouSureToDelete} ${data.name} ?`;

      default:
        break;
    }
  };

  const {
    data: jobLevelsData,
    isLoading: isLoadingJobLevels,
    isFetching: isFetchingJobLevels,
  } = useJobLevels({
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
          key: element.jobLevelId,
          id: element.jobLevelId,
          name: element.name,
          action: (
            <div style={{ display: "flex", justifyContent: "left" }}>
              <Button
                size="small"
                onClick={() => {
                  setModalForm({ open: true, typeForm: "edit", data: element });
                }}
                variant="tertiary"
              >
                {lang[t].jobLevel.tertier.viewDetail}
              </Button>
            </div>
          ),
        }));

        return { data: mappedData, totalRow: data.totalRow };
      },
    },
  });

  const { mutate: createJobLevel, isLoading: isLoadingCreateJobLevel } = useCreateJobLevel({
    options: {
      onSuccess: () => {
        setModalForm({ open: false, typeForm: "", data: {} });
        queryClient.invalidateQueries(["job-levels"]);
      },
    },
  });

  const { mutate: updateJobLevel, isLoading: isLoadingUpdateJobLevel } = useUpdateJobLevel({
    id: modalForm?.data?.jobLevelId,
    companyId: companyCode,
    options: {
      onSuccess: () => {
        setModalForm({ open: false, typeForm: "", data: {} });
        queryClient.invalidateQueries(["job-levels"]);
      },
    },
  });

  const { mutate: deleteJobLevel, isLoading: isLoadingDeleteJobLevel } = useDeleteJobLevel({
    options: {
      onSuccess: () => {
        setShowDelete({ open: false, data: {}, type: "" });
        setModalForm({ open: false, data: {}, typeForm: "" });
        setSelectedRowKeys([]);
        queryClient.invalidateQueries(["job-levels"]);
      },
    },
  });

  const { mutate: uploadFileJobLevel, isLoading: isLoadingUploadFileJobLevel } = useUploadFileJobLevel({
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries(["job-levels"]);
        setShowUpload(false);
      },
    },
  });

  const columns = [
    {
      title: lang[t].jobLevel.jobLevelId,
      dataIndex: "id",
    },
    {
      title: lang[t].jobLevel.jobLevelName,
      dataIndex: "name",
    },
    ...(listPermission?.some((el: any) => el.viewTypes[0]?.viewType.name === "View")
      ? [
        {
          title: lang[t].jobLevel.action,
          dataIndex: "action",
          width: "15%",
          align: "left",
        },
      ]
      : []),
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
        createJobLevel(formData);
        break;
      case "edit":
        updateJobLevel(data);
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

    uploadFileJobLevel(formData);
  };

  return (
    <>
      <Col>
        <Text variant="h4">{lang[t].jobLevel.title}</Text>
        <Spacer size={20} />
      </Col>
      <Card>
        <Row justifyContent="space-between">
          <Search
            width="360px"
            placeholder={lang[t].jobLevel.palceholderSearch}
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
                onClick={() => setShowDelete({
                  open: true,
                  type: "selection",
                  data: { jobLevelData: jobLevelsData, selectedRowKeys },
                })}
                disabled={rowSelection.selectedRowKeys?.length === 0}
              >
                {lang[t].jobLevel.tertier.delete}
              </Button>
            )}

            {(listPermission?.filter(
              (data: any) => data.viewTypes[0]?.viewType.name === "Download Template",
            ).length > 0
							|| listPermission?.filter(
							  (data: any) => data.viewTypes[0]?.viewType.name === "Download Data",
							).length > 0
							|| listPermission?.filter((data: any) => data.viewTypes[0]?.viewType.name === "Upload")
							  .length > 0) && (
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
            <p style={{ margin: "0" }}>{lang[t].jobLevel.ghost.downloadTemplate}</p>
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
            <p style={{ margin: "0" }}>{lang[t].jobLevel.ghost.uploadTemplate}</p>
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
            <p style={{ margin: "0" }}>{lang[t].jobLevel.ghost.downloadData}</p>
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
                onClick={() => setModalForm({ open: true, typeForm: "create", data: {} })}
              >
                {lang[t].jobLevel.primary.create}
              </Button>
            )}
          </Row>
        </Row>
      </Card>
      <Spacer size={10} />
      <Card style={{ padding: "16px 20px" }}>
        <Col gap="60px">
          <Table
            loading={isLoadingJobLevels || isFetchingJobLevels}
            columns={columns}
            data={jobLevelsData?.data}
            rowSelection={rowSelection}
          />
          <Pagination pagination={pagination} />
        </Col>
      </Card>

      {modalForm.open && (
        <Modal
          width="420px"
          centered
          visible={modalForm.open}
          onCancel={() => setModalForm({ open: false, data: {}, typeForm: "" })}
          title={
            modalForm.typeForm === "create" ? lang[t].jobLevel.createJobLevel : modalForm.data?.name
          }
          footer={null}
          content={(
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
                label={lang[t].jobLevel.jobLevelName}
                height="48px"
                placeholder="e.g Manager"
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
                    full
                    size="big"
                    variant="tertiary"
                    key="submit"
                    type="primary"
                    onClick={() => setModalForm({ open: false, data: {}, typeForm: "" })}
                  >
                    {lang[t].jobLevel.tertier.cancel}
                  </Button>
                ) : (
                  <Button
                    full
                    size="big"
                    variant="tertiary"
                    key="submit"
                    type="primary"
                    onClick={() => {
                      setShowDelete({ open: true, type: "detail", data: modalForm.data });
                    }}
                  >
                    {lang[t].jobLevel.tertier.delete}
                  </Button>
                )}

                <Button full onClick={handleSubmit(onSubmit)} variant="primary" size="big">
                  {isLoadingCreateJobLevel || isLoadingUpdateJobLevel
                    ? "Loading..."
                    : lang[t].jobLevel.primary.save}
                </Button>
              </div>
            </div>
          )}
        />
      )}

      {isShowDelete.open && (
        <Modal
          closable={false}
          centered
          visible={isShowDelete.open}
          onCancel={() => setShowDelete({ open: false, type: "", data: {} })}
          title={lang[t].jobLevel.confirmDelete}
          footer={null}
          content={(
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
                      deleteJobLevel({ ids: selectedRowKeys, company_id: companyCode });
                    } else {
                      deleteJobLevel({ ids: [modalForm.data.jobLevelId], company_id: companyCode });
                    }
                  }}
                >
                  {isLoadingDeleteJobLevel ? "loading..." : "Yes"}
                </Button>
              </div>
            </div>
          )}
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

export default JobPosition;
