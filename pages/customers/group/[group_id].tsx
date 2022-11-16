import React, { useState } from "react";
import {
  Text,
  Col,
  Row,
  Spacer,
  Dropdown,
  Button,
  Accordion,
  Input,
  Spin,
  Table,
} from "pink-lava-ui";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { queryClient } from "../../_app";
import { ModalDeleteConfirmation } from "../../../components/elements/Modal/ModalConfirmationDelete";
import ArrowLeft from "../../../assets/icons/arrow-left.svg";
import {
  useCustomerGroupMDM,
  useDeleteCustomerGroupMDM,
  useParentCustomerGroupMDM,
  useUpdateCustomerGroupMDM,
} from "../../../hooks/mdm/customers/useCustomersGroupMDM";

const CustomerGroupDetail = () => {
  const router = useRouter();
  const companyId = localStorage.getItem("companyId")
  const companyCode = localStorage.getItem("companyCode")
  const { group_id: id } = router.query;

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { register, handleSubmit, setValue } = useForm({
    defaultValues: { parent: "" },
  });

  const {
    data: customerGroupData,
    isLoading: isLoadingCustomerGroup,
    isFetching: isFetchingCustomerGroup,
  } = useCustomerGroupMDM({
    id: id,
    options: {
      onSuccess: (data: any) => { },
    },
  });

  const { mutate: updateCreateCustomerGroup, isLoading: isLoadingUpdateCreateCustomerGroup } =
    useUpdateCustomerGroupMDM({
      id: id,
      options: {
        onSuccess: () => {
          router.back();
          queryClient.invalidateQueries(["customer-group"]);
        },
      },
    });

  const { mutate: deleteCustomerGroup, isLoading: isLoadingDeleteCustomerGroup } =
    useDeleteCustomerGroupMDM({
      options: {
        onSuccess: () => {
          queryClient.invalidateQueries(["customer-group"]);
          setShowDeleteModal(false);
          router.back();
        },
      },
    });

  const {
    data: dataParentCustomerGroupMDM,
    isLoading: isLoadingParentCustomerGroupMDM,
    isFetching: isFetchingParentCustomerGroupMDM,
  } = useParentCustomerGroupMDM({
    id: Number(id) + `/${companyCode}`,
    options: {
      onSuccess: (data: any) => { },
    },
  });

  const onSubmit = (data: any) => {
    updateCreateCustomerGroup({ ...data, company: companyCode });
  };

  if (
    isLoadingCustomerGroup ||
    isFetchingCustomerGroup ||
    isLoadingParentCustomerGroupMDM ||
    isFetchingParentCustomerGroupMDM
  )
    return (
      <Center>
        <Spin tip="Loading data..." />
      </Center>
    );

  const columnsCustomer = [
    {
      title: "Customer",
      dataIndex: "customer",
    },
    {
      title: "Action",
      dataIndex: "action",
      width: "15%",
    },
  ];

  const paginateFieldCustomer = [
    {
      key: 1,
      id: 1,
      customer: "PT. Indomarco Jaya",
      action: (
        <div style={{ display: "flex", justifyContent: "left" }}>
          <Button size="small" onClick={() => { }} variant="tertiary">
            View Detail
          </Button>
        </div>
      ),
    },
    {
      key: 2,
      id: 2,
      customer: "PT. Alfamart ",
      action: (
        <div style={{ display: "flex", justifyContent: "left" }}>
          <Button size="small" onClick={() => { }} variant="tertiary">
            View Detail
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Col>
        <Row gap="4px">
          <ArrowLeft style={{ cursor: "pointer" }} onClick={() => router.back()} />
          <Text variant={"h4"}>{customerGroupData.name}</Text>
        </Row>

        <Spacer size={20} />

        <Card padding="20px">
          <Row justifyContent="flex-end" alignItems="center" nowrap>
            <Row gap="16px">
              <Button size="big" variant={"tertiary"} onClick={() => setShowDeleteModal(true)}>
                Delete
              </Button>
              <Button size="big" variant={"primary"} onClick={handleSubmit(onSubmit)}>
                {isLoadingUpdateCreateCustomerGroup ? "Loading..." : "Save"}
              </Button>
            </Row>
          </Row>
        </Card>

        <Spacer size={20} />

        <Accordion>
          <Accordion.Item key={1}>
            <Accordion.Header variant="blue">General</Accordion.Header>
            <Accordion.Body>
              <Row width="100%" noWrap>
                <Col width={"100%"}>
                  <Input
                    width="100%"
                    label="Name"
                    height="40px"
                    required
                    placeholder={"e.g RTL-Retail Large"}
                    defaultValue={customerGroupData.name}
                    {...register("name", {
                      shouldUnregister: true,
                    })}
                  />
                </Col>
                <Spacer size={10} />

                <Col width="100%">
                  {isLoadingParentCustomerGroupMDM ? (
                    <Spin tip="Loading data..." />
                  ) : (
                    <>
                      <Dropdown
                        label="Parent"
                        isOptional
                        width="100%"
                        defaultValue={customerGroupData.parent}
                        items={dataParentCustomerGroupMDM.map((data) => ({
                          value: data.name,
                          id: data.code,
                        }))}
                        placeholder={"Select"}
                        handleChange={(text) => setValue("parent", text)}
                        noSearch
                      />

                      <Spacer size={14} />
                    </>
                  )}
                </Col>
              </Row>

              <Row width="50%" noWrap>
                <Input
                  width="100%"
                  label="External Code"
                  height="48px"
                  required
                  defaultValue={customerGroupData.externalCode}
                  placeholder={"e.g 400000"}
                  {...register("external_code", {
                    shouldUnregister: true,
                  })}
                />
              </Row>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <Spacer size={20} />

        <Accordion>
          <Accordion.Item key={1}>
            <Accordion.Header variant="blue">Associated Customer</Accordion.Header>
            <Accordion.Body>
              <Text variant="headingRegular" color="cheese.darkest">
                *Auto added from Customer
              </Text>

              <Spacer size={20} />

              <Table columns={columnsCustomer} data={paginateFieldCustomer} />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Col>

      {showDeleteModal && (
        <ModalDeleteConfirmation
          totalSelected={1}
          itemTitle={customerGroupData.name}
          visible={showDeleteModal}
          isLoading={isLoadingDeleteCustomerGroup}
          onCancel={() => setShowDeleteModal(false)}
          onOk={() => deleteCustomerGroup({ ids: [id], company_id: companyCode })}
        />
      )}
    </>
  );
};

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: ${(p: any) => (p.padding ? p.padding : "16px")};
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Label = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  color: #000000;
`;

export default CustomerGroupDetail;
