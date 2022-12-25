/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-param-reassign */
import {
  Col, Input, Row, Select, Typography,
} from 'antd';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { AiOutlineSearch } from 'react-icons/ai';
import { IoIosArrowDown } from 'react-icons/io';
import { matchSorter } from 'match-sorter';
import { Checkbox } from './Checkbox';

const { Option, OptGroup } = Select;

const Notif = styled.div`
  background: #EB008B;
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

export const DropdownMultiValue = ({
  label = null,
  subtitle = null,
  placeholder = '',
  error = null,
  disabled = false,
  listItems,
  isAllowClear = false,
  isShowClearFilter = false,
  handleChangeValue,
  defaultValue = [],
  rounded = false,
}) => {
  const [items] = useState(listItems);
  const [filteredItems, setFilteredItems] = useState<{[x: string]: any}[]>([]);
  // const [search, setSearch] = useState('');
  const [selectedItems, setSelecetedItems] = useState<string[]>([]);

  useEffect(() => {
    setFilteredItems(listItems);
  }, [listItems]);

  const handleChange = (selected) => {
    setSelecetedItems(selected);
  };

  useEffect(() => {
    handleChangeValue?.(selectedItems);
  }, [selectedItems]);

  // const filteredItems = items.map(({ list, ...others }) => {
  //   const filteredLists = list.filter((l) => l.label.includes(search));

  //   return {
  //     list: filteredLists,
  //     ...others,
  //   };
  // }).filter((item) => item.list.length > 0);

  const onSearch = (value) => {
    const searchResult = items.map((item) => ({
      label: item.label,
      list: matchSorter(item.list, value, { keys: ['label'] }),
    }))
      .filter((item) => item.list.length > 0);

    setFilteredItems(searchResult);
  };

  const tagRender = () => (
    <div className="flex justify-between">
      <div className="flex gap-x-2">
        <Notif>{selectedItems?.length}</Notif>
        <span>Filters Used</span>
      </div>
      <IoIosArrowDown size={20} />
    </div>
  );

  return (
    <Container>
      {label && <Label>{label}</Label>}
      <Row>
        <Col className="w-full">
          <InputSelect
            className="w-full"
            rounded={rounded}
            placeholder={placeholder}
            allowClear={isAllowClear}
            onClear={() => setSelecetedItems([])}
            disabled={disabled}
            dropdownStyle={{
              background: '#FFFFFF',
              border: '1px solid #AAAAAA',
              boxSizing: 'border-box',
              borderRadius: '8px',
              padding: '12px',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '12px',
              lineHeight: '18px',
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
                  style={{
                    marginBottom: '14px',
                    background: '#FFFFFF',
                    border: '1px solid #888888',
                    boxSizing: 'border-box',
                    borderRadius: '8px',
                  }}
                  prefix={<AiOutlineSearch />}
                  onChange={(e) => onSearch(e.target.value)}
                />
                {menu}
                <div role="none" className="text-center mt-3 p-0" onClick={() => setSelecetedItems([])}>
                  <button
                    className="bg-pink-600 text-white active:bg-pink-600 text-sm px-5 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none w-full ease-linear transition-all duration-150"
                    type="button"
                  >
                    Clear Filter
                  </button>
                </div>
              </>
            )}
          >
            {filteredItems.map((item, idx) => (
              <OptGroup label={item.label} key={item.label}>
                {item.list.map((subItem: { value: string, label: string }) => (
                  <Option className="mt-[-10px]" value={subItem.value} key={`${idx}-${subItem.value}`}>
                    <Checkbox
                      checked={selectedItems.includes(subItem.value)}
                      size="small"
                      text={subItem.label}
                    />
                  </Option>
                ))}
              </OptGroup>
            ))}

          </InputSelect>
          <Subtitle error={error}>{error || subtitle}</Subtitle>
        </Col>
        {isShowClearFilter && (
          <Col>
            <TypographyBase
              onClick={() => setSelecetedItems([])}
              style={{ whiteSpace: 'nowrap' }}
            >
              Clear Filter
            </TypographyBase>
          </Col>
        )}
      </Row>
    </Container>
  );
};

const Subtitle = styled.div<{error}>`
  font-weight: normal;
  font-size: 12px;
  line-height: 18px;
  color: ${(p) => (p.error ? '#ED1C24' : '#888888')};
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

const InputSelect = styled(Select)<{rounded: boolean}>`
  min-height: 48px !important;
  background: #ffffff !important;
  box-sizing: border-box !important;

  .ant-select-selection-placeholder {
    color: black;
    text-align: center;
  }

  .ant-select-selection-overflow-item {
    width: 100% !important;
  }

  .ant-select-selection-overflow-item.ant-select-selection-overflow-item-suffix {
    display: none !important;
  }

  .ant-select-selector:hover {
    cursor: pointer !important;
    caret-color: transparent;
  }

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
    border-radius: ${({ rounded }) => (rounded ? '30px' : '8px')} !important;
    display: flex;
    align-items: center;
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
    font-size: 14px;
    line-height: 19px;

    /* Primary/Pink Lava */

    color: #eb008b;

    :hover {
      color: #eb008b;
    }
  }
`;

DropdownMultiValue.propTypes = {
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

DropdownMultiValue.defaultProps = {
  label: '',
  subtitle: '',
  placeholder: 'Select',
  error: '',
  disabled: false,
  isAllowClear: false,
  isShowClearFilter: false,
  listItems: [],
  handleChangeValue: () => {},
};
