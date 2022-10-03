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
  Spin,
  DropdownMenu,
  FileUploadModal,
} from "pink-lava-ui";
import usePagination from "@lucasmogari/react-pagination";
import useDebounce from "../../lib/useDebounce";
import { queryClient } from "../_app";
import { ICDownload, ICUpload } from "../../assets/icons";
import { mdmDownloadService } from "../../lib/client";
import { useRouter } from "next/router";
import { useCostCenters, useDeletCostCenter, useUploadFileCostCenter } from "hooks/mdm/cost-center/useCostCenter";

const downloadFile = (params: any) =>
  mdmDownloadService("/cost-center/download", { params }).then((res) => {
    let dataUrl = window.URL.createObjectURL(new Blob([res.data]));
    let tempLink = document.createElement("a");
    tempLink.href = dataUrl;
    tempLink.setAttribute("download", `cost_center_${new Date().getTime()}.xlsx`);
    tempLink.click();
  });

const renderConfirmationText = (type: any, data: any) => {
  switch (type) {
    case "selection":
      return data.selectedRowKeys.length > 1
        ? `Are you sure to delete ${data.selectedRowKeys.length} items ?`
        : `Are you sure to delete Cost Center - ${
            data?.uomData?.find((el: any) => el.id === data.selectedRowKeys[0])?.name
          } ?`;
    case "detail":
      return `Are you sure to delete Uom Name ${data.uomName} ?`;

    default:
      break;
  }
};

const CostCenter = () => {
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

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const debounceSearch = useDebounce(search, 1000);

  const {
    data: costCenterData,
    isLoading: isLoadingCostCenter,
    isFetching: isFetchingCostCenter,
  } = useCostCenters({
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
            key: element.costCenterId,
            id: element.costCenterId,
            companyId: element.companyId,
            code: element.code,
            name: element.name,
            action: (
              <div style={{ display: "flex", justifyContent: "left" }}>
                <Button
                  size="small"
                  onClick={() => {
                    router.push(`/cost-center/${element.companyId}/${element.costCenterId}`);
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

  const { mutate: deleteCostCenter, isLoading: isLoadingDeleteCostCenter } = useDeletCostCenter({
    options: {
      onSuccess: () => {
        setShowDelete({ open: false, data: {}, type: "" });
        setSelectedRowKeys([]);
        queryClient.invalidateQueries(["cost-centers"]);
      },
    },
  });

  const { mutate: uploadFileCostCenter, isLoading: isLoadingUploadFileCostCenter } = useUploadFileCostCenter({
    query: {
      with_data: "N",
      company_id: costCenterData?.data[0]?.companyId,
    },
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries(["cost-centers"]);
        setShowUpload(false);
      },
    },
  });

  const columns = [
    {
      title: "Cost Center ID",
      dataIndex: "id",
      key: 'id',
    },
    {
      title: "Cost Center Code",
      dataIndex: "code",
      key: 'profitCenterCode'
    },
    {
      title: "Cost Center Name",
      dataIndex: "name",
      key: 'profitCenterCode'
    },
    {
      title: "Action",
      dataIndex: "action",
      width: "15%",
      align: "left",
    },
  ];
  

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      if(!selectedRowKeys) {
      }
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  const onSubmitFile = (file: any) => {
    const formData = new FormData();
    formData.append("company_id", costCenterData?.data[0]?.companyId);
    formData.append("file", file);
    const uploadedData = {
      file: formData,
      company_id: costCenterData?.data[0]?.companyId
    }
    uploadFileCostCenter(formData);
  };

  const handleDelete = (ids: any[], rows: { id: string | number; companyId: any; }[]) => {
    const deletedCostCenter = {
        cost_center_ids :[...ids],
        company_ids :[]
    }
    let filteredCostCenter = {}
    ids.forEach((id: any) => {
        rows.forEach((costCenter: { id: string | number; companyId: any; }) => {
            if(id === costCenter?.id) {
                if(!filteredCostCenter[costCenter?.id]) {
                    deletedCostCenter.company_ids.push(costCenter.companyId)
                    filteredCostCenter[costCenter?.id] = 1
                }
            }
        });
    });
    if(deletedCostCenter?.company_ids?.length > 0) {
      deleteCostCenter(deletedCostCenter)
    }
  }

  if(isLoadingCostCenter || isLoadingUploadFileCostCenter){
  return (
    <Center>
      <Spin tip="Loading data..." />
    </Center>
  )}

  return (
    <>
      <Col>
        <Text variant={"h4"}>Cost Center List</Text>
        <Spacer size={20} />
      </Col>
      <Card>
        <Row justifyContent="space-between">
          <Search
            width="340px"
            placeholder="Search Cost Center Code, Cost Center Name, etc"
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
                  data: { uomData: costCenterData?.data, selectedRowKeys },
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
                const companyId = costCenterData?.data[0]?.companyId
                switch (parseInt(e.key)) {
                  case 1:
                    downloadFile({ with_data: "N", company_id: companyId });
                    break;
                  case 2:
                    setShowUpload(true);
                    break;
                  case 3:
                    downloadFile({ with_data: "Y", company_id: companyId });
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
              onClick={() => router.push("/cost-center/create")}
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
            loading={isLoadingCostCenter || isFetchingCostCenter}
            columns={columns}
            data={costCenterData?.data}
            rowSelection={rowSelection}
            rowKey={"id"}
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
            <TopButtonHolder>
              <Spacer size={4} />
              {renderConfirmationText(isShowDelete.type, isShowDelete.data)}
              <Spacer size={20} />
              <DeleteCardButtonHolder>
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
                  onClick={() => handleDelete(selectedRowKeys, costCenterData?.data)}
                >
                  {isLoadingDeleteCostCenter ? "loading..." : "Yes"}
                </Button>
              </DeleteCardButtonHolder>
            </TopButtonHolder>
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

const DeleteCardButtonHolder = styled.div`
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 20px;
`

const TopButtonHolder = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`
const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default CostCenter;
