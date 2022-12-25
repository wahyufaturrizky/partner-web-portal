import React, { forwardRef } from "react";
import { Select, Input, Space, Spin } from "antd";
import styled from "styled-components";
import "../styles/DropdownMenuOptionCustom.css";
import { SearchOutlined } from "@ant-design/icons";

const { Option } = Select;

export const FormSelect = forwardRef(
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
      height,
      subtitle,
      error,
      addNewButton,
      labelInValue=false,
      containerId,
      ...props
    },
    ref
  ) => {
    return (
      <>
        <InputSelect
          getPopupContainer={trigger => containerId ? document.getElementById(containerId) : trigger.parentNode}
          labelInValue={labelInValue}
          height={height}
          ref={ref}
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
              {addNewButton}
              {menu}
            </>
          )}
          {...props}
        >
          {!isLoadingMore
            ? items?.map((item) => (
                <Option
                  className="select-dropdown-item-custom"
                  value={item?.value}
                  key={item?.value}
                >
                  {item?.label}
                </Option>
              ))
            : [
                ...items?.map((item) => (
                  <Option
                    className="select-dropdown-item-custom"
                    value={item?.value}
                    key={item?.value}
                  >
                    {item?.label}
                  </Option>
                )),
                <Option key="loading">Loading...</Option>,
              ]}
        </InputSelect>
        <Subtitle error={error}>{error ? error : subtitle}</Subtitle>
      </>
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

const Subtitle = styled.div`
  font-weight: normal;
  font-size: 12px;
  line-height: 18px;
  color: ${(p) => (p.error ? "#ED1C24" : "#888888")};
`;
