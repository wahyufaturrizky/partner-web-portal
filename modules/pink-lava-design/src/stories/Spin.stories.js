import React from "react";

import { Spin as SpinComponent } from "../components/Spin";

export default {
  title: "Pink Lava/Spin",
  component: SpinComponent,
};

const Template = (args) => <SpinComponent {...args} />;

export const Spin = Template.bind({});
