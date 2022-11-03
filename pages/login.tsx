import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import { Button, Col, Dropdown, Input, Modal, Row, Spacer, Text } from "pink-lava-ui";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import OtpInput from "react-otp-input";
import styled from "styled-components";
import * as yup from "yup";
import { ICEyeCrossed } from "../assets";
import {
  useSendOtpPhoneSmsOrWaOrEmail,
  useSignIn,
  useUpdatePassword,
  useVerifyOTP,
} from "../hooks/auth/useAuth";

import ICFlagIndonesia from "../assets/icons/ic-flag-idn.svg";
import ICFlagEnglish from "../assets/icons/ic-flag-us.svg";
import { lang } from "lang";

const flexStyles = { display: "flex", alignItems: "center", gap: ".5rem" };

const languageOptions = [
  {
    value: (
      <div style={flexStyles}>
        <ICFlagIndonesia />
        <p>Indonesia</p>
      </div>
    ),
    id: "id-ID",
  },
  {
    value: (
      <div style={flexStyles}>
        <ICFlagEnglish />
        <p>English</p>
      </div>
    ),
    id: "en-US",
  },
];

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
  const [langValue, setLangValue] = useState<string>("en-US");
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
        onSuccess: () => {
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
    onSuccess: (data: any) => {
      window.location.assign(window.location);
    },
    onError: (error: any) => {
      if (
        error.status === 400 &&
        error.data.status === "ERROR" &&
        error.data.type === "VALIDATION_ERROR"
      ) {
        toast(error.data.message);
      }
    },
  });

  const onSubmit = async (data: any) => {
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
      const payload: any = {
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

  const handleChangeOtp = (otpValue: any) => {
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
        <LanguageOption>
          <Dropdown
            width="174px"
            label=""
            defaultValue="en-US"
            items={languageOptions}
            placeholder="Indonesia"
            handleChange={(value: any) => {
              localStorage.setItem("lan", value);
              setLangValue(value);
            }}
            rounded
            noSearch
          />
        </LanguageOption>
        <div>
          <Image src="/images/edot-logo-blue.svg" alt="logo-nabati" width={200} height={100} />
          <Spacer size={12} />
          <Text fluid textAlign="center" color="white" variant="headingLarge">
            Nabati Group
          </Text>
          <Spacer size={24} />
        </div>
        <Card>
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
                  : lang[langValue].login.welcomeBack}
              </Text>
              <Spacer axis="vertical" size={4} />
              <Text textAlign="center" variant="body2" color="grey.light">
                {isFlowCreateNewPassword
                  ? "Create easy to remember passwords and keep your passwords private."
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
                  : lang[langValue].login.subHeader}
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
                  icon={<ICEyeCrossed />}
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
                      <Image
                        src="/icons/send-otp-sms.svg"
                        alt="edot-logo"
                        width={408}
                        height={96}
                      />
                    </div>
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => setOtpFlow({ isShowOtpFlow: true, usingWaOrSms: "WA" })}
                    >
                      <Image src="/icons/send-otp-wa.svg" alt="edot-logo" width={408} height={96} />
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

                <Spacer size={200} />
                <ButtonFlat onClick={() => setIsForgotPassword(false)}>
                  Back to Login Page
                </ButtonFlat>
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
                  label={lang[langValue].login.username}
                  placeholder={lang[langValue].login.placeHolderUsername}
                  test-id="username"
                />
                <Spacer size={26} />
                <Input
                  error={
                    errors?.password?.message ||
                    error?.errors?.find((err) => err.label === "password")?.message
                  }
                  {...register("password", { required: true })}
                  label={lang[langValue].login.password}
                  type="password"
                  placeholder={lang[langValue].login.placeHolderPassword}
                  icon={<ICEyeCrossed />}
                  test-id="password"
                />

                <Spacer size={12} />

                <Row justifyContent="flex-end">
                  <Col>
                    <div style={{ cursor: "pointer" }} onClick={() => setIsForgotPassword(true)}>
                      <Text color="pink.regular">{lang[langValue].login.forgotPassword}</Text>
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
                  {isLoadingLogin ? "Loading..." : lang[langValue].login.primary.login}
                </Button>

                <Spacer size={26} />

                <span style={{ textAlign: "center" }}>
                  <Text fluid variant="subtitle2" inline>
                    {lang[langValue].login.newUser}{" "}
                  </Text>
                  <div
                    style={{ cursor: "pointer", display: "inline-block" }}
                    onClick={() => {
                      window.open("https://zeus-portal.nabatisnack.co.id/register", "_blank");
                    }}
                  >
                    <Text variant="subtitle2" inline color="pink.regular">
                      {lang[langValue].login.createAnAccount}
                    </Text>
                  </div>
                </span>
              </>
            )}
          </Col>
        </Card>
      </div>
      <ImageBackgroundDown src="/images/illustration-footer.svg" />
      <Footer>
        <p className="">edot.co.id &bull; Support &bull; Term & Privacy</p>
      </Footer>

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
  background: #fff;
  box-shadow: 0px 0.25rem 1rem rgba(170, 170, 170, 0.15);
  border-radius: 1.5rem;
  padding: 2rem;
  width: 29.563rem;
  min-height: 33.25rem;
  z-index: 9999;
`;

const Container = styled.div`
  background: linear-gradient(180deg, #ffffff 18.39%, #d5fafd 150.89%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100vh;
  flex-direction: column;
  padding: 2.5rem 0px 0.75rem 0px;
  position: relative;
`;

const ImageBackgroundDown = styled.img`
  z-index: 2;
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  width: 100%;
`;

const ButtonFlat = styled.div`
  color: #eb008b;
  text-align: center;
  cursor: pointer;
  font-weight: 600;
`;

const LanguageOption = styled.div`
  top: 1rem;
  right: 1rem;
  position: absolute;
`;

const Footer = styled.div`
  font-family: "Avenir Next", sans serif;
  font-style: normal;
  font-weight: 500;
  color: white;
  font-size: 0.625rem;
  line-height: 0.875rem;
  z-index: 3;
  position: absolute;
  bottom: 1rem;
`;

export default Login;
Login.getLayout = (page: any) => page;
Login.protectedRoute = false;
