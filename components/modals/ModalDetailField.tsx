import React from "react";
import { Button, Spacer, Modal, Input } from "pink-lava-ui";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const schema = yup
	.object({
		name: yup.string().required("Name is Required"),
		key: yup.string().required("Key is Required"),
		rememberMe: yup.boolean(),
	})
	.required();

export const ModalDetailField: any = ({
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
}) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: defaultValue,
		resolver: yupResolver(schema),
	});

	const errorsApi = error?.errors;
	const onSubmit = (data: any) => onOk(data);

	return (
		<Modal
			visible={visible}
			onCancel={onCancel}
			title={"Detail Field"}
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
						error={errors?.name?.message}
						{...register("name", { required: true })}
						label="Name"
						placeholder={"e.g Material Category"}
						defaultValue={defaultValue?.name}
					/>
					<Spacer size={20} />
					<Input
						error={errors?.key?.message || errorsApi?.[0]?.message}
						{...register("key", { required: true })}
						label="Key"
						placeholder={"e.g master.material.category"}
						defaultValue={defaultValue?.key}
					/>
					<Spacer size={14} />
				</>
			}
		/>
	);
};
