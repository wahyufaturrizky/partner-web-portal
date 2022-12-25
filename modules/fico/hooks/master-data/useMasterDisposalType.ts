/* eslint-disable camelcase */
import { useQuery } from 'react-query';
import { client } from 'lib/clientAsset';

const apiPath = 'v1/support/list/disposal-type';

const doFetchList = async ({ query = {} }) => {
  const res = await client(`/${apiPath}`, {
    method: 'POST',
    data: {
      req: '',
      ...query,
    },
  });

  return res.data || [];
};

export const useQueryMasterDisposalType = ({
  query = {},
  onSuccess = () => {},
  onError = () => {},
}) => useQuery([`${apiPath}`, query], () => doFetchList({ query }), {
  onSuccess,
  onError,
});
