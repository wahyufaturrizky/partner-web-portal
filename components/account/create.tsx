import React, { useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import { Text, Button, Col, Row, Spacer, Switch, Input, Dropdown } from "pink-lava-ui";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useAccountGroups } from "../../hooks/account-group/useAccountGroup";
import { useValidateAccountCode } from "../../hooks/coa-template/useCoa";

const schema = yup
	.object({
		accountCode: yup.string().required("Code is Required"),
		accountName: yup.string().required("Account Name is Required"),
		accountGroupId: yup.string().required("Account Group is Required"),
	})
	.required();

const CreateAccount: any = ({ onSubmit, onBack, coaId, coaItemsDeleted }) => {
	const router = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm({
		resolver: yupResolver(schema),
	});

	const [search, setSearchAccountGroup] = useState("");
	const [coaCode, setCoaCode] = useState();
	const [isDeprecated, setDeprecated] = useState(false);
	const [codeError, setCodeError] = useState("");
	const { data: accountGroupParent } = useAccountGroups({
		options: {},
		query: {
			search,
			limit: 1000000,
		},
	});

	useValidateAccountCode({
		options: {
			enabled: !!(coaId && coaCode && !coaItemsDeleted.includes(coaCode)),
			onSuccess: (data) => {
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

	const accounts = accountGroupParent?.rows?.map((account) => ({
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
					<Text variant={"h4"}>Create new Account</Text>
				</Row>
				<Spacer size={20} />
				<Card>
					<Row gap="16px" justifyContent="flex-end">
						<Button size="big" variant={"tertiary"} onClick={onBack}>
							Cancel
						</Button>
						<Button
							disabled={codeError}
							size="big"
							variant={"primary"}
							onClick={handleSubmit(submitCoa)}
						>
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
							onBlur={(e) => setCoaCode(e.target.value)}
							onFocus={() => setCodeError("")}
							error={codeError}
						/>
						<div style={{ visibility: "hidden", width: "100%" }}>
							<Input
								label="Code"
								height="48px"
								placeholder={"e.g 10000000"}
								{...register("acc", { required: true })}
								error={errors?.code?.message}
							/>
						</div>
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
							<Dropdown
								label="Account Group"
								width={"100%"}
								items={accounts}
								placeholder={"Select"}
								handleChange={(value) => setValue("accountGroupId", value)}
								onSearch={(search) => setSearchAccountGroup(search)}
								required
								error={errors?.accountGroupId?.message}
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
