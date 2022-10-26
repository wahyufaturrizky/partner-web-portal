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
  FormSelect,
} from "pink-lava-ui";
import usePagination from "@lucasmogari/react-pagination";
import {
  useExchangeRates,
  useUploadFileExchangeRate,
} from "../../../hooks/mdm/exchange-rate/useExchangeRate";
import useDebounce from "../../../lib/useDebounce";
import { queryClient } from "../../_app";
import { ICDownload, ICUpload } from "../../../assets/icons";
import { useRouter } from "next/router";
import { Controller, useForm } from "react-hook-form";
import moment from "moment";
import { mdmDownloadService } from "lib/client";
import { useCurrenciesInfiniteLists } from "hooks/mdm/country-structure/useCurrencyMDM";

const downloadFile = (params: any) =>
  mdmDownloadService("/exchange-rate/download", { params }).then((res) => {
    let dataUrl = window.URL.createObjectURL(new Blob([res.data]));
    let tempLink = document.createElement("a");
    tempLink.href = dataUrl;
    tempLink.setAttribute("download", `exchange-rate${new Date().getTime()}.xlsx`);
    tempLink.click();
  });

const ExchangeRate = () => {
  const router = useRouter();
  const [dataAccess, setDataAccess] = useState("1");
  const [dataCurrency, setDataCurrency] = useState("");
  const [dataFromDate, setDataFromDate] = useState("");
  const [dataToDate, setDataToDate] = useState("");
  const [totalRowsCurrenciesInfiniteList, setTotalRowsCurrenciesInfiniteList] = useState(0);
  const [currenciesInfiniteList, setCurrenciesInfiniteList] = useState<any[]>([]);
  const [searchCurrenciesInfinite, setSearchCurrenciesInfinite] = useState("");
  const debounceFetchCurrenciesInfinite = useDebounce(searchCurrenciesInfinite, 1000);

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
    itemsPerPage: 20,
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
    isLoading: isLoadingExchange,
    isFetching: isFetchingExchange,
  } = useExchangeRates({
    query: {
      search: debounceSearch,
      page: pagination.page,
      limit: pagination.itemsPerPage,
      company_id: "KSNI",
      currency: dataCurrency,
      start_date: dataFromDate,
      end_date: dataToDate,
    },
    options: {
      onSuccess: (data: any) => {
        pagination.setTotalItems(data.totalRow);
      },
      select: (data: any) => {
        const mappedData = data?.rows?.map((element: any) => {
          return {
            key: element.exchangeRateId,
            id: element.exchangeRateId,
            exchangeCode: element.currencyCode,
            exchangeName: element.currencyName,
            exchangeValue: element.value,
            exchangeSell: element.sell,
            exchangeBuy: element.buy,
            exchangeLastUpdated: moment(element.modifiedAt).format("DD/MM/YYYY"),
          };
        });

        return { data: mappedData, totalRow: data.totalRow };
      },
    },
  });

  const { mutate: uploadFileExchange, isLoading: isLoadingUploadFileExchange } =
    useUploadFileExchangeRate({
      options: {
        onSuccess: () => {
          queryClient.invalidateQueries(["exchange-rate-list"]);
          setShowUpload(false);
        },
      },
    });

  const {
    isFetching: isFetchingCurrenciesInfinite,
    isFetchingNextPage: isFetchingMoreCurrenciesInfinite,
    hasNextPage: hasNextPageCurrenciesInfinite,
    fetchNextPage: fetchNextPageCurrenciesInfinite,
    isLoading: isLoadingCurrenciesInfinite,
  } = useCurrenciesInfiniteLists({
    query: {
      search: debounceFetchCurrenciesInfinite,
      limit: 10,
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRowsCurrenciesInfiniteList(data.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => {
          return group.rows?.map((element: any) => {
            return {
              ...element,
              value: element.currency,
              label: `${element.currency} - ${element.currencyName}`,
            };
          });
        });
        const flattenArray = [].concat(...mappedData);
        setCurrenciesInfiniteList(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (currenciesInfiniteList.length < totalRowsCurrenciesInfiniteList) {
          return pages.length + 1;
        } else {
          return undefined;
        }
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

    uploadFileExchange(formData);
  };

  const onSubmit = (data) => {
    console.log(data);
    
    if (dataAccess == "1") {
      setDataCurrency(data.currency);
      setDataFromDate(data.from_date);
      setDataToDate(data.from_date);
    } else {
      setDataCurrency(data.currency);
      setDataFromDate(data.from_date);
      setDataToDate(data.to_date);
    }
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
          </Row>
        </Row>
      </Card>
      <Spacer size={10} />
      <Card style={{ padding: "16px 20px" }}>
        <Row width="100%" gap="14px" noWrap>
          <Col width={"40%"}>
            <Controller
              control={control}
              name="currency"
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <>
                  <Label>Currency</Label>
                  <Spacer size={3} />
                  <FormSelect
                    defaultValue={value}
                    error={error?.message}
                    height="48px"
                    style={{ width: "100%" }}
                    size={"large"}
                    placeholder={"Select"}
                    borderColor={error?.message ? "#ED1C24" : "#AAAAAA"}
                    arrowColor={"#000"}
                    withSearch
                    isLoading={isFetchingCurrenciesInfinite}
                    isLoadingMore={isFetchingMoreCurrenciesInfinite}
                    fetchMore={() => {
                      if (hasNextPageCurrenciesInfinite) {
                        fetchNextPageCurrenciesInfinite();
                      }
                    }}
                    items={
                      isFetchingCurrenciesInfinite && !isFetchingMoreCurrenciesInfinite
                        ? []
                        : currenciesInfiniteList
                    }
                    onChange={(value: any) => {
                      onChange(value);
                      setSearchCurrenciesInfinite("");
                    }}
                    onSearch={(value: any) => {
                      setSearchCurrenciesInfinite(value);
                    }}
                  />
                </>
              )}
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
                  defaultValue={moment().format("DD/MM/YYYY")}
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
                  defaultValue={moment().format("DD/MM/YYYY")}
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
                name={`from_date`}
                defaultValue={moment().format("DD/MM/YYYY")}
                render={({ field: { onChange } }) => (
                  <DatePickerInput
                    fullWidth
                    onChange={(date: any, dateString: any) => onChange(dateString)}
                    label="Daily Date"
                    // defaultValue={moment()}
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
            <Button size="big" variant={"primary"} onClick={handleSubmit(onSubmit)}>
              View
            </Button>
          </Col>
        </Row>
        <Spacer size={20} />
        <Col gap={"60px"}>
          <Table
            loading={isLoadingExchange || isFetchingExchange}
            columns={columns}
            data={ExchangeData?.data}
          />
        </Col>
      </Card>

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
const Label = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  color: #000000;
`;

export default ExchangeRate;
