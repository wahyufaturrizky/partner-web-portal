import React, { useState } from "react";
import Router from "next/router";
import {
	useCreateTemplateMenu,
	useDetailMenu,
	useMenuList,
	useTemplateMenu,
} from "../../../hooks/template-menu/useTemplateMenu";

import PreviewMenu from "../../../components/template-menu/PreviewMenu";

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

export default function CreateTemplateMenu() {
	const [search, setSearch] = useState("");
	const [loading, setLoading] = useState(true);
	const [visible, setVisible] = useState(false);
	const [copyID, setCopyID] = useState({
		currently: 0,
		temporary: 0,
		dataIds: [],
	});
	const [rowSelected, setRowSelected] = useState(0);
	const [ids, setIds] = useState<any>([]);
	const [forms, setForms] = useState({
		name: "",
		status: "PUBLISH",
	});

	function sliceIntoChunks(arr: number[], chunkSize: number): number[][] {
		const res = [];
		for (let i = 0; i < arr?.length; i += chunkSize) {
			const chunk = arr.slice(i, i + chunkSize);
			res.push(chunk);
		}
		return res;
	}

	function concatArray(): any {
		const result: any = {};
		for (const art of ids) {
			for (const element of art) {
				result[Number(element)] = Number(element);
			}
		}
		return Object.keys(result);
	}

	const { isLoading: isLoading } = useDetailMenu({
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

	const { mutate: createTemplateMenu }: any = useCreateTemplateMenu({
		options: {
			onSuccess: () => Router.back(),
		},
	});

	const { data: { rows, sortBy, totalRow } = {}, refetch: refetchTemplateMenu } = useTemplateMenu({
		options: {
			onSuccess: (data: FetchData): void => {
				setLoading(false);
			},
		},
		query: { search },
	});

	const dataCopyTemplate: DataRows[] = [];
	rows?.map((item: DataRows, index: number) => {
		dataCopyTemplate.push({
			id: item?.id,
			key: item?.id,
			name: item?.name,
			status: item?.status,
		});
	});

	const { data: menuList } = useMenuList({
		options: {
			onSuccess: (data: any): void => {
				setLoading(false);
			},
		},
		query: { search },
	});

	const _onhandleCreateMenu = (): void => {
		setLoading(true);
		return createTemplateMenu({
			menu_ids: concatArray()?.map((i: string) => Number(i)),
			status: forms.status,
			name: forms.name,
		});
	};

	const _onhandleChangeBox = (id: number) => {
		setIds([...ids, id]);
	};

	const rowSelection = {
		type: "radio",
		selectedRowKeys: rowSelected,
		onChange: (id: number, item: any) => {
			setRowSelected(id);
			setCopyID({ ...copyID, temporary: id });
		},
	};

	const _onhandleChangeForms = (value: string, type: string) => {
		setForms({ ...forms, [type]: value });
	};

	const _onhandleCopyTemplateMenu = () => {
		setLoading(true);
		setVisible(false);
		setCopyID({ ...copyID, currently: copyID.temporary });
	};

	const defaultProps = {
		title: "Create Menu",
		defaultChecked: concatArray().map((i: string) => Number(i)),
		visible: visible,
		isLoading: isLoading || loading,
		status: status,
		onhandleSearch: (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value),
		setForms: (value: string, type: string) => _onhandleChangeForms(value, type),
		actionBtnRight: () => _onhandleCreateMenu(),
		disabledBtnRight: ids?.length < 1 || loading,
		setVisible: (value: boolean) => setVisible(value),
		menuList: menuList,
		_onhandleCheckBox: (id: number) => _onhandleChangeBox(id),
		tableRowSelected: rowSelection,
		actionBtnRightModal: () => _onhandleCopyTemplateMenu(),
		tableList: dataCopyTemplate || [],
	};

	return <PreviewMenu {...defaultProps} />;
}
