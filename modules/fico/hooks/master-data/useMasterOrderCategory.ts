/* eslint-disable camelcase */
import { useQuery } from 'react-query';
import { client } from 'lib/client';

const apiPath = 'v1/master_data/order_category';

const doFetchList = async ({ query = {} }) => {
  const res = await client(`/${apiPath}`, {
    params: {
      search: '',
      limit: 100,
      page: 1,
      ...query,
    },
  });

  return res.data?.items || [];
};

export const useQueryMasterOrderCategory = ({
  query = {},
  onSuccess = () => {},
  onError = () => {},
}) => useQuery([`${apiPath}`, query], () => doFetchList({ query }), {
  onSuccess,
  onError,
});
