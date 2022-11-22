import React, { useState } from "react";
import styled from "styled-components";
import { Text, Button, Col, Row, Spacer, Switch, Input, Dropdown2 } from "pink-lava-ui";
import ArrowLeft from "../../../assets/icons/arrow-left.svg";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useAccountGroups } from "../../../hooks/finance-config/useAccountGroup";
import { ModalDeleteConfirmation } from "../../elements/Modal/ModalConfirmationDelete";

const schema = yup
  .object({
    accountCode: yup.string().required("Code is Required"),
    accountName: yup.string().required("Account Name is Required"),
    accountGroupId: yup.string().required("Account Group is Required"),
  })
  .required();

const DetailCoA: any = ({ onSubmit, onBack, account, onDelete, source }: any) => {
  const companyCode = localStorage.getItem("companyCode");
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: account,
  });

  const [search, setSearchAccountGroup] = useState("");
  const [modalDelete, setModalDelete] = useState({ open: false });

  const [isDeprecated, setDeprecated] = useState(account.deprecated === "Y");
  const { data: accountGroupParent } = useAccountGroups({
    options: {},
    query: {
      search,
      company_id: companyCode,
      limit: 1000000,
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
      accountGroup: accounts?.find((account: any) => account.id == data.accountGroupId)
        ? {
            groupName: accounts?.find((account: any) => account.id == data.accountGroupId)?.value,
          }
        : {},
      accountGroupId: data.accountGroupId,
      deprecated: isDeprecated ? "Y" : "N",
      allowReconciliation: account.allowReconciliation ?? "N",
    };
    onSubmit(payload, source);
  };

  return (
    <>
      <Col>
        <Row gap="4px" alignItems="center">
          <ArrowLeft style={{ cursor: "pointer" }} onClick={() => onBack()} />
          <Text variant={"h4"}>{account?.accountGroup?.groupName || "Unknown"}</Text>
        </Row>
        <Spacer size={20} />
        <Card>
          <Row gap="16px" justifyContent="flex-end">
            <Button size="big" variant={"tertiary"} onClick={() => setModalDelete({ open: true })}>
              Delete
            </Button>
            <Button size="big" variant={"primary"} onClick={handleSubmit(submitCoa)}>
              Save
            </Button>
          </Row>
        </Card>
        <Spacer size={10} />
        <Card>
          <Row gap="20px" width="100%" alignItems="center" noWrap>
            <Input
              label="Code"
              height="48px"
              type={"number"}
              placeholder={"e.g 10000000"}
              {...register("accountCode", { required: true })}
              error={errors?.code?.message}
              required
              disabled={true}
            />
            {/* <div style={{ visibility: "hidden", width: "100%" }}>
							<Input
								label="Code"
								height="48px"
								placeholder={"e.g 10000000"}
								{...register("acc", { required: true })}
								error={errors?.code?.message}
							/>
						</div> */}
          </Row>
          <Spacer size={20} />
          <Row gap="20px" width="100%" alignItems="center" noWrap>
            <Input
              label="Account Name"
              height="48px"
              placeholder={"e.g AKTIVA"}
              {...register("accountName", { required: true })}
              error={errors?.accountName?.accountName}
              required
            />
            <Row gap="20px" width="100%" alignItems="center" noWrap>
              <Dropdown2
                label="Account Group"
                width={"100%"}
                items={accounts}
                placeholder={"Select"}
                handleChange={(value: any) => setValue("accountGroupId", value)}
                onSearch={(search: any) => setSearchAccountGroup(search)}
                required
                error={errors?.accountGroupId?.message}
                defaultValue={account?.accountGroup?.groupName}
              />
              <Col>
                <Spacer size={20} />
                <Text variant="subtitle1">Deprecated</Text>
              </Col>
              <Col>
                <Spacer size={20} />
                <Switch checked={isDeprecated} onChange={() => setDeprecated(!isDeprecated)} />
              </Col>
            </Row>
          </Row>
        </Card>
      </Col>

      {modalDelete.open && (
        <ModalDeleteConfirmation
          visible={modalDelete.open}
          onCancel={() => setModalDelete({ open: false })}
          onOk={() => onDelete(account?.accountCode)}
          itemTitle={account?.accountGroup?.groupName}
        />
      )}
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

export default DetailCoA;
