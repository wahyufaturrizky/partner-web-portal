import { NextComponentType } from "next";
import { AppContext, AppInitialProps, AppProps } from "next/app";
import { Toaster, resolveValue } from "react-hot-toast";
import { Hydrate } from "react-query/hydration";
import styled from "styled-components";
import { QueryCache, QueryClient, QueryClientProvider } from "react-query";

import { useRouter } from "next/router";
import { useEffect } from "react";
import { AuthProvider } from "../context/AuthContext";
import DashboardLayout from "../layouts/Layout";
import { ICExclamation } from "../assets";

import "pink-lava-ui/index.css";
import "../styles/globals.css";

const queryCache = new QueryCache({});
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      cacheTime: 0,
      staleTime: Infinity,
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
  const getLayout = Component.getLayout || DashboardLayout;
  const protectedRoute = Component.protectedRoute ?? true;

  const router = useRouter();

  useEffect(() => {
    setCookies();
  }, [router.asPath]);

  function setCookies() {
    const storage = globalThis?.sessionStorage;
    if (!storage) return;
    const prevPath:any = storage.getItem("currentPath");
    storage.setItem("prevPath", prevPath);
    storage.setItem("currentPath", globalThis.location.pathname);
  }

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
