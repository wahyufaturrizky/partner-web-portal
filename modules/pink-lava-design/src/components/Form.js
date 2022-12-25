import { Modal as ModalAntd, Button as ButtonAntd } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { Button } from './Button';
import { DropdownMenu } from './DropdownMenu';
import { Input } from './Input';
import { TextArea } from './Textarea';
class Form extends React.Component {
  state = {
    loading: false,
    visible: false,
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, visible: false });
    }, 3000);
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  render() {
    const { visible, loading } = this.state;
    return (
      <>
        <ButtonAntd type="primary" onClick={this.showModal}>
          Open Modal with customized footer
        </ButtonAntd>
        <BaseModal
          visible={visible}
          title="Create Request Expert"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <div style={{display: 'flex', marginBottom: "12px", marginRight: "12px", justifyContent: 'flex-end', gap: '12px'}}>
              <Button size="big" variant="secondary" key="submit" type="primary" loading={loading} onClick={this.handleOk}>
                Save
              </Button>,
              <Button variant="primary" size="big">
                Submit
              </Button>
            </div>
          ]}
        >
          <Column>
            <Row>
              <CustomDropdownMenu label={"Project No"} placeholder="Select"/>
              <CustomDropdownMenu label={"Competency"} placeholder="Select"/>
            </Row>
            <Row>
              <CustomInput label={"Project Title"} placeholder=""/>
              <CustomInput disabled={true} label={"Status"} placeholder=""/>
            </Row>
            <Row>
              <CustomInput label={"Business Title"} placeholder=""/>
              <CustomInput disabled={true} label={"Remark"} placeholder=""/>
            </Row>
            <Row>
              <CustomInput label={"Project No"} placeholder=""/>
              <CustomInput label={"Project No"} placeholder=""/>
            </Row>
            <Row>
              <CustomTextArea label={"Job Requirement"} placeholder="Type here..."/>
            </Row>
            <Row>
              <CustomTextArea label={"Job Requirement"} placeholder="Type here..."/>
            </Row>
          </Column>
        </BaseModal>
      </>
    );
  }
}

const CustomTextArea = styled(TextArea)`
  width: 840px;
  height: 48px;
`

const CustomDropdownMenu = styled(DropdownMenu)`
  width: 410px;
  height: 48px;
`

const CustomInput = styled(Input)`
  width: 410px;
  height: 48px;
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const Row = styled.div`
  display: flex;
  gap: 20px;
  position: relative;

  .ant-input-textarea-show-count::after {
    position: absolute !important;
    right: -4px !important;
    top: 9px !important;
  }
`

const BaseModal = styled(ModalAntd)`
    .ant-modal-content {
      background: #FFFFFF;
      border-radius: 16px;
    }

    .ant-modal-header {
      border-radius: 16px;
      border:none;
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
    
    width: 880px !important;
    height: 780px;
`

export default Form;