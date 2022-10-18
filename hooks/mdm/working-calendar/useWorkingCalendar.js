import { useQuery, useMutation, useInfiniteQuery } from "react-query";
import { mdmService } from "../../../lib/client";

const fetchWorkingCalendars = async ({ query = {} }) => {
  return mdmService(`/working-calendar`, {
    params: {
      search: "",
      page: 1,
      limit: 10,
      sortBy: "calendar_name",
      sortOrder: "ASC",
      ...query,
    },
  }).then((data) => data);
};

const useWorkingCalendars = ({ query = {}, options }) => {
  return useQuery(["working-calendars", query], () => fetchWorkingCalendars({ query }), {
    ...options,
  });
};

const fetchWorkingCalendar = async ({ id }) => {
  return mdmService(`/working-calendar/${id}`).then((data) => data);
};

const useWorkingCalendar = ({ id, options }) => {
  return useQuery(["working-calendar", id], () => fetchWorkingCalendar({ id }), {
    ...options,
  });
};

const fetchInfiniteWorkingCalendar = async ({ pageParam = 1, queryKey }) => {
  const searchQuery = queryKey[1].search;
  return mdmService(`/working-calendar`, {
    params: {
      search: searchQuery,
      limit: 10,
      page: pageParam,
      sortBy: "created_at",
      sortOrder: "DESC",
      ...queryKey[1],
    },
  }).then((data) => data);
};

const useWorkingCalendarInfiniteLists = ({ query = {}, options }) => {
  return useInfiniteQuery(["working-calendar/infinite", query], fetchInfiniteWorkingCalendar, {
    keepPreviousData: true,
    ...options,
  });
};

function useCreateWorkingCalendar({ options }) {
  return useMutation(
    (data) =>
      mdmService(`/working-calendar`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
}

function useUpdateWorkingCalendar({ id, options }) {
  return useMutation(
    (data) =>
      mdmService(`/working-calendar/${id}`, {
        method: "PUT",
        data,
      }),
    {
      ...options,
    }
  );
}

function useUpdateActiveWorkingCalendar({ id, status, options }) {
  return useMutation(
    (data) =>
      mdmService(`/working-calendar/${id}/${status}`, {
        method: "PUT",
        data,
      }),
    {
      ...options,
    }
  );
}

const useDeleteWorkingCalendar = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService(`/working-calendar`, {
        method: "DELETE",
        data,
      }),
    {
      ...options,
    }
  );
};

export {
  useWorkingCalendars,
  useWorkingCalendar,
  useWorkingCalendarInfiniteLists,
  useCreateWorkingCalendar,
  useUpdateWorkingCalendar,
  useUpdateActiveWorkingCalendar,
  useDeleteWorkingCalendar,
};
