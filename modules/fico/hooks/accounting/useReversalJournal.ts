/* eslint-disable camelcase */
import { useQuery, useMutation } from 'react-query';
import { client } from 'lib/client';
import React from 'react';
import { message } from 'antd';

const apiPath = 'v1/accounting/reversal-journal';

export function useReversalJournal() {
  const doFetchList = async ({ query = {} }) => client(`/${apiPath}/lists`, {
    params: {
      search: '',
      limit: 10,
      page: 1,
      sort: '-created_at',
      ...query,
    },
  }).then((res) => ({
    total: res?.data?.pagination?.total_rows || 0,
    data: res?.data?.items || [],
  }));

  const getList = ({
    query = {}, onSuccess, onError,
  }) => useQuery([`${apiPath}`, query], () => doFetchList({ query }), {
    keepPreviousData: true,
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

  const postTestRun = ({ onSuccess }) => useMutation(
    (data: Object) => client(`/${apiPath}/test-run`, { method: 'POST', data }).then((res) => res.data),
    {
      onSuccess,
      onError: (err: any) => {
        message.error(err.message);
      },
    },
  );

  const submit = ({ onSuccess, onError }) => useMutation(
    (ids: React.Key[]) => client(
      '/v1/accounting/reversal-journals',
      { method: 'PUT', data: { document_numbers: ids, state: 'submit' } },
    ),
    {
      onSuccess,
      onError,
    },
  );

  const close = ({ onSuccess, onError }) => useMutation(
    (ids: React.Key[]) => client(
      '/v1/accounting/reversal-journals',
      { method: 'PUT', data: { document_numbers: ids, state: 'close' } },
    ),
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
    postTestRun,
    submit,
    close,
    create,
    update,
  };
}
