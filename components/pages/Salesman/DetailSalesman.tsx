import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  Accordion,
  Dropdown,
  Spacer,
  Modal,
  Text,
  Row,
  Table,
  Button,
  TextArea,
} from "pink-lava-ui";
import styled from "styled-components";
import usePagination from "@lucasmogari/react-pagination";

import ArrowLeft from "assets/icons/arrow-left.svg";
import { ModalConfirmation } from "components/elements/Modal/ModalConfirmation";
import { useFetchDetailSalesman, useUpdateSalesman } from "hooks/mdm/salesman/useSalesman";
import { useFetchSalesmanDivision } from "hooks/mdm/salesman/useSalesmanDivision";
import { dropdownStatus } from "./constants";
import ContentDetailCustomer from "./fragments/ContentDetailCustomers";
import ActionButton from "./fragments/ActionButton";
import Forms from "./fragments/Forms";

export default function ComponentDetailSalesman({ listCustomers, isLoading }: any) {
  const router = useRouter();
  const { status, salesman_id, name, idCard, division: queryDivision }: any = router.query || {};
  const [search, setSearch] = useState<string>("");
  const [division, setDivision] = useState("");
  const [remarks, setRemarks] = useState("");
  const [modalCustomer, setModalCustomer] = useState<any>({
    visible: false,
    data: {},
  });
  const [modalActive, setModalActive] = useState("");
  const [modal, setModal] = useState({
    visible: false,
    confirmation: false,
    reason: false,
  });
  const [modalConfirmation, setModalConfirmation] = useState<any>({
    Active: false,
    Inactive: false,
    Approve: false,
    Rejected: false,
    Waiting: false,
  });

  const { data } = useFetchDetailSalesman({
    id: salesman_id,
    options: {
      onSuccess: (response: any) => {
        setDivision(response?.division);
      },
    },
  });

  const { data: listSalesDivision } = useFetchSalesmanDivision({
    options: { onSuccess: () => {} },
    query: {
      search,
    },
  });

  const { mutate: handleUpdateSalesman } = useUpdateSalesman({
    options: {
      onSuccess: () => {
        router.push("/salesman");
      },
    },
    id: salesman_id,
  });

  const columns = [
    {
      title: "Customer",
      dataIndex: "name",
      width: "80%",
    },
    {
      title: "Action",
      render: (items: any) => (
        <Button
          size="small"
          variant="tertiary"
          onClick={() => setModalCustomer({ ...modalCustomer, visible: true, data: items })}
        >
          View Detail
        </Button>
      ),
    },
  ];

  let setDvs = status === "Waiting for Approval" ? data?.division : division;
  const payloads = {
    code: data?.code,
    company: data?.company,
    name: data?.name,
    division: data?.division,
    branch: data?.branch,
    mobile_number: data?.mobileNumber,
    email: data?.email,
    external_code: data?.externalCode,
    id_card: data?.idCard,
    status: 0,
    tobe: 0,
    remark: "",
  };

  const setActionButton = () => {
    switch (status) {
      case "Active" || "Inactive" || "Rejected":
        return (
          <ActionButton
            status={status}
            onSubmit={_handleUpdateSalesman}
            isDisabled={payloads?.code?.length > 1}
            onCancel={() => router.back()}
          />
        );
      case "Waiting for Approval":
        return (
          <ActionButton
            status={status}
            onSubmit={_handleUpdateSalesman}
            isDisabled={payloads?.code?.length > 1}
            onReject={() => setModalConfirmation({ ...modalConfirmation, Rejected: true })}
          />
        );
      case "Draft":
        return (
          <ActionButton
            isDisabled={payloads?.code?.length > 1}
            onSubmit={_handleUpdateSalesman}
            status={status}
            onCancel={() => router.back()}
            onDraft={_handleDraftedSalesman}
          />
        );
      default:
        return (
          <ActionButton
            isDisabled={payloads?.code?.length > 1}
            status={status}
            onCancel={() => router.back()}
          />
        );
    }
  };

  const _handleUpdateSalesman = () => {
    const stt = status === "Draft" ? 2 : 0;
    const setTobe = status === "Waiting for Approval" ? -1 : 0;
    const dataUpdated: any = {
      ...payloads,
      division: setDvs,
      status: stt,
      tobe: setTobe,
    };

    handleUpdateSalesman(dataUpdated);
  };

  const _handleDraftedSalesman = () => {
    const dataUpdated: any = {
      ...payloads,
      division: division,
      status: 4,
      tobe: -1,
    };

    handleUpdateSalesman(dataUpdated);
  };

  const setColorStatus = () => {
    switch (status) {
      case "Waiting for Approval":
        return "#FFB400";
      case "Rejected":
        return "#ED1C24";
      case "Draft":
        return "#00000";
    }
  };

  const onhandleSwitchStatus = () => {
    const dataUpdated: any = {
      ...payloads,
      division,
      status: 2,
      tobe: modalActive === "Active" ? 1 : 0,
      remark: remarks,
    };
    handleUpdateSalesman(dataUpdated);
  };

  const onhandleRejected = () => {
    const dataUpdated: any = {
      ...payloads,
      division: setDvs,
      remark: remarks,
      status: 3,
      tobe: -1,
    };
    return handleUpdateSalesman(dataUpdated);
  };

  return (
    <div>
      <Row gap="4px" alignItems="center">
        <ArrowLeft style={{ cursor: "pointer" }} onClick={() => router.back()} />
        <Text variant="h4">
          {name} - {idCard}
        </Text>
      </Row>
      <Spacer size={30} />
      <Card>
        <Row justifyContent="space-between">
          {status === "Active" || status === "Inactive" ? (
            <Dropdown
              label={false}
              width="185px"
              noSearch
              items={dropdownStatus}
              defaultValue={status}
              placeholder="Select"
              handleChange={(value: any) => {
                setModalActive(value);
                setModal({
                  ...modal,
                  visible: true,
                  confirmation: true,
                  reason: false,
                });
              }}
            />
          ) : (
            <StatusCustomer color={setColorStatus()}>{status}</StatusCustomer>
          )}
          {setActionButton()}
        </Row>
      </Card>
      <Spacer size={30} />
      <Card>
        <Accordion>
          <Accordion.Item key={1}>
            <Accordion.Header variant="blue">General</Accordion.Header>
            <Accordion.Body>
              <Forms
                queryDivision={queryDivision}
                forms={data}
                salesDivision={listSalesDivision?.rows || []}
                status={status}
                setDivision={setDivision}
                setSearch={setSearch}
              />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Card>
      <Spacer size={30} />
      <Card>
        <Accordion>
          <Accordion.Item key={1}>
            <Accordion.Header variant="blue">Customer</Accordion.Header>
            <Accordion.Body>
              <Spacer size={20} />
              <TextWarning> *Auto added from Customer</TextWarning>
              <Spacer size={20} />
              <Table loading={isLoading} columns={columns} data={listCustomers} />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Card>

      {modal.visible && (
        <ModalConfirmation
          title={modal.reason ? `Add Reason ${modalActive}` : "Confirmation"}
          visible={modal.visible}
          content={[
            modal.confirmation === true && modal.reason === false ? (
              <>
                <TextConfirmation>
                  Are you sure to {modalActive} this salesman?
                  <Spacer size={30} />
                </TextConfirmation>
              </>
            ) : (
              <>
                <Spacer size={20} />
                <TextArea
                  rows={5}
                  label={false}
                  placeholder="type here..."
                  onChange={({ target }: any) => setRemarks(target.value)}
                />
                <Spacer size={20} />
              </>
            ),
          ]}
          onOk={() =>
            modal.reason
              ? onhandleSwitchStatus()
              : setModal({
                  ...modal,
                  visible: true,
                  confirmation: false,
                  reason: true,
                })
          }
          variantBtnLeft={status === "Waiting For Approval" ? "tertiary" : "secondary"}
          onCancel={() =>
            setModal({
              ...modal,
              confirmation: false,
              visible: false,
              reason: false,
            })
          }
        />
      )}

      {/* modal confirmation rejected */}
      {modalConfirmation.Rejected && (
        <ModalConfirmation
          title="Are you sure to reject?"
          visible={modalConfirmation.Rejected}
          content={[
            <>
              <Spacer size={20} />
              <TextArea
                rows={5}
                label={false}
                placeholder="Write your remarks here..."
                onChange={({ target }: any) => setRemarks(target.value)}
              />
              <Spacer size={20} />
            </>,
          ]}
          onOk={onhandleRejected}
          variantBtnLeft={status === "waiting" ? "tertiary" : "secondary"}
          onCancel={() => setModalConfirmation({ ...modalConfirmation, Rejected: false })}
        />
      )}

      {/* modal view detail customers */}
      {modalCustomer.visible && (
        <Modal
          width={1100}
          visible={modalCustomer.visible}
          title={modalCustomer?.data?.name}
          onCancel={() => setModalCustomer({ visible: false, data: {} })}
          footer={
            <Row justifyContent="end">
              <Button onClick={() => window.open(`/customers/${modalCustomer?.data?.id}`)}>
                Open Customer Page
              </Button>
            </Row>
          }
          content={<ContentDetailCustomer customerId={modalCustomer?.data?.id} />}
        />
      )}
    </div>
  );
}

const Card = styled.div`
  background: #ffff;
  padding: 1rem;
  border-radius: 16px;
`;

const TextConfirmation = styled.p`
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
`;

const TextWarning = styled.p`
  color: #ffb400;
  font-weight: 600;
  font-size: 16px;
`;

const StatusCustomer = styled.p`
  color: ${({ color }: any) => color};
  font-weight: 600;
  border: 1px solid #aaaaaa;
  border-radius: 8px;
  margin: 0;
  text-align: center;
  display: flex;
  padding: 0 1rem;
  align-items: center;
`;
