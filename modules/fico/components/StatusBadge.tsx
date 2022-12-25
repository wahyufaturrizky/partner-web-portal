/* eslint-disable no-use-before-define */
import { cx } from '@emotion/css';
import styled, { ThemeProvider } from 'styled-components';
import { TEXTSTYLES } from 'styles/TEXTSTYLES';
import { baseTheme } from 'theme/baseTheme';
import { STATUS_WORD } from 'utils/utils';

interface IStatusBadge {
  variant?: string,
  fontSize?: string
}

export function StatusBadge({
  variant, value, fontSize = 'headingRegular', ...props
}) {
  return (
    <ThemeProvider theme={baseTheme}>
      <div className="w-full text-center lg:max-w-[200px]" style={{ display: 'flex' }}>
        <StatusBadgeBase className={cx('w-full uppercase !font-bold', props.className)} variant={variant} fontSize={fontSize}>
          {STATUS_WORD[value] ?? value}
        </StatusBadgeBase>
      </div>
    </ThemeProvider>
  );
}

const StatusBadgeBase = styled.div<IStatusBadge>`
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
