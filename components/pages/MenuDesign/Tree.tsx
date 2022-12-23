import React from "react";
import { DownOutlined } from "@ant-design/icons";
import { Tree } from "pink-lava-ui";

const TreeMenuDesign = ({ subModuleData, onCheck, onSelect, onDropMenu, treeIndex }: any) => {
  const onDragEnter = (info: any) => {
    // console.log(info);
  };

  const onDrop = (info: any) => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split("-");
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (data: any, key: any, callback: any) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }

        if (data[i].children) {
          loop(data[i].children, key, callback);
        }
      }
    };

    const data = [...subModuleData]; // Find dragObject

    let dragObj: any;
    loop(data, dragKey, (item: any, index: any, arr: any) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, (item: any) => {
        item.children = item.children || []; // where to insert 示例添加到头部，可以是随意位置

        item.children.unshift(dragObj);
      });
    } else if (
      (info.node.props.children || []).length > 0 && // Has children
      info.node.props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, (item: any) => {
        item.children = item.children || []; // where to insert 示例添加到头部，可以是随意位置

        item.children.unshift(dragObj); // in previous version, we use item.children.push(dragObj) to insert the
        // item to the tail of the children
      });
    } else {
      let ar: any = [];
      let i: any;
      loop(data, dropKey, (_item: any, index: any, arr: any) => {
        ar = arr;
        i = index;
      });

      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    }

    onDropMenu(data, treeIndex);
  };

  const onCheckTree = (checkedKeys: any, info: any) => {
    onCheck(checkedKeys, info);
  };

  const onSelectTree = (selectedKeys: any, info: any) => {
    onSelect(selectedKeys, info);
  };
  return (
    <Tree
      draggable
      blockNode
      onSelect={onSelectTree}
      onCheck={onCheckTree}
      showIcon
      onDrop={onDrop}
      onDragEnter={onDragEnter}
      switcherIcon={<DownOutlined />}
      checkable
      defaultExpandAll={true}
      treeData={subModuleData}
    />
  );
};

export default TreeMenuDesign;
