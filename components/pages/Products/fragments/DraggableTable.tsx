import React, { useState, useMemo } from "react";
import { Row, Spacer, Table, FormSelect, Dropdown2, Button } from "pink-lava-ui";
import { DeleteOutlined, DragOutlined } from "@ant-design/icons";
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
import { useUOMInfiniteLists } from "hooks/mdm/unit-of-measure/useUOM";
import useDebounce from "lib/useDebounce";
import { useUOMConversionLevelInfiniteLists } from "hooks/mdm/unit-of-measure-conversion/useUOMConversion";
import {ModalAddLevel} from "../../../elements/Modal/ModalAddLevel"
import { useForm, useWatch, Controller } from "react-hook-form";

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

const DraggableTable = ({ control, conversionList, uom, isLoading, onDrag, onDelete, onSelectUom }: any) => {

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
    const row = conversionList.find((item: any) => item.key  || item.id === activeId);

    return row;
  }, [activeId, conversionList]);

  const columns = [
    {
      title: "",
      dataIndex: "dragHandle",
      width: "150px",
    },
    {
      title: "Level",
      dataIndex: "index",
    },
    {
      title: "Level Name",
      dataIndex: "type",
      width: "25%",
    },
    {
      title: "Qty",
      dataIndex: "qty",
      width: "5%",
    },
    {
      title: "Uom",
      dataIndex: "uom_id",
      width: "25%",
    },
    {
      title: "Conversion Number",
      dataIndex: "conversion_number",
    },
    {
      title: "Base UoM",
      dataIndex: "base_uom",
    },
  ];

  const [showModalLevel, setShowModalLevel] = useState(false)
  const [totalRowsLevel, setTotalRowsLevel] = useState(0);
  const [searchLevel, setSearchLevel] = useState("");
  const debounceFetchLevel = useDebounce(searchLevel, 1000);
  const [listLevel, setListLevel] = useState<any[]>([]);

  const {
    isFetching: isFetchingLevel,
    isFetchingNextPage: isFetchingMoreLevel,
    hasNextPage: hasNextLevel,
    fetchNextPage: fetchNextPageLevel,
  } = useUOMConversionLevelInfiniteLists({
    query: {
      search: debounceFetchLevel,
      limit: 10,
      company_id: 'KSNI'
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRowsLevel(data.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => {
          return group.rows?.map((element: any) => {
            return {
              label: element.name,
              value: element.id,
            };
          });
        });
        const flattenArray = [].concat(...mappedData);
        setListLevel(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (listLevel.length < totalRowsLevel) {
          return pages.length + 1;
        } else {
          return undefined;
        }
      },
    },
  });

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
        data={conversionList}
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
      <ModalAddLevel visible={showModalLevel} onCancel={() => {
        setShowModalLevel(false)
      }} />
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

    const addNewButton = (
      <Row justifyContent="center">
        <Button
          size="small"
          variant={"ghost"}
          onClick={() => setShowModalLevel(true)}
        >
          + Add New Manage Level
        </Button>
      </Row>
    )

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
            <td>
              <Controller
                control={control}
                name={`uom.${props.data.index}.levelId`}
                render={({ field: { onChange } }) => (
                  <CustomFormSelect
                    defaultValue={props.data.levelId}
                    style={{ width: "100%", height: '48px' }}
                    size={"large"}
                    placeholder={"Select"}
                    borderColor={"#AAAAAA"}
                    arrowColor={"#000"}
                    withSearch
                    isLoading={isFetchingLevel}
                    isLoadingMore={isFetchingMoreLevel}
                    fetchMore={() => {
                      if (hasNextLevel) {
                        fetchNextPageLevel();
                      }
                    }}
                    items={
                      isFetchingLevel || isFetchingMoreLevel
                        ? []
                        : listLevel
                    }
                    onChange={(value: any) => {
                      onChange(value);
                    }}
                    onSearch={(value: any) => {
                      setSearchLevel(value);
                    }}
                    addNewButton={addNewButton}
                  />
                )}
              />
            </td>
            <td>{props.data.qty}</td>
            <td>
              <Controller
                control={control}
                name={`uom.${props.data.index}.uomConversionItemId`}
                render={({ field: { onChange }}) => (
                  <Dropdown2
                    label=""
                    defaultValue={props.data.baseUom}
                    width="100%"
                    noSearch
                    items={uom?.map((uom:any) => ({
                      value: `${uom.value} (${uom.conversionNumber} PCS)`,
                      id: uom.id
                    }))}
                    handleChange={(value: string) => {
                      onSelectUom(props.data, value, props.data.index)
                      onChange(value)
                    }}
                  />
                )} 
              />
            </td>
            <td>{props.data.conversionNumber}</td>
            <td>{props.data.baseUom}</td>
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
      <StyledStaticData style={{ padding: "16px" }}>{row.value}</StyledStaticData>
      <StyledStaticData style={{ padding: "16px" }}>{row.optionValue}</StyledStaticData>
      <StyledStaticData style={{ padding: "16px" }}>{getOptionName(row.option)}</StyledStaticData>
    </StyledStaticTableRow>
  );
};

const CustomFormSelect = styled(FormSelect)`
  
  .ant-select-selection-placeholder {
    line-height: 42px !important;
  }

  .ant-select-selection-search-input {
    height: 42px !important;
  }

  .ant-select-selector {
    height: 42px !important;
  }

  .ant-select-selection-item {
    display: flex;
    align-items: center;
  }
`

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
