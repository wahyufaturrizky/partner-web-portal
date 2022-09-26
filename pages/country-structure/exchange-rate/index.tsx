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
  Dropdown,
  DropdownMenu,
  FileUploadModal,
  DatePickerInput,
} from "pink-lava-ui";
import usePagination from "@lucasmogari/react-pagination";
import { useExchangeRates } from "../../../hooks/mdm/exchange-rate/useExchangeRate";
import useDebounce from "../../../lib/useDebounce";
import { queryClient } from "../../_app";
import { ICDownload, ICUpload } from "../../../assets/icons";
import { useRouter } from "next/router";
import { Controller, useForm } from "react-hook-form";
import moment from "moment";

const ExchangeRate = () => {
  const router = useRouter();
  const [dataAccess, setDataAccess] = useState("");

  const {
    control,
    handleSubmit,
    register,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm();

  const pagination = usePagination({
    page: 1,
    itemsPerPage: 10,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
  });

  const [search, setSearch] = useState("");
  const [isShowUpload, setShowUpload] = useState(false);
  const debounceSearch = useDebounce(search, 1000);

  const {
    data: ExchangeData,
    isLoading: isLoadingTop,
    isFetching: isFetchingTop,
  } = useExchangeRates({
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
            key: element.code,
            id: element.code,
            exchangeCode: element.code,
            exchangeName: element.name,
            exchangeValue: element.value,
            exchangeSell: element.sell,
            exchangeBuy: element.buy,
            exchangeLastUpdated: element.last_updated,
            action: (
              <div style={{ display: "flex", justifyContent: "left" }}>
                <Button
                  size="small"
                  onClick={() => {
                    router.push(`/profit-center/${element.profitId}`);
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
      title: "Currency Code",
      dataIndex: "exchangeCode",
    },
    {
      title: "Currency Name",
      dataIndex: "exchangeName",
    },
    {
      title: "Value",
      dataIndex: "exchangeValue",
    },
    {
      title: "Sell",
      dataIndex: "exchangeSell",
    },
    {
      title: "Buy",
      dataIndex: "exchangeBuy",
    },
    {
      title: "Last Updated",
      dataIndex: "exchangeLastUpdated",
    },
  ];

  const currency = [
    {
      id: "1",
      value: "IDR - Indonesian Rupiah",
    },
    {
      id: "2",
      value: "USD - United State Dollar",
    },
    {
      id: "3",
      value: "SGD - Singapore Dollar",
    },
  ];

  const dailyAccess = [
    {
      id: "1",
      value: "Daily",
    },
    {
      id: "2",
      value: "Time Series",
    },
  ];
  const bank = [
    {
      id: "1",
      value: "Bank Indonesia",
    },
    {
      id: "2",
      value: "Bank BCA",
    },
    {
      id: "3",
      value: "Bank Mandiri",
    },
  ];
  const onSubmitFile = (file: any) => {
    const formData = new FormData();
    formData.append("company_id", "KSNI");
    formData.append("file", file);

    uploadFileTop(formData);
  };
  
  return (
    <>
      <Col>
        <Text variant={"h4"}>Exchange Rate</Text>
        <Spacer size={20} />
      </Col>
      <Card>
        <Row justifyContent="space-between">
          <Row gap="16px">
            <Search
              width="340px"
              placeholder="Search Currency Code, Name, Date etc."
              onChange={(e: any) => {
                setSearch(e.target.value);
              }}
            />
            <Dropdown
              width="200px"
              defaultValue="All"
              items={bank}
              placeholder="Select"
              handleChange={(value: any) => {}}
              rounded
            />
          </Row>
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
                    // downloadFile({ with_data: "N", company_id: "KSNI" });
                    break;
                  case 2:
                    setShowUpload(true);
                    break;
                  case 3:
                    // downloadFile({ with_data: "Y", company_id: "KSNI" });
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
          </Row>
        </Row>
      </Card>
      <Spacer size={10} />
      <Card style={{ padding: "16px 20px" }}>
        <Row width="100%" gap="14px" noWrap>
          <Col width={"40%"}>
            <Dropdown
              label="Currency"
              width={"100%"}
              items={currency}
              placeholder={"Select"}
              onSearch={() => setSearch("group")}
            />
          </Col>
          <Col width={"40%"}>
            <Dropdown
              label="Data Access"
              width={"100%"}
              items={dailyAccess}
              handleChange={(value: string) => setDataAccess(value)}
              valueSelectedItems={dataAccess}
              noSearch
              placeholder={"Select"}
            />
          </Col>
        </Row>

        <Row width="100%" gap="14px" noWrap>
          {dataAccess == "2" ? (
            <>
              <Col width={"40%"}>
                <Controller
                  control={control}
                  name={`from_date`}
                  render={({ field: { onChange } }) => (
                    <DatePickerInput
                      fullWidth
                      onChange={(date: any, dateString: any) => onChange(dateString)}
                      label="From Date"
                      defaultValue={moment()}
                      format={"DD/MM/YYYY"}
                    />
                  )}
                />
              </Col>
              <Col width={"40%"}>
                <Controller
                  control={control}
                  name={`to_date`}
                  render={({ field: { onChange } }) => (
                    <DatePickerInput
                      fullWidth
                      onChange={(date: any, dateString: any) => onChange(dateString)}
                      label="To Date"
                      defaultValue={moment()}
                      format={"DD/MM/YYYY"}
                    />
                  )}
                />
              </Col>
            </>
          ) : (
            <Col width={"40%"}>
              <Controller
                control={control}
                name={`daily_date`}
                render={({ field: { onChange } }) => (
                  <DatePickerInput
                    fullWidth
                    onChange={(date: any, dateString: any) => onChange(dateString)}
                    label="Daily Date"
                    defaultValue={moment()}
                    format={"DD/MM/YYYY"}
                  />
                )}
              />
            </Col>
          )}

          <Col
            justifyContent="flex-end"
            alignItems="center"
            style={{ paddingBottom: "5px" }}
            nowrap
          >
            <Button size="big" variant={"primary"}>
              View
            </Button>
          </Col>
        </Row>
        <Spacer size={20} />
        <Col gap={"60px"}>
          <Table
            loading={isLoadingTop || isFetchingTop}
            columns={columns}
            data={ExchangeData?.data}
          />
        </Col>
      </Card>

      {isShowUpload && (
        <FileUploadModal
          visible={isShowUpload}
          setVisible={setShowUpload}
          // onSubmit={onSubmitFile}
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

export default ExchangeRate;
