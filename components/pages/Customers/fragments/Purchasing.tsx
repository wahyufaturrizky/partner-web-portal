import React from "react";
import styled from "styled-components";
import { Spacer, Dropdown } from "pink-lava-ui";

import { useTermOfPayments } from "../../../../hooks/mdm/term-of-payment/useTermOfPayment";
import { Controller } from "react-hook-form";

export default function Purchasing(props: any) {
  const { control } = props;

  const { data: getDataTermOfPayment } = useTermOfPayments({
    options: {
      onSuccess: () => {},
    },
    query: {
      company_id: "KSNI",
    },
  });

  const listItemsOfPayment = getDataTermOfPayment?.rows?.map(({ topId, name }: any) => {
    return { value: name, id: topId };
  });

  return (
    <div>
      <Label>Payment</Label>
      <Spacer size={20} />
      <Controller
        control={control}
        name="purchasing.term_of_payment"
        render={({ field: { onChange, value } }) => (
          <>
            <Dropdown
              defaultValue={value}
              label="Term of Payment"
              width="70%"
              actionLabel="Add New Term of Payment"
              isShowActionLabel
              handleClickActionLabel={() => window.open("/term-of-payment/create")}
              items={listItemsOfPayment}
              handleChange={onChange}
              noSearch
            />
          </>
        )}
      />
    </div>
  );
}

const Label = styled.p`
  font-weight: 600;
  font-size: 20px;
  line-height: 27px;
  color: #1e858e;
`;
