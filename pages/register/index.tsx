import React, { useState } from "react";
import { Header, Row, Col, Spacer, Steps, Button, Text } from "pink-lava-ui";
import LogoSvg from "../../assets/icons/logo.svg";
import BusinessType from "../../components/pages/Register/BusinessType";
import CreateAccount from "../../components/pages/Register/CreateAccount";
import CreateSubdomain from "../../components/pages/Register/CreateSubdomain";
import Finished from "../../components/pages/Register/Finished";
import RegistrationSuccess from "../../components/pages/Register/RegistrationSuccess";
import { useForm, FormProvider } from "react-hook-form";
import { ArrowLeftOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { useRouter } from "next/router";
import { RegisterFormContext } from "../../context/RegisterContext";

const renderContent = (step: any) => {
  switch (step) {
    case "Create Account":
      return <CreateAccount />;
    case "Bussines Type":
      return <BusinessType />;
    case "Create Subdomain":
      return <CreateSubdomain />;
    case "Finished":
      return <Finished />;

    default:
      return null;
  }
};

const Register = () => {
  const router = useRouter();
  const [successRegister, setSuccessRegister] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepList, setStepList] = useState([
    { status: "process", title: "Create Account" },
    { status: "wait", title: "Bussines Type" },
    { status: "wait", title: "Create Subdomain" },
    { status: "wait", title: "Finished" },
  ]);
  const [numberEmployees, setNumberEmployees] = useState("1-50");
  const [industryField, setIndustryField] = useState("Agricultural");
  const [companyType, setCompanyType] = useState("corporate");

  const methods = useForm();
  const { handleSubmit, trigger } = methods;
  const onSubmit = (data: any) => {
    setSuccessRegister(true);
    console.log(data);
  };
  return (
    <div style={{ height: "100vh", position: "relative" }}>
      <Header
        mode="horizontal"
        withMenu={false}
        headerStyle={{
          boxShadow: "0px 4px 16px rgba(170, 170, 170, 0.15)",
        }}
      >
        <Row justifyContent={"space-between"} height={"100%"}>
          <Col justifyContent={"center"}>
            <LogoSvg />
          </Col>
        </Row>
      </Header>

      <Spacer size={30} />

      {successRegister ? (
        <RegistrationSuccess />
      ) : (
        <RegisterFormContext.Provider
          value={{
            stepList,
            currentStep,
            industryField,
            companyType,
            numberEmployees,
            setCurrentStep,
            setStepList,
            setIndustryField,
            setCompanyType,
            setNumberEmployees,
          }}
        >
          <FormProvider {...methods}>
            <Col alignItems={"center"}>
              <div style={{ width: "70%" }}>
                <Steps
                  size="small"
                  current={currentStep}
                  stepList={stepList}
                  onChange={async (value: any) => {
                    const isValid = await trigger();

                    switch (value) {
                      case 0:
                        setCurrentStep((prevStep: any) => {
                          setStepList([
                            { status: "process", title: "Create Account" },
                            { status: "wait", title: "Bussines Type" },
                            { status: "wait", title: "Create Subdomain" },
                            { status: "wait", title: "Finished" },
                          ]);
                          return 0;
                        });
                        break;
                      case 1:
                        if (currentStep - value === -1) {
                          if (!isValid) {
                            const mappingStepList = stepList.map((el, index) => {
                              return index === currentStep ? { ...el, status: "error" } : el;
                            });
                            setStepList(mappingStepList);
                          } else {
                            setCurrentStep((prevStep: any) => {
                              setStepList([
                                { status: "finish", title: "Create Account" },
                                { status: "process", title: "Bussines Type" },
                                { status: "wait", title: "Create Subdomain" },
                                { status: "wait", title: "Finished" },
                              ]);
                              return 1;
                            });
                          }
                        } else if (currentStep > value) {
                          setCurrentStep((prevStep: any) => {
                            setStepList([
                              { status: "finish", title: "Create Account" },
                              { status: "process", title: "Bussines Type" },
                              { status: "wait", title: "Create Subdomain" },
                              { status: "wait", title: "Finished" },
                            ]);
                            return 1;
                          });
                        }
                        break;
                      case 2:
                        if (currentStep - value === -1) {
                          if (!isValid) {
                            const mappingStepList = stepList.map((el, index) => {
                              return index === currentStep ? { ...el, status: "error" } : el;
                            });
                            setStepList(mappingStepList);
                          } else {
                            setCurrentStep((prevStep: any) => {
                              setStepList([
                                { status: "finish", title: "Create Account" },
                                { status: "finish", title: "Bussines Type" },
                                { status: "process", title: "Create Subdomain" },
                                { status: "wait", title: "Finished" },
                              ]);
                              return 2;
                            });
                          }
                        } else if (currentStep > value) {
                          setCurrentStep((prevStep: any) => {
                            setStepList([
                              { status: "finish", title: "Create Account" },
                              { status: "finish", title: "Bussines Type" },
                              { status: "process", title: "Create Subdomain" },
                              { status: "wait", title: "Finished" },
                            ]);
                            return 2;
                          });
                        }
                        break;
                      case 3:
                        if (currentStep - value === -1) {
                          if (!isValid) {
                            const mappingStepList = stepList.map((el, index) => {
                              return index === currentStep ? { ...el, status: "error" } : el;
                            });
                            setStepList(mappingStepList);
                          } else {
                            setCurrentStep((prevStep: any) => {
                              setStepList([
                                { status: "finish", title: "Create Account" },
                                { status: "finish", title: "Bussines Type" },
                                { status: "finish", title: "Create Subdomain" },
                                { status: "finish", title: "Finished" },
                              ]);
                              return 3;
                            });
                          }
                        } else if (currentStep > value) {
                          setCurrentStep((prevStep: any) => {
                            setStepList([
                              { status: "finish", title: "Create Account" },
                              { status: "finish", title: "Bussines Type" },
                              { status: "finish", title: "Create Subdomain" },
                              { status: "finish", title: "Finished" },
                            ]);
                            return 3;
                          });
                        }
                        break;
                      default:
                        break;
                    }
                  }}
                />
              </div>
              <Spacer size={30} />
              {currentStep > 0 && (
                <BackButton
                  onClick={() => {
                    setCurrentStep((prevStep) => {
                      const incrementStep = prevStep - 1;
                      const mappingStepList = stepList.map((el, index) => {
                        if (
                          el.title === stepList[prevStep].title ||
                          incrementStep + 1 === stepList.length
                        ) {
                          return { ...el, status: "wait" };
                        } else if (index === incrementStep) {
                          return { ...el, status: "process" };
                        } else {
                          return el;
                        }
                      });
                      setStepList(mappingStepList);
                      return incrementStep;
                    });
                  }}
                >
                  <ArrowLeftOutlined />{" "}
                  <Text inline variant={"headingRegular"} color="black.darker">
                    Back
                  </Text>
                </BackButton>
              )}
              <div style={{ width: "50%", height: "440px" }}>
                {renderContent(stepList[currentStep].title)}
              </div>

              {currentStep === 3 && (
                <>
                  <span>
                    <Text variant="subtitle2" inline color="grey.regular">
                      By Clicking "Register for free", I agree
                    </Text>{" "}
                    <div style={{ cursor: "pointer", display: "inline-block" }} onClick={() => {}}>
                      <Text variant="subtitle2" inline color="pink.regular">
                        Terms and conditions
                      </Text>
                    </div>
                  </span>

                  <Spacer size={5} />
                </>
              )}

              {currentStep === 3 ? (
                <div style={{ width: "25%" }}>
                  <Button variant="primary" size={"big"} full onClick={handleSubmit(onSubmit)}>
                    Register For Free
                  </Button>
                </div>
              ) : (
                <div style={{ width: "25%" }}>
                  <Button
                    variant="primary"
                    size={"big"}
                    full
                    onClick={async () => {
                      const isValid = await trigger();
                      if (!isValid) {
                        const mappingStepList = stepList.map((el, index) => {
                          return index === currentStep ? { ...el, status: "error" } : el;
                        });
                        setStepList(mappingStepList);
                      } else {
                        setCurrentStep((prevStep) => {
                          const incrementStep = prevStep + 1;
                          const mappingStepList = stepList.map((el, index) => {
                            if (
                              el.title === stepList[prevStep].title ||
                              incrementStep + 1 === stepList.length
                            ) {
                              return { ...el, status: "finish" };
                            } else if (index === incrementStep) {
                              return { ...el, status: "process" };
                            } else {
                              return el;
                            }
                          });
                          setStepList(mappingStepList);
                          return incrementStep;
                        });
                      }
                    }}
                  >
                    Next
                  </Button>
                </div>
              )}

              <Spacer size={10} />

              <span>
                <Text variant="subtitle2" inline color="black.regular">
                  Already have an account?
                </Text>{" "}
                <div
                  style={{ cursor: "pointer", display: "inline-block" }}
                  onClick={() => {
                    router.back();
                  }}
                >
                  <Text variant="subtitle2" inline color="pink.regular">
                    Login
                  </Text>
                </div>
              </span>
            </Col>
          </FormProvider>
        </RegisterFormContext.Provider>
      )}
    </div>
  );
};

const BackButton = styled.span`
  position: absolute;
  left: 20px;
  cursor: pointer;
`;

export default Register;
Register.getLayout = (page: any) => page;
Register.protectedRoute = false;
