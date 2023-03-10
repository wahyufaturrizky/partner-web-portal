import usePagination from "@lucasmogari/react-pagination";
import moment from "moment";
import { useRouter } from "next/router";
import {
  Button,
  Col,
  DropdownMenu,
  EmptyState,
  FileUploadModal,
  Lozenge,
  Pagination,
  Row,
  Search,
  Spacer,
  Spin,
  Table,
} from "pink-lava-ui";
import { useState } from "react";
import styled from "styled-components";
import { ICDollarBlack, ICDownload, ICManageCustGroupBuyingPrice, ICUpload } from "../../assets";
import {
  usePricingStructureLists,
  useUploadFilePricingStructureMDM,
} from "../../hooks/pricing-structure/usePricingStructure";
import { mdmDownloadService } from "../../lib/client";
import { queryClient } from "../../pages/_app";
import { STATUS_APPROVAL_TEXT, STATUS_APPROVAL_VARIANT } from "../../utils/utils";

const downloadFile = (params: any) =>
  mdmDownloadService("/price-structure/download", { params }).then((res) => {
    const dataUrl = window.URL.createObjectURL(new Blob([res.data]));
    const tempLink = document.createElement("a");
    tempLink.href = dataUrl;
    tempLink.setAttribute("download", `pricing-structure_${new Date().getTime()}.xlsx`);
    tempLink.click();
  });

const ActivePricingStructure: any = (props: any) => {
  const router = useRouter();
  const pagination = usePagination({
    page: 1,
    itemsPerPage: 20,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
  });
  const companyCode = localStorage.getItem("companyCode");

  const [isShowUpload, setShowUpload] = useState(false);

  const [search, setSearch] = useState("");

  const {
    data: pricingStructureLists,
    isLoading: isLoadingPricingStructureList,
    isFetching: isFetchingPricingStructureList,
    refetch: refetchPricingStructure,
  } = usePricingStructureLists({
    options: {
      onSuccess: (data: any) => {
        pagination.setTotalItems(data.totalRow);
      },
    },
    query: {
      search,
      page: pagination.page,
      limit: pagination.itemsPerPage,
      status: "ACTIVE",
      company_id: companyCode,
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
    },
    {
      title: "Products",
      dataIndex: "priceStructureCosts",
      render: (e: any) => `${e?.length} Products`,
    },
    {
      title: "Active Date",
      dataIndex: "activeDate",
      render: (e: any) => moment(e).format("DD-MM-YYYY"),
      width: "28%",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text: any) => (
        <Lozenge variant={STATUS_APPROVAL_VARIANT[text]}>{STATUS_APPROVAL_TEXT[text]}</Lozenge>
      ),
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
      priceStructureCosts: element.priceStructureCosts,
      proposal_number: element.proposalNumber,
      activeDate: element.activeDate,
      status: element.status,
      action: (
        <Button
          size="small"
          onClick={() => {
            router.push(`/mdm/pricing/pricing-structure/${element.id}`);
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
                      typeForm: "Manage Price Structure Configuration",
                    });
                    break;
                  default:
                    break;
                }
              }}
              menuList={[
                {
                  key: 1,
                  value: props?.listPermission?.filter(
                    (x: any) => x.viewTypes[0]?.viewType.name === "Download Template"
                  ).length > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <ICDownload />
                      <p style={{ margin: "0" }}>Download Template</p>
                    </div>
                  ),
                },
                {
                  key: 2,
                  value: props?.listPermission?.filter(
                    (x: any) => x.viewTypes[0]?.viewType.name === "Upload"
                  ).length > 0 && (
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
            {props?.listPermission?.filter((x: any) => x.viewTypes[0]?.viewType.name === "Create")
              .length > 0 && (
              <Button
                size="big"
                variant="primary"
                onClick={() => {
                  router.push("/mdm/pricing/pricing-structure/create");
                }}
              >
                Create
              </Button>
            )}
          </Row>
        </Row>
      </Card>
      <Spacer size={10} />
      <Col>
        {isLoadingPricingStructureList || isFetchingPricingStructureList ? (
          <Center>
            <Spin tip="Loading data..." />
          </Center>
        ) : (
          <Card style={{ minHeight: "574px", padding: "16px 20px" }}>
            <Spacer size={20} />
            {isEmpty ? (
              <EmptyState
                image="/icons/empty-state.svg"
                title="The Data You Are Looking for Cannot be Found"
                subtitle={`Don't worry you can Create a new pricing structure`}
                height={400}
              />
            ) : (
              <Col gap="60px">
                <Table
                  loading={isLoadingPricingStructureList || isFetchingPricingStructureList}
                  columns={columns}
                  data={paginateField}
                />
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

export default ActivePricingStructure;
