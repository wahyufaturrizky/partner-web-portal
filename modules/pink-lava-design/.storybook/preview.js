import 'antd/dist/antd.css';
import '../src/App.css';
import '../src/index.css';
import "@fontsource/nunito-sans";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  }
}

import { ThemeProvider } from 'styled-components';
import { baseTheme } from '../src/theme/baseTheme';

export const decorators = [
  (Story) => (
    <ThemeProvider theme={baseTheme}>
      <Story />
    </ThemeProvider>
  ),
];