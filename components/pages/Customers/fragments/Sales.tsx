import { Checkbox, Col, Dropdown, Row, Spacer, Text } from "pink-lava-ui";
import { useState } from "react";
import { Controller } from "react-hook-form";
import styled from "styled-components";

import { useBranchList } from "hooks/mdm/branch/useBranch";
import { useFetchListSalesman } from "hooks/mdm/salesman/useSalesman";
import { useTermOfPayments } from "hooks/mdm/term-of-payment/useTermOfPayment";
import { listSalesItems } from "../constants";

export default function Sales(props: any) {
  const { register, setValue, control } = props;
  const [search, setSearch] = useState({
    branch: null,
    term_payment: "",
    salesman: null,
    sales_order_blocking: "",
    billing_blocking: "",
    delivery_order_blocking: "",
  });

  const { data: listSalesman } = useFetchListSalesman({
    options: { onSuccess: () => {} },
    query: { status: 0, search: search.salesman },
  });

  const { data: listTermOfPayment } = useTermOfPayments({
    options: { onSuccess: () => {} },
    query: { company_id: "KSNI", search: search.term_payment },
  });

  const { data: listBranch } = useBranchList({
    options: { onSuccess: () => {} },
    query: { company_id: "KSNI", search: search.branch },
  });

  const _listSalesman = listSalesman?.rows?.map((items: any) => ({
    value: items?.division,
    id: items?.id,
  }));

  const _listTermOfPayment = listTermOfPayment?.rows?.map((item: any) => ({
    value: item?.name,
    id: item?.topId,
  }));

  const _listBranch = listBranch?.rows?.map((item: any) => ({
    value: item?.name,
    id: item?.id,
  }));

  return (
    <div>
      <Label>Sales</Label>
      <Spacer size={20} />
      <Row gap="10px" width="100%">
        <Col width="48%">
          <Controller
            control={control}
            name="sales.branch"
            render={({ field: { onChange, value } }) => (
              <Dropdown
                width="100%"
                defaultValue={value}
                label="Branch"
                actionLabel="Add New Branch"
                items={_listBranch}
                handleChange={onChange}
                onSearch={(value: string) => setSearch({ ...search, branch: value })}
              />
            )}
          />
          <Spacer size={20} />
          <Controller
            control={control}
            name="sales.term_payment"
            render={({ field: { onChange, value } }) => (
              <Dropdown
                noSearch
                defaultValue={value}
                isShowActionLabel
                width="100%"
                label="Term of Payment"
                actionLabel="Add New Term of Payment"
                handleChange={onChange}
                items={_listTermOfPayment}
                onSearch={(value: string) => setSearch({ ...search, term_payment: value })}
              />
            )}
          />
        </Col>
        <Col width="48%">
          <Controller
            control={control}
            name="sales.salesman"
            render={({ field: { onChange } }) => (
              <Dropdown
                actionLabel="Add New Salesman"
                label="Salesman"
                width="100%"
                isShowActionLabel
                handleChange={onChange}
                handleClickActionLabel={() => window.open("/salesman/create")}
                onSearch={(value: string) => setSearch({ ...search, salesman: value })}
                items={_listSalesman}
              />
            )}
          />
        </Col>
      </Row>
      <Spacer size={50} />
      <Label>Sales Order Information</Label>
      <Spacer size={20} />
      {listSalesItems.map(({ value, label }, index) => (
        <>
          <Controller
            control={control}
            name={`sales.${value}`}
            render={({ field: { onChange, value } }) => {
              return (
                <>
                  <Row key={index} alignItems="center">
                    <Checkbox checked={value} onChange={onChange} />
                    <Text>{label}</Text>
                  </Row>
                  <Spacer size={20} />
                </>
              );
            }}
          />
        </>
      ))}
    </div>
  );
}

const Label = styled.p`
  font-weight: 600;
  font-size: 20px;
  line-height: 27px;
  color: #1e858e;
`;
