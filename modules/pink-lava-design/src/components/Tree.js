import { Tree as TreeAntd } from "antd";
import React from "react";
import styled from "styled-components";

export const Tree = ({
  defaultExpandedKeys,
  draggable,
  blockNode,
  showIcon,
  onDragEnter,
  onDrop,
  switcherIcon,
  treeData,
  checkable,
  onCheck,
  onSelect,
  ...props
}) => {
  return (
    <BaseTree
      defaultExpandedKeys={defaultExpandedKeys}
      draggable={draggable}
      blockNode={blockNode}
      showIcon={showIcon}
      onDragEnter={onDragEnter}
      onDrop={onDrop}
      switcherIcon={switcherIcon}
      treeData={treeData}
      checkable={checkable}
      onSelect={onSelect}
      onCheck={onCheck}
      {...props}
    />
  );
};

const BaseTree = styled(TreeAntd)`
  .ant-tree-draggable-icon {
    display: none;
  }
`;
