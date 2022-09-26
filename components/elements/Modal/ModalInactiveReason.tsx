import React from "react";
import { Button, Spacer, Modal, Text, TextArea } from "pink-lava-ui";

export const ModalInactiveReason: any = ({
	onOk,
    visible,
    onCancel
}: {
	onCancel: any;
	onOk: any;
    visible: any;
}) => {
	const onSubmit = () => onOk(reason);
    const [reason, setReason] = React.useState('');

	return (
		<Modal
			visible={visible}
			onCancel={onCancel}
			title={"Add Reason Inactive"}
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
					<Button onClick={()=> onSubmit()} variant="primary" full size="big">
						Save
					</Button>
				</div>
			}
			content={
				<>
					<Spacer size={24} />
					<TextArea style={{height: '200px'}} label="" onChange={(e) => setReason(e.target.value)} />
					<Spacer size={24} />
				</>
			}
		/>
	);
};
