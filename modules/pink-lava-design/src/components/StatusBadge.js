import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { TEXTSTYLES } from '../const/TEXTSTYLES';
import { baseTheme } from '../theme/baseTheme';


export function StatusBadge({
  variant, value, fontSize = 'headingRegular', ...props
}) {
  return (
    <ThemeProvider theme={baseTheme}>
      <div style={{ display: 'flex', width: '100%', textAlign: 'center', maxWidth: '200px' }}>
        <StatusBadgeBase className={props.className} style={{ width: '100%', textTransform: 'uppercase', fontWeight: 'bold' }} variant={variant} fontSize={fontSize}>
          {value}
        </StatusBadgeBase>
      </div>
    </ThemeProvider>
  );
}

const StatusBadgeBase = styled.div`
  padding: 10px 40px;
  border-radius: 8px;
  

  ${({ theme, variant }) => {
    let backgroundColor = '';
    let color = '';

    if (variant === 'blue') { backgroundColor = `${theme.blue.lighter}`; color = `${theme.blue.regular}`; }
    if (variant === 'green') { backgroundColor = `${theme.green.lightest}`; color = `${theme.green.darker}`; }
    if (variant === 'red') { backgroundColor = `${theme.red.regular}`; color = '#fff'; }
    if (variant === 'grey') { backgroundColor = `${theme.grey.lightest}`; color = `${theme.grey.darker}`; }
    if (variant === 'pink') { backgroundColor = `${theme.pink.lightest}`; color = `${theme.pink.regular}`; }
    if (variant === 'cheese') { backgroundColor = `${theme.cheese.lightest}`; color = `${theme.cheese.regular}`; }

    return `background-color: ${backgroundColor}; color: ${color}; border: 2px solid ${color};`;
  }}

  ${({ fontSize }) => TEXTSTYLES[fontSize]};
`;
