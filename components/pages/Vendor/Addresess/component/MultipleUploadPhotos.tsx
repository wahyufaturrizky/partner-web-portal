import React, { useState } from "react";
import { MultipleUpload } from "pink-lava-ui";
import { Controller } from "react-hook-form";

const getBase64 = (file: any) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const uploadUrl = "https://mdm-portal.nabatisnack.co.id:3001/api/v1/vendor/file/upload";

const MultipleUploadPhotos = ({ index, control }: any) => {
  const token = localStorage.getItem("token");

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf("/") + 1));
  };

  return (
    <Controller
      control={control}
      name={`addresses.${index}.photo`}
      defaultValue={[]}
      render={({ field: { onChange, value }, formState: { errors } }) => (
        <MultipleUpload
          accept=".png,.jpg,.jpeg"
          listType="picture-card"
          name={"upload_file"}
          action={uploadUrl}
          headers={{
            Authorization: `Bearer ${token}`,
          }}
          fileList={value}
          onPreview={handlePreview}
          onCancelPreview={() => setPreviewOpen(false)}
          onChange={({ fileList: newFileList }: any) => {
            onChange(newFileList);
          }}
          previewOpen={previewOpen}
          previewTitle={previewTitle}
          previewImageUrl={previewImage}
        />
      )}
    />
  );
};

export default MultipleUploadPhotos;
