import usePagination from "@lucasmogari/react-pagination";
import { Col, Pagination, Search, Spacer, Spin, Table, Text } from "pink-lava-ui";
import React, { useState } from "react";
import styled from "styled-components";
import { useDateFormatLists } from "../../hooks/date-format/useDateFormat";
import { COLORS } from "../../styles/COLOR";

const MenuList: any = () => {
	const pagination = usePagination({
		page: 1,
		itemsPerPage: 10,
		maxPageItems: Infinity,
		numbers: true,
		arrows: true,
		totalItems: 100,
	});

	const [search, setSearch] = useState("");

	const {
		data: fields,
		refetch: refetchFields,
		isLoading: isLoadingField,
	} = useDateFormatLists({
		options: {
			onSuccess: (data) => {
				pagination.setTotalItems(data.totalRow);
			},
		},
		query: {
			search,
			page: pagination.page,
			limit: pagination.itemsPerPage,
		},
	});

	const columns = [
		{
			title: "Date Format",
			dataIndex: "field_date_format",
		},
	];

	const data = [];
	fields?.rows?.map((field) => {
		data.push({
			key: field.id,
			field_date_format: field.format,
		});
	});

	const paginateField = data;

	return (
		<>
			<Col>
				<Text variant={"h4"}>Date Format</Text>
				<Spacer size={20} />
				<Card>
					<Search
						width="380px"
						nameIcon="SearchOutlined"
						placeholder="Search Date Format"
						colorIcon={COLORS.grey.regular}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</Card>
				<Spacer size={10} />
				<Card style={{ padding: "16px 20px" }}>
					<Col gap="60px">
						<Table
							loading={isLoadingField}
							columns={columns.filter(
								(filtering) =>
									filtering.dataIndex !== "id" &&
									filtering.dataIndex !== "created_at" &&
									filtering.dataIndex !== "modified_by" &&
									filtering.dataIndex !== "modified_at" &&
									filtering.dataIndex !== "deleted_by" &&
									filtering.dataIndex !== "deleted_at" &&
									filtering.dataIndex !== "created_by"
							)}
							data={paginateField}
						/>
						<Pagination pagination={pagination} />
					</Col>
				</Card>
			</Col>
		</>
	);
};

const Card = styled.div`
	background: #ffffff;
	border-radius: 16px;
	padding: 16px;
`;

export default MenuList;
