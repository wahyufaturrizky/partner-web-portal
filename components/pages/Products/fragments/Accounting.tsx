import React, { useState } from 'react'
import {
  Col,
  Row,
  Spacer,
  Text,
  FormSelect,
} from "pink-lava-ui";
import { Controller, useWatch } from 'react-hook-form'
import styled from 'styled-components';
import useDebounce from '../../../../lib/useDebounce';
import { useCoaInfiniteLists } from '../../../../hooks/finance-config/useCoaTemplate';

export default function Accounting({ control, accounting }: any) {

  const [totalRowsCoaTemplateReceivable, setTotalRowsCoaTemplateReceivable] = useState(0);
  const [searchCoaTemplateReceivable, setSearchCoaTemplateReceivable] = useState("");
  const debounceFetchCoaTemplateReceivable = useDebounce(searchCoaTemplateReceivable, 1000);
  const [listCoaTemplateReceivable, setListCoaTemplateReceivable] = useState<any[]>([]);
  
  const {
    isFetching: isFetchingCoaTemplateReceivable,
    isFetchingNextPage: isFetchingMoreCoaTemplateReceivable,
    hasNextPage: hasNextCoaTemplateReceivable,
    fetchNextPage: fetchNextPageCoaTemplateReceivable,
  } = useCoaInfiniteLists({
    query: {
      search: debounceFetchCoaTemplateReceivable,
      limit: 10,
      account_type: 'PAYABLE',
      company_code: 'KSNI',
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRowsCoaTemplateReceivable(data.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => {
          return group.rows?.map((element: any) => {
            return {
              value: element.accountCode,
              label: element.accountName,
            };
          });
        });
        const flattenArray = [].concat(...mappedData);
        setListCoaTemplateReceivable(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (listCoaTemplateReceivable.length < totalRowsCoaTemplateReceivable) {
          return pages.length + 1;
        } else {
          return undefined;
        }
      },
    },
  });

  const [totalRowsCoaTemplatePayable, setTotalRowsCoaTemplatePayable] = useState(0);
  const [searchCoaTemplatePayable, setSearchCoaTemplatePayable] = useState("");
  const debounceFetchCoaTemplatePayable = useDebounce(searchCoaTemplatePayable, 1000);
  const [listCoaTemplatePayable, setListCoaTemplatePayable] = useState<any[]>([]);
  
  const {
    isFetching: isFetchingCoaTemplatePayable,
    isFetchingNextPage: isFetchingMoreCoaTemplatePayable,
    hasNextPage: hasNextCoaTemplatePayable,
    fetchNextPage: fetchNextPageCoaTemplatePayable,
  } = useCoaInfiniteLists({
    query: {
      search: debounceFetchCoaTemplatePayable,
      limit: 10,
      account_type: 'RECEIVABLE',
      company_code: 'KSNI',
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRowsCoaTemplatePayable(data.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => {
          return group.rows?.map((element: any) => {
            return {
              value: element.accountCode,
              label: element.accountName,
            };
          });
        });
        const flattenArray = [].concat(...mappedData);
        setListCoaTemplatePayable(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (listCoaTemplatePayable.length < totalRowsCoaTemplatePayable) {
          return pages.length + 1;
        } else {
          return undefined;
        }
      },
    },
  });

  const accountingForm = useWatch({
    control,
    name: 'accounting'
  });

  return (
    <Row width="100%" noWrap>
      <Col width={"50%"}>
        <Spacer size={36} />
        <Text variant="headingMedium" color="blue.darker">Account Receivable</Text>
        <Spacer size={20} />
        <Controller
            control={control}
            name="accounting.income_account.id"
            defaultValue={accountingForm?.income_account?.name}
            render={({ field: { onChange } }) => (
              <>
                <span>
                  <Label style={{ display: "inline" }}>Income Account</Label>{" "}
                  <span></span>
                </span>

                <Spacer size={3} />
                <CustomFormSelect
                  defaultValue={accountingForm?.income_account?.name}
                  style={{ width: "100%", height: '48px' }}
                  size={"large"}
                  placeholder={"Select"}
                  borderColor={"#AAAAAA"}
                  arrowColor={"#000"}
                  withSearch
                  isLoading={isFetchingCoaTemplateReceivable}
                  isLoadingMore={isFetchingMoreCoaTemplateReceivable}
                  fetchMore={() => {
                    if (hasNextCoaTemplateReceivable) {
                      fetchNextPageCoaTemplateReceivable();
                    }
                  }}
                  items={
                    isFetchingCoaTemplateReceivable || isFetchingMoreCoaTemplateReceivable
                      ? []
                      : listCoaTemplateReceivable
                  }
                  onChange={(value: any) => {
                    onChange(value);
                  }}
                  onSearch={(value: any) => {
                    setSearchCoaTemplateReceivable(value);
                  }}
                />
              </>
            )}
          />
        <Spacer size={73} />
        <Text variant="headingMedium" color="blue.darker">Account Payable</Text>
        <Spacer size={20} />
        <Controller
            control={control}
            name="accounting.expense_account.id"
            defaultValue={accountingForm?.expense_account?.name}
            render={({ field: { onChange } }) => (
              <>
                <span>
                  <Label style={{ display: "inline" }}>Expense Account</Label>{" "}
                  <span></span>
                </span>

                <Spacer size={3} />
                <CustomFormSelect
                  defaultValue={accountingForm?.expense_account?.name}
                  style={{ width: "100%", height: '48px' }}
                  size={"large"}
                  placeholder={"Select"}
                  borderColor={"#AAAAAA"}
                  arrowColor={"#000"}
                  withSearch
                  isLoading={isFetchingCoaTemplatePayable}
                  isLoadingMore={isFetchingMoreCoaTemplatePayable}
                  fetchMore={() => {
                    if (hasNextCoaTemplatePayable) {
                      fetchNextPageCoaTemplatePayable();
                    }
                  }}
                  items={
                    isFetchingCoaTemplatePayable || isFetchingMoreCoaTemplatePayable
                      ? []
                      : listCoaTemplatePayable
                  }
                  onChange={(value: any) => {
                    onChange(value);
                  }}
                  onSearch={(value: any) => {
                    setSearchCoaTemplatePayable(value);
                  }}
                />
              </>
            )}
          />
      </Col>
    </Row>
  )
}

const CustomFormSelect = styled(FormSelect)`
  
  .ant-select-selection-placeholder {
    line-height: 48px !important;
  }

  .ant-select-selection-search-input {
    height: 48px !important;
  }

  .ant-select-selector {
    height: 48px !important;
  }

  .ant-select-selection-item {
    display: flex;
    align-items: center;
  }
`

const Label = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  color: #000000;
`;