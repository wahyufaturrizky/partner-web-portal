import React from 'react'
import { Controller } from 'react-hook-form'
import { FileUploaderAllFiles } from 'pink-lava-ui'

export default function UploadImage({ control, handleUpload }: any) {
  return (
    <Controller
      control={control}
      name="company_logo"
      render={({ field: { onChange } }) => (
        <FileUploaderAllFiles
          label="Company Logo"
          onSubmit={(file: any) => {
            onChange(file)
            handleUpload(file)
          }}
          defaultFile="/placeholder-employee-photo.svg"
          withCrop
          sizeImagePhoto="125px"
          removeable
          textPhoto={[
            "Dimension Minimum 72 x 72, Optimal size 300 x 300",
            "File Size Max. 1MB",
          ]}
        />
      )}
    ></Controller>
  )
}