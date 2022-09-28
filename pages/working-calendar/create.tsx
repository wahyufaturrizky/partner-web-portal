import React, { useState } from "react";
import { Text, Col, Row, Spacer, Button, Input, Table, DatePickerInput } from "pink-lava-ui";
import styled from "styled-components";
import { Controller, useForm, useFieldArray, useWatch } from "react-hook-form";
import { useRouter } from "next/router";
import { queryClient } from "../_app";
import ICCompany from "../../assets/icons/ic-company.svg";
import ICWorld from "../../assets/icons/ic-world.svg";
import Icon, { DeleteOutlined } from "@ant-design/icons";
import { useCreateWorkingCalendar } from "hooks/mdm/working-calendar/useWorkingCalendar";
import WorkingDaysTable from "components/pages/WorkingCalendar/WorkingDaysTable";
import ConditionalFieldCompany from "components/pages/WorkingCalendar/ConditionalFieldCompany";
import ConditionalFieldCountry from "components/pages/WorkingCalendar/ConditionalFieldCountry";
import StartEndWorkingField from "components/pages/WorkingCalendar/StartEndWorkingField";
import CardSelection from "components/pages/WorkingCalendar/CardSelection";
import ModalCalendar from "components/elements/Modal/ModalCalendar";

const WorldSvg = () => <ICWorld />;

const WorldIcon = (props: any) => <Icon component={WorldSvg} {...props} />;

const CompanySvg = () => <ICCompany />;

const CompanyIcon = (props: any) => <Icon component={CompanySvg} {...props} />;

const WorkingCalendarCreate = () => {
  const router = useRouter();

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
      public_holidays: [{ holiday_date: "", holiday_name: "" }],
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

  const { mutate: createWorkingCalendar, isLoading: isLoadingCreateWorkingCalendar } =
    useCreateWorkingCalendar({
      options: {
        onSuccess: () => {
          router.back();
          queryClient.invalidateQueries(["working-calendars"]);
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

    createWorkingCalendar(formData);
  };

  return (
    <>
      <Col>
        <Row gap="4px">
          <Text variant={"h4"}>Create Working Calendar</Text>
        </Row>

        <Spacer size={20} />

        <Card>
          <Row justifyContent="flex-end" alignItems="center" nowrap>
            <Row gap="16px">
              <Button size="big" variant={"tertiary"} onClick={() => router.back()}>
                Cancel
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
                {isLoadingCreateWorkingCalendar ? "Loading..." : "Save"}
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
                <ConditionalFieldCountry type="create" control={control} />
              )}

              {statusCard === "company" && (
                <ConditionalFieldCompany
                  type="create"
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
    </>
  );
};

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: ${(p: any) => (p.padding ? p.padding : "16px")};
`;

const Separator = styled.div`
  display: block;
  height: 0;
  border-bottom: 1px dashed #dddddd;
`;

export default WorkingCalendarCreate;
