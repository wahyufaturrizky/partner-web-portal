import React, { useEffect, useState } from "react";
import { Radio as RadioAntd } from 'antd';
import styled from "styled-components";
import PropTypes from 'prop-types';
import { ThemeProvider } from 'styled-components';
import { baseTheme } from "../theme/baseTheme"
import { Text } from "./Text";

export const ContentSwitcher = ({variant, options=[], defaultValue, onChange}) => {

  const [value, setValue] = useState(defaultValue)

  useEffect(() => {
    if(typeof onChange === "function"){
      onChange(value)
    }
  }, [value])

  if(variant === 'circle'){
    return (
      <ThemeProvider theme={baseTheme}>
        <BaseSwitcherCircle onChange={(e) => setValue(e.target.value)} optionType="button" buttonStyle="solid" value={value}>
          {options.map(option => (
            <RadioAntd.Button type value={option.value}>
              <Text isHtml={option.isHtml} variant="headingSmall" color={option.value === value ? "white" : "black.regular"}>{option.label}</Text>
            </RadioAntd.Button>
          ))}
        </BaseSwitcherCircle>
      </ThemeProvider>
    )
  }

  if(variant === 'square'){
    return (
      <ThemeProvider theme={baseTheme}>
        <BaseSwitcher options={options} onChange={(e) => setValue(e.target.value)} optionType="button" buttonStyle="solid" value={value} />
      </ThemeProvider>
    );
  }
}


const BaseSwitcherCircle = styled(RadioAntd.Group)`
  && {
    height: 40px !important;
    display : flex !important;
    gap: 16px !important;
  }

  .ant-radio-button-wrapper-disabled {
    border-color: ${p => p.theme.grey.lighter} !important;
    background-color: ${p => p.theme.grey.lighter} !important;
    color: ${p => p.theme.grey.light} !important;
  }

  .ant-radio-button-wrapper::before {
    display: none;
  }

  .ant-radio-button-wrapper-checked {
    background: ${p => p.theme.pink.regular} !important;
    border-color: ${p => p.theme.pink.regular} !important;
  }

  .ant-radio-group-solid .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):hover {
    color: ${p => p.theme.white} !important;
  }

  .ant-radio-button-wrapper:hover {
    color: ${p => p.theme.pink.regular};
  }

  .ant-radio-button-checked {
    border-color: ${p => p.theme.pink.regular} !important;
  }

  .ant-radio-button-wrapper {
    min-width: 48px;
    justify-content: center;
    display: flex;
    height: 40px;
    border-color: ${p => p.theme.grey.light};
    border: none;
  }

  .ant-radio-button-wrapper {
    border-radius: 64px;
    border-left-width: 1px !important;
  }

  .ant-radio-button-wrapper span{
    display: flex;
    align-items: center;
  }
`

const BaseSwitcher = styled(RadioAntd.Group)`
  .ant-radio-group {
    height: 32px !important;
  }

  .ant-radio-button-wrapper::before {
    background: ${p => p.theme.pink.regular} !important;
  }

  .ant-radio-button-wrapper-checked {
    background: ${p => p.theme.pink.regular} !important;
    border-color: ${p => p.theme.pink.regular} !important;
  }

  .ant-radio-group-solid .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):hover {
    color: ${p => p.theme.white} !important;
  }

  .ant-radio-button-wrapper:hover {
    color: ${p => p.theme.pink.regular};
  }

  .ant-radio-button-wrapper {
    border-color: ${p => p.theme.pink.regular} !important;
  }

  .ant-radio-button-wrapper:first-child {
    border-radius: 8px 0px 0px 8px;
  }

  .ant-radio-button-wrapper:last-child {
    border-radius: 0px 8px 8px 0px;
  }
`

ContentSwitcher.propTypes = {
  variant: PropTypes.oneOf(['circle', 'square']),
}

ContentSwitcher.defaultProps = {
  variant: 'circle'
}