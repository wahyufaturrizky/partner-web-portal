/* eslint-disable react/no-danger */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Select, Input, Skeleton } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Text } from '..';
import { baseTheme } from '../../theme/baseTheme';
import debounce from 'lodash.debounce';
import uniqBy from 'lodash.uniqby';
import { Subtitle } from './Subtitle';

const { Option } = Select;

export const Dropdown = React.forwardRef(
  (
    {
      id,
      defaultValue = '',
      rounded = false,
      label,
      width,
      items = [{ value: '', id: 0 }],
      subtitle = null,
      placeholder = 'Select',
      error,
      handleChange,
      onSearch,
      noSearch,
      isHtml = null,
      loading,
      allowClear = false,
      onClear = () => null,
      onChange,
      ...props
    },
    ref,
  ) => {
    const originalItems = [...items];
    const [dataItems, setDataItems] = useState(items);
    const [isLoading, setIsLoading] = useState(loading);
    const [defaultValueData, setdefaultValueData] = useState(defaultValue);
    useEffect(() => {
      setDataItems(uniqBy(items, 'id'));
      setIsLoading(loading);
      setdefaultValueData(defaultValue);
    }, [items, loading, defaultValue]);

    const doSearch = (e) => {
      const { value } = e.target;
      if (onSearch) {
        onSearch(value, id);
        return;
      }

      const filteredItems = originalItems.filter((item) => item?.value?.toLowerCase().replace(/\s+/g, '').includes(value.toLowerCase().replace(/\s+/g, '')));
      setDataItems(filteredItems);
    };

    if (isLoading) {
      return (
        <Container width={width}>
          <Label>{label}</Label>
          <Skeleton.Input size="large" active block />
        </Container>
      );
    }

    return (
      <ThemeProvider theme={baseTheme}>
        <Container width={width}>
          {label && <Label>{label}</Label>}
          <InputSelect
            ref={ref}
            allowClear={allowClear}
            onClear={onClear}
            error={error}
            {...(defaultValue ? { defaultValue: defaultValueData } : {})}
            rounded={rounded}
            style={{ width }}
            placeholder={placeholder}
            dropdownStyle={{
              background: '#FFFFFF',
              border: '1px solid #AAAAAA',
              boxSizing: 'border-box',
              borderRadius: '8px',
              padding: '16px',
            }}
            {...(noSearch
              ? {}
              : {
                dropdownRender: (menu) => (
                  <>
                    <InputSearch
                      placeholder="Search"
                      style={{
                        marginBottom: '14px',
                        background: '#FFFFFF',
                        border: '1px solid #888888',
                        boxSizing: 'border-box',
                        borderRadius: '8px',
                      }}
                      prefix={<SearchOutlined />}
                      onChange={debounce(doSearch, 600)}
                      tokenseparators={[',']}
                    />
                    {menu}
                  </>
                ),
              })}
            {...props}
            onChange={(value) => {
              onChange?.({
                target: {
                  value,
                  name: id,
                  selected: items.find((item) => item.id === value),
                  label: items.find((item) => item.id === value)?.label,
                },
              });
            }}
          >
            {isLoading ? (
              <Text>Loading data...</Text>
            ) : (
              dataItems.map((item) => (
                <Option key={`${id}-${item.id}`} value={item.id}>
                  {isHtml ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: item.value }}
                      style={{
                        display: 'flex',
                        gap: '8px',
                        padding: '0px !important',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        display: 'flex',
                        gap: '8px',
                        padding: '0px !important',
                      }}
                    >
                      {item.value}
                    </div>
                  )}
                </Option>
              ))
            )}
          </InputSelect>
          <Subtitle error={error}>{error || subtitle}</Subtitle>
        </Container>
      </ThemeProvider>
    );
  },
);

const OptionText = styled.div`
  ${({ disabled }) => (disabled ? `&& div {
    color: gray !important;
  }` : '')}
`;

const Container = styled.div`
  display: flex;
  gap: 4px;
  flex-direction: column;
  width: ${(p) => (p.width ? p.width : '100%')};
`;

const Label = styled.div`
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  color: #000000;
`;

const InputSearch = styled(Input)``;

const InputSelect = styled(Select)`
  border: 1px solid ${(p) => (p.error ? p.theme.red.regular : 'transparent')};
  min-height: 48px !important;
  background: #ffffff;
  box-sizing: border-box !important;
  border-radius: ${(p) => (p.rounded ? '64px' : '8px')} !important;
  --antd-wave-shadow-color: #2BBECB;

  .ant-select-selector {
    min-height: 48px !important;
    background: #ffffff;
    border: 1px solid ${(p) => (p.error ? p.theme.red.regular : p.theme.grey.light)} !important;
    box-sizing: border-box !important;
    border-radius: ${(p) => (p.rounded ? '64px' : '8px')} !important;
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
