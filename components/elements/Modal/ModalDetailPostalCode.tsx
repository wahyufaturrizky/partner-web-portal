import React, { useState } from "react";
import { Button, Spacer, Modal, Input, Dropdown, Spin } from "pink-lava-ui";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import {
	useCountries,
	useCountryStructures,
	useUpdatePostalCode,
} from "../../../hooks/mdm/postal-code/usePostalCode";

const schema = yup
	.object({
		code: yup.string().required("Postal Code is Required"),
	})
	.required();

export const ModalDetailPostalCode: any = ({
	visible,
	defaultValue,
	onCancel,
	onOk,
	error,
	dataModal,
}: {
	visible: any;
	defaultValue: any;
	onCancel: any;
	onOk: any;
	error: any;
	dataModal: any;
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

	const [search, setSearch] = useState("");
	const [selectedCountry, setSelectedCountry] = useState(dataModal.country);
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

	const { data: dataCountryStructures, isLoading: isLoadingCountryStructures } =
		useCountryStructures({
			country: selectedCountry,
			options: {
				onSuccess: (data: any) => {},
			},
		});

	const errorsApi = error?.errors;

	const { mutate: mutateUpdatePostalCode } = useUpdatePostalCode({
		postalCode_id: dataModal.id,
		options: {
			onSuccess: (data: any) => {
				if (data) {
					setIsLoading(false);
					window.alert("Postal code updated successfully");
					onCancel();
				}
			},
		},
	});

	const onSubmit = (data: any) => {
		setIsLoading(true);
		let payload = {
			...data,
			country: selectedCountry,
			structures: selectedCountryStructures,
		};
		console.log(payload);

		mutateUpdatePostalCode(payload);
	};

	return (
		<Modal
			visible={visible}
			onCancel={onCancel}
			title={"Postal Code"}
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
						{isLoading ? "Loading" : "Save"}
					</Button>
				</div>
			}
			content={
				<>
					<Spacer size={20} />
					{!countries && isLoadingCountries ? (
						<Spin tip="Loading data..." />
					) : (
						<Dropdown
							label="Country"
							width={"100%"}
							defaultValue={dataModal?.countryRecord?.name}
							items={countries.rows.map((data: any) => ({ id: data.id, value: data.name }))}
							placeholder={"Select"}
							// handleChange={(value: any) => setValue("parentId", value)}
							onSearch={(search: any) => setSearch(search)}
						/>
					)}

					<Spacer size={20} />

					{!dataCountryStructures && isLoadingCountryStructures ? (
						<Spin tip="Loading data..." />
					) : (
						dataCountryStructures?.rows.map((data: any, index: any) => (
							<Dropdown
								key={index}
								label={data.name}
								noSearch
								width={"100%"}
								items={data.structures[0]?.values.map((dataStructures: any) => ({
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
