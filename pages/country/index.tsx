/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from "react";
import usePagination from "@lucasmogari/react-pagination";
import { useRouter } from "next/router";

import { ModalDeleteConfirmation } from "../../components/modals/ModalDeleteConfirmation";
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

import styles from "./styles.module.css";

import { queryClient } from "../_app";
import DownloadSvg from "../../assets/ic-download.svg";
import UploadSvg from "../../assets/ic-upload.svg";
import SyncSvg from "../../assets/ic-sync.svg";


import { useCountries, useDeleteCountry, useMDMUploadFileCountry} from "../../hooks/country/useCountry";
import axios from "axios";

let token: any;
let apiURL = process.env.NEXT_PUBLIC_API_BASE3;

if (typeof window !== "undefined") {
	token = localStorage.getItem("token");
}

interface DataRows {
	key: React.Key;
	id: string;
	name: string;
	currencyId: string;
}

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
	const [isLoading, setLoading] = useState<boolean>(true);
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
				<Button size="small" onClick={() => router.push(`/country/${id}`)} variant="tertiary">
					View Detail
				</Button>
			),
		},
	];

	const rowSelection = {
		selectedItem,
		onChange: (selectedKey: any) => setSelectedItem(selectedKey),
	};

	// react-query
	const { data: countries, refetch } = useCountries({
		options: {
			onSuccess: () => {
				pagination.setTotalItems(countries?.totalRow);
				setLoading(false);
			},
		},
		query: {
			limit: pagination.itemsPerPage,
			page: pagination.page,
			search,
		},
	});

	const { mutate: _onhandleDeleteCountry }: any = useDeleteCountry({
		options: {
			onSuccess: () => {
				refetch();
				setVisible({ delete: false, upload: false });
				setSelectedItem([]);
			},
		},
	});

	const generateItem = async(value: string) => {
		return await axios
			.get(apiURL + "/country/template/generate", {
				responseType: "blob",
				params: {
					with_data: value,
				},
				headers: {
					Authorization: "Bearer " + token,
					"Content-Type": "application/json",
				},
			})
			.then((response: any): any => {
				var data = new Blob([response?.data], { type: "application / vnd. MS Excel" });
				var csvURL = window.URL.createObjectURL(data);
				var tempLink = document.createElement("a");
				tempLink.href = csvURL;
				tempLink.setAttribute("download", `country_${new Date().getTime()}.xlsx`);
				tempLink.click();
			});
	};

	const data: DataRows[] = [];
	countries?.rows?.map((item: DataRows) => {
		data.push({
			id: item?.id,
			key: item?.id,
			name: item?.name,
			currencyId: item?.currencyId,
		});
	});

	const { mutate: _useUploadFileCountry } = useMDMUploadFileCountry({
		options: {
			onSuccess: () => {
				queryClient.invalidateQueries(["country"]);
				setShowUpload(false);
			},
		},
	})

	const onhandleUploadDocs = async (file: any) => {
		const formData = new FormData()
		formData.append('upload_file', file)

		_useUploadFileCountry(formData)
	}


	return (
		<>
			<Col>
				<Text variant={"h4"}>Country</Text>
				<Spacer size={20} />
				<div className={styles["container-card"]}>
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
							onClick={(e: any) => {
								switch (parseInt(e.key)) {
									case 1:
										generateItem("N");
										break;
									case 2:
										setShowUpload(true);
										break;
									case 3:
										generateItem("Y");
										break;
									case 4:
										break;
									default:
										break;
								}
							}}
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
							<Button size="big" variant="primary" onClick={() => router.push("/country/create")}>
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
							data={data || []}
						/>
						<Pagination pagination={pagination} />
					</Col>
				</div>
			</Col>

			<FileUploadModal
				visible={isShowUpload}
				setVisible={setShowUpload}
				onSubmit={onhandleUploadDocs}
			/>

			<ModalDeleteConfirmation
				totalSelected={0}
				itemTitle={`ID ${selectedItem}`}
				visible={visible.delete}
				onOk={() => _onhandleDeleteCountry({ ids: selectedItem })}
				onCancel={() => setVisible({ delete: false, upload: false })}
			/>
		</>
	);
};

export default ListTemplateMenu;
