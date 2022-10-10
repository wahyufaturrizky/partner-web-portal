import usePagination from "@lucasmogari/react-pagination";
import { useRouter } from "next/router";
import {
  Button,
  Col,
  DropdownMenu,
  Pagination,
  Row,
  Search,
  Spacer,
  Table,
  Text,
} from "pink-lava-ui";
import { useState } from "react";
import styled from "styled-components";
import { ICDownload } from "../../assets/icons";
import {
  useRetailPricingList,
} from "../../hooks/mdm/retail-pricing/useRetailPricingList";
import { mdmDownloadService } from "../../lib/client";
import useDebounce from "../../lib/useDebounce";

const downloadFile = (params: any) =>
  mdmDownloadService("/retail-pricing/download", { params }).then((res) => {
    let dataUrl = window.URL.createObjectURL(new Blob([res.data]));
    let tempLink = document.createElement("a");
    tempLink.href = dataUrl;
    tempLink.setAttribute("download", `retail_pricing_list_${new Date().getTime()}.xlsx`);
    tempLink.click();
  });

const RetailPricing = () => {
  const router = useRouter();
  const pagination = usePagination({
    page: 1,
    itemsPerPage: 5,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
  });

  const [search, setSearch] = useState("");
  const debounceSearch = useDebounce(search, 1000);

  const {
    data: retailPricingListData,
    isLoading: isLoadingRetailPricingList,
    isFetching: isFetchingRetailPricingList,
  } = useRetailPricingList({
    query: {
      search: debounceSearch,
      page: pagination.page,
      limit: pagination.itemsPerPage,
      company_id: "KSNI",
    },
    options: {
      onSuccess: (data: any) => {
        pagination.setTotalItems(data.totalRow);
      },
      select: (data: any) => {
        const mappedData = data?.rows?.map((element: any) => {
          return {
            key: element.retailPriceId,
            retail_pricing_id: element.retailPriceId,
            name: element.name,
            based_on: element.basedOn,
            action: (
              <div style={{ display: "flex", justifyContent: "left" }}>
                <Button
                  size="small"
                  onClick={() => {
                    router.push(`/retail-pricing/${element.retailPriceId}`);
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

  const columns = [
    {
      title: "Retail Price ID",
      dataIndex: "retail_pricing_id",
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Based on",
      dataIndex: "based_on",
    },
    {
      title: "Action",
      dataIndex: "action",
      width: "15%",
    },
  ];

  return (
    <>
      <Col>
        <Text variant={"h4"}>Retail Pricing</Text>
        <Spacer size={20} />
      </Col>
      <Card>
        <Row justifyContent="space-between">
          <Search
            width="340px"
            placeholder="Search Retail Pricing ID, Name, Category, Status"
            onChange={(e: any) => {
              setSearch(e.target.value);
            }}
          />
          <Row gap="16px">
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
              ]}
            />
            <Button
              size="big"
              variant="primary"
              onClick={() => router.push("/retail-pricing/create")}
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
            loading={isLoadingRetailPricingList || isFetchingRetailPricingList}
            columns={columns}
            data={retailPricingListData?.data}
          />
          <Pagination pagination={pagination} />
        </Col>
      </Card>
    </>
  );
};

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
`;

export default RetailPricing;
