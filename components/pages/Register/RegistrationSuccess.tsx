import React from "react";
import { Col, Spacer, Button, Text } from "pink-lava-ui";
import WelcomeSvg from "../../../assets/ilustration/welcome_ilustration.svg";
import { CheckCircleFilled } from "@ant-design/icons";
import { useRouter } from "next/router";

const RegistrationSuccess = () => {
  const router = useRouter();

  return (
    <Col alignItems={"center"} justifyContent={"center"}>
      <div style={{ width: "50%" }}>
        <Col alignItems={"center"}>
          <span>
            <CheckCircleFilled style={{ color: "#00C572", fontSize: "28px" }} />{" "}
            <Text inline variant={"h4"}>
              Registration Success
            </Text>
          </span>

          <Spacer size={10} />

          <div style={{ width: "80%" }}>
            <Text variant={"caption"} textAlign={"center"} color={"black.darker"}>
              Your account has been succesfully registered and pending for verification. Our team
              will send an email for further processing as soon as possible. Please check your email
              regularly. If you do not receive a confirmation email, Please check your spam folder
              and ensure your spam filters allow emails from noreply@edot.id
            </Text>
          </div>

          <Spacer size={10} />

          <WelcomeSvg />

          <Spacer size={20} />

          <span>
            <Text variant="subtitle2" inline color="black.regular">
              If you need any assistance, Please
            </Text>{" "}
            <div style={{ cursor: "pointer", display: "inline-block" }} onClick={() => {}}>
              <Text variant="subtitle2" inline color="black.regular" style={{ fontWeight: "bold" }}>
                Contact us.
              </Text>
            </div>
          </span>

          <Spacer size={20} />

          <Button
            variant={"tertiary"}
            size={"big"}
            onClick={() => {
              router.back();
            }}
          >
            Close
          </Button>
        </Col>
      </div>
    </Col>
  );
};

export default RegistrationSuccess;
