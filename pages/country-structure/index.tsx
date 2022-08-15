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

import {useDataCountries, useDeleteDataCountries, useUploadFileCountries} from '../../hooks/mdm/country-structure/useCountries'
import DownloadSvg from "../../assets/icons/ic-download.svg";
import UploadSvg from "../../assets/icons/ic-upload.svg";
import SyncSvg from "../../assets/icons/ic-sync.svg";

import styled from "styled-components";
import { mdmDownloadService } from "../../lib/client";

const dropdownStyles = {cursor: "pointer", display: "flex", alignItems: "center", gap: 5}

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


	// event function
	const columns = [
		{
			title: "Country ID",
			dataIndex: "countryID",
			key: "countryID",
		},
		{
			title: "Country Name",
			dataIndex: "countryName",
			key: "countryName",
		},
		{
			title: "Action",
			render: ({ countryID }: { countryID: string }) => (
				<Button size="small" onClick={() => router.push(`/country-structure/${countryID}`)} variant="tertiary">
					View Detail
				</Button>
			),
		},
	];

	const rowSelection = {
		selectedItem,
		onChange: (countryID: any) => setSelectedItem(countryID)
	};
	
	const { data: fetchDataCountries, refetch: refetchDataCountries, isLoading } = useDataCountries({
		options: {
			onSuccess: (data: any) => {
				pagination.setTotalItems(data.totalRow);
			}
		},
		query: {
			search
		}
	})

	const data: any = [];
	fetchDataCountries?.rows?.map((country: any, index: any) => {
		data.push({
			key: country?.id,
			countryID: country?.id,
			countryName: country?.name
		});
	});

	const { mutate: deleteDataCountries }:any = useDeleteDataCountries({
		options: {
			onSuccess: () => {
				refetchDataCountries()
				setSelectedItem([])
				setVisible({ delete: false, upload: false })
			}
		}
	})

	const handleDownloadFile = (params: any) => {
		mdmDownloadService("/country/template/generate", { params }).then(res => {
			let dataUrl = window.URL.createObjectURL(new Blob([res?.data]));
			let tempLink = document.createElement("a");
			tempLink.href = dataUrl;
			tempLink.setAttribute("download", `country_${new Date().getTime()}.xlsx`);
			tempLink.click();
		})
	}

	const { mutate: uploadFileCountries } = useUploadFileCountries({
		options: {
			onSuccess: () => {
				refetchDataCountries()
				setVisible({ delete: false, upload: false })
			}
		}
	})

	const submitUploadFile = (file: any) => {
		const formData: any = new FormData()
		formData.append('upload_file', file)
		
		uploadFileCountries(formData)
	}

	return (
		<>
			<Col>
				<Text variant={"h4"}>Country</Text>
				<Spacer size={20} />
				<Card>
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
										<div onClick={() => handleDownloadFile({ with_data: "Y" })} style={dropdownStyles}>
											<DownloadSvg />
											<p style={{ margin: "0" }}>Download Template</p>
										</div>
									),
								},
								{
									key: 2,
									value: (
										<div onClick={() => setVisible({ delete: false, upload: true })} style={dropdownStyles}>
											<UploadSvg />
											<p style={{ margin: "0" }}>Upload Template</p>
										</div>
									),
								},
								{
									key: 3,
									value: (
										<div onClick={() => handleDownloadFile({ with_data: "N" })} style={dropdownStyles}>
											<DownloadSvg />
											<p style={{ margin: "0" }}>Download Data</p>
										</div>
									),
								},
								{
									key: 4,
									value: (
										<div onClick={() => {}} style={dropdownStyles}>
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
				</Card>
				<Spacer size={10} />
				<Card>
					<Table
						loading={isLoading}
						rowSelection={rowSelection}
						columns={columns}
						data={data || []}
					/>
					<Pagination pagination={pagination} />
				</Card>
			</Col>

			<FileUploadModal
				visible={visible.upload}
				setVisible={() => setVisible({ upload: false, delete: false })}
				onSubmit={submitUploadFile}
			/>

			<ModalDeleteConfirmation
				totalSelected={0}
				itemTitle={`ID ${selectedItem}`}
				visible={visible.delete}
				onOk={() => deleteDataCountries({ ids: selectedItem })}
				onCancel={() => setVisible({ delete: false, upload: false })}
			/>
		</>
	);
};

const Card = styled.div`
	background: white;
	padding: 16px;
	border-radius: 16px;
`

export default ListTemplateMenu;
