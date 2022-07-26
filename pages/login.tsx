import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import { useRouter } from "next/router";
import { Button, Col, Input, Modal, Row, Spacer, Text } from "pink-lava-ui";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import OtpInput from "react-otp-input";
import styled from "styled-components";
import * as yup from "yup";
import { ReactComponent as EyeCrossed } from "../assets/icons/eye-crossed.svg";
import {
  useSendOtpPhoneSmsOrWaOrEmail,
  useSignIn,
  useUpdatePassword,
  useVerifyOTP,
} from "../hooks/auth/useAuth";

const schemaLogin = yup
  .object({
    username: yup.string().required("Username is Required"),
    password: yup.string().required("Password is Required"),
    rememberMe: yup.boolean(),
  })
  .required();

const schemaResetPassword = yup
  .object({
    resetPassWithEmailAndPhone: yup.string().required("Email or Phone is Required"),
  })
  .required();

const schemaCreateNewPassword = yup
  .object({
    newPassword: yup.string().required("New Password is Required"),
    confirmNewPassword: yup
      .string()
      .required("Confirm New Password is Required")
      .oneOf([yup.ref("newPassword"), null], "Password must match"),
  })
  .required();

interface ModalInterface {
  isShowModal: boolean;
  titleModal: string;
  dataModal?: undefined;
}
interface OTPFlowInterface {
  isShowOtpFlow: boolean;
  usingWaOrSms?: "SMS" | "WA";
}

const Login: any = () => {
  const router = useRouter();
  const [isForgotPassword, setIsForgotPassword] = useState<boolean>(false);
  const [isResetWithPhone, setIsResetWithPhone] = useState<boolean>(false);
  const [isFlowCreateNewPassword, setIsFlowCreateNewPassword] = useState<boolean>(false);
  const [stateOtp, setStateOtp] = useState<string>("");
  const [stateModal, setStateModal] = useState<ModalInterface>({
    isShowModal: false,
    titleModal: "",
    dataModal: undefined,
  });
  const [otpFlow, setOtpFlow] = useState<OTPFlowInterface>({
    isShowOtpFlow: false,
    usingWaOrSms: "SMS",
  });
  const { isShowOtpFlow, usingWaOrSms } = otpFlow;
  const { isShowModal, titleModal } = stateModal;

  const { mutate: createReqBodyVerifyOTP, isLoading: isLoadingVerifyOTP } = useVerifyOTP({
    options: {
      onSuccess: (data) => {
        setIsFlowCreateNewPassword(true);
      },
      onError: (error) => {
        if (error.message === "OTP Code Wrong") {
          window.alert(error.message);
        } else {
          window.alert(error.data.message);
        }
      },
    },
  });

  const {
    mutate: createReqBodySendOtpPhoneSmsOrWaOrEmail,
    isLoading: isLoadingSendOtpPhoneSmsOrWaOrEmail,
  } = useSendOtpPhoneSmsOrWaOrEmail({
    options: {
      onSuccess: (data) => {
        if (data === "OTP Code Sent" && getValues("resetPassWithEmailAndPhone").includes("@")) {
          setStateModal({
            ...stateModal,
            isShowModal: true,
            titleModal: "Forgot Password Link Send",
          });
        } else {
        }
      },
      onError: (error) => {
        window.alert(error.data.message);
      },
    },
  });

  const { mutate: createReqBodyUpdatePassword, isLoading: isLoadingUpdatePassword } =
    useUpdatePassword({
      options: {
        onSuccess: (data) => {
          setStateModal({
            isShowModal: true,
            titleModal: "Success",
          });
        },
        onError: (error) => {
          window.alert(error.data.message);
        },
      },
    });

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      isFlowCreateNewPassword
        ? schemaCreateNewPassword
        : isForgotPassword
        ? schemaResetPassword
        : schemaLogin
    ),
  });

  const {
    error,
    mutate,
    isLoading: isLoadingLogin,
  } = useSignIn({
    onSuccess: (data) => {
      window.location.assign(window.location);
    },
    onError: (error) => {
      if (
        error.status === 400 &&
        error.data.status === "ERROR" &&
        error.data.type === "VALIDATION_ERROR"
      ) {
      }
    },
  });

  const onSubmit = async (data) => {
    if (isFlowCreateNewPassword) {
      createReqBodyUpdatePassword({
        otp: stateOtp,
        password: getValues("newPassword"),
      });
    } else if (isForgotPassword) {
      if (data.resetPassWithEmailAndPhone.includes("@")) {
        createReqBodySendOtpPhoneSmsOrWaOrEmail({
          email: data.resetPassWithEmailAndPhone,
        });
      } else {
        setIsResetWithPhone(true);
      }
    } else {
      const payload = {
        password: data.password,
      };
      if (data.username.includes("@")) {
        payload.email = data.username;
      } else {
        payload?.phoneNumber = data.username;
      }

      mutate(payload);
    }
  };

  const handleChangeOtp = (otpValue) => {
    setStateOtp(otpValue);
  };

  const getOtpViaWhatsAppOrSMS = useCallback(() => {
    createReqBodySendOtpPhoneSmsOrWaOrEmail({
      phone_number: getValues("resetPassWithEmailAndPhone"),
      send_type: usingWaOrSms === "SMS" ? "sms" : "wa",
    });
  }, []);

  const handleSubmitOTP = () => {
    createReqBodyVerifyOTP({
      otp: stateOtp,
      phone_number: getValues("resetPassWithEmailAndPhone"),
    });
  };

  useEffect(() => {
    if (isShowOtpFlow) {
      getOtpViaWhatsAppOrSMS();
    }
  }, [isShowOtpFlow, usingWaOrSms]);

  return (
    <Container>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div>
          <Image src="/logo-nabati.svg" alt="logo-nabati" width={268} height={76} />
          <Spacer size={12} />
          <Text fluid textAlign="center" color="white" variant="headingLarge">
            Nabati Group Portal
          </Text>
          <Spacer size={24} />
        </div>
        <Card>
          <ImageBackgroundUp src="/pattern.png" />

          <ImageBackgroundDown src="/pattern.png" />
          <Col>
            <Col alignItems="center">
              <Text variant="headingLarge">
                {isFlowCreateNewPassword
                  ? "Set New Password"
                  : isShowOtpFlow
                  ? "Enter OTP Code"
                  : isResetWithPhone
                  ? "Select Verification Method"
                  : isForgotPassword
                  ? "Reset Password"
                  : "Welcome Back!"}
              </Text>
              <Spacer axis="vertical" size={4} />
              <Text textAlign="center" variant="body2" color="grey.light">
                {isFlowCreateNewPassword
                  ? "Create easy to remember1 passwords and keep your passwords private."
                  : isShowOtpFlow
                  ? `OTP code has been sent via WhatsApp to ********${getValues(
                      "resetPassWithEmailAndPhone"
                    ).slice(8, 14)}`
                  : isResetWithPhone
                  ? `Choose one of the methods below to send the OTP code to ********${getValues(
                      "resetPassWithEmailAndPhone"
                    ).slice(8, 14)}`
                  : isForgotPassword
                  ? "Enter your registered email or mobile number. We will send a verification code or link to reset your password"
                  : "login to enter dashboard"}
              </Text>
            </Col>

            <Spacer size={20} />

            {isFlowCreateNewPassword ? (
              <>
                <Input
                  error={errors?.newPassword?.message}
                  {...register("newPassword", {
                    required: true,
                  })}
                  label="Create New Password"
                  placeholder="Type your password min. 8 character"
                  test-id="newPassword"
                  type="password"
                />
                <Spacer size={26} />
                <Input
                  error={errors?.confirmNewPassword?.message}
                  {...register("confirmNewPassword", { required: true })}
                  label="Confirm Password"
                  type="password"
                  placeholder={"Re-type your password"}
                  icon={<EyeCrossed />}
                  test-id="confirmNewPassword"
                />

                <Spacer size={12} />

                <Button size="xtra" onClick={handleSubmit(onSubmit)} full variant="primary">
                  {isLoadingUpdatePassword ? "Loading..." : "Continue"}
                </Button>
              </>
            ) : isShowOtpFlow ? (
              <>
                <Row justifyContent="center">
                  <OtpInput
                    inputStyle={{
                      width: 54,
                      height: 54,
                      borderRadius: 8,
                      border: "1px solid #AAAAAA",
                    }}
                    focusStyle={{
                      width: 54,
                      height: 54,
                      borderRadius: 8,
                      border: "1px solid #2BBECB",
                    }}
                    value={stateOtp}
                    separator={<span style={{ color: "white" }}>--</span>}
                    onChange={handleChangeOtp}
                    numInputs={6}
                  />
                </Row>

                <Spacer size={32} />
                <div onClick={() => getOtpViaWhatsAppOrSMS()} style={{ cursor: "pointer" }}>
                  <Row justifyContent="center">
                    <Text color="pink.regular">
                      {isLoadingSendOtpPhoneSmsOrWaOrEmail ? "Loading..." : "Resend Code"}
                    </Text>
                  </Row>
                </div>

                <Spacer size={12} />

                <Button size="xtra" onClick={() => handleSubmitOTP()} full variant="primary">
                  {isLoadingVerifyOTP ? "Loading..." : "Continue"}
                </Button>

                <Spacer size={12} />
                <Row justifyContent="center">
                  <Col>
                    <Text>Wrong phone number?</Text>
                  </Col>
                  <Col>
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setIsResetWithPhone(false);
                        setOtpFlow({ ...otpFlow, isShowOtpFlow: false });
                      }}
                    >
                      <Text color="pink.regular"> Change Mobile Number</Text>
                    </div>
                  </Col>
                </Row>
              </>
            ) : isResetWithPhone ? (
              <>
                {isLoadingSendOtpPhoneSmsOrWaOrEmail ? (
                  <Text>Loading...</Text>
                ) : (
                  <>
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => setOtpFlow({ isShowOtpFlow: true, usingWaOrSms: "SMS" })}
                    >
                      <Image src="/send-otp-sms.svg" alt="edot-logo" width={408} height={96} />
                    </div>
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => setOtpFlow({ isShowOtpFlow: true, usingWaOrSms: "WA" })}
                    >
                      <Image src="/send-otp-wa.svg" alt="edot-logo" width={408} height={96} />
                    </div>
                  </>
                )}

                <Row justifyContent="center">
                  <Col>
                    <div style={{ cursor: "pointer" }} onClick={() => setIsResetWithPhone(false)}>
                      <Text color="pink.regular">Back</Text>
                    </div>
                  </Col>
                </Row>
              </>
            ) : isForgotPassword ? (
              <>
                <Input
                  error={errors?.resetPassWithEmailAndPhone?.message}
                  {...register("resetPassWithEmailAndPhone", {
                    required: true,
                  })}
                  label="Email or Mobile Number"
                  placeholder="Type your Email or Mobile Number"
                  test-id="resetPassWithEmailAndPhone"
                />

                <Spacer size={12} />

                <Button size="xtra" onClick={handleSubmit(onSubmit)} full variant="primary">
                  {isLoadingSendOtpPhoneSmsOrWaOrEmail ? "Loading..." : "Continue"}
                </Button>

                <Spacer size={12} />

                <Row justifyContent="center">
                  <Col>
                    <div style={{ cursor: "pointer" }} onClick={() => setIsForgotPassword(false)}>
                      <Text color="pink.regular">Back to Login Page</Text>
                    </div>
                  </Col>
                </Row>
              </>
            ) : (
              <>
                <Input
                  error={
                    errors?.username?.message ||
                    error?.errors?.find(
                      (err) => err.label === "phone_number" || err.label === "email"
                    )?.message
                  }
                  {...register("username", {
                    required: true,
                  })}
                  label="Username"
                  placeholder="Type your NIK, Email, Phone number"
                  test-id="username"
                />
                <Spacer size={26} />
                <Input
                  error={
                    errors?.password?.message ||
                    error?.errors?.find((err) => err.label === "password")?.message
                  }
                  {...register("password", { required: true })}
                  label="Password"
                  type="password"
                  placeholder={"Type your password"}
                  icon={<EyeCrossed />}
                  test-id="password"
                />

                <Spacer size={12} />

                <Row justifyContent="flex-end">
                  <Col>
                    <div style={{ cursor: "pointer" }} onClick={() => setIsForgotPassword(true)}>
                      <Text color="blue.regular">Forgot Password?</Text>
                    </div>
                  </Col>
                </Row>
                <Spacer size={20} />
                <Text
                  color="red.regular"
                  style={{ visibility: error?.message ? "visible" : "hidden", minHeight: "21px" }}
                >
                  {error?.message}
                </Text>

                <Spacer size={16} />

                <Button size="xtra" onClick={handleSubmit(onSubmit)} full variant="primary">
                  {isLoadingLogin ? "Loading..." : "Login"}
                </Button>

                <Spacer size={26} />

                <span style={{ textAlign: "center" }}>
                  <Text fluid variant="subtitle2" inline>
                    New user?{" "}
                  </Text>
                  <div
                    style={{ cursor: "pointer", display: "inline-block" }}
                    onClick={() => {
                      router.push("/register");
                    }}
                  >
                    <Text variant="subtitle2" inline color="blue.regular">
                      Create an account
                    </Text>
                  </div>
                </span>
              </>
            )}
          </Col>
        </Card>
      </div>

      <div>
        <img src="/powered-edot.png" alt="logo-nabati" />
        <Spacer size={12} />
        <Text fluid textAlign="center" color="white" variant="footer">
          edot.co.id &bull; Support &bull; Term & Privacy
        </Text>
      </div>

      {isShowModal && (
        <Modal
          visible={isShowModal}
          onCancel={() => setStateModal({ ...stateModal, isShowModal: false })}
          title={titleModal}
          footer={
            <Button
              full
              onClick={() => {
                if (titleModal === "Success") {
                  setIsForgotPassword(false);
                  setIsFlowCreateNewPassword(false);
                  setOtpFlow({ ...otpFlow, isShowOtpFlow: false });
                  setIsResetWithPhone(false);
                  setStateModal({ ...stateModal, isShowModal: false });
                } else if (titleModal === "Forgot Password Link Send") {
                  setIsForgotPassword(false);
                  setStateModal({ ...stateModal, isShowModal: false });
                }
              }}
              variant="primary"
              size="big"
            >
              OK
            </Button>
          }
          content={
            titleModal === "Success" ? (
              <>
                <Spacer axis="vertical" size={12} />
                <Row justifyContent="center">
                  <Text color="#101820">your password has been changed successfully</Text>
                </Row>
                <Spacer axis="vertical" size={12} />
              </>
            ) : (
              <>
                <Spacer axis="vertical" size={12} />
                <Row justifyContent="center">
                  <Text color="#101820">Please check your email.</Text>
                </Row>
                <Spacer axis="vertical" size={12} />
              </>
            )
          }
        />
      )}
    </Container>
  );
};

const Card = styled.div`
  background: white;
  box-shadow: 0px 4px 16px rgba(170, 170, 170, 0.15);
  border-radius: 24px;
  padding: 32px;
  width: 473px;
  min-height: 532px;
  position: relative;
`;

const Container = styled.div`
  background: linear-gradient(180deg, #1dbac8 0%, #2bbecb 100%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100vh;
  flex-direction: column;
  padding: 40px 0px 12px 0px;
`;

const ImageBackgroundUp = styled.img`
  z-index: 100000;
  position: absolute;
  top: -36px;
  left: -60px;
`;

const ImageBackgroundDown = styled.img`
  z-index: 100000;
  position: absolute;
  bottom: -44px;
  right: -60px;
`;

export default Login;
Login.getLayout = (page: any) => page;
Login.protectedRoute = false;
