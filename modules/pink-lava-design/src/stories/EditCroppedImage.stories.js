import React, { useState } from 'react';

import { EditCroppedImage as Component } from '../components/EditCroppedImage';

export default {
    title: 'Pink Lava/Edit Image',
    component: Component,
};

const Template = (args) => {
    const [visible, setVisible] = useState(false);

    return (
        <>
            <Component {...args} />
        </>
    );
};

export const EditCroppedImage = Template.bind({});
