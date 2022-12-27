import React, { useState } from "react";
import { Text, Col, Row, Spacer, Dropdown, Button, Accordion, Radio, Tabs } from "pink-lava-ui";
import styled from "styled-components";
import { useRouter } from "next/router";
import { useForm, Controller, FormProvider } from "react-hook-form";
import General from "components/pages/Customers/General/General";
import Contacts from "components/pages/Customers/Contacts/Contacts";
import Addresses from "components/pages/Customers/Addresess/Addresess";
import Purchasing from "components/pages/Customers/Purchasing/Purchasing";
import Invoicing from "components/pages/Customers/Invoicing/Invoicing";
import Sales from "components/pages/Customers/Sales/Sales";
import { queryClient } from "pages/_app";
import { useCreateCustomers } from "hooks/mdm/customers/useCustomersMDM";
import { CustomerContext } from "context/CustomerContext";

const listTabItems = [
  { title: "Contacts" },
  { title: "Addresses" },
  { title: "Sales" },
  { title: "Purchasing" },
  { title: "Invoicing" },
];

const objectIsEmpty = (object: any) =>
  Object.keys(object).length === 0 && object.constructor === Object;

export default function CustomerCreate() {
  const router = useRouter();
  const companyCode = localStorage.getItem("companyCode");

  const methods = useForm({
    defaultValues: {
      customer: {
        active_status: "Active",
      },
      purchasing: {},
      invoicing: {},
      sales: {},
    },
  });
  const { control, handleSubmit } = methods;

  const [activeTab, SetActiveTab] = useState("Contacts");
  const [radioValue, setRadioValue] = useState("company");
  const [companyLogo, setCompanyLogo] = useState("");
  const [selectFromForm, setSelectFromForm] = useState(false);

  const renderTabItem = (activeTab: any) => {
    switch (activeTab) {
      case "Contacts":
        return <Contacts formType="add" />;
      case "Addresses":
        return <Addresses formType="add" />;
      case "Sales":
        return <Sales />;
      case "Purchasing":
        return <Purchasing />;
      case "Invoicing":
        return <Invoicing />;
      default:
        return <Contacts />;
    }
  };

  const { mutate: createCustomer, isLoading: isLoadingCreateCustomer } = useCreateCustomers({
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries(["customer-list"]);
        router.back();
      },
    },
  });

  const onSubmit = (data: any) => {
    const customerPayload = {
      ...data.customer,
      company_logo: companyLogo,
      is_company: radioValue === "company",
    };

    const contactsPayload =
      data?.contact?.map((contact: any) => {
        delete contact?.filtered;
        delete contact?.key;
        return contact;
      }) ?? [];

    const addressPayload =
      data?.addresses?.map((address: any) => {
        const mappCountrylevel: any = [];

        mappCountrylevel[0] = address.province === "" ? 0 : address.province;
        mappCountrylevel[1] = address.city === "" ? 0 : address.city;
        mappCountrylevel[2] = address.district === "" ? 0 : address.district;
        mappCountrylevel[3] = address.zone === "" ? 0 : address.zone;

        // cek apakah array isinya semuanya 0
        // const allEqual = mappCountrylevel.every((value) => value === 0);

        return {
          is_primary: address.is_primary,
          address_type: address.type,
          street: address.street,
          country: address.country,
          postal_code: address.postal_code,
          longtitude: address.lon,
          latitude: address.lat,
          // Only get photo url
          // photo: address.photo?.map((photoObj: any) => photoObj?.response?.data),
        };
      }) ?? [];

    const purchasingPayload = objectIsEmpty(data?.purchasing) ? null : data?.purchasing;

    const invoicingPayload = objectIsEmpty(data?.invoicing) ? null : data?.invoicing;

    const salesPayload = objectIsEmpty(data?.sales) ? null : data?.sales;

    const mappingBank = data?.bank?.map((bank: any) => {
      delete bank.key;
      return bank;
    });

    // delete data?.invoicing?.tax_type;
    // delete data?.invoicing?.tax_code;

    // const mappingInvoicing =
    //   invoicingPayload !== null
    //     ? {
    //         ...invoicingPayload,
    //         banks: mappingBank,
    //       }
    //     : null;

    const formData = {
      ...data,
      customer: customerPayload,
      contact: contactsPayload,
      address: addressPayload,
      purchasing: purchasingPayload,
      invoicing: invoicingPayload,
      bank: mappingBank,
      sales: salesPayload,
    };

    console.log(formData);

    // createCustomer(formData);
  };

  return (
    <Col>
      <Row alignItems="center">
        <Text variant="h4">Create Customer</Text>
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
            name="customer.active_status"
            defaultValue="Active"
            render={({ field: { onChange, value } }) => (
              <Dropdown
                label=""
                width="185px"
                noSearch
                isHtml
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
            <Button size="big" variant="tertiary" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button size="big" variant="primary" onClick={handleSubmit(onSubmit)}>
              {isLoadingCreateCustomer ? "Loading..." : "Save"}
            </Button>
          </Row>
        </Row>
      </Card>

      <Spacer size={20} />

      <CustomerContext.Provider
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
                <General type={radioValue} />
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <Spacer size={20} />

          <Accordion style={{ display: "relative" }} id={"area2"}>
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
      </CustomerContext.Provider>
    </Col>
  );
}

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
`;
