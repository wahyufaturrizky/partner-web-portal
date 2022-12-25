import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Select, Input, Typography, Space } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { Text } from "./Text";

const { Option } = Select;

export const Dropdown = ({
  defaultValue,
  rounded,
  label,
  width = 300,
  items = [{ value: "", id: 0 }],
  subtitle,
  placeholder,
  showArrow,
  error,
  handleChange,
  onSearch,
  noSearch,
  isHtml,
  loading,
  allowClear,
  onClear,
  isShowActionLabel,
  actionLabel,
  handleClickActionLabel,
  required,
  onBlur,
  onFocus,
  isOptional,
  disabled,
  containerId,
  value,
}) => {
  const [dataItems, setDataItems] = useState(items);
  const [isLoading, setIsLoading] = useState(loading);
  const [defaultValueData, setdefaultValueData] = useState(defaultValue);
  useEffect(() => {
    setDataItems(items);
    setIsLoading(loading);
    setdefaultValueData(defaultValue);
  }, [items, loading, defaultValue]);
  return (
    <Container width={width}>
      {label && (
        <Label>
          {label}
          {required && <Span>&#42;</Span>}
          {isOptional && <Span isOptional={isOptional}>(Optional);</Span>}
        </Label>
      )}
      <InputSelect
        getPopupContainer={(trigger) =>
          containerId
            ? document.getElementById(containerId)
            : trigger.parentNode
        }
        disabled={disabled}
        onBlur={onBlur}
        error={error}
        onFocus={onFocus}
        allowClear={allowClear}
        onClear={onClear}
        value={value}
        showArrow={showArrow}
        {...(defaultValue ? { defaultValue: defaultValueData } : {})}
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
        {...(noSearch
          ? {
              dropdownRender: (menu) => (
                <>
                  {isShowActionLabel && (
                    <Space style={{ marginBottom: "16px" }}>
                      <TypographyBase
                        onClick={handleClickActionLabel}
                        style={{ whiteSpace: "nowrap" }}
                      >
                        <PlusOutlined /> {actionLabel}
                      </TypographyBase>
                    </Space>
                  )}

                  {menu}
                </>
              ),
            }
          : {
              dropdownRender: (menu) => (
                <>
                  <Input
                    placeholder="Search"
                    style={{
                      marginBottom: "14px",
                      background: "#FFFFFF",
                      border: "1px solid #888888",
                      boxSizing: "border-box",
                      borderRadius: "8px",
                    }}
                    prefix={<SearchOutlined />}
                    onChange={(e) => onSearch(e.target.value)}
                    tokenSeparators={[","]}
                  />
                  {menu}
                </>
              ),
            })}
        onChange={handleChange}
      >
        {isLoading ? (
          <Text>Loading data...</Text>
        ) : (
          <>
            {dataItems.map((item) => (
              <Option key={item.id} value={item.id}>
                {isHtml ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: item.value }}
                    style={{
                      display: "flex",
                      gap: "8px",
                      padding: "0px !important",
                    }}
                  ></div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      padding: "0px !important",
                    }}
                  >
                    {item.value}
                  </div>
                )}
              </Option>
            ))}
          </>
        )}
      </InputSelect>
      <Subtitle error={error}>{error ? error : subtitle}</Subtitle>
    </Container>
  );
};

const TypographyBase = styled(Typography.Link)`
  && {
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 19px;

    /* Primary/Pink Lava */

    color: #eb008b;

    :hover {
      color: #eb008b;
    }
  }
`;

const Span = styled.span`
  color: ${(props) => (props.isOptional ? "#000000" : "#ed1c24")};
  margin-left: 1px;
  font-weight: ${(props) => (props.isOptional ? "lighter" : undefined)};
`;

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
  font-weight: bold;
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
    background: #ffffff !important;
    border: 1px solid ${(p) => (p.error ? "#ED1C24" : "#aaaaaa")} !important;
    box-sizing: border-box !important;
    border-radius: ${(p) => (p.rounded ? "64px" : "8px")} !important;
    display: flex;
    align-items: center;
    padding: 8px 16px !important;
    display: flex;
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

Dropdown.propTypes = {
  label: PropTypes.string,
  subtitle: PropTypes.string,
  defaultValue: PropTypes.string,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  actionLabel: PropTypes.string,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  isShowActionLabel: PropTypes.bool,
  allowClear: PropTypes.bool,
  handleChange: PropTypes.func,
  handleClickActionLabel: PropTypes.func,
  onClear: PropTypes.func,
  value: PropTypes.func,
  items: PropTypes.arrayOf(itemsPropsType),
};

Dropdown.defaultProps = {
  label: "",
  subtitle: "",
  placeholder: "Select",
  error: "",
  defaultValue: "",
  actionLabel: "",
  disabled: false,
  loading: false,
  isShowActionLabel: false,
  allowClear: false,
  items: [{ value: "", id: 0 }],
};
