import { css } from 'styled-components';

interface MediaQueryProps {
  [key: string]: string;
}

const breakpoints: MediaQueryProps = {
  smallMobile: '400px',
  mobile: '600px',
  tablet: '920px',
  laptop: '1224px',
};

export const breakpoint = Object.keys(breakpoints).reduce((acc, label) => {
  acc[label] = (literals: TemplateStringsArray, ...placeholders: any[]) =>
    css`
      @media (max-width: ${breakpoints[label]}px) {
        ${css(literals, ...placeholders)};
      }
    `.join('');
  return acc;
}, {} as Record<keyof typeof breakpoints, (l: TemplateStringsArray, ...p: any[]) => string>);

// How to use
// export const ExampleComponent = styled.div`
//   background-color: lime;

//   ${breakpoint.mobile`
//     background-color: red;
//   `}
// `;
