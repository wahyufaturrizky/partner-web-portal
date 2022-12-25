import { Image as ImageAntd } from "antd";
import PropTypes from "prop-types";
import React from "react";

export const Image = (props) => {
  return <ImageAntd {...props} />;
};

Image.propTypes = {
  tip: PropTypes.string,
};
