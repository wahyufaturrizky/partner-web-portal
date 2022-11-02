import React, { useState } from "react";
import styled from "styled-components";
import { Controller, useForm } from "react-hook-form";

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
  Label,
  FormSelect,
  Dropdown
} from "pink-lava-ui";
import usePagination from "@lucasmogari/react-pagination";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

import {
  useBranchList,
  useUploadFileBranch,
  useDeleteBranch,
} from "../../hooks/mdm/branch/useBranch";
import useDebounce from "../../lib/useDebounce";
import { queryClient } from "../_app";
import { mdmDownloadService } from "../../lib/client";
import { useRouter } from "next/router";
import ModalCalculation from "components/elements/Modal/ModalCalculation";

const downloadFile = (params: any) =>
  mdmDownloadService("/branch/download", { params }).then((res) => {
    let dataUrl = window.URL.createObjectURL(new Blob([res.data]));
    let tempLink = document.createElement("a");
    tempLink.href = dataUrl;
    tempLink.setAttribute("download", `branch_${new Date().getTime()}.xlsx`);
    tempLink.click();
  });

const renderConfirmationText = (type: any, data: any) => {
  switch (type) {
    case "selection":
      return data.selectedRowKeys.length > 1
        ? `Are you sure to delete ${data.selectedRowKeys.length} items ?`
        : `Are you sure to delete Branch Name ${
            data?.uomData?.data.find((el: any) => el.key === data.selectedRowKeys[0])?.uomName
          } ?`;
    case "detail":
      return `Are you sure to delete Branch Name ${data.uomName} ?`;

    default:
      break;
  }
};

const Calculation = () => {
  const router = useRouter();
  const pagination = usePagination({
    page: 1,
    itemsPerPage: 20,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
  });

  const { register, control, handleSubmit } = useForm();

  const [search, setSearch] = useState("");
  const [isShowDelete, setShowDelete] = useState({ open: false, type: "selection", data: {} });
  const [isShowCreate, setShowCreate] = useState({ open: false, title: ''})
  const [isShowUpload, setShowUpload] = useState(false);

  const [paymentButton, setPaymentButton] = useState({
    monthly: true,
    yearly: false
  })

  const [modalForm, setModalForm] = useState({
    open: false,
    data: {},
    typeForm: "create",
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const debounceSearch = useDebounce(search, 1000);

  const {
    data: branchData,
    isLoading: isLoadingBranch,
    isFetching: isFetchingBranch,
  } = useBranchList({
    query: {
      search: debounceSearch,
      page: pagination.page,
      limit: pagination.itemsPerPage,
      company_id: "KSNI"
    },
    options: {
      onSuccess: (data: any) => {
        pagination.setTotalItems(data.totalRow);
      },
      select: (data: any) => {
        const mappedData = data?.rows?.map((element: any) => {
            return {
              key: element.branchId,
              id: element.branchId,
              branchName: element.name,
              action: (
                <div style={{ display: "flex", justifyContent: "left" }}>
                    <EditOutlined
                  style={{
                    cursor: "pointer",
                    borderRadius: 3,
                    backgroundColor: "#D5FAFD",
                    color: "#2BBECB",
                    padding: 4,
                    fontSize: "18px",
                  }}
                  onClick={() => {
                    console.log('masuk edit')
                  }}
                />
                <Spacer size={5} />
                <DeleteOutlined
                  style={{
                    cursor: "pointer",
                    borderRadius: 3,
                    backgroundColor: "#D5FAFD",
                    color: "#EB008B",
                    padding: 4,
                    fontSize: "18px",
                  }}
                  onClick={() => {
                    console.log('masuk delete')
                  }}
                />
                </div>
              ),
            };
          });
        return { data: mappedData, totalRow: data.totalRow };
      },
    },
  });

  const { mutate: deleteBranch, isLoading: isLoadingDeleteBranch } = useDeleteBranch({
    options: {
      onSuccess: () => {
        setShowDelete({ open: false, data: {}, type: "" });
        setSelectedRowKeys([]);
        queryClient.invalidateQueries(["branch-list"]);
      },
    },
  });

  const { mutate: uploadFileBranch, isLoading: isLoadingUploadFileBranch } = useUploadFileBranch({
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries(["branch-list"]);
        setShowUpload(false);
      },
    },
  });

  const [listZone, setListZone] = useState([
    { value: 1, label: 'Andir' },
    { value: 2, label: 'Arcamanik' },
    { value: 3, label: 'Baleendah' },
  ])

  const columns = [
    {
        title: "",
        dataIndex: "action",
        width: "7%",
        align: "left",
    },
    {
      title: "Role Name",
      dataIndex: "id",
    },
    {
      title: "Total User",
      dataIndex: "branchName",
    },
    {
      title: "Menu Name",
      dataIndex: "id",
    },
    {
      title: "Company",
      dataIndex: "branchName",
    },
    {
      title: "Branch",
      dataIndex: "id",
    },
    {
      title: "Fee",
      dataIndex: "branchName",
    },
    {
      title: "Total Fee",
      dataIndex: "branchName",
    },
    
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: any) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  const onSubmitFile = (file: any) => {
    const formData = new FormData();
    formData.append("company_id", "KSNI");
    formData.append("file", file);

    uploadFileBranch(formData);
  };
  console.log(isShowCreate, "<<<<<<payment")

  return (
    <>
      <Col>
        <Text variant={"h4"}>Calculation</Text>
        <Spacer size={20} />
      </Col>
      <Card>
        <Text variant={"headingLarge"} style={{color: 'rgb(33, 145, 155)'}}>Choose the plan that's right for you</Text>
        <Spacer size={20} />

        <Row>
            <Button size="big" variant="tertiary"
                style={{ 
                    color: paymentButton.monthly? '#BC006F': '#DDDDDD',
                    border: paymentButton.monthly? '2px solid #EB008B': '2px solid #DDDDDD',
                    width: '20%',
                    borderRadius: '5px',
                }}
                onClick={() => setPaymentButton({monthly: true, yearly: false})}>
              Monthly
            </Button>
            <Spacer size={20} />

            <Button size="big" variant="tertiary" 
                style={{ 
                    color: paymentButton.yearly? '#BC006F': '#DDDDDD',
                    border: paymentButton.yearly? '2px solid #EB008B': '2px solid #DDDDDD',
                    width: '20%',
                    borderRadius: '5px',
                }}
                onClick={() => setPaymentButton({monthly: false, yearly: true})}>
              Yearly
            </Button>
          
        </Row>

        <Spacer size={20} />
        <Separator/>
        <Spacer size={20} />
        
        <Text variant={"headingLarge"} style={{color: 'rgb(33, 145, 155)'}}>Set Roles, Menu, and User</Text>
        <Spacer size={20} />
        
        <Row gap="16px">
        
        <Button size="big" variant="primary" onClick={() => setShowCreate({
            open: true,
            title: 'Add New Roles, Menu, etc'
        })}>
            + Add New
        </Button>

        <Search
        width="340px"
        placeholder="Search Role Name, Total User, Menu Name, etc."
        onChange={(e: any) => {
            setSearch(e.target.value);
        }}
        />
        </Row>
        <Spacer size={20} />

        <Col gap={"60px"}>
          <Table
            loading={isLoadingBranch || isFetchingBranch}
            columns={columns}
            data={branchData?.data}
            // rowSelection={rowSelection}
          />
          <Pagination pagination={pagination} />
        </Col>
      </Card>

      <Spacer size={10} />

      <Card style={{ padding: "16px 20px" }}>
        <Text variant={"headingLarge"} style={{color: 'rgb(33, 145, 155)'}}>Choose who will be billed for?</Text>
        <Spacer size={20} />

        <Col width="100%" style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
            <Dropdown
                label="Assign Payment"
                items={listZone}
                width={"50%"}
                // value={employeeLanguages && employeeLanguages}
                placeholder={"Select"}
                handleChange={(value) => setValue("language", value)}
                onSearch={(value) => console.log(value)}
                // noSearch
            />

            <div style={{
                paddingRight: '1rem',
                textAlign: 'right'
            }}>
                <Text variant={"subHeading"}>Total Payment</Text>
                <Spacer size={10} />
                <Text variant={"headingLarge"}>IDR 550.000</Text>
            </div>
        </Col>
        <Spacer size={20} />
        <Separator/>
        <Spacer size={20} />
        
        <Row justifyContent={'space-between'}>
            <div></div>
            <Button size="big" variant="primary" onClick={() => router.push("/branch/create")}>
                Submit
            </Button>
        </Row>
      </Card>

      {isShowCreate.open && (
        <ModalCalculation
            visible={isShowCreate.open}
            title={isShowCreate.title}
            onCancel={() => setShowCreate({open: false, title: ''})}
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
                      deleteBranch({ ids: selectedRowKeys, company_id: "KSNI" });
                    } else {
                      deleteBranch({ ids: [modalForm.data.id], company_id: "KSNI" });
                    }
                  }}
                >
                  {isLoadingDeleteBranch ? "loading..." : "Yes"}
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

const Separator = styled.div`
  display: block;
  height: 0;
  border-bottom: 1px dashed #aaaaaa;
`;

export default Calculation;
