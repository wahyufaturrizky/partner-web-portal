/* eslint-disable no-use-before-define */
import styled, { ThemeProvider } from 'styled-components';
import { baseTheme } from '../theme/baseTheme';

export function StatusPill({ variant, value }) {
  return (
    <ThemeProvider theme={baseTheme}>
      <div style={{ display: 'flex' }}>
        <StatusPillBase variant={variant}>
          {value}
        </StatusPillBase>
      </div>
    </ThemeProvider>
  );
}

const StatusPillBase = styled.div`
  padding: 5px 15px;
  font-weight: 700;
  border-radius: 4px;

  ${({ theme, variant }) => {
    let backgroundColor = '';
    let color = '';

    if (variant === 'blue') { backgroundColor = `${theme.blue.lighter}`; color = `${theme.blue.regular}`; }
    if (variant === 'green') { backgroundColor = `${theme.green.lightest}`; color = `${theme.green.darker}`; }
    if (variant === 'red') { backgroundColor = `${theme.red.regular}`; color = '#fff'; }
    if (variant === 'grey') { backgroundColor = `${theme.grey.lightest}`; color = `${theme.grey.darker}`; }
    if (variant === 'pink') { backgroundColor = `${theme.pink.lightest}`; color = `${theme.pink.regular}`; }
    if (variant === 'cheese') { backgroundColor = `${theme.cheese.lightest}`; color = `${theme.cheese.regular}`; }

    return `background-color: ${backgroundColor}; color: ${color};`;
  }}
`;
