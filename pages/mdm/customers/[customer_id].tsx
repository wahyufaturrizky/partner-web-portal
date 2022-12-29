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
  Lozenge,
  Modal,
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
import { useConvertToCustomer } from "hooks/mdm/vendor/useVendor";
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
import { ICSuccessCheck } from "assets";

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
      customer_id: "",
      customer: {
        name: "",
        customer_group: 1,
        mobile: "",
        phone: "",
        language: "",
        tax_number: "",
        email: "",
        external_code: "",
        ppkp: false,
        active_status: "ACTIVE",
        website: "",
        is_company: true,
      },
      contact: [],
      address: [],
      bank: [],
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
  const [showSuccessConvertModal, setShowSuccessConvertModal] = useState<any>({
    visible: false,
    data: {},
  });

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
        return <Invoicing formType="edit" />;
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
          // setValue("customer_id", data);
          // setSelectFromForm(false);
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
        setRadioValue(data?.isCompany ? "company" : "individu");

        // General Form
        // setValue("customer_id", data.customerId);
        setValue("customer.active_status", data?.activeStatus);
        setValue("customer.name", data?.name);
        setValue("customer.tax_number", data?.taxNumber);
        setValue("customer.website", data?.website);
        setValue("customer.phone", data?.phone);
        setValue("customer.mobile", data?.mobile);
        setValue("customer.email", data?.email);
        setValue("customer.external_code", data?.externalCode);
        setValue("customer.ppkp", data?.ppkp);
        setValue("customer.language", data?.language);
        setValue("customer.customer_group", data?.customerGroup);
        setValue("customer.is_company", data?.isCompany);
        setCompanyLogo(data?.companyLogo);

        // Contact Form
        const mappingContact = data?.customerContacts?.map((contact: any) => ({
          id: contact.id,
          filtered: false,
          is_primary: contact.isPrimary,
          tittle: contact.tittle,
          name: contact.name,
          role: contact.role,
          mobile: contact.mobile,
          email: contact.email,
          nik: contact.nik,
          deleted: false,
        }));

        setValue("contact", mappingContact);

        // Address Form
        const mappingAddress = data?.customerAddresses?.map((address: any) => ({
          id: address.id,
          is_primary: address.isPrimary,
          type: address.addressType,
          street: address.street,
          country: address.country,
          province: address.lvl1 === 0 ? null : address.lvl1,
          city: address.lvl2 === 0 ? null : address.lvl2,
          district: address.lvl3 === 0 ? null : address.lvl3,
          zone: address.lvl4 === 0 ? null : address.lvl4,
          postal_code: address.postalCode,
          lon: address.longtitude,
          lat: address.latitude,
          // sementara di BE masih handle 1 Array
          image: [
            {
              uid: `-${1}`,
              name: address?.image?.substring(address?.image?.lastIndexOf("/") + 1),
              status: "done",
              url: address?.image,
            },
          ],
          // Pakai ini kalau sudah diterapin multiple upload
          // photo: address.image.map((photoUrl: any, index: any) => ({
          //   uid: `-${index + 1}`,
          //   name: photoUrl?.substring(photoUrl.lastIndexOf("/") + 1),
          //   status: "done",
          //   url: photoUrl,
          // })),
          deleted: false,
        }));

        setValue("address", mappingAddress);

        // Sales Form
        const mappingSales = {
          branch: data?.customerSales?.branch,
          salesman: data?.customerSales?.salesman,
          term_payment: data?.customerSales?.termPayment,
          sales_order_blocking: data?.customerSales?.salesOrderBlocking,
          billing_blocking: data?.customerSales?.billingBlocking,
          delivery_order_blocking: data?.customerSales?.deliveryOrderBlocking,
        };

        setValue("sales", mappingSales);

        // Purchasing Form
        const mappingPurchasing = {
          term_of_payment: data?.customerPurchasing?.termOfPayment,
        };

        setValue("purchasing", mappingPurchasing);

        // Invoicing Form
        const mappingInvoicing = {
          credit_limit: data?.customerInvoicing?.creditLimit,
          credit_balance: data?.customerInvoicing?.creditBalance,
          credit_used: data?.customerInvoicing?.creditUsed,
          income_account: data?.customerInvoicing?.incomeAccount,
          expense_account: data?.customerInvoicing?.expenseAccount,
          tax_name: data?.customerInvoicing?.taxName,
          tax_city: data?.customerInvoicing?.taxCity,
          tax_address: data?.customerInvoicing?.taxAddress,
          currency: data?.customerInvoicing?.currency,
        };

        setValue("invoicing", mappingInvoicing);

        const mappingBank = data?.customerBanks?.map((el: any) => {
          return {
            id: el.id,
            bank_name: el.bankName,
            account_number: el.accountNumber,
            account_name: el.accountName,
          };
        });

        setValue("bank", mappingBank);
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

    // Contact Payload
    let mappingContacts: any = [];

    data?.contact?.forEach((contact: any) => {
      if (contact.id !== 0) {
        mappingContacts.push({
          id: contact.id,
          tittle: contact.tittle,
          name: contact.name,
          role: contact.role,
          mobile: contact.mobile,
          email: contact.email,
          nik: contact.nik,
          isPrimary: contact.isPrimary,
        });
      }
    });

    let mappingAddContacts: any = [];

    data?.contact?.forEach((contact: any) => {
      if (contact.id === 0) {
        mappingAddContacts.push({
          tittle: contact.tittle,
          name: contact.name,
          role: contact.role,
          mobile: contact.mobile,
          email: contact.email,
          nik: contact.nik,
          isPrimary: contact.isPrimary,
        });
      }
    });

    // Address Payload
    let mappingAddress: any = [];

    data?.address?.forEach((address: any) => {
      if (address?.id !== 0) {
        let level_1 = address.province === "" ? 0 : address.province;
        let level_2 = address.city === "" ? 0 : address.city;
        let level_3 = address.district === "" ? 0 : address.district;
        let level_4 = address.zone === "" ? 0 : address.zone;

        mappingAddress.push({
          id: address.id,
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
          image:
            address.image?.map((photoObj: any) => photoObj?.response?.data ?? photoObj?.url)[0] ??
            "",
          // Pakai ini kalau response sudah array
          // image: address.image?.map((photoObj: any) => photoObj?.response?.data ?? photoObj?.url),
        });
      }
    });

    let mappingAddAddress: any = [];

    data?.address?.forEach((address: any) => {
      if (address?.id !== 0) {
        let level_1 = address.province === "" ? 0 : address.province;
        let level_2 = address.city === "" ? 0 : address.city;
        let level_3 = address.district === "" ? 0 : address.district;
        let level_4 = address.zone === "" ? 0 : address.zone;

        mappingAddAddress.push({
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
          image:
            address.image?.map((photoObj: any) => photoObj?.response?.data ?? photoObj?.url)[0] ??
            "",
          // Pakai ini kalau response sudah array
          // image: address.image?.map((photoObj: any) => photoObj?.response?.data ?? photoObj?.url),
        });
      }
    });

    // Purchasing Payload
    const purchasingPayload = objectIsEmpty(data?.purchasing) ? null : data?.purchasing;

    // Invoicing Payload
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

    // Sales Payload
    const salesPayload = objectIsEmpty(data?.sales) ? null : data?.sales;

    // Bank Payload
    let mappingBank: any = [];

    data?.bank?.forEach((bank: any) => {
      if (bank.id !== 0) {
        mappingBank.push({
          id: bank.id,
          bank_name: bank.bank_name,
          account_number: bank.account_number,
          account_name: bank.account_name,
        });
      }
    }) ?? [];

    let mappingAddBank: any = [];

    data?.bank?.forEach((bank: any) => {
      if (bank.id === 0) {
        mappingAddBank.push({
          id: bank.id,
          bank_name: bank.bank_name,
          account_number: bank.account_number,
          account_name: bank.account_name,
        });
      }
    });

    const formData = {
      ...data,
      customer: customerPayload,
      contact: mappingContacts,
      address: mappingAddress,
      purchasing: purchasingPayload,
      invoicing: invoicingPayload,
      bank: mappingBank,
      sales: salesPayload,
      add_bank: mappingAddBank,
      add_contact: mappingAddContacts,
      add_address: mappingAddAddress,
      del_contacts: [],
      del_bank: [],
      del_address: [],
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
          <Lozenge variant="blue">
            <Row alignItems="center">{customerData?.registrationStatus}</Row>
          </Lozenge>
          {/* <Radio
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
              name="customer.active_status"
              defaultValue="ACTIVE"
              render={({ field: { onChange, value } }) => (
                <Dropdown
                  label=""
                  isHtml
                  width="185px"
                  noSearch
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
                disabled={!customerData?.vendor}
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

      {showSuccessConvertModal.visible && (
        <Modal
          centered
          width={432}
          closable={false}
          visible={showSuccessConvertModal.visible}
          onCancel={() => setShowSuccessConvertModal({ visible: false, data: {} })}
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
                  Vendor ID {showSuccessConvertModal?.data?.id} has been successfully converted
                </Text>

                <Spacer size={24} />

                <Row alignItems="center" justifyContent="space-between">
                  <Button
                    size="big"
                    variant={"tertiary"}
                    key="submit"
                    type="primary"
                    onClick={() => setShowSuccessConvertModal({ visible: false, data: {} })}
                  >
                    Cancel
                  </Button>

                  <Button
                    size="big"
                    key="submit"
                    type="primary"
                    onClick={() => router.push(`/mdm/vendor/${showSuccessConvertModal?.data?.id}`)}
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
