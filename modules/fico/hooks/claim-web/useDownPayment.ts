/* eslint-disable camelcase */
import { useQuery, useMutation } from 'react-query';
import { client } from 'lib/clientAR';
import { client as clientAS } from 'lib/client';
import React from 'react';

const apiPath = 'api/v1/dp';

export function useDownPayment() {
  const doFetchList = async ({ query = {} }) => client(`/${apiPath}/claim-list`, {
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
  }) => useQuery(['/v1/accounting/get-number', query], () => clientAS('/v1/accounting/get-number', { params: { ...query } }).then((data) => data), {
    keepPreviousData: false,
    cacheTime: 0,
    onSuccess,
    onError,
  });

  const doFetchByID = async ({ id }) => client(`/${apiPath}?dp_id=${id}`).then((data) => data);

  const getByID = ({ id, onSuccess, onError }) => useQuery([`${apiPath}`, id], () => doFetchByID({ id }), {
    onSuccess,
    onError,
  });

  const submit = ({ onSuccess, onError }) => useMutation(
    (ids: React.Key[]) => client(
      `/${apiPath}`,
      { method: 'PUT', data: { dp_id: ids, status: 2 } },
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
    (data: Object) => client(`/${apiPath}`, { method: 'POST', data }),
    {
      onSuccess,
      onError,
    },
  );

  const update = ({ onSuccess, onError }) => useMutation(
    (data: Object) => client(`/${apiPath}`, { method: 'PATCH', data }),
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
