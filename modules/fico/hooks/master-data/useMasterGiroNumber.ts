/* eslint-disable camelcase */
import { useQuery } from 'react-query';
import { client } from 'lib/clientAR';

const apiPath = 'api/v1/giro/list/number';

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

export const useQueryMasterGiroNumber = ({
  query = {},
  onSuccess = () => {},
  onError = () => {},
}) => useQuery([`${apiPath}`, query], () => doFetchList({ query }), {
  onSuccess,
  onError,
});
