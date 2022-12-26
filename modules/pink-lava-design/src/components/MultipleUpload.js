import React from "react";
import ImgCrop from "antd-img-crop";
import { PlusOutlined } from "@ant-design/icons";
import { Modal } from "./Modal";
import styled from "styled-components";
import { Upload } from "antd";
import { Row } from "./Row";
import { Text } from "./Text";
import { Col } from "./Col";
import { Spacer } from "./Spacer";

export const MultipleUpload = ({
  fileList,
  onCancelPreview,
  previewOpen,
  previewTitle,
  previewImageUrl,
  ...props
}) => {
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
          marginLeft: 8,
        }}
      >
        Upload
      </div>
    </div>
  );
  return (
    <>
      <Row gap="20px" noWrap>
        <Col width={"350px"}>
          <Text variant={"headingRegular"}>Office/Store Photos</Text>
          <Spacer size={5} />
          <Text
            variant={"caption"}
            color={"grey.regular"}
            hoverColor={"grey.regular"}
          >
            The Photo format is .jpg, .jpeg, .png and minimum size of 300 x 300
            px (For optimal photo use a minimum size of 700 x 700 px).
          </Text>
          <Spacer size={10} />
          <Text
            variant={"caption"}
            color={"grey.regular"}
            hoverColor={"grey.regular"}
          >
            Select a store photo or drag and drop up to 5 photos at once here.
          </Text>
        </Col>
        <ImgCrop modalOk={"Save"} modalCancel={null} rotate>
          <Upload fileList={fileList} {...props}>
            {fileList.length >= 5 ? null : uploadButton}
          </Upload>
        </ImgCrop>
      </Row>

      {previewOpen && (
        <CustomModal
          visible={previewOpen}
          title={previewTitle}
          footer={null}
          onCancel={onCancelPreview}
          content={
            <img
              alt="example"
              style={{
                width: "100%",
              }}
              src={previewImageUrl}
            />
          }
        />
      )}
    </>
  );
};

const CustomModal = styled(Modal)`
  .ant-modal-body {
    padding: 20px;
  }
`;
