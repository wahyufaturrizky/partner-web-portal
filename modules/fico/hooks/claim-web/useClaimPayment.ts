/* eslint-disable camelcase */
import { useQuery, useMutation } from 'react-query';
import { client } from 'lib/clientCL';
// import { client as clientAS } from 'lib/client';
import React from 'react';

const apiPath = 'v1/ap-vdr-ivc';

export function useClaimPayment() {
  const doFetchList = async ({ query = {} }) => client(`/${apiPath}/lists`, {
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
  }) => useQuery([`${apiPath}/update-doc-range`, query], () => client(`${apiPath}/update-doc-range`, { params: { ...query } }).then((res) => ({
    ...res,
  })), {
    keepPreviousData: false,
    cacheTime: 0,
    onSuccess,
    onError,
  });

  const doFetchByID = async ({ id }) => client(`/${apiPath}/get/${id}`).then((data) => data);

  const getByID = ({ id, onSuccess, onError }) => useQuery([`${apiPath}`, id], () => doFetchByID({ id }), {
    onSuccess,
    onError,
  });

  const submit = ({ onSuccess, onError }) => useMutation(
    (data: Object) => client(
      `/${apiPath}/updates`,
      { method: 'POST', data },
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

  const update = ({ onSuccess, onError }) => useMutation(
    (data: Object) => client(`/${apiPath}/update`, { method: 'POST', data }),
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
