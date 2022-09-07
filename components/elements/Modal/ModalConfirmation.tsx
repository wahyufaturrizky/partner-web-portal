import React from "react";
import { Button, Modal } from "pink-lava-ui";
import styled from "styled-components";
 
interface ModalProps {
	visible: boolean;
	onCancel?: React.MouseEventHandler<HTMLButtonElement>;
	onOk?: React.MouseEventHandler<HTMLButtonElement>;
	content?: any;
	isLoading?: boolean;
	title?: string,
	variantBtnLeft: string
}

export const ModalConfirmation = ({
	visible,
	onCancel,
	onOk,
	content,
	title,
	isLoading,
	variantBtnLeft
}: ModalProps): JSX.Element => {
	return (
		<Modal
			onCancel={onCancel}
			visible={visible}
			title={title}
			footer={
				<FlexElement>
					<Button
						size="big"
						variant={variantBtnLeft}
						key="submit"
						type="primary"
						full
						onClick={onCancel}
					>
						No
					</Button>
					<Button
						full
						variant="primary"
						size="big"
						onClick={onOk}
					>
						{isLoading ? "loading..." : "Yes"}
					</Button>
				</FlexElement>
			}
			content={content}
		/>
	);
};

const FlexElement = styled.div`
	display: flex;
	marginBottom: 12px;
	marginRight: 12px;
	justifyContent: flex-end;
	gap: 12px;
`