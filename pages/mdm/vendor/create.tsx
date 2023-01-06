import Addresses from "components/pages/Vendor/Addresess/Addresses";
import Contacts from "components/pages/Vendor/Contacts/Contacts";
import General from "components/pages/Vendor/General/General";
import Invoicing from "components/pages/Vendor/Invoicing/Invoicing";
import Purchasing from "components/pages/Vendor/Purchasing/Purchasing";
import { VendorContext } from "context/VendorContext";
import { useCreateVendor } from "hooks/mdm/vendor/useVendor";
import { useRouter } from "next/router";
import { queryClient } from "pages/_app";
import { Accordion, Button, Col, Dropdown, Radio, Row, Spacer, Tabs, Text } from "pink-lava-ui";
import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import styled from "styled-components";

const listTabItems = [
  { title: "Contacts" },
  { title: "Addresses" },
  { title: "Purchasing" },
  { title: "Invoicing" },
];

const objectIsEmpty = (object: any) =>
  Object.keys(object).length === 0 && object.constructor === Object;

export default function VendorCreate() {
  const router = useRouter();
  const companyCode = localStorage.getItem("companyCode");

  const methods = useForm({
    defaultValues: {
      status: "Active",
      purchasing: {},
      invoicing: {},
      customer_id: "",
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
      case "Purchasing":
        return <Purchasing />;
      case "Invoicing":
        return <Invoicing />;
      default:
        return <Contacts />;
    }
  };

  const { mutate: createVendor, isLoading: isLoadingCreateVendor } = useCreateVendor({
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries(["vendors"]);
        router.back();
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
          is_primary: address.is_primary,
          type: address.type,
          street: address.street,
          country: address.country,
          country_levels: allEqual ? [] : mappCountrylevel,
          postal_code: address.postal_code,
          lon: address.lon,
          lat: address.lat,
          // Only get photo url
          photo: address.photo?.map((photoObj: any) => photoObj?.response?.data),
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

    createVendor(formData);
  };

  return (
    <Col>
      <Row alignItems="center">
        <Text variant="h4">Create Vendor</Text>
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
              {isLoadingCreateVendor ? "Loading..." : "Save"}
            </Button>
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
                <General type={radioValue} />
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
  );
}

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
`;
