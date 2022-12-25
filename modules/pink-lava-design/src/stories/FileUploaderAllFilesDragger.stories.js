import React from "react";

import { FileUploaderAllFilesDragger as Component } from "../components/FileUploaderAllFilesDragger";

export default {
  title: "Pink Lava/File Uploader",
  component: Component,
};

const Template = (args) => {
  return (
    <>
      <Component {...args} />
    </>
  );
};

export const FileUploaderAllFilesDragger = Template.bind({});
