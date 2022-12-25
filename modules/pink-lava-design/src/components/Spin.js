import { Spin as SpinAntd } from "antd";
import PropTypes from "prop-types";
import React from "react";

export const Spin = ({ tip }) => {
  return <SpinAntd tip={tip} />;
};

Spin.propTypes = {
  tip: PropTypes.string,
};
