import React from "react";

import { Dropdown as DropdownComponent } from "../components/Dropdown";

export default {
  title: "Pink Lava/Dropdown",
  component: DropdownComponent,
};

const menus = [
  { id: 1, value: "Hohsoi" },
  { id: 2, value: "Boboi" },
];

const handleChange = (value) => console.log("value", value);

const Template = (args) => (
  <DropdownComponent
    {...args}
    items={menus}
    handleChange={handleChange}
    checked={true}
    defaultValue={"AA"}
  />
);

export const Dropdown = Template.bind({});
