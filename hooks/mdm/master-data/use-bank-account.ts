/* eslint-disable camelcase */
import { useQuery, useMutation } from 'react-query';
import { client } from 'lib/clientMdm';
import React from 'react';

const apiPath = 'bank';

export function useMasterBankAccount() {
  const doFetchList = async ({ query = {} }) => client(`/${apiPath}`, {
    params: {
      search: '',
      limit: 10,
      page: 1,
      // sort_by: '["created_at desc"]',
      company_id: localStorage.getItem("companyCode")?.replace('PTKSNI', 'KSNI'),
      ...query,
    },
  }).then((res) => ({
    data: {
      pagination: {
        total_rows: res.data.total_row,
      },
      rows: res.data.rows,
    },
  }));

  const getList = ({
    query = {}, onSuccess, onError,
  }) => useQuery([`${apiPath}`, query], () => doFetchList({ query }), {
    keepPreviousData: true,
    onSuccess,
    onError,
  });

  const doFetchByID = async ({ id }) => client(`/${apiPath}/${id}`).then((data) => data);

  const getByID = ({ id, onSuccess, onError }) => useQuery([`/${apiPath}`, id], () => doFetchByID({ id }), {
    onSuccess,
    onError,
  });

  const submit = ({ onSuccess, onError }) => useMutation(
    (ids: React.Key[]) => client('/submit-asset-mutation', { method: 'PUT', data: { budget_ids: ids } }),
    {
      onSuccess,
      onError,
    },
  );

  const create = ({ onSuccess, onError }) => useMutation(
    (data: Object) => client(`/${apiPath}`, { method: 'POST', data }),
    {
      onSuccess,
      onError,
    },
  );

  const update = ({ onSuccess, onError }) => useMutation(
    (data: Object & { id: number }) => client(`/${apiPath}/${data.id}`, { method: 'PUT', data }),
    {
      onSuccess,
      onError,
    },
  );

  const deleteData = ({ onSuccess, onError }) => useMutation(
    (payload: any) => client(`/${apiPath}`, { method: 'DELETE', data: payload }),
    {
      onSuccess,
      onError,
    },
  );

  const updateStatus = ({ onSuccess, onError }) => useMutation(
    (payload: any) => client(`${apiPath}/updates`, { method: 'POST', data: payload }),
    {
      onSuccess,
      onError,
    },
  );

  return {
    getList,
    getByID,
    submit,
    create,
    update,
    deleteData,
    updateStatus,
  };
}
