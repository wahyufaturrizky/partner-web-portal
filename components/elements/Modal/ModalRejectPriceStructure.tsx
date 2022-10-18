import React, { useState } from "react";
import { Button, Spacer, Modal, Accordion, Text, TextArea, Row, Col, Checkbox } from "pink-lava-ui";
import styled from "styled-components";
import { emptyPayloadPriceStructure } from "pages/pricing-structure/[price_structure_id]";

export const ModalRejectPriceStructure: any = ({
  visible,
  onCancel,
  onOk,
}: {
  visible: any;
  onCancel: any;
  onOk: any;
  userIds: any;
}) => {
  const [priceStructureAndProduct, setPriceStructureAndProduct] = useState([]);
  const [desc, setDesc] = useState();

  const handleChangePriceStructureAndProduct = (value: any) => {
    let newPriceStructureAndProduct = JSON.parse(JSON.stringify(priceStructureAndProduct));
    if (newPriceStructureAndProduct.includes(value)) {
      newPriceStructureAndProduct = newPriceStructureAndProduct.filter(
        (info: any) => info !== value
      );
    } else {
      newPriceStructureAndProduct.push(value);
    }
    setPriceStructureAndProduct(newPriceStructureAndProduct);
  };

  const onSubmit = () => {
    const data = {
      rejectionReason: desc,
      rejectionDetails: {},
    };

    if (priceStructureAndProduct.length > 0) {
      data.rejectionDetails = Object.assign(
        ...priceStructureAndProduct.map((k) => ({ [k]: true }))
      );
    }

    onOk({
      rejection: data,
      status: "REJECTED",
      ...emptyPayloadPriceStructure,
    });
  };

  const checkAllPriceStructureAndProduct = () => {
    let newPriceStructureAndProduct = JSON.parse(JSON.stringify(priceStructureAndProduct));
    if (newPriceStructureAndProduct.length === 12) {
      newPriceStructureAndProduct = [];
    } else {
      newPriceStructureAndProduct = ["price_structure_config", "currency", "managed_by", "product"];
    }
    setPriceStructureAndProduct(newPriceStructureAndProduct);
  };

  return (
    <Modal
      width={"880px"}
      visible={visible}
      onCancel={onCancel}
      title={"Detail Field"}
      footer={
        <div
          style={{
            display: "flex",
            marginBottom: "12px",
            marginRight: "12px",
            justifyContent: "flex-end",
            gap: "12px",
          }}
        >
          <Button variant="secondary" size="big" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onSubmit} variant="primary" size="big">
            Save
          </Button>
        </div>
      }
      content={
        <>
          <Spacer size={12} />
          <Text color="blue.darker" variant="headingMedium">
            Select Data Rejected
          </Text>
          <Spacer size={16} />
          <Accordion key={1}>
            <Accordion.Item key={1}>
              <Accordion.Header variant="white">
                <Row alignItems="center" gap="8px">
                  <Checkbox
                    checked={priceStructureAndProduct.length === 4}
                    onChange={() => checkAllPriceStructureAndProduct()}
                    stopPropagation={true}
                  />
                  <Text variant="headingMedium" bold>
                    Pricing Structure & Products
                  </Text>
                </Row>
              </Accordion.Header>
              <Accordion.Body padding="0px">
                <Row gap="20px" width="100%" height="41px" padding="16px">
                  <Row width="164px" height="25px">
                    <Checkbox
                      checked={priceStructureAndProduct.includes("price_structure_config")}
                      onChange={() =>
                        handleChangePriceStructureAndProduct("price_structure_config")
                      }
                    />
                    <Spacer size={8} display="inline-block" />
                    <Text variant="body1">Name</Text>
                  </Row>
                  <Row width="164px" height="25px">
                    <Checkbox
                      checked={priceStructureAndProduct.includes("currency")}
                      onChange={() => handleChangePriceStructureAndProduct("currency")}
                    />
                    <Spacer size={8} display="inline-block" />
                    <Text variant="body1">Subdomain</Text>
                  </Row>
                  <Row width="164px" height="25px">
                    <Checkbox
                      checked={priceStructureAndProduct.includes("managed_by")}
                      onChange={() => handleChangePriceStructureAndProduct("managed_by")}
                    />
                    <Spacer size={8} display="inline-block" />
                    <Text variant="body1">Country</Text>
                  </Row>
                  <Row width="164px" height="25px">
                    <Checkbox
                      checked={priceStructureAndProduct.includes("product")}
                      onChange={() => handleChangePriceStructureAndProduct("product")}
                    />
                    <Spacer size={8} display="inline-block" />
                    <Text variant="body1">Partner Type</Text>
                  </Row>
                </Row>
                <Spacer size={16} />
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          <Spacer size={16} />
          <Col width="100%" gap="8px">
            <div style={{ position: "relative" }}>
              <CustomTextArea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                label={
                  <Text
                    variant="headingMedium"
                    placeholder="Data has not been filled in."
                    color="blue.darker"
                  >
                    Reason Rejected
                  </Text>
                }
              />
            </div>
          </Col>
          <Spacer size={18} />
        </>
      }
    />
  );
};

const CustomTextArea = styled(TextArea)`
  .ant-input-textarea-show-count::after {
    top: 8px !important;
  }
`;
