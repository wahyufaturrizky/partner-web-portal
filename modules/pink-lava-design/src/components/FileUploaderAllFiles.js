import { Modal as ModalAntd, Button as ButtonAntd } from "antd";
import React, { useState } from "react";
import styled from "styled-components";
import { Button } from "./Button";
import { Col } from "./Col";
import { Row } from "./Row";
import { Upload } from "antd";
import { ReactComponent as DocumentIcon } from "../assets/document.svg";
import { ReactComponent as CloudIcon } from "../assets/cloud.svg";
import { ReactComponent as TrashIcon } from "../assets/trash.svg";
import ImgCrop from "antd-img-crop";
import PropTypes from "prop-types";

const { Dragger } = Upload;

export const FileUploaderAllFiles = ({
  onSubmit,
  label,
  required,
  defaultFile,
  disabled,
  withCrop,
  removeable,
  textPhoto = [
    `Format .JPG, .JPEG, .PNG ${!withCrop && ", .PDF"}`,
    "File Size Max. 5MB",
  ],
  sizeImagePhoto = "72px",
  isOptional,
  style
}) => {
  const [file, setFile] = useState();
  const [error, setError] = useState();
  const [visible, setVisible] = useState();
  const [fileUrl, setFileUrl] = useState(defaultFile);
  const [fileType, setFileType] = useState("");

  const onChange = ({ fileList: newFileList }) => {
    setFileUrl(URL.createObjectURL(newFileList[0].originFileObj));
    setFile(newFileList[0]);
  };

  const beforeUpload = (file) => {
    const acceptedImageTypes = ["image/gif", "image/jpeg", "image/png"];
    if (!withCrop) {
      acceptedImageTypes.push("application/pdf");
    }

    if (!acceptedImageTypes.includes(file.type)) {
      setError(`Failed, Uploaded files can't have ${file.type} extension`);
    }
    const isLt5M = file.size / 1024 / 1024 <= 5;
    if (!isLt5M) {
      setError("Failed, Uploaded files can't be more than 5mb");
    }
    setFileType(file.type)
    return acceptedImageTypes.includes(file.type) && isLt5M;
  };

  const props = {
    name: "file",
    multiple: false,
    maxCount: 1,
  };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  return (
    <>
      <Col gap="8px" width="100%" style={style}>
        <Label>
          {label}
          {isOptional && <Span isOptional={isOptional}>(Optional)</Span>}
          {required && <Span>&#42;</Span>}
        </Label>
        <Row gap="8px">
          {error || !fileUrl || fileType?.includes("pdf") ? (
            <DocumentIcon />
          ) : (
            <ImagePhoto sizeImagePhoto={sizeImagePhoto} src={fileUrl} />
          )}
          <Col gap="4px">
            <Col>
              {textPhoto.map((data, index) => (
                <TextPhoto key={index}>{data}</TextPhoto>
              ))}
            </Col>
            <Button
              style={{ width: "96px" }}
              disabled={disabled}
              size="small"
              width="96px"
              variant="primary"
              onClick={() => {
                if (!disabled) {
                  setVisible(true);
                }
              }}
            >
              Upload
            </Button>
          </Col>
        </Row>
      </Col>

      {withCrop ? (
        <CustomModal
          visible={visible}
          title="Upload"
          onOk={() => {
            if (!error) {
              onSubmit(file.originFileObj);
            } else {
              setVisible(false);
            }
          }}
          onCancel={() => setVisible(false)}
          footer={[
            <Button
              size="big"
              full
              variant="primary"
              key="submit"
              type="primary"
              onClick={() => {
                if (!error && file) {
                  onSubmit(file.originFileObj);
                }
                setVisible(false);
              }}
            >
              Done
            </Button>,
          ]}
          hasFiles={!!file}
        >
          <ImgCrop
            beforeCrop={() => {
              setVisible(false);
              return true;
            }}
            modalOk={"Save"}
            onModalOk={() => {
              setVisible(true);
            }}
            rotate
          >
            <BaseDragger
              {...props}
              customRequest={({ file, onSuccess }) => {
                setError("");
                setTimeout(() => {
                  if (beforeUpload(file)) {
                    onSuccess("ok");
                  } else {
                    onSuccess("error");
                  }
                }, 0);
              }}
              itemRender={(_, file, __) => {
                if (fileUrl) {
                  return (
                    <Document>
                      <Row gap="12px" noWrap>
                        {error || !fileUrl || !withCrop ? (
                          <DocumentIcon />
                        ) : (
                          <img
                            style={{ width: "48px", height: "48px" }}
                            src={fileUrl}
                          />
                        )}
                        <Column>
                          <DocumentTitle>{file?.name}</DocumentTitle>
                          <UploadText type={error ? "error" : "success"}>
                            {error ? error : "Completed"}
                          </UploadText>
                        </Column>
                      </Row>
                      {removeable ? (
                        <TrashIcon
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setFile();
                            setFileUrl();
                          }}
                        />
                      ) : (
                        <div></div>
                      )}
                    </Document>
                  );
                } else {
                  return <></>;
                }
              }}
              onChange={onChange}
              onPreview={onPreview}
            >
              {!file ? (
                <>
                  <CloudIcon />
                  <Title>Drag & Drop or Browse Files</Title>
                  <OrText>OR</OrText>
                  <Button variant="tertiary" size="big">
                    Browse File
                  </Button>
                  <Subtitle>Max file size 5 Mb</Subtitle>
                </>
              ) : (
                <DragTtitle>Drag & Drop or Browse Files</DragTtitle>
              )}
            </BaseDragger>
          </ImgCrop>
        </CustomModal>
      ) : (
        <CustomModal
          visible={visible}
          title="Upload"
          onOk={() => {
            if (!error) {
              onSubmit(file.originFileObj);
            } else {
              setVisible(false);
            }
          }}
          onCancel={() => setVisible(false)}
          footer={[
            <Button
              size="big"
              full
              variant="primary"
              key="submit"
              type="primary"
              onClick={() => {
                if (!error && file) {
                  onSubmit(file.originFileObj);
                }
                setVisible(false);
              }}
            >
              Done
            </Button>,
          ]}
          hasFiles={!!file}
        >
          <BaseDragger
            {...props}
            customRequest={({ file, onSuccess }) => {
              setError("");
              setTimeout(() => {
                if (beforeUpload(file)) {
                  onSuccess("ok");
                } else {
                  onSuccess("error");
                }
              }, 0);
            }}
            itemRender={(_, file, __) => {
              if (fileUrl) {
                return (
                  <Document>
                    <Row gap="12px" noWrap>
                      {error || !fileUrl || !withCrop ? (
                        <DocumentIcon />
                      ) : (
                        <img
                          style={{ width: "48px", height: "48px" }}
                          src={fileUrl}
                        />
                      )}
                      <Column>
                        <DocumentTitle>{file?.name}</DocumentTitle>
                        <UploadText type={error ? "error" : "success"}>
                          {error ? error : "Completed"}
                        </UploadText>
                      </Column>
                    </Row>
                    {removeable ? (
                      <TrashIcon
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setFile();
                          setFileUrl();
                        }}
                      />
                    ) : (
                      <div></div>
                    )}
                  </Document>
                );
              } else {
                return <></>;
              }
            }}
            onChange={onChange}
            onPreview={onPreview}
          >
            {!file ? (
              <>
                <CloudIcon />
                <Title>Drag & Drop or Browse Files</Title>
                <OrText>OR</OrText>
                <Button variant="tertiary" size="big">
                  Browse File
                </Button>
                <Subtitle>Max file size 5 Mb</Subtitle>
              </>
            ) : (
              <DragTtitle>Drag & Drop or Browse Files</DragTtitle>
            )}
          </BaseDragger>
        </CustomModal>
      )}
    </>
  );
};

const Span = styled.span`
  color: ${(props) => (props.isOptional ? "#000000" : "#ed1c24")};
  margin-left: 1px;
  font-weight: ${(props) => (props.isOptional ? "lighter" : undefined)};
`;

const TextPhoto = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  color: #aaaaaa;
`;

const ImagePhoto = styled.img`
  width: ${(p) => p.sizeImagePhoto};
  height: ${(p) => p.sizeImagePhoto};
  border-radius: 8px;
  background: #ffffff;
`;

const Label = styled.div`
  font-weight: bold;
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
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  width: 100%;
`;

const Document = styled.div`
  background: #ffffff;
  border: 1px dashed #aaaaaa;
  box-sizing: border-box;
  border-radius: 10px;
  padding: 16px 12px;
  display: flex;
  gap: 6px;
  justify-content: space-between;
  align-items: center;
`;

const DragTtitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
  text-align: center;
  color: #eb008b;
`;

const Title = styled.div`
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  color: #888888;
`;

const OrText = styled.div`
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  color: #888888;
  margin-top: 12px;
  margin-bottom: 12px;
`;

const Subtitle = styled.div`
  font-weight: normal;
  font-size: 14px;
  line-height: 24px;
  color: #ed1c24;
  margin-top: 8px;
`;

const UploadText = styled.div`
  font-family: "Nunito Sans";
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 24px;
  color: ${(p) => (p.type === "success" ? "#2BBECB" : "#ED1C24")};
`;

const BaseDragger = styled(Dragger)``;

const BaseModal = styled(ModalAntd)`
  .ant-upload.ant-upload-drag {
    background: white;
    border: 1px dashed ${(p) => (p.hasFiles ? "#EB008B" : "#AAAAAA")};
    width: 520px;
    height: ${(p) => (p.hasFiles ? "80px" : "360px")};
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
    background: #ffffff;
    border-radius: 16px;
    width: 570px;
    height: max-content;
  }

  .ant-modal-header {
    border-radius: 16px;
    border: none;
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
`;

const CustomModal = styled(BaseModal)``;

FileUploaderAllFiles.propTypes = {
  onSubmit: PropTypes.func,
  label: PropTypes.string,
  required: PropTypes.bool,
  defaultFile: PropTypes.string,
  disabled: PropTypes.bool,
  withCrop: PropTypes.bool,
  removeable: PropTypes.bool,
};
