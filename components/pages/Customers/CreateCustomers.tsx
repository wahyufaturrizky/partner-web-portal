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
  Modal,
  FormSelect,
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
import { queryClient } from "pages/_app";
import Contacts from "./fragments/Contacts";
import Addresses from "./fragments/Addresses";
import { ICSuccessCheck } from "assets";

export default function CreateCustomers({
  detailCustomer,
  getDataLanguages,
  isLoadingLanguages,
  setSearchCustomerGroup,
  setSearchLanguages,
  isLoadingCustomer,
  isFetchingCustomerGroupsLists,
  isFetchingMoreCustomerGroupsLists,
  hasNextPageCustomerGroupsLists,
  fetchNextPageCustomerGroupsLists,
  customerGroupsList,
  isLoadingCustomerGroupsLists,
}: any) {
  const router = useRouter();
  const [tabAktived, setTabAktived] = useState<string>("Contact");
  const [formType, setFormType] = useState<string>("Company");
  const [isSuccessConvertToVendor, setIsSuccessConvertToVendor] = useState<{
    open: boolean;
    data: null;
  }>({ open: false, data: null });
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

  const listItemsLanguages = getDataLanguages?.rows?.map(({ name, id }: any) => {
    return { value: name, id };
  });

  const isCompany: boolean = formType === "Company";
  const _formType: string[] = ["Company", "Individu"];

  const methods = useForm({
    shouldUseNativeValidation: true,
    defaultValues: {
      bank: detailCustomer?.customerBanks.map((data: any) => ({
        key: data.id,
        id: data.id,
        bank_name: data.bankName,
        account_number: data.accountNumber,
        account_name: data.accountName,
      })),
      customer: {
        name: detailCustomer?.name,
        is_company: detailCustomer?.isCompany,
        phone: detailCustomer?.phone,
        tax_number: detailCustomer?.taxNumber,
        mobile: detailCustomer?.mobile,
        active_status: detailCustomer?.activeStatus,
        ppkp: detailCustomer?.ppkp,
        website: detailCustomer?.website,
        email: detailCustomer?.email,
        language: detailCustomer?.language,
        customer_group: detailCustomer?.customerGroup,
        external_code: detailCustomer?.externalCode,
        company_logo: detailCustomer?.companyLogo,
      },
      contact: detailCustomer?.customerContacts.map((data: any) => ({
        name: data?.name,
        role: data?.role,
        email: data?.email,
        tittle: data?.tittle,
        nik: data?.nik,
        mobile: data?.mobile,
      })),
      address: detailCustomer?.customerAddresses.map((data: any) => ({
        is_primary: data.isPrimary,
        address_type: data.addressType,
        street: data.street,
        country: data.country,
        postal_code: data.postalCode,
        longtitude: data.longtitude,
        latitude: data.latitude,
        image: data.image,
        imageUrl: data.imageUrl,
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
      })),
      invoicing: {
        credit_limit: detailCustomer?.customerInvoicing?.creditLimit,
        credit_balance: detailCustomer?.customerInvoicing?.creditBalance,
        credit_used: detailCustomer?.customerInvoicing?.creditUsed,
        income_account: detailCustomer?.customerInvoicing?.incomeAccount,
        expense_account: detailCustomer?.customerInvoicing?.expenseAccount,
        tax_name: detailCustomer?.customerInvoicing?.taxName,
        tax_city: detailCustomer?.customerInvoicing?.taxCity,
        tax_address: detailCustomer?.customerInvoicing?.taxAddress,
        currency: detailCustomer?.customerInvoicing?.currency,
      },
      purchasing: {
        term_of_payment: detailCustomer?.customerPurchasing?.termOfPayment,
      },
      sales: {
        branch: detailCustomer?.customerSales?.branch,
        salesman: detailCustomer?.customerSales?.salesman,
        term_payment: detailCustomer?.customerSales?.termPayment,
        sales_order_blocking: detailCustomer?.customerSales?.salesOrderBlocking,
        billing_blocking: detailCustomer?.customerSales?.billingBlocking,
        delivery_order_blocking: detailCustomer?.customerSales?.deliveryOrderBlocking,
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

  const { mutate: createCustomer, isLoading: isLoadingCreateCustomer } = useCreateCustomers({
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
    const { customer, invoicing, purchasing, sales, bank, contact, address } = data || {};

    const tempcontact = contact?.map((data: any) => {
      if (data.filtered || data.is_primary) {
        delete data.filtered;
        delete data.is_primary;
        return data;
      } else {
        return data;
      }
    });

    const payloads = {
      bank: bank.map((data: any) => ({
        bank_name: data.bank_name,
        account_number: data.account_number,
        account_name: data.account_name,
      })),
      contact: contact.map((data: any) => ({
        name: data.name,
        role: data.role,
        email: data.email,
        tittle: data.tittle,
        nik: data.nik,
        mobile: data.mobile,
      })),
      address: address.map((data: any) => ({
        is_primary: data.is_primary,
        address_type: data.address_type,
        street: data.address_type,
        country: data.country,
        postal_code: data.postal_code,
        longtitude: data.longtitude,
        latitude: data.latitude,
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
        image: data.image,
      })),
      customer: {
        name: customer.name,
        phone: customer.phone,
        tax_number: customer.tax_number,
        mobile: customer.mobile,
        active_status: customer.active_status,
        website: customer.website,
        email: customer.email,
        language: customer.language,
        customer_group: Number(customer.customer_group),
        external_code: customer.external_code,
        company_logo: customer.company_logo,
        is_company: isCompany,
        ppkp: isPKP,
      },
      purchasing: {
        term_of_payment: purchasing?.term_of_payment || "",
      },
      invoicing: {
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
        branch: Number(sales?.branch) || 1,
        salesman: Number(sales?.salesman) || 1,
        term_payment: sales?.term_payment || "1",
        sales_order_blocking: sales.sales_order_blocking || true,
        billing_blocking: sales.billing_blocking || true,
        delivery_order_blocking: sales.delivery_order_blocking || true,
      },
    };

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
    isLoadingLanguages,
    handleUploadCompanyLogoCustomer,
    isCompany,
    setSearchLanguages,
    setSearchCustomerGroup,
    isLoadingCustomerCompanyLogo,
    isFetchingCustomerGroupsLists,
    isFetchingMoreCustomerGroupsLists,
    hasNextPageCustomerGroupsLists,
    fetchNextPageCustomerGroupsLists,
    customerGroupsList,
  };

  const { mutate: updateConvertVendor, isLoading: isLoadingConvertVendor } = useConvertToVendor({
    id: detailCustomer?.id,
    options: {
      onSuccess: (data: any) => {
        setIsSuccessConvertToVendor({
          data: data,
          open: true,
        });
      },
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
    isLoadingCreateCustomer,
  };

  const switchTabItem = () => {
    switch (tabAktived) {
      case formType === "Company" && "Contact":
        return <Contacts formType={detailCustomer ? "edit" : "add"} />;
      case "Addresses":
        return <Addresses getValues={getValues} formType={detailCustomer ? "edit" : "add"} />;
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

  if (isLoadingCustomer || isLoadingCustomerGroupsLists || isLoadingLanguages) {
    return (
      <Row alignItems="center" justifyContent="center">
        <Col>
          <Spin tip="Loading..." />
        </Col>
      </Row>
    );
  } else {
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

        {isSuccessConvertToVendor.open && (
          <Modal
            centered
            width={432}
            closable={false}
            visible={isSuccessConvertToVendor.open}
            onCancel={() => setIsSuccessConvertToVendor({ open: false, data: null })}
            footer={null}
            content={
              <Row justifyContent="center">
                <Col>
                  <Spacer size={24} />

                  <Row alignItems="center" justifyContent="center">
                    <ICSuccessCheck />
                    <Text variant="headingLarge" color={"green.dark"}>
                      Success
                    </Text>
                  </Row>

                  <Spacer size={10} />

                  <Text textAlign="center" variant="headingLarge">
                    Vendor ID {isSuccessConvertToVendor?.data?.id} has been successfully converted
                  </Text>

                  <Spacer size={24} />

                  <Row alignItems="center" justifyContent="space-between">
                    <Button
                      size="big"
                      variant={"tertiary"}
                      key="submit"
                      type="primary"
                      onClick={() => setIsSuccessConvertToVendor({ open: false, data: null })}
                    >
                      Cancel
                    </Button>

                    <Button
                      size="big"
                      key="submit"
                      type="primary"
                      onClick={() => router.push(`/vendor/${isSuccessConvertToVendor?.data?.id}`)}
                    >
                      Go to Vendor
                    </Button>
                  </Row>

                  <Spacer size={24} />
                </Col>
              </Row>
            }
          />
        )}
      </div>
    );
  }
}

const GeneralForms = ({
  detailCustomer,
  errors,
  register,
  isPKP,
  setIsPKP,
  control,
  listItemsLanguages,
  isLoadingLanguages,
  handleUploadCompanyLogoCustomer,
  isCompany,
  setSearchLanguages,
  setSearchCustomerGroup,
  isLoadingCustomerCompanyLogo,
  isFetchingCustomerGroupsLists,
  isFetchingMoreCustomerGroupsLists,
  hasNextPageCustomerGroupsLists,
  fetchNextPageCustomerGroupsLists,
  customerGroupsList,
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
                loading={isLoadingLanguages}
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
              <LabelDropdown>Customer Group</LabelDropdown>
              <Spacer size={3} />
              <FormSelect
                height="48px"
                style={{ width: "100%" }}
                size={"large"}
                placeholder={"Select"}
                borderColor={"#AAAAAA"}
                arrowColor={"#000"}
                withSearch
                isLoading={isFetchingCustomerGroupsLists}
                isLoadingMore={isFetchingMoreCustomerGroupsLists}
                fetchMore={() => {
                  if (hasNextPageCustomerGroupsLists) {
                    fetchNextPageCustomerGroupsLists();
                  }
                }}
                items={
                  isFetchingCustomerGroupsLists && !isFetchingMoreCustomerGroupsLists
                    ? []
                    : customerGroupsList
                }
                onChange={(value: any) => {
                  onChange(value);
                }}
                onSearch={(value: any) => {
                  setSearchCustomerGroup(value);
                }}
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
  isLoadingCreateCustomer,
}: any) => {
  return (
    <Card>
      <Row justifyContent="space-between" alignItems="center" nowrap>
        <Controller
          control={control}
          name="customer.active_status"
          defaultValue={detailCustomer?.activeStatus || "ACTIVE"}
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

          {detailCustomer && (
            <Button
              size="big"
              variant={"secondary"}
              disabled={isLoadingConvertVendor || detailCustomer?.vendor?.id}
              onClick={() => {
                updateConvertVendor();
              }}
            >
              {isLoadingConvertVendor ? "Loading..." : " Convert to Vendor"}
            </Button>
          )}

          <Button
            disabled={isLoadingCreateCustomer}
            size="big"
            variant="primary"
            onClick={onSubmit}
          >
            {isLoadingCreateCustomer ? "Loading..." : "Save"}
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

const LabelDropdown = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  color: #000000;
`;
