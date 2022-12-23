import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Dropdown, Spin } from "pink-lava-ui";
import { Controller, useWatch } from "react-hook-form";
import { usePartnerUserApprovalList } from "hooks/user-config/useApproval";
import axios from "axios";

const UserField = ({ control, index, roleId, indexRole, type }) => {
  const companyCode = localStorage.getItem("companyCode");
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (roleId && index === indexRole) {
      async function getCompanyList() {
        const token = localStorage.getItem("token");
        const apiURL = process.env.NEXT_PUBLIC_API_BASE;
        setIsLoading(true);
        await axios
          .get(`${apiURL}/partner-approval/users/${companyCode}/${roleId}`, {
            params: {},
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            const mappingUserData = res?.data?.data.map((el: any) => {
              return {
                id: el.id,
                value: el.name,
              };
            });
            setUserList(mappingUserData ?? []);
            setIsLoading(false);
          })
          .catch(() => {
            setIsLoading(false);
          });
      }

      getCompanyList();
    }
  }, [roleId, indexRole]);

  // useEffect(() => {
  //   if (type === "update") {
  //     async function getCompanyList() {
  //       const token = localStorage.getItem("token");
  //       const apiURL = process.env.NEXT_PUBLIC_API_BASE;
  //       setIsLoading(true);
  //       await axios
  //         .get(`${apiURL}/partner-approval/users/${companyCode}/${roleId}`, {
  //           params: {},
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         })
  //         .then((res) => {
  //           const mappingUserData = res?.data?.data.map((el: any) => {
  //             return {
  //               id: el.id,
  //               value: el.name,
  //             };
  //           });
  //           setUserList(mappingUserData ?? []);
  //           setIsLoading(false);
  //         })
  //         .catch(() => {
  //           setIsLoading(false);
  //         });
  //     }

  //     getCompanyList();
  //   }
  // }, []);

  // const { isLoading: isLoadingPartnerUserApprovalList } = usePartnerUserApprovalList({
  //   company_id: companyCode,
  //   role_id: roleId,
  //   options: {
  //     onSuccess: (data: any) => {
  //       const mapedData = data?.map((el: any) => {
  //         return {
  //           id: el.id,
  //           value: el.name,
  //         };
  //       });
  //       console.log("kepanggil dari", index, indexRole, !!roleId && index === indexRole);
  //       setUserList(mapedData);
  //     },
  //     enabled: !!roleId && index === indexRole,
  //   },
  // });

  return (
    <>
      {isLoading ? (
        <Center>
          <Spin tip="Loading Data..." />
        </Center>
      ) : (
        <Controller
          control={control}
          defaultValue={null}
          // shouldUnregister={true}
          // rules={{ required: true }}
          name={`associate_role_user.${index}.partner_user_id`}
          render={({ field: { onChange, value }, formState: { errors } }) => {
            return (
              <Dropdown
                width="200px"
                defaultValue={value}
                items={userList}
                placeholder={"Select"}
                noSearch
                handleChange={(value: any) => {
                  onChange(value);
                }}
              />
            );
          }}
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

export default UserField;
