/* eslint-disable camelcase */
import { useQuery, useMutation } from 'react-query';
import { client } from 'lib/clientAR';
import React from 'react';

const apiPath = 'api/v1/ar';

export function useARList() {
  const doFetchList = async ({ query = {} }) => client(`/${apiPath}/list`, {
    params: {
      search: '',
      size: 10,
      page: 1,
      sort: '-created_at',
      ...query,
    },
  }).then((data) => data);

  const getList = ({
    query = {}, onSuccess, onError, enabled = true,
  }) => useQuery([`${apiPath}`, query], () => doFetchList({ query }), {
    keepPreviousData: true,
    onSuccess,
    onError,
    enabled,
  });

  const doFetchByID = async ({ id }) => client(`/${apiPath}?ar_id=${id}`).then((data) => data);

  const getByID = ({ id, onSuccess, onError }) => useQuery([`${apiPath}`, id], () => doFetchByID({ id }), {
    onSuccess,
    onError,
  });

  const getGiroNumber = ({ id, onSuccess, onError }) => useQuery(['api/v1/giro/amount', id], () => doFetchByID({ id }), {
    onSuccess,
    onError,
  });

  const getDPNumber = ({ id, onSuccess, onError }) => useQuery(['api/v1/dp/amount', id], () => doFetchByID({ id }), {
    onSuccess,
    onError,
  });

  const submit = ({ onSuccess, onError }) => useMutation(
    (ids: React.Key[]) => client(
      `${apiPath}`,
      { method: 'PUT', data: { ar_id: ids, status: 2 } },
    ),
    {
      onSuccess,
      onError,
    },
  );

  const close = ({ onSuccess, onError }) => useMutation(
    (ids: React.Key[]) => client('/close-gr-mutation', { method: 'PUT', data: { budget_ids: ids } }),
    {
      onSuccess,
      onError,
    },
  );

  const create = ({ id, onSuccess, onError }) => useMutation(
    (data: Object) => client(`/${apiPath}?ar_id=${id}`, { method: 'PATCH', data: { data } }),
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
    getGiroNumber,
    getDPNumber,
    submit,
    close,
    create,
    update,
  };
}
