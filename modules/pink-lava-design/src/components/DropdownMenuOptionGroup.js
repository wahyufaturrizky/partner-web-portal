import { SearchOutlined } from '@ant-design/icons';
import { Col, Input, Row, Select, Tag, Typography } from 'antd';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styled from 'styled-components';
import { Checkbox } from './Checkbox';

const { Option, OptGroup } = Select;
function tagRender(props) {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event) => {
        event.preventDefault();
        event.stopPropagation();
    };

    return (
        <TagBase
            color={'black'}
            onMouseDown={onPreventMouseDown}
            closable={closable}
            onClose={onClose}
            style={{ marginRight: 3 }}>
            {label.props.children[1]}
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

export const DropdownMenuOptionGroup = ({
    label,
    subtitle,
    placeholder,
    error,
    disabled,
    listItems,
    noSearch,
    isAllowClear,
    isShowClearFilter,
    isShowClearFilterFn,
    handleChangeValue,
}) => {
    const [items, setItems] = useState(listItems);

    const [search, setSearch] = useState('');

    const [selectedItems, setSelecetedItems] = useState([]);

    const handleChange = (selectedItems) => {
        setSelecetedItems(selectedItems);
        handleChangeValue && handleChangeValue(selectedItems);
    };

    const filteredItems = items.filter((item) => item.label.toLowerCase().includes(search));

    return (
        <Container>
            <Label>{label}</Label>
            <Row gutter={16} align='middle'>
                <Col>
                    <InputSelect
                        getPopupContainer={(trigger) => trigger.parentNode}
                        style={{ width: 410, '--antd-wave-shadow-color': '#2BBECB' }}
                        placeholder={placeholder}
                        allowClear={isAllowClear}
                        onClear={() => setSelecetedItems([])}
                        dropdownStyle={{
                            background: '#FFFFFF',
                            border: '1px solid #AAAAAA',
                            boxSizing: 'border-box',
                            borderRadius: '8px',
                            padding: '16px',
                        }}
                        mode='multiple'
                        tagRender={tagRender}
                        value={selectedItems}
                        onChange={handleChange}
                        disabled={disabled}
                        dropdownRender={(menu) => (
                            <>
                                <Input
                                    placeholder='Search'
                                    allowClear={isAllowClear}
                                    onClear={() => setSelecetedItems([])}
                                    style={{
                                        marginBottom: '14px',
                                        background: '#FFFFFF',
                                        border: '1px solid #888888',
                                        boxSizing: 'border-box',
                                        borderRadius: '8px',
                                    }}
                                    prefix={noSearch ? '' : <SearchOutlined />}
                                    onChange={(e) => setSearch(e.target.value)}
                                    tokenSeparators={[',']}
                                    disabled={disabled}
                                />
                                {menu}
                            </>
                        )}>
                        {filteredItems.map((item) => (
                            <OptGroup label={item.label} key={item.label}>
                                {item?.list?.map((subItem) => (
                                    <Option value={subItem.value} key={subItem.value}>
                                        <div
                                            style={{
                                                display: 'flex',
                                                gap: '8px',
                                                padding: '0px !important',
                                            }}>
                                            <Checkbox
                                                checked={selectedItems.includes(subItem.value)}
                                                size='big'
                                            />
                                            {subItem.label}
                                        </div>
                                    </Option>
                                ))}
                            </OptGroup>
                        ))}
                    </InputSelect>
                    <Subtitle error={error}>{error ? error : subtitle}</Subtitle>
                </Col>
                {isShowClearFilter && (
                    <Col>
                        <TypographyBase
                            onClick={() => {
                                isShowClearFilterFn();
                                setSelecetedItems([]);
                            }}
                            style={{ whiteSpace: 'nowrap' }}>
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

const InputSelect = styled(Select)`
    min-height: 48px !important;
    background: #ffffff !important;
    box-sizing: border-box !important;
    border-radius: 8px !important;

    .ant-select-selector {
        min-height: 48px !important;
        background: #ffffff !important;
        border: 1px solid #aaaaaa !important;
        box-sizing: border-box !important;
        border-radius: 8px !important;
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

DropdownMenuOptionGroup.propTypes = {
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

DropdownMenuOptionGroup.defaultProps = {
    label: 'Text Input Label',
    subtitle: '',
    placeholder: 'Select',
    error: '',
    disabled: false,
    isAllowClear: false,
    isShowClearFilter: false,
    listItems: [],
};
