import React, { SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Controller, useForm } from "react-hook-form";
import { Layout, Menu, Search, Spacer, Col, Row, Text, Dropdown2, Input, TextArea, Accordion, Label, FormSelect, Button, Spin } from "pink-lava-ui";
import ArrowLeft from "../../assets/icons/arrow-left.svg";
import styled from "styled-components";
import { useLibraryLanguageModuleDetail, useLibraryLanguageModuleRefType, useSaveLibraryLanguageTranslation, useTranslationData, useUpdateLibraryLanguage } from "hooks/mdm/library-language/useLibraryLanguage";
import useDebounce from "lib/useDebounce";
import { queryClient } from "pages/_app";

const { Header, Content, Footer, Sider } = Layout;

const LibraryLanguageDetail = () => {
  const router = useRouter()
  const { library_language_code } = router.query;
  const { register, control, handleSubmit } = useForm();

  const [dictionaryInput, setDictionaryInput] = useState({})
  const [nonDictionaryInput, setNonDictionaryInput] = useState({})

  const [openDictionary, setOpenDictionary] = useState(true)
  const [openNonDictionary, setOpenNonDictionary] = useState(false)
  const [openInputDictionary, setOpenInputDictionary] = useState(false)
  const [openInputNonDictionary, setOpenInputNonDictionary] = useState(false)

  const [typeRefName, setTypeRefName] = useState("")
  const [typeId, setTypeId] = useState(0)
  const [typeRefId, setTypeRefId] = useState(0)

  const [searchFields, setSearchFields] = useState("")
  const [searchFieldsDropdown, setSearchFieldsDropdown] = useState("")
  const [searchFieldsComponent, setSearchFieldsComponent] = useState("")

  const debounceSearch = useDebounce(searchFields, 1000);
  const debounceSearchDropdown = useDebounce(searchFieldsDropdown, 1000);
  const debounceSearchComponent = useDebounce(searchFieldsComponent, 1000);

  const {
    data: libraryLanguageData,
    isLoading: isLoadingLibraryLanguage,
    isFetching: isFetchingLibraryLanguage,
  } = useLibraryLanguageModuleDetail({
    code: library_language_code,
    query: {
      search: debounceSearch
    },
    options: {
      onSuccess: (data: any) => {
      },
      select: (data: any) => {
        const menuMDM = data?.components?.map((component: {
          typeId: number; id: number; name: string; type: string; 
          }) => (
          {
            key: component.id,
            label: component.name,
            type: component.type,
            typeId: component.typeId
          }
        ));
        return { data: menuMDM, name: data?.name}
      }
    },
  });

  console.log(typeRefName === '')
  const {
    data: libraryLanguageRefTypeData,
    isLoading: isLoadingLibraryLanguageRefType,
    isFetching: isFetchingLibraryLanguageRefType,
  } = useLibraryLanguageModuleRefType({
    refType: typeRefName && typeRefName,
    code: library_language_code,
    query: {
      search: debounceSearchDropdown
    },
    options: {
      onSuccess: (data: any) => {
      },
      select: (data: any) => {
        let filteredData;
        if(typeRefName === 'dictionary') {
          filteredData = data?.map((dictionary: { id: number; key: string; }) => (
            {
              id: dictionary.id,
              value: dictionary.key,
            }
          ))
        } else {
          filteredData = data?.map((nonDictionary: { id: number; name: string; }) => (
            {
              label: nonDictionary.name,
              value: nonDictionary.id,
            }
          ));

        }
        return { data: filteredData }
      }
    },
  });

  const {
    data: translationData,
    isLoading: isLoadingTranslationData,
    isFetching: isFetchingTranslationData,
  } = useTranslationData({
    code: library_language_code,
    refTypeId: typeRefName !== 'dictionary' ? typeRefId: "",
    typeId: typeId,
    query: {
      search: debounceSearchComponent
    },
    options: {
      onSuccess: (data: any) => {
      },
      select: (data: any) => {
        let translations;
        if(typeRefName === 'dictionary') {
          translations = data?.map((translation: any) => (
            {
              id: translation.id,
              key: translation.id,
              keyId: translation.keyId,
              keyName: translation.key,
              languageId: translation.languageId,
              translation: translation.translation,
              file: translation.file,
              group: translation.group,
              componentName: translation.componentName
            }
          ));
        } else {
          let groups: any = {}
          data?.forEach((translation: any) => {
            if(!groups[translation.group]){
              groups[translation.group] = []
            }
              groups[translation.group].push({
                id: translation.id,
                key: translation.id,
                keyId: translation.keyId,
                keyName: translation.key,
                languageId: translation.languageId,
                translation: translation.translation,
                file: translation.file,
                group: translation.group,
                componentName: translation.componentName
              })
          })
          translations = Object.entries(groups)
        }
        return { data: translations }
      }
    },
  });

  const handleMenuDictionary = (value: number) => {
    setOpenInputDictionary(true)
  }

  const handleMenuLibraryLanguageModule = (dropdownSelected: {
    typeId: SetStateAction<number>; label: string; type: string; 
  }) => {
        if(dropdownSelected.label === 'Dictionary') {
          setOpenDictionary(true)
          setOpenNonDictionary(false)
          setOpenInputDictionary(false)
          setOpenInputNonDictionary(false)
        } else {
          setOpenNonDictionary(true)
          setOpenDictionary(false)
          setOpenInputDictionary(false)
          setOpenInputNonDictionary(false)
        }
        setTypeId(dropdownSelected?.typeId)
        setTypeRefName(dropdownSelected?.type?.toLowerCase())
        setSearchFieldsDropdown("")
        setSearchFieldsComponent("")
        setDictionaryInput({})
  }

  const handleInputDictionary = (e: any, language_id: string, id: number, key_id: number) => {
    const newObject = {
      key_id,
      language_id,
      translation: e.target.value,
      id
    }
    const oldArr = {...dictionaryInput, [language_id]: newObject}
    setDictionaryInput(oldArr)
  }

  const handleInputNonDictionary = (e: any, language_id: string, id: number, key_id: number, group: string) => {
    const newObject = {
        key_id,
        language_id,
        translation: e.target.value,
        id
    }
    const oldArr = {...nonDictionaryInput, [group + ' ' + language_id] : newObject}
    setNonDictionaryInput(oldArr)
  }

  const { mutate: updateLibraryLanguage, isLoading: isLoadingUpdateLibraryLanguage } = useSaveLibraryLanguageTranslation({
    options: {
      onSuccess: () => {
        router.back();
        queryClient.invalidateQueries(["language-module-list"]);
      },
    },
  });

  const onSubmit = (data: any) => {
    const newArr = []
    if(typeRefName === 'dictionary'){
      for(const key in dictionaryInput){
        newArr.push(dictionaryInput[key])
      }
    } else {
      for(const key in nonDictionaryInput){
        newArr.push(nonDictionaryInput[key])
      }
    }
    updateLibraryLanguage(newArr);
  };

  if(isLoadingLibraryLanguage ){
    return (
    <Center>
      <Spin tip="Loading data..." />
    </Center>
    )
  }

  return (
    <Col>
      <Row justifyContent="space-between" alignItems="center" nowrap>
        <Row gap="4px" alignItems="center">
        <ArrowLeft style={{ cursor: "pointer" }} onClick={() => router.back()} />
        <Text variant={"h4"}>View {libraryLanguageData?.name}</Text>
        </Row>
        <Row gap="16px">
          <Button size="big" variant={"primary"} onClick={handleSubmit(onSubmit)}>
            {isLoadingUpdateLibraryLanguage? 'Loading...': "Save"}
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
            borderRight: "1px solid #ddd",
            borderRadius: '16px 0 0 16px',
          }}
          >
            <Spacer size={15}/>
            
            <BaseMenu
            mode="inline"
            defaultSelectedKeys={[1]}
            >
              <div style={{display: 'flex'}}>
                <Spacer size={15}/>
                <Search
                width="180px"
                placeholder="Search Cost Center Code, Cost Center Name, etc"
                onChange={(e: any) => {
                  setSearchFields(e.target.value);
                }}
                />
                <Spacer size={15}/>
              </div>
              { isFetchingLibraryLanguage ? (
                <>
                  <Spacer size={15}/>
                  <Center>
                    <Spin/>
                  </Center>
                </>
                ) :
                libraryLanguageData?.data?.map((e: any) => {
                return(
                  <>
                    <BaseMenuItem
                      key={e.key}
                      onClick={() => handleMenuLibraryLanguageModule(e)}
                    >
                    {e.label}
                    </BaseMenuItem>
                  </>
                )
              })}     
            </BaseMenu>       
          </Sider>
          <Layout className="site-layout"
            style={{
              height: '100vh',
              overflow: 'auto',
              background: "#fff",
              borderRadius: "0 16px 16px 0"
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
                      // defaultValue={"mdm.product.field_id"}
                      handleChange={handleMenuDictionary}
                      items={libraryLanguageRefTypeData?.data}
                      placeholder={"Select"}
                      noSearch
                    />
                  </Col>
                </Row>
              )}

              {openNonDictionary && (
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
                        isLoading={isLoadingLibraryLanguageRefType}
                        items={libraryLanguageRefTypeData?.data}
                        onChange={(value: any) => {
                            setTypeRefId(value)
                            setOpenInputNonDictionary(true)
                            onChange(value);
                        }}
                        onSearch={(value: any) => {
                          setSearchFieldsDropdown(value);
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
                      setSearchFieldsComponent(e.target.value);
                    }}
                  />
                  </Col>
                  
                </Row>

                
              )}

              <Spacer size={10} />

              {openInputDictionary && translationData?.data?.map((translation: any) => (
                <div key={translation.languageId}>
                <Spacer size={10} />
                <div style={{display: 'flex', gap: '.5rem', paddingBlockEnd: '.5rem'}}>
                  <img src={translation.file} alt={translation.languageId} width={20} style={{borderRadius: '50%'}}/>
                  <Text variant={"body1"} style={{fontStyle: 'bold'}}>{translation.languageId}</Text>
                </div>
                <CustomTextArea
                  width="100%"
                  label=""
                  style={{padding: "6px 6px 6px 0"}}
                  rows={1}
                  defaultValue={translation.translation}
                  placeholder={"e.g New Translation"}
                  onChange={(e: any) => handleInputDictionary(e, translation.languageId, translation.id, translation.keyId)}
                  />
                <Spacer size={10} />
              </div>
              ))}

              {openInputNonDictionary && translationData?.data?.map((translation: any) => (
                <>
                  <Spacer size={10} />
                    <Accordion key={translation[0]}>
                      <Accordion.Item key={1}>
                        <Accordion.Header>{translation[0]}</Accordion.Header>
                        <Accordion.Body style={{border: 'none'}}>
                          {translation[1]?.map((el: {
                            id: number;
                            keyId: number; file: string | undefined; languageId: string; translation: string; 
                            }) => (
                            <>
                              <Spacer size={10} />
                              <div style={{display: 'flex', gap: '.5rem', marginBlockEnd: '-1rem'}}>
                                <img src={el.file} alt={el.languageId} width={20} style={{borderRadius: '50%'}}/>
                                <Text variant={"h6"} style={{fontStyle: 'bold'}}>{el.languageId}</Text>
                              </div>
                              <CustomTextArea
                                width="100%"
                                label=""
                                style={{padding: "6px 6px 6px 0"}}
                                rows={1}
                                defaultValue={el.translation}
                                placeholder={"e.g New Translation"}
                                onChange={(e: any) => handleInputNonDictionary(e, el.languageId, el.id, el.keyId, translation[0])}
                                />
                              <Spacer size={10} />
                            </>
                          ))}
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                  <Spacer size={10} />
                </>
                ))}
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
  .ant-input:focus {
    border:none;
    box-shadow: none;
  }
`;

const BaseMenu = styled(Menu)`
    border: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
    .ant-menu-item::before {
      border: none;
      border-left: 5px solid white;
    }
    .ant-menu-item::after {
        border: none;
    }
    .ant-menu-item-selected {
      background: #ffe8f5 !important;
      color: black;
      border-left: 5px solid #eb008b;
    }
    .ant-layout {
      border-radius: 16px !important;
      font-weight: normal !important;
    }
`;

const BaseMenuItem = styled(Menu.Item)`
    height: 36px;
    padding: '7px 12px' !important;
    margin: 0 !important;
    display: flex;
    align-items: center;
    color: #000;
    width:'220px' !important;
    .ant-menu-item-selected {
      background: blue;
    }
    span:last-child {
        font-weight: 500;
        font-size: 16px;
        line-height: 22px;
        margin-left: 4px;
    }
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default LibraryLanguageDetail;
