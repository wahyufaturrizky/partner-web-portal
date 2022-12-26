import React, { useState } from 'react';
import { Button } from '../components/Button';

import {Modal as Component} from '../components/Modal';
import { Row } from '../components/Row';
import { Text } from '../components/Text';

export default {
  title: 'Pink Lava/Modal',
  component: Component,
};

const Template = (args) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button variant={'primary'} size={'big'} onClick={() => setVisible(!visible)}>Toggle Modal</Button>
      <Component
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        content={
          <Row justifyContent="center" padding="20px">
            <Text variant={'headingRegular'}>CONTENT</Text>
          </Row>
        }
        footer={
          <div style={{display: 'flex', marginBottom: "12px", marginRight: "12px", justifyContent: 'center', gap: '12px'}}>
            <Button size="big" variant="secondary" key="submit" type="primary" onClick={() => setVisible(false)}>
              Save
            </Button>,
            <Button variant="primary" size="big">
              Submit
            </Button>
          </div>
        }
        {...args}
      />
    </>
  )
};

export const Modal = Template.bind({});