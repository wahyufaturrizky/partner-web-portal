import React, { useState } from "react";
import ModalAddMenu from "components/elements/Modal/ModalAddMenu";
import ModalAddModule from "components/elements/Modal/ModalAddModule";
import Router from "next/router";
import { Accordion, Button, Col, Dropdown, Input, Row, Spacer, Text } from "pink-lava-ui";
import styled from "styled-components";
import { useCreateMenuDesignList } from "hooks/menu-config/useMenuDesign";
import { useForm, Controller } from "react-hook-form";
import TreeMenuDesign from "components/pages/MenuDesign/Tree";
import { DragOutlined } from "@ant-design/icons";

const CreateMenuDesignList: any = () => {
  const { register, handleSubmit, control } = useForm();

  const [showModuleConfig, setShowModuleConfig] = useState(false);
  const [showMenuConfig, setShowMenuConfig] = useState({
    show: false,
    moduleIndex: null,
    subModuleIndex: null,
    selectedRowKeyMenu: [],
  });

  const [selectedRowKeysModule, setSelectedRowKeysModule] = useState([]);
  const [selectedRowKeyTree, setSelectedRowKeyTree] = useState<any>([]);

  const [hierarchyData, setHierarchyData] = useState<any>([]);

  const { mutate: createMenuDesign, isLoading: isLoadingCreateMenuDesign } =
    useCreateMenuDesignList({
      options: {
        onSuccess: (data: any) => {
          Router.back();
        },
      },
    });

  const handleOnDrop = (subModulesChange: any) => {
    const mappingHierarchy = hierarchyData.map((module: any, moduleIndex: any) => {
      return {
        ...module,
        subModules: subModulesChange.map((subModule: any, subModuleIndex: any) => {
          return {
            ...subModule,
            title: (
              <span>
                {subModule?.title?.props?.children[0] || subModule?.title}
                <br />
                <span
                  style={{ color: "#EB008B" }}
                  onClick={() => {
                    setShowMenuConfig({
                      show: true,
                      moduleIndex,
                      subModuleIndex,
                      selectedRowKeyMenu: [],
                    });
                  }}
                >
                  + add menu
                </span>
              </span>
            ),
          };
        }),
      };
    });
    setHierarchyData(mappingHierarchy);
  };

  const handleAddModule = (modules: any) => {
    const mappingHierarchy = modules?.map((module: any, moduleIndex: any) => {
      const moduleObject = hierarchyData?.filter(
        (filterModule: any) => filterModule?.moduleId === module?.module?.moduleId
      );

      if (moduleObject.length > 0) {
        return {
          ...moduleObject[0],
        };
      } else {
        return {
          moduleId: module?.module?.moduleId,
          name: module?.module?.moduleName,
          subModules: module?.subModules?.map((subModule: any, subModuleIndex: any) => {
            return {
              key: `subModule-${subModule?.subModule?.moduleId}`,
              title: (
                <span>
                  {subModule?.subModule?.moduleName} <br />
                  <span
                    style={{ color: "#EB008B" }}
                    onClick={() => {
                      console.log(subModuleIndex);
                      setShowMenuConfig({
                        show: true,
                        moduleIndex,
                        subModuleIndex,
                        selectedRowKeyMenu: [],
                      });
                    }}
                  >
                    + add menu
                  </span>
                </span>
              ),
              icon: (
                <DragOutlined
                  style={{
                    borderRadius: 3,
                    backgroundColor: "#D5FAFD",
                    color: "#2BBECB",
                    padding: 4,
                  }}
                />
              ),
              children: [],
            };
          }),
        };
      }
    });
    setHierarchyData(mappingHierarchy);
    setShowModuleConfig(false);
  };

  const handleAddMenu = (menus: any) => {
    setHierarchyData((prevHierarchy: any) => {
      const mappingHierarcyMenu = prevHierarchy?.map((module: any, moduleIndex: any) => {
        if (moduleIndex === showMenuConfig.moduleIndex) {
          return {
            ...module,
            subModules: module?.subModules?.map((subModule: any, subModuleIndex: any) => {
              if (subModuleIndex === showMenuConfig.subModuleIndex) {
                return {
                  ...subModule,
                  title: (
                    <span>
                      {subModule?.title?.props?.children[0]} <br />
                      <span
                        style={{ color: "#EB008B" }}
                        onClick={() => {
                          const getMenuId = menus?.map((menu: any) => menu.key);
                          setShowMenuConfig({
                            show: true,
                            moduleIndex,
                            subModuleIndex,
                            selectedRowKeyMenu: getMenuId,
                          });
                        }}
                      >
                        + add menu
                      </span>
                    </span>
                  ),
                  children: menus?.map((menu: any) => {
                    return {
                      key: `menu-${menu.key}-${subModuleIndex}`,
                      checkable: false,
                      title: menu.field_name,
                      icon: (
                        <div style={{ marginLeft: 5, marginRight: 3 }}>
                          <DragOutlined
                            style={{
                              borderRadius: 3,
                              backgroundColor: "#D5FAFD",
                              color: "#2BBECB",
                              padding: 4,
                            }}
                          />
                        </div>
                      ),
                    };
                  }),
                };
              } else {
                return subModule;
              }
            }),
          };
        } else {
          return module;
        }
      });

      return mappingHierarcyMenu;
    });

    setShowMenuConfig({
      show: false,
      moduleIndex: null,
      subModuleIndex: null,
      selectedRowKeyMenu: [],
    });
  };

  const handleRemoveMenu = () => {
    const filterHierarchyData = hierarchyData.map((module: any) => {
      return {
        ...module,
        subModules: module?.subModules?.filter((subModule: any) => {
          return !selectedRowKeyTree?.includes(subModule?.key);
        }),
      };
    });
    const mappingHierarchy = filterHierarchyData.map((module: any, moduleIndex: any) => {
      return {
        ...module,
        subModules: module?.subModules?.map((subModule: any, subModuleIndex: any) => {
          return {
            ...subModule,
            title: (
              <span>
                {subModule?.title?.props?.children[0]} <br />
                <span
                  style={{ color: "#EB008B" }}
                  onClick={() => {
                    const getMenuId = subModule?.children?.map((menu: any) =>
                      parseInt(menu?.key?.split("-")[1])
                    );
                    setShowMenuConfig({
                      show: true,
                      moduleIndex,
                      subModuleIndex,
                      selectedRowKeyMenu: getMenuId ?? [],
                    });
                  }}
                >
                  + add menu
                </span>
              </span>
            ),
          };
        }),
      };
    });
    setHierarchyData(mappingHierarchy);
  };

  const submit = (data: any) => {
    const mappingHierarchiesPayload = hierarchyData?.map((module: any) => {
      return {
        module: {
          module_id: module.moduleId,
        },
        sub_modules: module.subModules.map((subModule: any) => {
          return {
            sub_module: {
              module_id: parseInt(subModule?.key?.split("-")[1]),
            },
            menus: subModule?.children.map((menu: any) => {
              return {
                menu_id: parseInt(menu.key?.split("-")[1]),
              };
            }),
          };
        }),
      };
    });

    const formData = {
      ...data,
      hierarchies: mappingHierarchiesPayload,
    };

    createMenuDesign(formData);
    // console.log(formData);
  };

  return (
    <>
      <Col>
        <Row gap="4px">
          <Text variant={"h4"}>Create Menu Design</Text>
        </Row>
        <Card padding="20px">
          <Row justifyContent="space-between" alignItems="center" nowrap>
            <Controller
              control={control}
              defaultValue={"Y"}
              name="status"
              render={({ field: { onChange, value }, formState: { errors } }) => (
                <>
                  <Dropdown
                    width="185px"
                    label=""
                    isHtml
                    items={[
                      { id: "Y", value: '<div key="1" style="color:green;">Active</div>' },
                      { id: "N", value: '<div key="2" style="color:red;">Non Active</div>' },
                    ]}
                    defaultValue={value}
                    placeholder={"Select"}
                    handleChange={(value: any) => {
                      onChange(value);
                    }}
                    noSearch
                  />
                </>
              )}
            />

            <Row gap="16px">
              <Button size="big" variant={"tertiary"} onClick={() => Router.back()}>
                Cancel
              </Button>
              <Button size="big" variant={"primary"} onClick={handleSubmit(submit)}>
                {isLoadingCreateMenuDesign ? "loading..." : "Save"}
              </Button>
            </Row>
          </Row>
        </Card>

        <Spacer size={20} />

        <Accordion>
          <Accordion.Item key={1}>
            <Accordion.Header variant="blue">General</Accordion.Header>
            <Accordion.Body>
              <Row width="50%" gap="20px" noWrap>
                <Col width="100%">
                  <Input
                    id="name"
                    width="100%"
                    label="Name"
                    height="48px"
                    placeholder={"e.g Shipment and Delivery"}
                    {...register("name")}
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
              <Row gap="8px" alignItems="baseline">
                Hirarchy Menu
              </Row>
            </Accordion.Header>
            <Accordion.Body>
              <Row>
                <Button size="big" variant={"primary"} onClick={() => setShowModuleConfig(true)}>
                  Add Module
                </Button>

                <Spacer size={16} />

                <Button
                  size="big"
                  variant={"secondary"}
                  disabled={selectedRowKeyTree?.length === 0}
                  onClick={handleRemoveMenu}
                >
                  Remove
                </Button>
              </Row>

              <Spacer size={16} />

              {hierarchyData?.map((module: any, index: any) => (
                <Accordion key={module.moduleId} style={{ marginBottom: 10 }}>
                  <Accordion.Item key={index}>
                    <Accordion.Header>
                      <Text variant={"headingMedium"}>{module.name}</Text>
                    </Accordion.Header>
                    <Accordion.Body padding="10px">
                      <TreeMenuDesign
                        subModuleData={module.subModules}
                        onCheck={(checkedValue: any, info: any) => {
                          setSelectedRowKeyTree(checkedValue);
                        }}
                        onSelect={(selectedKey: any, info: any) => {
                          // console.log(selectedKey);
                          // console.log(info);
                        }}
                        onDropMenu={handleOnDrop}
                      />
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              ))}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Col>

      {showModuleConfig && (
        <ModalAddModule
          show={showModuleConfig}
          onCancel={() => {
            setShowModuleConfig(false);
          }}
          selectedRowKeys={selectedRowKeysModule}
          setSelectedRowKeys={(value: any) => {
            setSelectedRowKeysModule(value);
          }}
          onSuccess={handleAddModule}
        />
      )}

      {showMenuConfig.show && (
        <ModalAddMenu
          show={showMenuConfig.show}
          onCancel={() => {
            setShowMenuConfig({
              show: false,
              moduleIndex: null,
              subModuleIndex: null,
              selectedRowKeyMenu: [],
            });
          }}
          selectedRowKeys={showMenuConfig.selectedRowKeyMenu}
          onAddMenu={handleAddMenu}
        />
      )}
    </>
  );
};

const Card: any = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: ${(p: any) => (p.padding ? p.padding : "16px")};
`;

export default CreateMenuDesignList;
