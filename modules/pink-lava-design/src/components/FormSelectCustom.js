import React, { forwardRef } from "react";
import { Select, Input, Space, Spin, Tag } from "antd";
import styled from "styled-components";
import { SearchOutlined } from "@ant-design/icons";

const { Option } = Select;

const tagRender = (props) => {
  const { label } = props;

  const onPreventMouseDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <Tag
      onMouseDown={onPreventMouseDown}
      style={{
        margin: 1,
      }}
      key={label[1]}
    >
      {label[1]}
    </Tag>
  );
};

const Checkbox = ({ checked, ...props }) => {
  return (
    <CheckboxContainer className="container">
      <HiddenCheckbox checked={checked} onChange={() => {}} />
      <CustomCheckbox className="checkmark" />
    </CheckboxContainer>
  );
};

export const FormSelectCustom = forwardRef(
  (
    {
      isLoadingMore,
      isLoading,
      items,
      fetchMore,
      onSearch,
      withSearch,
      borderColor,
      arrowColor,
      labelInValue = false,
      height,
      ...props
    },
    ref
  ) => {
    return (
      <InputSelect
        getPopupContainer={(trigger) => trigger.parentNode}
        labelInValue={labelInValue}
        ref={ref}
        height={height}
        tagRender={tagRender}
        $borderColor={borderColor}
        $arrowColor={arrowColor}
        notFoundContent={isLoading ? <Spin size="small" /> : "No Data"}
        dropdownStyle={{
          background: "#FFFFFF",
          border: "1px solid #AAAAAA",
          boxSizing: "border-box",
          borderRadius: "8px",
        }}
        onPopupScroll={(event) => {
          const target = event.target;
          if (
            !isLoadingMore &&
            Math.ceil(target.scrollTop + target.offsetHeight) ===
              target.scrollHeight
          ) {
            fetchMore && fetchMore();
          }
        }}
        dropdownRender={(menu) => (
          <>
            {withSearch && (
              <Space
                style={{
                  padding: "8px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                }}
              >
                <Input
                  style={{ boxSizing: "border-box", borderRadius: "8px" }}
                  prefix={<SearchOutlined />}
                  placeholder="Search"
                  onChange={(e) => onSearch && onSearch(e.target.value)}
                />
              </Space>
            )}
            {menu}
          </>
        )}
        {...props}
      >
        {!isLoadingMore
          ? items?.map((item) => (
              <Option value={item?.value} key={item?.value}>
                <Checkbox checked={props?.value?.includes(item.value)} />
                {item?.label}
              </Option>
            ))
          : [
              ...items?.map((item) => (
                <Option value={item?.value} key={item?.value}>
                  {item?.label}
                </Option>
              )),
              <Option key="loading">Loading...</Option>,
            ]}
      </InputSelect>
    );
  }
);

const InputSelect = styled(Select)`
  border-radius: 8px;

  .ant-select-selector {
    border: 1px solid ${(p) => (p.$borderColor ? p.$borderColor : "#d9d9d9")} !important;
    box-sizing: border-box !important;
    border-radius: 8px !important;
    height: ${(p) => p.height ?? undefined} !important;
  }

  .ant-select-arrow {
    color: ${(p) => (p.$arrowColor ? p.$arrowColor : "rgba(0 0 0 0.25)")};
  }
`;

const CheckboxContainer = styled.label`
  display: inline;
  position: relative;
  cursor: pointer;
  margin-right: 25px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  z-index: -1;

  input:checked ~ .checkmark {
    background-color: #2bbecb;
    border-color: transparent;
  }

  input:checked ~ .checkmark:after {
    display: inline;
  }

  .checkmark:after {
    left: 5px;
    top: 1px;
    width: 8px;
    height: 13px;
    border: solid white;
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(35deg);
  }
`;

const HiddenCheckbox = styled.input.attrs({ type: "checkbox" })`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
`;

const CustomCheckbox = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  margin-right: 8px;
  background-color: white;
  border: 1px solid black;
  border-radius: 5px;

  &:after {
    content: "";
    position: absolute;
    display: none;
  }
`;
