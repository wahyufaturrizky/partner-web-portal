import React from "react";
import { Button, Spacer, Modal } from "pink-lava-ui";

interface ModalProps {
	visible: boolean;
	onCancel?: React.MouseEventHandler<HTMLButtonElement>;
	onOk?: React.MouseEventHandler<HTMLButtonElement>;
	totalSelected?: string | number | undefined;
	itemTitle?: string | string[];
	isLoading?: boolean;
}

export const ModalDeleteConfirmation = ({
	visible,
	onCancel,
	onOk,
	totalSelected,
	itemTitle,
	isLoading,
}: ModalProps): JSX.Element => {
	return (
		<Modal
			onCancel={onCancel}
			visible={visible}
			title={"Confirm Delete"}
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
					<Button size="big" variant="secondary" key="submit" type="primary" onClick={onCancel}>
						No
					</Button>
					<Button disabled={isLoading} variant="primary" size="big" onClick={onOk}>
						{isLoading ? "loading..." : "Yes"}
					</Button>
				</div>
			}
			content={
				<>
					<Spacer size={4} />
					{totalSelected > 1
						? `Are you sure to delete ${totalSelected} selected item ?`
						: `Are you sure to delete ${itemTitle} ?`}
					<Spacer size={20} />
				</>
			}
		/>
	);
};
