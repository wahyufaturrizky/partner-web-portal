import { yupResolver } from "@hookform/resolvers/yup";
import Router from "next/router";
import { Accordion, Button, Col, Dropdown, Input, Row, Spacer, Spin, Text } from "pink-lava-ui";
import React from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import * as yup from "yup";
import ArrowLeft from "../../../assets/icons/arrow-left.svg";

import { useMenuLists } from "../../../hooks/menu-config/useMenuConfig";
import { useCreatePartnerConfigPermissionList } from "../../../hooks/user-config/usePermission";
import { useRolePermissions } from "../../../hooks/role/useRole";

const schema = yup
  .object({
    name: yup.string().required("Name is Required"),
    menuId: yup.string().required("Associated Menu is Required"),
    activeStatus: yup.string().required(),
  })
  .required();

const defaultValue = {
  activeStatus: "Y",
};

const CreatePartnerConfigPermissionList: any = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultValue,
  });

  const { mutate: mutatePartnerConfigPermissionList } = useCreatePartnerConfigPermissionList({
    options: {
      onSuccess: () => {
        window.alert("Permission partner success created!");
        Router.back();
      },
      onError: (error) => {
        window.alert(error.errors.map((data) => `${data.label} ${data.message}`));
      },
    },
  });

  const { data: menuLists } = useMenuLists({
    query: { limit: 0, owner: "HERMES" },
    options: {
      refetchOnWindowFocus: "always",
    },
  });
  const menus = menuLists?.rows?.map((menu) => ({ id: menu.id, value: menu.name }));
  const onSubmit = (data) => mutatePartnerConfigPermissionList(data);

  const activeStatus = [
    { id: "Y", value: '<div key="1" style="color:green;">Active</div>' },
    { id: "N", value: '<div key="2" style="color:red;">Non Active</div>' },
  ];

  const valueIsSystemConfig = [
    {
      id: true,
      value: "True",
    },
    {
      id: false,
      value: "False",
    },
  ];

  const handleAddNewAssociated = () => {
    window.open("/menu-config/create", "_blank");
  };

  const { data: fieldRole, isLoading: isLoadingFieldRole } = useRolePermissions();

  return (
    <>
      <Col>
        <Row gap="4px" alignItems="center">
          <ArrowLeft style={{ cursor: "pointer" }} onClick={() => Router.back()} />
          <Text variant={"h4"}>Permission List</Text>
        </Row>
        <Spacer size={12} />
        <Card padding="20px">
          <Row justifyContent="space-between" alignItems="center" nowrap>
            <Dropdown
              label=""
              isHtml
              width={"185px"}
              items={activeStatus}
              placeholder={"Status"}
              handleChange={(text) => setValue("activeStatus", text)}
              noSearch
              defaultValue="Y"
            />
            <Row>
              <Row gap="16px">
                <Button size="big" variant={"tertiary"} onClick={() => Router.back()}>
                  Cancel
                </Button>
                <Button size="big" variant={"primary"} onClick={handleSubmit(onSubmit)}>
                  Save
                </Button>
              </Row>
            </Row>
          </Row>
        </Card>

        <Spacer size={20} />
        {/* <Alert>
					<Text variant="subtitle2" color="white">
						“General” Associated Menu must be filled.
					</Text>
				</Alert>
				<Spacer size={20} /> */}

        <Accordion>
          <Accordion.Item key={1}>
            <Accordion.Header variant="blue">General</Accordion.Header>
            <Accordion.Body>
              <Row width="100%" gap="20px" noWrap>
                <Input
                  width="100%"
                  label="Name"
                  height="48px"
                  placeholder={"e.g View Shipment"}
                  {...register("name", { required: true })}
                />
                <Dropdown
                  label="Associated Menu"
                  handleClickActionLabel={handleAddNewAssociated}
                  isShowActionLabel
                  actionLabel="Add New Associated Menu"
                  width={"100%"}
                  items={menus}
                  placeholder={"Select"}
                  handleChange={(value) => setValue("menuId", value)}
                  noSearch
                />
              </Row>
              <Row width="50%" gap="20px" noWrap>
                <Dropdown
                  label="Is System Config"
                  width={"100%"}
                  items={valueIsSystemConfig}
                  placeholder={"Select"}
                  handleChange={(value) => setValue("isSystemConfig", value)}
                  noSearch
                />
              </Row>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <Spacer size={20} />

        <Accordion>
          <Accordion.Item key={1}>
            <Accordion.Header variant="blue">
              <Row gap="8px" alignItems="baseline">
                Associated Role <Span>(Auto added from roles)</Span>
              </Row>
            </Accordion.Header>
            <Accordion.Body>
              <Accordion>
                <Accordion.Item key={1}>
                  <Accordion.Header>Roles</Accordion.Header>
                  <Accordion.Body padding="0px">
                    {isLoadingFieldRole ? (
                      <Spin tip="Loading roles..." />
                    ) : (
                      fieldRole.rows.map((data) => (
                        <Record borderTop key={data.id}>
                          {data.name}

                          <Button
                            size="small"
                            onClick={() => Router.push(`/role/${data.id}`)}
                            variant="tertiary"
                          >
                            View Detail
                          </Button>
                        </Record>
                      ))
                    )}
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Col>
    </>
  );
};

const Span = styled.div`
	font-size: 14px;
	line-height: 18px;
	font-weight: normal;
	color: #ffe12e;
`;

const Card = styled.div`
	background: #ffffff;
	border-radius: 16px;
	padding: ${(p) => (p.padding ? p.padding : "16px")};
`;

const Record = styled.div`
	height: 54px;
	padding: 0px 20px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-top: ${(p) => (p.borderTop ? "0.5px solid #AAAAAA" : "none")};
`;

export default CreatePartnerConfigPermissionList;
