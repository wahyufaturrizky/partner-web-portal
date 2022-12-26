/* eslint-disable camelcase */
import { useQuery, useMutation } from 'react-query';
import { client } from 'lib/client';
import React from 'react';

const apiPath = 'v1/accounting/general-journal';

export function useGeneralJournal() {
  const doFetchList = async ({ query = {} }) => client(`/${apiPath}/lists`, {
    params: {
      search: '',
      limit: 10,
      page: 1,
      ...query,
    },
  }).then((res) => ({
    total: res?.data?.pagination?.total_rows || 0,
    data: res?.data?.items || [],
  }));

  const getList = ({
    // eslint-disable-next-line no-unused-vars
    query = {}, onSuccess = (res) => {}, onError = (res) => {},
  }) => useQuery([`${apiPath}`, query], () => doFetchList({ query }), {
    keepPreviousData: true,
    onSuccess,
    onError,
  });

  const getDocumentNumber = ({
    query = {}, onSuccess, onError,
  }) => useQuery(['/v1/accounting/get-number', query], () => client('/v1/accounting/get-number', { params: { ...query } }).then((data) => data), {
    keepPreviousData: false,
    cacheTime: 0,
    onSuccess,
    onError,
  });

  const doFetchByID = async ({ id }) => client(`/${apiPath}/get/${id}`).then((res) => ({
    data: res.data.info,
    items: res.data.items,
  }));

  const getByID = ({ id, onSuccess, onError }) => useQuery([`${apiPath}`, id], () => doFetchByID({ id }), {
    onSuccess,
    onError,
  });

  const submit = ({ onSuccess, onError }) => useMutation(
    (ids: React.Key[]) => client(
      '/v1/accounting/general-journals',
      { method: 'PUT', data: { document_numbers: ids, state: 'submit' } },
    ),
    {
      onSuccess,
      onError,
    },
  );

  const close = ({ onSuccess, onError }) => useMutation(
    (ids: React.Key[]) => client('/close-budget', { method: 'PUT', data: { budget_ids: ids } }),
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
    getDocumentNumber,
    getByID,
    submit,
    close,
    create,
    update,
  };
}
