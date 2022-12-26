import React, { useState } from "react";
import { Col, Row, Search, Spacer, Text, DropdownOverlay } from "pink-lava-ui";
import styled from "styled-components";
import IconAdd from "assets/icons/ic-add-rounded.svg";
import IconAvatar from "assets/icons/ic-avatar-xs.svg";
import IconEdit from "assets/icons/ic-more.svg";
import ModalAddNewContacts from "components/elements/Modal/ModalAddNewContacts";
import { CheckOutlined } from "@ant-design/icons";
import { useFormContext, useFieldArray } from "react-hook-form";
import ModalAddNewContactCustomer from "components/elements/Modal/ModalAddNewContactsCustomer";

const menuList = [
  {
    key: 1,
    value: (
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <p style={{ margin: "0" }}>Set Is Primary</p>
      </div>
    ),
  },
  {
    key: 2,
    value: (
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <p style={{ margin: "0" }}>Edit</p>
      </div>
    ),
  },
  {
    key: 3,
    value: (
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <p style={{ margin: "0", color: "#ED1C24" }}>Remove</p>
      </div>
    ),
  },
];

const Contacts = ({ formType }: any) => {
  const { control, setValue } = useFormContext();

  const { fields, append, remove, update }: any = useFieldArray<any>({
    control,
    name: "contact",
    keyName: "key",
  });

  const [showFormContact, setShowFormContact] = useState<any>({
    type: "",
    open: false,
    data: {},
    index: 0,
  });

  return (
    <>
      <Row width="100%" noWrap gap={"10px"}>
        <Col width={"100%"}>
          <Search
            width={"25%"}
            placeholder="search contact name, role, email"
            onChange={(e: any) => {
              const mapContact = fields.map((contact: any) => {
                if (!contact.name.includes(e.target.value) && e.target.value !== "") {
                  return {
                    ...contact,
                    filtered: true,
                  };
                } else {
                  return {
                    ...contact,
                    filtered: false,
                  };
                }
              });
              setValue("contacts", mapContact);
            }}
          />

          <Spacer size={20} />

          <Row gap="12px" width="100%">
            <ContactCard
              clickAble
              justifyContent={"center"}
              onClick={() => {
                setShowFormContact({ type: "add", open: true, data: {} });
              }}
            >
              <IconAdd />{" "}
              <Text color="pink.regular" hoverColor="pink.regular" variant="headingRegular">
                Add New Contact
              </Text>
            </ContactCard>

            {fields.map((contact: any, contactIndex: any) => {
              return (
                <ContactCard key={contact.key} filtered={contact.filtered}>
                  <IconAvatar />
                  <Spacer size={10} />
                  <Col width="100%">
                    <ContactName>{contact?.name}</ContactName>
                    <Row gap={"4px"}>
                      {contact?.is_primary && (
                        <ContactLabel>
                          <CheckOutlined /> Primary
                        </ContactLabel>
                      )}
                      <ContactLabel>{contact?.job}</ContactLabel>
                    </Row>
                    <ContactEmail>{contact?.email}</ContactEmail>
                  </Col>

                  <DropdownOverlay
                    onClick={(e: any) => {
                      switch (parseInt(e.key)) {
                        case 1:
                          const findIndex = fields.findIndex((contact: any) => contact.is_primary);

                          // Ganti status primary true menjadi false di elemen lain
                          update(findIndex, { ...fields[findIndex], is_primary: false });

                          // Gantu status primary false menjadi true di elemen yang di tuju
                          update(contactIndex, { ...contact, is_primary: true });
                          break;
                        case 2:
                          setShowFormContact({
                            type: "edit",
                            open: true,
                            data: contact,
                            index: contactIndex,
                          });
                          break;
                        case 3:
                          remove(contactIndex);
                          break;
                        default:
                          break;
                      }
                    }}
                    menuList={!contact?.is_primary ? menuList : menuList.slice(1, menuList.length)}
                  >
                    <IconContainer>
                      <IconEdit />
                    </IconContainer>
                  </DropdownOverlay>
                </ContactCard>
              );
            })}
          </Row>
        </Col>
      </Row>

      {showFormContact.open && (
        <ModalAddNewContactCustomer
          visible={showFormContact.open}
          onCancel={() => {
            setShowFormContact({ type: "", open: false, data: {} });
          }}
          contactData={showFormContact.data}
          onSaveContact={(contactObject: any) => {
            if (formType === "edit") {
              switch (showFormContact.type) {
                case "add":
                  append({
                    ...contactObject,
                    is_primary: fields.length === 0,
                    filtered: false,
                    id: 0,
                    deleted: false,
                  });
                  setShowFormContact({ type: "", open: false, data: {}, index: 0 });
                  break;
                case "edit":
                  update(showFormContact.index, { ...showFormContact.data, ...contactObject });
                  setShowFormContact({ type: "", open: false, data: {}, index: 0 });
                  break;
                default:
                  break;
              }
            } else {
              switch (showFormContact.type) {
                case "add":
                  append({ ...contactObject, is_primary: fields.length === 0, filtered: false });
                  setShowFormContact({ type: "", open: false, data: {}, index: 0 });
                  break;
                case "edit":
                  update(showFormContact.index, { ...showFormContact.data, ...contactObject });
                  setShowFormContact({ type: "", open: false, data: {}, index: 0 });
                  break;
                default:
                  break;
              }
            }
          }}
        />
      )}
    </>
  );
};

const ContactName: any = styled.p`
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  color: #000000;
`;

const ContactLabel: any = styled.p`
  display: inline;
  width: fit-content;
  background: #d5fafd;
  border-radius: 16px;
  padding: 4px 8px;
  font-weight: 600;
  font-size: 10px;
  color: #1e858e;
`;

const ContactEmail: any = styled.p`
  font-weight: 400;
  font-size: 10px;
  line-height: 14px;
  color: #888888;
`;

const IconContainer: any = styled.div`
  position: absolute;
  cursor: pointer;
  right: 10px;
  top: 12px;
`;

const ContactCard: any = styled.div`
  ${({ justifyContent }: any) => (justifyContent ? `justify-content: ${justifyContent};` : "")}
  position: relative;
  width: 353px;
  height: 96px;
  cursor: ${({ clickAble }: any) => (clickAble ? "pointer" : "auto")};
  display: ${({ filtered }: any) => (filtered ? "none" : "flex")};
  align-items: center;
  border: 1px solid #dddddd;
  border-radius: 16px;
  padding: 8px;
`;

export default Contacts;
