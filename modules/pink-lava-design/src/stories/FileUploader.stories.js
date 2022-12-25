import React, { useState } from 'react';
import { Button } from '../components/Button';

import {FileUploadModal as FileUploaderComponent} from '../components/FileUploadModal';

export default {
  title: 'Pink Lava/File Uploader',
  component: FileUploaderComponent,
};

const Template = (args) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button variant={'primary'} size={'big'} onClick={() => setVisible(!visible)}>Toggle Upload</Button>
      <FileUploaderComponent visible={visible} setVisible={setVisible} {...args} />
    </>
  )
};

export const FileUploader = Template.bind({});