/* eslint-disable no-unused-vars */
import { NextComponentType } from 'next';
import { AppContext, AppInitialProps, AppProps } from 'next/app';

import '../styles/index.css';

import { QueryClient, QueryClientProvider, QueryCache } from 'react-query';
import toast from 'react-hot-toast';
import styled from 'styled-components';
import moment from 'moment';
import { message } from 'antd';
import { AuthProvider } from 'context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';

moment.locale('id');
message.config({
  top: 100,
});

const queryCache = new QueryCache({
  onError: (error) => {
    toast.error('Something went wrong');
  },
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      cacheTime: 0,
      retry: 3,
    },
  },
  queryCache,
});
interface AppPropsExtended extends AppProps {
  Component: any;
  pageProps: any;
}

const App: NextComponentType<AppContext, AppInitialProps, AppProps> = ({
  Component,
  pageProps,
}: AppPropsExtended) => {
  const protectedRoute = Component.protectedRoute ?? true;
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider protectedRoute={protectedRoute} {...pageProps}>
        {Component.getLayout
          ? Component.getLayout(<Component {...pageProps} />)
          : (
            <DashboardLayout>
              <Component {...pageProps} />
            </DashboardLayout>
          )}
      </AuthProvider>
      {/* <Hydrate state={pageProps.dehydratedState}>
        {typeof window !== "undefined" ? (
          <AuthProvider protectedRoute={protectedRoute} {...pageProps}>
            {getLayout(<Component {...pageProps} />)}
          </AuthProvider>
        ) : (
        <Center>
          <Spin tip="Loading data..." />
        </Center>
        )}
      </Hydrate> */}
    </QueryClientProvider>
  );
};

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default App;
