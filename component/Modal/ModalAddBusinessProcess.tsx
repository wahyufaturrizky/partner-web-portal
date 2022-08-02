import React from "react";
import { Modal, Spacer, Dropdown, Button, DropdownMenuOptionCustom } from "pink-lava-ui";

const ModalAddBusinessProcess = ({
	visible,
	onCancel,
	onSave,
	dropdownValue,
	isLoading,
	isLoadingMore,
	dropdownList,
	fetchMore,
	onSearch,
	onChange,
	selectedValue,
	onClear,
	onChangeMandatory,
	mandatoryValue,
	statusValue,
	onChangeActive,
}: any) => {
	return (
		<Modal
			visible={visible}
			onCancel={onCancel}
			title={"Add Process"}
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
					<Spacer size={20} />
					<DropdownMenuOptionCustom
						label="Process"
						mode="multiple"
						placeholder="Select Process"
						labelInValue
						filterOption={false}
						value={dropdownValue}
						isLoading={isLoading}
						isLoadingMore={isLoadingMore}
						listItems={isLoading && !isLoadingMore ? [] : dropdownList}
						fetchMore={fetchMore}
						onSearch={onSearch}
						onChange={onChange}
						valueSelectedItems={selectedValue}
						allowClear={true}
						onClear={onClear}
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
						defaultValue={statusValue}
						items={[
							{ id: "Active", value: "Active" },
							{ id: "Inactive", value: "Inactive" },
						]}
						placeholder={"Select"}
						handleChange={onChangeActive}
						noSearch
					/>

					<Spacer size={14} />
				</>
			}
		/>
	);
};

export default ModalAddBusinessProcess;
