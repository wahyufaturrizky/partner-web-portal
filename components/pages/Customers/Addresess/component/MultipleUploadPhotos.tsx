import React, { useState } from "react";
import { MultipleUpload, Modal } from "pink-lava-ui";
import { Controller } from "react-hook-form";

const getBase64 = (file: any) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

let apiURL = process.env.NEXT_PUBLIC_API_BASE3;
const uploadUrl = `${apiURL}/vendor/file/upload`;

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
      name={`address.${index}.photo`}
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
          // previewTitle={<button>previewTitle</button>}
          previewImageUrl={previewImage}
        />
      )}
    />
  );
};

export default MultipleUploadPhotos;
