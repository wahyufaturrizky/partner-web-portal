import React, { useState } from "react";
import { Header, Row, Col, Spacer, Steps, Button, Text } from "pink-lava-ui";
import LogoSvg from "../../assets/icons/logo.svg";
import BusinessType from "../../component/Register/BusinessType";
import CreateAccount from "../../component/Register/CreateAccount";
import CreateSubdomain from "../../component/Register/CreateSubdomain";
import Finished from "../../component/Register/Finished";
import { useForm, FormProvider } from "react-hook-form";
import { ArrowLeftOutlined } from "@ant-design/icons";
import styled from "styled-components";

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
  const [currentStep, setCurrentStep] = useState(0);
  const [stepList, setStepList] = useState([
    { status: "process", title: "Create Account" },
    { status: "wait", title: "Bussines Type" },
    { status: "wait", title: "Create Subdomain" },
    { status: "wait", title: "Finished" },
  ]);

  const methods = useForm();
  const { handleSubmit, trigger } = methods;
  const onSubmit = (data: any) => console.log(data);

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

      <FormProvider {...methods}>
        <Col alignItems={"center"}>
          <div style={{ width: "70%" }}>
            <Steps size="small" current={currentStep} stepList={stepList} />
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

          <div style={{ width: "50%", height: "480px" }}>
            {renderContent(stepList[currentStep].title)}
          </div>

          <Spacer size={20} />

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
        </Col>
      </FormProvider>
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
