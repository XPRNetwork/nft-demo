import styled from 'styled-components';
import Image from 'next/image';

type ArrowProps = {
  active: boolean;
  layout: string;
};

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 64px 100px 0px;
`;

export const Row = styled.div`
  width: 100%;
  display: flex;
`;

export const Column = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 0 64px 0 56px;
`;

export const ImageContainer = styled.div`
  width: 100%;
`;

export const Title = styled.h1`
  font-size: 22px;
  line-height: 32px;
  font-family: GilroySemiBold;
`;

export const Description = styled.p`
  color: #7578b5;
  max-width: 880px;
  font-family: GilroyMedium;
`;

export const Name = styled.h1`
  font-size: 40px;
  line-height: 48px;
  font-family: GilroySemiBold;
`;

export const Series = styled.p`
  font-size: 22px;
  color: #7578b5;
  line-height: 32px;
  margin-bottom: 16px;
  font-family: GilroyMedium;
`;

export const ContentRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 48px 0 16px;
`;

export const Arrow = styled(Image)<ArrowProps>`
  transform: ${({ active }) => (active ? 'rotate(0deg)' : 'rotate(-180deg)')};
  -webkit-transform: ${({ active }) =>
    active ? 'rotate(0deg)' : 'rotate(-180deg)'};
  cursor: pointer;
`;
