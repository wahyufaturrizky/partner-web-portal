import { useChannelsMDM } from "hooks/mdm/channel/useChannelMDM";
import { useCurrenciesInfiniteLists } from "hooks/mdm/country-structure/useCurrencyMDM";
import {
  useCreatePricingStructureDraftList,
  useCreatePricingStructureList,
  usePricingConfigInfiniteLists,
} from "hooks/pricing-structure/usePricingStructure";
import { useSalesOrganizationInfiniteLists } from "hooks/sales-organization/useSalesOrganization";
import useDebounce from "lib/useDebounce";
import { useRouter } from "next/router";
import {
  Button,
  Col,
  FormSelect,
  Row,
  Spacer,
  Spin,
  Text,
  DropdownMenuOptionCustome,
} from "pink-lava-ui";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styled from "styled-components";
import { colors } from "utils/color";

const CreatePricingStructure: any = () => {
  const [totalRowsPricingConfigInfiniteList, setTotalRowsPricingConfigInfiniteList] = useState(0);
  const [pricingConfigInfiniteList, setPricingConfigInfiniteList] = useState<any[]>([]);
  const [searchPricingConfigInfinite, setSearchPricingConfigInfinite] = useState("");

  const [totalRowsCurrenciesInfiniteList, setTotalRowsCurrenciesInfiniteList] = useState(0);
  const [currenciesInfiniteList, setCurrenciesInfiniteList] = useState<any[]>([]);
  const [searchCurrenciesInfinite, setSearchCurrenciesInfinite] = useState("");

  const [totalRowsSalesOrganizationInfiniteList, setTotalRowsSalesOrganizationInfiniteList] =
    useState(0);
  const [salesOrganizationInfiniteList, setSalesOrganizationInfiniteList] = useState<any[]>([]);
  const [searchSalesOrganizationInfinite, setSearchSalesOrganizationInfinite] = useState("");

  const router = useRouter();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    shouldUseNativeValidation: true,
    defaultValues: {
      pricing_config: "",
      currency: "",
      manage_by: "",
      distribution_channel: null,
    },
  });

  const { mutate: pricingStructure } = useCreatePricingStructureList({
    options: {
      onSuccess: () => {
        router.back();
      },
    },
  });

  const { mutate: pricingStructureDraft } = useCreatePricingStructureDraftList({
    options: {
      onSuccess: () => {
        router.back();
      },
    },
  });

  const debounceFetch = useDebounce(
    searchPricingConfigInfinite || searchSalesOrganizationInfinite || searchCurrenciesInfinite,
    1000
  );

  const {
    isFetching: isFetchingPricingConfigInfinite,
    isFetchingNextPage: isFetchingMorePricingConfigInfinite,
    hasNextPage: hasNextPagePricingConfigInfinite,
    fetchNextPage: fetchNextPagePricingConfigInfinite,
    isLoading: isLoadingPricingConfigInfinite,
  } = usePricingConfigInfiniteLists({
    query: {
      search: debounceFetch,
      limit: 10,
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRowsPricingConfigInfiniteList(data.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => {
          return group.rows?.map((element: any) => {
            return {
              value: element.id,
              label: element.name,
            };
          });
        });
        const flattenArray = [].concat(...mappedData);
        setPricingConfigInfiniteList(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (pricingConfigInfiniteList.length < totalRowsPricingConfigInfiniteList) {
          return pages.length + 1;
        } else {
          return undefined;
        }
      },
    },
  });

  const {
    data: channelsMDMData,
    isLoading: isLoadingChannelsMDM,
    isFetching: isFetchingChannelsMDM,
  } = useChannelsMDM({
    query: {
      search: debounceFetch,
      limit: 10000,
    },
    options: {
      onSuccess: (data: any) => {},
    },
  });

  const {
    isFetching: isFetchingSalesOrganizationInfinite,
    isFetchingNextPage: isFetchingMoreSalesOrganizationInfinite,
    hasNextPage: hasNextPageSalesOrganizationInfinite,
    fetchNextPage: fetchNextPageSalesOrganizationInfinite,
    isLoading: isLoadingSalesOrganizationInfinite,
  } = useSalesOrganizationInfiniteLists({
    query: {
      search: debounceFetch,
      limit: 10,
      company_code: "KSNI",
    },
    options: {
      onSuccess: (data: any) => {
        console.log("@data", data);

        setTotalRowsSalesOrganizationInfiniteList(data.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => {
          return group.salesOrganizationStructures?.map((element: any) => {
            return {
              value: element.id,
              label: element.name,
            };
          });
        });
        const flattenArray = [].concat(...mappedData);
        setSalesOrganizationInfiniteList(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (salesOrganizationInfiniteList.length < totalRowsSalesOrganizationInfiniteList) {
          return pages.length + 1;
        } else {
          return undefined;
        }
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
      search: debounceFetch,
      limit: 10,
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRowsCurrenciesInfiniteList(data.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => {
          return group.rows?.map((element: any) => {
            return {
              value: element.id,
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

  const onSubmit = (data: any) => {
    pricingStructure(data);
  };

  const onSubmitDraft = (data: any) => {
    pricingStructureDraft(data);
  };

  return (
    <>
      {isLoadingPricingConfigInfinite ||
      isLoadingCurrenciesInfinite ||
      isLoadingChannelsMDM ||
      isFetchingChannelsMDM ||
      isLoadingSalesOrganizationInfinite ? (
        <Center>
          <Spin tip="Loading data..." />
        </Center>
      ) : (
        <Col>
          <Row gap="4px">
            <Text variant={"h4"}>Create Pricing Structure Proposal</Text>
          </Row>

          <Spacer size={12} />

          <Card padding="20px">
            <Row gap="16px" justifyContent="flex-end">
              <Button size="big" variant={"tertiary"} onClick={() => router.back()}>
                Cancel
              </Button>
              <Button size="big" variant={"secondary"} onClick={handleSubmit(onSubmitDraft)}>
                Save as Draft
              </Button>
              <Button size="big" variant={"primary"} onClick={handleSubmit(onSubmit)}>
                Submit
              </Button>
            </Row>
          </Card>

          <Spacer size={12} />

          <Card padding="20px">
            <Text color={"blue.dark"} variant={"headingMedium"}>
              Pricing Structure
            </Text>

            <Spacer size={12} />

            <Col width="100%" gap="20px">
              <Row width="100%" gap="20px" noWrap>
                <Col width={"100%"}>
                  <Controller
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: "Please enter pricing config.",
                      },
                    }}
                    name="pricing_config"
                    render={({ field: { onChange }, fieldState: { error } }) => (
                      <>
                        <Label>
                          Price Structure Config
                          <span style={{ color: colors.red.regular }}>*</span>
                        </Label>
                        <Spacer size={3} />
                        <FormSelect
                          error={error?.message}
                          height="48px"
                          style={{ width: "100%" }}
                          size={"large"}
                          placeholder={"Select"}
                          borderColor={error?.message ? "#ED1C24" : "#AAAAAA"}
                          arrowColor={"#000"}
                          withSearch
                          isLoading={isFetchingPricingConfigInfinite}
                          isLoadingMore={isFetchingMorePricingConfigInfinite}
                          fetchMore={() => {
                            if (hasNextPagePricingConfigInfinite) {
                              fetchNextPagePricingConfigInfinite();
                            }
                          }}
                          items={
                            isFetchingPricingConfigInfinite && !isFetchingMorePricingConfigInfinite
                              ? []
                              : pricingConfigInfiniteList
                          }
                          onChange={(value: any) => {
                            onChange(value);
                          }}
                          onSearch={(value: any) => {
                            setSearchPricingConfigInfinite(value);
                          }}
                        />
                      </>
                    )}
                  />
                </Col>
                <Spacer size={10} />

                <Col width="100%">
                  <Controller
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: "Please enter currency.",
                      },
                    }}
                    name="currency"
                    render={({ field: { onChange }, fieldState: { error } }) => (
                      <>
                        <Label>
                          Currency
                          <span style={{ color: colors.red.regular }}>*</span>
                        </Label>
                        <Spacer size={3} />
                        <FormSelect
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
                            isFetchingCurrenciesInfinite && !isFetchingCurrenciesInfinite
                              ? []
                              : currenciesInfiniteList
                          }
                          onChange={(value: any) => {
                            onChange(value);
                          }}
                          onSearch={(value: any) => {
                            setSearchCurrenciesInfinite(value);
                          }}
                        />
                      </>
                    )}
                  />
                </Col>
              </Row>

              <Row width="100%" gap="20px" noWrap>
                <Col width={"100%"}>
                  <Controller
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: "Please enter Manage By.",
                      },
                    }}
                    name="manage_by"
                    render={({ field: { onChange }, fieldState: { error } }) => (
                      <>
                        <Label>
                          Manage By
                          <span style={{ color: colors.red.regular }}>*</span>
                        </Label>
                        <Spacer size={3} />
                        <FormSelect
                          error={error?.message}
                          height="48px"
                          style={{ width: "100%" }}
                          size={"large"}
                          placeholder={"Select"}
                          borderColor={error?.message ? "#ED1C24" : "#AAAAAA"}
                          arrowColor={"#000"}
                          withSearch
                          isLoading={isFetchingSalesOrganizationInfinite}
                          isLoadingMore={isFetchingMoreSalesOrganizationInfinite}
                          fetchMore={() => {
                            if (hasNextPageSalesOrganizationInfinite) {
                              fetchNextPageSalesOrganizationInfinite();
                            }
                          }}
                          items={
                            isFetchingSalesOrganizationInfinite &&
                            !isFetchingMoreSalesOrganizationInfinite
                              ? []
                              : salesOrganizationInfiniteList
                          }
                          onChange={(value: any) => {
                            onChange(value);
                          }}
                          onSearch={(value: any) => {
                            setSearchSalesOrganizationInfinite(value);
                          }}
                        />
                      </>
                    )}
                  />
                </Col>
                <Spacer size={10} />

                <Col width="100%">
                  <Controller
                    control={control}
                    name="distribution_channel"
                    rules={{
                      required: {
                        value: true,
                        message: "Please enter Distribution Channel.",
                      },
                    }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => {
                      return (
                        <DropdownMenuOptionCustome
                          label="Distribution Channel"
                          actionLabel="Add New Distribution Channel"
                          isShowActionLabel
                          handleClickActionLabel={() => window.open("/channel")}
                          isAllowClear
                          required
                          error={error?.message}
                          handleChangeValue={(value: string[]) => onChange(value)}
                          valueSelectedItems={value || []}
                          listItems={channelsMDMData?.rows?.map(
                            ({
                              name,
                              salesChannelId,
                            }: {
                              name: string;
                              salesChannelId: string;
                            }) => {
                              return { value: salesChannelId, label: name };
                            }
                          )}
                        />
                      );
                    }}
                  />
                </Col>
              </Row>
            </Col>
          </Card>

          <Spacer size={12} />

          <Card padding="20px">
            <Text color={"blue.dark"} variant={"headingMedium"}>
              Products
            </Text>

            <Spacer size={12} />

            <Col width="100%" gap="20px">
              {/*  */}
            </Col>
          </Card>
        </Col>
      )}
    </>
  );
};

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: ${(p) => (p.padding ? p.padding : "16px")};
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Label = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  color: #000000;
`;

export default CreatePricingStructure;
