import React, { useState } from "react";
import { Dropdown, Spin } from "pink-lava-ui";
import styled from "styled-components";
import { Controller } from "react-hook-form";
import { usePartnerConfigPermissionList } from "hooks/user-config/usePermission";
import { usePartnerUserApprovalList } from "hooks/user-config/useApproval";

const AssociateUserRole = ({ type, control, roleList, setRoleList, index, idPermission, handleRoleChange }: any) => {
  const companyCode = localStorage.getItem("companyCode");
  const [roleId, setRoleId] = useState<any>(undefined);
  const [userList, setUserList] = useState([]);

  const { isLoading: isLoadingPartnerConfigPermissionList } = usePartnerConfigPermissionList({
    partner_config_menu_list_id: idPermission,
    options: {
      onSuccess: (data: any) => {
        const mapedData = data?.associatedRole?.map((el: any) => {
          return {
            id: el.id,
            value: el.name,
          };
        });

        setRoleList(mapedData);
      },
      enabled: !!idPermission,
    },
  });

  const { isLoading: isLoadingPartnerUserApprovalList } = usePartnerUserApprovalList({
    company_id: companyCode,
    role_id: roleId,
    options: {
      onSuccess: (data: any) => {
        // console.log(data);
        const mapedData = data?.map((el: any) => {
          return {
            id: el.id,
            value: el.name,
          };
        });

        setUserList(mapedData);
      },
      enabled: !!roleId,
    },
  });

  return (
    <>
      {type === "role" &&
        (isLoadingPartnerConfigPermissionList ? (
          <Center>
            <Spin tip="Loading Data..." />
          </Center>
        ) : (
          <Controller
            control={control}
            defaultValue={null}
            shouldUnregister={true}
            // rules={{ required: true }}
            name={`associate_role_user.${index}.partner_role_id`}
            render={({ field: { onChange }, formState: { errors } }) => (
              <Dropdown
                width="200px"
                items={roleList}
                placeholder={"Select"}
                handleChange={(value: any) => {
                  onChange(value);
                  setRoleId(Number(value));
                  handleRoleChange()
                }}
                noSearch
                // error={
                //   errors?.associate_role_user?.[index]?.partner_role_id?.type === "required" &&
                //   "This field is required"
                // }
              />
            )}
          />
        ))}
      {type === "user" &&
        (isLoadingPartnerUserApprovalList ? (
          <Center>
            <Spin tip="Loading Data..." />
          </Center>
        ) : (
          <Controller
            control={control}
            defaultValue={null}
            shouldUnregister={true}
            // rules={{ required: true }}
            name={`associate_role_user.${index}.partner_user_id`}
            render={({ field: { onChange }, formState: { errors } }) => (
              <Dropdown
                width="200px"
                items={userList}
                placeholder={"Select"}
                noSearch
                handleChange={(value: any) => {
                  onChange(value);
                }}
              />
            )}
          />
        ))}
    </>
  );
};

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default AssociateUserRole;
