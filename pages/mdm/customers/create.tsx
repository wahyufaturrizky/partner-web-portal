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
        active_status: "ACTIVE",
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
        return <Invoicing formType={"add"} />;
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
      company_id: companyCode,
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
      data?.address?.map((address: any) => {
        let level_1 = address.province === "" ? 0 : address.province;
        let level_2 = address.city === "" ? 0 : address.city;
        let level_3 = address.district === "" ? 0 : address.district;
        let level_4 = address.zone === "" ? 0 : address.zone;

        return {
          is_primary: address.is_primary,
          address_type: address.type,
          street: address.street,
          country: address.country,
          postal_code: address.postal_code,
          longtitude: address.lon,
          latitude: address.lat,
          lvl_1: level_1,
          lvl_2: level_2,
          lvl_3: level_3,
          lvl_4: level_4,
          // Only get photo url
          image: address.photo?.map((photoObj: any) => photoObj?.response?.data)[0] ?? "",
        };
      }) ?? [];

    const purchasingPayload = objectIsEmpty(data?.purchasing) ? null : data?.purchasing;

    const invoicingPayload = objectIsEmpty(data?.invoicing)
      ? null
      : {
          credit_limit: parseInt(data?.invoicing?.credit_limit ?? 0),
          credit_balance: parseInt(data?.invoicing?.credit_balance ?? 0),
          credit_used: parseInt(data?.invoicing?.credit_used ?? 0),
          income_account: data?.invoicing?.income_account ?? "",
          expense_account: data?.invoicing?.expense_account ?? "",
          tax_name: data?.invoicing?.tax_name ?? "",
          tax_city: data?.invoicing?.tax_city ?? "",
          tax_address: data?.invoicing?.tax_address ?? "",
          currency: data?.invoicing?.currency ?? "",
        };

    const salesPayload = objectIsEmpty(data?.sales) ? null : data?.sales;

    const mappingBank =
      data?.bank?.map((bank: any) => {
        delete bank.key;
        return bank;
      }) ?? [];

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

    createCustomer(formData);
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
            defaultValue="ACTIVE"
            render={({ field: { onChange, value } }) => (
              <Dropdown
                label=""
                width="185px"
                noSearch
                isHtml
                items={[
                  { id: "ACTIVE", value: '<div key="1" style="color:green;">Active</div>' },
                  { id: "INACTIVE", value: '<div key="2" style="color:red;">Inactive</div>' },
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
