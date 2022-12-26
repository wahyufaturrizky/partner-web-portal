import React, { createContext, useState, useEffect } from "react";
import Head from "next/head";
import { Spin } from "pink-lava-ui";
import { useAuth } from "../hooks/auth/useAuth";

const AuthContext = createContext();

function AuthProvider({ children, protectedRoute }) {
  const [isReturnComponent, setReturnComponent] = useState(false);

  const { mutate, isLoading } = useAuth({
    options: {
      onSuccess: () => {
        if (window.location.pathname === "/") {
          window.location.assign("/dashboard");
        } else if (protectedRoute) {
          setReturnComponent(true);
        } else {
          window.location.assign("/dashboard");
        }
      },
      onError: () => {
        localStorage.clear();
        if (protectedRoute) {
          window.location.assign("/login");
        } else {
          setReturnComponent(true);
        }
      },
    },
  });

  useEffect(() => {
    mutate();
  }, []);

  if (isLoading || !isReturnComponent) {
    return (
      <div
        style={{
          display: "flex", height: "100vh", justifyContent: "center", alignItems: "center",
        }}
      >
        <Spin tip="Loading data" />
      </div>
    );
  }
  return (
    <AuthContext.Provider value={null}>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <title>Hermes</title>
      </Head>

      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider };
