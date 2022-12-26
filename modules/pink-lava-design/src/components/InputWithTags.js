import { Select, Tag } from 'antd';
import React from 'react';
import styled from 'styled-components';
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

export const InputWithTags = ({ onChange, label, isOptional, required, ...props }) => {
    return (
        <Container>
            {label && (
                <Label>
                    {label} {isOptional && <Span isOptional={isOptional}>(Optional)</Span>}
                    {required && <Span>&#42;</Span>}
                </Label>
            )}
            <InputSelect
                mode='tags'
                tokenSeparators={[',']}
                size={'default'}
                tagRender={tagRender}
                dropdownStyle={{ display: 'none' }}
                style={{ width: '100%' }}
                onChange={onChange}
                {...props}>
                {' '}
            </InputSelect>
        </Container>
    );
};

const InputSelect = styled(Select)`
    min-height: 88px !important;
    background: #ffffff !important;
    box-sizing: border-box !important;
    border-radius: 8px !important;

    .ant-select-selection__placeholder {
        top: 30% !important;
    }

    .ant-select-selector {
        background: #ffffff !important;
        border: 1px solid #aaaaaa !important;
        box-sizing: border-box !important;
        border-radius: 8px !important;
        display: flex;
        align-items: flex-start !important;
        padding: 8px !important;
        font-style: normal;
        font-weight: normal;
        font-size: 16px;
        line-height: 24px;
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

const Label = styled.div`
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
    color: #000000;
`;

const Span = styled.span`
    color: ${(props) => (props.isOptional ? '#000000' : '#ed1c24')};
    margin-left: 1px;
    font-weight: ${(props) => (props.isOptional ? 'lighter' : undefined)};
`;

const Container = styled.div`
    display: flex;
    gap: 4px;
    flex-direction: column;
    width: 100%;
`;
