import React, { useState, useMemo } from "react";
import { Text, Row, Tooltip } from "pink-lava-ui";
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
import { CSS } from "@dnd-kit/utilities";
import { useSortable, SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import styled from "styled-components";

const getTotalCharacters = (string: any) => string.length;

const DraggableGrids = ({ processList, onDrag }: any) => {
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
		const row = processList.find((item: any) => item.key === activeId);

		return row;
	}, [activeId, processList]);

	return (
		<DndContext
			sensors={sensors}
			onDragEnd={handleDragEnd}
			onDragStart={handleDragStart}
			onDragCancel={handleDragCancel}
			collisionDetection={closestCenter}
		>
			<SortableContext items={processList.map((el: any) => el.key)} strategy={rectSortingStrategy}>
				<Row gap="4px">
					{processList.map((el: any, index: any) => (
						<DraggableGrid key={index} data={el} />
					))}
				</Row>
			</SortableContext>
			<DragOverlay>{activeId && <StaticGridItem data={selectedRow} />}</DragOverlay>
		</DndContext>
	);

	function DraggableGrid(props: any) {
		const { attributes, listeners, setNodeRef, isDragging, transform, transition } = useSortable({
			id: props.data.key,
		});
		const style = {
			transform: CSS.Transform.toString(transform),
			transition: transition,
		};

		return (
			<div ref={setNodeRef} style={style} {...attributes} {...listeners}>
				{isDragging ? (
					<DraggingItem />
				) : getTotalCharacters(`${props.data.index + 1}. ${props.data.name}`) > 16 ? (
					<Tooltip title={props.data.name} color={"#F4FBFC"}>
						<Item>
							<Text
								color={"white"}
								textAlign="center"
								variant="headingRegular"
								inline
								ellipsis
								style={{ margin: "0 8px" }}
							>
								{`${props.data.index + 1}. ${props.data.name}`}
							</Text>
						</Item>
					</Tooltip>
				) : (
					<Item>
						<Text
							color={"white"}
							textAlign="center"
							variant="headingRegular"
							inline
							ellipsis
							style={{ margin: "0 8px" }}
						>
							{`${props.data.index + 1}. ${props.data.name}`}
						</Text>
					</Item>
				)}
			</div>
		);
	}
};

const StaticGridItem = ({ data }: any) => (
	<Item>
		<Text
			color={"white"}
			textAlign="center"
			variant="headingRegular"
			inline
			ellipsis
			style={{ margin: "0 8px" }}
		>
			{`${data.index + 1}. ${data.name}`}
		</Text>
	</Item>
);

const DraggingItem = styled.div`
	background: #dedede;
	border-radius: 8px;
	height: 55px;
	width: 150px;
`;

const Item = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	background: #1a727a;
	border-radius: 8px;
	height: 55px;
	width: 150px;
`;

export default DraggableGrids;
