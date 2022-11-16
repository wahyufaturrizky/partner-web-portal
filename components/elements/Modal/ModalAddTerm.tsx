import React, { useState } from "react";
import {
  Modal,
  Spacer,
  Button,
  FormSelect,
  FormSelectCustom,
  Text,
  FormInput,
  Row,
} from "pink-lava-ui";
import { useForm, useWatch, Controller } from "react-hook-form";
import moment from "moment";
import { lang } from "lang";

const ModalAddTerm = ({
  formType,
  formData,
  visible,
  onCancel,
  onSave,
  typeList,
  optionList,
  isLoading,
}: any) => {
  const { handleSubmit, control } = useForm();
  const t = localStorage.getItem("lan") || "en-US";
  const [daysList, setDaysList] = useState(
    formType === "add" ? [] : formData.option === 3 ? formData.optionValue : []
  );
  const [time, setTime] = useState(
    formType === "add" ? "07:00" : formData.option === 5 ? formData.optionValue : "07:00"
  );

  const typeWatch = useWatch({
    control,
    defaultValue: formType === "add" ? 1 : formData?.type,
    name: "type",
  });

  const optionWatch = useWatch({
    control,
    defaultValue: formType === "add" ? 1 : formData?.option,
    name: "option",
  });

  const onSubmit = (data: any) => {
    onSave(data);
  };
  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      title={lang[t].termOfPayment.modalTitleCreate.addNewTerm}
      footer={
        <div
          style={{
            display: "flex",
            marginBottom: "12px",
            justifyContent: "flex-end",
            gap: "12px",
          }}
        >
          <Button onClick={onCancel} variant="tertiary" size="big">
            {lang[t].termOfPayment.tertier.cancel}
          </Button>
          <Button onClick={handleSubmit(onSubmit)} variant="primary" size="big">
            {lang[t].termOfPayment.primary.save}
          </Button>
        </div>
      }
      content={
        <>
          <Spacer size={10} />

          <Text variant="headingRegular" color={"blue.dark"} hoverColor={"blue.dark"}>
            Payment
          </Text>

          <Spacer size={10} />

          <Text variant="headingRegular">Type</Text>

          <Controller
            control={control}
            rules={{ required: true }}
            shouldUnregister={true}
            defaultValue={formType === "add" ? 1 : formData?.type}
            name="type"
            render={({ field: { onChange }, formState: { errors } }) => (
              <>
                <FormSelect
                  size={"large"}
                  style={{ width: "100%" }}
                  defaultValue={formType === "add" ? 1 : formData?.type}
                  items={typeList}
                  onChange={(value: any) => {
                    onChange(value);
                  }}
                  isLoading={isLoading}
                />
                {/* {errors?.company_name?.type === "required" && (
                  <Text variant="alert" color={"red.regular"}>
                    This field is required
                  </Text>
                )} */}
              </>
            )}
          />

          <Spacer size={20} />

          {(typeWatch === 2 || typeWatch === 3) && (
            <>
              <Text variant="headingRegular">
                Value<span style={{ color: "#EB008B" }}>*</span>
              </Text>

              <Controller
                control={control}
                rules={{ required: true }}
                defaultValue={formType === "add" ? 0 : formData?.value}
                shouldUnregister={true}
                name="value"
                render={({ field: { onChange }, formState: { errors } }) => (
                  <>
                    <FormInput
                      size="large"
                      defaultValue={formType === "add" ? 0 : formData?.value}
                      // status={errors?.company_name?.type === "required" && "error"}
                      {...(typeWatch === 2 && { suffix: "%" })}
                      onChange={(e: any) => {
                        onChange(e.target.value);
                      }}
                    />
                    {/* {errors?.company_name?.type === "required" && (
                  <Text variant="alert" color={"red.regular"}>
                    This field is required
                  </Text>
                )} */}
                  </>
                )}
              />

              <Spacer size={20} />
            </>
          )}

          <Text variant="headingRegular" color={"blue.dark"} hoverColor={"blue.dark"}>
            Due Date Computation
          </Text>

          <Spacer size={10} />

          <Text variant="headingRegular">Options</Text>
          <Controller
            control={control}
            rules={{ required: true }}
            shouldUnregister={true}
            defaultValue={formType === "add" ? 1 : formData?.option}
            name="option"
            render={({ field: { onChange }, formState: { errors } }) => (
              <>
                <FormSelect
                  size={"large"}
                  style={{ width: "100%" }}
                  defaultValue={formType === "add" ? 1 : formData?.option}
                  items={optionList}
                  onChange={(value: any) => {
                    onChange(value);
                  }}
                  isLoading={isLoading}
                />
                {/* {errors?.company_name?.type === "required" && (
                  <Text variant="alert" color={"red.regular"}>
                    This field is required
                  </Text>
                )} */}
              </>
            )}
          />

          <Spacer size={20} />

          {(optionWatch === 1 || optionWatch === 2) && (
            <>
              <Text variant="headingRegular">Due</Text>
              <Controller
                control={control}
                rules={{ required: true }}
                shouldUnregister={true}
                defaultValue={formType === "add" ? "0" : formData?.optionValue}
                name="option_value"
                render={({ field: { onChange }, formState: { errors } }) => (
                  <>
                    <FormInput
                      size="large"
                      defaultValue={formType === "add" ? "0" : formData?.optionValue}
                      // status={errors?.company_name?.type === "required" && "error"}
                      onChange={(e: any) => {
                        onChange(e.target.value);
                      }}
                    />
                    {/* {errors?.company_name?.type === "required" && (
                  <Text variant="alert" color={"red.regular"}>
                    This field is required
                  </Text>
                )} */}
                  </>
                )}
              />

              <Spacer size={14} />
            </>
          )}

          {optionWatch === 3 && (
            <>
              <Text variant="headingRegular">On The</Text>
              <Controller
                control={control}
                rules={{ required: true }}
                shouldUnregister={true}
                defaultValue={daysList}
                name="option_value"
                render={({ field: { onChange }, formState: { errors } }) => (
                  <Row alignItems="center" gap="5px">
                    <FormSelectCustom
                      mode="multiple"
                      style={{
                        width: "67%",
                      }}
                      size={"large"}
                      showArrow
                      items={[
                        { label: "Monday", value: "Mon" },
                        { label: "Tuesday", value: "Tue" },
                        { label: "Wednesday", value: "Wed" },
                        { label: "Thursday", value: "Thu" },
                        { label: "Friday", value: "Fri" },
                        { label: "Saturday", value: "Sat" },
                        { label: "Sunday", value: "Sun" },
                      ]}
                      showSearch={false}
                      value={daysList}
                      maxTagCount={3}
                      onChange={(value: any) => {
                        setDaysList(value);
                        onChange(value);
                      }}
                    />{" "}
                    <Text variant="headingRegular" inline>
                      Of The Month
                    </Text>
                    {/* {errors?.company_name?.type === "required" && (
                  <Text variant="alert" color={"red.regular"}>
                    This field is required
                  </Text>
                )} */}
                  </Row>
                )}
              />

              <Spacer size={14} />
            </>
          )}

          {optionWatch === 4 && (
            <>
              <Text variant="headingRegular">On The</Text>
              <Controller
                control={control}
                rules={{ required: true }}
                shouldUnregister={true}
                defaultValue={formType === "add" ? 0 : formData?.optionValue}
                name="option_value"
                render={({ field: { onChange }, formState: { errors } }) => (
                  <div>
                    <FormInput
                      type="number"
                      size="large"
                      style={{ width: 60 }}
                      defaultValue={formType === "add" ? 0 : formData?.optionValue}
                      min={0}
                      max={31}
                      // status={errors?.company_name?.type === "required" && "error"}
                      onChange={(value: any) => {
                        onChange(value?.toString());
                      }}
                    />{" "}
                    <Text variant="headingRegular" inline>
                      Of The Week
                    </Text>
                    {/* {errors?.company_name?.type === "required" && (
                  <Text variant="alert" color={"red.regular"}>
                    This field is required
                  </Text>
                )} */}
                  </div>
                )}
              />

              <Spacer size={14} />
            </>
          )}

          {optionWatch === 5 && (
            <>
              <Text variant="headingRegular">Time</Text>
              <Controller
                control={control}
                rules={{ required: true }}
                shouldUnregister={true}
                defaultValue={time}
                name="option_value"
                render={({ field: { onChange }, formState: { errors } }) => (
                  <div>
                    <FormInput
                      type="timepicker"
                      size="large"
                      format="HH:mm"
                      value={moment(time, "HH:mm")}
                      // status={errors?.company_name?.type === "required" && "error"}
                      onSelect={(value: any) => {
                        setTime(moment(value).format("HH:mm"));
                        onChange(moment(value).format("HH:mm"));
                      }}
                      onChange={(value: any) => {
                        setTime(moment(value).format("HH:mm"));
                      }}
                    />
                    {/* {errors?.company_name?.type === "required" && (
                  <Text variant="alert" color={"red.regular"}>
                    This field is required
                  </Text>
                )} */}
                  </div>
                )}
              />

              <Spacer size={14} />
            </>
          )}
        </>
      }
    />
  );
};

export default ModalAddTerm;
