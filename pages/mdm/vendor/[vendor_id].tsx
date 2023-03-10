import ArrowLeft from "assets/icons/arrow-left.svg";
import { ModalDeleteConfirmation } from "components/elements/Modal/ModalConfirmationDelete";
import Addresses from "components/pages/Vendor/Addresess/Addresses";
import Contacts from "components/pages/Vendor/Contacts/Contacts";
import General from "components/pages/Vendor/General/General";
import Invoicing from "components/pages/Vendor/Invoicing/Invoicing";
import Purchasing from "components/pages/Vendor/Purchasing/Purchasing";
import { VendorContext } from "context/VendorContext";
import {
  useConvertToCustomer,
  useDeleteVendor,
  useUpdateVendor,
  useVendor,
} from "hooks/mdm/vendor/useVendor";
import { useUserPermissions } from "hooks/user-config/usePermission";
import { useRouter } from "next/router";
import { queryClient } from "pages/_app";
import { Accordion, Button, Col, Dropdown, Row, Spacer, Spin, Tabs, Text } from "pink-lava-ui";
import { useState } from "react";
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form";
import styled from "styled-components";

const listTabItems = [
  { title: "Contacts" },
  { title: "Addresses" },
  { title: "Purchasing" },
  { title: "Invoicing" },
];

const objectIsEmpty = (object: any) =>
  Object.keys(object).length === 0 && object.constructor === Object;

export default function VendorDetail() {
  const router = useRouter();
  const companyCode = localStorage.getItem("companyCode");

  const { vendor_id } = router.query;

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
      valid_until: "",
      external_code: "",
      is_pkp: false,
      company: {
        website: "",
        logo: "",
      },
      individu: {
        job: 0,
        // company: "",
        title: "",
      },
      contacts: [],
      addresses: [],
      purchasing: {},
      invoicing: {},
    },
  });
  const { control, handleSubmit, setValue } = methods;

  const [activeTab, SetActiveTab] = useState("Contacts");
  const [radioValue, setRadioValue] = useState("company");
  const [companyLogo, setCompanyLogo] = useState("/placeholder-employee-photo.svg");
  const [selectFromForm, setSelectFromForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: dataUserPermission, isLoading: isLoadingUserPermissions } = useUserPermissions({
    options: {
      onSuccess: () => {},
    },
  });

  const listPermission = dataUserPermission?.permission?.filter(
    (filtering: any) => filtering.menu === "Vendor"
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
      case "Invoicing":
        return <Invoicing />;
      default:
        return <Contacts />;
    }
  };

  const { mutate: updateVendor, isLoading: isLoadingUpdateVendor } = useUpdateVendor({
    id: vendor_id,
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries(["vendors"]);
        router.back();
      },
    },
  });

  const { mutate: updateConvertCustomer, isLoading: isLoadingConvertCustomer } =
    useConvertToCustomer({
      id: vendor_id,
      options: {
        onSuccess: (data: any) => {
          setValue("customer_id", data);
          setSelectFromForm(false);
        },
      },
    });

  const { mutate: deleteVendor, isLoading: isLoadingDeleteVendor }: any = useDeleteVendor({
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries(["vendors"]);
        setShowDeleteModal(false);
        router.back();
      },
    },
  });

  const { data: vendorData, isLoading: isLoadingVendor } = useVendor({
    id: vendor_id,
    options: {
      onSuccess: (data: any) => {
        setSelectFromForm(data?.customerId === "");
        setRadioValue(data?.type?.toLowerCase());

        // General Form
        setValue("valid_until", data.validUntil);
        setValue("customer_id", data.customerId);
        setValue("status", data?.status);
        setValue("name", data?.name);
        setValue("group", data?.group);
        setValue("company.website", data?.companyWebsite);
        setCompanyLogo(data?.companyLogo);
        setValue("individu.job", data?.personalJob);
        setValue("individu.title", data?.personalTitle);
        // setValue("individu.company", data?.personalCompany);
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
        const mappingBank = data?.invoicing?.banks?.map((bank: any) => ({
          bank: bank.bank,
          account_name: bank.account_name,
          account_number: bank.account_number,
          deleted: false,
        }));

        const mappingInvoicing = {
          reconciliation_account: data?.invoicing?.reconciliationAccount,
          tax_country: data?.invoicing?.taxCountry,
          tax_name: data?.invoicing?.taxName,
          tax_address: data?.invoicing?.taxAddress,
          tax_type: data?.invoicing?.taxType,
          tax_code: data?.invoicing?.taxCode,
          currency: data?.invoicing?.currency,
          payment_method: data?.invoicing?.paymentMethods ?? [],
          banks: mappingBank,
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
            // company: data?.individu?.company ?? "",
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
    updateVendor(formData);
  };

  if (isLoadingVendor || isLoadingConvertCustomer || isLoadingUserPermissions) {
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
          <Text variant="h4">{vendorData?.name}</Text>
          {/* <Spacer size={10} />
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
          Individu */}
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
                  {isLoadingUpdateVendor ? "Loading..." : "Save"}
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
          itemTitle={vendorData.name}
          visible={showDeleteModal}
          isLoading={isLoadingDeleteVendor}
          onCancel={() => setShowDeleteModal(false)}
          onOk={() => deleteVendor({ ids: [vendor_id] })}
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
