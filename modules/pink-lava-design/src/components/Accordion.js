import React, { useState, useContext, createContext } from "react";
import styled from "styled-components";
import { ReactComponent as ArrowDown } from "../assets/arrow-down.svg"
import { ReactComponent as ArrowUp } from "../assets/arrow-up.svg"
import PropTypes from 'prop-types';

const ToggleContext = createContext(true);

export const Accordion = ({ children, ...restProps }) => {
  return (
    <Container {...restProps}>
      <Inner>{children}</Inner>
    </Container>
  );
}

Accordion.Item = function ({ children, ...restProps }) {
  const [toggleShow, setToggleShow] = useState(false);
  return (
    <ToggleContext.Provider value={{ toggleShow, setToggleShow }}>
      <Item {...restProps}>{children}</Item>
    </ToggleContext.Provider>
  );
};

Accordion.Header = function ({ children, variant="white", ...restProps }) {
  const { toggleShow, setToggleShow } = useContext(ToggleContext);

  return (
    <Header variant={variant} toggleShow={toggleShow} onClick={() => setToggleShow(!toggleShow)} {...restProps}>
      {children}
      {toggleShow ? <ArrowDown fill={variant === "white" ? "black" : "white"} /> : <ArrowUp fill={variant === "white" ? "black" : "white"} /> }
    </Header>
  );
};

Accordion.Body = function ({ children, variant="white", padding, ...restProps }) {
  const { toggleShow } = useContext(ToggleContext);
  return (
    <Body padding={padding} toggleShow={toggleShow} variant={variant} className={toggleShow ? "open" : "close"}>
      {children}
    </Body>
  );
};

const Container = styled.div`
  display: flex;
`;

const Inner = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Item = styled.div`
  color: white;
  margin-bottom: 10px;
  width: 100%;

  &:last-of-type {
    margin-bottom: 0;
  }
`;

const Header = styled.div`
  display: flex;
  background: ${p => p.variant === "white" ? "#FFFFF" : "#2BBECB"} !important;
  flex-direction: row;
  justify-content: space-between;
  cursor: pointer;
  height: 48px;
  border-radius: ${p => p.toggleShow ? "8px" : "8px 8px 0px 0px"};
  padding: 10px 16px;
  user-select: none;
  align-items: center;
  font-weight: 600;
  font-size: 20px;
  line-height: 27px;
  color: ${p => p.variant === "white" ? "#000000" : "#FFFFFF"};
  width: 100%;
  border:  ${p => p.variant === "white" ? "1px solid #AAAAAA" : "none"} ;
`;

const Body = styled.div`
  white-space: pre-wrap;
  user-select: none;
  overflow: hidden;
  background: #FFFFFF;
  border-radius: 0px 0px 8px 8px;
  color: black;
  padding: ${p => p.padding ? p.padding : "12px 20px"};
  width: 100%;
  display: ${p => p.toggleShow ? "none" : "block"};
  border: 1px solid #AAAAAA;
  border-top: none;

  &.closed {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.25ms cubic-bezier(0.5, 0, 0.1, 1);
  }

  &.open {
    max-height: 0px;
    transition: max-height 0.25ms cubic-bezier(0.5, 0, 0.1, 1);
  }
`;

Accordion.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
}