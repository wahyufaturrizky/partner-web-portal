import React from "react";
import styled from "styled-components";
import { Input } from "antd";
import { UserOutlined, SearchOutlined } from "@ant-design/icons";
import { ThemeProvider } from "styled-components";
import { baseTheme } from "../theme/baseTheme";
import { COLORS } from "../const/COLORS";

const SearchOutlinedStyled = styled(SearchOutlined)`
  color: ${(props) => props.colorIcon || COLORS.black.regular};
`;

const UserOutlinedStyled = styled(SearchOutlined)`
  color: ${(props) => props.colorIcon || COLORS.black.regular};
`;

export const Search = (props) => {
  return (
    <ThemeProvider theme={baseTheme}>
      <BaseInput
        size="large"
        placeholder="Search Company ID, Company Name"
        prefix={
          props.nameIcon === "UserOutlined" ? (
            <UserOutlinedStyled colorIcon={props.colorIcon} />
          ) : props.nameIcon === "SearchOutlined" ? (
            <SearchOutlinedStyled colorIcon={props.colorIcon} />
          ) : (
            <UserOutlinedStyled colorIcon={props.colorIcon} />
          )
        }
        {...props}
      />
    </ThemeProvider>
  );
};

const BaseInput = styled(Input)`
  && {
    /* Neutral/White Cheese */

    background: #ffffff;
    /* Neutral/Grey Cheese */

    border: 1px solid #888888;
    box-sizing: border-box;
    border-radius: 64px;
    height: 48px !important;

    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 18px;
    color: #000000;
    caret-color: ${(p) => p.theme.blue.regular};
    width: ${(p) => p.width || "100%"};
  }

  ::placeholder {
    /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: red !important;
    opacity: 1; /* Firefox */
  }

  .ant-input-prefix {
    margin-right: 10px;
  }
`;
