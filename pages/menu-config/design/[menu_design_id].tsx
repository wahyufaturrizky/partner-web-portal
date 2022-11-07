import React, { useState } from "react";
import ModalAddMenu from "components/elements/Modal/ModalAddMenu";
import ModalAddModule from "components/elements/Modal/ModalAddModule";
import { useRouter } from "next/router";
import { Accordion, Button, Col, Dropdown, Input, Row, Spacer, Text, Spin } from "pink-lava-ui";
import styled from "styled-components";
import {
  useUpdateMenuDesignList,
  useMenuDesignList,
  useDeleteMenuDesignList,
} from "hooks/menu-config/useMenuDesign";
import { useForm, Controller } from "react-hook-form";
import TreeMenuDesign from "components/pages/MenuDesign/Tree";
import { DragOutlined } from "@ant-design/icons";
import { ModalDeleteConfirmation } from "components/elements/Modal/ModalConfirmationDelete";
import { queryClient } from "pages/_app";
import ArrowLeft from "../../assets/arrow-left.svg";

const CreateMenuDesignList: any = () => {
  const router = useRouter();

  const { menu_design_id } = router.query;

  const { register, handleSubmit, control, setValue } = useForm();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
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

  const {
    data: menuDesignData,
    isLoading: isLoadingMenuDesign,
    isFetching: isFetchingMenuDesign,
  } = useMenuDesignList({
    id: menu_design_id,
    options: {
      onSuccess: (data: any) => {
        const mappingHierarchyData = data?.hierarchies?.map((module: any, moduleIndex: any) => {
          return {
            id: module?.module?.id,
            moduleId: module?.module?.moduleId,
            name: module?.module?.moduleName,
            subModules: module?.subModules?.map((subModule: any, subModuleIndex: any) => {
              return {
                id: subModule?.subModule?.id,
                key: `subModule-${subModule?.subModule?.moduleId}`,
                title: (
                  <span>
                    {subModule?.subModule?.moduleName} <br />
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
                children: subModule?.menus?.map((menu: any) => {
                  return {
                    id: menu?.id,
                    key: `menu-${menu.menuId}-${subModuleIndex}`,
                    checkable: false,
                    title: menu.menuName,
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
            }),
          };
        });

        setHierarchyData(mappingHierarchyData);
      },
    },
  });

  const { mutate: updateMenuDesign, isLoading: isLoadingUpdateMenuDesign } =
    useUpdateMenuDesignList({
      id: menu_design_id,
      options: {
        onSuccess: (data: any) => {
          router.back();
          queryClient.invalidateQueries(["menu/design"]);
        },
      },
    });

  const { mutate: deleteMenuDesign, isLoading: isLoadingDeleteMenuDesign }: any =
    useDeleteMenuDesignList({
      options: {
        onSuccess: () => {
          queryClient.invalidateQueries(["working-calendars"]);
          setShowDeleteModal(false);
          router.back();
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
          id: module?.id,
          module_id: module.moduleId,
          flag_removal: false,
        },
        sub_modules: module.subModules.map((subModule: any) => {
          return {
            sub_module: {
              id: subModule?.id,
              module_id: parseInt(subModule?.key?.split("-")[1]),
              flag_removal: false,
            },
            menus: subModule?.children.map((menu: any) => {
              return {
                id: menu?.id,
                menu_id: parseInt(menu.key?.split("-")[1]),
                flag_removal: false,
              };
            }),
          };
        }),
      };
    });

    const formData = {
      ...data,
      status: data?.status === "Active" || data?.status === "Y" ? "Y" : "N",
      hierarchies: mappingHierarchiesPayload,
    };

    updateMenuDesign(formData);
  };

  if (isLoadingMenuDesign || isFetchingMenuDesign)
    return (
      <Center>
        <Spin tip="Loading data..." />
      </Center>
    );

  return (
    <>
      <Col>
        <Row gap="4px" alignItems="center">
          <ArrowLeft style={{ cursor: "pointer" }} onClick={() => router.back()} />
          <Text variant={"h4"}>Menu Design - {menuDesignData?.name}</Text>
        </Row>
        <Card padding="20px">
          <Row justifyContent="space-between" alignItems="center" nowrap>
            <Controller
              control={control}
              defaultValue={menuDesignData?.status}
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
              <Button size="big" variant={"tertiary"} onClick={() => setShowDeleteModal(true)}>
                Delete
              </Button>
              <Button size="big" variant={"primary"} onClick={handleSubmit(submit)}>
                {isLoadingUpdateMenuDesign ? "loading..." : "Save"}
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
                    defaultValue={menuDesignData?.name}
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
                <Accordion key={module.moduleId}>
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

      {showDeleteModal && (
        <ModalDeleteConfirmation
          totalSelected={1}
          itemTitle={menuDesignData?.name}
          visible={showDeleteModal}
          isLoading={isLoadingDeleteMenuDesign}
          onCancel={() => setShowDeleteModal(false)}
          onOk={() => deleteMenuDesign({ ids: [menu_design_id] })}
        />
      )}
    </>
  );
};

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Card: any = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: ${(p: any) => (p.padding ? p.padding : "16px")};
`;

export default CreateMenuDesignList;
