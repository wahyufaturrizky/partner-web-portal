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
import { useCalculations } from "hooks/calculation-config/useCalculation";
import IDR_formatter from "hooks/number-formatter/useNumberFormatter";

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

  const { register, control, handleSubmit, setValue } = useForm();

  const [search, setSearch] = useState("");
  const [isShowDelete, setShowDelete] = useState({ open: false, type: "selection", data: {} });
  const [isShowCreate, setShowCreate] = useState({ open: false, title: ''})
  const [isShowEdit, setShowEdit] = useState({ open: false, title: '', data: {} })
  const [isShowUpload, setShowUpload] = useState(false);

  const [paymentButton, setPaymentButton] = useState({
    oneMonth: true,
    threeMonths: false,
    sixMonths: false,
    twelveMonths: false,
  })

  const [modalForm, setModalForm] = useState({
    open: false,
    data: {},
    typeForm: "create",
  });

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const debounceSearch = useDebounce(search, 1000);

  const {
    data: calculationData,
    isLoading: isLoadingCalculation,
    isFetching: isFetchingCalculation,
  } = useCalculations({
    query: {
      search: debounceSearch,
      page: pagination.page,
      limit: pagination.itemsPerPage,
      // company_id: "KSNI"
    },
    options: {
      onSuccess: (data: any) => {
        pagination.setTotalItems(data.totalRow);
      },
      select: (data: any) => {
        console.log(data, '<<<<<<data nya')
        let payment = 0
        const mappedData = data?.rows?.map((element: any) => {
            payment += +element?.totalPayment
            return {
              key: element.id,
              id: element.id,
              role_name: element?.userRole?.name,
              total_user: element?.totalUser,
              menu_name: element?.menus?.map((e: { name: string; }) => e?.name)?.slice()?.join(', '),
              company_name: element?.company?.name,
              branch : element.branch,
              fee: 'IDR ' + IDR_formatter.format(element?.fee?.split('.')[0])?.split('Rp')[1],
              total_fee: 'IDR ' + IDR_formatter.format(element?.totalFee?.split('.')[0])?.split('Rp')[1],
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
                    setShowEdit({open: true, title: "Edit Roles, Menu, etc", data: element})
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

          paymentButton?.threeMonths? payment = payment - payment * 0.1 :
          paymentButton?.sixMonths? payment = payment - payment * 0.25 :
          paymentButton?.twelveMonths? payment = payment - payment * 0.5 : payment
        return { data: mappedData, totalRow: data.totalRow, payment };
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
      dataIndex: "role_name",
    },
    {
      title: "Total User",
      dataIndex: "total_user",
    },
    {
      title: "Menu Name",
      dataIndex: "menu_name",
    },
    {
      title: "Company",
      dataIndex: "company_name",
    },
    {
      title: "Branch",
      dataIndex: "branch",
    },
    {
      title: "Fee",
      dataIndex: "fee",
    },
    {
      title: "Total Fee",
      dataIndex: "total_fee",
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
                    color: paymentButton.oneMonth? '#BC006F': '#DDDDDD',
                    border: paymentButton.oneMonth? '2px solid #EB008B': '2px solid #DDDDDD',
                    width: '23.5%',
                    borderRadius: '5px',
                }}
                onClick={() => setPaymentButton({
                  oneMonth: true, 
                  threeMonths: false,
                  sixMonths: false,
                  twelveMonths: false,
                  })}>
              1 Month 
            </Button>
            <Spacer size={20} />
            <Button size="big" variant="tertiary"
                style={{ 
                    color: paymentButton.threeMonths? '#BC006F': '#DDDDDD',
                    border: paymentButton.threeMonths? '2px solid #EB008B': '2px solid #DDDDDD',
                    width: '23.5%',
                    borderRadius: '5px',
                }}
                onClick={() => setPaymentButton({
                  oneMonth: false, 
                  threeMonths: true,
                  sixMonths: false,
                  twelveMonths: false,
                })}>
              3 Months <PlanSaveText>Save 10%</PlanSaveText>
            </Button>
            <Spacer size={20} />
            <Button size="big" variant="tertiary"
                style={{ 
                    color: paymentButton.sixMonths? '#BC006F': '#DDDDDD',
                    border: paymentButton.sixMonths? '2px solid #EB008B': '2px solid #DDDDDD',
                    width: '23.5%',
                    borderRadius: '5px',
                }}
                onClick={() => setPaymentButton({
                  oneMonth: false, 
                  threeMonths: false,
                  sixMonths: true,
                  twelveMonths: false,
                })}>
              6 Months <PlanSaveText>Save 25%</PlanSaveText>
            </Button>
            <Spacer size={20} />

            <Button size="big" variant="tertiary" 
                style={{ 
                    color: paymentButton.twelveMonths? '#BC006F': '#DDDDDD',
                    border: paymentButton.twelveMonths? '2px solid #EB008B': '2px solid #DDDDDD',
                    width: '23.5%',
                    borderRadius: '5px',
                }}
                onClick={() => setPaymentButton({
                  oneMonth: false, 
                  threeMonths: false,
                  sixMonths: false,
                  twelveMonths: true,
                })}>
              12 Months <PlanSaveBestValueText>Best Value Save 50%</PlanSaveBestValueText>
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
            loading={isLoadingCalculation || isFetchingCalculation}
            columns={columns}
            data={calculationData?.data}
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
                <Text variant={"headingLarge"}>IDR {IDR_formatter.format(calculationData?.payment)?.split('Rp')[1]}/mo</Text>
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

const PlanSaveText = styled.p`
  background: #ebebeb;
  padding: .1rem .2rem;
  border-radius: 10px;
  line-height: .85rem;
  color: #232323;
  font-size: 8px;
  margin-left: .3rem;
  margin-bottom: .2rem;
`

const PlanSaveBestValueText = styled.p`
  background: #ffd8d8;
  padding: .01rem .2rem;
  line-height: .85rem;
  border-radius: 20px;
  color: #ff4646;
  font-size: 9px;
  margin-left: .3rem;
  margin-bottom: .2rem;
`
export default Calculation;
