import React from "react";
import { Modal, Spacer, Input, Button, FormSelect, Text } from "pink-lava-ui";
import styled from "styled-components";
import { useForm, Controller } from "react-hook-form";

export default function ModalAddNewContactCustomer({
  visible,
  onCancel,
  contactData,
  onSaveContact,
}: any) {
  const { register, control, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    onSaveContact(data);
  };

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      title="Add New Contact"
      footer={
        <Footer>
          <Button onClick={onCancel} variant="tertiary" size="big" full>
            Cancel
          </Button>
          <Button full onClick={handleSubmit(onSubmit)} variant="primary" size="big">
            Add
          </Button>
        </Footer>
      }
      content={
        <div>
          <Controller
            control={control}
            shouldUnregister={true}
            defaultValue={contactData?.tittle ?? ""}
            name="tittle"
            render={({ field: { onChange }, formState: { errors } }) => (
              <>
                <Text variant="headingRegular">Title</Text>
                <Spacer size={6} />
                <FormSelect
                  defaultValue={contactData?.tittle ?? ""}
                  style={{ width: "100%" }}
                  size={"large"}
                  placeholder={"Select"}
                  borderColor={"#AAAAAA"}
                  arrowColor={"#000"}
                  withSearch={false}
                  items={[
                    { id: "mr.", value: "Mr." },
                    { id: "mrs.", value: "Mrs." },
                  ]}
                  onChange={(value: any) => {
                    onChange(value);
                  }}
                />
              </>
            )}
          />

          <Spacer size={10} />
          <Input
            width="100%"
            height="40px"
            placeholder="e.g Lala Lulu"
            label="Full Name"
            defaultValue={contactData?.name ?? ""}
            {...register("name", { shouldUnregister: true })}
          />
          <Spacer size={10} />
          <Input
            width="100%"
            height="40px"
            placeholder="e.g Business"
            label="Job Position"
            defaultValue={contactData?.role ?? ""}
            {...register("role", { shouldUnregister: true })}
          />
          <Spacer size={10} />
          <Input
            width="100%"
            height="40px"
            placeholder="e.g 08123456789"
            label="Mobile"
            defaultValue={contactData?.mobile ?? ""}
            {...register("mobile", { shouldUnregister: true })}
          />
          <Spacer size={10} />
          <Input
            width="100%"
            height="40px"
            placeholder="e.g lala.lulu@kasni.co.id"
            label="Email"
            defaultValue={contactData?.email ?? ""}
            {...register("email", { shouldUnregister: true })}
          />
          <Spacer size={10} />
          <Input
            width="100%"
            height="40px"
            placeholder="e.g 123456789"
            label="NIK (optional)"
            defaultValue={contactData?.nik ?? ""}
            {...register("nik", { shouldUnregister: true })}
          />
          <Spacer size={20} />
        </div>
      }
    />
  );
}

const Footer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
