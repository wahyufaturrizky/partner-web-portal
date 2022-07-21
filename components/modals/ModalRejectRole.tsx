import React, { useState } from "react";
import { Button, Spacer, Modal, Accordion, Text, TextArea, Row, Col, Checkbox } from "pink-lava-ui";
import { useMenuPermissionLists } from "../../hooks/permission/usePermission";

export const ModalRejectRole: any = ({
	visible,
	roleIds,
	onCancel,
	onOk,
}: {
	visible: any;
	onOk: any;
	onCancel: any;
	roleIds: any;
}) => {
	const [name, setName] = useState(false);
	const [permissionsList, setPermissionsList] = useState([]);
	const [desc, setDesc] = useState();

	const handlePermissions = (value) => {
		let newPermissions = JSON.parse(JSON.stringify(permissionsList));
		if (newPermissions.includes(value)) {
			newPermissions = newPermissions.filter((info) => info !== value);
		} else {
			newPermissions.push(value);
		}
		setPermissionsList(newPermissions);
	};

	const onSubmit = () => {
		const data = {
			ids: roleIds,
			approvalStatus: "REJECTED",
			rejectionReason: desc,
			rejectionDetail: {
				general: name ? ["name"] : [],
				permission: permissionsList,
			},
		};

		onOk(data);
	};

	const { data: menuLists } = useMenuPermissionLists({
		query: {
			search: "",
		},
		options: {},
	});

	let permissions = [];

	menuLists?.forEach((menu) => {
		permissions = permissions.concat(menu.permission);
	});

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
									<Checkbox checked={!!name} onChange={() => {}} />
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
										checked={permissions.length === permissionsList.length}
										onChange={() => {}}
									/>
									<Text variant="headingMedium" bold>
										Permissions
									</Text>
								</Row>
							</Accordion.Header>
							<Accordion.Body padding="0px">
								<Row
									justifyContent="flex-start"
									gap="16px"
									width="100%"
									height="139px"
									padding="16px"
								>
									{permissions.map((permission) => (
										<Row key={permission.id} height="25px">
											<Checkbox
												onChange={() => handlePermissions(permission.id)}
												checked={permissionsList.includes(permission.id)}
											/>
											<Spacer size={8} display="inline-block" />
											<Text variant="body1">{permission.name}</Text>
										</Row>
									))}
								</Row>
							</Accordion.Body>
						</Accordion.Item>
					</Accordion>
					<Spacer size={16} />
					<Col width="100%" gap="8px">
						<TextArea
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
					</Col>
					<Spacer size={18} />
				</>
			}
		/>
	);
};
