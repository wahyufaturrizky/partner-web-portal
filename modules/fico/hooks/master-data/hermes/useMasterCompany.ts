/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
import { useQuery } from 'react-query';
import { client } from 'lib/clientHermes';

const apiPath = 'api/v1/hermes/company';

const doFetchList = async ({ query = {} }) => {
  const res = await client(`/${apiPath}`, {
    params: {
      account_id: 0,
      search: '',
      limit: 1000,
      sortBy: 'id',
      sortOrder: 'ASC',
      ...query,
    },
  });

  return res.data || {};
};

export const useQueryHermesCompany = ({
  query = {},
  onSuccess = (res) => {},
  onError = () => {},
}) => useQuery([`${apiPath}`, query], () => doFetchList({ query }), {
  onSuccess,
  onError,
});
