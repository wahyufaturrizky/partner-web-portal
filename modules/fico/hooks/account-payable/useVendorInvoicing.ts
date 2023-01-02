/* eslint-disable camelcase */
import { useQuery, useMutation } from 'react-query';
import { client } from 'lib/clientAP';
import React from 'react';

const apiPath = 'v1/ap-vdr-ivc';

export function useVendorInvoicing() {
  const doFetchList = async ({ query = {} }) => client(`/${apiPath}/lists`, {
    params: {
      search: '',
      limit: 10,
      page: 1,
      sort_by: '["created_at desc"]',
      company_code: localStorage.getItem('companyCode'),
      ...query,
    },
  }).then((res) => res);

  const getList = ({
    query = {}, onSuccess, onError,
  }) => useQuery([`${apiPath}`, query], () => doFetchList({ query }), {
    keepPreviousData: true,
    onSuccess,
    onError,
  });

  const doFetchByID = async ({ id }) => client(`/${apiPath}/get/${id}`).then((data) => data);

  const getByID = ({ id, onSuccess, onError }) => useQuery([`/${apiPath}/get`, id], () => doFetchByID({ id }), {
    onSuccess,
    onError,
  });

  const doFetchDropdownDatasources = async () => client(`/${apiPath}/create`).then((res) => res.data);
  const getDropdownDatasources = () => useQuery([`${apiPath}`, 'dropdown-datasources'], () => doFetchDropdownDatasources());

  const getDocumentNumber = ({
    query = {}, onSuccess, onError,
  }) => useQuery(['/v1/ap-vdr-ivc/update-doc-range', query], () => client('/v1/ap-vdr-ivc/update-doc-range', { params: { ...query } }).then((res) => (res)), {
    keepPreviousData: false,
    cacheTime: 0,
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

  const close = ({ onSuccess, onError }) => useMutation(
    (ids: React.Key[]) => client('/close-asset-mutation', { method: 'PUT', data: { budget_ids: ids } }),
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
    getDropdownDatasources,
    getDocumentNumber,
    submit,
    close,
    create,
    update,
    updateStatus,
  };
}
