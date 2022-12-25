import React, { useState } from 'react';
import { Button } from '../components/Button';

import {FileUploaderExcel as Component} from '../components/FileUploaderExcel';

export default {
  title: 'Pink Lava/File Uploader',
  component: Component,
};

const Template = (args) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button variant={'primary'} size={'big'} onClick={() => setVisible(!visible)}>Toggle Upload Modal</Button>
      <Component visible={visible} setVisible={setVisible} {...args} />
    </>
  )
};

export const FileUploaderExcel = Template.bind({});