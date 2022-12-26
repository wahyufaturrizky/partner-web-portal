import React from "react";
import styled from 'styled-components';
import { ReactComponent as Exclamation } from "../assets/exclamation-circle.svg"

export const Alert = ({ children, variant="danger" }) => {
  let Icon = variant === "warning" ? CustomExclamation: Exclamation;
  return (
    <AlertStyled variant={variant}>
      <Icon fill="white"/>
       {children}
    </AlertStyled>
  )
};

const CustomExclamation = styled(Exclamation)`

  && > path:first-child {
    fill: #B78101 ;
  }

  && > path:last-child {
    fill: white ;
  }
`

const AlertStyled = styled.div`
  height: 36px;
  padding: 6px 10px;
  display: flex;
  align-items: center;
  gap: 4px;
  background-color: ${p => p.variant === "warning" ? "#FFFBDF" : "#B40E0E"};
  border-radius: 8px;
`