import React, { useState } from "react";
import styled from "styled-components";
import {
	Text,
	Button,
	Col,
	Row,
	Spacer,
	Search,
	Table,
	Pagination,
	Modal,
	Input,
	DropdownMenu,
	FileUploadModal,
} from "pink-lava-ui";
import { useForm } from "react-hook-form";
import usePagination from "@lucasmogari/react-pagination";
import {
	useCurrenciesMDM,
	useDeletCurrencyMDM,
	useCreateCurrencyMDM,
	useUpdateCurrencyMDM,
	useUploadFileCurrencyMDM,
} from "../../../hooks/mdm/country-structure/useCurrencyMDM";
import { queryClient } from "../../_app";
import useDebounce from "../../../lib/useDebounce";
import { mdmDownloadService } from "../../../lib/client";

import DownloadSvg from "../../../assets/icons/ic-download.svg";
import UploadSvg from "../../../assets/icons/ic-upload.svg";
import { lang } from "lang";
import { useUserPermissions } from "hooks/user-config/usePermission";

const downloadFile = (params: any) =>
	mdmDownloadService("/currency/download", { params }).then((res) => {
		let dataUrl = window.URL.createObjectURL(new Blob([res.data]));
		let tempLink = document.createElement("a");
		tempLink.href = dataUrl;
		tempLink.setAttribute("download", `currency_${new Date().getTime()}.xlsx`);
		tempLink.click();
	});

const renderConfirmationText = (type: any, data: any) => {
	switch (type) {
		case "selection":
			return data.selectedRowKeys.length > 1
				? `Are you sure to delete ${data.selectedRowKeys.length} items ?`
				: `By deleting it will affect data that already uses Currency ${
						data?.currencyData?.data.find((el: any) => el.key === data.selectedRowKeys[0])?.currency
				  }-${
						data?.currencyData?.data.find((el: any) => el.key === data.selectedRowKeys[0])
							?.currencyName
				  }`;
		case "detail":
			return `By deleting it will affect data that already uses Currency ${data.currency}-${data.currencyName}`;

		default:
			break;
	}
};

const CountryStructureCurrency = () => {
	const pagination = usePagination({
		page: 1,
		itemsPerPage: 20,
		maxPageItems: Infinity,
		numbers: true,
		arrows: true,
		totalItems: 100,
	});
	const t = localStorage.getItem("lan") || "en-US";
	const [search, setSearch] = useState("");
	const [isShowDelete, setShowDelete] = useState({ open: false, type: "selection", data: {} });
	const [isShowUpload, setShowUpload] = useState(false);
	const [modalCurrencyForm, setModalCurrencyForm] = useState({
		open: false,
		data: {},
		typeForm: "create",
	});
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const debounceSearch = useDebounce(search, 1000);

	const { register, handleSubmit } = useForm();

	const { data: dataUserPermission } = useUserPermissions({
		options: {
			onSuccess: () => {},
		},
	});

	const listPermission = dataUserPermission?.permission?.filter(
		(filtering: any) => filtering.menu === "Currency"
	);

	const {
		data: currenciesMDMData,
		isLoading: isLoadingCurrenciesMDM,
		isFetching: isFetchingCurrenciesMDM,
		refetch: refetchurrenciesMDM
	} = useCurrenciesMDM({
		query: {
			search: debounceSearch,
			page: pagination.page,
			limit: pagination.itemsPerPage,
		},
		options: {
			onSuccess: (data: any) => {
				pagination.setTotalItems(data.totalRow);
			},
			select: (data: any) => {
				const mappedData = data?.rows?.map((element: any) => {
					return {
						key: element.id,
						id: element.id,
						currency: element.currency,
						currencyName: element.currencyName,
						action: (
							<div style={{ display: "flex", justifyContent: "left" }}>
								<Button
									size="small"
									onClick={() => {
										setModalCurrencyForm({ open: true, typeForm: "edit", data: element });
									}}
									variant="tertiary"
								>
									{lang[t].currency.tertier.viewDetail}
								</Button>
							</div>
						),
					};
				});

				return { data: mappedData, totalRow: data.totalRow };
			},
		},
	});

	const { mutate: createCurrencyMDM, isLoading: isLoadingCreateCurrencyMDM } = useCreateCurrencyMDM(
		{
			options: {
				onSuccess: () => {
					setModalCurrencyForm({ open: false, typeForm: "", data: {} });
					queryClient.invalidateQueries(["currencies"]);
					refetchurrenciesMDM();
				},
			},
		}
	);

	const { mutate: updateCurrencyMDM, isLoading: isLoadingUpdateCurrencyMDM } = useUpdateCurrencyMDM(
		{
			id: modalCurrencyForm?.data?.id,
			options: {
				onSuccess: () => {
					setModalCurrencyForm({ open: false, typeForm: "", data: {} });
					queryClient.invalidateQueries(["currencies"]);
					refetchurrenciesMDM();
				},
			},
		}
	);

	const { mutate: deleteCurrencyMDM, isLoading: isLoadingDeleteCurrencyMDM } = useDeletCurrencyMDM({
		options: {
			onSuccess: () => {
				setShowDelete({ open: false, data: {}, type: "" });
				setModalCurrencyForm({ open: false, data: {}, typeForm: "" });
				setSelectedRowKeys([]);
				queryClient.invalidateQueries(["currencies"]);
				refetchurrenciesMDM();
			},
		},
	});

	const { mutate: uploadFileCurrencyMDM, isLoading: isLoadingUploadFileCurrencyMDM } =
		useUploadFileCurrencyMDM({
			options: {
				onSuccess: () => {
					queryClient.invalidateQueries(["currencies"]);
					setShowUpload(false);
					refetchurrenciesMDM();
				},
			},
		});

	const columns = [
		{
			title: lang[t].currency.currencyID,
			dataIndex: "id",
		},
		{
			title: lang[t].currency.currencyCode,
			dataIndex: "currency",
		},
		{
			title: lang[t].currency.currencyName,
			dataIndex: "currencyName",
		},
		...(listPermission?.some((el: any) => el.viewTypes[0]?.viewType.name === "View")
		? [
			{
				title: lang[t].currency.currencyAction,
				dataIndex: "action",
				width: "15%",
				align: "left",
			},
		  ]
		: []),
	];

	const rowSelection = {
		selectedRowKeys,
		onChange: (selectedRowKeys: any) => {
			setSelectedRowKeys(selectedRowKeys);
		},
	};

	const onSubmit = (data: any) => {
		switch (modalCurrencyForm.typeForm) {
			case "create":
				createCurrencyMDM(data);
				break;
			case "edit":
				updateCurrencyMDM(data);
				break;
			default:
				setModalCurrencyForm({ open: false, typeForm: "", data: {} });
				break;
		}
	};

	const onSubmitFile = (file: any) => {
		const formData = new FormData();
		formData.append("upload_file", file);

		uploadFileCurrencyMDM(formData);
	};

	return (
		<>
			<Col>
				<Text variant={"h4"}>{lang[t].currency.pageTitle.currency}</Text>
				<Spacer size={20} />
			</Col>
			<Card>
				<Row justifyContent="space-between">
					<Search
						width="340px"
						placeholder={lang[t].currency.search	}
						onChange={(e: any) => {
							setSearch(e.target.value);
						}}
					/>
					<Row gap="16px">
						{listPermission?.filter((data: any) => data.viewTypes[0]?.viewType.name === "Delete")
							.length > 0 && (
							<Button
								size="big"
								variant={"tertiary"}
								onClick={() =>
									setShowDelete({
										open: true,
										type: "selection",
										data: { currencyData: currenciesMDMData, selectedRowKeys },
									})
								}
								disabled={rowSelection.selectedRowKeys?.length === 0}
							>
								{lang[t].currency.tertier.delete}
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
								title={lang[t].currency.secondary.more}
								buttonVariant={"secondary"}
								buttonSize={"big"}
								textVariant={"button"}
								textColor={"pink.regular"}
								iconStyle={{ fontSize: "12px" }}
								onClick={(e: any) => {
									switch (parseInt(e.key)) {
										case 1:
											downloadFile({ with_data: "N" });
											break;
										case 2:
											setShowUpload(true);
											break;
										case 3:
											downloadFile({ with_data: "Y" });
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
													<p style={{ margin: "0" }}>{lang[t].currency.ghost.downloadTemplate}</p>
												</div>
											),
										}),
									},
									{
										...(listPermission?.filter(
											(data: any) => data.viewTypes[0]?.viewType.name === "Upload"
										).length > 0 && {
											key: 2,
											value: (
												<div style={{ display: "flex", alignItems: "center", gap: 5 }}>
													<UploadSvg />
													<p style={{ margin: "0" }}>{lang[t].currency.ghost.uploadTemplate}</p>
												</div>
											),
										}),
									},
									{
										...(listPermission?.filter(
											(data: any) => data.viewTypes[0]?.viewType.name === "Download Data"
										).length > 0 && {
											key: 3,
											value: (
												<div style={{ display: "flex", alignItems: "center", gap: 5 }}>
													<DownloadSvg />
													<p style={{ margin: "0" }}>{lang[t].currency.ghost.downloadData}</p>
												</div>
											),
										}),
									},
								]}
							/>
						)}
						{allowPermissionToShow?.map((data: any) => data.name)?.includes("Create Currency") && (
							<Button
								size="big"
								variant="primary"
								onClick={() => setModalCurrencyForm({ open: true, typeForm: "create", data: {} })}
							>
								{lang[t].currency.primary.create}
							</Button>
						)}
						
					</Row>
				</Row>
			</Card>
			<Spacer size={10} />
			<Card style={{ padding: "16px 20px" }}>
				<Col gap={"60px"}>
					<Table
						loading={isLoadingCurrenciesMDM || isFetchingCurrenciesMDM}
						columns={columns}
						data={currenciesMDMData?.data}
						rowSelection={rowSelection}
					/>
					<Pagination pagination={pagination} />
				</Col>
			</Card>

			{modalCurrencyForm.open && (
				<Modal
					width={"350px"}
					centered
					closable={false}
					visible={modalCurrencyForm.open}
					onCancel={() => setModalCurrencyForm({ open: false, data: {}, typeForm: "" })}
					title={modalCurrencyForm.typeForm === "create" ? lang[t].currency.modalTitleCreate.currency : lang[t].currency.modalTitleUpdate.currency}
					footer={null}
					content={
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								justifyContent: "center",
							}}
						>
							<Input
								defaultValue={modalCurrencyForm.data?.currency}
								width="100%"
								label={lang[t].currency.currencyCode}
								height="48px"
								placeholder={"e.g IDR"}
								{...register("currency", {
									shouldUnregister: true,
								})}
							/>
							<Spacer size={20} />
							<Input
								defaultValue={modalCurrencyForm.data?.currencyName}
								width="100%"
								label={lang[t].currency.currencyName}
								height="48px"
								placeholder={"e.g Indonesia Rupiah"}
								{...register("currency_name", {
									shouldUnregister: true,
								})}
							/>
							<Spacer size={14} />
							<div
								style={{
									display: "flex",
									justifyContent: "center",
									gap: "10px",
									marginBottom: "20px",
								}}
							>
								{modalCurrencyForm.typeForm === "create" ? (
									<Button
										size="big"
										variant={"tertiary"}
										key="submit"
										type="primary"
										onClick={() => setModalCurrencyForm({ open: false, data: {}, typeForm: "" })}
									>
										{lang[t].currency.tertier.cancel}
									</Button>
								) : (
									<Button
										size="big"
										variant={"tertiary"}
										key="submit"
										type="primary"
										onClick={() => {
											setShowDelete({ open: true, type: "detail", data: modalCurrencyForm.data });
										}}
									>
										{lang[t].currency.tertier.delete}
									</Button>
								)}

								<Button onClick={handleSubmit(onSubmit)} variant="primary" size="big">
									{isLoadingCreateCurrencyMDM || isLoadingUpdateCurrencyMDM ? "Loading..." : lang[t].currency.primary.save}
								</Button>
							</div>
						</div>
					}
				/>
			)}

			{isShowDelete.open && (
				<Modal
					closable={false}
					centered
					visible={isShowDelete.open}
					onCancel={() => setShowDelete({ open: false, type: "", data: {} })}
					title={"Confirm Delete"}
					footer={null}
					content={
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								justifyContent: "center",
							}}
						>
							<Spacer size={4} />
							{renderConfirmationText(isShowDelete.type, isShowDelete.data)}
							<Spacer size={20} />
							<div
								style={{
									display: "flex",
									justifyContent: "center",
									gap: "10px",
									marginBottom: "20px",
								}}
							>
								<Button
									size="big"
									variant="tertiary"
									key="submit"
									type="primary"
									onClick={() => setShowDelete({ open: false, type: "", data: {} })}
								>
									Cancel
								</Button>
								<Button
									variant="primary"
									size="big"
									onClick={() => {
										if (isShowDelete.type === "selection") {
											deleteCurrencyMDM({ ids: selectedRowKeys });
										} else {
											deleteCurrencyMDM({ ids: [modalCurrencyForm.data.id] });
										}
									}}
								>
									{isLoadingDeleteCurrencyMDM ? "loading..." : "Yes"}
								</Button>
							</div>
						</div>
					}
				/>
			)}

			{isShowUpload && (
				<FileUploadModal
					visible={isShowUpload}
					setVisible={setShowUpload}
					onSubmit={onSubmitFile}
				/>
			)}
		</>
	);
};

const Card = styled.div`
	background: #ffffff;
	border-radius: 16px;
	padding: 16px;
`;

export default CountryStructureCurrency;
