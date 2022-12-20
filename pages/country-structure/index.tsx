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

import styled from "styled-components";
import { mdmDownloadService } from "../../lib/client";
import { useUserPermissions } from "hooks/user-config/usePermission";

const dropdownStyles = {cursor: "pointer", display: "flex", alignItems: "center", gap: 5}

const ListTemplateMenu = () => {
	const router = useRouter();
	const pagination = usePagination({
		page: 1,
		itemsPerPage: 20,
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

	const { data: dataUserPermission } = useUserPermissions({
		options: {
			onSuccess: () => {},
		},
	});

	const listPermission = dataUserPermission?.permission?.filter(
		(filtering: any) => filtering.menu === "Country"
	);

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
		...(listPermission?.some((el: any) => el.viewTypes[0]?.viewType.name === "View")
		? [
			{
				title: "Action",
				render: ({ countryID }: { countryID: string }) => (
					<Button size="small" onClick={() => router.push(`/country-structure/${countryID}`)} variant="tertiary">
						View Detail
					</Button>
				),
			},
		  ]
		: []),
	];

	const rowSelection = {
		selectedItem,
		onChange: (countryID: any) => setSelectedItem(countryID)
	};
	
	const { data: fetchDataCountries, refetch: refetchDataCountries, isLoading } = useDataCountries({
		options: {
			onSuccess: (data: any) => {
				pagination.setTotalItems(data?.totalRow);
			}
		},
		query: {
			limit: pagination?.itemsPerPage,
			page: pagination?.page,
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
						{listPermission?.filter((data: any) => data.viewTypes[0]?.viewType.name === "Delete")
							.length > 0 && (
							<Button
								size="big"
								variant="tertiary"
								onClick={() => setVisible({ delete: true, upload: false })}
								disabled={rowSelection.selectedItem?.length < 1}
							>
								Delete
							</Button>
						)}
						{(listPermission?.filter(
							(data: any) => data.viewTypes[0]?.viewType.name === "Download Template"
							).length > 0 ||
							listPermission?.filter(
								(data: any) => data.viewTypes[0]?.viewType.name === "Download Data"
							).length > 0 ||
							listPermission?.filter((data: any) => data.viewTypes[0]?.viewType.name === "Upload")
								.length > 0) && (
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
											handleDownloadFile({ with_data: "N" });
											break;
										case 2:
											setVisible({ delete: false, upload: true })
											break;
										case 3:
											handleDownloadFile({ with_data: "Y" });
											break;
										case 4:
											break;
										default:
											break;
									}
								}}
								menuList={[
									{
										...(listPermission?.filter(
											(data: any) => data.viewTypes[0]?.viewType.name === "Download Template"
										).length > 0 && {
											key: 1,
											value: (
												<div style={{ display: "flex", alignItems: "center", gap: 5 }}>
													<DownloadSvg />
													<p style={{ margin: "0" }}>Download Template</p>
												</div>
											),
										}),
									},
									{
										...(listPermission?.filter(
											(data: any) => data.viewTypes[0]?.viewType.name === "Download Data"
										).length > 0 && {
											key: 2,
											value: (
												<div style={{ display: "flex", alignItems: "center", gap: 5 }}>
													<UploadSvg />
													<p style={{ margin: "0" }}>Upload Template</p>
												</div>
											),
										}),
									},
									{
										...(listPermission?.filter(
											(data: any) => data.viewTypes[0]?.viewType.name === "Upload"
										).length > 0 && {
											key: 3,
											value: (
												<div style={{ display: "flex", alignItems: "center", gap: 5 }}>
													<DownloadSvg />
													<p style={{ margin: "0" }}>Download Data</p>
												</div>
											),
										}),
									},
								]}
							/>
						)}	
						{listPermission?.filter((data: any) => data.viewTypes[0]?.viewType.name === "Create")
							.length > 0 && (
							<Button size="big" variant="primary" onClick={() => router.push("/country-structure/create")}>
								Create
							</Button>
						)}
							
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

			{visible.upload && 
			<FileUploadModal
				visible={visible.upload}
				setVisible={() => setVisible({ upload: false, delete: false })}
				onSubmit={submitUploadFile}
			/>
}

			
			{visible.delete && 
			<ModalDeleteConfirmation
				totalSelected={0}
				itemTitle={`ID ${selectedItem}`}
				visible={visible.delete}
				onOk={() => deleteDataCountries({ ids: selectedItem })}
				onCancel={() => setVisible({ delete: false, upload: false })}
			/>}
			
		</>
	);
};

const Card = styled.div`
	background: white;
	padding: 16px;
	border-radius: 16px;
`

export default ListTemplateMenu;
