import React, { useState } from "react";
import { Button, Spacer, Modal, Accordion, Text, TextArea, Row, Col, Checkbox } from "pink-lava-ui";

export const ModalRejectPermission: any = ({
	visible,
	onCancel,
	onOk,
	permissionIds,
}: {
	visible: any;
	onCancel: any;
	onOk: any;
	permissionId: any;
}) => {
	const [desc, setDesc] = useState();
	const [name, setName] = useState(false);
	const [associatedMenu, setAssociatedMenu] = useState(false);

	const onSubmit = () => {
		const general = [];
		if (name) {
			general.push("name");
		}
		if (associatedMenu) {
			general.push("Associated Menu");
		}

		const data = {
			ids: permissionIds,
			approvalStatus: "REJECTED",
			rejectionReason: desc,
			rejectionDetail: {
				general,
			},
		};

		onOk(data);
	};

	const onCheckAll = (value) => {
		if (value) {
			setName(true);
			setAssociatedMenu(true);
		} else {
			setName(false);
			setAssociatedMenu(false);
		}
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
										checked={name && associatedMenu}
										onChange={(value) => onCheckAll(value)}
									/>
									<Text variant="headingMedium" bold>
										General
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
										<Checkbox checked={name} onChange={(value) => setName(value)} />
										<Spacer size={8} display="inline-block" />
										<Text variant="body1">Name</Text>
									</Row>
									<Row height="25px">
										<Checkbox
											checked={associatedMenu}
											onChange={(value) => setAssociatedMenu(value)}
										/>
										<Spacer size={8} display="inline-block" />
										<Text variant="body1">Associated Menu</Text>
									</Row>
								</Row>
							</Accordion.Body>
						</Accordion.Item>
					</Accordion>
					<Spacer size={16} />
					<Col width="100%" gap="8px">
						<div style={{ position: "relative" }}>
							<TextArea
								top="5px"
								value={desc}
								onChange={(e) => setDesc(e.target.value)}
								label={
									<Text
										variant="headingMedium"
										placeholder="Users are not allowed"
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
