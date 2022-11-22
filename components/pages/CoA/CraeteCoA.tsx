import React, { useState } from "react";
import styled from "styled-components";
import { Text, Button, Col, Row, Spacer, Switch, Input, Dropdown } from "pink-lava-ui";
import { useForm, Controller } from "react-hook-form";
import { useAccountGroups } from "../../../hooks/finance-config/useAccountGroup";
import { useValidateAccountCode } from "../../../hooks/finance-config/useCoaTemplate";
import { lang } from "lang";

const CreateAccount: any = ({ onSubmit, onBack, coaId, coaItemsDeleted }: any) => {
  const t = localStorage.getItem("lan") || "en-US";
  const companyCode = localStorage.getItem("companyCode");
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm();

  const [search, setSearchAccountGroup] = useState("");
  const [coaCode, setCoaCode] = useState();
  const [isDeprecated, setDeprecated] = useState(false);
  const [codeError, setCodeError] = useState("");
  const { data: accountGroupParent } = useAccountGroups({
    options: {},
    query: {
      search,
      company_id: companyCode,
      limit: 1000000,
    },
  });

  useValidateAccountCode({
    options: {
      enabled: !!(coaId && coaCode && !coaItemsDeleted.includes(coaCode)),
      onSuccess: (data: any) => {
        if (!data.status) {
          setCodeError("The code has been used. Please use another code");
        }
      },
    },
    query: {
      code: coaCode,
      coa_id: coaId ?? "",
    },
  });

  const accounts = accountGroupParent?.rows?.map((account: any) => ({
    id: account.id,
    value: account.groupName,
  }));

  const submitCoa = (data: any) => {
    const payload = {
      accountCode: data.accountCode,
      accountName: data.accountName,
      accountGroup: accounts?.find((account) => account.id == data.accountGroupId)
        ? {
            groupName: accounts?.find((account) => account.id == data.accountGroupId)?.value,
          }
        : {},
      accountGroupId: data.accountGroupId,
      deprecated: isDeprecated ? "Y" : "N",
      allowReconciliation: "N",
    };
    if (!codeError) {
      onSubmit(payload);
    }
  };

  return (
    <>
      <Col>
        <Row gap="4px" alignItems="center">
          <Text variant={"h4"}>{lang[t].coaTemplate.create.createAccount.headerTitle}</Text>
        </Row>
        <Spacer size={20} />
        <Card>
          <Row gap="16px" justifyContent="flex-end">
            <Button size="big" variant={"tertiary"} onClick={onBack}>
              {lang[t].coaTemplate.list.button.cancel}
            </Button>
            <Button
              disabled={codeError}
              size="big"
              variant={"primary"}
              onClick={handleSubmit(submitCoa)}
            >
              {lang[t].coaTemplate.list.button.save}
            </Button>
          </Row>
        </Card>
        <Spacer size={10} />
        <Card>
          <Row gap="20px" width="100%" alignItems="center" noWrap>
            <Input
              label={lang[t].coaTemplate.create.createAccount.field.code}
              height="48px"
              type={"number"}
              placeholder={"e.g 10000000"}
              {...register("accountCode", { required: true })}
              error={errors?.accountCode?.type === "required" && "This  field is required"}
              required
              onBlur={(e) => setCoaCode(e.target.value)}
              onFocus={() => setCodeError("")}
            />
          </Row>
          <Spacer size={20} />
          <Row gap="20px" width="100%" alignItems="center" noWrap>
            <Input
              label={lang[t].coaTemplate.create.createAccount.field.accountName}
              height="48px"
              placeholder={"e.g AKTIVA"}
              {...register("accountName", { required: true })}
              error={errors?.accountName?.type === "required" && "This  field is required"}
              required
            />
            <Row gap="20px" width="100%" alignItems="center" noWrap>
              <Controller
                control={control}
                shouldUnregister={true}
                defaultValue={""}
                rules={{ required: true }}
                name="accountGroupId"
                render={({ field: { onChange }, formState: { errors } }) => (
                  <>
                    <Dropdown
                      label={lang[t].coaTemplate.create.createAccount.field.accountGroup}
                      width={"100%"}
                      items={accounts}
                      placeholder={"Select"}
                      handleChange={(value: any) => {
                        onChange(value);
                      }}
                      onSearch={(search: any) => setSearchAccountGroup(search)}
                      required
                      error={
                        errors?.accountGroupId?.type === "required" && "This  field is required"
                      }
                    />
                  </>
                )}
              />

              <Col>
                <Spacer size={20} />
                <Text variant="subtitle1">
                  {lang[t].coaTemplate.create.createAccount.field.deprecated}
                </Text>
              </Col>
              <Col>
                <Spacer size={20} />
                <Switch checked={isDeprecated} onChange={() => setDeprecated(!isDeprecated)} />
              </Col>
            </Row>
          </Row>
        </Card>
      </Col>
    </>
  );
};

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
`;

export default CreateAccount;
