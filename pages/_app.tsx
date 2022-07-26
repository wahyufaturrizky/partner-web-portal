import { NextComponentType } from "next";
import { AppContext, AppInitialProps, AppProps } from "next/app";
import toast, { Toaster, resolveValue } from "react-hot-toast";
import { Hydrate } from "react-query/hydration";
import styled from "styled-components";
import { QueryCache } from "react-query";
import { QueryClient, QueryClientProvider } from "react-query";

import { AuthProvider } from "../context/AuthContext";
import DashboardLayout from "../layouts/Layout";
import { ICExclamation } from "../assets";

import "pink-lava-ui/index.css";
import "../styles/globals.css";

const queryCache = new QueryCache({
  onError: (error) => {
    toast.error("Something went wrong");
  },
});
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      cacheTime: 0,
      staleTime: Infinity,
      retry: true,
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
  const getLayout = Component.getLayout || DashboardLayout;
  const protectedRoute = Component.protectedRoute ?? true;

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <AuthProvider protectedRoute={protectedRoute} {...pageProps}>
          {getLayout(<Component {...pageProps} />)}
          <Toaster position="top-right" reverseOrder={false}>
            {(t) => (
              <CustomToaster style={{ opacity: t.visible ? 1 : 1 }}>
                <ICExclamation />
                {resolveValue(t.message, t)}
              </CustomToaster>
            )}
          </Toaster>
        </AuthProvider>
      </Hydrate>
    </QueryClientProvider>
  );
};

const CustomToaster = styled.div`
  background: #b40e0e;
  border-radius: 8px;
  height: 36px;
  color: #ffffff;
  padding: 6px 12px;
  display: flex;
  gap: 4px;
  align-items: center;
`;

export default App;
