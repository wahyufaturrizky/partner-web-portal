import React, { useState } from 'react';

import {FileUploaderAllFiles as Component} from '../components/FileUploaderAllFiles';

export default {
  title: 'Pink Lava/File Uploader',
  component: Component,
};

const Template = (args) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Component {...args} />
    </>
  )
};

export const FileUploaderAllFiles = Template.bind({});