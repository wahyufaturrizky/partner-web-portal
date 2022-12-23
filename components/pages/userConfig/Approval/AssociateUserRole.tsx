import React, { useEffect, useState, useRef } from "react";
import { Dropdown, Spin } from "pink-lava-ui";
import styled from "styled-components";
import { Controller, useWatch } from "react-hook-form";
import { usePartnerConfigPermissionList } from "hooks/user-config/usePermission";
import { usePartnerUserApprovalList } from "hooks/user-config/useApproval";
import UserField from "./UserField";

const AssociateUserRole = ({
  type,
  control,
  index,
  setRolesID,
  idPermission,
  valueApprovalStages,
  handleRoleChange,
  indexUser,
}: any) => {
  const [roleList, setRoleList] = useState([]);
  // const [roleId, setRoleId] = useState<any>(undefined);

  const initialRender = useRef(true);

  const {
    isLoading: isLoadingPartnerConfigPermissionList,
    isRefetching: isRefetchingPartnerConfigPermissionList,
    refetch,
  } = usePartnerConfigPermissionList({
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

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    if (idPermission) {
      const handler = setTimeout(() => {
        refetch();
      }, 1000);

      return () => {
        clearTimeout(handler);
      };
    }
  }, [valueApprovalStages]);

  return (
    <>
      {isLoadingPartnerConfigPermissionList || isRefetchingPartnerConfigPermissionList ? (
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
          render={({ field: { onChange, value }, formState: { errors } }) => (
            <Dropdown
              width="200px"
              defaultValue={value}
              items={roleList}
              placeholder={"Select"}
              handleChange={(value: any) => {
                onChange(value);
                setRolesID(Number(value));
                // setRoleId(Number(value));
                // handleRoleChange();
                // setRoleIndex(index);
              }}
              noSearch
              // error={
              //   errors?.associate_role_user?.[index]?.partner_role_id?.type === "required" &&
              //   "This field is required"
              // }
            />
          )}
        />
      )}
      {/* {type === "user" && (
        <UserField control={control} index={index} roleId={roleId} indexRole={index}/>
      )} */}
    </>
  );
};

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default AssociateUserRole;
