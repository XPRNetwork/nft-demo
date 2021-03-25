import styled, { keyframes } from 'styled-components';
import { FadeInImageContainer } from '../../styles/FadeInImageContainer.styled';

const placeHolderShimmer = keyframes`
  0% {
    background-position: -500px 0
  }
  100% {
    background-position: 500px 0
  }
`;

export const Container = styled.article`
  display: flex;
  flex-direction: column;
  width: 100%;
  cursor: pointer;

  :hover img {
    transition: 0.1s;
    transform: scale(1.1);
  }
`;

export const ImageContainer = styled(FadeInImageContainer)`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  backface-visibility: hidden;
  transform: translate3d(0, 0, 0);
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
  -webkit-transform: translate3d(0, 0, 0);
  -moz-transform: translate3d(0, 0, 0);
`;

export const Text = styled.span`
  font-family: GilroySemiBold;
  font-size: 18px;
  line-height: 24px;
  color: #0e103c;
  margin-top: 16px;
`;

export const SecondaryText = styled.span`
  font-family: GilroyMedium;
  font-size: 12px;
  line-height: 2;
  color: #7578b5;
`;

export const Price = styled(Text)`
  font-size: 14px;
  font-weight: 600;
  line-height: 1.71;
  margin-top: 6px;
`;

export const Tag = styled.div`
  font-family: GilroySemiBold;
  font-size: 12px;
  line-height: 24px;
  position: absolute;
  bottom: 0;
  margin: 10px;
  padding: 2px 12px;
  opacity: 0.6;
  border-radius: 4px;
  background-color: #0e103c;
  color: #ffffff;
`;

export const EmptyPrice = styled.div`
  margin: 15px 0 7px;
  height: 18px;
  width: 50%;
`;

export const ShimmerBlock = styled(EmptyPrice)`
  animation: ${placeHolderShimmer} 1s linear infinite;
  background: linear-gradient(to right, #eeeeee 8%, #e7e7e7 18%, #eeeeee 33%);
  background-size: 1000px 18px;
`;
