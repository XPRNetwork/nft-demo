import React from 'react';
import { Container, NavLink } from './NavBar.styled';

const NavBar = (): JSX.Element => {
  return (
    <Container>
      <NavLink href={'/'}>MarketPlace </NavLink>
      <NavLink href={'/collection'}>Collection </NavLink>
      <NavLink href={'/details'}>Details </NavLink>
    </Container>
  );
};

export default NavBar;
