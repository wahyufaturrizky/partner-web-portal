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
  Span,
  FormSelect,
  Dropdown,
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
import {
  useCalculations,
  useCreateCalculation,
  useDeleteCalculation,
  useUpdateCalculation,
  useUploadFileCalculation,
} from "hooks/calculation-config/useCalculation";
import IDR_formatter from "hooks/number-formatter/useNumberFormatter";
import { useCompanyInfiniteLists } from "hooks/company-list/useCompany";
import { usePartnerConfigPermissionLists } from "hooks/user-config/usePermission";
import { permissionCalculation } from "permission/calculation";
import { useUserPermissions } from "hooks/user-config/useUser";

const downloadFile = (params: any) =>
  mdmDownloadService("/branch/download", { params }).then((res) => {
    let dataUrl = window.URL.createObjectURL(new Blob([res.data]));
    let tempLink = document.createElement("a");
    tempLink.href = dataUrl;
    tempLink.setAttribute("download", `branch_${new Date().getTime()}.xlsx`);
    tempLink.click();
  });

const Calculation = () => {
  const router = useRouter();
  const companyCode = localStorage.getItem("companyCode");
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
  const [isShowDelete, setShowDelete] = useState({ open: false, id: "", name: "" });
  const [isShowCreate, setShowCreate] = useState({ open: false, title: "" });
  const [isShowEdit, setShowEdit] = useState({ open: false, title: "", data: {}, id: 0 });
  const [isShowUpload, setShowUpload] = useState(false);

  const [paymentButton, setPaymentButton] = useState({
    oneMonth: true,
    threeMonths: false,
    sixMonths: false,
    twelveMonths: false,
  });

  const debounceSearch = useDebounce(search, 1000);

  const [companyList, setCompanyList] = useState([]);
  const [totalRowsCompanyList, setTotalRowsCompanyList] = useState(0);
  const [searchCompany, setSearchCompany] = useState("");
  const debounceFetchCompany = useDebounce(searchCompany, 1000);

  const { data: dataUserPermission } = useUserPermissions({
    options: {
      onSuccess: () => {},
    },
  });
  console.log(dataUserPermission, "<<<<<usernya");

  const listPermission = dataUserPermission?.permission?.filter(
    (filtering: any) => filtering.menu === "Calculation"
  );

  // const allowPermissionToShow = listPermission?.filter((data: any) =>
  // 	// permissionCalculation.role[dataUserPermission?.role?.name].component.includes(data.name)
  // );
  // nanti ganti sama atas
  const allowPermissionToShow = listPermission?.filter((data: any) => {
    return permissionCalculation.role["Admin"].component.includes(data.name);
  });

  console.log(allowPermissionToShow, "<<<<allow");

  const {
    data: calculationData,
    isLoading: isLoadingCalculation,
    isFetching: isFetchingCalculation,
  } = useCalculations({
    query: {
      search: debounceSearch,
      page: pagination.page,
      limit: pagination.itemsPerPage,
      company_id: companyCode,
    },
    options: {
      onSuccess: (data: any) => {
        pagination?.setTotalItems(data.totalRow);
      },
      select: (data: any) => {
        let payment = 0;
        const mappedData = data?.rows?.map((element: any) => {
          const companyName = companyList
            .filter((el) => el.companyId === element.companyId)[0]
            ?.value?.split(" - ")[0];
          const newMenu = element.modules?.map((el: { name: string }) => el.name);
          console.log(newMenu);
          payment += +element?.totalPayment;
          console.log(payment);
          return {
            key: element.id,
            id: element.id,
            role_name: element?.roleName,
            total_user: element?.totalUser,
            menu_name: newMenu,
            company_name: companyName,
            branch: element.branch,
            fee: "IDR " + IDR_formatter.format(element?.fee?.split(".")[0])?.split("Rp")[1],
            total_fee:
              "IDR " + IDR_formatter.format(element?.totalFee?.split(".")[0])?.split("Rp")[1],
            action: (
              <div style={{ display: "flex", justifyContent: "left" }}>
                {allowPermissionToShow
                  ?.map((data: any) => data.name)
                  ?.includes("Update Calculation") && (
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
                      setShowEdit({
                        open: true,
                        title: "Edit Roles, Menu, etc",
                        data: { ...element, companyName },
                        id: element?.id,
                      });
                    }}
                  />
                )}
                <Spacer size={5} />
                {allowPermissionToShow
                  ?.map((data: any) => data.name)
                  ?.includes("Delete Calculation") && (
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
                      setShowDelete({ open: true, id: element.id, name: element.roleName });
                    }}
                  />
                )}
              </div>
            ),
          };
        });
        console.log(mappedData, "<<<mapped");
        paymentButton?.threeMonths
          ? (payment = payment * 3 - payment * 3 * 0.1)
          : paymentButton?.sixMonths
          ? (payment = payment * 6 - payment * 6 * 0.25)
          : paymentButton?.twelveMonths
          ? (payment = payment * 12 - payment * 12 * 0.5)
          : payment;
        return { data: mappedData, totalRow: data.totalRow, payment };
      },
    },
  });

  const {
    isLoading: isLoadingCompany,
    isFetching: isFetchingCompany,
    isFetchingNextPage: isFetchingMoreCompany,
    hasNextPage: hasNextPageCompany,
    fetchNextPage: fetchNextPageCompany,
  } = useCompanyInfiniteLists({
    query: {
      search: debounceFetchCompany,
      limit: 10,
      company_id: companyCode,
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRowsCompanyList(data.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => {
          return group.rows?.map((element: any) => {
            return {
              id: element.code,
              value: element.name + " - " + element.companyType,
              companyId: element.id,
            };
          });
        });
        const flattenArray = [].concat(...mappedData);
        setCompanyList(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (companyList.length < totalRowsCompanyList) {
          return pages.length + 1;
        } else {
          return undefined;
        }
      },
    },
  });

  const { mutate: deleteCalculation, isLoading: isLoadingDeleteCalculation } = useDeleteCalculation(
    {
      options: {
        onSuccess: () => {
          setShowDelete({ open: false, id: "", name: "" });
          queryClient.invalidateQueries(["calculations"]);
        },
      },
    }
  );

  const { mutate: createCalculation, isLoading: isLoadingCreateCalculation } = useCreateCalculation(
    {
      options: {
        onSuccess: () => {
          setShowCreate({ open: false, title: "" });
          queryClient.invalidateQueries(["calculations"]);
        },
      },
    }
  );

  const { mutate: updateCalculation, isLoading: isLoadingUpdateCalculation } = useUpdateCalculation(
    {
      id: isShowEdit?.id,
      options: {
        onSuccess: () => {
          setShowEdit({ open: false, title: "", data: {}, id: 0 });
          queryClient.invalidateQueries(["calculations"]);
        },
      },
    }
  );

  const { mutate: uploadFileCalculation, isLoading: isLoadingUploadFileCalculation } =
    useUploadFileCalculation({
      options: {
        onSuccess: () => {
          queryClient.invalidateQueries(["calculations"]);
          setShowUpload(false);
        },
      },
    });

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

  const onSubmitFile = (file: any) => {
    const formData = new FormData();
    formData.append("company_id", companyCode);
    formData.append("file", file);

    uploadFileCalculation(formData);
  };

  const onCreate = (data: any) => {
    createCalculation(data);
    console.log(data, "<<<<create dari index");
  };
  const onEdit = (data: any) => {
    console.log(data, "<<<<edit dari index");
    updateCalculation(data);
  };

  return (
    <>
      <Col>
        <Text variant={"h4"}>Calculation</Text>
        <Spacer size={20} />
      </Col>
      <Card>
        <Text variant={"headingLarge"} style={{ color: "rgb(33, 145, 155)" }}>
          Choose the plan that's right for you
        </Text>
        <Spacer size={20} />
        <Row>
          <Button
            size="big"
            variant="tertiary"
            style={{
              color: paymentButton.oneMonth ? "#BC006F" : "#DDDDDD",
              border: paymentButton.oneMonth ? "2px solid #EB008B" : "2px solid #DDDDDD",
              width: "23.5%",
              borderRadius: "5px",
            }}
            onClick={() =>
              setPaymentButton({
                oneMonth: true,
                threeMonths: false,
                sixMonths: false,
                twelveMonths: false,
              })
            }
          >
            1 Month
          </Button>
          <Spacer size={20} />
          <Button
            size="big"
            variant="tertiary"
            style={{
              color: paymentButton.threeMonths ? "#BC006F" : "#DDDDDD",
              border: paymentButton.threeMonths ? "2px solid #EB008B" : "2px solid #DDDDDD",
              width: "23.5%",
              borderRadius: "5px",
            }}
            onClick={() =>
              setPaymentButton({
                oneMonth: false,
                threeMonths: true,
                sixMonths: false,
                twelveMonths: false,
              })
            }
          >
            3 Months <PlanSaveText>Save 10%</PlanSaveText>
          </Button>
          <Spacer size={20} />
          <Button
            size="big"
            variant="tertiary"
            style={{
              color: paymentButton.sixMonths ? "#BC006F" : "#DDDDDD",
              border: paymentButton.sixMonths ? "2px solid #EB008B" : "2px solid #DDDDDD",
              width: "23.5%",
              borderRadius: "5px",
            }}
            onClick={() =>
              setPaymentButton({
                oneMonth: false,
                threeMonths: false,
                sixMonths: true,
                twelveMonths: false,
              })
            }
          >
            6 Months <PlanSaveText>Save 25%</PlanSaveText>
          </Button>
          <Spacer size={20} />

          <Button
            size="big"
            variant="tertiary"
            style={{
              color: paymentButton.twelveMonths ? "#BC006F" : "#DDDDDD",
              border: paymentButton.twelveMonths ? "2px solid #EB008B" : "2px solid #DDDDDD",
              width: "23.5%",
              borderRadius: "5px",
            }}
            onClick={() =>
              setPaymentButton({
                oneMonth: false,
                threeMonths: false,
                sixMonths: false,
                twelveMonths: true,
              })
            }
          >
            12 Months <PlanSaveBestValueText>Best Value Save 50%</PlanSaveBestValueText>
          </Button>
        </Row>

        <Spacer size={20} />
        <Separator />
        <Spacer size={20} />

        <Text variant={"headingLarge"} style={{ color: "rgb(33, 145, 155)" }}>
          Set Roles, Menu, and User
        </Text>
        <Spacer size={20} />

        <Row gap="16px">
          {allowPermissionToShow?.map((data: any) => data.name)?.includes("Create Calculation") && (
            <Button
              size="big"
              variant="primary"
              onClick={() =>
                setShowCreate({
                  open: true,
                  title: "Add New Roles, Menu, etc",
                })
              }
            >
              + Add New
            </Button>
          )}
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
        <Text variant={"headingLarge"} style={{ color: "rgb(33, 145, 155)" }}>
          Choose who will be billed for?
        </Text>
        <Spacer size={20} />

        <Col
          width="100%"
          style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}
        >
          <Dropdown
            label="Assign Payment"
            items={companyList}
            width={"70%"}
            // value={employeeLanguages && employeeLanguages}
            placeholder={"Select"}
            handleChange={(value) => setValue("company", value)}
            onSearch={(value) => setSearchCompany(value)}
            // noSearch
          />
          <div
            style={{
              paddingRight: "1rem",
              textAlign: "right",
            }}
          >
            <Text variant={"subHeading"}>Total Payment</Text>
            <Spacer size={10} />
            <Text variant={"headingLarge"}>
              IDR {IDR_formatter.format(calculationData?.payment)?.split("Rp")[1]}/mo
            </Text>
          </div>
        </Col>
        <Spacer size={20} />
        <Separator />
        <Spacer size={20} />

        <Row justifyContent={"space-between"}>
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
          onCancel={() => setShowCreate({ open: false, title: "" })}
          onOk={onCreate}
        />
      )}

      {isShowEdit.open && (
        <ModalCalculation
          visible={isShowEdit.open}
          title={isShowEdit.title}
          defaultValue={isShowEdit.data}
          onOk={onEdit}
          onCancel={() => setShowEdit({ open: false, title: "", data: {}, id: 0 })}
        />
      )}

      {isShowDelete.open && (
        <Modal
          closable={false}
          centered
          visible={isShowDelete.open}
          onCancel={() => setShowDelete({ open: false, id: "", name: "" })}
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
              <Text>Are you sure you want to delete Role Name - {isShowDelete.name}</Text>
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
                  onClick={() => setShowDelete({ open: false, id: "", name: "" })}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="big"
                  onClick={() => {
                    deleteCalculation({ ids: [isShowDelete.id] });
                  }}
                >
                  {isLoadingDeleteCalculation ? "loading..." : "Yes"}
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
  padding: 0.1rem 0.2rem;
  border-radius: 10px;
  /* line-height: .85rem; */
  color: #232323;
  font-size: 12px;
  margin-left: 0.3rem;
  /* margin-bottom: .2rem; */
`;

const PlanSaveBestValueText = styled.p`
  background: #ffd8d8;
  padding: 0.01rem 0.2rem;
  /* line-height: .85rem; */
  border-radius: 20px;
  color: #ff4646;
  font-size: 12px;
  margin-left: 0.3rem;
  /* margin-bottom: .2rem; */
`;
export default Calculation;
