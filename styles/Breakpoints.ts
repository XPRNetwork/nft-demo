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

export const breakpoint = Object.keys(breakpoints).reduce(
  (accumulator, label) => {
    accumulator[label] = (...args: Array<string[]>) => {
      return css`
        @media (max-width: ${breakpoints[label]}) {
          ${css({}, ...args)};
        }
      `;
    };
    return accumulator;
  },
  {
    smallMobile: undefined,
    mobile: undefined,
    tablet: undefined,
    laptop: undefined,
  }
);

// How to use
// export const ExampleComponent = styled.div`
//   background-color: lime;

//   ${breakpoint.mobile`
//     background-color: red;
//   `}
// `;
