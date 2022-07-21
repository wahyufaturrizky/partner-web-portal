import React, { useState } from "react";
import { Button, Col, Row, Spacer, Text, Checkbox, Input, Spin, Radio } from "pink-lava-ui";
import styled from "styled-components";
import {
	useSequenceFormat,
	useUpdateSequenceFormat,
} from "../../hooks/sequence-format/useSequenceFormat";
import { useForm, Controller } from "react-hook-form";
import { queryClient } from "../_app";

const SequenceFormat = () => {
	const [isCompany, setIsCompany] = useState(false);
	const [isBranch, setIsBranch] = useState(false);
	const [isDocType, setIsDocType] = useState(false);
	const [radioValue, setRadioValue] = useState("MONTH");
	const [isEditable, setIsEditable] = useState(false);

	const { register, handleSubmit, control } = useForm();

	const {
		data: sequence,
		isLoading: isLoadingSequence,
		isFetching: isFetchingSequence,
	} = useSequenceFormat({
		options: {
			onSuccess: (data: any) => {
				setIsCompany(data.isUseCompany);
				setIsBranch(data.isUseBranch);
				setIsDocType(data.isUseDocType);
				setRadioValue(data.updatePeriod);
			},
		},
	});

	const { mutate: createSequenceFormat, isLoading: isLoadingCreateSequenceFormat } =
		useUpdateSequenceFormat({
			options: {
				onSuccess: () => {
					setIsEditable(false);
					queryClient.invalidateQueries(["sequence-format"]);
				},
			},
		});

	const onSubmit = (data: any) => {
		createSequenceFormat(data);
	};

	return (
		<Col>
			<Text variant={"h4"}>Sequence Format</Text>

			<Spacer size={20} />

			<Card>
				<Row justifyContent="space-between" alignItems="center">
					<Text variant={"h5"}>Number Allocation</Text>
					{isEditable ? (
						<Button size="big" variant={"primary"} onClick={handleSubmit(onSubmit)}>
							{isLoadingCreateSequenceFormat ? "Loading..." : "Save"}
						</Button>
					) : (
						<Button
							size="big"
							variant={"primary"}
							onClick={() => {
								setIsEditable(true);
							}}
						>
							Edit
						</Button>
					)}
				</Row>
			</Card>
			<Spacer size={10} />

			{isLoadingSequence || isFetchingSequence ? (
				<Center>
					<Spin tip="Loading data..." />
				</Center>
			) : (
				<Card>
					<Col width="100%" gap="20px">
						<Row>
							<Row width="100%">
								<Label>Include</Label>
							</Row>

							<Row style={{ marginRight: "12px" }} alignItems="center">
								<Controller
									control={control}
									name="isUseCompany"
									defaultValue={sequence.isUseCompany}
									render={({ field: { onChange } }) => (
										<Checkbox
											checked={isCompany}
											disabled={!isEditable}
											onChange={(value: boolean) => {
												onChange(value);
												setIsCompany(value);
											}}
										/>
									)}
								/>

								<Text variant={"h6"} bold>
									Company
								</Text>
							</Row>

							<Row style={{ marginRight: "12px" }} alignItems="center">
								<Controller
									control={control}
									name="isUseBranch"
									defaultValue={sequence.isUseBranch}
									render={({ field: { onChange } }) => (
										<Checkbox
											checked={isBranch}
											disabled={!isEditable}
											onChange={(value: boolean) => {
												onChange(value);
												setIsBranch(value);
											}}
										/>
									)}
								/>
								<Text variant={"h6"} bold>
									Branch
								</Text>
							</Row>

							<Row style={{ marginRight: "12px" }} alignItems="center">
								<Controller
									control={control}
									name="is_use_doc_type"
									defaultValue={sequence.isUseDocType}
									render={({ field: { onChange } }) => (
										<Checkbox
											checked={isDocType}
											disabled={!isEditable}
											onChange={(value: boolean) => {
												onChange(value);
												setIsDocType(value);
											}}
										/>
									)}
								/>
								<Text variant={"h6"} bold>
									Document Type
								</Text>
							</Row>
						</Row>

						<Row>
							<Row width="100%"></Row>
							<Col>
								<Label>Periodically Updated</Label>

								<Row style={{ marginRight: "12px" }} alignItems="center">
									<Controller
										control={control}
										name="update_period"
										defaultValue={sequence.updatePeriod}
										render={({ field: { onChange } }) => (
											<>
												<Radio
													value={"MONTH"}
													disabled={!isEditable}
													checked={radioValue === "MONTH"}
													onChange={(e) => {
														onChange(e.target.value);
														setRadioValue(e.target.value);
													}}
												>
													<h4>Month</h4>
												</Radio>
												<Radio
													value={"YEAR"}
													disabled={!isEditable}
													checked={radioValue === "YEAR"}
													onChange={(e) => {
														onChange(e.target.value);
														setRadioValue(e.target.value);
													}}
												>
													<h4>Year</h4>
												</Radio>
											</>
										)}
									/>
								</Row>
							</Col>
						</Row>

						<Row width="100%" gap="20px" noWrap>
							<Input
								defaultValue={sequence.prefix}
								width="100%"
								label="Prefix"
								height="48px"
								noSearch
								disabled={!isEditable}
								{...register("prefix")}
							/>
							<Input
								defaultValue={sequence.suffix}
								width="100%"
								label="Suffix"
								height="48px"
								noSearch
								disabled={!isEditable}
								{...register("suffix")}
							/>
						</Row>
						<Row width="100%" gap="20px" noWrap>
							<Input
								defaultValue={sequence.digitSize}
								width="100%"
								label="Digit Size"
								height="48px"
								noSearch
								disabled={!isEditable}
								{...register("digit_size")}
							/>
							<Input
								defaultValue={sequence.separator}
								width="100%"
								label="Separator"
								height="48px"
								noSearch
								disabled={!isEditable}
								{...register("separator")}
							/>
						</Row>
						<Row width="100%" gap="20px" noWrap>
							<Input
								defaultValue={sequence.startNumber}
								width="100%"
								label="Start Number"
								height="48px"
								noSearch
								disabled={!isEditable}
								{...register("start_number")}
							/>
							<Input
								defaultValue={sequence.nextNumber}
								width="100%"
								label="Next Number"
								height="48px"
								noSearch
								disabled={!isEditable}
								{...register("next_number")}
							/>
						</Row>
						<Row width="50%" gap="20px" noWrap>
							<Input
								defaultValue={sequence.sequenceNumber}
								width="100%"
								label="Sequence Code Preview"
								height="48px"
								noSearch
								disabled={!isEditable}
							/>
						</Row>
					</Col>
				</Card>
			)}
		</Col>
	);
};

const Label = styled.div`
	font-weight: 500;
	font-size: 16px;
	line-height: 24px;
	color: #000000;
`;

const Card = styled.div`
	background: #ffffff;
	border-radius: 16px;
	padding: 16px;
`;

const Center = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
`;

export default SequenceFormat;
