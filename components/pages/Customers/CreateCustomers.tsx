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
import { Controller, FormProvider, useFieldArray, useForm, useWatch } from "react-hook-form";
import styled from "styled-components";

import { ModalDeleteConfirmation } from "components/elements/Modal/ModalConfirmationDelete";
import {
  useConvertToVendor,
  useCreateCustomers,
  useDeleteCustomers,
  useUpdateCustomer,
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
import { useUserPermissions } from "hooks/user-config/usePermission";

export default function CreateCustomers({
  detailCustomer,
  getDataLanguages,
  isLoadingLanguages,
  isLoadingPostalCode,
  setSearchCustomerGroup,
  setSearchLanguages,
  isLoadingCustomer,
  isFetchingCustomerGroupsLists,
  isFetchingMoreCustomerGroupsLists,
  hasNextPageCustomerGroupsLists,
  fetchNextPageCustomerGroupsLists,
  customerGroupsList,
  isLoadingCustomerGroupsLists,
  isFetchingPostalCode,
  isFetchingMorePostalCode,
  hasNextPagePostalCode,
  fetchNextPagePostalCode,
  postalCodeList,
  setSearchPostalCode,
  methods,
  control,
  handleSubmit,
  register,
  errors,
  setValue,
  getValues,
  router,
  editBankAccount,
  addMoreAddress,
  newAddress,
  primary,
  setPrimary,
  deleteLabel,
  addressTypeLabel,
  primaryLabel,
  storePhotoLabel,
  dimensionMinimumLabel,
  fileSizeLabel,
  streetLabel,
  countryLabel,
  provinceLabel,
  cityLabel,
  districtLabel,
  zoneLabel,
  postalCodeLabel,
  longitudeLabel,
  type,
}: any) {
  const dataWatchCustomer = useWatch({
    control,
    name: "customer",
  });
  const [tabAktived, setTabAktived] = useState<string>("Contact");
  const [isSuccessConvertToVendor, setIsSuccessConvertToVendor] = useState<{
    open: boolean;
    data: null;
  }>({ open: false, data: null });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [visibleModalBankAccount, setVisibleModalBankAccount] = useState<{
    open: boolean;
    typeForm: string;
    data: null;
  }>({
    open: false,
    typeForm: editBankAccount,
    data: null,
  });

  const listItemsLanguages = getDataLanguages?.rows?.map(({ name, id }: any) => {
    return { value: name, id };
  });

  const _formType: string[] = ["Company", "Individu"];

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

  const { mutate: updateCustomer, isLoading: isLoadingUpdateCustomer } = useUpdateCustomer({
    options: {
      onSuccess: () => {
        alert("update success!");
        router.back();
      },
    },
    id: detailCustomer?.id,
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
        is_company: customer.is_company === "Company" ? true : false,
        ppkp: customer.ppkp,
      },
      purchasing: {
        term_of_payment: purchasing?.term_of_payment,
      },
      invoicing: {
        credit_limit: Number(invoicing?.credit_limit),
        credit_balance: Number(invoicing?.credit_balance),
        credit_used: Number(invoicing?.credit_used),
        income_account: invoicing?.income_account,
        expense_account: invoicing?.expense_account,
        tax_name: invoicing?.tax_name,
        tax_city: invoicing?.tax_city,
        tax_address: invoicing?.tax_address,
        currency: invoicing?.currency,
      },
      sales: {
        branch: Number(sales?.branch),
        salesman: Number(sales?.salesman),
        term_payment: sales?.term_payment,
        sales_order_blocking: sales.sales_order_blocking,
        billing_blocking: sales.billing_blocking,
        delivery_order_blocking: sales.delivery_order_blocking,
      },
    };

    if (detailCustomer) {
      updateCustomer({
        ...payloads,
        customer: {
          ...payloads.customer,
          id: customer.id,
        },
        sales: {
          ...payloads.sales,
          id: sales.id,
        },
        bank: bank.map((data: any) => ({
          bank_name: data.bank_name,
          account_number: data.account_number,
          account_name: data.account_name,
          id: data.id,
        })),
        contact: contact.map((data: any) => ({
          name: data.name,
          role: data.role,
          email: data.email,
          tittle: data.tittle,
          nik: data.nik,
          mobile: data.mobile,
          id: data.id,
        })),
        address: address.map((data: any) => ({
          id: data.id,
          is_primary: data.is_primary,
          address_type: data.address_type,
          street: data.address_type,
          country: data.country,
          postal_code: data.postal_code,
          longtitude: data.longtitude,
          latitude: data.latitude,
          image: data.image || "-",
        })),
        purchasing: {
          id: purchasing.id,
          term_of_payment: purchasing.term_of_payment,
        },
        invoicing: {
          ...invoicing,
          id: invoicing.id,
        },
      });
    } else {
      createCustomer(payloads);
    }
  };

  const onHandleBankSubmit = (data: any) => {
    if (visibleModalBankAccount.typeForm === editBankAccount) {
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
    control,
    listItemsLanguages,
    isLoadingLanguages,
    handleUploadCompanyLogoCustomer,
    setSearchLanguages,
    setSearchCustomerGroup,
    isLoadingCustomerCompanyLogo,
    isFetchingCustomerGroupsLists,
    isFetchingMoreCustomerGroupsLists,
    hasNextPageCustomerGroupsLists,
    fetchNextPageCustomerGroupsLists,
    customerGroupsList,
    getValues,
    dataWatchCustomer,
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
    type,
    control,
    router,
    onSubmit: handleSubmit(onSubmit),
    detailCustomer,
    setShowDeleteModal,
    isLoadingConvertVendor,
    updateConvertVendor,
    isLoadingCreateCustomer,
    isLoadingUpdateCustomer,
  };

  const switchTabItem = () => {
    switch (tabAktived) {
      case dataWatchCustomer.is_company === "Company" && "Contact":
        return <Contacts formType={detailCustomer ? "edit" : "add"} />;
      case "Addresses":
        return (
          <Addresses
            isFetchingPostalCode={isFetchingPostalCode}
            isFetchingMorePostalCode={isFetchingMorePostalCode}
            hasNextPagePostalCode={hasNextPagePostalCode}
            fetchNextPagePostalCode={fetchNextPagePostalCode}
            postalCodeList={postalCodeList}
            setSearchPostalCode={setSearchPostalCode}
            getValues={getValues}
            formType={detailCustomer ? "edit" : "add"}
            addMoreAddress={addMoreAddress}
            newAddress={newAddress}
            primary={primary}
            setPrimary={setPrimary}
            deleteLabel={deleteLabel}
            addressTypeLabel={addressTypeLabel}
            primaryLabel={primaryLabel}
            storePhotoLabel={storePhotoLabel}
            dimensionMinimumLabel={dimensionMinimumLabel}
            fileSizeLabel={fileSizeLabel}
            streetLabel={streetLabel}
            countryLabel={countryLabel}
            provinceLabel={provinceLabel}
            cityLabel={cityLabel}
            districtLabel={districtLabel}
            zoneLabel={zoneLabel}
            postalCodeLabel={postalCodeLabel}
            longitudeLabel={longitudeLabel}
          />
        );
      case "Sales":
        return <Sales register={register} control={control} setValue={setValue} />;
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

  if (
    isLoadingCustomer ||
    isLoadingCustomerGroupsLists ||
    isLoadingLanguages ||
    isLoadingPostalCode
  ) {
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
                <Controller
                  control={control}
                  name="customer.is_company"
                  render={({ field: { onChange, value } }) => {
                    return (
                      <>
                        <Radio
                          value={item}
                          defaultValue={value}
                          checked={item === dataWatchCustomer.is_company}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            onChange(e.target.value);
                            item === "Individu"
                              ? setTabAktived("Addresses")
                              : setTabAktived("Contact");
                          }}
                        />
                        {item}
                        <Spacer size={20} />
                      </>
                    );
                  }}
                />
              </FlexElement>
            ))
          )}
        </FlexElement>
        <Spacer size={20} />
        <HeaderActionForm {...propsHeaderForm} />
        <Spacer size={20} />
        <FormProvider {...methods}>
          <Card>
            <Accordion style={{ display: "relative" }} id={"area"}>
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
                      dataWatchCustomer.is_company === "Company"
                        ? listTabItems
                        : listTabItems.slice(1, listTabItems.length)
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
            onOk={() => deleteCustomer({ delete: [detailCustomer.id] })}
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
  errors,
  register,
  control,
  listItemsLanguages,
  isLoadingLanguages,
  handleUploadCompanyLogoCustomer,
  setSearchLanguages,
  setSearchCustomerGroup,
  isLoadingCustomerCompanyLogo,
  isFetchingCustomerGroupsLists,
  isFetchingMoreCustomerGroupsLists,
  hasNextPageCustomerGroupsLists,
  fetchNextPageCustomerGroupsLists,
  customerGroupsList,
  getValues,
  dataWatchCustomer,
}: any) => {
  return (
    <Row width="100%" gap="12px">
      <Col width="48%">
        <Input
          style={{ marginBotton: "1rem" }}
          width="100%"
          label="Name"
          height="50px"
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
          <Controller
            control={control}
            // rules={{
            //   required: {
            //     value: true,
            //     message: "Please enter language.",
            //   },
            // }}
            name="customer.ppkp"
            render={({ field: { onChange, value }, fieldState: { error } }) => {
              return <Switch checked={value} defaultChecked={value} onChange={onChange} />;
            }}
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
          {...register("customer.website", {
            required: "website must be filled",
          })}
        />
        <Spacer size={10} />
        <Controller
          control={control}
          defaultValue={getValues("customer.language")}
          rules={{
            required: {
              value: true,
              message: "Please enter language.",
            },
          }}
          name="customer.language"
          render={({ field: { onChange, value }, fieldState: { error } }) => {
            return (
              <>
                <Dropdown
                  error={error?.message}
                  defaultValue={value}
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
            );
          }}
        />
        <Spacer size={10} />
        {dataWatchCustomer.is_company === "Company" && (
          <Controller
            control={control}
            name="customer.company_logo"
            render={({ field: { value } }) => {
              return (
                <FileUploaderAllFiles
                  label="Company Logo"
                  onSubmit={(file: any) => handleUploadCompanyLogoCustomer(file)}
                  disabled={isLoadingCustomerCompanyLogo}
                  defaultFile={value === "-" ? "/placeholder-employee-photo.svg" : value}
                  withCrop
                  sizeImagePhoto="125px"
                  removeable
                  textPhoto={[
                    "Dimension Minimum 72 x 72, Optimal size 300 x 300",
                    "File Size Max. 5MB",
                  ]}
                />
              );
            }}
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
  isLoadingUpdateCustomer,
  type,
}: any) => {
  const { data: dataUserPermission } = useUserPermissions({
    options: {
      onSuccess: () => {},
    },
  });

  const listPermission = dataUserPermission?.permission?.filter(
    (filtering: any) => filtering.menu === "Customer"
  );

  return (
    <Card>
      <Row justifyContent="space-between" alignItems="center" nowrap>
        <Controller
          control={control}
          name="customer.active_status"
          render={({ field: { onChange, value } }) => (
            <>
              <Dropdown
                width="185px"
                noSearch
                isHtml
                items={status}
                defaultValue={value}
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

          {type === "edit" &&
            listPermission?.filter((data: any) => data.viewTypes[0]?.viewType.name === "Update")
              .length > 0 && (
              <Button
                disabled={isLoadingCreateCustomer || isLoadingUpdateCustomer}
                size="big"
                variant="primary"
                onClick={onSubmit}
              >
                {isLoadingCreateCustomer || isLoadingUpdateCustomer ? "Loading..." : "Save"}
              </Button>
            )}

          {type === "create" &&
            listPermission?.filter((data: any) => data.viewTypes[0]?.viewType.name === "Create")
              .length > 0 && (
              <Button
                disabled={isLoadingCreateCustomer || isLoadingUpdateCustomer}
                size="big"
                variant="primary"
                onClick={() => {
                  onSubmit();
                  console.log("tembak");
                }}
              >
                {isLoadingCreateCustomer || isLoadingUpdateCustomer ? "Loading..." : "Save"}
              </Button>
            )}
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
