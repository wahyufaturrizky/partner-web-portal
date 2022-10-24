import { ExclamationCircleOutlined } from "@ant-design/icons";
import ArrowLeft from "assets/icons/arrow-left.svg";
import { useRouter } from "next/router";
import {
  Accordion,
  Button,
  Col,
  Dropdown,
  Input,
  Lozenge,
  Radio,
  Row,
  Spacer,
  Switch,
  Tabs,
  Text,
  Spin,
  FileUploaderAllFiles,
} from "pink-lava-ui";
import React, { useState } from "react";
import { Controller, FormProvider, useFieldArray, useForm } from "react-hook-form";
import styled from "styled-components";

import { ModalDeleteConfirmation } from "components/elements/Modal/ModalConfirmationDelete";
import {
  useConvertToVendor,
  useCreateCustomers,
  useDeleteCustomers,
  useUploadLogoCompany,
} from "hooks/mdm/customers/useCustomersMDM";
import { listTabItems, status } from "./constants";
import Invoicing from "./fragments/Invoicing";
import Purchasing from "./fragments/Purchasing";
import Sales from "./fragments/Sales";
import UploadImage from "./fragments/UploadImages";
import { queryClient } from "pages/_app";
import Contacts from "./fragments/Contacts";
import Addresses from "./fragments/Addresses";

export default function CreateCustomers({
  detailCustomer,
  getDataLanguages,
  getDataCustomerGroup,
  setSearchCustomerGroup,
  setSearchLanguages,
  isLoadingCustomer,
}: any) {
  const router = useRouter();
  const [tabAktived, setTabAktived] = useState<string>("Contact");
  const [formType, setFormType] = useState<string>("Company");
  const [imageLogo, setImageLogo] = useState<string>("");
  const [isPKP, setIsPKP] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [visibleModalBankAccount, setVisibleModalBankAccount] = useState<{
    open: boolean;
    typeForm: string;
    data: null;
  }>({
    open: false,
    typeForm: "Edit Bank Account",
    data: null,
  });
  const [checked, setChecked] = useState<any>({
    sales_order_blocking: false,
    billing_blocking: false,
    delivery_order_blocking: false,
  });

  const listItemsCustomerGruop = getDataCustomerGroup?.rows?.map(({ id, name }: any) => {
    return { value: name, id };
  });

  const listItemsLanguages = getDataLanguages?.rows?.map(({ name, id }: any) => {
    return { value: name, id };
  });

  const isCompany: boolean = formType === "Company";
  const _formType: string[] = ["Company", "Individu"];

  const methods = useForm({
    shouldUseNativeValidation: true,
    defaultValues: {
      bank: [],
      customer: {
        name: "",
        is_company: false,
        phone: "",
        tax_number: "",
        mobile: "",
        active_status: "ACTIVE",
        ppkp: true,
        website: "",
        email: "",
        language: null,
        customer_group: null,
        external_code: "",
        company_logo: "",
      },
      contact: [
        {
          name: "",
          role: "",
          email: "",
          tittle: "",
          nik: "",
          mobile: "",
        },
      ],
      address: [
        {
          is_primary: false,
          address_type: "",
          street: "",
          country: null,
          postal_code: "",
          longtitude: "",
          latitude: "",
          lvl_1: 1,
          lvl_2: 1,
          lvl_3: 1,
          lvl_4: 1,
          lvl_5: 1,
          lvl_6: 1,
          lvl_7: 1,
          lvl_8: 1,
          lvl_9: 1,
          lvl_10: 1,
        },
      ],
      invoicing: {
        credit_limit: null,
        credit_balance: null,
        credit_used: null,
        income_account: "",
        expense_account: "",
        tax_name: "",
        tax_city: "",
        tax_address: "",
        currency: "",
      },
      purchasing: {
        term_of_payment: "",
      },
      sales: {
        branch: null,
        salesman: null,
        term_payment: "",
        sales_order_blocking: false,
        billing_blocking: false,
        delivery_order_blocking: false,
      },
    },
  });

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    getValues,
  } = methods;

  const {
    register: bankRegister,
    handleSubmit: handleBankSubmit,
    formState: { errors: errorsFormBank, isSubmitSuccessful },
  } = useForm({
    shouldUseNativeValidation: true,
  });

  const {
    fields: fieldsBank,
    append: appendBank,
    remove: removeBank,
    replace: replaceBank,
  } = useFieldArray<any>({
    control,
    name: "bank",
  });

  const { mutate: createCustomer, isLoading: isLoadingCraeteCustomer } = useCreateCustomers({
    options: {
      onSuccess: () => {
        alert("create success!");
        router.back();
      },
    },
  });

  const { mutate: deleteCustomer, isLoading: isLoadingDeleteCustomer }: any = useDeleteCustomers({
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries(["vendors"]);
        setShowDeleteModal(false);
        router.back();
      },
    },
  });

  const { mutate: uploadCustomerCompanyLogo, isLoading: isLoadingCustomerCompanyLogo } =
    useUploadLogoCompany({
      options: {
        onSuccess: ({ imageUrl }: { imageUrl: string }) => {
          setValue("customer.company_logo", imageUrl);
        },
      },
    });

  const handleUploadCompanyLogoCustomer = async (files: any) => {
    const formData: any = new FormData();
    await formData.append("image", files);

    return uploadCustomerCompanyLogo(formData);
  };

  const onSubmit = (data: any) => {
    const { customer, invoicing, purchasing, sales } = data || {};
    const payloads = {
      ...data,
      customer: {
        ...customer,
        is_company: isCompany,
        ppkp: isPKP,
      },
      purchasing: {
        term_of_payment: purchasing?.term_of_payment || "",
      },
      invoicing: {
        ...data.invoicing,
        credit_limit: Number(invoicing?.credit_limit) || 1,
        credit_balance: Number(invoicing?.credit_balance) || 1,
        credit_used: Number(invoicing?.credit_used) || 1,
        income_account: invoicing?.income_account || "",
        expense_account: invoicing?.expense_account || "",
        tax_name: invoicing?.income_account || "",
        tax_city: invoicing?.tax_city || "",
        tax_address: invoicing?.tax_address || "",
        currency: invoicing?.currency || "",
      },
      sales: {
        ...sales,
        branch: sales?.branch || "",
        salesman: sales?.salesman || "",
        term_payment: sales?.term_payment || "",
      },
    };
    console.log("@payloads", payloads);
    createCustomer(payloads);
  };

  const onHandleBankSubmit = (data: any) => {
    if (visibleModalBankAccount.typeForm === "Edit Bank Account") {
      let tempEdit = fieldsBank.map((mapDataItem) => {
        if (mapDataItem.id === visibleModalBankAccount?.data?.id) {
          mapDataItem.bank_name = data.bank_name;
          mapDataItem.account_number = data.account_number;
          mapDataItem.account_name = data.account_name;

          return { ...mapDataItem };
        } else {
          return mapDataItem;
        }
      });

      replaceBank(tempEdit);
    } else {
      appendBank({ ...data });
    }

    setVisibleModalBankAccount({ typeForm: "", data: null, open: false });
  };

  const propsGeneralForm = {
    detailCustomer,
    errors,
    register,
    isPKP,
    setIsPKP,
    control,
    listItemsLanguages,
    handleUploadCompanyLogoCustomer,
    isCompany,
    setSearchLanguages,
    listItemsCustomerGruop,
    setSearchCustomerGroup,
    isLoadingCustomerCompanyLogo,
  };

  const { mutate: updateConvertVendor, isLoading: isLoadingConvertVendor } = useConvertToVendor({
    id: detailCustomer?.id,
    options: {
      onSuccess: (data: any) => {},
    },
  });

  const propsHeaderForm = {
    control,
    router,
    onSubmit: handleSubmit(onSubmit),
    detailCustomer,
    setShowDeleteModal,
    isLoadingConvertVendor,
    updateConvertVendor,
    isLoadingCraeteCustomer,
  };

  const switchTabItem = () => {
    switch (tabAktived) {
      case formType === "Company" && "Contact":
        return <Contacts formType={detailCustomer ? "edit" : "add"} />;
      case "Addresses":
        return <Addresses formType={detailCustomer ? "edit" : "add"} />;
      case "Sales":
        return (
          <Sales
            checked={checked}
            setChecked={setChecked}
            register={register}
            control={control}
            setValue={setValue}
          />
        );
      case "Invoicing":
        return (
          <Invoicing
            fieldsBank={fieldsBank}
            setVisibleModalBankAccount={setVisibleModalBankAccount}
            visibleModalBankAccount={visibleModalBankAccount}
            errorsFormBank={errorsFormBank}
            handleBankSubmit={handleBankSubmit}
            isSubmitSuccessful={isSubmitSuccessful}
            onHandleBankSubmit={onHandleBankSubmit}
            bankRegister={bankRegister}
            removeBank={removeBank}
            register={register}
            control={control}
          />
        );
      case "Purchasing":
        return <Purchasing errors={errors} control={control} />;
      default:
        return <Sales control={control} setValue={setValue} />;
    }
  };

  if (isLoadingCustomer) {
    return (
      <Row alignItems="center" justifyContent="center">
        <Col>
          <Spin tip="Loading..." />
        </Col>
      </Row>
    );
  }

  return (
    <div>
      <FlexElement>
        {detailCustomer && (
          <ArrowLeft style={{ cursor: "pointer" }} onClick={() => router.back()} />
        )}
        <Label>{detailCustomer?.name || "Create Customer"}</Label>
        {detailCustomer?.registrationStatus ? (
          <Lozenge variant="blue">
            <Row alignItems="center">{detailCustomer?.registrationStatus}</Row>
          </Lozenge>
        ) : (
          _formType.map((item) => (
            <FlexElement key={item}>
              <Radio
                value={item}
                defaultValue="Company"
                checked={item === formType}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFormType(e.target.value);
                  item === "Individu" && setTabAktived("Addresses");
                }}
              />{" "}
              {item}
              <Spacer size={20} />
            </FlexElement>
          ))
        )}
      </FlexElement>
      <Spacer size={20} />
      <HeaderActionForm {...propsHeaderForm} />
      <Spacer size={20} />
      <FormProvider {...methods}>
        <Card>
          <Accordion>
            <Accordion.Item key={1}>
              <Accordion.Header variant="blue">General</Accordion.Header>
              <Accordion.Body>
                <GeneralForms {...propsGeneralForm} />
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Card>
        <Spacer size={20} />
        <Card>
          <Accordion>
            <Accordion.Item key={2}>
              <Accordion.Header variant="blue">Detail Information</Accordion.Header>
              <Accordion.Body>
                <Tabs
                  defaultActiveKey={tabAktived}
                  listTabPane={
                    isCompany ? listTabItems : listTabItems.slice(1, listTabItems.length)
                  }
                  onChange={(e: any) => setTabAktived(e)}
                />
                <Spacer size={20} />
                {switchTabItem()}
                <Spacer size={100} />
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Card>
      </FormProvider>

      {showDeleteModal && (
        <ModalDeleteConfirmation
          totalSelected={1}
          itemTitle={detailCustomer.name}
          visible={showDeleteModal}
          isLoading={isLoadingDeleteCustomer}
          onCancel={() => setShowDeleteModal(false)}
          onOk={() => deleteCustomer({ ids: [detailCustomer.id] })}
        />
      )}
    </div>
  );
}

const GeneralForms = ({
  detailCustomer,
  errors,
  register,
  isPKP,
  setIsPKP,
  control,
  listItemsLanguages,
  handleUploadCompanyLogoCustomer,
  isCompany,
  setSearchLanguages,
  listItemsCustomerGruop,
  setSearchCustomerGroup,
  isLoadingCustomerCompanyLogo,
}: any) => {
  return (
    <Row width="100%" gap="12px">
      <Col width="48%">
        <Input
          style={{ marginBotton: "1rem" }}
          width="100%"
          label="Name"
          height="50px"
          defaultValue={detailCustomer?.name}
          placeholder="e.g PT. Kaldu Sari Nabati Indonesia"
          required
          error={errors?.customer?.name?.message}
          {...register("customer.name", {
            required: "name must be filled",
          })}
        />
        <Spacer size={10} />

        <Input
          width="100%"
          height="50px"
          type="number"
          label="Tax Number"
          placeholder="e.g 123456789"
          error={errors?.customer?.tax_number?.message}
          defaultValue={detailCustomer?.taxNumber}
          {...register("customer.tax_number", {
            required: "Tax Number must be filled",
          })}
        />

        <Spacer size={10} />

        <FlexElement>
          <Spacer size={5} />
          <Text>PKP?</Text>
          <ExclamationCircleOutlined />
          <Spacer size={10} />
          <Switch
            checked={isPKP}
            defaultChecked={isPKP}
            onChange={(value: boolean) => setIsPKP(value)}
          />
        </FlexElement>
        <Spacer size={10} />
        <Input
          required
          width="100%"
          label="Website"
          height="50px"
          placeholder="e.g ksni.com"
          error={errors?.customer?.website?.message}
          defaultValue={detailCustomer?.website}
          {...register("customer.website", {
            required: "website must be filled",
          })}
        />
        <Spacer size={10} />
        <Controller
          control={control}
          rules={{
            required: {
              value: true,
              message: "Please enter language.",
            },
          }}
          name="customer.language"
          render={({ field: { onChange }, fieldState: { error } }) => (
            <>
              <Dropdown
                error={error?.message}
                required
                label="Language"
                height="50px"
                width="100%"
                handleChange={onChange}
                items={listItemsLanguages}
                onSearch={(value: string) => setSearchLanguages(value)}
              />
            </>
          )}
        />
        <Spacer size={10} />
        {isCompany && (
          <FileUploaderAllFiles
            label="Company Logo"
            onSubmit={(file: any) => handleUploadCompanyLogoCustomer(file)}
            disabled={isLoadingCustomerCompanyLogo}
            defaultFile="/placeholder-employee-photo.svg"
            withCrop
            sizeImagePhoto="125px"
            removeable
            textPhoto={["Dimension Minimum 72 x 72, Optimal size 300 x 300", "File Size Max. 5MB"]}
          />
        )}
      </Col>
      <Col width="50%">
        <Input
          width="100%"
          label="Phone"
          height="50px"
          type="number"
          placeholder="e.g 021 123456"
          defaultValue={detailCustomer?.phone}
          error={errors?.customer?.phone?.message}
          {...register("customer.phone", {
            required: "phone must be filled",
          })}
        />
        <Spacer size={10} />
        <Input
          width="100%"
          label="Mobile"
          height="50px"
          type="number"
          defaultValue={detailCustomer?.mobile}
          error={errors?.customer?.mobile?.message}
          placeholder="e.g 081234567891011"
          {...register("customer.mobile", {
            required: "mobile must be filled",
          })}
        />
        <Spacer size={50} />
        <Input
          width="100%"
          label="Email"
          height="50px"
          type="email"
          defaultValue={detailCustomer?.email}
          placeholder={"e.g admin@kasni.co.id"}
          error={errors?.customer?.email?.message}
          {...register("customer.email", {
            required: "email must be filled",
          })}
        />
        <Spacer size={10} />
        <Controller
          control={control}
          name="customer.customer_group"
          render={({ field: { onChange } }) => (
            <>
              <Dropdown
                label="Customer Group"
                height="50px"
                width="100%"
                isLoading
                items={listItemsCustomerGruop}
                handleChange={onChange}
                onSearch={(value: string) => setSearchCustomerGroup(value)}
              />
            </>
          )}
        />
        <Spacer size={10} />
        <Input
          width="100%"
          label="External Code"
          height="50px"
          type="number"
          defaultValue={detailCustomer?.externalCode}
          placeholder={"e.g 123456"}
          {...register("customer.external_code")}
        />
      </Col>
    </Row>
  );
};

const HeaderActionForm = ({
  control,
  router,
  onSubmit,
  detailCustomer,
  setShowDeleteModal,
  updateConvertVendor,
  isLoadingConvertVendor,
  isLoadingCraeteCustomer,
}: any) => {
  return (
    <Card>
      <Row justifyContent="space-between" alignItems="center" nowrap>
        <Controller
          control={control}
          name="customer.active_status"
          defaultValue="ACTIVE"
          render={({ field: { onChange } }) => (
            <>
              <Dropdown
                width="185px"
                noSearch
                isHtml
                items={status}
                defaultValue="ACTIVE"
                handleChange={(value: any) => {
                  onChange(value);
                }}
              />
            </>
          )}
        />
        <Row gap="16px">
          <Button
            size="big"
            variant="tertiary"
            onClick={() => (detailCustomer ? setShowDeleteModal(true) : router.back())}
          >
            {detailCustomer ? "Delete" : "Cancel"}
          </Button>

          <Button
            size="big"
            variant={"secondary"}
            onClick={() => {
              updateConvertVendor();
            }}
          >
            {isLoadingConvertVendor ? "Loading..." : " Convert to Vendor"}
          </Button>

          <Button
            disabled={isLoadingCraeteCustomer}
            size="big"
            variant="primary"
            onClick={onSubmit}
          >
            {isLoadingCraeteCustomer ? "Loading..." : "Save"}
          </Button>
        </Row>
      </Row>
    </Card>
  );
};

const Label = styled.p`
  font-size: 30px;
  font-weight: 600;
  line-height: 14px;
  margin: 0;
  margin-right: 1rem;
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
`;

const FlexElement = styled.div`
  display: flex;
  align-items: center;
`;
