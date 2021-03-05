import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Button from '../Button';
import {
  Background,
  Nav,
  AvatarContainer,
  HamburgerContainer,
  ImageContainer,
  Section,
  NavLink,
  GradientBackground,
  MobileOnlySection,
  DesktopOnlySection,
  PlaceholderAvatar,
} from './NavBar.styled';
import { useScrollLock } from '../../hooks';
import { useAuthContext } from '../Provider';

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
  const { currentUser, login, logout } = useAuthContext();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  useScrollLock(isMobileNavOpen);

  const toggleMobileNav = () => setIsMobileNavOpen(!isMobileNavOpen);

  const closeMobileNav = () => {
    if (isMobileNavOpen) setIsMobileNavOpen(false);
  };

  const connectWallet = () => {
    closeMobileNav();
    login();
  };

  const welcomeMessage = currentUser ? (
    <h1>
      Welcome, {currentUser.name.split(' ')[0]} ({currentUser.actor})
    </h1>
  ) : null;

  const currentUserAvatar = currentUser ? (
    <AvatarContainer>
      <Image
        priority
        layout="fixed"
        width={32}
        height={32}
        alt="chain account avatar"
        src={currentUser.avatar}
      />
    </AvatarContainer>
  ) : (
    <PlaceholderAvatar />
  );

  return (
    <Background>
      <Nav>
        <HamburgerContainer onClick={toggleMobileNav}>
          <Image
            priority
            layout="fixed"
            width={40}
            height={40}
            alt={isMobileNavOpen ? 'close' : 'open'}
            src={isMobileNavOpen ? '/icons-close.svg' : '/icons-small-menu.svg'}
          />
        </HamburgerContainer>
        <ImageContainer>
          <Image
            priority
            layout="fixed"
            width={143}
            height={32}
            alt="logo"
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
          <DesktopOnlySection>
            {welcomeMessage}
            {currentUserAvatar}
          </DesktopOnlySection>
          <Button onClick={currentUser ? logout : connectWallet}>
            {currentUser ? 'Log out' : 'Connect Wallet'}
          </Button>
          <GradientBackground onClick={closeMobileNav} />
        </Section>
        <MobileOnlySection>{currentUserAvatar}</MobileOnlySection>
      </Nav>
    </Background>
  );
};

export default NavBar;
