import Router, { useRouter } from "next/router";
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
  Spin,
  Pagination,
  EmptyState,
} from "pink-lava-ui";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import {
  usePartnerConfigPermissionLists,
  useUserPermissions,
} from "hooks/user-config/usePermission";
import { lang } from "lang";
import ArrowLeft from "assets/icons/arrow-left.svg";
import { useForm, Controller } from "react-hook-form";
import usePagination from "@lucasmogari/react-pagination";
import AssociateUserRole from "components/pages/userConfig/Approval/AssociateUserRole";
import UserField from "components/pages/userConfig/Approval/UserField";
import {
  useDeletePartnerConfigApprovalList,
  usePartnerConfigApprovalList,
  useUpdatePartnerConfigApprovalList,
} from "../../../../hooks/user-config/useApproval";
import { useConfigs } from "../../../../hooks/config/useConfig";
import { ModalDeleteConfirmation } from "../../../../components/elements/Modal/ModalConfirmationDelete";
import { useProcessLists } from "../../../../hooks/business-process/useProcess";

export interface ConfigModuleList {}

const DetailUserConfigApproval: any = () => {
  const { approval_id } = Router.query;

  const t = localStorage.getItem("lan") || "en-US";
  const companyCode = localStorage.getItem("companyCode");

  const [modalDelete, setModalDelete] = useState({ open: false });
  const [approvalStages, setApprovalStages] = useState<any>([{ is_mandatory: false }]);
  const [numberOfApprovalStage, setnumberOfApprovalStage] = useState<any>(1);
  const [associateRoleUserData, setAssociateRoleUserData] = useState([
    {
      stage: 1,
      roles: 0,
      users: 0,
      cc_email: false,
    },
  ]);
  const [roleList, setRoleList] = useState([]);
  const [indexRole, setIndexRole] = useState(0);
  const [roleId, setRoleId] = useState<any>(undefined);
  const [idPermission, setIdPermision] = useState<any>(undefined);
  const [firstFetch, setFirstFetch] = useState(true);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm();

  const pagination = usePagination({
    page: 1,
    itemsPerPage: 20,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: numberOfApprovalStage,
  });

  const {
    mutate: mutateUpdatePartnerConfigApprovalList,
    isLoading: isLoadingUpdatePartnerConfigApprovalList,
  } = useUpdatePartnerConfigApprovalList({
    partnerConfigApprovalListId: approval_id,
    options: {
      onSuccess: () => {
        Router.back();
      },
    },
  });

  const { data: dataConfigsModule, isLoading: isLoadingConfigModule } = useConfigs({
    query: {
      page: 1,
      limit: 1000,
    },
    options: {
      refetchOnWindowFocus: "always",
      select: (data: any) => {
        const mappedData = data?.rows?.map((element: any) => ({
          id: element.id,
          value: element.name,
        }));

        return { data: mappedData, totalRow: data.totalRow };
      },
    },
  });

  const { data: fieldsListProcess, isLoading: isLoadingFieldListProcess } = useProcessLists({
    query: {
      page: 1,
      limit: 1000,
      company_id: companyCode,
    },
    options: {
      refetchOnWindowFocus: "always",
      select: (data: any) => {
        const mappedData = data?.rows?.map((element: any) => ({
          id: element.id,
          value: element.name,
        }));

        return { data: mappedData, totalRow: data.totalRow };
      },
    },
  });

  const { data: fieldsPermissionList, isLoading: isLoadingFieldsPermissionList } =
    usePartnerConfigPermissionLists({
      query: {
        page: 1,
        limit: 1000,
        approvalPage: true,
        isEdit: true,
        permissionId: getValues("partner_permission_id"),
      },
      options: {
        refetchOnWindowFocus: "always",
        select: (data: any) => {
          const mappedData = data?.rows?.map((element: any) => ({
            id: element.id,
            value: element.name,
          }));

          return { data: mappedData, totalRow: data.totalRow };
        },
      },
    });

  const { mutate: deleteApproval }: any = useDeletePartnerConfigApprovalList({
    options: {
      onSuccess: () => {
        Router.back();
      },
    },
  });

  const {
    data: dataPartnerConfigApprovalList,
    isLoading: isLoadingPartnerConfigApprovalList,
    isFetched,
  } = usePartnerConfigApprovalList({
    partner_config_approval_list_id: approval_id,
    company_id: companyCode,
    options: {
      onSuccess: (data: any) => {
        const mappingApprovalStages = data?.partnerApprovalStages?.map((el: any) => ({
          is_mandatory: el.isMandatory,
        }));

        setApprovalStages(mappingApprovalStages);
        setnumberOfApprovalStage(mappingApprovalStages?.length);

        const sortAssociateRoleUserData =
          data?.partnerApprovalStages?.sort((a: any, b: any) =>
            a.stage > b.stage ? 1 : b.stage > a.stage ? -1 : 0
          ) ?? [];

        const mappingAssociateRoleUserData = sortAssociateRoleUserData.map(
          (el: any, index: any) => ({
            stage: el.stage,
            roles: el?.partnerRoleId,
            users: el?.partnerUserId,
            cc_email: el?.isCcEmail,
          })
        );

        const mappingDefaultValue = sortAssociateRoleUserData.map((el: any, index: any) => ({
          partner_role_id: el?.partnerRoleId,
          partner_user_id: el?.partnerUserId,
          is_cc_email: el?.isCcEmail,
        }));

        setAssociateRoleUserData(mappingAssociateRoleUserData);
        setValue("associate_role_user", mappingDefaultValue);
        setIdPermision(data?.partnerPermissionId);

        const mappingApprovalStagesValue = sortAssociateRoleUserData.map((el: any, index: any) => ({
          is_mandatory: el?.isMandatory,
        }));

        setValue("approval_stages", mappingApprovalStagesValue);

        setValue("is_email_notification", data?.isEmailNotification);
        setValue("reminder_day", data?.reminderDay);
        setValue("name", data?.name);
        setValue("module_id", data?.moduleId);
        setValue("process_id", data?.processId);
        setValue("partner_permission_id", data?.partnerPermissionId);
      },
    },
  });

  useEffect(() => {
    if (isFetched) {
      setFirstFetch(false);
    }
  }, [isFetched]);

  const handleChangeInput = (e: any) => {
    // Set Approval Stage
    const value = e.target.value === "" ? "" : Math.max(1, Math.min(50, Number(e.target.value)));
    setnumberOfApprovalStage(value);

    pagination.setTotalItems(numberOfApprovalStage);

    // Lopping Approval Stage
    const lengthValue = value === "" ? 1 : value;

    const approvalStage: any = [];

    for (let i = 0; i < lengthValue; i++) {
      approvalStage.push({ is_mandatory: false });
    }

    setApprovalStages(approvalStage);

    // set Associate role and users data
    const associateRoleUser: any = [];

    for (let i = 0; i < lengthValue; i++) {
      associateRoleUser.push({
        stage: i + 1,
        roles: 0,
        users: 0,
        cc_email: false,
      });
    }

    setAssociateRoleUserData(associateRoleUser);
  };

  const handleDirectAssociated = (name: any) => {
    window.open(`/${name}/create`, "_blank");
  };

  const columnsAssociatedRoles = [
    {
      title: "Stage",
      dataIndex: "stage",
      width: "5%",
    },
    {
      title: "Role",
      dataIndex: "roles",
      width: "15%",
      render: (value: any, record: any, index: any) => (
        <AssociateUserRole
          type="role"
          index={index}
          control={control}
          roleList={roleList}
          valueApprovalStages={numberOfApprovalStage}
          handleRoleChange={() => {
            // setValue(`associate_role_user.${index}.partner_user_id`, undefined);
          }}
          setRolesID={(id: any) => {
            setRoleId(id);
            setIndexRole(index);
          }}
          setRoleList={(data: any) => {
            setRoleList(data);
          }}
          idPermission={idPermission}
        />
      ),
    },
    {
      title: "User",
      dataIndex: "users",
      width: "15%",
      render: (value: any, record: any, index: any) => (
        <UserField
          control={control}
          index={index}
          roleId={roleId || record.roles}
          // roleId={firstFetch ? record.roles : roleId}
          // indexRole={indexRole}
          indexRole={firstFetch ? index : indexRole}
          type="update"
        />
      ),
    },
    {
      title: "Cc Email",
      dataIndex: "cc_email",
      align: "center",
      width: "15%",
      render: (value: any, record: any, index: any) => (
        <Controller
          control={control}
          defaultValue={value}
          shouldUnregister
          name={`associate_role_user.${index}.is_cc_email`}
          render={({ field: { onChange, value }, formState: { errors } }) => (
            <Switch
              checked={value}
              onChange={(value: any) => {
                onChange(value);
              }}
            />
          )}
        />
      ),
    },
  ];
  const { data: dataUserPermission } = useUserPermissions({
    options: {
      onSuccess: () => {},
    },
  });

  const listPermission = dataUserPermission?.permission?.filter(
    (filtering: any) => filtering.menu === "Approval List"
  );
  const onSubmit = (data: any) => {
    const length = numberOfApprovalStage === "" ? 1 : numberOfApprovalStage;

    const approval_stages: any = [];

    for (let i = 0; i < length; i++) {
      approval_stages.push({
        stage: i + 1,
        ...data?.associate_role_user[i],
        ...data?.approval_stages[i],
      });
    }

    delete data?.associate_role_user;
    delete data?.approval_stages;

    const formData = {
      ...data,
      reminder_day: data?.reminder_day === "" ? 0 : data?.reminder_day,
      approval_stages,
      company_id: companyCode,
    };

    mutateUpdatePartnerConfigApprovalList(formData);
  };

  if (isLoadingPartnerConfigApprovalList) {
    return (
      <Center>
        <Spin tip="Loading Data..." />
      </Center>
    );
  }

  return (
    <>
      <Col>
        <Row gap="4px" alignItems="center">
          <ArrowLeft style={{ cursor: "pointer" }} onClick={() => Router.back()} />
          <Text variant="h4">Approval Partner Detail - {dataPartnerConfigApprovalList?.name}</Text>
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
                        <Text variant="h6">{lang[t].approvalList.toggle.emailNotification}</Text>
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
                placeholder="Type e.g 1 Reminder (Days)"
                {...register("reminder_day")}
              />
            </Row>

            <Row>
              <Row gap="16px">
                <Button size="big" variant="tertiary" onClick={() => Router.back()}>
                  {lang[t].approvalList.tertier.cancel}
                </Button>

                {listPermission?.filter((x: any) => x.viewTypes[0]?.viewType.name === "Update")
                  .length > 0 && (
                  <Button size="big" variant="primary" onClick={handleSubmit(onSubmit)}>
                    {isLoadingUpdatePartnerConfigApprovalList
                      ? "loading..."
                      : lang[t].approvalList.primary.save}
                  </Button>
                )}
              </Row>
            </Row>
          </Row>
        </Card>

        <Spacer size={20} />

        <Accordion style={{ display: "relative" }} id="area">
          <Accordion.Item key={1}>
            <Accordion.Header variant="blue">
              {lang[t].approvalList.accordion.general}
            </Accordion.Header>
            <Accordion.Body>
              <Row width="100%" gap="20px" noWrap />
              <Row width="100%" gap="20px" noWrap>
                <Col width="100%">
                  <Input
                    id="name"
                    width="100%"
                    label={lang[t].approvalList.approvalName}
                    height="48px"
                    placeholder="e.g Payment Name"
                    required
                    error={errors?.name?.type === "required" && "This field is required"}
                    {...register("name", { required: true })}
                  />
                </Col>
                <Col width="100%">
                  <Controller
                    control={control}
                    defaultValue={null}
                    shouldUnregister
                    name="module_id"
                    render={({ field: { onChange, value }, formState: { errors } }) => (
                      <Dropdown
                        width="100%"
                        containerId="area"
                        defaultValue={value}
                        label={lang[t].approvalList.filterbar.module}
                        id="Module"
                        loading={isLoadingConfigModule}
                        items={dataConfigsModule?.data}
                        placeholder="Select"
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
                    render={({ field: { onChange, value }, formState: { errors } }) => (
                      <Dropdown
                        width="100%"
                        defaultValue={value}
                        containerId="area"
                        label={lang[t].approvalList.filterbar.process}
                        loading={isLoadingFieldListProcess}
                        items={fieldsListProcess?.data}
                        placeholder="Select"
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
                    render={({ field: { onChange, value }, formState: { errors } }) => (
                      <Dropdown
                        width="100%"
                        defaultValue={value}
                        containerId="area"
                        label={lang[t].approvalList.filterbar.permission}
                        loading={isLoadingFieldsPermissionList}
                        items={fieldsPermissionList?.data}
                        placeholder="Select"
                        handleChange={(value: any) => {
                          onChange(value);
                          setIdPermision(Number(value));
                        }}
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
            <Accordion.Header variant="blue">
              {lang[t].approvalList.accordion.approval}
            </Accordion.Header>
            <Accordion.Body>
              <Col width="100%">
                <Row width="50%">
                  <Input
                    id="numberOfApprovalStage"
                    width="50%"
                    label={lang[t].approvalList.emptyState.approval}
                    height="48px"
                    value={numberOfApprovalStage}
                    placeholder="e.g 1"
                    onChange={handleChangeInput}
                    type="number"
                  />
                </Row>

                <Spacer size={24} />

                <Text clickable variant="headingSmall">
                  Choose mandatory approval stages
                </Text>

                <Spacer size={5} />

                <Grid gap="24px">
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
                                <Text variant="h6">Stage {index + 1}</Text>
                              </div>
                            </>
                          )}
                        />
                      </Row>
                    </Col>
                  ))}
                </Grid>
              </Col>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <Spacer size={20} />

        <Accordion>
          <Accordion.Item key={1}>
            <Accordion.Header variant="blue">
              {lang[t].approvalList.accordion.associatedRole}
            </Accordion.Header>
            <Accordion.Body>
              {approvalStages.length === 0 ? (
                <Col>
                  <Text variant="body1" color="cheese.darker">
                    *Auto added from permission Approval Payment is in the Role below
                  </Text>
                  <Spacer size={20} />
                  <EmptyState
                    image="/icons/empty-state.svg"
                    title={"There's no associated role & user yet"}
                    subtitle="Please add permission to a user/role"
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

      {modalDelete.open && (
        <ModalDeleteConfirmation
          itemTitle={dataPartnerConfigApprovalList?.name}
          visible={modalDelete.open}
          onCancel={() => setModalDelete({ open: false })}
          onOk={() => deleteApproval({ id: [Number(approval_id)] })}
        />
      )}
    </>
  );
};

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 20px;
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: ${(p) => (p.padding ? p.padding : "16px")};
`;

export default DetailUserConfigApproval;
