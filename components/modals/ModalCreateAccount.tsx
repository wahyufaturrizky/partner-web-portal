import React, { useState } from "react";
import { Button, Spacer, Modal, Input, Dropdown, Row, Col, Switch, Text } from "pink-lava-ui";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useAccountGroupParent } from "../../hooks/account-group/useAccountGroup";

const schema = yup
	.object({
		code: yup.string().required("Code is Required"),
		account_name: yup.string().required("Account Name is Required"),
	})
	.required();

export const ModalCreateAccount: any = ({
	visible,
	defaultValue,
	onCancel,
	onOk,
	error,
}: {
	visible: any;
	defaultValue: any;
	onCancel: any;
	onOk: any;
	error: any;
}) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm({
		defaultValues: defaultValue,
		resolver: yupResolver(schema),
	});

	const [filterMenu, setFilterMenu] = useState("");
	const [checked, setChecked] = useState(false);

	const errorsApi = error?.errors;
	const onSubmit = (data: any) => {
		const payload = {
			account_code: data.code,
			account_name: data.account_name,
			account_group: filterMenu,
			deprecated: checked ? "Y" : "N",
			allow_reconciliation: "N",
		};
		onOk(payload);
	};

	const { data: accountGroupParent, isLoading } = useAccountGroupParent({
		options: {},
	});

	const accounts = accountGroupParent?.map((account) => ({
		id: account.id,
		value: account.groupName,
	}));

	return (
		<Modal
			visible={visible && !isLoading}
			onCancel={onCancel}
			title={"Create Account Group"}
			footer={
				<div
					style={{
						display: "flex",
						marginBottom: "12px",
						marginRight: "12px",
						justifyContent: "flex-end",
						gap: "12px",
					}}
				>
					<Button onClick={handleSubmit(onSubmit)} variant="primary" size="big">
						Save
					</Button>
				</div>
			}
			content={
				<>
					<Spacer size={20} />
					<Row gap="20px" width="100%" alignItems="center">
						<Col>
							<Input
								label="Code"
								height="48px"
								placeholder={"e.g 10000000"}
								{...register("code", { required: true })}
								error={errors?.code?.message}
							/>
						</Col>
						<Col>
							<Input
								label="Account Name"
								height="48px"
								placeholder={"e.g AKTIVA"}
								{...register("account_name", { required: true })}
								error={errors?.account_name?.message}
							/>
						</Col>
						<Dropdown
							label="Account Group"
							width={"300px"}
							items={accounts}
							placeholder={"Select"}
							handleChange={(value) => setFilterMenu(value)}
							noSearch
							defaultValue="All"
						/>
						<Text>Deprecated</Text>
						<Switch checked={checked} onChange={() => setChecked(!checked)} />
					</Row>
					<Spacer size={14} />
				</>
			}
		/>
	);
};
