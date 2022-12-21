import { lang } from "lang";
import { useRouter } from "next/router";
import {
  Accordion, Button, Col, Input, Modal, Row, Spacer, Table, Text,
} from "pink-lava-ui";
import { useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { ICDelete, ICEdit, ICPlus } from "../../../assets";
import { useCreateProductOptionMDM } from "../../../hooks/mdm/product-option/useProductOptionMDM";
import { queryClient } from "../../_app";

const ProductOptionCreate = () => {
  const companyId = localStorage.getItem("companyId");
  const companyCode = localStorage.getItem("companyCode");
  const t = localStorage.getItem("lan") || "en-US";

  const [dataItem, setDataItem] = useState([]);
  const [modalChannelForm, setModalChannelForm] = useState({
    open: false,
    data: {},
    typeForm: "create",
  });
  const router = useRouter();

  const { register, handleSubmit } = useForm({ shouldUseNativeValidation: true });

  const { mutate: createProductOption, isLoading: isLoadingCreateProductOption } = useCreateProductOptionMDM({
    options: {
      onSuccess: () => {
        router.back();
        queryClient.invalidateQueries(["product-option"]);
      },
    },
  });

  const onSubmit = (data: any) => {
    if (dataItem.length > 0) {
      const formData = {
        company_id: companyCode,
        items: dataItem.map((mapData) => mapData.name),
        ...data,
      };
    } else {
      window.alert("Please fill product option items");
    }

    createProductOption(formData);
  };

  const handleAddItem = (data) => {
    if (modalChannelForm.typeForm === "edit") {
      const tempEdit = dataItem.map((mapDataItem) => {
        if (mapDataItem.id === modalChannelForm.data.id) {
          mapDataItem.name = data.items;

          return { ...mapDataItem };
        }
        return mapDataItem;
      });

      setDataItem([...tempEdit]);
    } else {
      setDataItem([
        ...dataItem,
        {
          key: new Date().valueOf(),
          id: new Date().valueOf(),
          name: data.items,
        },
      ]);
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
      render: (_, record) => (
        <Row gap="16px" alignItems="center" nowrap>
          <Col>
            <ICEdit
              onClick={() => setModalChannelForm({
                open: true,
                typeForm: "edit",
                data: record,
              })}
            />
          </Col>
          <Col>
            <ICDelete
              onClick={() => setDataItem(dataItem.filter((filtering) => filtering.id !== record.id))}
            />
          </Col>
        </Row>
      ),
    },
    {
      title: lang[t].productOption.productOptionItemName,
      dataIndex: "name",
    },
  ];

  return (
    <Col>
      <Row gap="4px">
        <Text variant="h4">{lang[t].productOption.pageTitle.createProductOption}</Text>
      </Row>

      <Spacer size={20} />

      <Card padding="20px">
        <Row justifyContent="flex-end" alignItems="center" nowrap>
          <Row gap="16px">
            <Button size="big" variant="tertiary" onClick={() => router.back()}>
              {lang[t].productOption.tertier.cancel}
            </Button>
            <Button size="big" variant="primary" onClick={handleSubmit(onSubmit)}>
              {isLoadingCreateProductOption ? "Loading..." : lang[t].productOption.primary.save}
            </Button>
          </Row>
        </Row>
      </Card>

      <Spacer size={20} />

      <Accordion>
        <Accordion.Item key={1}>
          <Accordion.Header variant="blue">{lang[t].productOption.accordion.general}</Accordion.Header>
          <Accordion.Body>
            <Row width="100%" noWrap>
              <Col width="50%">
                <Input
                  width="100%"
                  label={lang[t].productOption.emptyState.productOptionName}
                  height="40px"
                  placeholder="e.g Flavour"
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
          <Accordion.Header variant="blue">{lang[t].productOption.accordion.productOptionItem}</Accordion.Header>
          <Accordion.Body>
            <Button
              size="big"
              variant="tertiary"
              onClick={() => setModalChannelForm({ open: true, typeForm: "create", data: {} })}
            >
              <ICPlus />
              {' '}
              {lang[t].productOption.tertier.addNew}
            </Button>

            <Spacer size={20} />

            <Row width="100%" noWrap>
              <Col width="100%">
                <Table
                  columns={columns.filter(
                    (filtering) => filtering.dataIndex !== "id" && filtering.dataIndex !== "key",
                  )}
                  data={dataItem}
                />
              </Col>
            </Row>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      {modalChannelForm.open && (
        <Modal
          width="350px"
          centered
          closable={false}
          visible={modalChannelForm.open}
          onCancel={() => setModalChannelForm({ open: false, data: {}, typeForm: "" })}
          title={
            modalChannelForm.typeForm === "create" ? "Add Product Option" : "Edit Product Option"
          }
          footer={null}
          content={(
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
                placeholder="e.g Strawberry"
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
                  variant="tertiary"
                  key="submit"
                  type="primary"
                  onClick={() => setModalChannelForm({ open: false, data: {}, typeForm: "" })}
                >
                  Cancel
                </Button>

                <Button onClick={handleSubmit(handleAddItem)} variant="primary" size="big">
                  Save
                </Button>
              </div>
            </div>
          )}
        />
      )}
    </Col>
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

export default ProductOptionCreate;
