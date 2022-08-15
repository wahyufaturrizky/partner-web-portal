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

const ProductOptionDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [dataItem, setDataItem] = useState([]);
  const [modalChannelForm, setModalChannelForm] = useState({
    open: false,
    data: {},
    typeForm: "create",
  });

  const { register, handleSubmit } = useForm({ shouldUseNativeValidation: true });

  const {
    data: dataProductOption,
    isLoading: isLoadingDataProductOption,
    refetch: refetchProductOption,
    isFetching: isFetchingProductOption,
  } = useProductOptionMDM({
    options: {
      onSuccess: () => {},
    },
    id: `KSNI/${id}`,
  });

  const { mutate: updateProductOption, isLoading: isLoadingUpdateProductOption } =
    useUpdateProductOptionMDM({
      options: {
        onSuccess: () => {
          router.back();
        },
      },
      id: `KSNI/${id}`,
    });

  const { mutate: updateProductOptionItem, isLoading: isLoadingUpdateProductOptionItem } =
    useUpdateProductOptionItemMDM({
      options: {
        onSuccess: () => {
          refetchProductOption();
        },
      },
      id: modalChannelForm.data.id,
    });

  const { mutate: createProductOptionItem, isLoading: isLoadingCreateProductOptionItem } =
    useCreateProductOptionItemMDM({
      options: {
        onSuccess: () => {
          refetchProductOption();
        },
      },
    });

  const { mutate: deleteProductOption, isLoading: isLoadingDeleteProductOption } =
    useDeleteProductOptionMDM({
      options: {
        onSuccess: () => {
          router.back();
          queryClient.invalidateQueries(["product-option"]);
        },
      },
    });

  const { mutate: deleteProductOptionItem, isLoading: isLoadingDeleteProductOptionItem } =
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

  const handleAddItem = (data) => {
    if (modalChannelForm.typeForm === "edit") {
      updateProductOptionItem({ name: data.items });
    } else {
      console.log(data);
      createProductOptionItem({
        product_option_id: dataProductOption.productOptionId,
        company_id: "KSNI",
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
      title: "Action",
      dataIndex: "action",
      width: "15%",
      align: "left",
      render: (_, record) => {
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
      title: "Item Name",
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
              <Button size="big" variant={"tertiary"} onClick={() => setShowDeleteModal(true)}>
                Delete
              </Button>
              <Button size="big" variant={"primary"} onClick={handleSubmit(onSubmit)}>
                {isLoadingUpdateProductOption ? "Loading..." : "Save"}
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
                <Col width={"50%"}>
                  <Input
                    width="100%"
                    defaultValue={dataProductOption?.name}
                    label="Product Option Name"
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
            <Accordion.Header variant="blue">Product Options Item</Accordion.Header>
            <Accordion.Body>
              <Button
                size="big"
                variant={"tertiary"}
                onClick={() => setModalChannelForm({ open: true, typeForm: "create", data: {} })}
              >
                <ICPlus /> Add New
              </Button>

              <Spacer size={20} />

              <Row width="100%" noWrap>
                <Col width={"100%"}>
                  <Table
                    columns={columns.filter(
                      (filtering) => filtering.dataIndex !== "id" && filtering.dataIndex !== "key"
                    )}
                    data={dataProductOption.items.map((data) => ({
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
              modalChannelForm.typeForm === "create" ? "Add Product Option" : "Edit Product Option"
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
                  label="Item Name"
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
                    Cancel
                  </Button>

                  <Button onClick={handleSubmit(handleAddItem)} variant="primary" size="big">
                    {isLoadingCreateProductOptionItem || isLoadingUpdateProductOptionItem
                      ? "Loading..."
                      : "Save"}
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
          onOk={() => deleteProductOption({ ids: [id], company_id: "KSNI" })}
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
