import React from "react";
import { Col, Row, Select, Tag, Typography, Spin, Space } from "antd";
import { Spacer } from "./Spacer";
import styled from "styled-components";
import "../styles/DropdownMenuOptionCustom.css";
import PropTypes from "prop-types";

const { Option } = Select;
function tagRender(props) {
  const { label, value, closable, onClose } = props;
  const onPreventMouseDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <TagBase
      color={"black"}
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ marginRight: 3 }}
    >
      {label}
    </TagBase>
  );
}

const TagBase = styled(Tag)`
  && {
    background: white !important;
    padding: 2px 12px;
    height: 32px;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 24px;
    border: 1px solid #2bbecb;
    border-radius: 64px;
    color: black !important;
    display: flex;
    gap: 12px;
    align-items: center;
  }

  span {
    color: #444444 !important;
    display: flex;
    align-items: center;
  }

  svg {
    width: 12px;
    height: 12px;
    fill: #444444 !important;
  }
`;

export const DropdownMenuOptionCustom = ({
  label,
  subtitle,
  listItems = [],
  valueSelectedItems = [],
  handleChangeValue,
  isLoading,
  isLoadingMore,
  fetchMore,
  error,
  optionClassname,
  onSelectAll,
  onClearAll,
  selectAll,
  ...props
}) => {
  return (
    <Container>
      <Row gutter={16} align="middle">
        <Col span={24}>
          <Row align="middle" justify="space-between">
            <Label>{label}</Label>
            <Row align="middle">
              <Space>
                <Col>
                  <TypographyBase
                    onClick={() => {
                      if (selectAll) {
                        onClearAll()
                      } else {
                        onSelectAll()
                      }
                    }}
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {selectAll
                      ? "Clear All"
                      : "Select All"}
                  </TypographyBase>
                </Col>
                <Col>
                  <Caption>{`${valueSelectedItems.length}/${listItems.length}`}</Caption>
                </Col>
              </Space>
            </Row>
          </Row>
          <Spacer display="block" size={4} />
          <InputSelect
            labelInValue
            notFoundContent={isLoading ? <Spin size="small" /> : "No Data"}
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
            tagRender={tagRender}
            style={{
              width: "100%",
              "--antd-wave-shadow-color": "#2BBECB",
            }}
            dropdownStyle={{
              background: "#FFFFFF",
              border: "1px solid #AAAAAA",
              boxSizing: "border-box",
              borderRadius: "8px",
              padding: "16px",
            }}
            {...props}
          >
            {!isLoadingMore
              ? listItems.map((item) => (
                  <Option
                    className="select-dropdown-item-custom"
                    value={item.value}
                    key={item.value}
                    label={item.label}
                  >
                    {item.label}
                  </Option>
                ))
              : [
                  ...listItems.map((item) => (
                    <Option
                      className="select-dropdown-item-custom"
                      value={item.value}
                      key={item.value}
                      label={item.label}
                    >
                      {item.label}
                    </Option>
                  )),
                  <Option key="loading">Loading...</Option>,
                ]}
          </InputSelect>
          <Subtitle error={error}>{error ? error : subtitle}</Subtitle>
        </Col>
      </Row>
    </Container>
  );
};

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
`;

const Label = styled.div`
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: #000000;
`;

const Caption = styled.div`
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: #666666;
`;

const InputSelect = styled(Select)`
  min-height: 88px !important;
  background: #ffffff !important;
  box-sizing: border-box !important;
  border-radius: 8px !important;

  .ant-select-selection-placeholder {
    top: 30% !important;
  }

  .ant-select-selector {
    min-height: 88px !important;
    background: #ffffff !important;
    border: 1px solid #aaaaaa !important;
    box-sizing: border-box !important;
    border-radius: 8px !important;
    display: flex;
    align-items: flex-start !important;
    padding: 8px !important;
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

  .rc-virtual-list-holder-inner {
    gap: 8px;
  }

  .ant-select-dropdown {
    padding: 0px !important;
  }
`;

const TypographyBase = styled(Typography.Link)`
  && {
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 19px;

    /* Primary/Pink Lava */

    color: #eb008b;

    :hover {
      color: #eb008b;
    }
  }
`;

DropdownMenuOptionCustom.PropTypes = {
  label: PropTypes.string,
  subtitle: PropTypes.string,
  listItems: PropTypes.array,
  valueSelectedItems: PropTypes.array,
  handleChangeValue: PropTypes.func,
  isLoading: PropTypes.bool,
  isLoadingMore: PropTypes.bool,
  fetchMore: PropTypes.func,
  error: PropTypes.string,
};
