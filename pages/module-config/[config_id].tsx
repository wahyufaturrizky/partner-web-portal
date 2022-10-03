import React, { useState } from "react";
import {
	Text,
	Col,
	Row,
	Spin,
	Spacer,
	Dropdown,
	Table,
	Button,
	Accordion,
	Input,
} from "pink-lava-ui";
import styled from "styled-components";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import Router, { useRouter } from "next/router";

import { ModalDeleteConfirmation } from "../../components/elements/Modal/ModalConfirmationDelete";
import {
	useConfig,
	useDeleteConfig,
	useConfigs,
	useUpdateConfig,
} from "../../hooks/config/useConfig";

const schema = yup
	.object({
		name: yup.string().required("Name is Required"),
	})
	.required();

const ConfigDetail: any = () => {
	const router = useRouter();
	const { config_id } = router.query;

	const [modalDelete, setModalDelete] = useState({ open: false });

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(schema),
	});

	const { data: configs, isLoading: isLoadingParent } = useConfigs({
		options: {},
		query: {
			search: "",
			page: 1,
			limit: 100000,
			parent: "",
		},
	});

	const parents = configs?.rows?.map((config) => ({ id: config.id, value: config.name }));
	if (parents?.length > 0) {
		parents.unshift({ id: "", value: "All" });
	}

	const { data: config, isLoading } = useConfig({
		config_id,
		options: {
			onSuccess: (data) => {
				setValue("name", data.name);
				setValue("parentId", data.parentId);
			},
		},
	});

	const { mutate: updatePermission } = useUpdateConfig({
		config_id,
		options: {
			onSuccess: () => {
				Router.push("/config");
			},
		},
	});

	const subModules = config?.subModules;
	const data = [];
	subModules?.map((field) => {
		data.push({
			key: field.id,
			modules: field.name,
			action: (
				<Button size="small" onClick={() => router.push(`/module-config/${field.id}`)} variant="tertiary">
					View Detail
				</Button>
			),
		});
	});

	const columns = [
		{
			title: "Modules",
			dataIndex: "modules",
		},
		{
			title: "",
			dataIndex: "action",
			width: 160,
		},
	];

	const { mutate: deleteConfig } = useDeleteConfig({
		options: {
			onSuccess: () => {
				setModalDelete({ open: false });
				router.push("/config");
			},
		},
	});

	const onSubmit = (data) => updatePermission(data);

	return (
		<>
			{isLoading || isLoadingParent ? (
				<Center>
					<Spin tip="Loading data..." />
				</Center>
			) : (
				<Col>
					<Row gap="4px">
						<Text variant={"h4"}>{config?.name}</Text>
					</Row>
					<Spacer size={12} />
					<Card>
						<Row justifyContent="flex-end" alignItems="center" nowrap>
							<Row>
								<Row gap="16px">
									{/* <Button
										size="big"
										variant={"tertiary"}
										onClick={() => setModalDelete({ open: true })}
									>
										Delete
									</Button> */}
									<Button size="big" variant={"primary"} onClick={handleSubmit(onSubmit)}>
										Save
									</Button>
								</Row>
							</Row>
						</Row>
					</Card>

					<Spacer size={20} />

					<Accordion>
						<Accordion.Item key={1}>
							<Accordion.Header variant="blue">General</Accordion.Header>
							<Accordion.Body>
								<Row width="100%" gap="20px" noWrap>
									<Input
										width="100%"
										label="Name"
										height="48px"
										placeholder={"e.g Sales"}
										defaultValue={config?.name}
										{...register("name", { required: true })}
									/>
									<Dropdown
										label="Parent Module"
										width={"100%"}
										items={parents}
										placeholder={"Select"}
										noSearch
										defaultValue={config?.parentId}
										handleChange={(value) => setValue("parentId", value)}
									/>
								</Row>
							</Accordion.Body>
						</Accordion.Item>
					</Accordion>

					<Spacer size={20} />

					<Accordion>
						<Accordion.Item key={1}>
							<Accordion.Header variant="blue">
								<Row gap="8px" alignItems="baseline">
									Sub Module
								</Row>
							</Accordion.Header>
							<Accordion.Body>
								<Table columns={columns} data={data} />
							</Accordion.Body>
						</Accordion.Item>
					</Accordion>
					{modalDelete.open && (
						<ModalDeleteConfirmation
							visible={modalDelete.open}
							onCancel={() => setModalDelete({ open: false })}
							onOk={() => deleteConfig({ id: [config_id] })}
							itemTitle={config?.name}
						/>
					)}
				</Col>
			)}
		</>
	);
};

const Center = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
`;

const Card = styled.div`
	background: #ffffff;
	border-radius: 16px;
	padding: ${(p) => (p.padding ? p.padding : "16px")};
`;

export default ConfigDetail;
