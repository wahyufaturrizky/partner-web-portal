/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
import { useQuery, useMutation } from 'react-query';
import { client } from 'lib/client';
import React from 'react';

const apiPath = 'v1/budget';
const exampleData = {
  pagination: {
    limit_per_page: 10,
    current_page: 1,
    total_page: 2,
    total_rows: 11,
  },
  items: [
    {
      ID: 7,
      value_order_id: 23,
      general_ord_id: 8,
      company_code: 'PP01',
      controll_area: 'PP00',
      order_type: '0100',
      order_number: '961805885237',
      description: 'Testing Asset',
      object_class: 'OCOST',
      profit_center: 'P01G011002',
      responsible_cc: 'P01G011001',
      requester_cc: 'P01G011005',
      plant: '0001',
      order_status: 'Created',
      order_category: '04',
      overhead_key: 'SAP1',
      interest_profil: '0000001',
      applicant: 'App Testing',
      telephone: '021123456',
      person_responsib: 'Gwen',
      estimated_cost: 1000000,
      mobile_phone: '085288881234',
      app_date: '0001-01-01T00:00:00Z',
      department: 'Finance',
      work_start: '01/09/2022',
      work_end: '03/09/2022',
      processing_grp: '',
      asset_class: '20',
      capital_date: '01/09/2022',
      ammount: '50000',
      currency: 'IDR',
      year: '2022',
      state: 'closed',
      type: '',
      created_by: 0,
      updated_by: 0,
      created_at: '2022-10-09T21:10:53.847433Z',
      updated_at: '2022-10-09T23:50:23.324801Z',
      deleted_at: null,
    },
  ],
};
export function useBudget() {
  const doFetchList = async ({ query = {} }) => client(`/${apiPath}/lists`, {
    params: {
      search: '',
      limit: 10,
      page: 0,
      sort_by: '["created_at desc"]',
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

  const submit = ({ onSuccess, onError }) => useMutation(
    (ids: React.Key[]) => client('/v1/submit-budget', { method: 'PUT', data: { budget_ids: ids } }),
    {
      onSuccess,
      onError,
    },
  );

  const close = ({ onSuccess, onError }) => useMutation(
    (ids: React.Key[]) => client('/v1/close-budget', { method: 'PUT', data: { budget_ids: ids } }),
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

  const getBudgetCompany = ({ query = {} }) => useQuery(
    ['budgetcompany', query],
    () => client('/v1/budgetcompany', { params: { page: 1, limit: 100, ...query } }).then((res) => ({
      total: res?.data?.pagination?.total_rows || 0,
      data: res?.data?.items || [],
    })),
    {
      keepPreviousData: true,
      retry: 1,
    },
  );

  return {
    getList,
    getByID,
    getBudgetCompany,
    submit,
    close,
    create,
    update,
  };
}
