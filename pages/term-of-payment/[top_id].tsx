import React, { useState, useMemo } from "react";
import { Text, Col, Row, Spacer, Button, Input, EmptyState, Modal, Spin } from "pink-lava-ui";
import styled from "styled-components";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import {
  useTermOfPayment,
  useUpdateTermOfPayment,
  useTopForm,
  useDeleteTermOfPayment,
} from "../../hooks/mdm/term-of-payment/useTermOfPayment";
import { arrayMove } from "@dnd-kit/sortable";
import { queryClient } from "../_app";
import ArrowLeft from "../../assets/icons/arrow-left.svg";
import { ModalDeleteConfirmation } from "../../components/elements/Modal/ModalConfirmationDelete";
import ModalAddTerm from "../../components/elements/Modal/ModalAddTerm";
import DraggableTable from "../../components/pages/TermOfPayment/DraggableTable";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { lang } from "lang";

const TermOfPaymentEdit = () => {
  const t = localStorage.getItem("lan") || "en-US";
  const router = useRouter();
  const { top_id } = router.query;

  const [showTermForm, setShowTermForm] = useState({ type: "", open: false, data: {} });
  const [showDisableTerm, setShowDisableTerm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [termList, setTermList] = useState<any[]>([]);
  const [removeList, setRemoveList] = useState<any[]>([]);

  const { register, handleSubmit } = useForm();

  const { mutate: updateTermOfPayment, isLoading: isLoadingUpdateTermOfPayment } =
    useUpdateTermOfPayment({
      id: top_id,
      companyId: "KSNI",
      options: {
        onSuccess: () => {
          router.back();
          queryClient.invalidateQueries(["top-list"]);
        },
      },
    });

  const { mutate: deleteBusinessProcess, isLoading: isLoadingDeleteBP } = useDeleteTermOfPayment({
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries(["top-list"]);
        setShowDeleteModal(false);
        router.back();
      },
    },
  });

  const {
    data: termOfPaymentData,
    isLoading: isLoadingTopData,
    isFetching: isFetchingTopData,
  } = useTermOfPayment({
    id: top_id,
    companyId: "KSNI",
    options: {
      onSuccess: (data: any) => {
        const mappedToListTermList = data.items.map((element: any, index: any) => {
          return {
            key: `${index}`,
            index,
            id: element.id,
            type: element.type,
            value: element.value,
            option: element.option,
            optionValue: element.optionValue,
          };
        });
        setTermList(mappedToListTermList);
      },
    },
  });

  const {
    data: topDataForm,
    isLoading: isLoadingTopForm,
    isFetching: isFetchingTopForm,
  } = useTopForm({
    options: {
      onSuccess: (data: any) => {},
      select: (data: any) => {
        const paymentTypeList = data?.paymentType?.map((element: any) => {
          return {
            label: element.name,
            value: element.id,
          };
        });

        const optionsList = data?.options?.map((element: any) => {
          return {
            label: element.name,
            value: element.id,
          };
        });

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
      const changeSequenceTermList = arrayMove(data, oldIndex, newIndex).map((el, index) => {
        return {
          ...el,
          index,
        };
      });

      return changeSequenceTermList;
    });
  };

  const saveTermList = (data: any) => {
    if (showTermForm.type === "add") {
      setTermList((prevList) => {
        const mappedTermList = {
          id: 0,
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
          } else {
            return el;
          }
        });
        return mappedTermList;
      });
      setShowTermForm({ type: "", open: false, data: {} });
    }
  };

  const onSubmit = (data: any) => {
    const mappedTermListRequest = termList.map((el: any) => {
      return {
        id: el.id,
        stage: el.index + 1,
        type: el.type,
        value: el.value,
        option: el.option,
        option_value: el.optionValue,
      };
    });

    const formData = {
      items: mappedTermListRequest,
      remove_items: removeList,
      ...data,
    };

    updateTermOfPayment(formData);
  };

  if (isLoadingTopData || isFetchingTopData)
    return (
      <Center>
        <Spin tip="Loading data..." />
      </Center>
    );

  return (
    <>
      <Col>
        <Row gap="4px" alignItems={"center"}>
          <ArrowLeft style={{ cursor: "pointer" }} onClick={() => router.back()} />
          <Text variant={"h4"}>{lang[t].termOfPayment.pageTitle.termOfPayment}</Text>
        </Row>

        <Spacer size={20} />

        <Card padding="20px">
          <Row justifyContent="flex-end" alignItems="center" nowrap>
            <Row gap="16px">
              <Button size="big" variant={"tertiary"} onClick={() => setShowDeleteModal(true)}>
                {lang[t].termOfPayment.tertier.delete}
              </Button>
              <Button size="big" variant={"primary"} onClick={handleSubmit(onSubmit)}>
                {isLoadingUpdateTermOfPayment ? "Loading..." : lang[t].termOfPayment.primary.save}
              </Button>
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
                defaultValue={termOfPaymentData.name}
                placeholder={"e.g 3 Days"}
                {...register("name")}
              />
            </Row>

            <Spacer size={10} />

            <Row width={"150px"}>
              <Button
                size="small"
                variant={"tertiary"}
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
                  if (data.id !== 0) {
                    setRemoveList((prevList: any) => {
                      return [...prevList, { id: data.id }];
                    });
                  }
                  const filterTermList = termList.filter((term) => term.key !== data.key);

                  const mappedTermList = filterTermList.map((el, index) => {
                    return {
                      ...el,
                      index,
                    };
                  });
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
          title={""}
          footer={<></>}
          content={
            <>
              <Spacer size={14} />
              <Col justifyContent="center" alignItems="center">
                <Row justifyContent="center" alignItems="center">
                  <ExclamationCircleOutlined />
                  <Text variant="headingRegular">Info</Text>
                </Row>
                <Row>
                  <Text variant={"caption"} textAlign={"center"} color={"grey.light"}>
                    You can't add more term, if payment type "Balance" already used.
                  </Text>
                </Row>
                <Button
                  variant="primary"
                  size={"small"}
                  full
                  onClick={() => setShowDisableTerm(false)}
                >
                  Close
                </Button>
              </Col>
            </>
          }
        />
      )}

      {showDeleteModal && (
        <ModalDeleteConfirmation
          totalSelected={1}
          itemTitle={termOfPaymentData.name}
          visible={showDeleteModal}
          isLoading={isLoadingDeleteBP}
          onCancel={() => setShowDeleteModal(false)}
          onOk={() => deleteBusinessProcess({ ids: [top_id], company_id: "KSNI" })}
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
      image={"/icons/empty-state.svg"}
      title={"No Data Terms"}
      subtitle={"Press + add terms button to add new terms"}
      height={325}
    />
  </>
);

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

export default TermOfPaymentEdit;
