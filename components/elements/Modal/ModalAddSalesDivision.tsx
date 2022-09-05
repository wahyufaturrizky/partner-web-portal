import React, { useState } from "react";
import {
	Button,
	Spacer,
	Modal,
	Input,
	DropdownMenuOptionCustome
} from "pink-lava-ui";
import styled from "styled-components";

export const ModalAddSalesDivision: any = ({ visible, onCancel, onOk }: any) => {
	const [itemSelected, setItemSelected] = useState<string[]>([])
	const [forms, setForms] = useState({
		name: '',
		description: ''
	})
	const isDisabledButton = itemSelected.length === 0 && forms.name.length === 0

	return (
		<Modal
			width={500}
			visible={visible}
			onCancel={onCancel}
			title="Create Division"
			footer={
				<Footer>
					<Button
						onClick={onCancel}
						full
						variant="tertiary"
						size="big">
						Cancel
					</Button>
					<Button
						onClick={() => onOk({
							...forms,
							itemSelected
						})}
						full
						variant="primary"
						size="big"
						disabled={isDisabledButton}
					>
						Save
					</Button>
				</Footer>
			}
			content={
				<Container>
					<Spacer size={20} />
					<Input
						onChange={({ target }: any) =>
							setForms({ ...forms, name: target.value })}
						required
						label="Division Name*"
					/>
					<Spacer size={20} />
					<Input
						onChange={({ target }: any) =>
							setForms({ ...forms, description: target.value })} 
							label="Short Description"
					/>
					<Spacer size={20} />
					<DropdownMenuOptionCustome
						handleOpenTotalBadge={() => {}}
						isAllowClear
						required
						handleChangeValue={(value: string[]) => setItemSelected(value)}
						valueSelectedItems={[]}
						label="Product"
						noSearch
						listItems={[
							{ label: 'test-1', value: 'test-1' },
							{ label: 'test-2', value: 'test-2' },
							{ label: 'test-3', value: 'test-3' },
							]}
						/>
					<Spacer size={30} />
				</Container>
			}
		/>
	);
};

const Footer = styled.div`
	display: flex;
	marginBottom: 12px;
	marginRight: 12px;
	justifyContent: flex-end;
	gap: 12px;
`

const Container = styled.div`
`
