import { Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ReactComponent as DocumentIcon } from '../assets/document.svg';
import { ReactComponent as TrashIcon } from '../assets/trash.svg';
import { ReactComponent as ICCrop } from '../assets/img-crop.svg';
import { EditCroppedImage } from './EditCroppedImage';
import { Row } from './Row';

const { Dragger } = Upload;

export const FileUploaderAllFilesDragger = ({
    defaultFile,
    initialFile,
    withCrop,
    editCrop,
    removeable,
    onSubmit,
    inputHeight,
    inputBorderColor,
    defaultFileList,
    disabled,
}) => {
    const [file, setFile] = useState();
    const [error, setError] = useState();
    const [openCrop, setOpenCrop] = useState(false);
    const [fileUrl, setFileUrl] = useState(defaultFile);
    const [defaultFileListProps, setDefaultFileListProps] = useState(defaultFileList);

    const onChange = ({ fileList: newFileList }) => {
        setFileUrl(URL.createObjectURL(newFileList[0].originFileObj));
        setFile(newFileList[0]);
    };

    useEffect(() => {
        if (defaultFile) setFileUrl(defaultFile);
    }, [defaultFile]);

    useEffect(() => {
        if (defaultFileList) setDefaultFileListProps(defaultFileList);
    }, [defaultFileList]);

    useEffect(() => {
        if (initialFile) setFile(initialFile);
    }, [initialFile]);

    useEffect(() => {
        if (!error && file) {
            onSubmit(file.originFileObj);
        } else if (!error && !file && fileUrl) {
            onSubmit(fileUrl);
        } else {
            onSubmit();
        }
    }, [file, fileUrl]);

    const beforeUpload = (file) => {
        const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
        if (!withCrop) {
            acceptedImageTypes.push('application/pdf');
        }
        if (!acceptedImageTypes.includes(file.type)) {
            setError(`Failed, Uploaded files can't have ${file.type} extension`);
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
        maxCount: 1,
        defaultFileList: defaultFileListProps,
        disabled,
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
        <ImgCrop modalOk={'Save'} rotate>
            <BaseDragger
                style={{
                    borderColor: inputBorderColor ? inputBorderColor : 'auto',
                }}
                {...props}
                customRequest={({ file, onSuccess }) => {
                    setError('');
                    setTimeout(() => {
                        if (beforeUpload(file)) {
                            onSuccess('ok');
                        } else {
                            onSuccess('error');
                        }
                    }, 0);
                }}
                itemRender={(_, file, __) => {
                    if (fileUrl) {
                        return (
                            <Document>
                                <Row gap='12px' noWrap>
                                    {error || !fileUrl || !withCrop ? (
                                        <DocumentIcon />
                                    ) : (
                                        <img
                                            style={{ width: '48px', height: '48px' }}
                                            src={fileUrl}
                                        />
                                    )}
                                    <Column>
                                        <DocumentTitle>{file?.name}</DocumentTitle>
                                        <UploadText type={error ? 'error' : 'success'}>
                                            {error ? error : 'Completed'}
                                        </UploadText>
                                    </Column>
                                </Row>

                                <EditCroppedImage
                                    image={fileUrl}
                                    setFileUrl={setFileUrl}
                                    setFile={setFile}
                                    setOpenCrop={setOpenCrop}
                                    openCrop={openCrop}
                                    resetImg={file.originFileObj}
                                    resetFile={file}
                                />
                                {}
                                {editCrop && removeable ? (
                                    <EditAndDeleteContainer>
                                        <div
                                            onClick={() => setOpenCrop(true)}
                                            style={{ cursor: 'pointer' }}>
                                            <ICCrop />
                                        </div>
                                        <TrashIcon
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => {
                                                setFile();
                                                setFileUrl();
                                            }}
                                        />
                                    </EditAndDeleteContainer>
                                ) : removeable ? (
                                    <TrashIcon
                                        style={{ cursor: 'pointer' }}
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
                onPreview={onPreview}>
                <DragTtitle
                    style={{
                        height: inputHeight ? inputHeight : 'auto',
                        paddingTop: inputHeight ? '1.5rem' : '0',
                    }}>
                    Drag & Drop or Browse Files
                </DragTtitle>
            </BaseDragger>
        </ImgCrop>
    );
};

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
    height: ${(p) => (p.inputHeight ? p.inputHeight : 'auto')};
    padding-top: ${(p) => (p.inputHeight ? '1.5rem' : '0')};
    justify-self: center;
    align-self: center;
`;

const UploadText = styled.div`
    font-family: 'Nunito Sans';
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 24px;
    color: ${(p) => (p.type === 'success' ? '#2BBECB' : '#ED1C24')};
`;

const EditAndDeleteContainer = styled.div`
    display: flex;
    gap: 1rem;
`;

const BaseDragger = styled(Dragger)``;

FileUploaderAllFilesDragger.propTypes = {
    onSubmit: PropTypes.func,
    label: PropTypes.string,
    required: PropTypes.bool,
    inputHeight: PropTypes.string,
    inputBorderColor: PropTypes.string,
    editCrop: PropTypes.bool,
    defaultFile: PropTypes.string,
    initialFile: PropTypes.object,
    disabled: PropTypes.bool,
    withCrop: PropTypes.bool,
    removeable: PropTypes.bool,
};
