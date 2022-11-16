import usePagination from "@lucasmogari/react-pagination";
import { useJobPositions } from "hooks/mdm/job-position/useJobPositon";
import { useRouter } from "next/router";
import {
  Button,
  Col,
  DropdownMenu,
  FileUploadModal,
  Modal,
  Pagination,
  Row,
  Search,
  Spacer,
  Table,
  Text,
  DropdownMenuOptionGroupCustom,
  Spin,
} from "pink-lava-ui";
import { useState } from "react";
import styled from "styled-components";
import { ICDownload, ICUpload } from "../../assets/icons";
import {
  useDeleteEmployeeListMDM,
  useEmployeeListsMDM,
  useUploadFileEmployeeListMDM,
} from "../../hooks/mdm/employee-list/useEmployeeListMDM";
import { mdmDownloadService } from "../../lib/client";
import useDebounce from "../../lib/useDebounce";
import { queryClient } from "../_app";

const downloadFile = (params: any) =>
  mdmDownloadService("/employee/template/download", { params }).then((res) => {
    let dataUrl = window.URL.createObjectURL(new Blob([res.data]));
    let tempLink = document.createElement("a");
    tempLink.href = dataUrl;
    tempLink.setAttribute("download", `employee_list_${new Date().getTime()}.xlsx`);
    tempLink.click();
  });

const renderConfirmationText = (type: any, data: any) => {
  switch (type) {
    case "selection":
      return data.selectedRowKeys.length > 1
        ? `Are you sure to delete ${data.selectedRowKeys.length} employee ID ?`
        : `Are you sure to delete employee name ${
            data?.employeeListData?.data.find((el: any) => el.key === data.selectedRowKeys[0])?.name
          } ?`;
    case "detail":
      return `Are you sure to delete employee name ${data.name} ?`;

    default:
      break;
  }
};

const EmployeeList = () => {
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
  const [filterJobPosition, setFilterJobPosition] = useState("");
  const [filterTypeJob, setFilterTypeJob] = useState("");
  const debounceFilterJobPosition = useDebounce(filterJobPosition, 1000);
  const debounceFiltefilterTypeJob = useDebounce(filterTypeJob, 1000);
  const [modalForm, setModalForm] = useState({
    open: false,
    data: {},
    typeForm: "create",
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const debounceSearch = useDebounce(search, 1000);

  const {
    data: employeeListData,
    isLoading: isLoadingEmployeeList,
    isFetching: isFetchinggEmployeeList,
  } = useEmployeeListsMDM({
    query: {
      search: debounceSearch,
      page: pagination.page,
      limit: pagination.itemsPerPage,
      company: "KSNI",
      position: debounceFilterJobPosition,
      type: debounceFiltefilterTypeJob,
    },
    options: {
      onSuccess: (data: any) => {
        pagination.setTotalItems(data.totalRow);
      },
      select: (data: any) => {
        const mappedData = data?.rows?.map((element: any) => {
          return {
            key: element.code,
            id: element.code,
            name: element.name,
            jobPosition: element.jobPosition,
            employeeType: element.type,
            action: (
              <div style={{ display: "flex", justifyContent: "left" }}>
                <Button
                  size="small"
                  onClick={() => {
                    router.push(`/employee-list/${element.id}`);
                  }}
                  variant="tertiary"
                >
                  View Detail
                </Button>
              </div>
            ),
          };
        });

        return { data: mappedData, totalRow: data.totalRow };
      },
    },
  });

  const { mutate: deleteEmployeeList, isLoading: isLoadingDeleteEmployeeList } =
    useDeleteEmployeeListMDM({
      options: {
        onSuccess: () => {
          setShowDelete({ open: false, data: {}, type: "" });
          setSelectedRowKeys([]);
          queryClient.invalidateQueries(["employee-list"]);
        },
      },
    });

  const { mutate: uploadFileEmployee } = useUploadFileEmployeeListMDM({
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries(["employee-list"]);
        setShowUpload(false);
      },
    },
  });

  const columns = [
    {
      title: "Employee ID",
      dataIndex: "id",
    },
    {
      title: "Employee Name",
      dataIndex: "name",
    },
    {
      title: "Job Position",
      dataIndex: "jobPosition",
    },
    {
      title: "Employee Type",
      dataIndex: "employeeType",
    },
    {
      title: "Action",
      dataIndex: "action",
      width: 160,
    },
  ];

  const rowSelection = {
    preserveSelectedRowKeys: true,
    selectedRowKeys,
    onChange: (selectedRowKeys: any) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  const onSubmitFile = (file: any) => {
    const formData = new FormData();
    formData.append("upload_file", file);

    uploadFileEmployee(formData);
  };

  const { data: jobPositionsData, isLoading: isLoadingJobPositions } = useJobPositions({
    query: {
      limit: 10000,
      company_id: "KSNI",
    },
    options: {
      onSuccess: () => {},
    },
  });

  const listFilterEmployeeList = [
    {
      label: "By Position",
      list: jobPositionsData?.rows?.map((data: any) => ({
        label: data.name,
        value: data.jobPositionId,
      })),
    },
    {
      label: "By Employee Type",
      list: [
        {
          label: "Full Time",
          value: "Full Time",
        },
        {
          label: "Contract",
          value: "Contract",
        },
      ],
    },
  ];

  const onHandleClear = () => {
    setFilterJobPosition("");
    setFilterTypeJob("");
  };

  const onChangeFilterPostalCode = (filter: any) => {
    setFilterJobPosition(filter.filter((filtering: any) => filtering.includes("MJP")).join(","));

    setFilterTypeJob(filter.filter((filtering: any) => !filtering.includes("MJP")).join(","));
  };

  return (
    <>
      <Col>
        <Text variant={"h4"}>Employee List</Text>
        <Spacer size={20} />
      </Col>
      <Card>
        <Row justifyContent="space-between">
          <Row gap="16px">
            <Search
              width="340px"
              placeholder="Search Employee ID, Name, etc"
              onChange={(e: any) => {
                setSearch(e.target.value);
              }}
            />
            {isLoadingJobPositions ? (
              <Spin tip={"Loading filter..."} />
            ) : (
              <DropdownMenuOptionGroupCustom
                showArrow={true}
                showSearch={false}
                showClearButton
                handleClearValue={onHandleClear}
                handleChangeValue={onChangeFilterPostalCode}
                listItems={listFilterEmployeeList}
                label=""
                width={194}
                roundedSelector={true}
                defaultValue={""}
                placeholder="Filter"
              />
            )}
          </Row>

          <Row gap="16px">
            <Button
              size="big"
              variant={"tertiary"}
              onClick={() =>
                setShowDelete({
                  open: true,
                  type: "selection",
                  data: { employeeListData: employeeListData, selectedRowKeys },
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
                    downloadFile({ with_data: "N", company_id: "KSNI" });
                    break;
                  case 2:
                    setShowUpload(true);
                    break;
                  case 3:
                    downloadFile({ with_data: "Y", company_id: "KSNI" });
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
              onClick={() => router.push("/employee-list/create")}
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
            loading={isLoadingEmployeeList || isFetchinggEmployeeList}
            columns={columns}
            data={employeeListData?.data}
            rowSelection={rowSelection}
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
                      deleteEmployeeList({ ids: selectedRowKeys });
                    } else {
                      deleteEmployeeList({ ids: [modalForm.data.id] });
                    }
                  }}
                >
                  {isLoadingDeleteEmployeeList ? "loading..." : "Yes"}
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

export default EmployeeList;
