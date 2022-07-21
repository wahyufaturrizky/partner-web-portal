import React, { useState } from "react";
import usePagination from "@lucasmogari/react-pagination";
import Router from "next/router";

import { Button, Col, Pagination, Row, Search, Spacer, Table, Text } from "pink-lava-ui";
import { ModalDeleteConfirmation } from "../../../components/modals/ModalDeleteConfirmation";
import {
	useDeleteTemplateMenu,
	useTemplateMenu,
} from "../../../hooks/template-menu/useTemplateMenu";

import styles from "./styles.module.css";

interface DataRows {
	key: React.Key;
	id: number;
	name: string;
	status: string;
}

interface FetchData {
	rows: DataRows[];
	sortBy: string[];
	totalRow: number;
}

const ListTemplateMenu: React.FC = () => {
	const pagination = usePagination({
		page: 1,
		itemsPerPage: 10,
		maxPageItems: Infinity,
		numbers: true,
		arrows: true,
		totalItems: 100,
	});
	const [visible, setVisible] = useState<boolean>(false);
	const [search, setSearch] = useState<string>("");
	const [isLoading, setLoading] = useState<boolean>(true);
	const [selectedItem, setSelectedItem] = useState([]);

	const columns = [
		{
			title: "Name",
			dataIndex: "name",
		},
		{
			title: "Action",
			dataIndex: "id",
			render: (id: number) => (
				<span
					onClick={() => Router.push(`/template-config/menu/${id}`)}
					className={styles["button-view"]}
				>
					View Detail
				</span>
			),
		},
	];

	const { data: { rows, sortBy, totalRow } = {}, refetch: refetchTemplateMenu } = useTemplateMenu({
		options: {
			onSuccess: (data: FetchData): void => {
				pagination.setTotalItems(data.totalRow);
				setLoading(false);
			},
		},
		query: {
			search,
			page: pagination.page,
			limit: pagination.itemsPerPage,
		},
	});

	const { mutate: deleteTemplateMenu }: any = useDeleteTemplateMenu({
		options: {
			onSuccess: () => {
				refetchTemplateMenu();
				setVisible(false);
				setSelectedItem([]);
			},
		},
	});

	const data: DataRows[] = [];
	rows?.map((item: DataRows, index: number) => {
		data.push({
			id: item?.id,
			key: item?.id,
			name: item?.name,
			status: item?.status,
		});
	});

	const rowSelection = {
		selectedItem,
		onChange: (selectedKey: any) => setSelectedItem(selectedKey),
	};

	return (
		<>
			<Col>
				<Text variant={"h4"}>Menu Template List</Text>
				<Spacer size={20} />
				<div className={styles["container-card"]}>
					<Row justifyContent="space-between">
						<Search
							width="380px"
							nameIcon="SearchOutlined"
							placeholder="Search Name"
							onChange={({ target }: React.ChangeEvent<HTMLInputElement>) =>
								setSearch(target.value)
							}
						/>
						<Row gap="16px">
							<Button
								size="big"
								variant="tertiary"
								onClick={() => setVisible(true)}
								disabled={!(selectedItem.length > 0)}
							>
								Delete
							</Button>
							<Button
								size="big"
								variant="primary"
								onClick={() => Router.push("/template-config/menu/create")}
							>
								Create
							</Button>
						</Row>
					</Row>
				</div>
				<Spacer size={10} />
				<div className={styles["container-card"]}>
					<Col gap="60px">
						<Table
							loading={isLoading}
							rowSelection={rowSelection}
							columns={columns}
							data={data ?? []}
						/>
						<Pagination pagination={pagination} />
					</Col>
				</div>
			</Col>

			<ModalDeleteConfirmation
				totalSelected={0}
				itemTitle={`ID ${selectedItem}`}
				visible={visible}
				onOk={() => deleteTemplateMenu({ ids: selectedItem })}
				onCancel={() => setVisible(false)}
			/>
		</>
	);
};

export default ListTemplateMenu;
