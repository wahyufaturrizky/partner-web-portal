import { useMutation } from "react-query";
import { client } from "lib/clientHermes";
import { toSnakeCase } from "lib/caseConverter";

const fetchAuth = async () => {
  return client("/auth/verify-token", { method: "POST" }).then((data) => data);
};

const useAuth = ({ options }) => {
  return useMutation((updates) => fetchAuth(updates), {
    ...options,
  });
};

const signInUser = async (data = {}) => {
  return client("/auth/login", { method: "POST", data: toSnakeCase(data) }).then((res) => {
    localStorage.setItem("token", res.data.token_code);
    localStorage.setItem("refresh_token", res.data.refresh_token);
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
