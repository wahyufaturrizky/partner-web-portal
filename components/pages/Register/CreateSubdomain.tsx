import React from "react";
import { Col, Spacer, Text, FormInput } from "pink-lava-ui";
import { LoadingOutlined, CheckCircleFilled, ExclamationCircleFilled } from "@ant-design/icons";
import { useFormContext, Controller } from "react-hook-form";

const CreateSubdomain = () => {
  const {
    control,
    getValues,
    formState: { errors },
    clearErrors,
  } = useFormContext();
  const formValues = getValues();

  return (
    <Col alignItems={"Center"}>
      <Text variant={"h4"}>Create Subdomain</Text>
      <div style={{ width: "60%" }}>
        <Text variant={"caption"} textAlign={"center"} color={"grey.light"}>
          It's almost finished, Please check the subdomain name that we have suggested or want to
          create a new one according to your wishes. Subdomain are internet addresses for diferent
          section of your website
        </Text>
      </div>
      <Spacer size={10} />

      <div style={{ width: "400px" }}>
        <Text variant="subtitle1">Subdomain</Text>
        <Controller
          control={control}
          rules={{ required: true, pattern: /^[a-zA-Z0-9]*$/ }}
          name="subdomain"
          render={({ field: { onChange } }) => (
            <FormInput
              size="large"
              defaultValue={formValues?.subdomain}
              status={errors?.subdomain?.type === "required" && "error"}
              placeholder="large size"
              suffix={
                <>
                  <span>.com</span>
                  {!errors?.subdomain?.type && <CheckCircleFilled style={{ color: "green" }} />}
                  {errors?.subdomain?.type && <ExclamationCircleFilled style={{ color: "red" }} />}
                  {/* <LoadingOutlined /> */}
                </>
              }
              onChange={(e: any) => {
                if (errors?.subdomain) {
                  clearErrors("subdomain");
                }
                onChange(e.target.value);
              }}
            />
          )}
        />
        {errors?.subdomain?.type === "required" && (
          <Text variant="alert" color={"red.regular"}>
            This field is required
          </Text>
        )}
        {errors?.subdomain?.type === "pattern" && (
          <Text variant="alert" color={"red.regular"}>
            Subdomain must be in alphanumeric
          </Text>
        )}
      </div>
    </Col>
  );
};

export default CreateSubdomain;
