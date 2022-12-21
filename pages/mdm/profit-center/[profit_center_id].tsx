import { useDetailProfitCenter } from "hooks/mdm/profit-center/useProfitCenter";
import { useUserPermissions } from "hooks/user-config/usePermission";
import { useRouter } from "next/router";
import { permissionProfitCenter } from "permission/profit-center";
import React from "react";
import ProfitCenterCreate from "./create";

export default function ProfitCenterDetail() {
  const router = useRouter();
  const companyId = localStorage.getItem("companyId");
  const companyCode = localStorage.getItem("companyCode");
  const { profit_center_id } = router.query;

  const {
    data: detailProfitCenter,
    isLoading: isLoadingProfit,
    isFetching: isFetchingProfit,
  } = useDetailProfitCenter({
    options: {
      onSuccess: () => {},
    },
    companyId: companyCode,
    id: profit_center_id,
  });

  const propsDropdownField = {
    detailProfitCenter,
    isLoadingProfit,
    isFetchingProfit,
  };
  const { data: dataUserPermission } = useUserPermissions({
    options: {
      onSuccess: () => {},
    },
  });

  const listPermission = dataUserPermission?.permission?.filter(
    (filtering: any) => filtering.menu === "Profit Center"
  );
  return (
    <ProfitCenterCreate isUpdate={true} {...propsDropdownField} listPermission={listPermission} />
  );
}
