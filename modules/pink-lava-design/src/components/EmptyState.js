import { Empty as EmptyStateAntd } from 'antd';
import React from 'react'
import styled from 'styled-components';
import PropTypes from 'prop-types';

export const EmptyState = ({title, height, image, subtitle, children}) => {
  return (
      <BaseEmptyState
      image={image}
      height={height}
      description={
        <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
        <p className='title'>{title}</p>
        <p className='subtitle'>{subtitle}</p>
        </div>
      }
    >
      {children}
    </BaseEmptyState>
  )
}

const BaseEmptyState = styled(EmptyStateAntd)`
  .ant-empty-image {
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
  }

  .ant-empty-image {
    height: ${p => `${p.height}px` || '100px'}
  }

  .title {
    font-style: normal;
    font-weight: 600;
    font-size: 24px;
    line-height: 33px;
    color: #000000;
    margin: 0px;
    padding: 0px;
  }

  .subtitle {
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 24px;
    color: #000000;
    margin: 0px;
    padding: 0px;
  }

  .ant-empty-footer {
    display: flex;
    justify-content: center;
  }
`

EmptyState.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
}

EmptyState.defaultProps = {
  title: 'No Company Access Yet',
  subtitle: 'Press add company button to add company access'
} 