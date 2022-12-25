import { Modal as ModalAntd, Button as ButtonAntd } from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from './Button';
import { Col } from './Col';
import { Row } from './Row'
import { Upload } from 'antd';
import { ReactComponent as DocumentIcon } from "../assets/document.svg"
import { ReactComponent as CloudIcon } from "../assets/cloud.svg"
import { ReactComponent as TrashIcon } from "../assets/trash.svg"
import ImgCrop from 'antd-img-crop';
import * as xlsx from 'xlsx';
import PropTypes from 'prop-types';

const { Dragger } = Upload;

export const FileUploaderExcel = ({onSubmit, visible, setVisible, label, required, defaultFile, disabled, withCrop, removeable }) => {

  const [file, setFile] = useState();
  const [error, setError] = useState();
  const [fileUrl, setFileUrl] = useState(defaultFile);
  const [fileData, setFileData] = useState([]);

  const onChange = async ({ fileList: newFileList }) => {
    setFileUrl(URL.createObjectURL(newFileList[0].originFileObj))
    setFile(newFileList[0]);
    let src = newFileList[0].url;
    if (!src) {
      src = await new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = () => {
            const data = reader.result;
            const workbook = xlsx.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = xlsx.utils.sheet_to_json(worksheet);
            setFileData(json);
        };
        reader.readAsArrayBuffer(newFileList[0].originFileObj);
      });
    }
  };

  const beforeUpload = (file) => {
    const acceptedImageTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];

    if (!acceptedImageTypes.includes(file.type)) {
      setError(`Failed, Uploaded files can't have ${file.type} extension`)
    }
    const isLt5M = file.size / 1024 / 1024 <= 5;
    if (!isLt5M) {
      setError("Failed, Uploaded files can't be more than 5mb");
    }
    return acceptedImageTypes.includes(file.type) && isLt5M;
  };

  const props = {
    name: 'file',
    multiple: false,
    maxCount: 1
  };

  return (
    <>
      {withCrop ?
        <CustomModal
          visible={visible}
          title="Upload"
          onOk={() => {
            if(!error){
              onSubmit(fileData)
            } else {
              setVisible(false)
            }
          }}
          onCancel={() => setVisible(false)}
          footer={[
              <Button size="big" full variant="primary" key="submit" type="primary"  
              onClick={() => {
                  if(!error && file){
                    onSubmit(fileData)
                  }
                  setVisible(false)
                }}>
                Done
              </Button>

          ]}
          hasFiles={!!file}
        >
            <ImgCrop 
              beforeCrop={()=> {
                setVisible(false);
                return true;
              }} 
              modalOk={"Save"} 
              onModalOk={() => {
                setVisible(true);
              }} 
              rotate
            >
              <BaseDragger {...props}
                customRequest={({file, onSuccess}) => {
                  setError('')
                  setTimeout(() => {
                    if(beforeUpload(file)){
                      onSuccess("ok");
                    } else {
                      onSuccess("error");
                    }
                  }, 0);
                }}
                itemRender={(_, file, __) => {
                  if(fileUrl){
                    return (
                    <Document>
                      <Row gap="12px" noWrap>
                        {error || !fileUrl || !withCrop? 
                          <DocumentIcon /> : 
                          <img style={{width: '48px', height: '48px'}} 
                            src={fileUrl} 
                          />
                        }
                        <Column>
                          <DocumentTitle>{file?.name}</DocumentTitle>
                          <UploadText type={error ? 'error' : 'success'}>
                            {error ? error : 'Completed'}
                          </UploadText>
                        </Column>
                      </Row>
                      {removeable ? <TrashIcon style={{cursor: 'pointer'}} onClick={() => {
                        setFile();
                        setFileUrl()
                      }} /> : <div></div>}
                    </Document>
                    )
                  } else {
                    return <></>
                  }
                }}
                onChange={onChange}
              >
                {!file? 
                  <>
                    <CloudIcon />
                    <Title>Drag & Drop or Browse Files</Title>
                    <OrText>OR</OrText>
                    <Button variant="tertiary" size="big">Browse File</Button>
                    <Subtitle>Max file size 5 Mb</Subtitle>
                  </>
                  :
                  <DragTtitle>Drag & Drop or Browse Files</DragTtitle>
                }
              </BaseDragger>
            </ImgCrop>
        </CustomModal>
      : 
      <CustomModal
        visible={visible}
        title="Upload"
        onOk={() => {
          if(!error){
            onSubmit(fileData)
          } else {
            setVisible(false)
          }
        }}
        onCancel={() => setVisible(false)}
        footer={[
            <Button size="big" full variant="primary" key="submit" type="primary"  
            onClick={() => {
                if(!error && file){
                  onSubmit(fileData)
                }
                setVisible(false)
              }}>
              Done
            </Button>

        ]}
        hasFiles={!!file}
      >
        <BaseDragger {...props}
          customRequest={({file, onSuccess}) => {
            setError('')
            setTimeout(() => {
              if(beforeUpload(file)){
                onSuccess("ok");
              } else {
                onSuccess("error");
              }
            }, 0);
          }}
          itemRender={(_, file, __) => {
            if(fileUrl){
              return (
              <Document>
                <Row gap="12px" noWrap>
                  {error || !fileUrl || !withCrop? 
                    <DocumentIcon /> : 
                    <img style={{width: '48px', height: '48px'}} 
                      src={fileUrl} 
                    />
                  }
                  <Column>
                    <DocumentTitle>{file?.name}</DocumentTitle>
                    <UploadText type={error ? 'error' : 'success'}>
                      {error ? error : 'Completed'}
                    </UploadText>
                  </Column>
                </Row>
                {removeable ? <TrashIcon style={{cursor: 'pointer'}} onClick={() => {
                  setFile();
                  setFileUrl()
                }} /> : <div></div>}
              </Document>
              )
            } else {
              return <></>
            }
          }}
          onChange={onChange}
        >
          {!file? 
            <>
              <CloudIcon />
              <Title>Drag & Drop or Browse Files</Title>
              <OrText>OR</OrText>
              <Button variant="tertiary" size="big">Browse File</Button>
              <Subtitle>Max file size 5 Mb</Subtitle>
            </>
            :
            <DragTtitle>Drag & Drop or Browse Files</DragTtitle>
          }
        </BaseDragger>
      </CustomModal>
    }
    </>
  );
}

const TextPhoto = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  color: #AAAAAA;
`

const ImagePhoto = styled.img`
  width: 72px;
  height: 72px;
  border-radius: 8px;
  background: #FFFFFF;
`

const Label = styled.div`
 font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: #000000;
`;

const DocumentTitle = styled.div`
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 24px;
  color: #000000;
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  width: 100%;
`

const Document = styled.div`
  background: #FFFFFF;
  border: 1px dashed #AAAAAA;
  box-sizing: border-box;
  border-radius: 10px;
  padding: 16px 12px;
  display: flex;
  gap: 6px;
  justify-content: space-between;
  align-items: center;
`

const DragTtitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
  text-align: center;
  color: #EB008B;
`

const Title = styled.div`
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  color: #888888;
`

const OrText = styled.div`
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  color: #888888;
  margin-top: 12px;
  margin-bottom: 12px;
`

const Subtitle = styled.div`
  font-weight: normal;
  font-size: 14px;
  line-height: 24px;
  color: #ED1C24;
  margin-top: 8px;
`

const UploadText = styled.div`
  font-family: 'Nunito Sans';
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 24px;
  color: ${p => p.type === 'success' ? '#2BBECB' : '#ED1C24'};
`

const BaseDragger = styled(Dragger)`
`

const BaseModal = styled(ModalAntd)`

    .ant-upload.ant-upload-drag {
      background: white;
      border: 1px dashed ${p => p.hasFiles ? "#EB008B" : "#AAAAAA"};
      width: 520px;
      height: ${p => p.hasFiles ? "80px" : "360px"}; 
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-radius: 8px;
    }

    .ant-upload.ant-upload-drag .ant-upload-btn {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .ant-upload.ant-upload-drag .ant-upload-drag-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .ant-modal-content {
      background: #FFFFFF;
      border-radius: 16px;
      width: 570px;
      height: max-content;
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

    .ant-modal-body > span {
      display: flex;
      flex-direction: column-reverse;
      gap: 12px;
    }
`

const CustomModal = styled(BaseModal)`
  
`

FileUploaderExcel.propTypes = {
  onSubmit: PropTypes.func,
  label: PropTypes.string,
  required: PropTypes.bool,
  defaultFile: PropTypes.string,
  disabled: PropTypes.bool,
  withCrop: PropTypes.bool,
  removeable: PropTypes.bool
};