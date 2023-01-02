import Router from 'next/router';

export function useRouterPath() {
  const { pathname } = Router;

  const pathArray = pathname.split('/');
  const rootMenuPath = `/${pathArray[1]}/${pathArray[2]}`;

  return {
    pathname,
    pathArray,
    rootMenuPath,
  };
}
