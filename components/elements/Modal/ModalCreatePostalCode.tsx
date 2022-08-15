import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Dropdown, Input, Modal, Spacer, Spin } from "pink-lava-ui";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import {
	useCountries,
	useCountryStructures,
	useCreatePostalCode,
} from "../../../hooks/mdm/postal-code/usePostalCode";

const schema = yup
	.object({
		code: yup.string().required("Postal Code is Required"),
	})
	.required();

export const ModalCreatePostalCode: any = ({
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

	const errorsApi = error?.errors;

	const [search, setSearch] = useState("");
	const [selectedCountry, setSelectedCountry] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [selectedCountryStructures, setSelectedCountryStructures] = useState([]);

	const { data: countries, isLoading: isLoadingCountries } = useCountries({
		options: {
			onSuccess: (data: any) => {},
		},
		query: {
			search,
		},
	});

	const { mutate: mutateCreatePostalCode } = useCreatePostalCode({
		options: {
			onSuccess: (data) => {
				if (data) {
					setIsLoading(false);
					window.alert("Postal code created successfully");
					onCancel();
				}
			},
		},
	});

	const dataCountries: any = [];
	countries?.rows?.map((item: any) => {
		dataCountries.push({
			id: item?.id,
			value: item?.name,
		});
	});

	const { data: dataCountryStructures, isLoading: isLoadingCountryStructures } =
		useCountryStructures({
			country: selectedCountry,
			options: {
				onSuccess: (data) => {},
			},
		});

	const onSubmit = (data: any) => {
		setIsLoading(true);
		let payload = {
			...data,
			country: selectedCountry,
			structures: selectedCountryStructures,
		};
		mutateCreatePostalCode(payload);
	};

	return (
		<Modal
			// visible={visible && !isLoading}
			visible={visible}
			onCancel={onCancel}
			title={"Create Postal Code"}
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
					<Button
						disabled={isLoading}
						onClick={handleSubmit(onSubmit)}
						variant="primary"
						size="big"
					>
						{isLoading ? "Loading" : "Save"}
					</Button>
				</div>
			}
			content={
				<>
					<Spacer size={20} />
					{isLoadingCountries ? (
						<Spin tip="Loading data..." />
					) : (
						<Dropdown
							label="Country"
							width="100%"
							items={dataCountries}
							placeholder={"Select"}
							handleChange={(value: any) => setSelectedCountry(value)}
							onSearch={(search: any) => setSearch(search)}
						/>
					)}
					<Spacer size={20} />

					{dataCountryStructures && isLoadingCountryStructures ? (
						<Spin tip="Loading data..." />
					) : (
						dataCountryStructures?.rows.map((data, index) => (
							<Dropdown
								key={index}
								label={data.name}
								noSearch
								width={"100%"}
								items={data.structures[0]?.values.map((dataStructures) => ({
									id: dataStructures.id,
									value: dataStructures.name,
								}))}
								placeholder={"Select"}
								handleChange={(value: any) =>
									setSelectedCountryStructures([...selectedCountryStructures, value])
								}
							/>
						))
					)}

					<Spacer size={20} />
					<Input
						error={errors?.code?.message}
						{...register("code", { required: true })}
						label="Postal Code"
						placeholder={"e.g 40551"}
					/>
					<Spacer size={20} />
				</>
			}
		/>
	);
};
