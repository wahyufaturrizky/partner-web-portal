import React from "react";
import { Row, Col, Spacer, Text, FormInput, FormSelect } from "pink-lava-ui";
import { useFormContext, Controller } from "react-hook-form";

const BusinessType = () => {
  const { control, getValues, clearErrors } = useFormContext();
  const formValues = getValues();

  return (
    <Col alignItems={"Center"}>
      <Text variant={"h4"}>Business Type</Text>
      <div
        style={{
          width: "70%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Text variant={"caption"} textAlign={"center"} color={"grey.light"}>
          Fill in the data according to where you work, after that we will verify the data.
        </Text>
      </div>
      <Spacer size={10} />

      <div style={{ width: "400px" }}>
        <Text variant="label">{"Company Name"}</Text>
        <Controller
          control={control}
          rules={{ required: true }}
          name="company_name"
          render={({ field: { onChange }, formState: { errors } }) => (
            <>
              <FormInput
                size="large"
                defaultValue={formValues?.company_name}
                status={errors?.company_name?.type === "required" && "error"}
                placeholder="e.g PT. Kaldu Sari Nabati Indonesia"
                onChange={(e: any) => {
                  if (errors?.company_name) {
                    clearErrors("company_name");
                  }
                  onChange(e.target.value);
                }}
              />
              {errors?.company_name?.type === "required" && (
                <Text variant="alert" color={"red.regular"}>
                  This field is required
                </Text>
              )}
            </>
          )}
        />

        <Spacer size={20} />

        <Row noWrap gap={"8px"} width={"100%"}>
          <Col width={"100%"}>
            <Text variant="label">Company Type</Text>
            <Controller
              control={control}
              name="company_type"
              defaultValue="company"
              render={({ field: { onChange } }) => (
                <FormSelect
                  size={"large"}
                  defaultValue={formValues?.company_type ?? "company"}
                  items={[
                    { value: "company", label: "Company" },
                    { value: "corporate", label: "Corporate" },
                    { value: "holding", label: "Holding" },
                  ]}
                  onChange={(value: any) => {
                    onChange(value);
                  }}
                />
              )}
            />
          </Col>

          <Col width={"100%"}>
            <Text variant="label">Number Of employees</Text>
            <Controller
              control={control}
              name="number_employees"
              defaultValue="1-50"
              render={({ field: { onChange } }) => (
                <FormSelect
                  size={"large"}
                  defaultValue={formValues?.number_employees ?? "1-50"}
                  items={[
                    { value: "1-50", label: "1-50" },
                    { value: "51-100", label: "51-100" },
                    { value: "101-500", label: "101-500" },
                    { value: "501-1000", label: "501-1000" },
                    { value: "1001-5000", label: "1001-5000" },
                    { value: "5001-10.000", label: "5001-10.000" },
                    { value: "10.000+", label: "10.000+" },
                  ]}
                  onChange={(value: any) => {
                    onChange(value);
                  }}
                />
              )}
            />
          </Col>
        </Row>

        <Spacer size={20} />

        <Row noWrap gap={"8px"} width={"100%"}>
          <Col width={"100%"}>
            <Text variant="label">Country</Text>
            <Controller
              control={control}
              name="country"
              defaultValue={formValues?.country ?? "Indonesia"}
              render={({ field: { onChange } }) => (
                <FormSelect
                  size={"large"}
                  defaultValue="Indonesia"
                  items={[{ value: "Indonesia", label: "Indonesia" }]}
                  onChange={(value: any) => {
                    onChange(value);
                  }}
                />
              )}
            />
          </Col>
          <Col width={"100%"}>
            <Text variant="label">City</Text>
            <Controller
              control={control}
              name="city"
              defaultValue="Bandung"
              render={({ field: { onChange } }) => (
                <FormSelect
                  size={"large"}
                  defaultValue={formValues?.city ?? "Bandung"}
                  items={[
                    { value: "Bandung", label: "Bandung" },
                    { value: "Jakarta", label: "Jakarta" },
                    { value: "Surabaya", label: "Surabaya" },
                  ]}
                  onChange={(value: any) => {
                    onChange(value);
                  }}
                />
              )}
            />
          </Col>
        </Row>
      </div>
    </Col>
  );
};

export default BusinessType;
