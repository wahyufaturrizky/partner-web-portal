/* eslint-disable camelcase */
import { useQuery, useMutation } from 'react-query';
import { client } from 'lib/clientAsset';
import React from 'react';

const apiPath = 'v1/asset-disposal';

export function useAssetDisposal() {
  const doFetchList = async ({ query = {} }) => client(`/${apiPath}/lists`, {
    params: {
      search: '',
      size: 10,
      page: 1,
      sort_by: '["created_at desc"]',
      company_code: localStorage.getItem('companyCode'),
      ...query,
    },
  }).then((data) => data);

  const getList = ({
    query = {}, onSuccess, onError,
  }) => useQuery([`${apiPath}`, query], () => doFetchList({ query }), {
    keepPreviousData: true,
    onSuccess,
    onError,
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

  const getDocumentNumber = ({
    query = {}, onSuccess, onError,
  }) => useQuery([`/${apiPath}/update-doc-range`, query], () => client(`/${apiPath}/update-doc-range`).then((data) => data), {
    keepPreviousData: false,
    cacheTime: 0,
    onSuccess,
    onError,
  });

  return {
    getList,
    getByID,
    getDropdownDatasources,
    submit,
    close,
    create,
    update,
    updateStatus,
    getDocumentNumber,
  };
}
