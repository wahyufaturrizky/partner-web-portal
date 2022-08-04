import React from "react";
import { Button, Spacer, Modal, Input, Dropdown } from "pink-lava-ui";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { useAccountGroupParent } from "../../../hooks/finance-config/useAccountGroup";

const schema = yup
	.object({
		groupName: yup.string().required("Name is Required"),
	})
	.required();

export const ModalDetailAccountGroup: any = ({
	visible,
	defaultValue,
	onCancel,
	onOk,
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

	const onSubmit = (data: any) => onOk({ groupName: data.groupName, parentId: data.parentId });

	const { data: accountGroupParent, isLoading } = useAccountGroupParent({
		options: {},
	});

	const parents = accountGroupParent
		?.filter((account: any) => account.id !== defaultValue.id)
		.map((account: any) => ({ id: account.id, value: account.groupName }));

	return (
		<Modal
			visible={visible}
			onCancel={onCancel}
			title={"Account Group"}
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
					<Input
						error={errors?.groupName?.message}
						{...register("groupName", { required: true })}
						label="Name"
						placeholder="e.g Receivable"
					/>
					<Spacer size={20} />
					<Dropdown
						label="Parent (optional)"
						placeholder="Select"
						width="100%"
						items={parents}
						defaultValue={defaultValue?.parents?.id}
						handleChange={(value: any) => setValue("parentId", value)}
						noSearch
					/>
					<Spacer size={14} />
				</>
			}
		/>
	);
};
