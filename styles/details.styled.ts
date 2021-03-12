import styled from 'styled-components';

type OptionProps = {
  showDropdown: boolean;
};

type ScrollProps = {
  hasScrollbar: boolean;
};

type BothProps = {
  showDropdown: boolean;
  hasScrollbar: boolean;
};

export const Serial = styled.p`
  line-height: 24px;
  margin-bottom: 8px;
  font-family: GilroyMedium;
`;

export const Divider = styled.div`
  margin: 12px 0 24px 0;
  border-bottom: 1px solid #e8ecfd;
`;

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
  margin-bottom: 16px;
  font-family: GilroyMedium;
`;

export const Input = styled.input`
  margin: 4px 0 24px;
  padding: 8px 16px;
  color: #aab2d5;
  border: 1px solid #aab2d5;
  border-radius: 4px;
  line-height: 24px;
  width: 100%;

  ::-webkit-input-placeholder {
    color: #aab2d5;
  }
`;

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const DropdownMenu = styled.ul<OptionProps>`
  margin: 4px 0 0px;
  padding: 0 16px;
  color: #aab2d5;
  border: 1px solid #aab2d5;
  border-radius: 4px;
  cursor: pointer;
  line-height: 24px;
  border-bottom: ${({ showDropdown }) =>
    showDropdown ? 'none' : '1px solid #aab2d5'};
  border-bottom-right-radius: ${({ showDropdown }) =>
    showDropdown ? '0px' : '4px'};
  border-bottom-left-radius: ${({ showDropdown }) =>
    showDropdown ? '0px' : '4px'};
  position: relative;
`;

export const Option = styled.li<OptionProps>`
  color: #aab2d5;
  height: 40px;
  min-width: 168px;
  font-size: 14px;
  justify-content: flex-start;
  align-items: center;
  display: ${({ showDropdown }) => (showDropdown ? 'flex' : 'none')};
  font-family: GilroyMedium;
`;

export const OptionsContainer = styled.section<BothProps>`
  background-color: #ffffff;
  position: absolute;
  right: -1px;
  z-index: 10;
  width: calc(100% + 2px);
  border: 1px solid #aab2d5;
  border-radius: 4px;
  display: ${({ showDropdown }) => (showDropdown ? 'unset' : 'none')};
  padding: 0 16px;
  border-top: ${({ showDropdown }) =>
    showDropdown ? 'none' : '1px solid #aab2d5'};
  border-top-right-radius: ${({ showDropdown }) =>
    showDropdown ? '0px' : '4px'};
  border-top-left-radius: ${({ showDropdown }) =>
    showDropdown ? '0px' : '4px'};

  ${({ hasScrollbar }) =>
    hasScrollbar &&
    `
    overflow-y: scroll;
    max-height: 126px;

    ::-webkit-scrollbar {
      -webkit-appearance: none;
      width: 4px;
    }
    ::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background-color: #e8ecfd;
      -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, .5);
    }
  `}
`;

export const CurrentOption = styled(Option)<ScrollProps>`
  display: flex;
  justify-content: space-between;
  border: none;
  min-width: ${({ hasScrollbar }) => (hasScrollbar ? 172 : 168)}px;
`;
