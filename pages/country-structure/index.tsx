import React, { useState } from "react";
import usePagination from "@lucasmogari/react-pagination";
import { useRouter } from "next/router";

import { ModalDeleteConfirmation } from "../../components/elements/Modal/ModalConfirmationDelete";
import {
	Button,
	Col,
	DropdownMenu,
	Pagination,
	Row,
	Search,
	Spacer,
	Table,
	Text,
	FileUploadModal,
} from "pink-lava-ui";

import DownloadSvg from "../../assets/icons/ic-download.svg";
import UploadSvg from "../../assets/icons/ic-upload.svg";
import SyncSvg from "../../assets/icons/ic-sync.svg";

const ListTemplateMenu = () => {
	const router = useRouter();
	const pagination = usePagination({
		page: 1,
		itemsPerPage: 10,
		maxPageItems: Infinity,
		numbers: true,
		arrows: true,
		totalItems: 100,
	});
	const [visible, setVisible] = useState({
		delete: false,
		upload: false,
	});
	const [search, setSearch] = useState<string>("");
	const [selectedItem, setSelectedItem] = useState([]);
	const [isShowUpload, setShowUpload] = useState(false);


	// event function
	const columns = [
		{
			title: "Country ID",
			dataIndex: "currencyId",
			key: "currencyId",
		},
		{
			title: "Country Name",
			dataIndex: "name",
			key: "name",
		},
		{
			title: "Action",
			render: ({ id }: { id: string }) => (
				<Button size="small" onClick={() => router.push(`/country-structure/${id}`)} variant="tertiary">
					View Detail
				</Button>
			),
		},
	];

	const rowSelection = {
		selectedItem,
		onChange: (selectedKey: any) => setSelectedItem(selectedKey),
	};


	return (
		<>
			<Col>
				<Text variant={"h4"}>Country</Text>
				<Spacer size={20} />
				<div>
					<Row justifyContent="space-between">
						<Search
							width="380px"
							nameIcon="SearchOutlined"
							placeholder="Search Country ID, Country Name"
							onChange={({ target }: React.ChangeEvent<HTMLInputElement>) =>
								setSearch(target.value)
							}
						/>
						<Row gap="16px">
							<Button
								size="big"
								variant="tertiary"
								onClick={() => setVisible({ delete: true, upload: false })}
							>
								Delete
							</Button>
							<DropdownMenu
							title={"More"}
							buttonVariant={"secondary"}
							buttonSize={"big"}
							textVariant={"button"}
							textColor={"pink.regular"}
							iconStyle={{ fontSize: "12px" }}
							menuList={[
								{
									key: 1,
									value: (
										<div style={{ display: "flex", alignItems: "center", gap: 5 }}>
											<DownloadSvg />
											<p style={{ margin: "0" }}>Download Template</p>
										</div>
									),
								},
								{
									key: 2,
									value: (
										<div style={{ display: "flex", alignItems: "center", gap: 5 }}>
											<UploadSvg />
											<p style={{ margin: "0" }}>Upload Template</p>
										</div>
									),
								},
								{
									key: 3,
									value: (
										<div style={{ display: "flex", alignItems: "center", gap: 5 }}>
											<DownloadSvg />
											<p style={{ margin: "0" }}>Download Data</p>
										</div>
									),
								},
								{
									key: 4,
									value: (
										<div style={{ display: "flex", alignItems: "center", gap: 5 }}>
											<SyncSvg />
											<p style={{ margin: "0" }}>Sync Data</p>
										</div>
									),
								},
							]}
						/>
							<Button size="big" variant="primary" onClick={() => router.push("/country-structure/create")}>
								Create
							</Button>
						</Row>
					</Row>
				</div>
				<Spacer size={10} />
				<div>
					<Col gap="60px">
						<Table
							loading={false}
							rowSelection={rowSelection}
							columns={columns}
							data={[]}
						/>
						<Pagination pagination={pagination} />
					</Col>
				</div>
			</Col>

			<FileUploadModal
				visible={isShowUpload}
				setVisible={setShowUpload}
				onSubmit={() => {}}
			/>

			<ModalDeleteConfirmation
				totalSelected={0}
				itemTitle={`ID ${selectedItem}`}
				visible={visible.delete}
				onOk={() => {}}
				onCancel={() => setVisible({ delete: false, upload: false })}
			/>
		</>
	);
};

export default ListTemplateMenu;
