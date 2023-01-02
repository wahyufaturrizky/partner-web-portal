/* eslint-disable camelcase */
import { useQuery, useMutation } from 'react-query';
import { client } from 'lib/client';

const apiPath = 'v1/carry-forward-budget';

export function useCarryForwardCommitmentBudget() {
  const doFetchList = async ({ query = {} }) => client(`/${apiPath}/lists`, {
    params: {
      search: '',
      limit: 10,
      page: 1,
      sort_by: '["created_at desc"]',
      company_code: localStorage.getItem('companyCode'),
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

  const doFetchByID = async ({ id }) => client(`/${apiPath}/get/${id}`).then((data) => data);

  const getByID = ({ id, onSuccess, onError }) => useQuery([`${apiPath}`, id], () => doFetchByID({ id }), {
    onSuccess,
    onError,
  });

  // const submit = ({ onSuccess, onError }) => useMutation(
  //   (ids: React.Key[]) => client('/submit-budget', { method: 'PUT', data: { budget_ids: ids } }),
  //   {
  //     onSuccess,
  //     onError,
  //   },
  // );

  // const close = ({ onSuccess, onError }) => useMutation(
  //   (ids: React.Key[]) => client('/close-budget', { method: 'PUT', data: { budget_ids: ids } }),
  //   {
  //     onSuccess,
  //     onError,
  //   },
  // );

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
    // submit,
    // close,
    create,
    update,
  };
}
