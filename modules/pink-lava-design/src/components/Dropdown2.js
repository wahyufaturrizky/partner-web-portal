import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Select, Input, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Text } from "./Text";

const { Option } = Select;

export const Dropdown2 = ({defaultValue, allowClear, onClear, rounded, label, width=300, items=[],subtitle, placeholder, error, handleChange, onSearch, noSearch, isHtml, disabled, onBlur, onFocus, required, labelBold}) => {
  return (
    <Container width={width}>
      {label && 
        <Label labelBold={labelBold}>{label}
          {required && <Span>&#42;</Span>}
        </Label>
      }
      <InputSelect
        getPopupContainer={trigger => trigger.parentNode}
        onBlur={onBlur}
        onFocus={onFocus}
        allowClear={allowClear}
        onClear={onClear}
        {...(defaultValue ? { defaultValue } : {})}
        rounded={rounded}
        style={{ width, "--antd-wave-shadow-color": "#2BBECB" }}
        placeholder={placeholder}
        dropdownStyle={{
          background: "#FFFFFF",
          border: "1px solid #AAAAAA",
          boxSizing: "border-box",
          borderRadius: "8px",
          padding: "16px",
        }}
        disabled={disabled}
        {...(noSearch ? {} :
          {dropdownRender: menu => (  
            <>
              <Input placeholder="Search" style={{ 
                  marginBottom: "14px",
                  background: "#FFFFFF",
                  border: "1px solid #888888",
                  boxSizing: "border-box",
                  borderRadius: "8px",  
                }} prefix={<SearchOutlined />} 
                  onChange={(e) => onSearch(e.target.value)} 
                  tokenSeparators={[',']}
                />
              {menu}
            </>
          )})
        }
        onChange={handleChange}
      >
        {items.map(item => 
          <Option key={item.id} value={item.id}>
            {isHtml ? 
              <OptionText disabled={disabled} dangerouslySetInnerHTML={{__html : item.value}} style={{display: 'flex', gap: '8px', padding: "0px !important"}}></OptionText>
              : 
              <OptionText disabled={disabled} style={{display: 'flex', gap: '8px', padding: "0px !important"}}>
                {item.value}
              </OptionText>
            }
          </Option>
        )}
      </InputSelect>
      <Subtitle error={error}>{error ? error : subtitle}</Subtitle>
    </Container>
  );
};

const Span = styled.span`
  color: #ED1C24;
  margin-left: 1px;
`

const OptionText = styled.div`
  ${({ disabled }) => (disabled ? `&& div {
    color: gray !important;
  }` : "")}
`

const Subtitle = styled.div`
  font-weight: normal;
  font-size: 12px;
  line-height: 18px;
  color: ${(p) => (p.error ? "#ED1C24" : "#888888")};
`;

const Container = styled.div`
  display: flex;
  gap: 4px;
  flex-direction: column;
  width: ${(p) => (p.width ? p.width : "100%")};
`;

const Label = styled.div`
  font-weight: ${p => p.labelBold ? 'bold': 500};
  font-size: 16px;
  line-height: 24px;
  color: #000000;
`;

const InputSelect = styled(Select)`
  min-height: 48px !important;
  background: #ffffff !important;
  box-sizing: border-box !important;
  border-radius: ${(p) => (p.rounded ? "64px" : "8px")} !important;

  .ant-select-selector {
    min-height: 48px !important;
    background: ${p => p.disabled ? '#F4F4F4' : '#FFFFFF' } !important;
    border: 1px solid #AAAAAA !important;
    box-sizing: border-box !important;
    border-radius: ${(p) => (p.rounded ? "64px" : "8px")} !important;
    display: flex;
    align-items: center;
    padding: 8px 16px !important;
    display: flex;
    color: #444444 !important;
  }

  .ant-select-selection-item {
    display: flex;
    padding: 16px 8px;
    font-weight: 600;
    font-size: 16px;
    line-height: 22px;
  }

  .ant-select-arrow {
    color: #000000;
  }

  .ant-select-focused:not(.ant-select-disabled).ant-select:not(.ant-select-customize-input)
    .ant-select-selector {
    border-color: transparent !important;
    box-shadow: none;
    outline: none;
  }

  .ant-select-item-option-active:not(.ant-select-item-option-disabled) {
    background-color: transparent !important;
  }

  .rc-virtual-list-holder-inner {
    gap: 8px;
  }

  .ant-select-dropdown {
    padding: 0px !important;
  }
`;

const itemsPropsType = {
  value: PropTypes.string,
  id: PropTypes.number,
};

Dropdown2.propTypes = {
  label: PropTypes.string,
  subtitle: PropTypes.string,
  defaultValue: PropTypes.string,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  allowClear: PropTypes.bool,
  handleChange: PropTypes.func,
  onClear: PropTypes.func,
  items: PropTypes.arrayOf(itemsPropsType),
};

Dropdown2.defaultProps = {
  label: "Text Input Label",
  subtitle: "",
  placeholder: "Select",
  error: "",
  defaultValue: "",
  disabled: false,
  loading: false,
  allowClear: false,
  items: [{ value: "", id: 0 }],
};
