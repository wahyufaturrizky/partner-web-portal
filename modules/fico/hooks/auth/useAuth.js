/* eslint-disable no-shadow */
import client from 'lib/clientHermes';
import { useMutation } from 'react-query';
import { toSnakeCase } from 'lib/caseConverter';

const fetchAuth = async () => client('/api/v1/auth/verify-token', { method: 'POST' }).then((data) => data);

const useAuth = ({ options }) => useMutation((updates) => fetchAuth(updates), {
  ...options,
});

const signInUser = async (data = {}) => client('/api/v1/auth/login', { method: 'POST', data: toSnakeCase(data) }).then((res) => {
  localStorage.setItem('token', res.data.token_code);
  localStorage.setItem('refresh_token', res.data.refresh_token);
  return data;
});

const useSignIn = (options) => useMutation((updates) => signInUser(updates), {
  ...options,
});

// const signInUser = async (data = {}) => {
//   localStorage.setItem('token', 'secret-token');
//   // localStorage.setItem('refresh_token', data.token);
//   return data;
// };

// const useSignIn = (options) => useMutation((updates) => signInUser(updates), {
//   ...options,
// });

function useSendOtpPhoneSmsOrWaOrEmail({ options }) {
  return useMutation(
    (reqBody) => client('/auth/forgot-password', {
      method: 'POST',
      data: reqBody,
    }),
    {
      ...options,
    },
  );
}

function useUpdatePassword({ options }) {
  return useMutation(
    (reqBody) => client('/auth/update-password', {
      method: 'POST',
      data: reqBody,
    }),
    {
      ...options,
    },
  );
}

function useVerifyOTP({ options }) {
  return useMutation(
    (reqBody) => client('/auth/verify-otp', {
      method: 'POST',
      data: reqBody,
    }),
    {
      ...options,
    },
  );
}

export {
  useAuth, useSignIn, useSendOtpPhoneSmsOrWaOrEmail, useUpdatePassword, useVerifyOTP,
};
