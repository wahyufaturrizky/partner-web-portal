import React, { useState } from "react";
import { Button, Spacer, Modal, Table, Col, Pagination } from "pink-lava-ui";
import { useCoa } from "../../../hooks/finance-config/useCoaTemplate";
import usePagination from "@lucasmogari/react-pagination";

export const ModalCopyCoA: any = ({
	visible,
	onCancel,
	onOk,
	coaId,
}: {
	visible: any;
	defaultValue: any;
	onCancel: any;
	onOk: any;
	error: any;
	coaId: any;
}) => {
	const pagination = usePagination({
		page: 1,
		itemsPerPage: 20,
		maxPageItems: Infinity,
		numbers: true,
		arrows: true,
		totalItems: 100,
	});

	const [selectedRowKeys, setSelectedRowKeys] = useState([]);

	const columns = [
		{
			title: "Name",
			dataIndex: "field_name",
		},
		{
			title: "Action",
			dataIndex: "action",
			width: "20%",
			align: "left",
		},
	];

	const { data: fields, isLoading } = useCoa({
		options: {
			onSuccess: (data: any) => {
				pagination.setTotalItems(data.totalRow);
			},
		},
		query: {
			excepted_id: coaId ?? "",
			page: pagination.page,
			limit: pagination.itemsPerPage,
		},
	});

	const data: any = [];
	fields?.rows?.map((field: any) => {
		data.push({
			key: field.id,
			field_name: field.name,
			approval_status: field.status,
			action: (
				<div style={{ display: "flex", justifyContent: "left" }}>
					<Button
						size="small"
						onClick={() => {
							window.open(`/coa-template/${field.id}`, "_blank");
						}}
						variant="tertiary"
					>
						View Detail
					</Button>
				</div>
			),
		});
	});

	const paginateField = data;

	const onSelectChange = (selectedRowKeys: any) => {
		setSelectedRowKeys(selectedRowKeys);
	};

	const rowSelection = {
		type: "radio",
		selectedRowKeys,
		onChange: onSelectChange,
	};

	const handleSave = () => {
		if (selectedRowKeys.length > 0) {
			onOk(selectedRowKeys[0]);
		} else {
			onCancel();
		}
	};

	return (
		<Modal
			width={880}
			visible={visible && !isLoading}
			onCancel={onCancel}
			title={"Copy From CoA Template"}
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
					<Button onClick={() => onCancel()} variant="tertiary" size="big">
						Cancel
					</Button>
					<Button onClick={() => handleSave()} variant="primary" size="big">
						Use
					</Button>
				</div>
			}
			content={
				<div style={{ minHeight: "500px" }}>
					<Spacer size={20} />
					{!isLoading && (
						<Col gap="20px">
							<Table columns={columns} data={paginateField} rowSelection={rowSelection} />
							{fields.totalRow > 5 && <Pagination pagination={pagination} />}
						</Col>
					)}
					<Spacer size={14} />
				</div>
			}
		/>
	);
};
