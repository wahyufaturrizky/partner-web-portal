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
  useDepartments,
  useCreateDepartment,
  useUpdateDepartment,
  useUploadFileDepartment,
  useDeleteDepartment,
} from "../../hooks/mdm/department/useDepartment";
import useDebounce from "../../lib/useDebounce";
import { queryClient } from "../_app";
import { useForm } from "react-hook-form";
import { ICDownload, ICUpload } from "../../assets/icons";
import { mdmDownloadService } from "../../lib/client";
import { lang } from "lang";

const JobPosition = () => {
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

  const downloadFile = (params: any) =>
    mdmDownloadService("/department/download", { params }).then((res) => {
      let dataUrl = window.URL.createObjectURL(new Blob([res.data]));
      let tempLink = document.createElement("a");
      tempLink.href = dataUrl;
      tempLink.setAttribute("download", `department_${new Date().getTime()}.xlsx`);
      tempLink.click();
    });

  const renderConfirmationText = (type: any, data: any) => {
    switch (type) {
      case "selection":
        return data.selectedRowKeys.length > 1
          ? `${lang[t].department.areYouSureToDelete} ${data.selectedRowKeys.length} items ?`
          : `${lang[t].department.areYouSureToDelete} ${
              data?.departmentData?.data.find((el: any) => el.key === data.selectedRowKeys[0])?.name
            } ?`;
      case "detail":
        return `${lang[t].department.areYouSureToDelete} ${data.name} ?`;

      default:
        break;
    }
  };

  const {
    data: departmentsData,
    isLoading: isLoadingDepartments,
    isFetching: isFetchingDepartments,
  } = useDepartments({
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
            key: element.departmentId,
            id: element.departmentId,
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
                  {lang[t].department.tertier.viewDetail}
                </Button>
              </div>
            ),
          };
        });

        return { data: mappedData, totalRow: data.totalRow };
      },
    },
  });

  const { mutate: createDepartment, isLoading: isLoadingCreateDepartment } = useCreateDepartment({
    options: {
      onSuccess: () => {
        setModalForm({ open: false, typeForm: "", data: {} });
        queryClient.invalidateQueries(["departments"]);
      },
    },
  });

  const { mutate: updateDepartment, isLoading: isLoadingUpdateDepartment } = useUpdateDepartment({
    id: modalForm?.data?.departmentId,
    companyId: companyCode,
    options: {
      onSuccess: () => {
        setModalForm({ open: false, typeForm: "", data: {} });
        queryClient.invalidateQueries(["departments"]);
      },
    },
  });

  const { mutate: deleteDepartment, isLoading: isLoadingDeleteDepartment } = useDeleteDepartment({
    options: {
      onSuccess: () => {
        setShowDelete({ open: false, data: {}, type: "" });
        setModalForm({ open: false, data: {}, typeForm: "" });
        setSelectedRowKeys([]);
        queryClient.invalidateQueries(["departments"]);
      },
    },
  });

  const { mutate: uploadFileDepartment, isLoading: isLoadingUploadFileDepartment } =
    useUploadFileDepartment({
      options: {
        onSuccess: () => {
          queryClient.invalidateQueries(["departments"]);
          setShowUpload(false);
        },
      },
    });

  const columns = [
    {
      title: lang[t].department.departmentID,
      dataIndex: "id",
    },
    {
      title: lang[t].department.departmentName,
      dataIndex: "name",
    },
    {
      title: lang[t].department.action,
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
        createDepartment(formData);
        break;
      case "edit":
        updateDepartment(data);
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

    uploadFileDepartment(formData);
  };

  return (
    <>
      <Col>
        <Text variant={"h4"}>{lang[t].department.title}</Text>
        <Spacer size={20} />
      </Col>
      <Card>
        <Row justifyContent="space-between">
          <Search
            width="360px"
            placeholder={lang[t].department.palceholderSearch}
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
                  data: { departmentData: departmentsData, selectedRowKeys },
                })
              }
              disabled={rowSelection.selectedRowKeys?.length === 0}
            >
              {lang[t].department.tertier.delete}
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
                      <p style={{ margin: "0" }}>{lang[t].department.ghost.downloadTemplate}</p>
                    </div>
                  ),
                },
                {
                  key: 2,
                  value: (
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <ICUpload />
                      <p style={{ margin: "0" }}>{lang[t].department.ghost.uploadTemplate}</p>
                    </div>
                  ),
                },
                {
                  key: 3,
                  value: (
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <ICDownload />
                      <p style={{ margin: "0" }}>{lang[t].department.ghost.downloadData}</p>
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
              {lang[t].department.primary.create}
            </Button>
          </Row>
        </Row>
      </Card>
      <Spacer size={10} />
      <Card style={{ padding: "16px 20px" }}>
        <Col gap={"60px"}>
          <Table
            loading={isLoadingDepartments || isFetchingDepartments}
            columns={columns}
            data={departmentsData?.data}
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
          title={modalForm.typeForm === "create" ? "Create Department" : modalForm?.data?.name}
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
                label={lang[t].department.departmentName}
                height="48px"
                placeholder={"e.g Marketing"}
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
                    variant={"tertiary"}
                    key="submit"
                    type="primary"
                    onClick={() => setModalForm({ open: false, data: {}, typeForm: "" })}
                  >
                    {lang[t].department.tertier.cancel}
                  </Button>
                ) : (
                  <Button
                    full
                    size="big"
                    variant={"tertiary"}
                    key="submit"
                    type="primary"
                    onClick={() => {
                      setShowDelete({ open: true, type: "detail", data: modalForm.data });
                    }}
                  >
                    {lang[t].department.tertier.delete}
                  </Button>
                )}

                <Button full onClick={handleSubmit(onSubmit)} variant="primary" size="big">
                  {isLoadingCreateDepartment || isLoadingUpdateDepartment
                    ? "Loading..."
                    : lang[t].department.primary.save}
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
          title={lang[t].department.confirmDelete}
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
                  {lang[t].department.tertier.cancel}
                </Button>
                <Button
                  variant="primary"
                  size="big"
                  onClick={() => {
                    if (isShowDelete.type === "selection") {
                      deleteDepartment({ ids: selectedRowKeys, company_id: companyCode });
                    } else {
                      deleteDepartment({ ids: [modalForm.data.departmentId], company_id: companyCode });
                    }
                  }}
                >
                  {isLoadingDeleteDepartment ? "loading..." : lang[t].department.primary.yes}
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

export default JobPosition;
