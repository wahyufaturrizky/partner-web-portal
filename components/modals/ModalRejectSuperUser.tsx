import React, { useState } from "react";
import { Button, Spacer, Modal, Accordion, Text, TextArea, Row, Col, Checkbox } from "pink-lava-ui";

export const ModalRejectSuperUser: any = ({
	visible,
	onCancel,
	onOk,
	userIds,
}: {
	visible: any;
	onCancel: any;
	onOk: any;
	userIds: any;
}) => {
	const [employeeInformation, setEmployeeInformation] = useState([]);
	const [generalInformation, setGeneralInformation] = useState([]);
	const [desc, setDesc] = useState();

	const handleChangeEmployeeInformation = (value) => {
		let newEmployeeInformation = JSON.parse(JSON.stringify(employeeInformation));
		if (newEmployeeInformation.includes(value)) {
			newEmployeeInformation = newEmployeeInformation.filter((info) => info !== value);
		} else {
			newEmployeeInformation.push(value);
		}
		setEmployeeInformation(newEmployeeInformation);
	};

	const handleChangeGeneralInformation = (value) => {
		let newEmployeeInformation = JSON.parse(JSON.stringify(generalInformation));
		if (newEmployeeInformation.includes(value)) {
			newEmployeeInformation = newEmployeeInformation.filter((info) => info !== value);
		} else {
			newEmployeeInformation.push(value);
		}
		setGeneralInformation(newEmployeeInformation);
	};

	const onSubmit = () => {
		const data = {
			ids: userIds,
			approvalStatus: "REJECTED",
			rejectionReason: desc,
			rejectionDetail: {
				employeeInformation,
				generalInformation,
			},
		};

		onOk(data);
	};

	const checkAllEmployeeInformation = () => {
		let newEmployeeInformation = JSON.parse(JSON.stringify(employeeInformation));
		if (newEmployeeInformation.length === 3) {
			newEmployeeInformation = [];
		} else {
			newEmployeeInformation = ["Full Name", "Partner", "Role"];
		}
		setEmployeeInformation(newEmployeeInformation);
	};

	const checkAllGeneralInformation = () => {
		let newGeneralInformation = JSON.parse(JSON.stringify(generalInformation));
		if (newGeneralInformation.length === 4) {
			newGeneralInformation = [];
		} else {
			newGeneralInformation = ["Email", "Phone Number", "Timezone", "Language"];
		}

		setGeneralInformation(newGeneralInformation);
	};

	return (
		<Modal
			width={"880px"}
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
					<Button variant="secondary" size="big" onClick={onCancel}>
						Cancel
					</Button>
					<Button onClick={onSubmit} variant="primary" size="big">
						Save
					</Button>
				</div>
			}
			content={
				<>
					<Spacer size={12} />
					<Text color="blue.darker" variant="headingMedium">
						Select data that has not been filled in
					</Text>
					<Spacer size={16} />
					<Accordion key={1}>
						<Accordion.Item key={1}>
							<Accordion.Header variant="white">
								<Row alignItems="center" gap="8px">
									<Checkbox
										checked={employeeInformation.length === 3}
										onChange={() => checkAllEmployeeInformation()}
									/>
									<Text variant="headingMedium" bold>
										Employee Information
									</Text>
								</Row>
							</Accordion.Header>
							<Accordion.Body padding="0px">
								<Row
									justifyContent="space-between"
									gap="16px"
									width="100%"
									height="139px"
									padding="16px"
								>
									<Row height="25px">
										<Checkbox
											checked={employeeInformation.includes("Full Name")}
											onChange={() => handleChangeEmployeeInformation("Full Name")}
										/>
										<Spacer size={8} display="inline-block" />
										<Text variant="body1">Full Name</Text>
									</Row>
									<Row height="25px">
										<Checkbox
											checked={employeeInformation.includes("Partner")}
											onChange={() => handleChangeEmployeeInformation("Partner")}
										/>
										<Spacer size={8} display="inline-block" />
										<Text variant="body1">Partner</Text>
									</Row>
									<Row height="25px">
										<Checkbox
											checked={employeeInformation.includes("Role")}
											onChange={() => handleChangeEmployeeInformation("Role")}
										/>
										<Spacer size={8} display="inline-block" />
										<Text variant="body1">Role</Text>
									</Row>
								</Row>
							</Accordion.Body>
						</Accordion.Item>
					</Accordion>
					<Spacer size={16} />
					<Accordion key={1}>
						<Accordion.Item key={1}>
							<Accordion.Header variant="white">
								<Row alignItems="center" gap="8px">
									<Checkbox
										checked={generalInformation.length === 4}
										onChange={() => checkAllGeneralInformation()}
									/>
									<Text variant="headingMedium" bold>
										General Information
									</Text>
								</Row>
							</Accordion.Header>
							<Accordion.Body padding="0px">
								<Row
									justifyContent="space-between"
									gap="16px"
									width="100%"
									height="139px"
									padding="16px"
								>
									<Row height="25px">
										<Checkbox
											checked={generalInformation.includes("Email")}
											onChange={() => handleChangeGeneralInformation("Email")}
										/>
										<Spacer size={8} display="inline-block" />
										<Text variant="body1">Email</Text>
									</Row>
									<Row height="25px">
										<Checkbox
											checked={generalInformation.includes("Phone Number")}
											onChange={() => handleChangeGeneralInformation("Phone Number")}
										/>
										<Spacer size={8} display="inline-block" />
										<Text variant="body1">Phone Number</Text>
									</Row>
									<Row height="25px">
										<Checkbox
											checked={generalInformation.includes("Timezone")}
											onChange={() => handleChangeGeneralInformation("Timezone")}
										/>
										<Spacer size={8} display="inline-block" />
										<Text variant="body1">Timezone</Text>
									</Row>
									<Row height="25px">
										<Checkbox
											checked={generalInformation.includes("Language")}
											onChange={() => handleChangeGeneralInformation("Language")}
										/>
										<Spacer size={8} display="inline-block" />
										<Text variant="body1">Language</Text>
									</Row>
								</Row>
							</Accordion.Body>
						</Accordion.Item>
					</Accordion>
					<Spacer size={16} />
					<Col width="100%" gap="8px">
						<div style={{ position: "relative" }}>
							<TextArea
								value={desc}
								onChange={(e) => setDesc(e.target.value)}
								label={
									<Text
										variant="headingMedium"
										placeholder="Data has not been filled in."
										color="blue.darker"
									>
										Descriptions
									</Text>
								}
							/>
						</div>
					</Col>
					<Spacer size={18} />
				</>
			}
		/>
	);
};
