/* eslint-disable no-use-before-define */
import { Divider as DividerAntd, DividerProps } from 'antd';
import styled, { ThemeProvider } from 'styled-components';
import { baseTheme } from 'theme/baseTheme';

interface IDivider extends DividerProps {
  borderColor?: string;
  borderWidth?: string | number;
  margin?: string;
}

export function Divider({
  borderColor, borderWidth, margin, ...props
}: IDivider) {
  return (
    <ThemeProvider theme={baseTheme}>
      <DividerBase borderColor={borderColor} margin={margin} borderWidth={borderWidth} {...props} />
    </ThemeProvider>
  );
}

const DividerBase = styled(DividerAntd)<{borderColor, borderWidth, margin}>`
  && {
    border-color: ${({ borderColor }) => borderColor ?? 'rgba(0, 0, 0, 0.2)'};
    border-width: ${({ borderWidth }) => borderWidth ?? '1px 0px 0px'};
    margin: ${({ margin }) => margin ?? '20px 0'} !important;
  }
`;
