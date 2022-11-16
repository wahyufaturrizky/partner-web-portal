import React, { useEffect, useState } from "react";
import Router from "next/router";
import {
  Accordion,
  Button,
  Checkbox,
  Col,
  Dropdown,
  Input,
  Row,
  Spacer,
  Switch,
  Table,
  Text,
  EmptyState,
  Pagination,
  FormSelect,
  Spin,
} from "pink-lava-ui";
import styled from "styled-components";

import { useConfigs } from "../../../hooks/config/useConfig";
import { useCreatePartnerConfigApprovalList } from "../../../hooks/user-config/useApproval";
import { usePermissions } from "../../../hooks/permission/usePermission";
import { useProcessLists } from "../../../hooks/business-process/useProcess";
import usePagination from "@lucasmogari/react-pagination";
import { Controller, useForm } from "react-hook-form";
import { lang } from "lang";

export interface ConfigModuleList {}

const CreatePartnerConfigApproval: any = () => {
  const t = localStorage.getItem("lan") || "en-US";
  const [approvalStages, setApprovalStages] = useState<any>([{ is_mandatory: false }]);
  const [numberOfApprovalStage, setnumberOfApprovalStage] = useState<any>(1);
  const [associateRoleUserData, setAssociateRoleUserData] = useState([
    { stage: 1, roles: [], users: [], cc_email: false },
  ]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const pagination = usePagination({
    page: 1,
    itemsPerPage: 10,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: numberOfApprovalStage,
  });

  const {
    mutate: mutateCreatePartnerConfigApprovalList,
    isLoading: isLoadingCreatePartnerConfigApprovalList,
  } = useCreatePartnerConfigApprovalList({
    options: {
      onSuccess: (data: any) => {
        Router.back();
      },
    },
  });

  const { data: dataConfigsModule, isLoading: isLoadingConfigModule } = useConfigs({
    options: {
      refetchOnWindowFocus: "always",
      select: (data: any) => {
        const mappedData = data?.rows?.map((element: any) => {
          return {
            id: data.id,
            value: data.name,
          };
        });

        return { data: mappedData, totalRow: data.totalRow };
      },
    },
  });

  const { data: fieldsListProcess, isLoading: isLoadingFieldListProcess } = useProcessLists({
    options: {
      refetchOnWindowFocus: "always",
      select: (data: any) => {
        const mappedData = data?.rows?.map((element: any) => {
          return {
            id: data.id,
            value: data.name,
          };
        });

        return { data: mappedData, totalRow: data.totalRow };
      },
    },
  });

  const { data: fieldsPermissionList, isLoading: isLoadingFieldsPermissionList } = usePermissions({
    options: {
      refetchOnWindowFocus: "always",
      select: (data: any) => {
        const mappedData = data?.rows?.map((element: any) => {
          return {
            id: data.id,
            value: data.name,
          };
        });

        return { data: mappedData, totalRow: data.totalRow };
      },
    },
  });

  const handleChangeInput = (e: any) => {
    // Set Approval Stage
    const value = e.target.value === "" ? "" : Math.max(1, Math.min(50, Number(e.target.value)));
    setnumberOfApprovalStage(value);

    pagination.setTotalItems(numberOfApprovalStage);

    // Lopping Approval Stage
    const lengthValue = value === "" ? 1 : value;

    let approvalStage: any = [];

    for (let i = 0; i < lengthValue; i++) {
      approvalStage.push({ is_mandatory: false });
    }

    setApprovalStages(approvalStage);

    // set Associate role and users data
  };

  const handleDirectAssociated = (name: any) => {
    window.open(`/${name}/create`, "_blank");
  };

  const columnsAssociatedRoles = [
    {
      title: "Stage",
      dataIndex: "stage",
    },
    {
      title: "Role",
      dataIndex: "role",
      render: (value: any, record: any, index: any) => (
        <Controller
          control={control}
          defaultValue={null}
          shouldUnregister={true}
          name={`associate_role_user.${index}.role`}
          render={({ field: { onChange }, formState: { errors } }) => (
            <Dropdown width="200px" items={[]} placeholder={"Select"} noSearch />
          )}
        />
      ),
    },
    {
      title: "User",
      dataIndex: "user",
    },
    {
      title: "Cc Email",
      dataIndex: "cc_email",
      align: "center",
      render: (value: any, record: any, index: any) => (
        <Controller
          control={control}
          defaultValue={false}
          shouldUnregister={true}
          name={`associate_role_user.${index}.cc_email`}
          render={({ field: { onChange }, formState: { errors } }) => (
            <Switch
              checked={false}
              onChange={(value: any) => {
                onChange(!value);
              }}
            />
          )}
        />
      ),
    },
  ];

  const onSubmit = (data: any) => {
    console.log(data);
    // const formData = {
    // 	...data,
    // 	approval_stages: approvalStages.map((dataApprovalStages: any) => ({
    // 		is_mandatory: dataApprovalStages.is_mandatory,
    // 	})),
    // 	is_email_notification: isSendEmailNotif,
    // };

    // mutateCreatePartnerConfigApprovalList(formData);
  };

  return (
    <>
      <Col>
        <Row gap="4px">
          <Text variant="h4">{lang[t].approvalList.modalTitleCreate.approvalList}</Text>
        </Row>
        <Spacer size={20} />
        <Card>
          <Row justifyContent="space-between" alignItems="center" nowrap>
            <Row alignItems="center" gap="4px" noWrap>
              <Row alignItems="center" width="100%" gap="4px" noWrap>
                <Controller
                  control={control}
                  defaultValue={false}
                  name="is_email_notification"
                  render={({ field: { onChange, value }, formState: { errors } }) => (
                    <>
                      <Switch checked={value} onChange={() => onChange(!value)} />
                      <div style={{ cursor: "pointer" }} onClick={() => onChange(!value)}>
                        <Text variant={"h6"}>{lang[t].approvalList.toggle.emailNotification}</Text>
                      </div>
                    </>
                  )}
                />
              </Row>
              <Spacer size={8} />
              <Input
                width="230px"
                label=""
                height="42px"
                placeholder={"Type e.g 1 Reminder (Days)"}
                {...register("reminder_day")}
              />
            </Row>

            <Row>
              <Row gap="16px">
                <Button size="big" variant={"tertiary"} onClick={() => Router.back()}>
                  {lang[t].approvalList.tertier.cancel}
                </Button>
                <Button size="big" variant={"primary"} onClick={handleSubmit(onSubmit)}>
                  {isLoadingCreatePartnerConfigApprovalList ? "loading..." : lang[t].approvalList.primary.save}
                </Button>
              </Row>
            </Row>
          </Row>
        </Card>

        <Spacer size={20} />

        <Accordion>
          <Accordion.Item key={1}>
            <Accordion.Header variant="blue">{lang[t].approvalList.accordion.general}</Accordion.Header>
            <Accordion.Body>
              <Row width="100%" gap="20px" noWrap></Row>
              <Row width="100%" gap="20px" noWrap>
                <Col width="100%">
                  <Input
                    id="name"
                    width="100%"
                    label={lang[t].approvalList.approvalName}
                    height="48px"
                    placeholder={"e.g Payment Name"}
                    required
                    error={errors?.name?.type === "required" && "This field is required"}
                    {...register("name", { required: true })}
                  />
                </Col>
                <Col width="100%">
                  <Controller
                    control={control}
                    defaultValue={null}
                    shouldUnregister={true}
                    name="module_id"
                    render={({ field: { onChange }, formState: { errors } }) => (
                      <Dropdown
                        width="100%"
                        label={lang[t].approvalList.filterbar.module}
                        id="Module"
                        loading={isLoadingConfigModule}
                        items={dataConfigsModule?.data}
                        placeholder={"Select"}
                        handleChange={(value: any) => onChange(value)}
                        noSearch
                      />
                    )}
                  />
                  <Text
                    onClick={() => handleDirectAssociated("module-config")}
                    clickable
                    variant="headingSmall"
                    color="pink.regular"
                  >
                    Go to Associated Module
                  </Text>
                </Col>
              </Row>
              <Spacer size={13} />
              <Row width="100%" gap="20px" noWrap>
                <Col width="100%">
                  <Controller
                    control={control}
                    defaultValue={null}
                    name="process_id"
                    render={({ field: { onChange }, formState: { errors } }) => (
                      <Dropdown
                        width="100%"
                        label={lang[t].approvalList.filterbar.process}
                        loading={isLoadingFieldListProcess}
                        items={fieldsListProcess?.data}
                        placeholder={"Select"}
                        handleChange={(value: any) => onChange(value)}
                        noSearch
                      />
                    )}
                  />
                  <Text
                    onClick={() => handleDirectAssociated("business-process/process")}
                    variant="headingSmall"
                    color="pink.regular"
                    clickable
                  >
                    Go to Associated Process
                  </Text>
                </Col>

                <Col width="100%">
                  <Controller
                    control={control}
                    defaultValue={null}
                    rules={{ required: true }}
                    name="partner_permission_id"
                    render={({ field: { onChange }, formState: { errors } }) => (
                      <Dropdown
                        width="100%"
                        label={lang[t].approvalList.filterbar.permission}
                        loading={isLoadingFieldsPermissionList}
                        items={fieldsPermissionList?.data}
                        placeholder={"Select"}
                        handleChange={(value: any) => onChange(value)}
                        noSearch
                        required
                        error={
                          errors?.partner_permission_id?.type === "required" &&
                          "This field is required"
                        }
                      />
                    )}
                  />
                  <Text
                    onClick={() => handleDirectAssociated("user-config/permission")}
                    variant="headingSmall"
                    color="pink.regular"
                    clickable
                  >
                    Go to Associated Permission
                  </Text>
                </Col>
              </Row>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <Spacer size={20} />

        <Accordion>
          <Accordion.Item key={1}>
            <Accordion.Header variant="blue">{lang[t].approvalList.accordion.approval}</Accordion.Header>
            <Accordion.Body>
              <Row width="100%" gap="20px" noWrap></Row>
              <Row width="100%" gap="20px" noWrap>
                <Col width="50%">
                  <Input
                    id="numberOfApprovalStage"
                    width="100%"
                    label={lang[t].approvalList.emptyState.approval}
                    height="48px"
                    value={numberOfApprovalStage}
                    placeholder={"e.g 1"}
                    onChange={handleChangeInput}
                    type="number"
                  />
                  <Spacer size={24} />
                  <Text clickable variant="headingSmall">
                    Choose mandatory approval stages
                  </Text>

                  <Spacer size={5} />

                  <Row gap="24px">
                    {approvalStages.map((data: any, index: any) => (
                      <Col key={index}>
                        <Row alignItems="center">
                          <Controller
                            control={control}
                            defaultValue={data?.is_mandatory}
                            name={`approval_stages.${index}.is_mandatory`}
                            render={({ field: { onChange, value }, formState: { errors } }) => (
                              <>
                                <Checkbox
                                  checked={value}
                                  onChange={() => {
                                    onChange(!value);
                                  }}
                                />
                                <div>
                                  <Text variant={"h6"}>Stage {index + 1}</Text>
                                </div>
                              </>
                            )}
                          />
                        </Row>
                      </Col>
                    ))}
                  </Row>
                </Col>
              </Row>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <Spacer size={20} />

        <Accordion>
          <Accordion.Item key={1}>
            <Accordion.Header variant="blue">{lang[t].approvalList.accordion.associatedRole}</Accordion.Header>
            <Accordion.Body>
              {approvalStages.length === 0 ? (
                <Col>
                  <Text variant="body1" color="cheese.darker">
                    *Auto added from permission Approval Payment is in the Role below
                  </Text>
                  <Spacer size={20} />
                  <EmptyState
                    image={"/icons/empty-state.svg"}
                    title={"There's no associated role & user yet"}
                    subtitle={`Please add permission to a user/role`}
                    height={214}
                  />
                </Col>
              ) : (
                <Col>
                  <Text variant="body1" color="cheese.darker">
                    *Auto added from permission Approval Payment is in the Role below
                  </Text>
                  <Spacer size={20} />
                  <Table data={associateRoleUserData} columns={columnsAssociatedRoles} />
                  {pagination.totalItems > 5 && <Pagination pagination={pagination} />}
                </Col>
              )}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Col>
    </>
  );
};

const Card: any = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: ${(p: any) => (p.padding ? p.padding : "16px")};
`;

export default CreatePartnerConfigApproval;
