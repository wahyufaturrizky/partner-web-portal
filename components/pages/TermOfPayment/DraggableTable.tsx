import React, { useState, useMemo } from "react";
import { Row, Spacer, Table } from "pink-lava-ui";
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
import { usePartnerConfigPermissionLists } from "hooks/user-config/usePermission";
import { permissionTermOfPayment } from "permission/term-of-payment";
import { useUserPermissions } from "hooks/user-config/useUser";

const getTypeName = (type: any) => {
  switch (type) {
    case 1:
      return "Balance";
    case 2:
      return "Percent";
    case 3:
      return "Fix Amount";

    default:
      return "";
  }
};

const getOptionName = (type: any) => {
  switch (type) {
    case 1:
      return "Days after the end of the invoice month";
    case 2:
      return "Days after invoice date";
    case 3:
      return "of the following week";
    case 4:
      return "of the following month";
    case 5:
      return "of the day";

    default:
      return "";
  }
};

const DraggableTable = ({ termList, isLoading, onDrag, onEdit, onDelete }: any) => {
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
    const row = termList.find((item: any) => item.key === activeId);

    return row;
  }, [activeId, termList]);

  const columns = [
    {
      title: "Action",
      dataIndex: "dragHandle",
      width: "150px",
    },
    {
      title: "Stage",
      dataIndex: "index",
    },
    {
      title: "Payment Type",
      dataIndex: "type",
    },
    {
      title: "Value",
      dataIndex: "value",
      width: "15%",
      align: "left",
    },
    {
      title: "Due",
      dataIndex: "optionValue",
    },
    {
      title: "Options",
      dataIndex: "option",
    },
  ];

  const { data: dataUserPermission } = useUserPermissions({
    options: {
      onSuccess: () => {},
    },
  });

  const listPermission = dataUserPermission?.permission?.filter(
    (filtering: any) => filtering.menu === "Term Of Payment"
  );

  const checkUserPermission = (permissionGranted) => {
    return listPermission?.find(
      (data: any) => data?.viewTypes?.[0]?.viewType?.name === permissionGranted
    );
  };

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
        data={termList}
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

  function DraggableWrapper(props: any) {
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

  function DraggableRow(props: any) {
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
          <DraggingRow colSpan={6}>&nbsp;</DraggingRow>
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
                {checkUserPermission("Update") && (
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
                )}
                <Spacer size={5} />
                {checkUserPermission("Delete") && (
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
                )}
              </div>
            </td>
            <td>{props.data.index + 1}</td>
            <td>{getTypeName(props.data.type)}</td>
            <td>
              {getTypeName(props.data.type) === "Percent"
                ? `${props.data.value}%`
                : props.data.value}
            </td>
            <td>{props.data.optionValue}</td>
            <td>{getOptionName(props.data.option)}</td>
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
      <StyledStaticData style={{ padding: "16px" }}>{getTypeName(row.type)}</StyledStaticData>
      <StyledStaticData style={{ padding: "16px" }}>
        {getTypeName(row.type) === "Percent" ? `${row.value}%` : row.value}
      </StyledStaticData>
      <StyledStaticData style={{ padding: "16px" }}>{row.optionValue}</StyledStaticData>
      <StyledStaticData style={{ padding: "16px" }}>{getOptionName(row.option)}</StyledStaticData>
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
