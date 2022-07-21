import React, { useState } from "react";
import { useRouter } from "next/router";
import Router from "next/router";

import {
	Text,
	Col,
	Row,
	Spacer,
	Modal,
	Table,
	Dropdown,
	AccordionCheckbox,
	Button,
	Accordion,
	Input,
	Search,
} from "pink-lava-ui";

import styles from "./styles.module.css";

export default function PreviewMenu(props: any) {
	const router = useRouter();
	const {
		title,
		visible,
		status,
		onhandleSearch,
		setForms,
		actionBtnRight,
		actionBtnRightModal,
		disabledBtnRight,
		setVisible,
		menuList,
		_onhandleCheckBox,
		tableRowSelected,
		tableList,
		forms,
		isLoading,
		defaultChecked,
		defaultStatus,
	} = props;

	return (
		<>
			<Col className={styles.container}>
				<Row gap="4px">
					<Text variant="h4">{title}</Text>
				</Row>
				<Spacer size={12} />
				<div className={styles["container-navbar"]}>
					<Dropdown
						isHtml
						width="185px"
						items={status}
						placeholder="Status"
						handleChange={(value: string) => setForms(value, "status")}
						noSearch
						defaultValue={defaultStatus}
					/>
					<Row gap="16px">
						<Button
							size="big"
							variant="tertiary"
							onClick={() => router.push("/template-config/menu")}
						>
							Cancel
						</Button>
						<Button
							size="big"
							variant="primary"
							disabled={disabledBtnRight}
							onClick={actionBtnRight}
						>
							Save
						</Button>
					</Row>
				</div>

				<Spacer size={20} />
				<Accordion>
					<Accordion.Item key={1}>
						<Accordion.Header variant="blue">General</Accordion.Header>
						<Accordion.Body>
							<Row width="50%" gap="20px" noWrap>
								<Input
									label="Name"
									height="48px"
									value={forms?.name}
									onChange={({ target }: any) => setForms(target.value, "name")}
									placeholder="e.g Module Indonesia - FMCG Maufacture"
								/>
							</Row>
						</Accordion.Body>
					</Accordion.Item>
				</Accordion>
				<Spacer size={20} />
				<Accordion>
					<Accordion.Item key={1}>
						<Accordion.Header variant="blue">Menu</Accordion.Header>
						<Accordion.Body>
							<div className={styles["container-menu"]}>
								<Search
									width="380px"
									nameIcon="SearchOutlined"
									placeholder="Search Name"
									onChange={onhandleSearch}
								/>

								<div>
									<span onClick={() => setVisible(true)} className={styles["button-copy"]}>
										Copy from another menu
									</span>
								</div>
							</div>
							<Spacer size={20} />
							{!isLoading &&
								menuList?.map(
									(
										{
											moduleName,
											menu,
										}: { moduleName: string; menu: { id: number; name: string }[] },
										index: number
									) => (
										<>
											<Spacer size={20} />
											<AccordionCheckbox
												key={index}
												lists={menu?.map(({ id, name }: { id: number; name: string }) => ({
													id: id,
													value: name,
												}))}
												checked={defaultChecked || defaultChecked}
												name={moduleName}
												onChange={(id: number) => _onhandleCheckBox(id)}
											/>
										</>
									)
								)}
						</Accordion.Body>
					</Accordion.Item>
				</Accordion>
			</Col>

			<Modal
				visible={visible}
				width={880}
				onCancel={() => setVisible(false)}
				title="Copy Module Template"
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
						<Button onClick={() => setVisible(false)} variant="tertiary" size="big">
							Cancel
						</Button>
						<Button onClick={actionBtnRightModal} variant="primary" size="big">
							Add
						</Button>
					</div>
				}
				content={
					<>
						<Spacer size={10} />
						<Table
							loading={isLoading}
							columns={[
								{
									title: "Name",
									dataIndex: "name",
								},
							]}
							data={tableList || []}
							rowSelection={tableRowSelected}
						/>
						<Spacer size={14} />
					</>
				}
			/>
		</>
	);
}
