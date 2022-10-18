import React, { useState } from "react";
import {
	Button,
	Spacer,
	Modal,
	Row,
	Input,
	Search,
	Col,
	Table,
	Pagination
} from "pink-lava-ui";
import styled from "styled-components";
import { useCreateUOMLevelConversion, useDeletUOMLevelConversion, useUOMConversionsLevel } from "hooks/mdm/unit-of-measure-conversion/useUOMConversion";
import useDebounce from "lib/useDebounce";
import { queryClient } from "pages/_app";
import usePagination from "@lucasmogari/react-pagination";

export const ModalAddLevel = ({onCancel, visible} : {onCancel: any, visible: any}) => {

	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const columns = [
    {
      title: "Level",
      dataIndex: "level",
    }
  ];

	const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: any) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

	const pagination = usePagination({
    page: 1,
    itemsPerPage: 20,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
  });

  const [searchLevel, setSearchLevel] = useState("");
  const debounceFetchLevel = useDebounce(searchLevel, 1000);
  const [listLevel, setListLevel] = useState<any[]>([]);
	const [newLevel, setNewLevel] = useState("")

  useUOMConversionsLevel({
    query: {
      search: debounceFetchLevel,
      company_id: 'KSNI',
			page: pagination.page,
      limit: pagination.itemsPerPage,
    },
    options: {
      onSuccess: (data: any) => {
				pagination.setTotalItems(data.totalRow);
        const mappedData = data.rows?.map((element: any) => {
            return {
              key: element.id,
              level: element.name,
            };
          });
        const flattenArray = [].concat(...mappedData);
        setListLevel(flattenArray);
      },
    },
  });

	const { mutate: createUom } = useCreateUOMLevelConversion({
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries(["uom-conversions-level"]);
				queryClient.invalidateQueries(["uom-conversion-level/infinite"])
      },
    },
  });

	const addNewLevel = () => {
		const payload: any = {
			name: newLevel,
			company_id: 'KSNI'
		}
		createUom(payload)
		setNewLevel("")
	}

	const { mutate: deleteLevel } = useDeletUOMLevelConversion({
    options: {
      onSuccess: () => {
				queryClient.invalidateQueries(["uom-conversions-level"]);
        setSelectedRowKeys([]);
      },
    },
  });

	return (
		<Modal
			onCancel={onCancel}
			visible={visible}
			width="880px"
			title={`Manage`}
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
					<Button size="big" variant="secondary" key="submit" type="primary" onClick={onCancel}>
						Cancel
					</Button>
					<Button variant="primary" size="big" onClick={onCancel}>
						{"Save"}
					</Button>
				</div>
			}
			content={
				<>
					<Spacer size={22} />
					<Row width="100%" gap="16px" noWrap alignItems="flex-end" style={{ marginBottom: "5px" }}>
						<Input
							width="100%"
							label={`Level Name`}
							height="48px"
							placeholder={`e.g Name`}
							onChange={(e) => setNewLevel(e.target.value)}
							value={newLevel}
						/>
						<Button variant="primary" size="big" onClick={addNewLevel}>
							Add
						</Button>
					</Row>

					<Spacer size={20} />

					<Divider />

					<Spacer size={20} />

					<Row width="100%" noWrap alignItems="center" gap="16px">
						<Search
							placeholder={`Search Name`}
							onChange={(e) => setSearchLevel(e.target.value)}
						/>
						<Button
							variant="tertiary"
							size="big"
							onClick={() => {
								let payload: any = {
									ids: selectedRowKeys
								}
								deleteLevel(payload)
							}}
						>
							Delete
						</Button>
					</Row>

					<Spacer size={20} />

					<Col gap="20px">
						<Table loading={false} columns={columns} data={listLevel} rowSelection={rowSelection} />
						{pagination.totalItems > 5 && <Pagination pagination={pagination} />}
					</Col>
					<Spacer size={38} />
				</>
			}
		/>
	);
};

const Divider = styled.div`
	border: 1px dashed #dddddd;
`;
