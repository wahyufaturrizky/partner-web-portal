/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
import { useQuery, useMutation } from 'react-query';
import { client } from 'lib/clientHermes';

const apiPath = 'api/v1/notification';

export function useNotification() {
  const doFetchList = async ({ query = {} }) => client(`/${apiPath}`, {
    params: {
      page: 1,
      limit: 4,
      status: 'all',
      ...query,
    },
  }).then((res) => res.data);

  const getList = ({
    query = {},
  }) => useQuery([`${apiPath}`, query], () => doFetchList({ query }), {
    keepPreviousData: true,
  });
  return {
    getList,
  };
}
