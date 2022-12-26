import { SearchOutlined } from "@ant-design/icons";
import { Col, Input, Row, Select, Tag, Typography, Space, Divider } from "antd";
import PropTypes from "prop-types";
import React, { useState } from "react";
import styled from "styled-components";
import { Checkbox } from "./Checkbox";
import { Text } from "./Text";
import { Spacer } from "./Spacer";
import { ReactComponent as ArrowDown } from "../assets/arrow-down.svg";

const { Option, OptGroup } = Select;

const Notif = styled.div`
  background: #eb008b;
  border: 1px solid #eb008b;
  box-sizing: border-box;
  border-radius: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  font-weight: 600;
  font-size: 10px;
  line-height: 14px;
  color: #ffff;
`;

export const DropdownMenuOptionGroupCustom = ({
  label,
  subtitle,
  placeholder,
  error,
  disabled,
  listItems,
  isAllowClear,
  isShowClearFilter,
  handleChangeValue,
  width,
  roundedSelector,
  defaultValue,
  showClearButton,
  handleClearValue,
  ...props
}) => {
  const [items, setItems] = useState(listItems);

  const [search, setSearch] = useState("");

  const [selectedItems, setSelecetedItems] = useState([]);

  const handleChange = (selectedItems) => {
    setSelecetedItems(selectedItems);
    handleChangeValue && handleChangeValue(selectedItems);
  };

  const handleClear = () => {
    setSelecetedItems([]);
    handleClearValue && handleClearValue();
  };

  const filteredItems = items
    .map(({ list, ...others }) => {
      const filteredLists = list.filter((list) =>
        list?.label?.includes(search)
      );
      return {
        list: filteredLists,
        ...others,
      };
    })
    .filter((item) => {
      return item.list.length > 0;
    });

  const tagRender = (props) => {
    return (
      <Row gap="4px" align="center">
        <Notif>{selectedItems?.length}</Notif>
        <Spacer display="inline-block" size={4} />
        <Text variant={"label"}>Filters Used</Text>
        <Spacer display="inline-block" size={52} />
        <ArrowDown style={{ marginTop: "-2px" }} />
      </Row>
    );
  };

  return (
    <Container>
      {label && <Label>{label}</Label>}
      <Row gutter={16} align="middle">
        <Col>
          <InputSelect
            getPopupContainer={(trigger) => trigger.parentNode}
            style={{
              width: width ?? 410,
              "--antd-wave-shadow-color": "#2BBECB",
            }}
            placeholder={placeholder}
            allowClear={isAllowClear}
            roundedSelector={roundedSelector}
            onClear={() => setSelecetedItems([])}
            dropdownStyle={{
              background: "#FFFFFF",
              border: "1px solid #AAAAAA",
              boxSizing: "border-box",
              borderRadius: "8px",
              padding: "16px",
              fontStyle: "normal",
              fontWeight: 400,
              fontSize: "12px",
              lineHeight: "18px",
            }}
            mode="multiple"
            maxTagCount={1}
            tagRender={tagRender}
            defaultValue={defaultValue}
            value={selectedItems}
            onChange={handleChange}
            dropdownRender={(menu) => (
              <>
                <Input
                  placeholder="Search"
                  allowClear={isAllowClear}
                  onClear={() => setSelecetedItems([])}
                  style={{
                    marginBottom: "14px",
                    background: "#FFFFFF",
                    border: "1px solid #888888",
                    boxSizing: "border-box",
                    borderRadius: "8px",
                  }}
                  prefix={<SearchOutlined />}
                  onChange={(e) => setSearch(e.target.value)}
                  tokenSeparators={[","]}
                />
                {menu}
                {showClearButton && (
                  <>
                    <Divider
                      style={{
                        margin: "8px 0",
                      }}
                    />
                    <Space
                      style={{
                        padding: "0 8px 5px",
                        display: "block",
                        textAlign: "center",
                      }}
                    >
                      <TypographyBase
                        onClick={handleClear}
                        style={{ whiteSpace: "nowrap" }}
                      >
                        + Clear Filter
                      </TypographyBase>
                    </Space>
                  </>
                )}
              </>
            )}
            {...props}
          >
            {filteredItems.map((item) => (
              <>
                {item.label && (
                  <OptGroup label={item.label} key={item.label}>
                    {item.list.map((subItem) => (
                      <Option value={subItem.value} key={subItem.value}>
                        <Checkbox
                          checked={selectedItems?.includes(subItem.value)}
                          size="small"
                          text={subItem.label}
                        />
                      </Option>
                    ))}
                  </OptGroup>
                )}
                {!item.label &&
                  item.list.map((subItem) => (
                    <Option value={subItem.value} key={subItem.value}>
                      <Checkbox
                        checked={selectedItems?.includes(subItem.value)}
                        size="small"
                        text={subItem.label}
                      />
                    </Option>
                  ))}
              </>
            ))}
          </InputSelect>
          <Subtitle error={error}>{error ? error : subtitle}</Subtitle>
        </Col>
        {isShowClearFilter && (
          <Col>
            <TypographyBase
              onClick={() => setSelecetedItems([])}
              style={{ whiteSpace: "nowrap" }}
            >
              Clear Filter
            </TypographyBase>
          </Col>
        )}
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
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: #000000;
`;

const InputSelect = styled(Select)`
  min-height: 48px !important;
  background: #ffffff !important;
  box-sizing: border-box !important;
  border-radius: 8px !important;

  .ant-select-selection-overflow {
    height: 20px !important;
  }

  .ant-select-selection-overflow-item-rest {
    display: none;
  }

  .ant-select-selector {
    height: 48px !important;
    background: #ffffff !important;
    border: 1px solid #aaaaaa !important;
    box-sizing: border-box !important;
    border-radius: ${(p) => (p.roundedSelector ? "200px" : "8px")} !important;
    display: flex;
    align-items: center;
    padding: 8px !important;
  }

  .ant-select-arrow {
    color: #444444;
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

DropdownMenuOptionGroupCustom.propTypes = {
  label: PropTypes.string,
  subtitle: PropTypes.string,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  isAllowClear: PropTypes.bool,
  isShowClearFilter: PropTypes.bool,
  listItems: PropTypes.array,
  handleChangeValue: PropTypes.func,
};

DropdownMenuOptionGroupCustom.defaultProps = {
  label: "Text Input Label",
  subtitle: "",
  placeholder: "Select",
  error: "",
  disabled: false,
  isAllowClear: false,
  isShowClearFilter: false,
  listItems: [],
};
