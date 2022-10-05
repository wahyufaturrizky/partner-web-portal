import React, { useState } from "react";
import { Button, Spacer, Modal, Accordion, Text, TextArea, Row, Col, Checkbox } from "pink-lava-ui";
import styled from "styled-components";

export const ModalRejectPartner: any = ({
  visible,
  onCancel,
  onOk,
}: {
  visible: any;
  onCancel: any;
  onOk: any;
  userIds: any;
}) => {
  const [employeeInformation, setEmployeeInformation] = useState([]);
  const [generalInformation, setGeneralInformation] = useState([]);
  const [menuDesign, setMenuDesign] = useState(false);
  const [desc, setDesc] = useState();

  const handleChangeEmployeeInformation = (value) => {
    let newEmployeeInformation = JSON.parse(JSON.stringify(employeeInformation));
    if (newEmployeeInformation.includes(value)) {
      newEmployeeInformation = newEmployeeInformation.filter((info) => info !== value);
    } else {
      newEmployeeInformation.push(value);
    }
    setEmployeeInformation(newEmployeeInformation);
  };

  const handleChangeGeneralInformation = (value) => {
    let newEmployeeInformation = JSON.parse(JSON.stringify(generalInformation));
    if (newEmployeeInformation.includes(value)) {
      newEmployeeInformation = newEmployeeInformation.filter((info) => info !== value);
    } else {
      newEmployeeInformation.push(value);
    }
    setGeneralInformation(newEmployeeInformation);
  };

  const onSubmit = () => {
    const data = {
      approvalStatus: "REJECTED",
      rejectionReason: desc,
      rejectionDetail: {},
    };

    if (employeeInformation.length > 0) {
      data.rejectionDetail.general = Object.assign(
        ...employeeInformation.map((k) => ({ [k]: true }))
      );
    }

    if (generalInformation.length > 0) {
      data.rejectionDetail.contact = Object.assign(
        ...generalInformation.map((k) => ({ [k]: true }))
      );
    }

    if (menuDesign) {
      data.rejectionDetail.menuDesign = true;
    }

    onOk(data);
  };

  const checkAllEmployeeInformation = () => {
    let newEmployeeInformation = JSON.parse(JSON.stringify(employeeInformation));
    if (newEmployeeInformation.length === 12) {
      newEmployeeInformation = [];
    } else {
      newEmployeeInformation = [
        "name",
        "sector",
        "business_license_image",
        "tax_number_image",
        "subdomain",
        "company_article",
        "country_id",
        "company_article_amandement",
        "partner_type_id",
        "business_license",
        "industry_id",
        "tax_number",
      ];
    }
    setEmployeeInformation(newEmployeeInformation);
  };

  const checkAllGeneralInformation = () => {
    let newGeneralInformation = JSON.parse(JSON.stringify(generalInformation));
    if (newGeneralInformation.length === 3) {
      newGeneralInformation = [];
    } else {
      newGeneralInformation = ["owner_contact", "pic_finance_contact", "pic_operational_contact"];
    }

    setGeneralInformation(newGeneralInformation);
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
            Select data that has not been filled in
          </Text>
          <Spacer size={16} />
          <Accordion key={1}>
            <Accordion.Item key={1}>
              <Accordion.Header variant="white">
                <Row alignItems="center" gap="8px">
                  <Checkbox
                    checked={employeeInformation.length === 12}
                    onChange={() => checkAllEmployeeInformation()}
                    stopPropagation={true}
                  />
                  <Text variant="headingMedium" bold>
                    General Data
                  </Text>
                </Row>
              </Accordion.Header>
              <Accordion.Body padding="0px">
                <Row gap="20px" width="100%" height="41px" padding="16px">
                  <Row width="164px" height="25px">
                    <Checkbox
                      checked={employeeInformation.includes("name")}
                      onChange={() => handleChangeEmployeeInformation("name")}
                    />
                    <Spacer size={8} display="inline-block" />
                    <Text variant="body1">Name</Text>
                  </Row>
                  <Row width="164px" height="25px">
                    <Checkbox
                      checked={employeeInformation.includes("subdomain")}
                      onChange={() => handleChangeEmployeeInformation("subdomain")}
                    />
                    <Spacer size={8} display="inline-block" />
                    <Text variant="body1">Subdomain</Text>
                  </Row>
                  <Row width="164px" height="25px">
                    <Checkbox
                      checked={employeeInformation.includes("country_id")}
                      onChange={() => handleChangeEmployeeInformation("country_id")}
                    />
                    <Spacer size={8} display="inline-block" />
                    <Text variant="body1">Country</Text>
                  </Row>
                  <Row width="164px" height="25px">
                    <Checkbox
                      checked={employeeInformation.includes("partner_type_id")}
                      onChange={() => handleChangeEmployeeInformation("partner_type_id")}
                    />
                    <Spacer size={8} display="inline-block" />
                    <Text variant="body1">Partner Type</Text>
                  </Row>
                </Row>
                <Row gap="20px" width="100%" height="41px" padding="16px">
                  <Row width="164px" height="25px">
                    <Checkbox
                      checked={employeeInformation.includes("industry_id")}
                      onChange={() => handleChangeEmployeeInformation("industry_id")}
                    />
                    <Spacer size={8} display="inline-block" />
                    <Text variant="body1">Industry</Text>
                  </Row>
                  <Row width="164px" height="25px">
                    <Checkbox
                      checked={employeeInformation.includes("sector")}
                      onChange={() => handleChangeEmployeeInformation("sector")}
                    />
                    <Spacer size={8} display="inline-block" />
                    <Text variant="body1">Sector</Text>
                  </Row>
                  <Row width="164px" height="25px">
                    <Checkbox
                      checked={employeeInformation.includes("company_article")}
                      onChange={() => handleChangeEmployeeInformation("company_article")}
                    />
                    <Spacer size={8} display="inline-block" />
                    <Text variant="body1">Akte Pendirian</Text>
                  </Row>
                  <Row width="164px" height="25px">
                    <Checkbox
                      checked={employeeInformation.includes("company_article_amandement")}
                      onChange={() => handleChangeEmployeeInformation("company_article_amandement")}
                    />
                    <Spacer size={8} display="inline-block" />
                    <Text variant="body1">Akte Perubahan</Text>
                  </Row>
                </Row>
                <Row gap="20px" width="100%" height="41px" padding="16px">
                  <Row width="164px" height="25px">
                    <Checkbox
                      checked={employeeInformation.includes("business_license")}
                      onChange={() => handleChangeEmployeeInformation("business_license")}
                    />
                    <Spacer size={8} display="inline-block" />
                    <Text variant="body1">Nomor Ijin Usaha</Text>
                  </Row>
                  <Row width="164px" height="25px">
                    <Checkbox
                      checked={employeeInformation.includes("tax_number")}
                      onChange={() => handleChangeEmployeeInformation("tax_number")}
                    />
                    <Spacer size={8} display="inline-block" />
                    <Text variant="body1">Nomor NPWP</Text>
                  </Row>
                  <Row width="164px" height="25px">
                    <Checkbox
                      checked={employeeInformation.includes("business_license_image")}
                      onChange={() => handleChangeEmployeeInformation("business_license_image")}
                    />
                    <Spacer size={8} display="inline-block" />
                    <Text variant="body1">Foto Izin Usaha</Text>
                  </Row>
                  <Row width="164px" height="25px">
                    <Checkbox
                      checked={employeeInformation.includes("tax_number_image")}
                      onChange={() => handleChangeEmployeeInformation("tax_number_image")}
                    />
                    <Spacer size={8} display="inline-block" />
                    <Text variant="body1">Foto NPWP</Text>
                  </Row>
                </Row>
                <Spacer size={16} />
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          <Spacer size={16} />
          <Accordion key={1}>
            <Accordion.Item key={1}>
              <Accordion.Header variant="white">
                <Row alignItems="center" gap="8px">
                  <Checkbox
                    checked={generalInformation.length === 3}
                    onChange={() => checkAllGeneralInformation()}
                    stopPropagation={true}
                  />
                  <Text variant="headingMedium" bold>
                    Contact
                  </Text>
                </Row>
              </Accordion.Header>
              <Accordion.Body padding="0px">
                <Row
                  justifyContent="space-between"
                  gap="16px"
                  width="100%"
                  height="41px"
                  padding="16px"
                >
                  <Row height="25px">
                    <Checkbox
                      checked={generalInformation.includes("owner_contact")}
                      onChange={() => handleChangeGeneralInformation("owner_contact")}
                    />
                    <Spacer size={8} display="inline-block" />
                    <Text variant="body1">Owner</Text>
                  </Row>
                  <Row height="25px">
                    <Checkbox
                      checked={generalInformation.includes("pic_finance_contact")}
                      onChange={() => handleChangeGeneralInformation("pic_finance_contact")}
                    />
                    <Spacer size={8} display="inline-block" />
                    <Text variant="body1">Finance</Text>
                  </Row>
                  <Row height="25px">
                    <Checkbox
                      checked={generalInformation.includes("pic_operational_contact")}
                      onChange={() => handleChangeGeneralInformation("pic_operational_contact")}
                    />
                    <Spacer size={8} display="inline-block" />
                    <Text variant="body1">Operational</Text>
                  </Row>
                </Row>
                <Spacer size={16} />
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          <Spacer size={16} />
          <Accordion key={1}>
            <Accordion.Item key={1}>
              <Accordion.Header variant="white">
                <Row alignItems="center" gap="8px">
                  <Checkbox
                    stopPropagation={true}
                    checked={menuDesign}
                    onChange={() => setMenuDesign(!menuDesign)}
                  />
                  <Text variant="headingMedium" bold>
                    Menu Design
                  </Text>
                </Row>
              </Accordion.Header>
              <Accordion.Body padding="0px"></Accordion.Body>
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
