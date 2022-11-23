import React, { useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Spacer, Modal, Input, Dropdown } from "pink-lava-ui";

import { useAccountGroups } from "../../../hooks/finance-config/useAccountGroup";
import { lang } from "lang";

const schema = yup
	.object({
		groupName: yup.string().required("Name is Required"),
	})
	.required();

export const ModalCreateAccountGroup: any = ({
	visible,
	defaultValue,
	onCancel,
	onOk,
	error,
}: {
	visible?: any;
	defaultValue?: any;
	onCancel?: any;
	onOk?: any;
	error?: any;
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
	const t = localStorage.getItem("lan") || "en-US";
	const companyCode = localStorage.getItem("companyCode");
	const errorsApi = error?.errors;
	const onSubmit = (data: any) => {
		const newData = {
			...data,
			company_id: companyCode
		}
		onOk(newData)
	};

	const [search, setSearch] = useState("");

	const { data: accountGroupParent, isLoading } = useAccountGroups({
		options: {},
		query: {
			search: search,
			limit: 100000,
			company_id: companyCode
		},
	});

	const parents = accountGroupParent?.rows?.map((account: any) => ({
		id: account.id,
		value: account.groupName,
	}));

	return (
		<Modal
			visible={visible && !isLoading}
			onCancel={onCancel}
			title={lang[t].accountGroup.modalTitleCreate.accountGroup}
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
						{lang[t].accountGroup.primary.save}
					</Button>
				</div>
			}
			content={
				<>
					<Spacer size={20} />
					<Input
						error={errors?.groupName?.message}
						{...register("groupName", { required: true })}
						label={lang[t].accountGroup.emptyState.name}
						placeholder={"e.g Receivable"}
					/>
					<Spacer size={20} />
					<Dropdown
						label={`${lang[t].accountGroup.filterBar.parent} (optional)`}
						width={"100%"}
						items={parents}
						placeholder={"Select"}
						handleChange={(value: any) => setValue("parentId", value)}
						onSearch={() => setSearch("group")}
					/>
					<Spacer size={14} />
				</>
			}
		/>
	);
};
