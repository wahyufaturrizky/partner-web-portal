import { useQuery, useMutation } from "react-query";
import { client } from "../../lib/client";

const fetchMenuDesignLists = async ({ query = {} }) => {
  return client(`/menu/design`, {
    params: {
      search: "",
      limit: 10,
      page: 1,
      sortBy: "created_at",
      sortOrder: "DESC",
      ...query,
    },
  }).then((data) => data);
};

const useMenuDesignLists = ({ query = {}, options } = {}) => {
  return useQuery(["menu/design", query], () => fetchMenuDesignLists({ query }), {
    keepPreviousData: true,
    ...options,
  });
};

function useCreateMenuDesignList({ options }) {
  return useMutation(
    (updates) =>
      client(`/menu/design`, {
        method: "POST",
        data: updates,
      }),
    {
      ...options,
    }
  );
}

function useCreateModuleMenuDesignList({ options }) {
  return useMutation(
    (updates) =>
      client(`/menu/design/module`, {
        method: "POST",
        data: updates,
      }),
    {
      ...options,
    }
  );
}

function useCreateSubMenuDesignList({ options }) {
  return useMutation(
    (updates) =>
      client(`/menu/design/menu`, {
        method: "POST",
        data: updates,
      }),
    {
      ...options,
    }
  );
}

const fetchMenuDesignList = async ({ menu_design_list_id }) => {
  return client(`/menu/design/${menu_design_list_id}`).then((data) => data);
};

const useMenuDesignList = ({ menu_design_list_id, options }) => {
  return useQuery(
    ["menu/design", menu_design_list_id],
    () => fetchMenuDesignList({ menu_design_list_id }),
    {
      ...options,
    }
  );
};

function useUpdateMenuDesignList({ menuDesignListId, options }) {
  return useMutation(
    (updates) =>
      client(`/menu/design/${menuDesignListId}`, {
        method: "PUT",
        data: updates,
      }),
    {
      ...options,
    }
  );
}

const useDeleteMenuDesignList = ({ options }) => {
  return useMutation(
    (ids) =>
      client("/menu/design", {
        method: "DELETE",
        data: ids,
      }),
    {
      ...options,
    }
  );
};

export {
  useMenuDesignLists,
  useMenuDesignList,
  useCreateMenuDesignList,
  useUpdateMenuDesignList,
  useDeleteMenuDesignList,
  useCreateModuleMenuDesignList,
  useCreateSubMenuDesignList,
};
