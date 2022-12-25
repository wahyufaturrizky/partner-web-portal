import "./App.css";
import "@fontsource/nunito-sans";
import styled, { createGlobalStyle } from "styled-components";
import { ThemeProvider } from "styled-components";

import { baseTheme } from "./theme/baseTheme";
import { Header, MenuLogout, DatePickerInput, DropdownMenuOptionCustome, Input } from "./components";
import { Button, Menu, Space } from "antd";

const GlobalStyle = createGlobalStyle`
  body {
     font-family: "Nunito Sans";
  }
`;

const itemsMenu = [{ label: "Config" }, { label: "Master Data Management" }];

function App() {
  const items = [
    { label: "item 1", key: "item-1" }, // remember to pass the key prop
    { label: "item 2", key: "item-2" }, // which is required
    {
      label: "sub menu",
      key: "submenu",
      children: [{ label: "item 3", key: "submenu-item-1" }],
    },
  ];

  return (
    <ThemeProvider theme={baseTheme}>
      <GlobalStyle />
      <Header
        mode="horizontal"
        onClick={() => {}}
        selectedKeys={["0"]}
        items={itemsMenu}
        withMenu
      >
        <DatePickerInput disabled={true} />
        <Menu items={items} />;
        <MenuLogout
          menu={
            <Menu>
              <Menu.Item>item 1</Menu.Item>
              <Menu.Item>item 2</Menu.Item>
              <Menu.SubMenu title="sub menu">
                <Menu.Item>item 3</Menu.Item>
              </Menu.SubMenu>
            </Menu>
          }
        >
          <RoundedbButton>
            <span>Button</span>
          </RoundedbButton>
        </MenuLogout>
      </Header>
      <Input />
      <DropdownMenuOptionCustome placeholder="testing" />
    </ThemeProvider>
  );
}

const RoundedbButton = styled.button`
  background: red;
  color: white;
  padding-bottom: 1rem;
`;

export default App;
