import React, { useState, useMemo } from "react";
import { Row, Spacer, Table, Lozenge } from "pink-lava-ui";
import { DeleteOutlined, DragOutlined, EditOutlined } from "@ant-design/icons";
import {
	closestCenter,
	DndContext,
	DragOverlay,
	KeyboardSensor,
	MouseSensor,
	TouchSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import { useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import styled from "styled-components";
import { STATUS_BUSINESS_PROCESS } from "../../../utils/constant";

const DraggableTable = ({ processList, isLoading, onDrag, onEdit, onDelete }: any) => {
	const [activeId, setActiveId] = useState(null);

	const sensors = useSensors(
		useSensor(MouseSensor, {}),
		useSensor(TouchSensor, {}),
		useSensor(KeyboardSensor, {})
	);

	function handleDragStart(event: any) {
		setActiveId(event.active.id);
	}

	function handleDragEnd(event: any) {
		const { active, over } = event;

		if (active.id !== over.id) {
			onDrag && onDrag(active.id, over.id);
		}
		setActiveId(null);
	}

	function handleDragCancel() {
		setActiveId(null);
	}

	const selectedRow = useMemo(() => {
		if (!activeId) {
			return null;
		}
		const row = processList.find((item) => item.key === activeId);

		return row;
	}, [activeId, processList]);

	const columns = [
		{
			title: "Action",
			dataIndex: "dragHandle",
			width: "150px",
		},
		{
			title: "Sequence",
			dataIndex: "index",
		},
		{
			title: "Process",
			dataIndex: "name",
		},
		{
			title: "Mandatory",
			dataIndex: "is_mandatory",
			width: "15%",
			align: "left",
		},
		{
			title: "Status",
			dataIndex: "status",
		},
	];

	return (
		<DndContext
			sensors={sensors}
			onDragEnd={handleDragEnd}
			onDragStart={handleDragStart}
			onDragCancel={handleDragCancel}
			collisionDetection={closestCenter}
			modifiers={[restrictToVerticalAxis]}
		>
			<Table
				columns={columns}
				data={processList}
				loading={isLoading}
				components={{
					body: {
						wrapper: DraggableWrapper,
					},
				}}
			/>
			<DragOverlay>
				{activeId && (
					<table style={{ width: "100%" }}>
						<tbody>
							<StaticTableRow row={selectedRow} />
						</tbody>
					</table>
				)}
			</DragOverlay>
		</DndContext>
	);

	function DraggableWrapper(props) {
		const { children, ...restProps } = props;

		return children[1] instanceof Array ? (
			<tbody {...restProps}>
				<SortableContext
					items={children[1].map((child) => child.key)}
					strategy={verticalListSortingStrategy}
					{...restProps}
				>
					{children[1].map((el, index) => {
						return <DraggableRow key={index} data={el.props.record} />;
					})}
				</SortableContext>
			</tbody>
		) : (
			<tbody {...restProps}>{children}</tbody>
		);
	}

	function DraggableRow(props) {
		const { attributes, listeners, setNodeRef, isDragging, transform, transition } = useSortable({
			id: props.data.key,
		});
		const { ...restProps } = props;

		const style = {
			transform: CSS.Transform.toString(transform),
			transition: transition,
		};

		return (
			<tr ref={setNodeRef} style={style} {...attributes} {...restProps}>
				{isDragging ? (
					<DraggingRow colSpan={5}>&nbsp;</DraggingRow>
				) : (
					<>
						<td {...restProps}>
							<div style={{ display: "flex" }}>
								<DragOutlined
									{...listeners}
									style={{
										cursor: "pointer",
										borderRadius: 3,
										backgroundColor: "#D5FAFD",
										color: "#2BBECB",
										padding: 4,
										fontSize: "18px",
									}}
								/>
								<Spacer size={5} />
								<EditOutlined
									style={{
										cursor: "pointer",
										borderRadius: 3,
										backgroundColor: "#D5FAFD",
										color: "#2BBECB",
										padding: 4,
										fontSize: "18px",
									}}
									onClick={() => {
										onEdit && onEdit(props.data);
									}}
								/>
								<Spacer size={5} />
								<DeleteOutlined
									style={{
										cursor: "pointer",
										borderRadius: 3,
										backgroundColor: "#D5FAFD",
										color: "#EB008B",
										padding: 4,
										fontSize: "18px",
									}}
									onClick={() => {
										onDelete && onDelete(props.data);
									}}
								/>
							</div>
						</td>
						<td>{props.data.index + 1}</td>
						<td>{props.data.name}</td>
						<td>{props.data.is_mandatory}</td>
						<td>
							<Lozenge variant={STATUS_BUSINESS_PROCESS[props.data.status]?.COLOR}>
								{STATUS_BUSINESS_PROCESS[props.data.status]?.TEXT}
							</Lozenge>
						</td>
					</>
				)}
			</tr>
		);
	}
};

const StaticTableRow = ({ row }) => {
	return (
		<StyledStaticTableRow>
			<StyledStaticData style={{ width: "150px", padding: "16px" }}>
				<Row>
					<DragOutlined
						style={{
							cursor: "pointer",
							borderRadius: 3,
							backgroundColor: "#D5FAFD",
							color: "#2BBECB",
							padding: 4,
							fontSize: "18px",
						}}
					/>
					<Spacer size={5} />
					<EditOutlined
						style={{
							cursor: "pointer",
							borderRadius: 3,
							backgroundColor: "#D5FAFD",
							color: "#2BBECB",
							padding: 4,
							fontSize: "18px",
						}}
					/>
					<Spacer size={5} />
					<DeleteOutlined
						style={{
							cursor: "pointer",
							borderRadius: 3,
							backgroundColor: "#D5FAFD",
							color: "#EB008B",
							padding: 4,
							fontSize: "18px",
						}}
					/>
				</Row>
			</StyledStaticData>
			<StyledStaticData style={{ padding: "16px" }}>{row.index + 1}</StyledStaticData>
			<StyledStaticData style={{ padding: "16px" }}>{row.name}</StyledStaticData>
			<StyledStaticData style={{ padding: "16px" }}>{row.is_mandatory}</StyledStaticData>
			<StyledStaticData style={{ padding: "16px" }}>
				<Lozenge variant={STATUS_BUSINESS_PROCESS[row.status]?.COLOR}>
					{STATUS_BUSINESS_PROCESS[row.status]?.TEXT}
				</Lozenge>
			</StyledStaticData>
		</StyledStaticTableRow>
	);
};

const StyledStaticData = styled.td`
	background: white;
`;

const StyledStaticTableRow = styled.tr`
	box-shadow: rgb(0 0 0 / 10%) 0px 20px 25px -5px, rgb(0 0 0 / 30%) 0px 10px 10px -5px;
	outline: #3e1eb3 solid 1px;
`;

const DraggingRow = styled.td`
	background: #2bbecb;
`;

export default DraggableTable;
