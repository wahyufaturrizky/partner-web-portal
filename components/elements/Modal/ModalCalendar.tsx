import React from "react";
import { Calendar, Modal, Badge } from "pink-lava-ui";
import styled from "styled-components";
import moment from "moment";

const daysName: any = {
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
  0: "Sunday",
};

const getListData = (
  value: any,
  startDate: any,
  endDate: any,
  workingDays: any,
  publicHoliday: any
) => {
  let listData: any = [];

  const format = "DD-MM-YYYY";

  const cellValue = moment(value, format);

  const start = moment(startDate, format);
  const end = moment(endDate, format);

  const inRange = cellValue.isBetween(start, end);

  const getWorkingDays = workingDays?.map((dayValue: any, index: any) => {
    return {
      [daysName[index]]: dayValue,
    };
  });

  const filterPublicHoliday = publicHoliday?.filter((day: any) => {
    return day.holiday_date === cellValue.format("DD/MM/YYYY");
  });

  if (!getWorkingDays[cellValue.day()][daysName[cellValue.day()]] && inRange) {
    listData?.push({ type: "error", content: "Day off" });
  }

  if (filterPublicHoliday?.length > 0 && inRange) {
    listData?.push({ type: "error", content: filterPublicHoliday[0].holiday_name });
  }

  return listData;
};

const ModalCalendar = ({ show, onCancel, startDate, endDate, workingDays, publicHoliday }: any) => {
  const dateCellRender = (dateCellValue: any) => {
    const listData = getListData(dateCellValue, startDate, endDate, workingDays, publicHoliday);
    return (
      <StyledUl>
        {listData.map((item: any) => (
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
