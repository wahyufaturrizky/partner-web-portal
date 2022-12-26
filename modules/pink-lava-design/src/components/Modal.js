import React, { forwardRef } from "react";
import { Modal as ModalAntd } from "antd";
import styled from "styled-components";
import PropTypes from "prop-types";

export const Modal = forwardRef(
  (
    { footer, content, visible, onOk, onCancel, title, width, ...props },
    ref
  ) => {
    return (
      <>
        <BaseModal
          ref={ref}
          visible={visible}
          title={title}
          onOk={onOk}
          width={width}
          onCancel={onCancel}
          footer={footer}
          {...props}
        >
          {content}
        </BaseModal>
      </>
    );
  }
);

const BaseModal = styled(ModalAntd)`
  .ant-modal-content {
    background: #ffffff;
    border-radius: 16px;
  }

  .ant-modal-header {
    border-radius: 16px;
    border: none;
    padding: 20px 20px 0px 20px;
  }

  .ant-modal-body {
    padding: 0px 20px;
  }

  .ant-modal-footer {
    padding: 0px 20px 20px 20px;
  }

  .ant-modal-title {
    color: #000000 !important;
    font-style: normal !important;
    font-weight: 600 !important;
    font-size: 34px !important;
    line-height: 46px !important;
  }

  .ant-modal-footer {
    border: none;
  }
`;

Modal.propTypes = {
  footer: PropTypes.node,
  content: PropTypes.node,
  visible: PropTypes.bool,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
  title: PropTypes.string,
  width: PropTypes.string,
};
