import React, { useState, useMemo } from "react";
import {
  Text, Col, Row, Spacer, Button, Input, EmptyState, Modal,
} from "pink-lava-ui";
import styled from "styled-components";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { arrayMove } from "@dnd-kit/sortable";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { lang } from "lang";
import { permissionTermOfPayment } from "permission/term-of-payment";
import { usePartnerConfigPermissionLists } from "hooks/user-config/usePermission";
import { useUserPermissions } from "hooks/user-config/useUser";
import DraggableTable from "../../../components/pages/TermOfPayment/DraggableTable";
import ModalAddTerm from "../../../components/elements/Modal/ModalAddTerm";
import { queryClient } from "../../_app";
import {
  useCreateTermOfPayment,
  useTopForm,
} from "../../../hooks/mdm/term-of-payment/useTermOfPayment";

const TermOfPaymentCreate = () => {
  const t = localStorage.getItem("lan") || "en-US";
  const router = useRouter();
  const companyId = localStorage.getItem("companyId");
  const companyCode = localStorage.getItem("companyCode");
  const [showTermForm, setShowTermForm] = useState({ type: "", open: false, data: {} });
  const [showDisableTerm, setShowDisableTerm] = useState(false);
  const [termList, setTermList] = useState<any[]>([]);

  const { register, handleSubmit } = useForm();

  const { mutate: createTermOfPayment, isLoading: isLoadingTermOfPayment } = useCreateTermOfPayment(
    {
      options: {
        onSuccess: () => {
          router.back();
          queryClient.invalidateQueries(["top-list"]);
        },
      },
    },
  );

  const {
    data: topDataForm,
    isLoading: isLoadingTopForm,
    isFetching: isFetchingTopForm,
  } = useTopForm({
    options: {
      onSuccess: (data: any) => {},
      select: (data: any) => {
        const paymentTypeList = data?.paymentType?.map((element: any) => ({
          label: element.name,
          value: element.id,
        }));

        const optionsList = data?.options?.map((element: any) => ({
          label: element.name,
          value: element.id,
        }));

        return { paymentTypeList, optionsList };
      },
    },
  });

  /** Key Identifier untuk sortable array ketika di drag */
  const keyItems = useMemo(() => termList.map(({ key }) => key), [termList]);

  const onHandleDrag = (activeId: any, overId: any) => {
    setTermList((data) => {
      const oldIndex = keyItems.indexOf(activeId);
      const newIndex = keyItems.indexOf(overId);
      const changeSequenceTermList = arrayMove(data, oldIndex, newIndex).map((el, index) => ({
        ...el,
        index,
      }));

      return changeSequenceTermList;
    });
  };

  const saveTermList = (data: any) => {
    if (showTermForm.type === "add") {
      setTermList((prevList) => {
        const mappedTermList = {
          key: `${termList.length}`,
          index: termList.length,
          type: data.type,
          value: data.type === 1 ? 0 : data.value,
          option: data.option,
          optionValue: data.option_value,
        };

        return [...prevList, mappedTermList];
      });
      setShowTermForm({ type: "", open: false, data: {} });
    } else {
      setTermList((prevList) => {
        const mappedTermList = prevList.map((el: any, index: any) => {
          if (showTermForm.data?.key === el.key) {
            return {
              ...el,
              type: data.type,
              value: data.type === 1 ? 0 : data.value,
              option: data.option,
              optionValue: data.option_value,
            };
          }
          return el;
        });
        return mappedTermList;
      });
      setShowTermForm({ type: "", open: false, data: {} });
    }
  };

  const { data: dataUserPermission } = useUserPermissions({
    options: {
      onSuccess: () => {},
    },
  });

  const listPermission = dataUserPermission?.permission?.filter(
    (filtering: any) => filtering.menu === "Term Of Payment",
  );

  const checkUserPermission = (permissionGranted) => listPermission?.find(
    (data: any) => data?.viewTypes?.[0]?.viewType?.name === permissionGranted,
  );

  const onSubmit = (data: any) => {
    const mappedTermListRequest = termList.map((el: any) => ({
      type: el.type,
      value: el.value,
      option: el.option,
      option_value: el.optionValue,
    }));

    const formData = {
      company_id: companyCode,
      items: mappedTermListRequest,
      ...data,
    };

    createTermOfPayment(formData);
  };

  return (
    <>
      <Col>
        <Row gap="4px">
          <Text variant="h4">{lang[t].termOfPayment.modalTitleCreate.termOfPayment}</Text>
        </Row>

        <Spacer size={20} />

        <Card padding="20px">
          <Row justifyContent="flex-end" alignItems="center" nowrap>
            <Row gap="16px">
              <Button size="big" variant="tertiary" onClick={() => router.back()}>
                {lang[t].termOfPayment.tertier.cancel}
              </Button>
              {checkUserPermission("Create") && (
                <Button size="big" variant="primary" onClick={handleSubmit(onSubmit)}>
                  {isLoadingTermOfPayment ? "Loading..." : lang[t].termOfPayment.primary.save}
                </Button>
              )}
            </Row>
          </Row>
        </Card>

        <Spacer size={10} />

        <Card>
          <Col>
            <Row width="50%">
              <Input
                width="50%"
                label={lang[t].termOfPayment.paymentTerm}
                height="40px"
                placeholder="e.g 3 Days"
                {...register("name")}
              />
            </Row>

            <Spacer size={10} />

            <Row width="150px">
              {checkUserPermission("Create") && (
                <Button
                  size="small"
                  variant="tertiary"
                  onClick={() => {
                    const fileTypeOne = termList.filter((el) => el.type === 1);

                    if (fileTypeOne.length > 0) {
                      setShowDisableTerm(true);
                    } else {
                      setShowTermForm({ type: "add", open: true, data: {} });
                    }
                  }}
                >
                  + Add Terms
                </Button>
              )}
            </Row>

            <Spacer size={10} />

            {termList.length === 0 ? (
              <EmptyStateComponent />
            ) : (
              <DraggableTable
                termList={termList}
                isLoading={false}
                onDrag={onHandleDrag}
                onEdit={(data: any) => {
                  setShowTermForm({ type: "edit", open: true, data });
                }}
                onDelete={(data: any) => {
                  const filterTermList = termList.filter((term) => term.key !== data.key);

                  const mappedTermList = filterTermList.map((el, index) => ({
                    ...el,
                    index,
                  }));
                  setTermList(mappedTermList);
                }}
              />
            )}
          </Col>
        </Card>
      </Col>

      {showTermForm.open && (
        <ModalAddTerm
          formType={showTermForm.type}
          formData={showTermForm.data}
          visible={showTermForm.open}
          onCancel={() => setShowTermForm({ type: "", open: false, data: {} })}
          onSave={saveTermList}
          typeList={topDataForm?.paymentTypeList}
          optionList={topDataForm?.optionsList}
          isLoading={isLoadingTopForm || isFetchingTopForm}
        />
      )}

      {showDisableTerm && (
        <Modal
          width={350}
          centered
          visible={showDisableTerm}
          onCancel={() => setShowDisableTerm(false)}
          closable={false}
          title=""
          footer={<></>}
          content={(
            <>
              <Spacer size={14} />
              <Col justifyContent="center" alignItems="center">
                <Row justifyContent="center" alignItems="center">
                  <ExclamationCircleOutlined />
                  <Text variant="headingRegular">Info</Text>
                </Row>
                <Row>
                  <Text variant="caption" textAlign="center" color="grey.light">
                    You can't add more term, if payment type "Balance" already used.
                  </Text>
                </Row>
                <Button
                  variant="primary"
                  size="small"
                  full
                  onClick={() => setShowDisableTerm(false)}
                >
                  Close
                </Button>
              </Col>
            </>
          )}
        />
      )}
    </>
  );
};

const EmptyStateComponent = () => (
  <>
    <div
      style={{
        height: "50px",
        width: "100%",
        backgroundColor: "#f4f4f4",
        borderTopLeftRadius: "8px",
        borderTopRightRadius: "8px",
      }}
    />

    <Spacer size={10} />

    <EmptyState
      image="/icons/empty-state.svg"
      title="No Data Terms"
      subtitle="Press + add terms button to add new terms"
      height={325}
    />
  </>
);

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: ${(p: any) => (p.padding ? p.padding : "16px")};
`;

export default TermOfPaymentCreate;
