import usePagination from "@lucasmogari/react-pagination";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import {
  Button,
  Col,
  DropdownMenu,
  FileUploadModal,
  Input,
  Modal,
  Pagination,
  Row,
  Search,
  Spacer,
  Table,
  Text,
  Dropdown,
  Spin,
} from "pink-lava-ui";
import { queryClient } from "../../_app";
import { ICDownload, ICUpload } from "../../../assets";
import { mdmDownloadService } from "../../../lib/client";
import useDebounce from "../../../lib/useDebounce";
import {
  useCreateCustomerGroupMDM,
  useCustomerGroupsMDM,
  useDeleteCustomerGroupMDM,
  useParentCustomerGroupMDM,
  useUpdateCustomerGroupMDM,
  useUploadFileCustomerGroupMDM,
} from "../../../hooks/mdm/customers/useCustomersGroupMDM";
import { lang } from "lang";

const downloadFile = (params: any) =>
  mdmDownloadService("/customer-group/download", { params }).then((res) => {
    let dataUrl = window.URL.createObjectURL(new Blob([res.data]));
    let tempLink = document.createElement("a");
    tempLink.href = dataUrl;
    tempLink.setAttribute("download", `customer-group_${new Date().getTime()}.xlsx`);
    tempLink.click();
  });

const renderConfirmationText = (type: any, data: any) => {
  switch (type) {
    case "selection":
      return data.selectedRowKeys.length > 1
        ? `Are you sure to delete ${data.selectedRowKeys.length} items ?`
        : `By deleting it will affect data that already uses customer group ${data?.customerGroupData?.data.find((el: any) => el.key === data.selectedRowKeys[0])
          ?.name
        }-${data?.customerGroupData?.data.find((el: any) => el.key === data.selectedRowKeys[0])
          ?.customerGroupCode
        }`;
    case "detail":
      return `By deleting it will affect data that already uses customer group ${data.name}-${data.customerGroupCode}`;

    default:
      break;
  }
};

const CustomerGroupMDM = () => {
  const t = localStorage.getItem("lan") || "en-US";
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
  const [isShowDelete, setShowDelete] = useState({ open: false, type: "selection", data: {} });
  const [isShowUpload, setShowUpload] = useState(false);
  const [modalCustomerGroupForm, setModalCustomerGroupForm] = useState({
    open: false,
    data: {},
    typeForm: "create",
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const debounceSearch = useDebounce(search, 1000);

  const { register, handleSubmit, setValue } = useForm({
    defaultValues: { parent: "" },
  });

  const {
    data: customerGroupsMDMData,
    isLoading: isLoadingCustomerGroupsMDM,
    isFetching: isFetchingCustomerGroupsMDM,
  } = useCustomerGroupsMDM({
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
        const mappedData = data?.rows?.map((element: any) => {
          return {
            key: element.id,
            id: element.id,
            customerGroupCode: element.code,
            name: element.name,
            parent: element.parent,
            company: element.company,
            action: (
              <div style={{ display: "flex", justifyContent: "left" }}>
                <Button
                  size="small"
                  onClick={() => router.push(`/customers/group/${element.id}`)}
                  variant="tertiary"
                >
                  {lang[t].customerGroup.tertier.viewDetail}
                </Button>
              </div>
            ),
          };
        });

        return { data: mappedData, totalRow: data.totalRow };
      },
    },
  });

  const { mutate: createCustomerGroupMDM, isLoading: isLoadingCreateCustomerGroupMDM } =
    useCreateCustomerGroupMDM({
      options: {
        onSuccess: () => {
          setModalCustomerGroupForm({ open: false, typeForm: "", data: {} });
          queryClient.invalidateQueries(["customer-group"]);
        },
      },
    });

  const { mutate: updateCustomerGrouMDM, isLoading: isLoadingUpdateCustomerGroupMDM } =
    useUpdateCustomerGroupMDM({
      id: modalCustomerGroupForm.data?.id,
      options: {
        onSuccess: () => {
          setModalCustomerGroupForm({ open: false, typeForm: "", data: {} });
          queryClient.invalidateQueries(["customer-group"]);
        },
      },
    });

  const { data: dataParentCustomerGroupMDM, isLoading: isLoadingParentCustomerGroupMDM } =
    useParentCustomerGroupMDM({id: modalCustomerGroupForm.data?.id ?? 0 + "/KSNI"});

  const { mutate: deleteCustomerGroupMDM, isLoading: isLoadingDeleteCustomerGroupMDM } =
    useDeleteCustomerGroupMDM({
      options: {
        onSuccess: () => {
          setShowDelete({ open: false, data: {}, type: "" });
          setModalCustomerGroupForm({ open: false, data: {}, typeForm: "" });
          setSelectedRowKeys([]);
          queryClient.invalidateQueries(["customer-group"]);
        },
      },
    });

  const { mutate: uploadFileCustomerGroupMDM } = useUploadFileCustomerGroupMDM({
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries(["customer-group"]);
        setShowUpload(false);
      },
    },
  });

  const columns = [
    {
      title: lang[t].customerGroup.customergroupID,
      dataIndex: "customerGroupCode",
    },
    {
      title: lang[t].customerGroup.customergroupName,
      dataIndex: "name",
    },
    {
      title: lang[t].customerGroup.customergroupParent,
      dataIndex: "parent",
    },
    {
      title: "Company",
      dataIndex: "company",
    },
    {
      title: lang[t].customerGroup.customergroupAction,
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
    switch (modalCustomerGroupForm.typeForm) {
      case "create":
        createCustomerGroupMDM({ ...data, company: "KSNI" });
        break;
      case "edit":
        updateCustomerGrouMDM({ ...data, company: "KSNI" });
        break;
      default:
        setModalCustomerGroupForm({ open: false, typeForm: "", data: {} });
        break;
    }
  };

  const onSubmitFile = (file: any) => {
    const formData = new FormData();
    formData.append("upload_file", file);

    uploadFileCustomerGroupMDM(formData);
  };

  return (
    <>
      <Col>
        <Text variant={"h4"}>{lang[t].customerGroup.pageTitle.customergroup}</Text>
        <Spacer size={20} />
      </Col>
      <Card>
        <Row justifyContent="space-between">
          <Search
            width="340px"
            placeholder={lang[t].customerGroup.searchBar.customergroup}
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
                  data: { customerGroupData: customerGroupsMDMData, selectedRowKeys },
                })
              }
              disabled={rowSelection.selectedRowKeys?.length === 0}
            >
              {lang[t].customerGroup.tertier.delete}
            </Button>
            <DropdownMenu
              title={lang[t].customerGroup.secondary.more}
              buttonVariant={"secondary"}
              buttonSize={"big"}
              textVariant={"button"}
              textColor={"pink.regular"}
              iconStyle={{ fontSize: "12px" }}
              onClick={(e: any) => {
                switch (parseInt(e.key)) {
                  case 1:
                    downloadFile({ with_data: "N", company: "KSNI" });
                    break;
                  case 2:
                    setShowUpload(true);
                    break;
                  case 3:
                    downloadFile({ with_data: "Y", company: "KSNI" });
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
                      <p style={{ margin: "0" }}>{lang[t].customerGroup.ghost.downloadTemplate}</p>
                    </div>
                  ),
                },
                {
                  key: 2,
                  value: (
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <ICUpload />
                      <p style={{ margin: "0" }}>{lang[t].customerGroup.ghost.uploadTemplate}</p>
                    </div>
                  ),
                },
                {
                  key: 3,
                  value: (
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <ICDownload />
                      <p style={{ margin: "0" }}>{lang[t].customerGroup.ghost.downloadData}</p>
                    </div>
                  ),
                },
              ]}
            />
            <Button
              size="big"
              variant="primary"
              onClick={() =>
                setModalCustomerGroupForm({ open: true, typeForm: "create", data: {} })
              }
            >
              {lang[t].customerGroup.primary.create}
            </Button>
          </Row>
        </Row>
      </Card>
      <Spacer size={10} />
      <Card style={{ padding: "16px 20px" }}>
        <Col gap={"60px"}>
          <Table
            loading={isLoadingCustomerGroupsMDM || isFetchingCustomerGroupsMDM}
            columns={columns.filter((filtering) => filtering.dataIndex !== "company")}
            data={customerGroupsMDMData?.data}
            rowSelection={rowSelection}
          />
          <Pagination pagination={pagination} />
        </Col>
      </Card>

      {modalCustomerGroupForm.open && (
        <Modal
          width={"350px"}
          centered
          closable={false}
          visible={modalCustomerGroupForm.open}
          onCancel={() => setModalCustomerGroupForm({ open: false, data: {}, typeForm: "" })}
          title={lang[t].customerGroup.pageTitle.customergroup}
          footer={null}
          content={
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Input
                width="100%"
                label={lang[t].customerGroup.customergroupName}
                height="48px"
                required
                placeholder={"e.g RTL-Retail Large"}
                {...register("name", {
                  shouldUnregister: true,
                })}
              />
              <Spacer size={14} />
              {isLoadingParentCustomerGroupMDM ? (
                <Spin tip="Loading data..." />
              ) : (
                <>
                  <Dropdown
                    label={lang[t].customerGroup.customergroupParent}
                    isOptional
                    width="100%"
                    items={dataParentCustomerGroupMDM.map((data) => ({
                      value: data.name,
                      id: data.code,
                    }))}
                    placeholder={"Select"}
                    handleChange={(text) => setValue("parent", text)}
                    noSearch
                  />

                  <Spacer size={14} />
                </>
              )}

              <Input
                width="100%"
                label={lang[t].customerGroup.emptyState.code}
                height="48px"
                required
                placeholder={"e.g 400000"}
                {...register("external_code", {
                  shouldUnregister: true,
                })}
              />

              <Spacer size={14} />

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
                  variant={"tertiary"}
                  key="submit"
                  type="primary"
                  onClick={() => setModalCustomerGroupForm({ open: false, data: {}, typeForm: "" })}
                >
                  {lang[t].customerGroup.tertier.cancel}
                </Button>

                <Button onClick={handleSubmit(onSubmit)} variant="primary" size="big">
                  {isLoadingCreateCustomerGroupMDM || isLoadingUpdateCustomerGroupMDM
                    ? "Loading..."
                    : lang[t].customerGroup.primary.save}
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
          title={"Confirm Delete"}
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
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="big"
                  onClick={() => {
                    if (isShowDelete.type === "selection") {
                      deleteCustomerGroupMDM({
                        ids: selectedRowKeys,
                      });
                    } else {
                      deleteCustomerGroupMDM({
                        ids: [modalCustomerGroupForm.data.id],
                      });
                    }
                  }}
                >
                  {isLoadingDeleteCustomerGroupMDM ? "loading..." : "Yes"}
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

export default CustomerGroupMDM;
