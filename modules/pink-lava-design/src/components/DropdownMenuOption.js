import { SearchOutlined } from "@ant-design/icons";
import { Col, Input, Row, Select, Tag, Typography, Spin, Space } from "antd";
import { Spacer } from "./Spacer";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Checkbox } from "./Checkbox";

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
      {label?.props?.children[1] || ''}
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

export const DropdownMenuOption = ({
  label,
  subtitle,
  placeholder,
  error,
  disabled,
  listItems,
  valueSelectedItems,
  isAllowClear,
  handleChangeValue,
  loading,
}) => {
  const [items, setItems] = useState(listItems || [{ label: "", value: 0 }]);

  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(loading);

  const [selectedItems, setSelecetedItems] = useState(
    valueSelectedItems || [0]
  );

  const handleChange = (selectedItems) => {
    setSelecetedItems(selectedItems);
    handleChangeValue && handleChangeValue(
      listItems.filter(data => selectedItems.includes(data.value)) 
    );
  };

  let filteredItems = [{ label: "", value: 0 }];

  if (items.length > 0) {
    filteredItems = items.filter((item) =>
      item?.label?.toLowerCase().includes(search)
    );
  } else {
    filteredItems = [{ label: "", value: 0 }].filter((item) =>
      item?.label?.toLowerCase().includes(search)
    );
  }

  useEffect(() => {
    if (listItems.length > 0 && !loading) {
      setItems(listItems || [{ label: "", value: 0 }]);
      setIsLoading(false);
    }
    if (valueSelectedItems.length > 0 && !loading) {
      setSelecetedItems(valueSelectedItems || [0]);
      setIsLoading(false);
    }
  }, [listItems, valueSelectedItems, loading]);

  return (
    <Container>
      <Row gutter={16} align="middle">
        <Col span={24}>
          <InputSelect
            getPopupContainer={trigger => trigger.parentNode}
            loading={isLoading}
            style={{
              width: "100%",
              "--antd-wave-shadow-color": "#2BBECB",
            }}
            placeholder={placeholder}
            allowClear={isAllowClear}
            onClear={() => {
              setSearch("");
              setSelecetedItems([]);
            }}
            dropdownStyle={{
              background: "#FFFFFF",
              border: "1px solid #AAAAAA",
              boxSizing: "border-box",
              borderRadius: "8px",
              padding: "16px",
            }}
            mode="multiple"
            tagRender={tagRender}
            value={selectedItems}
            onChange={handleChange}
            onSearch={(e) => setSearch(e)}
            dropdownRender={(menu) => (
              <>
                <Input
                  placeholder="Search"
                  allowClear={isAllowClear}
                  onClear={() => {
                    setSearch("");
                    setSelecetedItems([]);
                  }}
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
                {isLoading ? <Spin tip="loading data..." /> : menu}
              </>
            )}
          >
            {isLoading ? (
              <Spin tip="loading data..." />
            ) : filteredItems.length === 0 ? (
              <Spin tip="loading data..." />
            ) : (
              filteredItems.map((item) => (
                <Option value={item.value} key={item.value}>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      padding: "0px !important",
                    }}
                  >
                    <Checkbox
                      checked={selectedItems.includes(item.value)}
                      size="big"
                    />
                    {item.label}
                  </div>
                </Option>
              ))
            )}
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
  width: 100%;
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
  background: #ffffff !important;
  box-sizing: border-box !important;
  border-radius: 8px !important;

  .ant-select-selector {
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
    font-size: 16px;
    line-height: 19px;

    /* Primary/Pink Lava */

    color: #eb008b;

    :hover {
      color: #eb008b;
    }
  }
`;

const ItemTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
};

DropdownMenuOption.propTypes = {
  label: PropTypes.string,
  subtitle: PropTypes.string,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  isAllowClear: PropTypes.bool,
  loading: PropTypes.bool,
  isWidthFull: PropTypes.bool,
  listItems: PropTypes.arrayOf(ItemTypes),
  valueSelectedItems: PropTypes.array,
  handleChangeValue: PropTypes.func,
};

DropdownMenuOption.defaultProps = {
  label: "Text Input Label",
  subtitle: "",
  placeholder: "Select",
  error: "",
  disabled: false,
  isAllowClear: false,
  loading: false,
  isWidthFull: true,
  listItems: [],
  valueSelectedItems: [],
};
