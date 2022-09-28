import React, { useEffect, useState, useRef } from "react";
import { Table, Checkbox, Text, Spacer } from "pink-lava-ui";

const WorkingDaysTable = ({ onChangeValue, workingCalendarData }: any) => {
  const initialRender = useRef(true);

  const [workingDaysStatus, setWorkingDaysStatus] = useState([
    {
      monday: workingCalendarData?.workingDays[0] ?? false,
      tuesday: workingCalendarData?.workingDays[1] ?? false,
      wednesday: workingCalendarData?.workingDays[2] ?? false,
      thursday: workingCalendarData?.workingDays[3] ?? false,
      friday: workingCalendarData?.workingDays[4] ?? false,
      saturday: workingCalendarData?.workingDays[5] ?? false,
      sunday: workingCalendarData?.workingDays[6] ?? false,
    },
  ]);

  const handleChangeWorkingStatus = (day: any, status: any) => {
    setWorkingDaysStatus((prevState) => {
      return prevState.map((dayStatus) => ({
        ...dayStatus,
        [day]: status,
      }));
    });
  };

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    onChangeValue(workingDaysStatus);
  }, [workingDaysStatus]);
  return (
    <>
      <Text variant={"headingMedium"}>Select Working Days</Text>

      <Spacer size={20} />

      <Table
        bordered
        columns={[
          { title: "Monday", dataIndex: "monday", align: "center" },
          { title: "Tuesday", dataIndex: "tuesday", align: "center" },
          { title: "Wednesday", dataIndex: "wednesday", align: "center" },
          { title: "Thursday", dataIndex: "thursday", align: "center" },
          { title: "Friday", dataIndex: "friday", align: "center" },
          { title: "Saturday", dataIndex: "saturday", align: "center" },
          { title: "Sunday", dataIndex: "sunday", align: "center" },
        ]}
        data={workingDaysStatus.map((statusDay, index) => ({
          key: index,
          monday: (
            <Checkbox
              checked={statusDay.monday}
              onChange={(checked: any) => {
                handleChangeWorkingStatus("monday", checked);
              }}
            />
          ),
          tuesday: (
            <Checkbox
              checked={statusDay.tuesday}
              onChange={(checked: any) => {
                handleChangeWorkingStatus("tuesday", checked);
              }}
            />
          ),
          wednesday: (
            <Checkbox
              checked={statusDay.wednesday}
              onChange={(checked: any) => {
                handleChangeWorkingStatus("wednesday", checked);
              }}
            />
          ),
          thursday: (
            <Checkbox
              checked={statusDay.thursday}
              onChange={(checked: any) => {
                handleChangeWorkingStatus("thursday", checked);
              }}
            />
          ),
          friday: (
            <Checkbox
              checked={statusDay.friday}
              onChange={(checked: any) => {
                handleChangeWorkingStatus("friday", checked);
              }}
            />
          ),
          saturday: (
            <Checkbox
              checked={statusDay.saturday}
              onChange={(checked: any) => {
                handleChangeWorkingStatus("saturday", checked);
              }}
            />
          ),
          sunday: (
            <Checkbox
              checked={statusDay.sunday}
              onChange={(checked: any) => {
                handleChangeWorkingStatus("sunday", checked);
              }}
            />
          ),
        }))}
      />
    </>
  );
};

export default WorkingDaysTable;
