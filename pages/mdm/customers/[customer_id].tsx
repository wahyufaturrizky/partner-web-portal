import React, { useState } from "react";
import {
  Text,
  Col,
  Row,
  Spacer,
  Dropdown,
  Button,
  Accordion,
  Radio,
  Tabs,
  Spin,
} from "pink-lava-ui";
import styled from "styled-components";
import { useRouter } from "next/router";
import { useForm, Controller, FormProvider, useWatch } from "react-hook-form";
import General from "components/pages/Customers/General/General";
import Contacts from "components/pages/Customers/Contacts/Contacts";
import Addresses from "components/pages/Customers/Addresess/Addresess";
import Purchasing from "components/pages/Customers/Purchasing/Purchasing";
import Invoicing from "components/pages/Customers/Invoicing/Invoicing";
import Sales from "components/pages/Customers/Sales/Sales";
import {
  useUpdateVendor,
  useVendor,
  useConvertToCustomer,
  useDeleteVendor,
} from "hooks/mdm/vendor/useVendor";
import { queryClient } from "pages/_app";
import ArrowLeft from "assets/icons/arrow-left.svg";
import { VendorContext } from "context/VendorContext";
import { ModalDeleteConfirmation } from "components/elements/Modal/ModalConfirmationDelete";
import { useUserPermissions } from "hooks/user-config/usePermission";
import {
  useDeleteCustomers,
  useDetailCustomer,
  useUpdateCustomer,
} from "hooks/mdm/customers/useCustomersMDM";

const listTabItems = [
  { title: "Contacts" },
  { title: "Addresses" },
  { title: "Sales" },
  { title: "Purchasing" },
  { title: "Invoicing" },
];

const objectIsEmpty = (object: any) =>
  Object.keys(object).length === 0 && object.constructor === Object;

export default function CustomerDetail() {
  const router = useRouter();
  const companyCode = localStorage.getItem("companyCode");

  const { customer_id } = router.query;

  const methods = useForm({
    defaultValues: {
      status: "Inactive",
      customer_id: "",
      name: "",
      group: 1,
      mobile: "",
      phone: "",
      language: "",
      tax: "",
      email: "",
      external_code: "",
      is_pkp: false,
      contacts: [],
      addresses: [],
      purchasing: {},
      invoicing: {},
      sales: {},
    },
  });
  const { control, handleSubmit, setValue } = methods;

  const [activeTab, SetActiveTab] = useState("Contacts");
  const [radioValue, setRadioValue] = useState("company");
  const [companyLogo, setCompanyLogo] = useState("/placeholder-employee-photo.svg");
  const [selectFromForm, setSelectFromForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: dataUserPermission } = useUserPermissions({
    options: {
      onSuccess: () => {},
    },
  });

  const listPermission = dataUserPermission?.permission?.filter(
    (filtering: any) => filtering.menu === "Customer"
  );

  const watchCustomerId = useWatch({
    control,
    name: "customer_id",
  });

  const renderTabItem = (activeTab: any) => {
    switch (activeTab) {
      case "Contacts":
        return <Contacts formType="edit" />;
      case "Addresses":
        return <Addresses formType="edit" />;
      case "Purchasing":
        return <Purchasing />;
      case "Sales":
        return <Sales />;
      case "Invoicing":
        return <Invoicing />;
      default:
        return <Contacts />;
    }
  };

  const { mutate: updateCustomer, isLoading: isLoadingUpdateCustomer } = useUpdateCustomer({
    id: customer_id,
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries(["customer-list"]);
        router.back();
      },
    },
  });

  const { mutate: updateConvertCustomer, isLoading: isLoadingConvertCustomer } =
    useConvertToCustomer({
      id: customer_id,
      options: {
        onSuccess: (data: any) => {
          setValue("customer_id", data);
          setSelectFromForm(false);
        },
      },
    });

  const { mutate: deleteCustomer, isLoading: isLoadingDeleteCustomer }: any = useDeleteCustomers({
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries(["customer-list"]);
        setShowDeleteModal(false);
        router.back();
      },
    },
  });

  const {
    data: customerData,
    isLoading: isLoadingCustomer,
    isFetching: isFetchingCustomer,
  } = useDetailCustomer({
    id: customer_id,
    options: {
      onSuccess: (data: any) => {
        setSelectFromForm(data?.customerId === "");
        setRadioValue(data?.type?.toLowerCase());

        // General Form
        setValue("customer_id", data.customerId);
        setValue("status", data?.status);
        setValue("name", data?.name);
        setValue("group", data?.group);
        setValue("company.website", data?.companyWebsite);
        setCompanyLogo(data?.companyLogo);
        setValue("individu.job", data?.personalJob);
        setValue("individu.title", data?.personalTitle);
        setValue("individu.company", data?.personalCompany);
        setValue("mobile", data?.mobile);
        setValue("language", data?.language);
        setValue("phone", data?.phone);
        setValue("tax", data?.tax);
        setValue("email", data?.email);
        setValue("is_pkp", data?.isPkp);
        setValue("external_code", data?.externalCode);

        // Contact Form
        const mappingContact = data?.contacts?.map((contact: any) => ({
          id: contact.id,
          filtered: false,
          is_primary: contact.isPrimary,
          title: contact.title,
          name: contact.name,
          job: contact.job,
          mobile: contact.mobile,
          email: contact.email,
          nik: contact.nik,
          deleted: false,
        }));

        setValue("contacts", mappingContact);

        // Address Form
        const mappingAddress = data?.addresses?.map((address: any) => ({
          id: address.id,
          is_primary: address.isPrimary,
          type: address.type,
          street: address.street,
          country: address.country,
          province:
            address.countryLevelsArray[0] === 0 || address.countryLevelsArray[0] === undefined
              ? ""
              : address.countryLevelsArray[0],
          city: address.countryLevelsArray[1] ?? "",
          district: address.countryLevelsArray[2] ?? "",
          zone: address.countryLevelsArray[3] ?? "",
          postal_code: address.postalCode,
          lon: address.lon,
          lat: address.lat,
          photo: address.photos.map((photoUrl: any, index: any) => ({
            uid: `-${index + 1}`,
            name: photoUrl?.substring(photoUrl.lastIndexOf("/") + 1),
            status: "done",
            url: photoUrl,
          })),
          deleted: false,
        }));

        setValue("addresses", mappingAddress);

        // Purchasing Form
        const mappingPurchasing = {
          term_of_payment: data?.purchasing?.termOfPayment,
          billing_blocking: data?.purchasing?.billingBlocking,
          po_blocking: data?.purchasing?.poBlocking,
          receipt_blocking: data?.purchasing?.receiptBlocking,
          purchase_organization: data?.purchasing?.purchaseOrganization ?? [],
        };

        setValue("purchasing", mappingPurchasing);

        // Invoicing Form
        const mappingInvoicing = {
          reconciliation_account: data?.invoicing?.reconciliationAccount,
          tax_country: data?.invoicing?.taxCountry,
          tax_name: data?.invoicing?.taxName,
          tax_address: data?.invoicing?.taxAddress,
          tax_type: data?.invoicing?.taxType,
          tax_code: data?.invoicing?.taxCode,
          currency: data?.invoicing?.currency,
          payment_method: data?.invoicing?.paymentMethods ?? [],
          banks: data?.invoicing?.banks ?? [],
        };

        setValue("invoicing", mappingInvoicing);
      },
    },
  });

  const onSubmit = (data: any) => {
    const companyPayload =
      radioValue === "company"
        ? { logo: companyLogo, website: data?.company?.website ?? "" }
        : null;

    const individuPayload =
      radioValue === "individu"
        ? {
            title: data?.individu?.title ?? "",
            company: data?.individu?.company ?? "",
            job: data?.individu?.job ?? "",
          }
        : null;

    const contactsPayload =
      data?.contacts?.map((contact: any) => {
        delete contact?.filtered;
        delete contact?.key;
        return contact;
      }) ?? [];

    const addressPayload =
      data?.addresses?.map((address: any) => {
        const mappCountrylevel = [];

        mappCountrylevel[0] = address.province === "" ? 0 : address.province;
        mappCountrylevel[1] = address.city === "" ? 0 : address.city;
        mappCountrylevel[2] = address.district === "" ? 0 : address.district;
        mappCountrylevel[3] = address.zone === "" ? 0 : address.zone;

        // cek apakah array isinya semuanya 0
        const allEqual = mappCountrylevel.every((value) => value === 0);

        return {
          id: address.id,
          is_primary: address.is_primary,
          type: address.type,
          street: address.street,
          country: address.country,
          country_levels: allEqual ? [] : mappCountrylevel,
          postal_code: address.postal_code,
          lon: address.lon,
          lat: address.lat,
          photo: address.photo?.map((photoObj: any) => photoObj?.response?.data ?? photoObj?.url),
          deleted: false,
        };
      }) ?? [];

    const purchasingPayload = objectIsEmpty(data?.purchasing) ? null : data?.purchasing;

    const invoicingPayload = objectIsEmpty(data?.invoicing) ? null : data?.invoicing;

    const mappingBank = data?.invoicing?.banks?.map((bank: any) => {
      delete bank.key;
      return bank;
    });

    delete data?.invoicing?.tax_type;
    delete data?.invoicing?.tax_code;

    const mappingInvoicing =
      invoicingPayload !== null
        ? {
            ...invoicingPayload,
            banks: mappingBank,
          }
        : null;

    const formData = {
      customer_id: "",
      company_id: companyCode,
      ...data,
      company: companyPayload,
      individu: individuPayload,
      contacts: contactsPayload,
      addresses: addressPayload,
      purchasing: purchasingPayload,
      invoicing: mappingInvoicing,
    };
    updateCustomer(formData);
  };

  if (isFetchingCustomer || isLoadingCustomer) {
    return (
      <Center>
        <Spin tip="Loading Data..." />
      </Center>
    );
  }

  return (
    <>
      <Col>
        <Row alignItems="center">
          <ArrowLeft style={{ cursor: "pointer" }} onClick={() => router.back()} />
          <Text variant="h4">{customerData?.name}</Text>
          <Spacer size={10} />
          <Radio
            value="company"
            checked={radioValue === "company"}
            onChange={(e: any) => {
              setRadioValue(e.target.value);
              SetActiveTab("Contacts");
            }}
          />
          Company
          <Spacer size={10} />
          <Radio
            value="individu"
            checked={radioValue === "individu"}
            onChange={(e: any) => {
              setRadioValue(e.target.value);
              SetActiveTab("Addresses");
            }}
          />
          Individu
        </Row>

        <Spacer size={10} />

        <Card>
          <Row justifyContent="space-between" alignItems="center" nowrap>
            <Controller
              control={control}
              name="status"
              defaultValue="Active"
              render={({ field: { onChange, value } }) => (
                <Dropdown
                  label=""
                  isHtml
                  width="185px"
                  noSearch
                  items={[
                    { id: "Active", value: '<div key="1" style="color:green;">Active</div>' },
                    { id: "Inactive", value: '<div key="2" style="color:red;">Inactive</div>' },
                  ]}
                  defaultValue={value}
                  handleChange={(value: any) => {
                    onChange(value);
                  }}
                />
              )}
            />

            <Row gap="16px">
              {listPermission?.filter((data: any) => data.viewTypes[0]?.viewType.name === "Delete")
                .length > 0 && (
                <Button
                  size="big"
                  variant="tertiary"
                  onClick={() => {
                    setShowDeleteModal(true);
                  }}
                >
                  Delete
                </Button>
              )}

              <Button
                size="big"
                variant="secondary"
                disabled={watchCustomerId !== ""}
                onClick={() => {
                  updateConvertCustomer();
                }}
              >
                {isLoadingConvertCustomer ? "Loading..." : " Convert to Customer"}
              </Button>
              {listPermission?.filter((data: any) => data.viewTypes[0]?.viewType.name === "Update")
                .length > 0 && (
                <Button size="big" variant="primary" onClick={handleSubmit(onSubmit)}>
                  {isLoadingUpdateCustomer ? "Loading..." : "Save"}
                </Button>
              )}
            </Row>
          </Row>
        </Card>

        <Spacer size={20} />

        <VendorContext.Provider
          value={{
            companyLogo,
            setCompanyLogo,
            selectFromForm,
            setSelectFromForm,
          }}
        >
          <FormProvider {...methods}>
            <Accordion>
              <Accordion.Item key={1}>
                <Accordion.Header variant="blue">General</Accordion.Header>
                <Accordion.Body>
                  <General type={radioValue} formType="edit" />
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

            <Spacer size={20} />

            <Accordion>
              <Accordion.Item key={1}>
                <Accordion.Header variant="blue">Detail Information</Accordion.Header>
                <Accordion.Body>
                  <Tabs
                    activeKey={activeTab}
                    defaultActiveKey={activeTab}
                    listTabPane={
                      radioValue === "company"
                        ? listTabItems
                        : listTabItems.slice(1, listTabItems.length)
                    }
                    onChange={(e: any) => SetActiveTab(e)}
                  />
                  <Spacer size={20} />
                  {renderTabItem(activeTab)}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </FormProvider>
        </VendorContext.Provider>
      </Col>

      {showDeleteModal && (
        <ModalDeleteConfirmation
          totalSelected={1}
          itemTitle={customerData.name}
          visible={showDeleteModal}
          isLoading={isLoadingDeleteCustomer}
          onCancel={() => setShowDeleteModal(false)}
          onOk={() => deleteCustomer({ ids: [customer_id] })}
        />
      )}
    </>
  );
}

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
`;
