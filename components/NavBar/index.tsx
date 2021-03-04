import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Button from '../Button';
import {
  Background,
  Nav,
  HamburgerContainer,
  ImageContainer,
  Section,
  NavLink,
  GradientBackground,
} from './NavBar.styled';
import { useScrollLock } from '../../hooks';

const routes = [
  {
    name: 'Marketplace',
    path: '/',
  },
  {
    name: 'Collection',
    path: '/collection',
  },
];

const NavBar = (): JSX.Element => {
  const router = useRouter();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  useScrollLock(isMobileNavOpen);

  const toggleMobileNav = () => setIsMobileNavOpen(!isMobileNavOpen);

  const closeMobileNav = () => {
    if (isMobileNavOpen) setIsMobileNavOpen(false);
  };

  const login = () => {
    closeMobileNav();
    console.log('connect wallet');
  };

  return (
    <Background>
      <Nav>
        <HamburgerContainer onClick={toggleMobileNav}>
          <Image
            priority
            layout="fixed"
            width={24}
            height={24}
            src={isMobileNavOpen ? '/icons-close.svg' : '/icons-small-menu.svg'}
          />
        </HamburgerContainer>
        <ImageContainer>
          <Image
            priority
            layout="fixed"
            width={143}
            height={32}
            src="/logo@3x.png"
          />
        </ImageContainer>
        <Section isMobileNavOpen={isMobileNavOpen}>
          {routes.map(({ name, path }) => (
            <Link href={path} passHref key={name}>
              <NavLink
                isActive={router.pathname === path}
                onClick={closeMobileNav}>
                {name}
              </NavLink>
            </Link>
          ))}
          <Button onClick={login}>Connect Wallet</Button>
          <GradientBackground onClick={closeMobileNav} />
        </Section>
      </Nav>
    </Background>
  );
};

export default NavBar;
