import React from "react";
import { Modal, Spacer, Dropdown, Button, Input } from "pink-lava-ui";

const ModalEditProcess = ({
	visible,
	onCancel,
	onSave,
	processName,
	mandatoryValue,
	onChangeMandatory,
	statusValue,
	onChangeStatus,
}) => {
	return (
		<Modal
			visible={visible}
			onCancel={onCancel}
			title={"Edit Process"}
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
					<Button onClick={onSave} variant="primary" size="big">
						Save
					</Button>
				</div>
			}
			content={
				<>
					<Input
						id="name"
						defaultValue={processName}
						width="100%"
						label="Process"
						height="48px"
						disabled
					/>
					<Spacer size={20} />
					<Dropdown
						label="Mandatory"
						width={"100%"}
						items={[
							{ id: "Is Mandatory", value: "Is Mandatory" },
							{ id: "Not Mandatory", value: "Not Mandatory" },
						]}
						defaultValue={mandatoryValue}
						placeholder={"Select"}
						handleChange={onChangeMandatory}
						noSearch
					/>
					<Spacer size={20} />
					<Dropdown
						label="Status"
						width={"100%"}
						items={[
							{ id: "Active", value: "Active" },
							{ id: "Inactive", value: "Inactive" },
						]}
						placeholder={"Select"}
						defaultValue={statusValue}
						handleChange={onChangeStatus}
						noSearch
					/>
					<Spacer size={14} />
				</>
			}
		/>
	);
};

export default ModalEditProcess;
