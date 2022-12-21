import { useUserPermissions } from "hooks/user-config/usePermission";
import { permissionProductList } from "permission/product-list";
import React from "react";
import CreateProduct from "../../../components/pages/Products/CreateProduct";

export default function Create() {
  const { data: dataUserPermission } = useUserPermissions({
    options: {
      onSuccess: () => {},
    },
  });

  const listPermission = dataUserPermission?.permission?.filter(
    (filtering: any) => filtering.menu === "Product"
  );
  return <CreateProduct listPermission={listPermission} />;
}
