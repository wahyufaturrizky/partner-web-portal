import { Menu, Dropdown, message } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { ReactComponent as OverflowMenuIcon } from '../assets/overflow-menu.svg'

export const OverflowMenu = () => {
  
  const onClick = ({ key }) => {
    message.info(`Click on item ${key}`);
  };

  const menu = (
    <BaseMenu onClick={onClick}>
      <MenuItem key="1">Start Loading</MenuItem>
      <MenuItem key="2">Hold</MenuItem>
      <MenuItem key="3">Delete</MenuItem>
    </BaseMenu>
  );
      
  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <OverflowMenuIcon style={{ cursor: 'pointer' }}/>
    </Dropdown>
  )
}

const BaseMenu = styled(Menu)`
 && {
  background: #FFFFFF;
  padding: 16px;
  box-shadow: 0px 4px 16px rgba(170, 170, 170, 0.15);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 12px;
 }
`

const MenuItem = styled(Menu.Item)`
  && {
    padding: 0px;
    margin: 0px;
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 19px;
    color: #000000;
  }

  :hover {
    background-color: transparent !important;
  }
`