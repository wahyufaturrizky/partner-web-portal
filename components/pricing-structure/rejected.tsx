import React, { useState } from "react";
import styled from "styled-components";
import {
  Text,
  Row,
  Search,
  Spacer,
  Button,
  Col,
  Table,
  Pagination,
  Lozenge,
  Spin,
  EmptyState,
  DropdownMenu,
  FileUploadModal,
  Modal,
} from "pink-lava-ui";
import usePagination from "@lucasmogari/react-pagination";
import { useRouter } from "next/router";
import { STATUS_APPROVAL_VARIANT, STATUS_APPROVAL_TEXT } from "../../utils/utils";
import {
  useDeletePricingStructureList,
  usePricingStructureLists,
  useUploadFilePricingStructureMDM,
} from "../../hooks/pricing-structure/usePricingStructure";
import { ICDollarBlack, ICDownload, ICManageCustGroupBuyingPrice, ICUpload } from "../../assets";
import { queryClient } from "../../pages/_app";
import { mdmDownloadService } from "../../lib/client";

const downloadFile = (params: any) =>
  mdmDownloadService("/pricing-structure/template/download", { params }).then((res) => {
    let dataUrl = window.URL.createObjectURL(new Blob([res.data]));
    let tempLink = document.createElement("a");
    tempLink.href = dataUrl;
    tempLink.setAttribute("download", `pricing-structure_${new Date().getTime()}.xlsx`);
    tempLink.click();
  });

const renderConfirmationText = (type: any, data: any) => {
  switch (type) {
    case "selection":
      return data.selectedRowKeys.length > 1
        ? `Are you sure to delete ${data.selectedRowKeys.length} items ?`
        : `Are you sure to delete name ${
            data?.data?.data.find((el: any) => el.key === data.selectedRowKeys[0])?.name
          } ?`;
    case "detail":
      return `Are you sure to delete name ${data.name} ?`;

    default:
      break;
  }
};

const RejectedPricingStructure: any = (props: any) => {
  const router = useRouter();
  const pagination = usePagination({
    page: 1,
    itemsPerPage: 10,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
  });

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [search, setSearch] = useState("");

  const [isShowUpload, setShowUpload] = useState(false);

  const [isShowDelete, setShowDelete] = useState({
    open: false,
    type: "selection",
    data: {},
  });

  const { data: pricingStructureLists, isLoading: isLoadingPricingStructureList } =
    usePricingStructureLists({
      options: {
        onSuccess: (data: any) => {
          pagination.setTotalItems(data.totalRow);
        },
      },
      query: {
        search,
        page: pagination.page,
        limit: pagination.itemsPerPage,
        status: "REJECTED",
      },
    });

  const { mutate: uploadFileProductBrandMDM } = useUploadFilePricingStructureMDM({
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries(["pricing-structure"]);
        setShowUpload(false);
      },
    },
  });

  const columns = [
    {
      title: "Proposal Number",
      dataIndex: "proposal_number",
      width: "28%",
    },
    {
      title: "Products",
      dataIndex: "product",
      width: "28%",
      render: (e: any) => `${e?.length || 0} Products`,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text: any) => (
        <Lozenge variant={STATUS_APPROVAL_VARIANT[text]}>{STATUS_APPROVAL_TEXT[text]}</Lozenge>
      ),
      width: "28%",
    },
    {
      title: "Action",
      dataIndex: "action",
      width: "15%",
    },
  ];

  const data: any = [];
  const isEmpty = pricingStructureLists?.rows?.length === 0;
  pricingStructureLists?.rows?.map((element: any) => {
    data.push({
      key: element.id,
      product: element.product,
      proposal_number: element.proposalNumber,
      status: element.status,
      action: (
        <Button
          size="small"
          onClick={() => {
            router.push(`/pricing-structure/${element.id}`);
          }}
          variant="tertiary"
        >
          View Detail
        </Button>
      ),
    });
  });
  const paginateField = data;

  const onSubmitFile = (file: any) => {
    const formData = new FormData();
    formData.append("upload_file", file);

    uploadFileProductBrandMDM(formData);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: any) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  const { mutate: deletePricingStructure, isLoading: isLoadingDeletePricingStructure }: any =
    useDeletePricingStructureList({
      options: {
        onSuccess: () => {
          setShowDelete({ open: false, data: {}, type: "" });
          setSelectedRowKeys([]);
          queryClient.invalidateQueries(["price-structure"]);
        },
      },
    });

  return (
    <>
      <Card>
        <Row justifyContent="space-between">
          <Search
            width="450px"
            placeholder="Search Proposal Number, Product, Date, Status"
            onChange={(e: any) => setSearch(e.target.value)}
          />
          <Row gap="16px" justifyContent="flex-end">
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
                    props.setModalPricingStructureForm({
                      ...props.modalPricingStructureForm,
                      open: true,
                      typeForm: "Manage Customer Group Buying Price",
                    });
                    break;
                  case 4:
                    props.setModalPricingStructureForm({
                      ...props.modalPricingStructureForm,
                      open: true,
                      typeForm: "Manage Price Structure Config",
                    });
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
                      <ICManageCustGroupBuyingPrice />
                      <p style={{ margin: "0" }}>Manage Customer Group Buying Price</p>
                    </div>
                  ),
                },
                {
                  key: 4,
                  value: (
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <ICDollarBlack />
                      <p style={{ margin: "0" }}>Manage Price Structure Config</p>
                    </div>
                  ),
                },
              ]}
            />

            <Button
              size="big"
              variant={"primary"}
              onClick={() => {
                router.push("/pricing-structure/create");
              }}
            >
              Create
            </Button>
          </Row>
        </Row>
      </Card>
      <Spacer size={10} />
      <Col>
        {isLoadingPricingStructureList ? (
          <Center>
            <Spin tip="Loading data..." />
          </Center>
        ) : (
          <Card style={{ minHeight: "574px", padding: "16px 20px" }}>
            <Text variant="headingRegular" color="blue.darker">
              {search ? `Search Result` : `Total Rejected Pricing Structure`} :{" "}
              {pricingStructureLists?.totalRow}{" "}
            </Text>
            <Spacer size={20} />
            {isEmpty ? (
              <EmptyState
                image={"/icons/empty-state.svg"}
                title={"The Data You Are Looking for Cannot be Found"}
                subtitle={`Don't worry you can Create a new pricing structure`}
                height={400}
              />
            ) : (
              <Col gap="60px">
                <Table columns={columns} data={paginateField} rowSelection={rowSelection} />
                <Pagination pagination={pagination} />
              </Col>
            )}
          </Card>
        )}
      </Col>
      <Spacer size={10} />

      {isShowUpload && (
        <FileUploadModal
          visible={isShowUpload}
          setVisible={setShowUpload}
          onSubmit={onSubmitFile}
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
                      deletePricingStructure({ ids: selectedRowKeys });
                    }
                  }}
                >
                  {isLoadingDeletePricingStructure ? "loading..." : "Yes"}
                </Button>
              </div>
            </div>
          }
        />
      )}
    </>
  );
};

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
`;

export default RejectedPricingStructure;
