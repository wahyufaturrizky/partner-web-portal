import { Select, Tag, Typography } from "antd";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import { baseTheme } from "../theme/baseTheme";

const { Option } = Select;

let index = 0;

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
      {Array.isArray(label?.props?.children)
        ? label?.props?.children?.[0]
        : label}
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

export const DropdownSelect = ({
  items,
  onChange,
  placeholder,
  height = "88px",
  mode = "tags",
  ...props
}) => {
  const [name, setName] = useState("");

  const [search, setSearch] = useState("");

  // const addItem = e => {
  //   e.preventDefault();
  //   onChange([...items, name || `New item ${index++}`]);
  //   setName('');
  // };

  const [selectedItems, setSelecetedItems] = useState([]);

  const handleChange = (selectedItems) => {
    setSelecetedItems(selectedItems);
  };

  useEffect(() => {
    onChange(selectedItems);
  }, [selectedItems]);

  const filteredItems = items.filter((item) =>
    item.toLowerCase().includes(search)
  );

  return (
    <ThemeProvider theme={baseTheme}>
      <InputSelect
        {...props}
        getPopupContainer={trigger => trigger.parentNode}
        style={{
          width: "100%",
          height: height,
          "--antd-wave-shadow-color": "#2BBECB",
        }}
        placeholder={placeholder}
        dropdownStyle={{
          background: "#FFFFFF",
          border: "1px solid #AAAAAA",
          boxSizing: "border-box",
          borderRadius: "8px",
          padding: "16px",
        }}
        mode={mode}
        tagRender={tagRender}
        value={selectedItems}
        onChange={handleChange}
        tokenSeparators={[","]}
        // dropdownRender={menu => (
        //   <>
        //     <Input placeholder="Search" style={{
        //         marginBottom: "14px",
        //         background: "#FFFFFF",
        //         border: "1px solid #888888",
        //         boxSizing: "border-box",
        //         borderRadius: "8px",
        //       }} prefix={<SearchOutlined />}
        //         onChange={(e) => setSearch(e.target.value)}
        //       />

        //     <Space style={{marginBottom: "16px"}}>
        //       <TypographyBase onClick={addItem} style={{ whiteSpace: 'nowrap' }}>
        //         <PlusOutlined /> Add item
        //       </TypographyBase>
        //     </Space>
        //     {menu}
        //   </>
        // )}
      >
        {filteredItems.map((item) => (
          <Option key={item}>
            <div
              style={{ display: "flex", gap: "8px", padding: "0px !important" }}
            >
              {item}
            </div>
          </Option>
        ))}
      </InputSelect>
    </ThemeProvider>
  );
};

const InputSelect = styled(Select)`
  min-height: 88px !important;
  background: #ffffff !important;
  box-sizing: border-box !important;
  border-radius: 8px !important;

  .ant-select-selector {
    min-height: 88px !important;
    background: #ffffff !important;
    border: 1px solid #aaaaaa !important;
    box-sizing: border-box !important;
    border-radius: 8px !important;
    display: flex;
    align-items: flex-start;
    padding: 8px !important;
  }

  .ant-select-multiple .ant-select-selection-placeholder {
    top: 25% !important;
  }

  .ant-select-selection-placeholder {
    top: 25% !important;
  }

  .ant-select-arrow {
    color: ${(p) => p.theme.black.regular};
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

DropdownSelect.propTypes = {
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  items: PropTypes.array,
};

DropdownSelect.defaultProps = {
  placeholder: "Select",
  listItems: [],
};
