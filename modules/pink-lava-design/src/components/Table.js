import { Table as TableAntd } from "antd";
import styled from "styled-components";
import { baseTheme } from "../theme/baseTheme";
import { ThemeProvider } from "styled-components";
import React, { useState } from "react";
import PropTypes from "prop-types";

const TableBase = styled(TableAntd)`
  .ant-checkbox-inner {
    width: 24px;
    height: 24px;
    border-radius: 6px;
    border: 2px solid #aaaaaa;
  }

  .ant-radio-inner {
    width: 24px;
    height: 24px;
    border: 2px solid #2bbecb;
  }

  .ant-radio-inner:after {
    width: 24px;
    height: 24px;
    top: 30%;
    left: 30%;
    background-color: #2bbecb;
  }

  .ant-radio-disabled .ant-radio-inner::after {
    background-color: #aae5ea;
  }

  .ant-checkbox-checked .ant-checkbox-inner::after {
    transform: rotate(45deg) scale(1) translate(-30%, -70%);
  }

  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: ${(p) => p.theme.blue.regular};
    border: 2px solid ${(p) => p.theme.blue.regular} !important;
  }

  .ant-checkbox-checked::after {
    border: none;
  }

  .ant-checkbox-wrapper:hover .ant-checkbox-inner,
  .ant-checkbox:hover .ant-checkbox-inner,
  .ant-checkbox-input:focus + .ant-checkbox-inner {
    border-color: ${(p) => p.theme.blue.regular};
  }

  .ant-checkbox-indeterminate .ant-checkbox-inner::after {
    background-color: ${(p) => p.theme.blue.regular};
  }

  .ant-table-thead
    > tr
    > th:not(:last-child):not(.ant-table-selection-column):not(.ant-table-row-expand-icon-cell):not([colspan])::before {
    background-color: transparent;
  }

  .ant-table-thead > tr > th {
    font-weight: 600;
    font-size: 16px;
    line-height: 22px;
  }

  .ant-table-container table > thead > tr:first-child th:first-child {
    border-top-left-radius: 8px;
  }

  .ant-table-container table > thead > tr:first-child th:last-child {
    border-top-right-radius: 8px;
  }

  .ant-table-thead > tr > th {
    background: #f4f4f4;
    height: 54px;
  }
`;

export const Table = ({ columns, data, rowSelection, loading, ...props }) => {
  return (
    <>
      <ThemeProvider theme={baseTheme}>
        <TableBase
          loading={loading}
          pagination={false}
          {...(rowSelection && { rowSelection: rowSelection })}
          columns={columns}
          dataSource={data}
          {...props}
        />
      </ThemeProvider>
    </>
  );
};

Table.propTypes = {
  data: PropTypes.array,
};

Table.defaultProps = {
  data: [],
};
