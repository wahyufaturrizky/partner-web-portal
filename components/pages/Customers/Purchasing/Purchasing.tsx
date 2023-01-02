import React from "react";
import { Spacer, Dropdown } from "pink-lava-ui";
import { useTermOfPayments } from "hooks/mdm/term-of-payment/useTermOfPayment";
import { useFormContext, Controller } from "react-hook-form";
import styled from "styled-components";

const Purchasing = () => {
  const companyCode = localStorage.getItem("companyCode");
  const { control } = useFormContext();

  const { data: getDataTermOfPayment } = useTermOfPayments({
    options: {
      onSuccess: () => {},
    },
    query: {
      company_id: companyCode,
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
              containerId={"area2"}
              defaultValue={value}
              label="Term of Payment"
              width="70%"
              actionLabel="Add New Term of Payment"
              isShowActionLabel
              handleClickActionLabel={() => window.open("/mdm/term-of-payment/create")}
              items={listItemsOfPayment}
              handleChange={onChange}
              noSearch
            />
          </>
        )}
      />
    </div>
  );
};

const Label = styled.p`
  font-weight: 600;
  font-size: 20px;
  line-height: 27px;
  color: #1e858e;
`;

export default Purchasing;
