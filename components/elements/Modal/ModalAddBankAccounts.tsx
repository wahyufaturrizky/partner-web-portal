import { Button, Input, Modal, Spacer } from "pink-lava-ui";
import { useForm } from "react-hook-form";
import styled from "styled-components";

export default function ModalAddBankAccounts({
  visible,
  onCancel,
  bankData,
  onSaveBank,
  bankType,
}: any) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      bank: bankData?.bank || "",
      account_number: bankData?.account_number || "",
      account_name: bankData?.account_name || "",
    },
    shouldUnregister: bankType === "add",
  });

  const onSubmit = (data: any) => {
    onSaveBank(data);
  };
  console.log("@bankData", bankData);

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      title="Add Bank Account"
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
          <Spacer size={10} />
          <Input
            width="100%"
            required
            height="40px"
            placeholder="e.g BCA"
            label="Bank Name"
            error={errors?.bank?.message}
            defaultValue={bankData?.name ?? ""}
            {...register("bank", { required: "Bank Name must fill" })}
          />
          <Spacer size={10} />
          <Input
            width="100%"
            required
            height="40px"
            placeholder="e.g 123456789"
            label="Account Number"
            error={errors?.account_number?.message}
            defaultValue={bankData?.account_number ?? ""}
            {...register("account_number", {
              required: "Account Number must fill",
            })}
          />
          <Spacer size={10} />
          <Input
            width="100%"
            required
            height="40px"
            placeholder="e.g Jane Done"
            label="Account Name"
            error={errors?.account_name?.message}
            defaultValue={bankData?.account_name ?? ""}
            {...register("account_name", {
              required: "Account Name must fill",
            })}
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
