import React from "react";
import { Row, Col, Spacer, Text, FormInput, FormSelect } from "pink-lava-ui";
import { useFormContext, Controller } from "react-hook-form";
import { DIAL_CODES } from "../../utils/dial_code_constant";

const CreateAccount = () => {
  const {
    control,
    getValues,
    watch,
    formState: { errors },
    clearErrors,
  } = useFormContext();

  const formValues = getValues();

  const passwordValue = watch("password");

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
            rules={{ required: true, pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ }}
            name="email"
            render={({ field: { onChange } }) => (
              <FormInput
                size="large"
                defaultValue={formValues?.email}
                status={
                  (errors?.email?.type === "required" || errors?.email?.type === "pattern") &&
                  "error"
                }
                placeholder="e.g Gwen.Stacy@email.com"
                onChange={(e: any) => {
                  if (errors?.email) {
                    clearErrors("email");
                  }
                  onChange(e.target.value);
                }}
              />
            )}
          />
          {errors?.email?.type === "required" && (
            <Text variant="alert" color={"red.regular"}>
              This field is required
            </Text>
          )}
          {errors?.email?.type === "pattern" && (
            <Text variant="alert" color={"red.regular"}>
              Your email doesn't look right!
            </Text>
          )}

          <Spacer size={10} />

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
                    dropdownMatchSelectWidth={false}
                    defaultValue={formValues?.phone_code ?? "+62"}
                    items={DIAL_CODES}
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
              render={({ field: { onChange } }) => (
                <Col width={"100%"}>
                  <FormInput
                    size="large"
                    type="number"
                    defaultValue={formValues?.phone_number}
                    placeholder="e.g 8121236384"
                    status={errors?.phone_number?.type === "required" && "error"}
                    onChange={(e: any) => {
                      if (errors?.phone_number) {
                        clearErrors("phone_number");
                      }
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

          <Spacer size={10} />

          <Text variant="subtitle1">{"Password"}</Text>
          <Controller
            control={control}
            name="password"
            rules={{
              required: true,
            }}
            render={({ field: { onChange } }) => (
              <FormInput
                type="password"
                size="large"
                placeholder="Type Password"
                defaultValue={formValues?.password}
                status={errors?.password?.type === "required" && "error"}
                style={{ borderRadius: "8px" }}
                onChange={(e: any) => {
                  if (errors?.password) {
                    clearErrors("password");
                  }
                  onChange(e.target.value);
                }}
              />
            )}
          />
          {errors?.password?.type === "required" && (
            <Text variant="alert" color={"red.regular"}>
              This field is required
            </Text>
          )}

          <Spacer size={10} />

          <Text variant="subtitle1">{"Confirm Password"}</Text>
          <Controller
            control={control}
            name="confirm_password"
            rules={{
              required: true,
              validate: { isSame: (value) => value === passwordValue },
            }}
            render={({ field: { onChange } }) => (
              <FormInput
                type="password"
                size="large"
                status={
                  (errors?.confirm_password?.type === "required" ||
                    errors?.confirm_password?.type === "isSame") &&
                  "error"
                }
                placeholder="Type Password"
                defaultValue={formValues?.confirm_password}
                style={{ borderRadius: "8px" }}
                onChange={(e: any) => {
                  if (errors?.confirm_password) {
                    clearErrors("confirm_password");
                  }

                  onChange(e.target.value);
                }}
              />
            )}
          />
          {errors?.confirm_password?.type === "required" && (
            <Text variant="alert" color={"red.regular"}>
              This field is required
            </Text>
          )}
          {errors?.confirm_password?.type === "isSame" && (
            <Text variant="alert" color={"red.regular"}>
              Your password is not match
            </Text>
          )}
        </div>
      </Col>
    </form>
  );
};

export default CreateAccount;
