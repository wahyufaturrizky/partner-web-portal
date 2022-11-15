import React, { useState } from "react";
import {
  Col,
  Row,
  Spacer,
  Text,
  FormSelect,
  Checkbox,
  DropdownMenuOptionCustom,
  Spin,
} from "pink-lava-ui";
import { useTopInfiniteLists } from "hooks/mdm/term-of-payment/useTermOfPayment";
import { usePurchaseOrgInfiniteList } from "hooks/mdm/purchase-organization/usePurchaseOrganizationMDM";
import useDebounce from "lib/useDebounce";
import { useFormContext, Controller } from "react-hook-form";
import styled from "styled-components";

const Purchasing = () => {
  const { control } = useFormContext();

  const [listTop, setListTop] = useState<any[]>([]);
  const [totalRowsTop, setTotalRowsTop] = useState(0);

  const [purchaseOrgList, setPurchaseOrgList] = useState<any[]>([]);
  const [totalRowsPurchaseOrgList, setTotalRowsPurchaseOrgList] = useState(0);
  const [selectedPurchaseOrg, setSelectedPurchaseOrg] = useState([]);

  const [searchTop, setSearchTop] = useState("");
  const debounceSearchTop = useDebounce(searchTop, 1000);

  const [searchPurchaseOrg, setSearchPurchaseOrg] = useState("");
  const debounceSearchPurchaseOrg = useDebounce(searchPurchaseOrg, 1000);

  const {
    isLoading: isLoadingTop,
    isFetching: isFetchingTop,
    isFetchingNextPage: isFetchingMoreTop,
    hasNextPage: hasNextTop,
    fetchNextPage: fetchNextPageTop,
  } = useTopInfiniteLists({
    query: {
      search: debounceSearchTop,
      company_id: "KSNI",
      limit: 10,
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRowsTop(data?.pages[0].totalRow);
        console.log(data);
        const mappedData = data?.pages?.map((group: any) => {
          return group.rows?.map((element: any) => {
            return {
              label: element.name,
              value: element.topId,
            };
          });
        });
        const flattenArray = [].concat(...mappedData);
        setListTop(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (listTop.length < totalRowsTop) {
          return pages.length + 1;
        } else {
          return undefined;
        }
      },
    },
  });

  const {
    isLoading: isLoadingPurchasingOrg,
    isFetching: isFetchingPurchaseOrg,
    isFetchingNextPage: isFetchingMorePurchaseOrg,
    hasNextPage: hasNextPagePagePurchaseOrg,
    fetchNextPage: fetchNextPagePurchaseOrg,
  } = usePurchaseOrgInfiniteList({
    query: {
      search: debounceSearchPurchaseOrg,
      company: "KSNI",
      limit: 10,
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRowsPurchaseOrgList(data.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => {
          return group.rows?.map((element: any) => {
            return {
              value: element.code,
              label: element.name,
            };
          });
        });
        const flattenArray = [].concat(...mappedData);
        setPurchaseOrgList(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (purchaseOrgList.length < totalRowsPurchaseOrgList) {
          return pages.length + 1;
        } else {
          return undefined;
        }
      },
    },
  });

  return (
    <Col>
      <Text variant="headingMedium" color={"blue.dark"}>
        Payment
      </Text>

      <Spacer size={20} />

      <Controller
        control={control}
        name={`purchasing.term_of_payment`}
        defaultValue={""}
        render={({ field: { onChange, value }, formState: { errors } }) => (
          <>
            {isLoadingTop ? (
              <Center>
                <Spin tip="" />
              </Center>
            ) : (
              <>
                <Text variant="headingRegular">Term of Payment</Text>
                <Spacer size={5} />
                <FormSelect
                  defaultValue={value}
                  style={{ width: "100%" }}
                  size={"large"}
                  placeholder={"Select"}
                  borderColor={"#AAAAAA"}
                  arrowColor={"#000"}
                  withSearch
                  isLoading={isFetchingTop}
                  isLoadingMore={isFetchingMoreTop}
                  fetchMore={() => {
                    if (hasNextTop) {
                      fetchNextPageTop();
                    }
                  }}
                  items={isFetchingTop && !isFetchingMoreTop ? [] : listTop}
                  onChange={(value: any) => {
                    onChange(value?.toString());
                  }}
                  onSearch={(value: any) => {
                    setSearchTop(value);
                  }}
                />
              </>
            )}
          </>
        )}
      />

      <Spacer size={20} />

      <Text variant="headingMedium" color={"blue.dark"}>
        Purchase Organization
      </Text>

      <Spacer size={20} />

      <Controller
        control={control}
        name={`purchasing.purchase_organization`}
        defaultValue={selectedPurchaseOrg}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            {isLoadingPurchasingOrg ? (
              <Center>
                <Spin tip="" />
              </Center>
            ) : (
              <DropdownMenuOptionCustom
                label="Purchase Group Name"
                maxTagCount={"responsive"}
                mode="multiple"
                placeholder="Select"
                labelInValue
                filterOption={false}
                value={selectedPurchaseOrg}
                isLoading={isFetchingPurchaseOrg}
                isLoadingMore={isFetchingMorePurchaseOrg}
                listItems={
                  isFetchingPurchaseOrg && !isFetchingMorePurchaseOrg ? [] : purchaseOrgList
                }
                fetchMore={() => {
                  if (hasNextPagePagePurchaseOrg) {
                    fetchNextPagePurchaseOrg();
                  }
                }}
                onSearch={(value: any) => {
                  setSearchPurchaseOrg(value);
                }}
                onChange={(value: any) => {
                  onChange(value.map((data: any) => data.value));
                  setSelectedPurchaseOrg(value);
                }}
                valueSelectedItems={selectedPurchaseOrg}
                allowClear={true}
                onClear={() => {
                  setSearchPurchaseOrg("");
                }}
              />
            )}
          </>
        )}
      />

      <Spacer size={20} />

      <Text variant="headingMedium" color={"blue.dark"}>
        Purchase Organization
      </Text>

      <Spacer size={20} />

      <Controller
        control={control}
        name={`purchasing.po_blocking`}
        defaultValue={false}
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          return (
            <Row>
              <Checkbox
                checked={value}
                onChange={() => {
                  onChange(!value);
                }}
              />
              <Spacer size={8} display="inline-block" />
              <Text variant="headingRegular">Purhcase Order Blocking</Text>
            </Row>
          );
        }}
      />

      <Spacer size={5} />

      <Controller
        control={control}
        name={`purchasing.billing_blocking`}
        defaultValue={false}
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          return (
            <Row>
              <Checkbox
                checked={value}
                onChange={() => {
                  onChange(!value);
                }}
              />
              <Spacer size={8} display="inline-block" />
              <Text variant="headingRegular">Invoice/Billing Blocking</Text>
            </Row>
          );
        }}
      />

      <Spacer size={5} />
      <Controller
        control={control}
        name={`purchasing.receipt_blocking`}
        defaultValue={false}
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          return (
            <Row>
              <Checkbox
                checked={value}
                onChange={() => {
                  onChange(!value);
                }}
              />
              <Spacer size={8} display="inline-block" />
              <Text variant="headingRegular">Good Receipt Blocking</Text>
            </Row>
          );
        }}
      />
    </Col>
  );
};

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default Purchasing;
