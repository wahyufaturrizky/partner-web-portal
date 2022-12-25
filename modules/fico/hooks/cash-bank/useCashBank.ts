/* eslint-disable camelcase */
import { useQuery, useMutation } from 'react-query';
import { client } from 'lib/client';
import React from 'react';

const apiPath = 'v1/cash-bank';

export function useCashBank() {
  const doFetchList = async ({ query = {} }) => client(`/${apiPath}/lists`, {
    params: {
      search: '',
      size: 10,
      page: 1,
      sort: '-created_at',
      ...query,
    },
  }).then((res) => ({
    total: res?.data?.pagination?.total_rows || 0,
    data: res?.data?.items || [],
  }));

  const getList = ({
    query = {}, onSuccess, onError, enabled,
  }) => useQuery([`${apiPath}`, query], () => doFetchList({ query }), {
    keepPreviousData: true,
    onSuccess,
    onError,
    enabled,
  });

  const doFetchByID = async ({ id }) => client(`/${apiPath}/get/${id}`).then((data) => data);

  const getByID = ({ id, onSuccess, onError }) => useQuery([`${apiPath}`, id], () => doFetchByID({ id }), {
    onSuccess,
    onError,
  });

  const doFetchDropdownDatasources = async () => client(`/${apiPath}/create`).then((res) => res.data);
  const getDropdownDatasources = () => useQuery([`${apiPath}`, 'dropdown-datasources'], () => doFetchDropdownDatasources());

  const submit = ({ onSuccess, onError }) => useMutation(
    (ids: React.Key[]) => client('/submit-asset-disposal', { method: 'PUT', data: { budget_ids: ids } }),
    {
      onSuccess,
      onError,
    },
  );

  const close = ({ onSuccess, onError }) => useMutation(
    (ids: React.Key[]) => client('/close-asset-disposal', { method: 'PUT', data: { budget_ids: ids } }),
    {
      onSuccess,
      onError,
    },
  );

  const create = ({ onSuccess, onError }) => useMutation(
    (data: Object) => client(`/${apiPath}/add`, { method: 'POST', data }),
    {
      onSuccess,
      onError,
    },
  );

  const update = ({ id, onSuccess, onError }) => useMutation(
    (data: Object) => client(`/${apiPath}/update/${id}`, { method: 'PUT', data }),
    {
      onSuccess,
      onError,
    },
  );

  return {
    getList,
    getByID,
    getDropdownDatasources,
    submit,
    close,
    create,
    update,
  };
}
