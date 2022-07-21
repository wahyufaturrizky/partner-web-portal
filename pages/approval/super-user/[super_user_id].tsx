import React, { useState } from "react";
import { Text, Col, Spin, Row, Spacer, Dropdown2, Button, Accordion, Input } from "pink-lava-ui";
import styled from "styled-components";
import ArrowLeft from "../../../assets/arrow-left.svg";
import Router, { useRouter } from "next/router";
import {
	useApproveSuperUser,
	useDeleteSuperUser,
	useSuperUser,
	useUpdateSuperUser,
} from "../../../hooks/super-user/useSuperUser";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useRolePermissions } from "../../../hooks/role/useRole";
import { useTimezone } from "../../../hooks/timezone/useTimezone";
import { useLanguages } from "../../../hooks/languages/useLanguages";
import { ModalDeleteConfirmation } from "../../../components/modals/ModalDeleteConfirmation";
import { queryClient } from "../../_app";
import { ModalRejectSuperUser } from "../../../components/modals/ModalRejectSuperUser";

const schema = yup
	.object({
		fullname: yup.string().required("Full Name is Required"),
		roleId: yup.string().required("Role is Required"),
		email: yup.string().required("Email is Required"),
		phoneNumber: yup.string().required("Phone Number is Required"),
		timezone: yup.string().required("Timezone is Required"),
		language: yup.string().required("Language is Required"),
	})
	.required();

const defaultValue = {
	activeStatus: "Y",
};

const CreateSuperUser: any = () => {
	const router = useRouter();
	const { super_user_id } = router.query;
	const [modalReject, setModalReject] = useState({ open: false });

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(schema),
		defaultValues: defaultValue,
	});

	const { data: superUser, isLoading: isLoadingUser } = useSuperUser({
		super_user_id,
		options: {
			onSuccess: (data) => {
				setValue("fullname", data.fullname);
				setValue("email", data.email);
				setValue("phoneNumber", data.phoneNumber);
				setValue("roleId", data.roleId);
				setValue("timezone", data.timezone);
				setValue("language", data.language);
			},
		},
	});

	const { data: rolesData, isLoading: isLoadingRole } = useRolePermissions({
		query: {
			limit: 10000,
		},
	});

	const roles = rolesData?.rows?.map((row) => ({ id: row.id, value: row.name })) ?? [];
	const { data: timezoneData } = useTimezone();
	const timezone = timezoneData?.rows?.map((row) => ({ id: row.id, value: row.name })) ?? [];
	const { data: languageData } = useLanguages();
	const language = languageData?.rows?.map((row) => ({ id: row.id, value: row.name })) ?? [];

	const activeStatus = [
		{ id: "Y", value: '<div key="1" style="color:green;">Active</div>' },
		{ id: "N", value: '<div key="2" style="color:red;">Non Active</div>' },
	];

	const { mutate: updateSuperUser } = useUpdateSuperUser({
		super_user_id,
		options: {
			onSuccess: () => {
				Router.push("/approval");
			},
		},
	});

	const { mutate: approveSuperUser } = useApproveSuperUser({
		options: {
			onSuccess: () => {
				queryClient.refetchQueries(["approval-super-users"]);
			},
		},
	});

	const onSubmit = (data) => {
		const payload = {
			ids: [super_user_id],
			approvalStatus: "APPROVED",
		};
		approveSuperUser(payload);
		updateSuperUser(data);
	};

	const reject = (data) => {
		approveSuperUser(data);
		setModalReject({ open: false });
		Router.push("/approval");
	};

	return (
		<>
			{isLoadingUser || isLoadingRole ? (
				<Center>
					<Spin tip="Loading data..." />
				</Center>
			) : (
				<Col>
					<Row gap="4px" alignItems="center">
						<ArrowLeft style={{ cursor: "pointer" }} onClick={() => Router.push("/approval")} />
						<Text variant={"h4"}>{superUser?.fullname}</Text>
					</Row>
					<Spacer size={12} />
					<Card padding="20px">
						<Row justifyContent="space-between" alignItems="center" nowrap>
							<Dropdown2
								label=""
								isHtml
								width={"185px"}
								items={activeStatus}
								placeholder={"Status"}
								handleChange={(text) => setValue("activeStatus", text)}
								noSearch
								defaultValue="Y"
								disabled={true}
							/>
							<Row>
								<Row gap="16px">
									<Button
										size="big"
										variant={"secondary"}
										onClick={() => setModalReject({ open: true })}
									>
										Reject
									</Button>
									<Button size="big" variant={"primary"} onClick={handleSubmit(onSubmit)}>
										Approve
									</Button>
								</Row>
							</Row>
						</Row>
					</Card>

					<Spacer size={20} />

					<Accordion>
						<Accordion.Item key={1}>
							<Accordion.Header variant="blue">Employee Information</Accordion.Header>
							<Accordion.Body>
								<Col width="100%" gap="20px">
									<Row width="100%" gap="20px" noWrap>
										<Input
											width="100%"
											label="Full Name"
											height="48px"
											disabled={true}
											defaultValue={superUser?.fullname}
											noSearch
											placeholder={"e.g Grace"}
											{...register("fullname", { required: true })}
										/>
										<Dropdown2
											label="Partner"
											width={"100%"}
											items={[]}
											placeholder={"Select"}
											noSearch
											disabled={true}
											handleChange={(value) => setValue("partner", value)}
										/>
									</Row>
									<Dropdown2
										label="Role"
										width={"536px"}
										items={roles}
										defaultValue={superUser?.roleId}
										placeholder={"Select"}
										handleChange={(value) => setValue("roleId", value)}
										noSearch
										disabled={true}
									/>
								</Col>
							</Accordion.Body>
						</Accordion.Item>
					</Accordion>

					<Spacer size={20} />

					<Accordion>
						<Accordion.Item key={1}>
							<Accordion.Header variant="blue">General Information</Accordion.Header>
							<Accordion.Body>
								<Col width="100%" gap="20px">
									<Row width="100%" gap="20px" noWrap>
										<Input
											disabled={true}
											width="100%"
											label="Email"
											height="48px"
											placeholder={"e.g grace@nabatisnack.co.id"}
											defaultValue={superUser?.email}
											{...register("email", { required: true })}
										/>
										<Input
											disabled={true}
											width="100%"
											label="Phone Number"
											height="48px"
											placeholder={"e.g 081234567890"}
											defaultValue={superUser?.phoneNumber}
											{...register("phoneNumber", { required: true })}
										/>
									</Row>
									<Row width="100%" gap="20px" noWrap>
										<Dropdown2
											disabled={true}
											label="Timezone"
											width={"100%"}
											items={timezone}
											placeholder={"Select"}
											handleChange={(value) => setValue("timezone", value)}
											noSearch
											defaultValue={superUser?.timezone}
										/>
										<Dropdown2
											disabled={true}
											label="Language"
											items={language}
											width={"100%"}
											placeholder={"Select"}
											handleChange={(value) => setValue("language", value)}
											noSearch
											defaultValue={superUser?.language}
										/>
									</Row>
								</Col>
							</Accordion.Body>
						</Accordion.Item>
					</Accordion>

					{modalReject.open && (
						<ModalRejectSuperUser
							visible={modalReject.open}
							onCancel={() => setModalReject({ open: false })}
							onOk={(data) => reject(data)}
							userIds={[super_user_id]}
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

export default CreateSuperUser;
