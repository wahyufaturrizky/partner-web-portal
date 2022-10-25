import React, { useEffect, useState } from "react";
import { Row, Col, Spacer, Checkbox, Text, Dropdown } from "pink-lava-ui";
import styled from "styled-components";
import { Controller } from "react-hook-form";

import { useTermOfPayments } from "hooks/mdm/term-of-payment/useTermOfPayment";
import { useBranchList } from "hooks/mdm/branch/useBranch";
import { useFetchListSalesman } from "hooks/mdm/salesman/useSalesman";
import { listSalesItems } from "../constants";

export default function Sales(props: any) {
  const { register, setValue, control, checked, setChecked } = props;
  const [search, setSearch] = useState({
    branch: null,
    termOfPayment: "",
    salesman: "",
  });

  const { data: listSalesman } = useFetchListSalesman({
    options: { onSuccess: () => {} },
    query: { status: 0, search: search.salesman },
  });

  const { data: listTermOfPayment } = useTermOfPayments({
    options: { onSuccess: () => {} },
    query: { company_id: "KSNI", search: search.termOfPayment },
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
    id: item?.branchId,
  }));

  useEffect(() => {
    listSalesItems.map(({ value }) => {
      register(`sales.${value}`, checked[value]);
      setValue(`sales.${value}`, checked[value]);
    });
  }, [checked, setValue, register]);

  return (
    <div>
      <Label>Sales</Label>
      <Spacer size={20} />
      <Row gap="10px" width="100%">
        <Col width="48%">
          <Controller
            control={control}
            name="sales.branch"
            render={({ field: { onChange } }) => (
              <Dropdown
                width="100%"
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
            render={({ field: { onChange } }) => (
              <Dropdown
                noSearch
                isShowActionLabel
                width="100%"
                label="Term of Payment"
                actionLabel="Add New Term of Payment"
                handleChange={onChange}
                items={_listTermOfPayment}
                onSearch={(value: string) => setSearch({ ...search, termOfPayment: value })}
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
          <Row key={index} alignItems="center">
            <Checkbox
              checked={checked[value]}
              onChange={(status: any) => {
                setChecked({ ...checked, [value]: status });
                register(`sales.${value}`, checked[value]);
                setValue(`sales.${value}`, checked[value]);
              }}
            />
            <Text>{label}</Text>
          </Row>
          <Spacer size={20} />
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
