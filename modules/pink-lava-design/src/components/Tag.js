import React from 'react'
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Tag as TagAntd } from 'antd';


export const Tag = ({children}) => {
  return (
    <TagBase>{children}</TagBase>
  )
}

const TagBase = styled(TagAntd)`
  && {
    background: white !important;
    padding: 2px 12px;
    width: max-content;
    height: 32px;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 24px;
    border: 1px solid #2BBECB;
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
`

Tag.propTypes = {
  variant: PropTypes.oneOf(['green', 'red', 'cheese', 'black']),
  children: PropTypes.string
}

Tag.defaultProps = {
  variant: 'green',
  children: 'Submitted'
}