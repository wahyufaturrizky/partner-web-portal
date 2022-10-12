import React, { useState } from "react";
import { useRouter } from "next/router";
import { Controller, useForm } from "react-hook-form";
import { Layout, Menu, Search, Spacer, Col, Row, Text, Dropdown2, Input, TextArea, Label, FormSelect, Button } from "pink-lava-ui";
import ArrowLeft from "../../assets/icons/arrow-left.svg";
import styled from "styled-components";

const { Header, Content, Footer, Sider } = Layout;

const mdmData = {
    status: "SUCCESS",
    data: {
        code: "mdm",
        name: "Master Data Management",
        components: [
            {
                id : 2,
                name : "Dictionary",
                type : "Dictionary"
            },
            {
                id: 3,
                name: "Message",
                type: "Message"
            },
            {
                id : 1,
                name : "Product List",
                type : "Menu"
            }
        ]
    },
    message : "details language library"
}

const dataDictionary = {
  status: "SUCCESS",
  data: [
      {
          id: 4,
          key: "mdm.product.field_id",
          type_id: 2,
          menu_id: null,
          ref_type_id: null,
          module_code: "mdm",
          created_by: 0,
          created_at: "2022-10-11T08:06:06.000Z",
          modified_by: null,
          modified_at: null,
          deleted_by: null,
          deleted_at: null
      },
      {
          id: 5,
          key: "mdm.product.field_name",
          type_id: 2,
          menu_id: null,
          ref_type_id: null,
          module_code: "mdm",
          created_by: 0,
          created_at: "2022-10-11T07:06:06.000Z",
          modified_by: null,
          modified_at: null,
          deleted_by: null,
          deleted_at: null
      }
  ],
  message: "list dictionary ref type"
}

const dataMessage = {
  status: "SUCCESS",
  data: [
      {
          id: 1,
          name: "Alert",
          created_by: 0,
          created_at: "2022-10-11T09:21:50.131Z",
          modified_by: 0,
          modified_at: "2022-10-11T09:21:50.131Z",
          deleted_by: null,
          deleted_at: null
      },
      {
          id: 2,
          name: "Confirmation",
          created_by: 0,
          created_at: "2022-10-11T09:21:50.131Z",
          modified_by: 0,
          modified_at: "2022-10-11T09:21:50.131Z",
          deleted_by: null,
          deleted_at: null
      },
      {
          id: 3,
          name: "Toast Message",
          created_by: 0,
          created_at: "2022-10-11T09:21:50.131Z",
          modified_by: 0,
          modified_at: "2022-10-11T09:21:50.131Z",
          deleted_by: null,
          deleted_at: null
      },
      {
          id: 4,
          name: "Tooltips",
          created_by: 0,
          created_at: "2022-10-11T09:21:50.131Z",
          modified_by: 0,
          modified_at: "2022-10-11T09:21:50.131Z",
          deleted_by: null,
          deleted_at: null
      }
  ],
  message: "list message ref type"
}

const useDataDictionary = dataDictionary?.data?.map(e => (
  {
    id: e.id,
    value: e.key
  }
));

const useDataMessage = dataMessage?.data?.map(e => (
  {
    value: e.id,
    label: e.name
  }
))

const menuMDM = mdmData?.data?.components?.map(e => (
  {
    key: e.id,
    label: e.name
  }
));




const LibraryLanguageDetail = () => {
  const router = useRouter()
  const { library_language_code } = router.query;

  const { register, control, handleSubmit } = useForm();

  const [openDictionary, setOpenDictionary] = useState(true)
  const [openComponentField, setOpenComponentField] = useState(false)
  const [openComponentFieldChild, setOpenComponentFieldChild] = useState(false)

  const [searchFields, setSearchFields] = useState("")

  const handleMenuDictionary = (e) => {
    setOpenComponentFieldChild(true)
  }
  return (
    <Col>
          <Row justifyContent="space-between" alignItems="center" nowrap>
            <Row gap="4px" alignItems="center">
            <ArrowLeft style={{ cursor: "pointer" }} onClick={() => router.back()} />
            <Text variant={"h4"}>{"Master Data Management"}</Text>
            </Row>
            <Row gap="16px">
              <Button size="big" variant={"primary"} onClick={() => router.back()}>
                {"Save"}
              </Button>
            </Row>
          </Row>

          <Spacer size={20} />

          
      <Card>

        <Layout style={{ height: "100vh", overflow: "auto" }}>
          <Sider style={{
            height: "100%",
            background: "#fff",
            color: "#000",
            borderRight: "1px solid #ddd"
          }}>
            <Spacer size={15}/>
            <BaseMenu
            mode="inline"
            defaultSelectedKeys={[1]}
            >
              <Search
              width="180px"
              placeholder="Search Cost Center Code, Cost Center Name, etc"
              onChange={(e: any) => {
                setSearch(e.target.value);
              }}
              />
              {menuMDM.map(e => {
                return(
                  <BaseMenuItem
                    key={e.key}
                    onClick={() => {
                      console.log(e.label)
                      if(e.label === 'Dictionary') {
                        setOpenDictionary(true)
                        setOpenComponentFieldChild(false)
                        setOpenComponentField(false)
                      } else {
                        setOpenComponentField(true)
                        setOpenComponentFieldChild(false)
                        setOpenDictionary(false)
                      }
                  }}
                  >
                  {e.label}
                  </BaseMenuItem>
                )
              })}     
            </BaseMenu>
              
          </Sider>
          <Layout className="site-layout"
            style={{
              height: '100vh',
              overflow: 'auto',
              background: "#fff"
            }}
          >
            <div style={{ padding: "22px", background: "#fff" }}>
              {openDictionary && (
                <Row width="100%" noWrap>
                  <Col width={"100%"}>
                    <Dropdown2
                      label=""
                      height="60px"
                      width={"100%"}
                      defaultValue={useDataDictionary[0].value}
                      handleChange={handleMenuDictionary}
                      items={useDataDictionary}
                      placeholder={"Select"}
                      noSearch
                    />
                  </Col>
                </Row>
              )}

              {openComponentField && (
                <Row width="100%" noWrap>
                  <Col width={"60%"}>
                  <CustomController
                    control={control}
                    name="data_message"
                    render={({ field: { onChange } }) => (
                        <FormSelect
                        height={'48px'}
                        style={{ width: "100%", lineHeight: "45px"}}
                        size={"large"}
                        required
                        placeholder={"Select"}
                        borderColor={"#AAAAAA"}
                        arrowColor={"#000"}
                        withSearch
                        defaultValue={useDataMessage[0]?.label}
                        // isLoading={}
                        items={useDataMessage}
                        onChange={(value: any) => {
                            onChange(value);
                            handleMenuDictionary(true)
                        }}
                        onSearch={(value: any) => {
                            setSearchFields(value);
                        }}
                        />
                      )}
                    />
                  </Col>

                  <Spacer size={20}/>

                  <Col width={'40%'}>
                  <Search
                    style={{
                      borderRadius: '8px'
                    }}
                    placeholder="Search Cost Center Code, Cost Center Name, etc"
                    onChange={(e: any) => {
                      setSearch(e.target.value);
                    }}
                    />
                  </Col>
                  
               </Row>

               
              )}

            <Spacer size={10} />

            {openComponentFieldChild && (
                <>
                  <Spacer size={10} />
                    <CustomTextArea
                      width="100%"
                      label="en-US"
                      style={{padding: "6px 6px 6px 0"}}
                      rows={1}
                      defaultValue={"Country Name"}
                      placeholder={"e.g New Cost Center"}
                      onChange={() => console.log("ganti")}
                      />

                  <Spacer size={10} />
                  <CustomTextArea
                      width="100%"
                      label="id-ID"
                      style={{padding: "6px 6px 6px 0"}}
                      rows={1}
                      defaultValue={"Nama Negara"}
                      placeholder={"e.g New Cost Center"}
                      onChange={() => console.log("ganti")}
                      />
                </>
              )}
            </div>
          </Layout>
        </Layout>
      </Card>
    </Col>
  );
};

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 0 16px;
`;

const CustomController = styled(Controller)`
  .ant-select-selection-item {
    line-height: 45px !important;
  }
`;

const CustomTextArea = styled(TextArea)`
  .ant-input {
    border: none;
  }
  .ant-ipnut:focus {
    border:none;
    box-shadow: none;
  }
`
const BaseMenu = styled(Menu)`
    border: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
    .ant-menu-item::after {
        border: none;
        border-right: 1px solid gray;
    }
`;

const BaseMenuItem = styled(Menu.Item)`
    height: 36px;
    border-radius: 8px;
    padding: '7px 12px' !important;
    margin: 0 !important;
    display: flex;
    align-items: center;
    color: #000;
    width:'220px' !important;

    span:last-child {
        font-weight: 500;
        font-size: 16px;
        line-height: 22px;
        margin-left: 4px;
    }
`;

const TextName = styled.p`
  margin: 0;
  fontSize: '16px',
  fontWeight: 600;
  color: #000000;
`;

const TextRole = styled.p`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  margin: 0;
  color: #666666;
`;

export default LibraryLanguageDetail;
