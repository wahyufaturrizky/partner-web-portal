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

  const [totalRowsCoaTemplate, setTotalRowsCoaTemplate] = useState(0);
  const [searchCoaTemplate, setSearchCoaTemplate] = useState("");
  const debounceFetchCoaTemplate = useDebounce(searchCoaTemplate, 1000);
  const [listCoaTemplate, setListCoaTemplate] = useState<any[]>([]);
  
  const {
    isFetching: isFetchingCoaTemplate,
    isFetchingNextPage: isFetchingMoreCoaTemplate,
    hasNextPage: hasNextCoaTemplate,
    fetchNextPage: fetchNextPageCoaTemplate,
  } = useCoaInfiniteLists({
    query: {
      search: debounceFetchCoaTemplate,
      limit: 10,
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRowsCoaTemplate(data.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => {
          return group.rows?.map((element: any) => {
            return {
              value: element.id,
              label: element.name,
            };
          });
        });
        const flattenArray = [].concat(...mappedData);
        setListCoaTemplate(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (listCoaTemplate.length < totalRowsCoaTemplate) {
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
            defaultValue={accountingForm?.income_account?.value}
            render={({ field: { onChange } }) => (
              <>
                <span>
                  <Label style={{ display: "inline" }}>Income Account</Label>{" "}
                  <span></span>
                </span>

                <Spacer size={3} />
                <CustomFormSelect
                  defaultValue={accountingForm?.income_account?.value}
                  style={{ width: "100%", height: '48px' }}
                  size={"large"}
                  placeholder={"Select"}
                  borderColor={"#AAAAAA"}
                  arrowColor={"#000"}
                  withSearch
                  isLoading={isFetchingCoaTemplate}
                  isLoadingMore={isFetchingMoreCoaTemplate}
                  fetchMore={() => {
                    if (hasNextCoaTemplate) {
                      fetchNextPageCoaTemplate();
                    }
                  }}
                  items={
                    isFetchingCoaTemplate || isFetchingMoreCoaTemplate
                      ? []
                      : listCoaTemplate
                  }
                  onChange={(value: any) => {
                    onChange(value);
                  }}
                  onSearch={(value: any) => {
                    setSearchCoaTemplate(value);
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
            defaultValue={accountingForm?.expense_account?.value}
            render={({ field: { onChange } }) => (
              <>
                <span>
                  <Label style={{ display: "inline" }}>Expense Account</Label>{" "}
                  <span></span>
                </span>

                <Spacer size={3} />
                <CustomFormSelect
                  defaultValue={accountingForm?.expense_account?.value}
                  style={{ width: "100%", height: '48px' }}
                  size={"large"}
                  placeholder={"Select"}
                  borderColor={"#AAAAAA"}
                  arrowColor={"#000"}
                  withSearch
                  isLoading={isFetchingCoaTemplate}
                  isLoadingMore={isFetchingMoreCoaTemplate}
                  fetchMore={() => {
                    if (hasNextCoaTemplate) {
                      fetchNextPageCoaTemplate();
                    }
                  }}
                  items={
                    isFetchingCoaTemplate || isFetchingMoreCoaTemplate
                      ? []
                      : listCoaTemplate
                  }
                  onChange={(value: any) => {
                    onChange(value);
                  }}
                  onSearch={(value: any) => {
                    setSearchCoaTemplate(value);
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