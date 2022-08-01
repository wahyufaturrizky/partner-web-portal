import React from "react";
import { Row, Col, Spacer, Text, FormInput, FormSelect } from "pink-lava-ui";
import { useFormContext, Controller } from "react-hook-form";

const CreateAccount = () => {
  const { control, getValues } = useFormContext();

  const formValues = getValues();

  return (
    <form>
      <Col alignItems={"Center"}>
        <Text variant={"h4"}>Create Account</Text>
        <div style={{ width: "60%" }}>
          <Text variant={"caption"} textAlign={"center"} color={"grey.light"}>
            We're so happy you're here, let’s start by signing up. It may take less than 5 minutes.
          </Text>
        </div>
        <Spacer size={10} />

        <div style={{ width: "400px" }}>
          <Text variant="subtitle1">{"Email"}</Text>
          <Controller
            control={control}
            rules={{ required: true }}
            name="email"
            render={({ field: { onChange }, formState: { errors } }) => (
              <>
                <FormInput
                  size="large"
                  defaultValue={formValues?.email}
                  status={errors?.email?.type === "required" && "error"}
                  placeholder="e.g Gwen.Stacy@email.com"
                  onChange={(e: any) => {
                    onChange(e.target.value);
                  }}
                />
                {errors?.email?.type === "required" && (
                  <Text variant="alert" color={"red.regular"}>
                    This field is required
                  </Text>
                )}
              </>
            )}
          />

          <Spacer size={20} />

          <Text variant="subtitle1">Phone Number</Text>
          <Row noWrap gap={"8px"}>
            <Controller
              control={control}
              name="phone_code"
              defaultValue="+62"
              render={({ field: { onChange } }) => (
                <Col>
                  <FormSelect
                    size={"large"}
                    defaultValue={formValues?.phone_code ?? "+62"}
                    items={[
                      { value: "+62", label: "+62" },
                      { value: "+65", label: "+65" },
                    ]}
                    onChange={(value: any) => {
                      onChange(value);
                    }}
                  />
                </Col>
              )}
            />

            <Controller
              control={control}
              name="phone_number"
              rules={{ required: true }}
              render={({ field: { onChange }, formState: { errors } }) => (
                <Col width={"100%"}>
                  <FormInput
                    size="large"
                    type="number"
                    defaultValue={formValues?.phone_number}
                    placeholder="e.g 8121236384"
                    status={errors?.phone_number?.type === "required" && "error"}
                    onChange={(e: any) => {
                      onChange(e.target.value);
                    }}
                  />
                  {errors?.phone_number?.type === "required" && (
                    <Text variant="alert" color={"red.regular"}>
                      This field is required
                    </Text>
                  )}
                </Col>
              )}
            />
          </Row>

          <Spacer size={20} />

          <Text variant="subtitle1">{"Password"}</Text>
          <Controller
            control={control}
            name="password"
            rules={{ required: true }}
            render={({ field: { onChange }, formState: { errors } }) => (
              <>
                <FormInput
                  type="password"
                  size="large"
                  placeholder="Type Password"
                  defaultValue={formValues?.password}
                  status={errors?.password?.type === "required" && "error"}
                  style={{ borderRadius: "8px" }}
                  onChange={(e: any) => {
                    onChange(e.target.value);
                  }}
                />
                {errors?.password?.type === "required" && (
                  <Text variant="alert" color={"red.regular"}>
                    This field is required
                  </Text>
                )}
              </>
            )}
          />

          <Spacer size={20} />

          <Text variant="subtitle1">{"Confirm Password"}</Text>
          <Controller
            control={control}
            name="confirm_password"
            rules={{ required: true }}
            render={({ field: { onChange }, formState: { errors } }) => (
              <>
                <FormInput
                  type="password"
                  size="large"
                  status={errors?.confirm_password?.type === "required" && "error"}
                  placeholder="Type Password"
                  defaultValue={formValues?.confirm_password}
                  style={{ borderRadius: "8px" }}
                  onChange={(e: any) => {
                    onChange(e.target.value);
                  }}
                />
                {errors?.confirm_password?.type === "required" && (
                  <Text variant="alert" color={"red.regular"}>
                    This field is required
                  </Text>
                )}
              </>
            )}
          />
        </div>
      </Col>
    </form>
  );
};

export default CreateAccount;
