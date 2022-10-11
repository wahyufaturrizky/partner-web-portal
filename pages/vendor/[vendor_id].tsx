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
import { useForm, Controller, FormProvider } from "react-hook-form";
import General from "components/pages/Vendor/General/General";
import Contacts from "components/pages/Vendor/Contacts/Contacts";
import Addresses from "components/pages/Vendor/Addresess/Addresses";
import Purchasing from "components/pages/Vendor/Purchasing/Purchasing";
import Invoicing from "components/pages/Vendor/Invoicing/Invoicing";
import { useUpdateVendor, useVendor, useDeleteVendor } from "hooks/mdm/vendor/useVendor";
import { queryClient } from "pages/_app";

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

  const { vendor_id } = router.query;

  const methods = useForm({
    defaultValues: {
      status: "inactive",
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
      company: {},
      individu: {},
      contacts: [],
      addresses: [],
      purchasing: {},
      invoicing: {},
    },
  });
  const { control, handleSubmit } = methods;

  const [activeTab, SetActiveTab] = useState("Contacts");
  const [radioValue, setRadioValue] = useState("company");

  const renderTabItem = (activeTab: any) => {
    switch (activeTab) {
      case "Contacts":
        return <Contacts />;
      case "Addresses":
        return <Addresses />;
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

  const {
    data: vendorData,
    isLoading: isLoadingVendor,
    isFetching: isFetchingVendor,
  } = useVendor({
    id: vendor_id,
    options: {
      onSuccess: (data: any) => {},
    },
  });

  const onSubmit = (data: any) => {
    const companyPayload =
      radioValue === "company" ? { logo: "", website: data?.company?.website ?? "" } : null;

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
        return contact;
      }) ?? [];

    const addressPayload =
      data?.addresses?.map((address: any) => {
        return address;
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
      ...data,
      company: companyPayload,
      individu: individuPayload,
      contacts: contactsPayload,
      addresses: addressPayload,
      purchasing: purchasingPayload,
      invoicing: mappingInvoicing,
    };

    console.log("data", formData);
    // updateVendor(formData);
  };

  if (isFetchingVendor || isLoadingVendor)
    return (
      <Center>
        <Spin tip="Loading Data..." />
      </Center>
    );

  return (
    <Col>
      <Row alignItems={"center"}>
        <Text variant={"h4"}>Update Vendor</Text>
        <Spacer size={10} />
        <Radio
          value={"company"}
          checked={radioValue === "company"}
          onChange={(e: any) => {
            setRadioValue(e.target.value);
            SetActiveTab("Contacts");
          }}
        />
        Company
        <Spacer size={10} />
        <Radio
          value={"individu"}
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
            name={"status"}
            defaultValue={"inactive"}
            render={({ field: { onChange } }) => (
              <Dropdown
                label=""
                width="185px"
                noSearch
                items={[
                  { id: "active", value: "Active" },
                  { id: "inactive", value: "Inactive" },
                ]}
                defaultValue="inactive"
                handleChange={(value: any) => {
                  onChange(value);
                }}
              />
            )}
          />

          <Row gap="16px">
            <Button size="big" variant={"tertiary"} onClick={() => {}}>
              Delete
            </Button>
            <Button size="big" variant={"secondary"} onClick={() => {}}>
              Convert to Customer
            </Button>
            <Button size="big" variant={"primary"} onClick={handleSubmit(onSubmit)}>
              {isLoadingUpdateVendor ? "Loading..." : "Save"}
            </Button>
          </Row>
        </Row>
      </Card>

      <Spacer size={20} />

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
    </Col>
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
