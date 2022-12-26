import { Tag as TagAntd } from 'antd';
import React from 'react'
import styled from 'styled-components';
import PropTypes from 'prop-types';

const VARIANT = {
  green: {
    "--background": `#E2FFF3`,
    "--color": "#01A862",
  },
  red: {
    "--background": `#FFE4E5`,
    "--color": "#ED1C24",
  },
  cheese: {
    "--background": `#FFFBDF`,
    "--color": "#FFB400",
  },
  black: {
    "--background": `#F4F4F4`,
    "--color": "#666666",
  },
  blue: {
    "--background": `#D5FAFD`,
    "--color": "#2BBECB",
  },
};


export const Lozenge = ({variant, children, ...props}) => {
  const styles = VARIANT[variant]
  return (
    <BaseTag style={styles} {...props}>{children}</BaseTag>
  )
}

const BaseTag = styled(TagAntd)`
  && {
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 4px 8px;
    background: var(--background);
    color: var(--color);
    border-radius: 4px;
    font-weight: 500;
    font-size: 14px;
    line-height: 24px;
    border: none;
  }
`

Lozenge.propTypes = {
  variant: PropTypes.oneOf(['green', 'red', 'cheese', 'black']),
  children: PropTypes.string
}

Lozenge.defaultProps = {
  variant: 'green',
  children: 'Submitted'
}