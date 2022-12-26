import React from 'react';

import { AccordionCheckbox as AccordionCheckboxComponent } from '../components/AccordionCheckbox';

export default {
  title: 'Pink Lava/Accordion',
  component: AccordionCheckboxComponent,
};

const Template = (args) => (
  <AccordionCheckboxComponent 
    id={1}
    name={"Sales Quotetaion"}
    lists={[
        {id: 43, value: 'Create Sales Quotation'},
        {id: 44, value: 'Edit Sales Quotation'},
        {id: 45, value: 'Delete Sales Quotation'},
        {id: 46, value: 'Update Sales Quotation'},
        {id: 47, value: 'Read Sales Quotation'}
    ]}
  />
);

export const AccordionCheckbox = Template.bind({});