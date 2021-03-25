import React, { ReactNode, useState } from 'react';
import { Background, Header, Content } from './Tooltip.styled';

type Props = {
  children: ReactNode;
  content: string;
};

const Tooltip = ({ children, content }: Props): JSX.Element => {
  const [active, setActive] = useState(false);

  const showTip = () => {
    setActive(true);
  };

  const hideTip = () => {
    setActive(false);
  };

  return (
    <Background onMouseEnter={showTip} onMouseLeave={hideTip}>
      {children}
      {active && (
        <Content>
          <Header>Attention!</Header>
          {content}
        </Content>
      )}
    </Background>
  );
};

export default Tooltip;
