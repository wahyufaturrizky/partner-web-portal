import { useUserPermissions } from "hooks/user-config/usePermission";
import { permissionProductVariant } from "permission/product-variant";
import React from "react";
import CreateProductVariant from "../../../components/pages/Products/CreateProductVariant";

export default function Create() {
  const { data: dataUserPermission } = useUserPermissions({
    options: {
      onSuccess: () => {},
    },
  });

  const listPermission = dataUserPermission?.permission?.filter(
    (filtering: any) => filtering.menu === "Product Variant"
  );
  return <CreateProductVariant listPermission={listPermission} />;
}
