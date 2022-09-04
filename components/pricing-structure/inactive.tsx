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
} from "pink-lava-ui";
import usePagination from "@lucasmogari/react-pagination";
import { useRouter } from "next/router";
import { STATUS_APPROVAL_VARIANT, STATUS_APPROVAL_TEXT } from "../../utils/utils";
import { usePricingStructureLists } from "../../hooks/pricing-structure/usePricingStructure";

const InActivePricingStructure: any = () => {
  const router = useRouter();
  const pagination = usePagination({
    page: 1,
    itemsPerPage: 10,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
  });

  const [search, setSearch] = useState("");

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
        status: "INACTIVE",
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
      dataIndex: "products",
      width: "28%",
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
      proposal_number: element.proposalNumber,
      products: element.elementType.products,
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
              {search ? `Search Result` : `Total Inactive Pricing Structure`} :{" "}
              {pricingStructureLists?.totalRow}{" "}
            </Text>
            <Spacer size={20} />
            {isEmpty ? (
              <EmptyState
                image={"/empty-state.svg"}
                title={"The Data You Are Looking for Cannot be Found"}
                description={`Don't worry you can Create a new pricing structure`}
                height={400}
              />
            ) : (
              <Col gap="60px">
                <Table columns={columns} data={paginateField} />
                <Pagination pagination={pagination} />
              </Col>
            )}
          </Card>
        )}
      </Col>
      <Spacer size={10} />
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

export default InActivePricingStructure;
