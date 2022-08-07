import { useMutation } from "react-query";
import { client } from "../../lib/client";

const fetchAuth = async () => {
  return client("/auth/verify-token", { method: "POST" }).then((data) => data);
};

const useAuth = ({ options }) => {
  return useMutation((updates) => fetchAuth(updates), {
    ...options,
  });
};

const signInUser = async (data = {}) => {
  return client("/auth/login", { method: "POST", data }).then((data) => {
    localStorage.setItem("token", data.tokenCode);
    localStorage.setItem("refresh_token", data.refreshToken);
    return data;
  });
};

const useSignIn = (options) => {
  return useMutation((updates) => signInUser(updates), {
    ...options,
  });
};

function useSendOtpPhoneSmsOrWaOrEmail({ options }) {
  return useMutation(
    (reqBody) =>
      client("/auth/forgot-password", {
        method: "POST",
        data: reqBody,
      }),
    {
      ...options,
    }
  );
}

function useUpdatePassword({ options }) {
  return useMutation(
    (reqBody) =>
      client("/auth/update-password", {
        method: "POST",
        data: reqBody,
      }),
    {
      ...options,
    }
  );
}

function useVerifyOTP({ options }) {
  return useMutation(
    (reqBody) =>
      client("/auth/verify-otp", {
        method: "POST",
        data: reqBody,
      }),
    {
      ...options,
    }
  );
}

export { useAuth, useSignIn, useSendOtpPhoneSmsOrWaOrEmail, useUpdatePassword, useVerifyOTP };
