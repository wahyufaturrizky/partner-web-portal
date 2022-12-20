import { useRouter } from "next/router";
import { Accordion, Button, Col, Input, Modal, Row, Spacer, Table, Text, Spin } from "pink-lava-ui";
import { useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { ICDelete, ICEdit, ICPlus } from "../../assets";
import ArrowLeft from "../../assets/icons/arrow-left.svg";
import {
  useCreateProductOptionItemMDM,
  useDeleteProductOptionItemMDM,
  useDeleteProductOptionMDM,
  useProductOptionMDM,
  useUpdateProductOptionItemMDM,
  useUpdateProductOptionMDM,
} from "../../hooks/mdm/product-option/useProductOptionMDM";
import { queryClient } from "../_app";
import { ModalDeleteConfirmation } from "../../components/elements/Modal/ModalConfirmationDelete";
import { lang } from "lang";
import { useUserPermissions } from "hooks/user-config/usePermission";

const ProductOptionDetail = () => {
  const t = localStorage.getItem("lan") || "en-US";
  const router = useRouter();
  const companyId = localStorage.getItem("companyId");
  const companyCode = localStorage.getItem("companyCode");
  const { id } = router.query;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [dataItem, setDataItem] = useState([]);
  const [modalChannelForm, setModalChannelForm] = useState<any>({
    open: false,
    data: {},
    typeForm: "create",
  });

  const { register, handleSubmit } = useForm({ shouldUseNativeValidation: true });

  const { data: dataUserPermission } = useUserPermissions({
    options: {
      onSuccess: () => {},
    },
  });

  const listPermission = dataUserPermission?.permission?.filter(
    (filtering: any) => filtering.menu === "Product Option"
  );

  const {
    data: dataProductOption,
    isLoading: isLoadingDataProductOption,
    refetch: refetchProductOption,
    isFetching: isFetchingProductOption,
  } = useProductOptionMDM({
    options: {
      onSuccess: () => {},
    },
    id: `${companyCode}/${id}`,
  });

  const { mutate: updateProductOption, isLoading: isLoadingUpdateProductOption } =
    useUpdateProductOptionMDM({
      options: {
        onSuccess: () => {
          router.back();
        },
      },
      id: `${companyCode}/${id}`,
    });

  const { mutate: updateProductOptionItem, isLoading: isLoadingUpdateProductOptionItem }: any =
    useUpdateProductOptionItemMDM({
      options: {
        onSuccess: () => {
          refetchProductOption();
        },
      },
      id: modalChannelForm.data.id,
    });

  const { mutate: createProductOptionItem, isLoading: isLoadingCreateProductOptionItem }: any =
    useCreateProductOptionItemMDM({
      options: {
        onSuccess: () => {
          refetchProductOption();
        },
      },
    });

  const { mutate: deleteProductOption, isLoading: isLoadingDeleteProductOption }: any =
    useDeleteProductOptionMDM({
      options: {
        onSuccess: () => {
          router.back();
        },
      },
    });

  const { mutate: deleteProductOptionItem, isLoading: isLoadingDeleteProductOptionItem }: any =
    useDeleteProductOptionItemMDM({
      options: {
        onSuccess: () => {
          refetchProductOption();
        },
      },
    });

  const onSubmit = (data: any) => {
    const formData = {
      ...data,
    };

    updateProductOption(formData);
  };

  const handleAddItem = (data: any) => {
    if (modalChannelForm.typeForm === "edit") {
      updateProductOptionItem({ name: data.items });
    } else {
      createProductOptionItem({
        product_option_id: dataProductOption.productOptionId,
        company_id: companyCode,
        name: data.items,
      });
    }

    setModalChannelForm({ open: false, data: {}, typeForm: "" });
  };

  const columns = [
    {
      title: "key",
      dataIndex: "key",
    },
    {
      title: "id",
      dataIndex: "id",
    },
    {
      title: lang[t].productOption.productOptionAction,
      dataIndex: "action",
      width: "15%",
      align: "left",
      render: (_: any, record: any) => {
        return (
          <Row gap="16px" alignItems="center" nowrap>
            <Col>
              <ICEdit
                onClick={() =>
                  setModalChannelForm({
                    open: true,
                    typeForm: "edit",
                    data: record,
                  })
                }
              />
            </Col>
            <Col>
              <ICDelete onClick={() => deleteProductOptionItem({ id: record.id })} />
            </Col>
          </Row>
        );
      },
    },
    {
      title: lang[t].productOption.productOptionItemName,
      dataIndex: "name",
    },
  ];

  if (isLoadingDataProductOption || isFetchingProductOption) {
    return (
      <Center>
        <Spin tip="loading..." />
      </Center>
    );
  }

  return (
    <>
      <Col>
        <Row gap="4px">
          <ArrowLeft style={{ cursor: "pointer" }} onClick={() => router.back()} />
          <Text variant={"h4"}>{dataProductOption?.name}</Text>
        </Row>

        <Spacer size={20} />

        <Card padding="20px">
          <Row justifyContent="flex-end" alignItems="center" nowrap>
            <Row gap="16px">
              {listPermission?.filter((data: any) => data.viewTypes[0]?.viewType.name === "Delete")
							.length > 0 && (
                <Button size="big" variant={"tertiary"} onClick={() => setShowDeleteModal(true)}>
                  {lang[t].productOption.tertier.delete}
                </Button>
              )}
              {listPermission?.filter((data: any) => data.viewTypes[0]?.viewType.name === "Update")
							.length > 0 && (
                <Button size="big" variant={"primary"} onClick={handleSubmit(onSubmit)}>
                  {isLoadingUpdateProductOption ? "Loading..." : lang[t].productOption.primary.save}
                </Button>
              )}
            </Row>
          </Row>
        </Card>

        <Spacer size={20} />

        <Accordion>
          <Accordion.Item key={1}>
            <Accordion.Header variant="blue">
              {lang[t].productOption.accordion.general}
            </Accordion.Header>
            <Accordion.Body>
              <Row width="100%" noWrap>
                <Col width={"50%"}>
                  <Input
                    width="100%"
                    defaultValue={dataProductOption?.name}
                    label={lang[t].productOption.emptyState.productOptionName}
                    height="40px"
                    placeholder={"e.g Flavour"}
                    {...register("name", { required: "Please enter name." })}
                  />
                </Col>
              </Row>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <Spacer size={20} />

        <Accordion>
          <Accordion.Item key={1}>
            <Accordion.Header variant="blue">
              {lang[t].productOption.accordion.productOptionItem}
            </Accordion.Header>
            <Accordion.Body>
              <Button
                size="big"
                variant={"tertiary"}
                onClick={() => setModalChannelForm({ open: true, typeForm: "create", data: {} })}
              >
                <ICPlus /> {lang[t].productOption.tertier.addNew}
              </Button>

              <Spacer size={20} />

              <Row width="100%" noWrap>
                <Col width={"100%"}>
                  <Table
                    columns={columns.filter(
                      (filtering) => filtering.dataIndex !== "id" && filtering.dataIndex !== "key"
                    )}
                    data={dataProductOption.items.map((data: any) => ({
                      key: data.id,
                      id: data.id,
                      name: data.name,
                    }))}
                  />
                </Col>
              </Row>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        {modalChannelForm.open && (
          <Modal
            width={"350px"}
            centered
            closable={false}
            visible={modalChannelForm.open}
            onCancel={() => setModalChannelForm({ open: false, data: {}, typeForm: "" })}
            title={
              modalChannelForm.typeForm === "create"
                ? lang[t].productOption.modalTitleCreate.addProductOption
                : lang[t].productOption.modalTitleUpdate.productOption
            }
            footer={null}
            content={
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Spacer size={20} />

                <Input
                  defaultValue={modalChannelForm.data?.name}
                  width="100%"
                  label={lang[t].productOption.emptyState.itemName}
                  height="48px"
                  required
                  placeholder={"e.g Strawberry"}
                  {...register("items", {
                    shouldUnregister: true,
                    required: "Please enter item name.",
                  })}
                />
                <Spacer size={20} />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                    marginBottom: "20px",
                  }}
                >
                  <Button
                    size="big"
                    variant={"tertiary"}
                    key="submit"
                    type="primary"
                    onClick={() => setModalChannelForm({ open: false, data: {}, typeForm: "" })}
                  >
                    {lang[t].productOption.tertier.cancel}
                  </Button>

                  <Button onClick={handleSubmit(handleAddItem)} variant="primary" size="big">
                    {isLoadingCreateProductOptionItem || isLoadingUpdateProductOptionItem
                      ? "Loading..."
                      : lang[t].productOption.primary.save}
                  </Button>
                </div>
              </div>
            }
          />
        )}
      </Col>

      {showDeleteModal && (
        <ModalDeleteConfirmation
          totalSelected={1}
          itemTitle={dataProductOption.name}
          visible={showDeleteModal}
          isLoading={isLoadingDeleteProductOption}
          onCancel={() => setShowDeleteModal(false)}
          onOk={() => deleteProductOption({ ids: [id], company_id: companyCode })}
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

export default ProductOptionDetail;
