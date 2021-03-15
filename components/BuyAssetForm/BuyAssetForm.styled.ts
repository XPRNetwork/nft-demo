import styled from 'styled-components';

export const Error = styled.p`
  color: #b57579;
  font-size: 16px;
  line-height: 24px;
  font-family: GilroyMedium;
`;

export const DropdownMenu = styled.select`
  font-family: GilroyMedium;
  font-size: 16px;
  margin: 4px 0 0px;
  padding: 0 16px;
  width: 100%;
  height: 40px;
  color: #aab2d5;
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

  &:hover {
    border: 1px solid #aab2d5;
  }
`;
