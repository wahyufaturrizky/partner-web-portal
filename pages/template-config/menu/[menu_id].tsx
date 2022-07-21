/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from "next/router";
import React, { useState } from "react";
import Router from "next/router";
import PreviewMenu from "../../../components/template-menu/PreviewMenu";
import {
	useDetailMenu,
	useMenuList,
	useTemplateMenu,
	useUpdateTemplateMenu,
} from "../../../hooks/template-menu/useTemplateMenu";

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

const status = [
	{ id: "PUBLISH", value: '<div key="published" style="color:green;">Published</div>' },
	{ id: "DRAFT", value: '<div key="draft" style="color:red;">Draft</div>' },
];

export default function PreviewTemplateMenu() {
	const router = useRouter();
	const { menu_id } = router.query;

	const [search, setSearch] = useState("");
	const [loading, setLoading] = useState(true);
	const [radioChecked, setRadioChecked] = useState(0);
	const [ids, setIds] = useState<any>([]);
	const [visible, setVisible] = useState(false);
	const [forms, setForms] = useState({
		name: "",
		menuIds: [],
		status: "DRAFT",
	});
	const [copyID, setCopyID] = useState({
		currently: 0,
		temporary: 0,
		dataIds: [],
	});

	function concatArray(): string[] {
		const result: any = {};
		for (const art of ids) {
			for (const element of art) {
				result[Number(element)] = Number(element);
			}
		}
		return Object.keys(result);
	}

	function sliceIntoChunks(arr: number[], chunkSize: number): number[][] {
		const res = [];
		for (let i = 0; i < arr?.length; i += chunkSize) {
			const chunk = arr.slice(i, i + chunkSize);
			res.push(chunk);
		}
		return res;
	}

	const { isLoading: isLoading } = useDetailMenu({
		id: menu_id,
		options: {
			onSuccess: (response: any) => {
				console.log("yg update ini terpanggil copyy IDDDDDDDDDDDDD");
				setIds(sliceIntoChunks(response?.menuIds, 1));
				setForms({ ...forms, ...response });
				setLoading(false);
			},
		},
	});

	useDetailMenu({
		id: copyID?.currently,
		options: {
			onSuccess: (response: any) => {
				setLoading(false);
				if (!(copyID?.currently === 0)) {
					setIds(sliceIntoChunks(response?.menuIds, 1));
				}
			},
		},
	});

	const _onhandleChangeForms = (value: string, type: string) => {
		setForms({ ...forms, [type]: value });
	};

	const { data: menuList } = useMenuList({
		options: {
			onSuccess: (data: any): void => {
				setLoading(false);
			},
		},
		query: { search },
	});

	const { mutate: updateTemplateMenu }: any = useUpdateTemplateMenu({
		id: menu_id,
		options: {
			onSuccess: (response: any) => {
				setLoading(false);
				Router.back();
			},
		},
	});

	const _onhandleUpdateMenu = () => {
		setLoading(true);
		updateTemplateMenu({
			name: forms?.name,
			status: forms?.status,
			menu_ids: concatArray()?.map((i: string) => Number(i)),
		});
	};

	const _onhandleChangeBox = (id: number): any => {
		setIds([...ids, id]);
	};

	const { data: { rows, sortBy, totalRow } = {}, refetch: refetchTemplateMenu } = useTemplateMenu({
		options: {
			onSuccess: (data: FetchData): void => {
				setLoading(false);
			},
		},
		query: {
			page: 1,
			limit: 10,
		},
	});

	const _onhandleCopyTemplateMenu = () => {
		setLoading(true);
		setVisible(false);
		setCopyID({ ...copyID, currently: copyID.temporary });
	};

	const data: DataRows[] = [];
	rows?.map((item: DataRows, index: number) => {
		data.push({
			id: item?.id,
			key: item?.id,
			name: item?.name,
			status: item?.status,
		});
	});

	const rowSelected = {
		type: "radio",
		selectedRowKeys: radioChecked,
		onChange: (id: number) => {
			setRadioChecked(id);
			setCopyID({ ...copyID, temporary: id });
		},
	};

	const defaultProps = {
		title: forms?.name,
		defaultStatus: forms?.status,
		defaultChecked: concatArray().map((i: string) => Number(i)),
		isLoading: isLoading || loading,
		visible: visible,
		status: status,
		forms: { ...forms },
		onhandleSearch: (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value),
		setForms: (value: string, type: string) => _onhandleChangeForms(value, type),
		actionBtnRight: () => _onhandleUpdateMenu(),
		disabledBtnRight: ids?.length < 1 || loading,
		setVisible: (value: boolean) => setVisible(value),
		menuList: menuList ?? [],
		_onhandleCheckBox: (id: number) => _onhandleChangeBox(id),
		tableRowSelected: rowSelected,
		actionBtnRightModal: () => _onhandleCopyTemplateMenu(),
		tableList: data,
	};

	return <PreviewMenu {...defaultProps} />;
}
