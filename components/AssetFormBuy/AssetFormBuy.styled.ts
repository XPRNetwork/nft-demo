import styled from 'styled-components';

type DropdownMenuProps = {
  isLoading: boolean;
};

export const General = styled.p`
  color: #7578b5;
  font-size: 14px;
  line-height: 24px;
  font-family: GilroyMedium;
`;

export const Amount = styled.h3`
  font-size: 22px;
  font-weight: 600;
  line-height: 32px;
  margin-bottom: 28px;
  font-family: GilroyMedium;
`;

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const ErrorMessage = styled.p`
  color: #b57579;
  font-size: 16px;
  line-height: 24px;
  font-family: GilroyMedium;
`;

export const DropdownMenu = styled.select<DropdownMenuProps>`
  font-family: GilroyMedium;
  font-size: 16px;
  margin: 4px 0 12px;
  padding: 0 16px;
  width: 100%;
  height: 40px;
  color: #0e103c;
  border: 1px solid #e8ecfd;
  border-radius: 4px;
  cursor: pointer;
  line-height: 24px;
  position: relative;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: url('/down-arrow.svg');
  background-repeat: no-repeat;
  background-position: top 2px right 15px;

  ${({ isLoading }) =>
    isLoading &&
    `
    pointer-events: none;
  `}

  &:hover {
    border: 1px solid #aab2d5;
  }
`;
