import React from "react";
import { Calendar, Modal, Badge } from "pink-lava-ui";
import styled from "styled-components";

const getListData = (value) => {
  let listData;

  switch (value.date()) {
    case 8:
      listData = [
        {
          type: "error",
          content: "Day Off",
        },
      ];
      break;

    case 10:
      listData = [
        {
          type: "warning",
          content: "This is warning event.",
        },
        {
          type: "success",
          content: "This is usual event.",
        },
        {
          type: "error",
          content: "This is error event.",
        },
      ];
      break;

    case 15:
      listData = [
        {
          type: "warning",
          content: "This is warning event",
        },
        {
          type: "success",
          content: "This is very long usual event。。....",
        },
        {
          type: "error",
          content: "This is error event 1.",
        },
        {
          type: "error",
          content: "This is error event 2.",
        },
        {
          type: "error",
          content: "This is error event 3.",
        },
        {
          type: "error",
          content: "This is error event 4.",
        },
      ];
      break;

    default:
  }

  return listData || [];
};

const ModalCalendar = ({ show, onCancel }: any) => {
  const dateCellRender = (value: any) => {
    const listData = getListData(value);
    return (
      <StyledUl>
        {listData.map((item) => (
          <Badge status={item.type} text={item.content} />
        ))}
      </StyledUl>
    );
  };

  return (
    <Modal
      style={{ top: 20 }}
      width={"850px"}
      closable={true}
      visible={show}
      onCancel={onCancel}
      footer={null}
      content={<Calendar width={"810px"} dateCellRender={dateCellRender} />}
    />
  );
};

const StyledUl = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

export default ModalCalendar;
