/* eslint-disable camelcase */
import { useQuery, useMutation } from 'react-query';
import { client } from 'lib/clientAR';
import React from 'react';

const apiPath = 'api/v1/giro';

export function useGiro() {
  const doFetchList = async ({ query = {} }) => client(`/${apiPath}/list`, {
    params: {
      search: '',
      limit: 10,
      page: 0,
      sort_by: '["created_at desc"]',
      company_code: localStorage.getItem('companyCode'),
      ...query,
    },
  }).then((data) => data);

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
  }) => useQuery(['/v1/accounting/get-number', query], () => client('/v1/accounting/get-number').then((data) => data), {
    keepPreviousData: false,
    cacheTime: 0,
    onSuccess,
    onError,
  });

  const doFetchByID = async ({ id }) => client(`/${apiPath}/?giro_id=${id}`).then((data) => data);

  const getByID = ({ id, onSuccess, onError }) => useQuery([`${apiPath}`, id], () => doFetchByID({ id }), {
    onSuccess,
    onError,
  });

  const submit = ({ onSuccess, onError }) => useMutation(
    (ids: React.Key[]) => client(
      `${apiPath}`,
      { method: 'PUT', data: { girocek_id: ids, status: 2 } },
    ),
    {
      onSuccess,
      onError,
    },
  );

  const close = ({ id, onSuccess, onError }) => useMutation(
    (data: Object) => client(`/${apiPath}?giro_id=${id}`, { method: 'DELETE', data: { data } }),
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

  const update = ({ id, onSuccess, onError }) => useMutation(
    (data: Object) => client(`/${apiPath}?giro_id=${id}`, { method: 'PATCH', data: { data } }),
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
