import React, { useState } from "react";
import { Text, Col, Row, Spacer, Button, Input, Table, DatePickerInput, Spin } from "pink-lava-ui";
import styled from "styled-components";
import { Controller, useForm, useFieldArray, useWatch } from "react-hook-form";
import { useRouter } from "next/router";
import { queryClient } from "../_app";
import ICCompany from "../../assets/icons/ic-company.svg";
import ICWorld from "../../assets/icons/ic-world.svg";
import Icon, { DeleteOutlined } from "@ant-design/icons";
import {
  useDeleteWorkingCalendar,
  useUpdateWorkingCalendar,
  useWorkingCalendar,
} from "hooks/mdm/working-calendar/useWorkingCalendar";
import WorkingDaysTable from "components/pages/WorkingCalendar/WorkingDaysTable";
import ConditionalFieldCompany from "components/pages/WorkingCalendar/ConditionalFieldCompany";
import ConditionalFieldCountry from "components/pages/WorkingCalendar/ConditionalFieldCountry";
import StartEndWorkingField from "components/pages/WorkingCalendar/StartEndWorkingField";
import CardSelection from "components/pages/WorkingCalendar/CardSelection";
import ModalCalendar from "components/elements/Modal/ModalCalendar";
import ArrowLeft from "../../assets/icons/arrow-left.svg";
import { ModalDeleteConfirmation } from "components/elements/Modal/ModalConfirmationDelete";
import moment from "moment";

const WorldSvg = () => <ICWorld />;

const WorldIcon = (props: any) => <Icon component={WorldSvg} {...props} />;

const CompanySvg = () => <ICCompany />;

const CompanyIcon = (props: any) => <Icon component={CompanySvg} {...props} />;

const publicHolidaysDefaultValue = [{ holiday_date: "", holiday_name: "" }];

const WorkingCalendarCreate = () => {
  const router = useRouter();

  const { working_calendar_id } = router.query;

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [statusCard, setStatusCard] = useState("country");
  const [workingDaysPayload, setWorkingDaysPayload] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [companyPayloads, setCompanyPayload] = useState({});
  const [show, setShow] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { register, control, handleSubmit, setValue } = useForm({
    defaultValues: {
      public_holidays: publicHolidaysDefaultValue,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "public_holidays",
  });

  const publicHolidayWatch = useWatch({
    control,
    name: "public_holidays",
  });

  const {
    data: workingCalendarData,
    isLoading: isLoadingWorkingCalendar,
    isFetching: isFetchingWorkingCalendar,
  } = useWorkingCalendar({
    id: working_calendar_id,
    options: {
      onSuccess: (data: any) => {
        if (!data.country) {
          setStatusCard("company");
        }
        setValue(
          "public_holidays",
          data?.publicHolidays?.length > 0 ? data?.publicHolidays : publicHolidaysDefaultValue
        );
        setWorkingDaysPayload(data?.workingDays);
      },
    },
  });

  const { mutate: updateWorkingCalendar, isLoading: isLoadingUpdateWorkingCalendar } =
    useUpdateWorkingCalendar({
      id: working_calendar_id,
      options: {
        onSuccess: () => {
          router.back();
          queryClient.invalidateQueries(["working-calendars"]);
        },
      },
    });

  const { mutate: deleteWorkingCalendar, isLoading: isLoadingDeleteWorkingCalendar } =
    useDeleteWorkingCalendar({
      options: {
        onSuccess: () => {
          queryClient.invalidateQueries(["working-calendars"]);
          setShowDeleteModal(false);
          router.back();
        },
      },
    });

  const onSubmit = (data: any) => {
    const companyPayload = statusCard === "company" ? companyPayloads : null;
    const countryPayload = statusCard === "country" ? data.country : null;

    const formData = {
      ...data,
      company: companyPayload,
      country: countryPayload,
      working_days: workingDaysPayload,
    };

    console.log(formData);
    // updateWorkingCalendar(formData);
  };

  if (isLoadingWorkingCalendar || isFetchingWorkingCalendar)
    return (
      <Center>
        <Spin tip="Loading data..." />
      </Center>
    );

  return (
    <>
      <Col>
        <Row gap="4px" alignItems="center">
          <ArrowLeft style={{ cursor: "pointer" }} onClick={() => router.back()} />
          <Text variant={"h4"}>{workingCalendarData?.calendarName}</Text>
        </Row>

        <Spacer size={20} />

        <Card>
          <Row justifyContent="flex-end" alignItems="center" nowrap>
            <Row gap="16px">
              <Button size="big" variant={"tertiary"} onClick={() => setShowDeleteModal(true)}>
                Delete
              </Button>
              <Button
                size="big"
                variant={"secondary"}
                onClick={() => {
                  setShow(true);
                }}
              >
                Preview Calendar
              </Button>
              <Button size="big" variant={"primary"} onClick={handleSubmit(onSubmit)}>
                {isLoadingUpdateWorkingCalendar ? "Loading..." : "Save"}
              </Button>
            </Row>
          </Row>
        </Card>

        <Spacer size={20} />

        <Card>
          <Row width="100%" noWrap>
            <Col width={"100%"}>
              <Text variant="headingRegular">
                Calendar Name<span style={{ color: "#EB008B" }}>*</span>
              </Text>
              <Row width={"50%"}>
                <Input
                  width="50%"
                  height="40px"
                  label=""
                  defaultValue={workingCalendarData.calendarName}
                  placeholder={"e.g NBT-ID"}
                  {...register("calendar_name")}
                />
              </Row>

              <Spacer size={20} />

              <Separator />

              <Spacer size={20} />

              <Text variant={"headingMedium"}>How do you want this type of calendar ?</Text>

              <Spacer size={10} />

              <Row gap="8px">
                <CardSelection
                  onSelect={(type: any) => {
                    setStatusCard(type);
                    setValue("country", "");
                  }}
                  type={"country"}
                  selectedType={statusCard}
                  Icon={WorldIcon}
                  title={"Use for country only"}
                />

                <CardSelection
                  onSelect={(type: any) => {
                    setStatusCard(type);
                  }}
                  type={"company"}
                  selectedType={statusCard}
                  Icon={CompanyIcon}
                  title={"Set custom for company"}
                />
              </Row>

              <Spacer size={20} />

              {statusCard === "country" && (
                <ConditionalFieldCountry
                  control={control}
                  workingCalendarData={workingCalendarData}
                />
              )}

              {statusCard === "company" && (
                <ConditionalFieldCompany
                  control={control}
                  onChangePayload={(companyPayload: any) => {
                    setCompanyPayload(companyPayload);
                  }}
                />
              )}

              <Spacer size={20} />

              <Separator />

              <Spacer size={20} />

              <WorkingDaysTable
                control={control}
                workingCalendarData={workingCalendarData}
                onChangeValue={(value: any) =>
                  setWorkingDaysPayload(() => {
                    const workingDaysObject = value[0];
                    const workingDaysList = [];

                    // Loop object working days
                    for (const property in workingDaysObject) {
                      workingDaysList.push(workingDaysObject[property]);
                    }

                    return workingDaysList;
                  })
                }
              />

              <Spacer size={20} />

              <StartEndWorkingField
                workingCalendarData={workingCalendarData}
                control={control}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
              />

              <Spacer size={20} />

              <Text variant={"headingMedium"}>Public Holidays</Text>

              <Spacer size={10} />

              <Row>
                <Button
                  variant="primary"
                  size="big"
                  onClick={() => {
                    append({ holiday_date: "", holiday_name: "" });
                  }}
                >
                  + Add New
                </Button>
              </Row>

              <Spacer size={10} />

              <Table
                columns={[
                  { title: "", dataIndex: "action", width: "80px" },
                  { title: "Date", dataIndex: "date" },
                  { title: "Public Holiday Name", dataIndex: "holidayName" },
                ]}
                data={fields?.map((el, index) => ({
                  key: index,
                  action: (
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
                        remove(index);
                      }}
                    />
                  ),
                  date: (
                    <Controller
                      control={control}
                      name={`public_holidays.${index}.holiday_date`}
                      render={({ field: { onChange } }) => (
                        <DatePickerInput
                          label=""
                          fullWidth
                          defaultValue={moment(el.holiday_date, "DD/MM/YYYY")}
                          onChange={(date: any, dateString: any) => {
                            onChange(dateString);
                          }}
                          format={"DD/MM/YYYY"}
                        />
                      )}
                    />
                  ),
                  holidayName: (
                    <Input
                      width="50%"
                      height="40px"
                      label=""
                      placeholder={"e.g Happy New Year"}
                      {...register(`public_holidays.${index}.holiday_name`)}
                    />
                  ),
                }))}
              />
            </Col>
          </Row>
        </Card>
      </Col>

      {show && (
        <ModalCalendar
          show={show}
          onCancel={() => {
            setShow(false);
          }}
          startDate={startDate}
          endDate={endDate}
          workingDays={workingDaysPayload}
          publicHoliday={publicHolidayWatch}
        />
      )}

      {showDeleteModal && (
        <ModalDeleteConfirmation
          totalSelected={1}
          itemTitle={workingCalendarData.calendarName}
          visible={showDeleteModal}
          isLoading={isLoadingDeleteWorkingCalendar}
          onCancel={() => setShowDeleteModal(false)}
          onOk={() => deleteWorkingCalendar({ ids: [working_calendar_id] })}
        />
      )}
    </>
  );
};

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: ${(p: any) => (p.padding ? p.padding : "16px")};
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Separator = styled.div`
  display: block;
  height: 0;
  border-bottom: 1px dashed #dddddd;
`;

export default WorkingCalendarCreate;
