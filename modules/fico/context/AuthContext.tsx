/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-filename-extension */
import React, {
  createContext, useState, useEffect, useMemo, useContext, Dispatch, SetStateAction,
} from 'react';
import Head from 'next/head';
import { Spin } from 'pink-lava-ui';
import useLocalStorage from 'use-local-storage';
import { Setter } from 'types/useLocalStorage';
import { useAuth } from '../hooks/auth/useAuth';

type Profile = {
  companyId: string | null;
  companyCode: string | null;
}
type ContextValue = {
  profile: Profile;
  setProfile: Setter<Profile>;
};

const AuthContext = createContext<ContextValue>({
  profile: {
    companyCode: 'undefined',
    companyId: 'undefined',
  },
  setProfile: (value) => {},
});
export const useProfile = () => useContext(AuthContext);

function AuthProvider({ children, protectedRoute }) {
  const [isReturnComponent, setReturnComponent] = useState(false);
  const [profile, setProfile] = useLocalStorage<Profile>('profile', {
    companyId: '',
    companyCode: '',
  });

  const value = useMemo(
    () => ({ profile: profile || [], setProfile }),
    [profile],
  );

  const { mutate, isLoading } = useAuth({
    options: {
      onSuccess: () => {
        if (window.location.pathname === '/') {
          window.location.assign('/fico/dashboard');
        } else if (protectedRoute) {
          setReturnComponent(true);
        } else {
          window.location.assign('/fico/dashboard');
        }
      },
      onError: () => {
        localStorage.clear();
        if (protectedRoute) {
          window.location.assign('/fico/login');
        } else {
          setReturnComponent(true);
        }
      },
    },
  });

  useEffect(() => {
    mutate();
    setProfile({
      companyCode: localStorage.getItem('companyCode') || 'undefined',
      companyId: localStorage.getItem('companyId') || 'undefined',
    });
    // if (localStorage.getItem('token')) {
    //   if (window.location.pathname === '/') {
    //     setReturnComponent(true);
    //     window.location.assign('/fico/dashboard');
    //   } else if (protectedRoute) {
    //     setReturnComponent(true);
    //   } else {
    //     window.location.assign('/fico/dashboard');
    //   }
    // } else {
    //   localStorage.clear();
    //   if (protectedRoute) {
    //     window.location.assign('/fico/login');
    //   } else {
    //     setReturnComponent(true);
    //   }
    // }
  }, []);

  if (isLoading || !isReturnComponent) {
    return (
      <div
        style={{
          display: 'flex', minHeight: '100vh', justifyContent: 'center', alignItems: 'center',
        }}
      >
        <Spin tip="Loading data..." />
      </div>
    );
  }
  return (
    <AuthContext.Provider value={value}>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <title>FICO</title>
      </Head>

      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider };
